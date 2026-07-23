import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../data/reciters.dart';
import '../state/app_state.dart';
import '../state/audio_downloads.dart';
import '../theme.dart';

/// "Muat turun audio" (Tilawah "Verse Audio Downloads" parity): download the
/// current reciter's recitation per surah for offline playback.
class AudioDownloadsScreen extends StatefulWidget {
  const AudioDownloadsScreen({super.key});

  @override
  State<AudioDownloadsScreen> createState() => _AudioDownloadsScreenState();
}

class _AudioDownloadsScreenState extends State<AudioDownloadsScreen> {
  late Future<List<Surah>> _surahs;

  @override
  void initState() {
    super.initState();
    _surahs = context.read<QuranRepo>().surahs();
  }

  static String _fmtBytes(int b) {
    if (b >= 1 << 30) return '${(b / (1 << 30)).toStringAsFixed(1)} GB';
    if (b >= 1 << 20) return '${(b / (1 << 20)).toStringAsFixed(1)} MB';
    if (b >= 1 << 10) return '${(b / (1 << 10)).toStringAsFixed(0)} KB';
    return '$b B';
  }

  @override
  Widget build(BuildContext context) {
    final reciterId = context.watch<AppState>().reciter;
    final dl = context.watch<AudioDownloads>();
    return Scaffold(
      appBar: AppBar(title: const Text('Muat turun audio')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
            child: Card(
              child: ListTile(
                leading: const Icon(Icons.record_voice_over_outlined, color: CaknaColors.olive),
                title: Text(reciterById(reciterId).name,
                    style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14.5)),
                subtitle: FutureBuilder<int>(
                  future: dl.storageBytes(reciterId),
                  builder: (context, snap) => Text(
                      'Storan: ${snap.hasData ? _fmtBytes(snap.data!) : '…'} · tukar qari di Profil',
                      style: const TextStyle(fontSize: 12)),
                ),
                trailing: TextButton(
                  onPressed: () => _confirmDeleteAll(context, reciterId),
                  child: const Text('Padam semua', style: TextStyle(color: Colors.red)),
                ),
              ),
            ),
          ),
          Expanded(
            child: FutureBuilder<List<Surah>>(
              future: _surahs,
              builder: (context, snap) {
                final surahs = snap.data ?? const <Surah>[];
                if (surahs.isEmpty) {
                  return const Center(child: CircularProgressIndicator(strokeWidth: 2));
                }
                return ListView.separated(
                  padding: const EdgeInsets.only(bottom: 24),
                  itemCount: surahs.length,
                  separatorBuilder: (_, _) => const Divider(height: 1, indent: 16),
                  itemBuilder: (context, i) =>
                      _SurahRow(surah: surahs[i], reciterId: reciterId),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmDeleteAll(BuildContext context, String reciterId) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Padam semua muat turun?'),
        content: Text('Semua audio ${reciterById(reciterId).name} akan dipadamkan.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: Colors.red.shade700),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Padam'),
          ),
        ],
      ),
    );
    if (ok == true && context.mounted) {
      await context.read<AudioDownloads>().deleteAll(reciterId);
      if (mounted) setState(() {});
    }
  }
}

class _SurahRow extends StatelessWidget {
  final Surah surah;
  final String reciterId;
  const _SurahRow({required this.surah, required this.reciterId});

  @override
  Widget build(BuildContext context) {
    final dl = context.watch<AudioDownloads>();
    final downloading = dl.isDownloading(reciterId, surah.id);
    final progress = dl.progressOf(reciterId, surah.id);
    return FutureBuilder<int>(
      // re-resolves whenever AudioDownloads notifies (progress/delete)
      future: dl.downloadedInSurah(reciterId, surah.id),
      builder: (context, snap) {
        final done = snap.data ?? 0;
        final complete = done >= surah.verseCount;
        return ListTile(
          leading: Container(
            width: 34,
            height: 34,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: CaknaColors.olive.withValues(alpha: 0.12),
            ),
            child: Text('${surah.id}',
                style: const TextStyle(
                    fontSize: 12.5, fontWeight: FontWeight.w700, color: CaknaColors.oliveDeep)),
          ),
          title: Text(surah.nameTrans, style: const TextStyle(fontWeight: FontWeight.w600)),
          subtitle: downloading
              ? Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(3),
                    child: LinearProgressIndicator(
                      value: progress,
                      minHeight: 5,
                      backgroundColor: CaknaColors.olive.withValues(alpha: 0.12),
                      valueColor: const AlwaysStoppedAnimation(CaknaColors.olive),
                    ),
                  ),
                )
              : Text(
                  complete
                      ? 'Lengkap · ${surah.verseCount} ayat'
                      : done > 0
                          ? '$done / ${surah.verseCount} ayat'
                          : '${surah.verseCount} ayat',
                  style: const TextStyle(fontSize: 12, color: CaknaColors.inkSoft)),
          trailing: downloading
              ? IconButton(
                  icon: const Icon(Icons.stop_circle_outlined, color: CaknaColors.inkSoft),
                  onPressed: () => dl.cancel(reciterId, surah.id),
                )
              : complete
                  ? IconButton(
                      icon: const Icon(Icons.delete_outline, color: CaknaColors.inkSoft),
                      onPressed: () => dl.deleteSurah(reciterId, surah.id),
                    )
                  : IconButton(
                      icon: const Icon(Icons.download_for_offline_outlined,
                          color: CaknaColors.olive),
                      onPressed: () => dl.downloadSurah(reciterId, surah.id),
                    ),
        );
      },
    );
  }
}
