import 'package:flutter/foundation.dart';
import '../api/cakna_api.dart';

/// Signed-in user identity + auth actions. Sync is handled separately by
/// SyncService, which reacts to sign-in/out.
class Auth extends ChangeNotifier {
  final CaknaApi api;
  Auth(this.api);

  String? _email;
  String? _id;
  bool _busy = false;

  String? get email => _email;
  String? get id => _id;
  bool get signedIn => _id != null;
  bool get busy => _busy;

  /// Validate any stored session on startup.
  Future<void> init() async {
    try {
      final me = await api.me();
      if (me != null) {
        _email = me['email'] as String?;
        _id = me['id'] as String?;
        notifyListeners();
      }
    } catch (_) {/* offline — stay signed out until reachable */}
  }

  Future<void> register(String email, String password) => _run(() => api.register(email, password));
  Future<void> login(String email, String password) => _run(() => api.login(email, password));
  Future<void> ssoLogin() => _run(() => api.loginWithSso());

  Future<void> _run(Future<Map<String, dynamic>> Function() action) async {
    _busy = true;
    notifyListeners();
    try {
      final res = await action();
      _email = res['email'] as String?;
      _id = res['id'] as String?;
    } finally {
      _busy = false;
      notifyListeners();
    }
  }

  Future<void> logout() async {
    await api.logout();
    _email = null;
    _id = null;
    notifyListeners();
  }

  /// Clear local identity without a network call (e.g. after a 401 — the
  /// server session already expired).
  void forceSignOut() {
    if (_id == null && _email == null) return;
    _email = null;
    _id = null;
    notifyListeners();
  }

  /// Permanently delete the account on the server, then sign out. On failure
  /// the identity is kept so the caller can show an error and retry.
  Future<void> deleteAccount() async {
    _busy = true;
    notifyListeners();
    try {
      await api.deleteAccount();
      _email = null;
      _id = null;
    } finally {
      _busy = false;
      notifyListeners();
    }
  }
}
