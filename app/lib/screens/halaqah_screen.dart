import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/auth.dart';
import '../state/halaqah_service.dart';
import '../theme.dart';
import 'auth_screen.dart';
import 'halaqah_room_screen.dart';

class HalaqahScreen extends StatefulWidget {
  const HalaqahScreen({super.key});

  @override
  State<HalaqahScreen> createState() => _HalaqahScreenState();
}

class _HalaqahScreenState extends State<HalaqahScreen> {
  List<HalaqahRoomInfo> _rooms = [];
  bool _loading = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      _rooms = await context.read<HalaqahService>().loadRooms();
    } catch (e) {
      _error = e.toString();
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _join(HalaqahRoomInfo room) async {
    final svc = context.read<HalaqahService>();
    try {
      await svc.join(room.slug, room.title);
      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => const HalaqahRoomScreen(),
          fullscreenDialog: true,
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Gagal menyertai: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<Auth>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Halaqah', style: TextStyle(fontFamily: 'Lora')),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: _load,
            tooltip: 'Muat semula',
          ),
        ],
      ),
      body: !auth.signedIn
          ? _SignInPrompt(onTap: () async {
              await Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const AuthScreen()));
              _load();
            })
          : _loading
              ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
              : _error != null
                  ? _ErrorView(error: _error!, onRetry: _load)
                  : _rooms.isEmpty
                      ? _EmptyView(onRefresh: _load)
                      : RefreshIndicator(
                          onRefresh: _load,
                          child: ListView.separated(
                            padding: const EdgeInsets.all(16),
                            itemCount: _rooms.length,
                            separatorBuilder: (context, index) => const SizedBox(height: 12),
                            itemBuilder: (context, i) =>
                                _RoomCard(room: _rooms[i], onJoin: () => _join(_rooms[i])),
                          ),
                        ),
    );
  }
}

// ── cards ─────────────────────────────────────────────────────────────────────

class _RoomCard extends StatelessWidget {
  final HalaqahRoomInfo room;
  final VoidCallback onJoin;
  const _RoomCard({required this.room, required this.onJoin});

  @override
  Widget build(BuildContext context) {
    final svc = context.watch<HalaqahService>();
    final isActive = svc.connected && svc.session?.slug == room.slug;

    return Card(
      child: InkWell(
        onTap: isActive
            ? () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const HalaqahRoomScreen(),
                    fullscreenDialog: true,
                  ),
                )
            : onJoin,
        borderRadius: BorderRadius.circular(18),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Live indicator dot
              Container(
                width: 8,
                height: 8,
                decoration: const BoxDecoration(
                  color: Color(0xFFEC407A),
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      room.title,
                      style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15),
                    ),
                    const SizedBox(height: 3),
                    Row(
                      children: [
                        const Icon(Icons.mic_none_rounded, size: 14, color: CaknaColors.inkSoft),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            room.speakerName ?? 'Tiada penceramah',
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 12.5, color: CaknaColors.inkSoft),
                          ),
                        ),
                      ],
                    ),
                    if (_shareLabel(room).isNotEmpty) ...[
                      const SizedBox(height: 2),
                      Text(
                        _shareLabel(room),
                        style: const TextStyle(fontSize: 11.5, color: CaknaColors.inkSoft),
                      ),
                    ],
                  ],
                ),
              ),
              const SizedBox(width: 12),
              isActive
                  ? Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: CaknaColors.olive.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Text(
                        'Aktif',
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: CaknaColors.olive,
                        ),
                      ),
                    )
                  : FilledButton.tonal(
                      onPressed: onJoin,
                      style: FilledButton.styleFrom(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        minimumSize: Size.zero,
                        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                      ),
                      child: const Text('Sertai', style: TextStyle(fontSize: 13)),
                    ),
            ],
          ),
        ),
      ),
    );
  }

  String _shareLabel(HalaqahRoomInfo room) {
    return halaqahShareLabel(room.share, room.page);
  }
}

// ── empty / error states ──────────────────────────────────────────────────────

class _EmptyView extends StatelessWidget {
  final VoidCallback onRefresh;
  const _EmptyView({required this.onRefresh});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.headphones_outlined, size: 56, color: CaknaColors.inkSoft),
          const SizedBox(height: 16),
          const Text(
            'Tiada halaqah aktif',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 6),
          const Text(
            'Halaqah baharu akan muncul di sini.',
            style: TextStyle(color: CaknaColors.inkSoft),
          ),
          const SizedBox(height: 24),
          FilledButton.tonal(
            onPressed: onRefresh,
            child: const Text('Muat semula'),
          ),
        ],
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  final String error;
  final VoidCallback onRetry;
  const _ErrorView({required this.error, required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.error_outline, size: 48, color: CaknaColors.inkSoft),
            const SizedBox(height: 16),
            Text(
              error,
              textAlign: TextAlign.center,
              style: const TextStyle(color: CaknaColors.inkSoft),
            ),
            const SizedBox(height: 16),
            FilledButton.tonal(onPressed: onRetry, child: const Text('Cuba lagi')),
          ],
        ),
      ),
    );
  }
}

class _SignInPrompt extends StatelessWidget {
  final VoidCallback onTap;
  const _SignInPrompt({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.lock_outline_rounded, size: 56, color: CaknaColors.inkSoft),
          const SizedBox(height: 16),
          const Text(
            'Log masuk diperlukan',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 6),
          const Text(
            'Log masuk untuk menyertai sesi halaqah.',
            style: TextStyle(color: CaknaColors.inkSoft),
          ),
          const SizedBox(height: 24),
          FilledButton(onPressed: onTap, child: const Text('Log Masuk')),
        ],
      ),
    );
  }
}
