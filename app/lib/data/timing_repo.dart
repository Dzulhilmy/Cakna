import 'db.dart';

/// One word's audio window within its ayah recording.
class WordTiming {
  final int word; // 1-based word position in the ayah
  final int startMs, endMs;
  WordTiming(this.word, this.startMs, this.endMs);
}

/// Word-by-word audio timings from the bundled audio_timing.db
/// (timing_segments: reciter_id, surah_id, ayah_number, word_position,
/// start_ms, end_ms — timings are relative to the per-ayah audio file).
class TimingRepo {
  final CaknaDb _db;
  TimingRepo(this._db);

  /// Our reciter ids → timing_segments.reciter_id. Verified empirically by
  /// matching each timing set's total ayah duration against the actual CDN
  /// audio (2:255) — the ids are the Tilawah reciter list, 1-based. Reciters
  /// missing here have no word timings (highlight degrades gracefully).
  static const timingReciter = <String, int>{
    'ar.abdulbasitmurattal': 2,
    'ar.abdurrahmaansudais': 3,
    'ar.shaatree': 4,
    'ar.hanirifai': 5,
    'ar.husary': 6,
    'ar.alafasy': 7,
    'ar.minshawi': 9,
    'ar.saoodshuraym': 10,
  };

  static bool hasTimings(String reciterId) => timingReciter.containsKey(reciterId);

  /// Word windows for one ayah, ordered by start; empty when the reciter has
  /// no timing data. Some words are stored as two consecutive segments under
  /// the same word_position (~3% of groups) — those are merged into one
  /// [min(start), max(end)] window so tapped-word playback isn't clipped.
  Future<List<WordTiming>> segments(String reciterId, int surahId, int ayah) async {
    final rid = timingReciter[reciterId];
    if (rid == null) return const [];
    final db = await _db.timing;
    final rows = await db.rawQuery(
      'SELECT word_position, MIN(start_ms) AS s, MAX(end_ms) AS e FROM timing_segments '
      'WHERE reciter_id = ? AND surah_id = ? AND ayah_number = ? '
      'GROUP BY word_position ORDER BY s',
      [rid, surahId, ayah],
    );
    return [
      for (final r in rows)
        WordTiming(r['word_position'] as int, r['s'] as int, r['e'] as int)
    ];
  }
}
