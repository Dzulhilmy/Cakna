import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';
import '../data/reciters.dart';

/// Offline recitation downloads (Tilawah "Verse Audio Downloads" parity).
/// Files live under {appDocs}/audio/{reciterId}/{verseId}.mp3 — the filesystem
/// itself is the source of truth; an in-memory per-reciter index of verse ids
/// keeps the UI and playback lookups cheap.
class AudioDownloads extends ChangeNotifier {
  Directory? _root;
  final Map<String, Set<int>> _have = {};
  final Map<String, _SurahTask> _tasks = {}; // key: '$reciter/$surah'

  Future<Directory> _rootDir() async {
    if (_root == null) {
      final docs = await getApplicationDocumentsDirectory();
      _root = Directory('${docs.path}/audio');
    }
    if (!await _root!.exists()) await _root!.create(recursive: true);
    return _root!;
  }

  Future<Directory> _reciterDir(String reciter) async =>
      Directory('${(await _rootDir()).path}/$reciter');

  Future<Set<int>> _index(String reciter) async {
    final cached = _have[reciter];
    if (cached != null) return cached;
    final s = <int>{};
    final dir = await _reciterDir(reciter);
    if (await dir.exists()) {
      for (final f in dir.listSync()) {
        final name = f.uri.pathSegments.last;
        if (!name.endsWith('.mp3')) {
          // a stray '.part' from an interrupted download must not count as
          // downloaded (it would mark the surah complete and block repair)
          if (name.endsWith('.part') && f is File) {
            try {
              f.deleteSync();
            } catch (_) {/* leave it; still not indexed */}
          }
          continue;
        }
        final id = int.tryParse(name.split('.').first);
        if (id != null) s.add(id);
      }
    }
    _have[reciter] = s;
    return s;
  }

  /// Local file for a verse if downloaded, else null (playback fast-path).
  Future<File?> localFile(String reciter, int verseId) async {
    if (!(await _index(reciter)).contains(verseId)) return null;
    final f = File('${(await _reciterDir(reciter)).path}/$verseId.mp3');
    return await f.exists() ? f : null;
  }

  /// First/last global verse id of a surah.
  static (int, int) surahRange(int surahId) {
    var start = 1;
    for (var s = 1; s < surahId; s++) {
      start += kVersesPerSurah[s - 1];
    }
    return (start, start + kVersesPerSurah[surahId - 1] - 1);
  }

  Future<int> downloadedInSurah(String reciter, int surahId) async {
    final have = await _index(reciter);
    final (a, b) = surahRange(surahId);
    var n = 0;
    for (var id = a; id <= b; id++) {
      if (have.contains(id)) n++;
    }
    return n;
  }

  /// (surahId in progress → fraction 0..1); null when idle.
  double? progressOf(String reciter, int surahId) => _tasks['$reciter/$surahId']?.progress;
  bool isDownloading(String reciter, int surahId) => _tasks.containsKey('$reciter/$surahId');
  bool get anyActive => _tasks.isNotEmpty;

  /// Total bytes stored for a reciter (for the header readout).
  Future<int> storageBytes(String reciter) async {
    final dir = await _reciterDir(reciter);
    if (!await dir.exists()) return 0;
    var total = 0;
    for (final f in dir.listSync()) {
      if (f is File) total += f.lengthSync();
    }
    return total;
  }

  Future<void> downloadSurah(String reciter, int surahId) async {
    final key = '$reciter/$surahId';
    if (_tasks.containsKey(key)) return;
    final task = _SurahTask();
    _tasks[key] = task;
    notifyListeners();
    try {
      final have = await _index(reciter);
      final dir = await _reciterDir(reciter);
      if (!await dir.exists()) await dir.create(recursive: true);
      final (a, b) = surahRange(surahId);
      final pending = [
        for (var id = a; id <= b; id++)
          if (!have.contains(id)) id
      ];
      final total = pending.length;
      var done = 0;
      final r = reciterById(reciter);
      // 3 concurrent verse fetches per surah task
      for (var i = 0; i < pending.length && !task.cancelled; i += 3) {
        final batch = pending.skip(i).take(3);
        await Future.wait(batch.map((id) async {
          if (task.cancelled) return;
          try {
            final resp = await http
                .get(Uri.parse(r.url(id)))
                .timeout(const Duration(seconds: 30));
            // re-check after the fetch: deleteAll/cancel may have raced the
            // download and the file must not reappear in a deleted dir
            if (task.cancelled) return;
            if (resp.statusCode == 200 && resp.bodyBytes.isNotEmpty) {
              final tmp = File('${dir.path}/$id.part');
              await tmp.writeAsBytes(resp.bodyBytes, flush: true);
              await tmp.rename('${dir.path}/$id.mp3');
              have.add(id);
            }
          } catch (_) {/* skip this ayah; the count shows the shortfall */}
          done++;
          task.progress = total == 0 ? 1 : done / total;
          // throttle: a notify per verse × 114 rebuilt rows is wasteful
          if (done % 5 == 0 || done == total) notifyListeners();
        }));
      }
    } finally {
      _tasks.remove(key);
      notifyListeners();
    }
  }

  void cancel(String reciter, int surahId) {
    _tasks['$reciter/$surahId']?.cancelled = true;
  }

  Future<void> deleteSurah(String reciter, int surahId) async {
    final have = await _index(reciter);
    final dir = await _reciterDir(reciter);
    final (a, b) = surahRange(surahId);
    for (var id = a; id <= b; id++) {
      if (have.remove(id)) {
        try {
          await File('${dir.path}/$id.mp3').delete();
        } catch (_) {/* already gone */}
      }
    }
    notifyListeners();
  }

  Future<void> deleteAll(String reciter) async {
    // stop any in-flight downloads for this reciter first, so a racing write
    // can't recreate files under the deleted directory
    for (final e in _tasks.entries) {
      if (e.key.startsWith('$reciter/')) e.value.cancelled = true;
    }
    final dir = await _reciterDir(reciter);
    if (await dir.exists()) await dir.delete(recursive: true);
    _have.remove(reciter);
    notifyListeners();
  }
}

class _SurahTask {
  double progress = 0;
  bool cancelled = false;
}
