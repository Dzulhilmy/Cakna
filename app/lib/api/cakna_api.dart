import 'dart:convert';
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
  static const base = 'https://cakna.qcxis.com/api';
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

  // ---- sync ----
  /// GET all keys → { key: { value, updated_at } }
  Future<Map<String, dynamic>> getSync() async {
    final r = await http.get(Uri.parse('$base/sync'), headers: _headers());
    if (r.statusCode != 200) _fail(r);
    return (jsonDecode(r.body)['keys'] as Map).cast<String, dynamic>();
  }

  /// PUT one key (raw JSON value).
  Future<void> putSync(String key, Object? value) async {
    final r = await http.put(Uri.parse('$base/sync/$key'),
        headers: _headers(json: true), body: jsonEncode(value));
    if (r.statusCode != 200) _fail(r);
  }
}
