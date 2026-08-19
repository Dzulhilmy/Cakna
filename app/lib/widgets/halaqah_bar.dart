import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../screens/halaqah_room_screen.dart';
import '../state/halaqah_service.dart';
import '../theme.dart';
import 'halaqah_waveform.dart';

/// Persistent mini-bar shown above the bottom nav when connected to a halaqah
/// session. Tapping opens the full room screen; the X button leaves.
class HalaqahBar extends StatelessWidget {
  const HalaqahBar({super.key});

  @override
  Widget build(BuildContext context) {
    final svc = context.watch<HalaqahService>();
    if (!svc.connected) return const SizedBox.shrink();
    final session = svc.session!;

    final shareLabel = halaqahShareLabel(session.share, session.page);
    final speaker = session.speakerName;

    return GestureDetector(
      onTap: () => Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => const HalaqahRoomScreen(),
          fullscreenDialog: true,
        ),
      ),
      child: Container(
        decoration: const BoxDecoration(
          color: CaknaColors.oliveDeep,
          border: Border(
            top: BorderSide(color: CaknaColors.o600),
          ),
        ),
        child: SafeArea(
          top: false,
          bottom: false,
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
            child: Row(
              children: [
                HalaqahWaveform(active: session.hasActiveSpeaker, height: 18),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        speaker ?? 'Halaqah',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      if (shareLabel.isNotEmpty)
                        Text(
                          shareLabel,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(fontSize: 11.5, color: Colors.white70),
                        ),
                    ],
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 18, color: Colors.white70),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
                  onPressed: () => context.read<HalaqahService>().leave(),
                  tooltip: 'Keluar halaqah',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
