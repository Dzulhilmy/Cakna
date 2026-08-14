import 'dart:convert';
import 'package:flutter_web_auth_2/flutter_web_auth_2.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiException implements Exception {
  final int status;
  final String message;
  ApiException(this.status, this.message);
  @override
  String toString() => message;
}

/// Thin client for the Cakna Rust API (auth + KV sync). The `http` package
/// doesn't persist cookies, so we capture the `cakna_session` token from
/// Set-Cookie and replay it as a Cookie header (stored in prefs).
class CaknaApi {
  // Override for local dev with:
  //   --dart-define=CAKNA_API_BASE=http://10.0.2.2:8787/api   (Android emulator)
  //   --dart-define=CAKNA_API_BASE=http://localhost:8787/api  (iOS sim / desktop)
  static const base = String.fromEnvironment(
    'CAKNA_API_BASE',
    defaultValue: 'https://cakna.qcxis.com/api',
  );

  /// Converts a hub-server relative path (e.g. `/uploads/photo.jpg`) into a
  /// fully-qualified URL using the same origin as the API base. Absolute URLs
  /// are returned unchanged so callers don't need to pre-check.
  static String resolveHubUrl(String path) {
    if (path.isEmpty || !path.startsWith('/')) return path;
    final origin = base.replaceFirst(RegExp(r'/api$'), '');
    return '$origin$path';
  }
  final SharedPreferences _prefs;
  CaknaApi(this._prefs);

  String? get _token => _prefs.getString('session_token');
  set _tokenValue(String? v) {
    if (v == null) {
      _prefs.remove('session_token');
    } else {
      _prefs.setString('session_token', v);
    }
  }

  bool get hasSession => _token != null;

  Map<String, String> _headers({bool json = false}) => {
        if (json) 'Content-Type': 'application/json',
        if (_token != null) 'Cookie': 'cakna_session=$_token',
      };

  void _captureCookie(http.Response r) {
    final sc = r.headers['set-cookie'];
    if (sc == null) return;
    final m = RegExp(r'cakna_session=([^;]+)').firstMatch(sc);
    if (m != null) _tokenValue = m.group(1);
  }

  Never _fail(http.Response r) {
    String msg;
    try {
      msg = (jsonDecode(r.body)['error'] ?? r.body).toString();
    } catch (_) {
      msg = r.body;
    }
    throw ApiException(r.statusCode, msg);
  }

  // ---- auth ----
  Future<Map<String, dynamic>> _auth(String path, String email, String password) async {
    final r = await http.post(Uri.parse('$base/auth/$path'),
        headers: _headers(json: true), body: jsonEncode({'email': email, 'password': password}));
    if (r.statusCode != 200 && r.statusCode != 201) _fail(r);
    _captureCookie(r);
    return jsonDecode(r.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> register(String email, String password) =>
      _auth('register', email, password);
  Future<Map<String, dynamic>> login(String email, String password) =>
      _auth('login', email, password);

  /// Open the QCXIS OIDC consent page in a custom tab, receive the session
  /// token via a cakna:// deep link, persist it, and return the user info
  /// from /api/auth/me (same shape as [register]/[login]).
  Future<Map<String, dynamic>> loginWithSso() async {
    // SSO routes live at the web root, not under /api.
    final webRoot = base.replaceFirst(RegExp(r'/api$'), '');
    final startUrl = '$webRoot/auth/sso/start?mobile=1';
    final result = await FlutterWebAuth2.authenticate(
      url: startUrl,
      callbackUrlScheme: 'cakna',
    );
    final uri = Uri.parse(result);
    final token = uri.queryParameters['token'];
    if (token == null || token.isEmpty) {
      throw ApiException(0, 'SSO: tiada token dalam deep link');
    }
    _tokenValue = token;
    final user = await me();
    if (user == null) throw ApiException(401, 'SSO: sesi tidak sah');
    return user;
  }

  Future<Map<String, dynamic>?> me() async {
    if (_token == null) return null;
    final r = await http.get(Uri.parse('$base/auth/me'), headers: _headers());
    if (r.statusCode == 401) {
      _tokenValue = null;
      return null;
    }
    if (r.statusCode != 200) _fail(r);
    return jsonDecode(r.body) as Map<String, dynamic>;
  }

  Future<void> logout() async {
    if (_token != null) {
      try {
        await http.post(Uri.parse('$base/auth/logout'), headers: _headers());
      } catch (_) {/* ignore network errors on logout */}
    }
    _tokenValue = null;
  }

  /// Clears the session on 401 so the UI can reflect the expired state.
  Never _authFail(http.Response r) {
    if (r.statusCode == 401) _tokenValue = null;
    _fail(r);
  }

  // ---- sync ----
  /// GET all keys → { key: { value, updated_at } }
  Future<Map<String, dynamic>> getSync() async {
    final r = await http.get(Uri.parse('$base/sync'), headers: _headers());
    if (r.statusCode != 200) _authFail(r);
    return (jsonDecode(r.body)['keys'] as Map).cast<String, dynamic>();
  }

  /// PUT one key (raw JSON value).
  Future<void> putSync(String key, Object? value) async {
    final r = await http.put(Uri.parse('$base/sync/$key'),
        headers: _headers(json: true), body: jsonEncode(value));
    if (r.statusCode != 200) _authFail(r);
  }

  /// Permanently delete the signed-in account and all its data.
  Future<void> deleteAccount() async {
    final r = await http.delete(Uri.parse('$base/account'), headers: _headers());
    if (r.statusCode != 200 && r.statusCode != 204) _authFail(r);
    _tokenValue = null;
  }

  // ---- hub content (public, no auth) ----
  /// Returns the site_content JSON from the Hub admin dashboard, or {} on failure.
  Future<Map<String, dynamic>> hubSite() async {
    final r = await http.get(Uri.parse('$base/hub/site'));
    if (r.statusCode != 200) return {};
    return (jsonDecode(r.body) as Map<String, dynamic>?) ?? {};
  }

  /// Returns the programs list from the Hub, or [] on failure.
  Future<List<dynamic>> hubPrograms() async {
    final r = await http.get(Uri.parse('$base/hub/programs'));
    if (r.statusCode != 200) return [];
    return (jsonDecode(r.body) as List<dynamic>?) ?? [];
  }

  // ---- hub authenticated endpoints (require Cakna session) ----

  /// Submit a funding application. Throws [ApiException] on failure.
  Future<Map<String, dynamic>> hubSubmitFunding(Map<String, dynamic> data) async {
    final r = await http.post(
      Uri.parse('$base/hub/funding'),
      headers: _headers(json: true),
      body: jsonEncode(data),
    );
    if (r.statusCode != 200) {
      final body = jsonDecode(r.body) as Map<String, dynamic>? ?? {};
      throw ApiException(r.statusCode, body['error']?.toString() ?? 'Ralat hantar borang');
    }
    return (jsonDecode(r.body) as Map<String, dynamic>?) ?? {};
  }

  /// Returns the signed-in user's own funding applications, newest first, or [] on failure.
  Future<List<dynamic>> hubMyFunding() async {
    final r = await http.get(Uri.parse('$base/hub/funding/mine'), headers: _headers());
    if (r.statusCode != 200) return [];
    return (jsonDecode(r.body) as List<dynamic>?) ?? [];
  }

  /// Returns all hub notifications, or [] on failure / not signed in.
  Future<List<dynamic>> hubNotifications() async {
    final r = await http.get(Uri.parse('$base/hub/notifications'), headers: _headers());
    if (r.statusCode != 200) return [];
    return (jsonDecode(r.body) as List<dynamic>?) ?? [];
  }

  /// Returns hub events, or [] on failure / not signed in.
  Future<List<dynamic>> hubEvents() async {
    final r = await http.get(Uri.parse('$base/hub/events'), headers: _headers());
    if (r.statusCode != 200) return [];
    return (jsonDecode(r.body) as List<dynamic>?) ?? [];
  }

  /// Returns notices for the signed-in user, or [] on failure.
  Future<List<dynamic>> hubNotices() async {
    final r = await http.get(Uri.parse('$base/hub/notices'), headers: _headers());
    if (r.statusCode != 200) return [];
    return (jsonDecode(r.body) as List<dynamic>?) ?? [];
  }

  /// Mark a notice as read. Silently ignores failures.
  Future<void> hubMarkNoticeRead(String id) async {
    await http.post(Uri.parse('$base/hub/notices/$id/read'), headers: _headers());
  }

  // ---- halaqah ----

  Future<List<dynamic>> halaqahRooms() async {
    final r = await http.get(Uri.parse('$base/halaqah/rooms'), headers: _headers());
    if (r.statusCode != 200) _authFail(r);
    return (jsonDecode(r.body) as List<dynamic>?) ?? [];
  }

  Future<Map<String, dynamic>> halaqahJoin(String slug) async {
    final r = await http.post(
      Uri.parse('$base/halaqah/rooms/$slug/join'),
      headers: _headers(),
    );
    if (r.statusCode != 200) _authFail(r);
    return jsonDecode(r.body) as Map<String, dynamic>;
  }

  Future<void> halaqahSetSpeaker(String slug, String? userId) async {
    final r = await http.post(
      Uri.parse('$base/halaqah/rooms/$slug/speaker'),
      headers: _headers(json: true),
      body: jsonEncode({'user_id': userId}),
    );
    if (r.statusCode != 200) _authFail(r);
  }

  Future<void> halaqahSetPage(String slug, int page) async {
    final r = await http.post(
      Uri.parse('$base/halaqah/rooms/$slug/page'),
      headers: _headers(json: true),
      body: jsonEncode({'page': page}),
    );
    if (r.statusCode != 200) _authFail(r);
  }

  Future<void> halaqahSetShare(String slug, Map<String, dynamic>? share) async {
    final r = await http.post(
      Uri.parse('$base/halaqah/rooms/$slug/share'),
      headers: _headers(json: true),
      body: jsonEncode(share ?? {}),
    );
    if (r.statusCode != 200) _authFail(r);
  }

  Future<void> halaqahClose(String slug) async {
    final r = await http.post(
      Uri.parse('$base/halaqah/rooms/$slug/close'),
      headers: _headers(),
    );
    if (r.statusCode != 200) _authFail(r);
  }
}
