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

  /// Fired after a pull applied remote prayer settings that differ from the
  /// local ones — the caller reschedules azan + refreshes the widget.
  final void Function()? onPrayerSettingsChanged;

  bool _syncing = false;
  bool _pendingSync = false;
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
    this.onPrayerSettingsChanged,
  }) {
    auth.addListener(_onAuthChanged);
    userData.addListener(_onLocalChanged);
    appState.addListener(_onLocalChanged);
    _wasSignedIn = auth.signedIn;
    if (auth.signedIn) pullAndMerge();
  }

  /// Retry hook for the app-resume lifecycle: pushes a settings change that
  /// was made offline (the dirty flag stays armed until a confirmed push).
  void onAppResumed() {
    if (auth.signedIn && _settingsDirty) {
      _debounce?.cancel();
      _syncCycle();
    }
  }

  void _onAuthChanged() {
    if (auth.signedIn && !_wasSignedIn) pullAndMerge();
    _wasSignedIn = auth.signedIn;
  }

  bool _settingsDirty = false;

  void _onLocalChanged() {
    if (!auth.signedIn) return;
    // Ignore notifications caused by applying remote data during a pull —
    // reacting to those would schedule pull→apply→notify→pull… forever.
    if (appState.isApplyingRemote || userData.isMerging) return;
    _settingsDirty = true;
    _debounce?.cancel();
    _debounce = Timer(const Duration(seconds: 2), _syncCycle);
  }

  /// Full sync cycle for local changes: pull + merge (so another device's
  /// tombstones/edits are incorporated) THEN push — a bare push would clobber
  /// server state this device hasn't seen and resurrect deleted items. The
  /// element-set keys (bookmarks/notes/readlog) merge by timestamp in both
  /// directions, but settings scalars are server-wins — so when this cycle was
  /// triggered by a local change, skip applying the (stale) server settings or
  /// the change the user just made would be reverted before it is pushed.
  /// Coalesces concurrent requests via [_pendingSync].
  Future<void> _syncCycle() async {
    if (_syncing) {
      _pendingSync = true;
      return;
    }
    final localSettingsWin = _settingsDirty;
    _settingsDirty = false;
    final settingsPushed = await pullAndMerge(applyRemoteSettings: !localSettingsWin);
    // an offline/failed push must keep the change armed, or the next
    // server-wins pull would silently revert it
    if (localSettingsWin && !settingsPushed) _settingsDirty = true;
  }

  /// Pull server → merge locally → push merged (called on sign-in and from
  /// [_syncCycle]). Returns whether the `settings` key was pushed successfully.
  Future<bool> pullAndMerge({bool applyRemoteSettings = true}) async {
    if (_syncing || !auth.signedIn) return false;
    _syncing = true;
    notifyListeners();
    var settingsPushed = false;
    try {
      final remote = await api.getSync();
      final userRemote = <String, dynamic>{};
      for (final k in ['bookmarks', 'notes', 'read', 'readlog']) {
        if (remote[k] is Map && remote[k]['value'] != null) {
          userRemote[k] = remote[k]['value'];
        }
      }
      await userData.mergeSync(userRemote);
      if (remote['settings'] is Map && remote['settings']['value'] is Map) {
        final blob = (remote['settings']['value'] as Map).cast<String, dynamic>();
        if (applyRemoteSettings) {
          // full apply: server-wins scalars + element-set merges
          final prayerChanged = appState.applySettings(blob);
          if (prayerChanged) onPrayerSettingsChanged?.call();
        } else {
          // local scalars win this cycle, but the element-set halves
          // (collections tombstones, recentReads) are commutative and can
          // never revert a local edit — merge them so this device's push
          // doesn't clobber another device's adds/deletes
          appState.mergeSharedSets(blob);
        }
      }
      settingsPushed = await pushAll();
      _lastSynced = DateTime.now();
    } on ApiException catch (e) {
      if (e.status == 401) auth.forceSignOut();
    } catch (_) {/* offline / transient — retry on next change */} finally {
      _syncing = false;
      notifyListeners();
      // drain a request that arrived mid-pull — also covers direct
      // (sign-in / auth-change) pulls that _syncCycle didn't initiate
      if (_pendingSync) {
        _pendingSync = false;
        unawaited(_syncCycle());
      }
    }
    return settingsPushed;
  }

  /// Push local snapshot to the server (per key). A single failing key must not
  /// skip the rest (notably `settings`). Returns whether the `settings` key
  /// itself was accepted.
  Future<bool> pushAll() async {
    if (!auth.signedIn) return false;
    final data = {...userData.exportSync(), 'settings': appState.exportSettings()};
    var anyOk = false;
    var settingsOk = false;
    for (final e in data.entries) {
      try {
        await api.putSync(e.key, e.value);
        anyOk = true;
        if (e.key == 'settings') settingsOk = true;
      } on ApiException catch (ex) {
        if (ex.status == 401) {
          auth.forceSignOut();
          return settingsOk;
        }
        // other per-key error → skip this key, keep going
      } catch (_) {/* offline — will retry on next change */}
    }
    if (anyOk) {
      _lastSynced = DateTime.now();
      notifyListeners();
    }
    return settingsOk;
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
