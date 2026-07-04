import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/quran_repo.dart';
import '../state/audio_service.dart';
import '../theme.dart';

/// Compact playback bar shown while audio is active. Displays the current
/// surah:ayah with pause/resume and stop.
class MiniPlayer extends StatelessWidget {
  const MiniPlayer({super.key});

  @override
  Widget build(BuildContext context) {
    final audio = context.watch<AudioService>();
    final vid = audio.playingVerseId;
    if (vid == null) return const SizedBox.shrink();
    final repo = context.read<QuranRepo>();

    return Material(
      color: CaknaColors.teal,
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Row(
            children: [
              const Icon(Icons.graphic_eq, color: Colors.white, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: FutureBuilder(
                  future: repo.verse(vid),
                  builder: (context, snap) {
                    final label = snap.hasData
                        ? 'Ayat ${snap.data!.surahId}:${snap.data!.verseNumber}'
                        : 'Memuatkan…';
                    return Text(label,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600));
                  },
                ),
              ),
              IconButton(
                icon: Icon(audio.isPlaying ? Icons.pause : Icons.play_arrow, color: Colors.white),
                onPressed: () => context.read<AudioService>().pauseResume(),
              ),
              IconButton(
                icon: const Icon(Icons.close, color: Colors.white),
                onPressed: () => context.read<AudioService>().stop(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
