/// The 12 reciters (matching the original Tilawah list), each with a
/// CDN-verified audio source. Ten stream from cdn.islamic.network at a
/// per-edition bitrate — several editions are not published at 128 kbps, so a
/// hardcoded /128/ path 403s for them. Two (Husary Muallim, Tablawi) exist
/// only on everyayah.com, which addresses files as {surah}{ayah} zero-padded
/// rather than by the 1-based global ayah number. All URLs verified live
/// against both CDNs on 2026-07-08.
class Reciter {
  final String id; // stored in prefs / synced
  final String name;
  final String _host; // 'islamic' | 'everyayah'
  final String _path; // islamic.network edition id, or everyayah folder
  final int _bitrate; // islamic.network only

  const Reciter._(this.id, this.name, this._host, this._path, [this._bitrate = 128]);

  String url(int verseId) {
    if (_host == 'islamic') {
      return 'https://cdn.islamic.network/quran/audio/$_bitrate/$_path/$verseId.mp3';
    }
    final (s, a) = surahAyahOf(verseId);
    return 'https://everyayah.com/data/$_path/'
        '${s.toString().padLeft(3, '0')}${a.toString().padLeft(3, '0')}.mp3';
  }
}

const kReciters = <Reciter>[
  Reciter._('ar.alafasy', 'Mishari Rashid al-Afasy', 'islamic', 'ar.alafasy', 128),
  Reciter._('ar.abdulsamad', 'AbdulBaset AbdulSamad (Mujawwad)', 'islamic', 'ar.abdulsamad', 64),
  Reciter._('ar.abdulbasitmurattal', 'AbdulBaset AbdulSamad (Murattal)', 'islamic',
      'ar.abdulbasitmurattal', 64),
  Reciter._('ar.abdurrahmaansudais', 'Abdur-Rahman as-Sudais', 'islamic',
      'ar.abdurrahmaansudais', 64),
  Reciter._('ar.shaatree', 'Abu Bakr al-Shatri', 'islamic', 'ar.shaatree', 128),
  Reciter._('ar.hanirifai', 'Hani ar-Rifai', 'islamic', 'ar.hanirifai', 64),
  Reciter._('ar.husary', 'Mahmoud Khalil al-Husary', 'islamic', 'ar.husary', 128),
  Reciter._('ey.husary_muallim', 'Al-Husary (Muallim)', 'everyayah', 'Husary_Muallim_128kbps'),
  Reciter._('ar.minshawimujawwad', 'Minshawi (Mujawwad)', 'islamic', 'ar.minshawimujawwad', 64),
  Reciter._('ar.minshawi', 'Minshawi (Murattal)', 'islamic', 'ar.minshawi', 128),
  Reciter._('ar.saoodshuraym', 'Saud ash-Shuraym', 'islamic', 'ar.saoodshuraym', 64),
  Reciter._('ey.tablawi', 'Mohamed al-Tablawi', 'everyayah', 'Mohammad_al_Tablaway_128kbps'),
];

Reciter reciterById(String id) =>
    kReciters.firstWhere((r) => r.id == id, orElse: () => kReciters.first);

/// Ayah count per surah (index 0 = surah 1); matches quran.db, which is
/// verified against the quran.com chapters API (sum = 6236).
const List<int> kVersesPerSurah = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, //
  111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, //
  54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, //
  49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, //
  44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, //
  26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, //
  6, 3, 5, 4, 5, 6,
];

/// Converts a 1-based global ayah id (1..6236) to (surah, ayahNumber).
(int, int) surahAyahOf(int verseId) {
  var rest = verseId;
  for (var s = 0; s < kVersesPerSurah.length; s++) {
    if (rest <= kVersesPerSurah[s]) return (s + 1, rest);
    rest -= kVersesPerSurah[s];
  }
  return (114, 6);
}
