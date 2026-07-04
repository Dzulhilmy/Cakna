import 'dart:async';
import 'package:flutter/foundation.dart';
import '../api/cakna_api.dart';
import 'app_state.dart';
import 'auth.dart';
import 'user_data.dart';

/// Cloud sync between the local stores and the Cakna API. On sign-in it pulls
/// the server state, union-merges it locally, then pushes the merged result.
/// Afterwards local changes are pushed (debounced). Signed-out = no network.
class SyncService extends ChangeNotifier {
  final CaknaApi api;
  final Auth auth;
  final UserData userData;
  final AppState appState;

  bool _syncing = false;
  DateTime? _lastSynced;
  bool _wasSignedIn = false;
  Timer? _debounce;

  bool get syncing => _syncing;
  DateTime? get lastSynced => _lastSynced;

  SyncService({
    required this.api,
    required this.auth,
    required this.userData,
    required this.appState,
  }) {
    auth.addListener(_onAuthChanged);
    userData.addListener(_onLocalChanged);
    appState.addListener(_onLocalChanged);
    _wasSignedIn = auth.signedIn;
    if (auth.signedIn) pullAndMerge();
  }

  void _onAuthChanged() {
    if (auth.signedIn && !_wasSignedIn) pullAndMerge();
    _wasSignedIn = auth.signedIn;
  }

  void _onLocalChanged() {
    if (!auth.signedIn) return;
    _debounce?.cancel();
    _debounce = Timer(const Duration(seconds: 2), pushAll);
  }

  /// Pull server → merge locally → push merged (called on sign-in).
  Future<void> pullAndMerge() async {
    if (_syncing || !auth.signedIn) return;
    _syncing = true;
    notifyListeners();
    try {
      final remote = await api.getSync();
      final userRemote = <String, dynamic>{};
      for (final k in ['bookmarks', 'notes', 'read', 'readlog']) {
        if (remote[k] is Map && remote[k]['value'] != null) {
          userRemote[k] = remote[k]['value'];
        }
      }
      await userData.mergeSync(userRemote);
      // settings: server wins if present
      if (remote['settings'] is Map && remote['settings']['value'] is Map) {
        appState.applySettings((remote['settings']['value'] as Map).cast<String, dynamic>());
      }
      await pushAll();
      _lastSynced = DateTime.now();
    } catch (_) {/* offline / transient — retry on next change */} finally {
      _syncing = false;
      notifyListeners();
    }
  }

  /// Push local snapshot to the server (per key).
  Future<void> pushAll() async {
    if (!auth.signedIn) return;
    try {
      final data = userData.exportSync();
      for (final e in data.entries) {
        await api.putSync(e.key, e.value);
      }
      await api.putSync('settings', appState.exportSettings());
      _lastSynced = DateTime.now();
      notifyListeners();
    } catch (_) {/* offline — will retry on next change */}
  }

  @override
  void dispose() {
    _debounce?.cancel();
    auth.removeListener(_onAuthChanged);
    userData.removeListener(_onLocalChanged);
    appState.removeListener(_onLocalChanged);
    super.dispose();
  }
}
