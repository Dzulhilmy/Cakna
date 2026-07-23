import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/quran_repo.dart';
import '../data/reciters.dart';
import '../state/audio_service.dart';
import '../theme.dart';

/// Playback bar shown while audio is active (matches Tilawah's translation-mode
/// player): olive play button, surah + reciter, and Speed / Repeat controls.
class MiniPlayer extends StatefulWidget {
  const MiniPlayer({super.key});

  @override
  State<MiniPlayer> createState() => _MiniPlayerState();
}

class _MiniPlayerState extends State<MiniPlayer> {
  // cache the surah-name lookup per verse — the bar rebuilds on every word
  // tick during recitation and must not hit the DB each time
  Future<String>? _nameFuture;
  int _nameVid = -1;

  @override
  Widget build(BuildContext context) {
    final audio = context.watch<AudioService>();
    final vid = audio.playingVerseId;
    if (vid == null) return const SizedBox.shrink();
    final repo = context.read<QuranRepo>();
    if (_nameVid != vid) {
      _nameVid = vid;
      _nameFuture = _surahName(repo, vid);
    }
    final dark = Theme.of(context).brightness == Brightness.dark;

    return Material(
      color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
      child: Container(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: dark ? CaknaColors.borderDark : CaknaColors.border)),
        ),
        child: SafeArea(
          top: false,
          child: Padding(
            padding: const EdgeInsets.fromLTRB(14, 8, 8, 8),
            child: Row(
              children: [
                InkWell(
                  onTap: () => context.read<AudioService>().pauseResume(),
                  customBorder: const CircleBorder(),
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: const BoxDecoration(color: CaknaColors.olive, shape: BoxShape.circle),
                    child: Icon(audio.isPlaying ? Icons.pause : Icons.play_arrow,
                        color: Colors.white, size: 26),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: FutureBuilder(
                    future: _nameFuture,
                    builder: (context, snap) {
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(snap.data ?? 'Memuatkan…',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                          const SizedBox(height: 1),
                          Row(
                            children: [
                              const Icon(Icons.graphic_eq, size: 12, color: CaknaColors.inkSoft),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(reciterById(audio.reciter).name,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 11.5, color: CaknaColors.inkSoft)),
                              ),
                            ],
                          ),
                        ],
                      );
                    },
                  ),
                ),
                _StatButton(
                  label: 'Kelajuan',
                  value: audio.speedLabel,
                  onTap: () => context.read<AudioService>().cycleSpeed(),
                ),
                _StatButton(
                  label: 'Ulang',
                  value: audio.repeatLabel,
                  onTap: () => context.read<AudioService>().cycleRepeat(),
                ),
                // A–B memorization loop: tap 1 = set A, tap 2 = set B (loop
                // starts), tap 3 = clear.
                _StatButton(
                  label: 'A–B',
                  value: audio.rangeActive ? '✓' : (audio.rangeArmed ? 'A…' : '—'),
                  onTap: () => context.read<AudioService>().cycleRange(),
                ),
                IconButton(
                  icon: const Icon(Icons.close, color: CaknaColors.inkSoft),
                  onPressed: () => context.read<AudioService>().stop(),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<String> _surahName(QuranRepo repo, int vid) async {
    final v = await repo.verse(vid);
    final s = await repo.surah(v.surahId);
    return '${s.nameTrans} · ${v.surahId}:${v.verseNumber}';
  }
}

class _StatButton extends StatelessWidget {
  final String label, value;
  final VoidCallback onTap;
  const _StatButton({required this.label, required this.value, required this.onTap});

  @override
  Widget build(BuildContext context) {
    // oliveDeep on the dark bar is ~1.2:1 contrast — the A–B/Repeat/Speed
    // state would be unreadable exactly where it matters
    final dark = Theme.of(context).brightness == Brightness.dark;
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(10),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(label,
                style: TextStyle(
                    fontSize: 10.5,
                    color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
            const SizedBox(height: 2),
            Text(value,
                style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: dark ? const Color(0xFFDACB8E) : CaknaColors.oliveDeep)),
          ],
        ),
      ),
    );
  }
}
