import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:livekit_client/livekit_client.dart';
import '../api/cakna_api.dart';

// ── models ────────────────────────────────────────────────────────────────────

class HalaqahRoomInfo {
  final String id;
  final String slug;
  final String title;
  final String? speakerName;
  final int? page;
  final Map<String, dynamic>? share;

  const HalaqahRoomInfo({
    required this.id,
    required this.slug,
    required this.title,
    this.speakerName,
    this.page,
    this.share,
  });

  factory HalaqahRoomInfo.fromJson(Map<String, dynamic> j) => HalaqahRoomInfo(
        id: j['id'] as String,
        slug: j['slug'] as String,
        title: j['title'] as String,
        speakerName: j['speaker_name'] as String?,
        page: j['page'] as int?,
        share: j['share'] is Map
            ? Map<String, dynamic>.from(j['share'] as Map)
            : null,
      );
}

class HalaqahMember {
  final String identity;
  final String name;
  final bool hasAudio;
  final bool isMuted;
  final bool isSpeaking;

  const HalaqahMember({
    required this.identity,
    required this.name,
    required this.hasAudio,
    required this.isMuted,
    required this.isSpeaking,
  });
}

// ── session ───────────────────────────────────────────────────────────────────

class HalaqahSession {
  final String slug;
  final String title;
  final CaknaApi _api;
  final void Function() _notify;

  Room? _room;
  EventsListener<RoomEvent>? _listener;
  Timer? _heartbeatTimer;
  final _sessionStart = DateTime.now();

  String _role = 'member';
  String? _speakerId;
  String? _myIdentity;
  int? _page;
  Map<String, dynamic>? _share;
  bool _micEnabled = false;
  bool _connected = false;
  final _members = <HalaqahMember>[];

  bool get connected => _connected;
  bool get canPublish => _role == 'host' || _role == 'speaker';
  bool get isHost => _role == 'host';
  String get role => _role;
  String? get speakerId => _speakerId;
  String? get myIdentity => _myIdentity;
  int? get page => _page;
  Map<String, dynamic>? get share => _share;
  bool get micEnabled => _micEnabled;
  List<HalaqahMember> get members => List.unmodifiable(_members);

  String? get speakerName {
    if (_speakerId == null) return null;
    if (_speakerId == _myIdentity) return 'Kamu';
    return _room?.remoteParticipants[_speakerId]?.name ?? _speakerId;
  }

  bool get hasActiveSpeaker {
    final room = _room;
    if (room == null || !_connected) return false;
    final remoteSpeaking = room.remoteParticipants.values.any((p) => p.isSpeaking);
    return remoteSpeaking || (canPublish && _micEnabled);
  }

  HalaqahSession({
    required this.slug,
    required this.title,
    required CaknaApi api,
    required void Function() notify,
  })  : _api = api,
        _notify = notify;

  Future<void> connect(Map<String, dynamic> info) async {
    _role = info['role'] as String? ?? 'member';
    _speakerId = info['speaker_id'] as String?;
    _myIdentity = info['identity'] as String?;
    _page = info['page'] as int?;
    final shareRaw = info['share'];
    _share = shareRaw is Map ? Map<String, dynamic>.from(shareRaw) : null;

    _room = Room(
      roomOptions: const RoomOptions(adaptiveStream: true, dynacast: true),
    );
    _listener = _room!.createListener();

    _listener!
      ..on<RoomConnectedEvent>((_) {
        _connected = true;
        _syncMembers();
        _applyMeta(_room!.metadata);
        _notify();
      })
      ..on<RoomDisconnectedEvent>((_) {
        _connected = false;
        _notify();
      })
      ..on<RoomMetadataChangedEvent>((e) {
        _applyMeta(e.metadata);
        _notify();
      })
      ..on<ParticipantConnectedEvent>((_) {
        _syncMembers();
        _notify();
      })
      ..on<ParticipantDisconnectedEvent>((e) {
        _members.removeWhere((m) => m.identity == e.participant.identity);
        _notify();
      })
      ..on<TrackSubscribedEvent>((_) {
        _syncMembers();
        _notify();
      })
      ..on<TrackUnsubscribedEvent>((_) {
        _syncMembers();
        _notify();
      })
      ..on<TrackMutedEvent>((_) {
        _syncMembers();
        _notify();
      })
      ..on<TrackUnmutedEvent>((_) {
        _syncMembers();
        _notify();
      })
      ..on<ActiveSpeakersChangedEvent>((_) {
        _syncMembers();
        _notify();
      })
      ..on<ParticipantPermissionsUpdatedEvent>((e) {
        if (e.participant.identity == _myIdentity) {
          final canPub = e.permissions.canPublish;
          if (!canPub) _micEnabled = false;
          if (_role != 'host') _role = canPub ? 'speaker' : 'member';
          _notify();
        }
      });

    await _room!.connect(info['url'] as String, info['token'] as String);
    _startHeartbeat();
  }

  void _applyMeta(String? meta) {
    if (meta == null || meta.isEmpty) return;
    try {
      final m = jsonDecode(meta) as Map<String, dynamic>;
      _speakerId = m['speaker_id'] as String?;
      _page = m['page'] as int?;
      final s = m['share'];
      _share = s is Map ? Map<String, dynamic>.from(s) : null;
    } catch (_) {}
  }

  void _syncMembers() {
    final room = _room;
    if (room == null) return;
    _members.clear();
    for (final p in room.remoteParticipants.values) {
      final muted = p.audioTrackPublications.any((t) => t.muted);
      _members.add(HalaqahMember(
        identity: p.identity,
        name: p.name.isNotEmpty ? p.name : p.identity,
        hasAudio: p.hasAudio,
        isMuted: muted,
        isSpeaking: p.isSpeaking,
      ));
    }
  }

  void _startHeartbeat() {
    _heartbeatTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      final room = _room;
      if (room == null || !_connected) return;
      final payload = jsonEncode({
        't': 'hb',
        's': DateTime.now().difference(_sessionStart).inMilliseconds,
        'v': true,
        'au': room.remoteParticipants.values.any((p) => p.hasAudio),
      });
      room.localParticipant?.publishData(
        Uint8List.fromList(utf8.encode(payload)),
        reliable: false,
        topic: 'heartbeat',
      );
    });
  }

  Future<void> setMic(bool enabled) async {
    if (!canPublish) return;
    await _room?.localParticipant?.setMicrophoneEnabled(enabled);
    _micEnabled = enabled;
    _notify();
  }

  Future<void> setPage(int p) => _api.halaqahSetPage(slug, p);

  Future<void> setShare(Map<String, dynamic>? share) =>
      _api.halaqahSetShare(slug, share);

  Future<void> passFloor(String? userId) async {
    if (!isHost) return;
    await _api.halaqahSetSpeaker(slug, userId);
  }

  Future<void> close() async {
    if (!isHost) return;
    await _api.halaqahClose(slug);
  }

  Future<void> disconnect() async {
    _heartbeatTimer?.cancel();
    _heartbeatTimer = null;
    _listener?.dispose();
    _listener = null;
    await _room?.disconnect();
    _room?.dispose();
    _room = null;
    _connected = false;
  }
}

// ── service ───────────────────────────────────────────────────────────────────

class HalaqahService extends ChangeNotifier {
  final CaknaApi _api;
  HalaqahService(this._api);

  HalaqahSession? _session;
  bool _joining = false;
  String? _error;

  HalaqahSession? get session => _session;
  bool get connected => _session?.connected ?? false;
  bool get joining => _joining;
  String? get error => _error;

  Future<List<HalaqahRoomInfo>> loadRooms() async {
    final raw = await _api.halaqahRooms();
    return raw
        .whereType<Map>()
        .map((j) => HalaqahRoomInfo.fromJson(Map<String, dynamic>.from(j)))
        .toList();
  }

  Future<void> join(String slug, String title) async {
    if (_session?.slug == slug && _session?.connected == true) return;
    if (_joining) return;
    if (_session != null) await leave();
    _joining = true;
    _error = null;
    notifyListeners();
    try {
      final info = await _api.halaqahJoin(slug);
      final session = HalaqahSession(
        slug: slug,
        title: title,
        api: _api,
        notify: notifyListeners,
      );
      await session.connect(info);
      _session = session;
    } catch (e) {
      _error = e.toString();
      rethrow;
    } finally {
      _joining = false;
      notifyListeners();
    }
  }

  Future<void> leave() async {
    final s = _session;
    _session = null;
    notifyListeners();
    await s?.disconnect();
  }

  @override
  void dispose() {
    _session?.disconnect();
    super.dispose();
  }
}

// ── share label helper ────────────────────────────────────────────────────────

String halaqahShareLabel(Map<String, dynamic>? share, int? page) {
  if (share != null) {
    final kind = share['kind'] as String?;
    if (kind == 'page') {
      final p = share['page'] as int? ?? page;
      return p != null ? 'Halaman $p' : 'Mushaf';
    } else if (kind == 'mathurat') {
      final v = (share['version'] as String?) == 'kubra' ? 'Kubra' : 'Sughra';
      return 'Al-Ma\'thurat · $v';
    } else if (kind == 'route') {
      return share['label'] as String? ?? share['path'] as String? ?? 'Paparan';
    }
  }
  if (page != null) return 'Halaman $page';
  return '';
}
