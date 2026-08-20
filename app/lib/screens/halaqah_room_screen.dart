import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/halaqah_service.dart';
import '../theme.dart';
import '../widgets/halaqah_waveform.dart';
import 'reader_screen.dart';

/// Full halaqah room screen — entered from the room list or from the mini-bar.
/// Popping this screen does NOT disconnect; the mini-bar keeps the session alive.
class HalaqahRoomScreen extends StatelessWidget {
  const HalaqahRoomScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final svc = context.watch<HalaqahService>();
    final session = svc.session;

    if (session == null) {
      // Session was closed from outside (e.g. host ended room).
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (Navigator.canPop(context)) Navigator.pop(context);
      });
      return const Scaffold(body: Center(child: CircularProgressIndicator(strokeWidth: 2)));
    }

    return _RoomView(session: session, svc: svc);
  }
}

class _RoomView extends StatelessWidget {
  final HalaqahSession session;
  final HalaqahService svc;
  const _RoomView({required this.session, required this.svc});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      backgroundColor: dark ? CaknaColors.o900 : const Color(0xFF2B2B22),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white70),
        leading: IconButton(
          icon: const Icon(Icons.keyboard_arrow_down_rounded, size: 30),
          tooltip: 'Minimumkan',
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          session.title,
          style: const TextStyle(
            fontFamily: 'Lora',
            color: Colors.white,
            fontSize: 17,
          ),
        ),
        actions: [
          if (session.isHost)
            TextButton.icon(
              icon: const Icon(Icons.close, size: 18, color: Colors.white70),
              label: const Text('Tamat', style: TextStyle(color: Colors.white70, fontSize: 13)),
              onPressed: () => _confirmClose(context),
            ),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            const SizedBox(height: 12),
            // ── waveform + speaker ────────────────────────────────────────
            _SpeakerPanel(session: session),
            const SizedBox(height: 16),
            // ── shared content ───────────────────────────────────────────
            if (session.share != null || session.page != null)
              _SharedContentCard(session: session),
            const Spacer(),
            // ── participant list ─────────────────────────────────────────
            _ParticipantRow(session: session),
            const SizedBox(height: 24),
            // ── mic + host controls ──────────────────────────────────────
            _BottomControls(session: session, svc: svc),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Future<void> _confirmClose(BuildContext context) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Tamatkan halaqah?'),
        content: const Text('Ini akan memutuskan sambungan semua peserta.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Batal')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Tamat'),
          ),
        ],
      ),
    );
    if (ok == true) {
      await session.close();
      await svc.leave();
      if (context.mounted) Navigator.pop(context);
    }
  }
}

// ── speaker panel ─────────────────────────────────────────────────────────────

class _SpeakerPanel extends StatelessWidget {
  final HalaqahSession session;
  const _SpeakerPanel({required this.session});

  @override
  Widget build(BuildContext context) {
    final speaker = session.speakerName;
    final active = session.hasActiveSpeaker;

    return Column(
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            // Outer pulse ring
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              width: active ? 96 : 80,
              height: active ? 96 : 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: CaknaColors.o600.withValues(alpha: active ? 0.35 : 0.15),
              ),
            ),
            // Inner circle with waveform
            Container(
              width: 72,
              height: 72,
              decoration: const BoxDecoration(
                shape: BoxShape.circle,
                color: CaknaColors.olive,
              ),
              child: Center(
                child: HalaqahWaveform(active: active, height: 26, color: Colors.white),
              ),
            ),
          ],
        ),
        const SizedBox(height: 14),
        Text(
          speaker ?? (session.speakerId != null ? 'Penceramah' : 'Menunggu…'),
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          session.canPublish ? 'Penceramah aktif' : 'Mendengar',
          style: const TextStyle(fontSize: 12.5, color: Colors.white54),
        ),
      ],
    );
  }
}

// ── shared content card ───────────────────────────────────────────────────────

class _SharedContentCard extends StatelessWidget {
  final HalaqahSession session;
  const _SharedContentCard({required this.session});

  @override
  Widget build(BuildContext context) {
    final share = session.share;
    final page = session.page;
    final label = halaqahShareLabel(share, page);
    if (label.isEmpty) return const SizedBox.shrink();

    final kind = share?['kind'] as String?;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: Container(
        decoration: BoxDecoration(
          color: CaknaColors.o700,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: CaknaColors.o600),
        ),
        child: ListTile(
          leading: Icon(
            kind == 'page'
                ? Icons.menu_book_rounded
                : kind == 'mathurat'
                    ? Icons.auto_stories_outlined
                    : Icons.link_rounded,
            color: Colors.white70,
          ),
          title: Text(label, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500)),
          subtitle: const Text('Paparan semasa', style: TextStyle(color: Colors.white54, fontSize: 12)),
          trailing: kind == 'page' && page != null
              ? TextButton(
                  onPressed: () => _openPage(context, page),
                  child: const Text('Buka', style: TextStyle(color: CaknaColors.inkSoftDark)),
                )
              : null,
        ),
      ),
    );
  }

  void _openPage(BuildContext context, int page) {
    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: page)),
    );
  }
}

// ── participant row ───────────────────────────────────────────────────────────

class _ParticipantRow extends StatelessWidget {
  final HalaqahSession session;
  const _ParticipantRow({required this.session});

  @override
  Widget build(BuildContext context) {
    final members = session.members;
    if (members.isEmpty) return const SizedBox.shrink();

    return SizedBox(
      height: 72,
      child: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        scrollDirection: Axis.horizontal,
        itemCount: members.length,
        separatorBuilder: (context, index) => const SizedBox(width: 12),
        itemBuilder: (_, i) => _ParticipantChip(
          member: members[i],
          isSpeaker: members[i].identity == session.speakerId,
          isHost: session.isHost,
          onGiveFloor: session.isHost
              ? () => session.passFloor(members[i].identity)
              : null,
        ),
      ),
    );
  }
}

class _ParticipantChip extends StatelessWidget {
  final HalaqahMember member;
  final bool isSpeaker;
  final bool isHost;
  final VoidCallback? onGiveFloor;

  const _ParticipantChip({
    required this.member,
    required this.isSpeaker,
    required this.isHost,
    this.onGiveFloor,
  });

  @override
  Widget build(BuildContext context) {
    final initials = _initials(member.name);
    return GestureDetector(
      onLongPress: isHost ? () => _showHostMenu(context) : null,
      child: Column(
        children: [
          Stack(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: isSpeaker ? CaknaColors.olive : CaknaColors.o600,
                child: Text(
                  initials,
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 15,
                  ),
                ),
              ),
              if (member.isSpeaking)
                Positioned.fill(
                  child: Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: const Color(0xFFEC407A), width: 2.5),
                    ),
                  ),
                ),
              if (!member.hasAudio || member.isMuted)
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(2),
                    decoration: const BoxDecoration(
                      color: CaknaColors.o800,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.mic_off_rounded, size: 11, color: Colors.white70),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 5),
          SizedBox(
            width: 52,
            child: Text(
              member.name.split(' ').first,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 11, color: Colors.white70),
            ),
          ),
        ],
      ),
    );
  }

  String _initials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length == 1) return parts.first.substring(0, 1).toUpperCase();
    return (parts.first.substring(0, 1) + parts.last.substring(0, 1)).toUpperCase();
  }

  void _showHostMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      builder: (_) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(member.name, style: const TextStyle(fontWeight: FontWeight.w600)),
            ),
            ListTile(
              leading: const Icon(Icons.mic_rounded),
              title: const Text('Beri mikrofon'),
              onTap: () {
                Navigator.pop(context);
                onGiveFloor?.call();
              },
            ),
          ],
        ),
      ),
    );
  }
}

// ── bottom controls ───────────────────────────────────────────────────────────

class _BottomControls extends StatelessWidget {
  final HalaqahSession session;
  final HalaqahService svc;
  const _BottomControls({required this.session, required this.svc});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 32),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Leave button
          _ControlButton(
            icon: Icons.call_end_rounded,
            label: 'Keluar',
            color: Colors.redAccent,
            onTap: () async {
              await svc.leave();
              if (context.mounted) Navigator.pop(context);
            },
          ),
          if (session.canPublish) ...[
            const SizedBox(width: 28),
            // Mic button
            _ControlButton(
              icon: session.micEnabled ? Icons.mic_rounded : Icons.mic_off_rounded,
              label: session.micEnabled ? 'Mic On' : 'Mic Off',
              color: session.micEnabled ? CaknaColors.olive : CaknaColors.o600,
              onTap: () => session.setMic(!session.micEnabled),
            ),
          ],
          if (session.isHost && session.members.isNotEmpty) ...[
            const SizedBox(width: 28),
            // Revoke floor (pass back to none)
            _ControlButton(
              icon: Icons.mic_off_rounded,
              label: 'Tarik balik',
              color: CaknaColors.o600,
              onTap: () => session.passFloor(null),
            ),
          ],
        ],
      ),
    );
  }
}

class _ControlButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _ControlButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        GestureDetector(
          onTap: onTap,
          child: Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(color: color, shape: BoxShape.circle),
            child: Icon(icon, color: Colors.white, size: 28),
          ),
        ),
        const SizedBox(height: 6),
        Text(label, style: const TextStyle(fontSize: 11.5, color: Colors.white70)),
      ],
    );
  }
}
