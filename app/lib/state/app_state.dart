import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Lightweight app-wide state: theme mode, last-read position, reading language.
class AppState extends ChangeNotifier {
  final SharedPreferences prefs;
  AppState(this.prefs);

  ThemeMode get themeMode {
    final i = prefs.getInt('themeMode') ?? ThemeMode.system.index;
    return (i >= 0 && i < ThemeMode.values.length) ? ThemeMode.values[i] : ThemeMode.system;
  }
  set themeMode(ThemeMode m) {
    prefs.setInt('themeMode', m.index);
    notifyListeners();
  }

  int get lastPage => prefs.getInt('lastPage') ?? 1;
  set lastPage(int p) {
    prefs.setInt('lastPage', p);
    notifyListeners();
  }

  /// Recently-read positions ("surahId:page:tsMillis", newest first, one entry
  /// per surah, max 5) — drives the home "Sambung bacaan" cards.
  List<({int surah, int page, int ts})> get recentReads {
    final raw = prefs.getStringList('recentReads') ?? const [];
    final out = <({int surah, int page, int ts})>[];
    for (final e in raw) {
      final p = e.split(':');
      if (p.length != 3) continue;
      final s = int.tryParse(p[0]), pg = int.tryParse(p[1]), t = int.tryParse(p[2]);
      if (s != null && pg != null && t != null) out.add((surah: s, page: pg, ts: t));
    }
    return out;
  }

  void recordRead(int surahId, int page) {
    final list = recentReads.where((r) => r.surah != surahId).toList();
    list.insert(0, (surah: surahId, page: page, ts: DateTime.now().millisecondsSinceEpoch));
    prefs.setStringList(
        'recentReads', list.take(5).map((r) => '${r.surah}:${r.page}:${r.ts}').toList());
    notifyListeners();
  }

  /// whether the first-run onboarding has been completed
  bool get onboarded => prefs.getBool('onboarded') ?? false;
  set onboarded(bool v) {
    prefs.setBool('onboarded', v);
    notifyListeners();
  }

  /// verse translation language: 'ms' | 'en' | 'id'
  String get transLang => prefs.getString('transLang') ?? 'ms';
  set transLang(String v) {
    prefs.setString('transLang', v);
    notifyListeners();
  }

  /// Hub UI language: 'ms' | 'en'
  String get uiLang => prefs.getString('uiLang') ?? 'ms';
  set uiLang(String v) {
    prefs.setString('uiLang', v);
    notifyListeners();
  }

  /// audio reciter edition id (islamic.network), e.g. 'ar.alafasy'
  String get reciter => prefs.getString('reciter') ?? 'ar.alafasy';
  set reciter(String v) {
    prefs.setString('reciter', v);
    notifyListeners();
  }

  /// colour Arabic by tajweed rule in the verse sheet
  bool get tajweed => prefs.getBool('tajweed') ?? true;
  set tajweed(bool v) {
    prefs.setBool('tajweed', v);
    notifyListeners();
  }

  /// The 5 obligatory prayers, in schedule order (used as notif-mode keys).
  static const prayerKeys = ['Subuh', 'Zohor', 'Asar', 'Maghrib', 'Isyak'];

  /// Per-prayer notification mode: 0 = none, 1 = vibrate, 2 = azan sound.
  /// Stored as a CSV of 5 ints; defaults to all-off (matching Tilawah).
  Map<String, int> get prayerModes {
    final raw = prefs.getString('prayerModes') ?? '0,0,0,0,0';
    final parts = raw.split(',');
    return {
      for (var i = 0; i < prayerKeys.length; i++)
        prayerKeys[i]: (i < parts.length ? int.tryParse(parts[i]) : 0) ?? 0,
    };
  }

  int prayerMode(String key) => prayerModes[key] ?? 0;

  void setPrayerMode(String key, int mode) {
    final m = prayerModes..[key] = mode;
    prefs.setString('prayerModes', prayerKeys.map((k) => m[k] ?? 0).join(','));
    notifyListeners();
  }

  bool get anyPrayerNotif => prayerModes.values.any((m) => m > 0);

  /// Azan sound: 0 = none (silences mode-2 prayers to vibrate), 1..3 = variant.
  int get azanSound => (prefs.getInt('azanSound') ?? 1).clamp(0, 3);
  set azanSound(int v) {
    prefs.setInt('azanSound', v.clamp(0, 3));
    notifyListeners();
  }

  /// Prayer-time JAKIM zone: 'Automatik' (nearest by GPS) or a zone code (WLY01).
  String get prayerZone => prefs.getString('prayerZone') ?? 'Automatik';
  set prayerZone(String v) {
    prefs.setString('prayerZone', v);
    notifyListeners();
  }

  /// Hijri date adjustment in days (−2..+2) to match the official local takwim.
  int get hijriOffset => (prefs.getInt('hijriOffset') ?? 0).clamp(-2, 2);
  set hijriOffset(int v) {
    prefs.setInt('hijriOffset', v.clamp(-2, 2));
    notifyListeners();
  }

  /// Named bookmark collections (Tilawah "Collections"). Default: 'Umum'.
  /// Adds/deletes carry timestamps (LWW-element-set) so a deletion isn't
  /// resurrected by the cloud-sync merge.
  List<String> get collections =>
      prefs.getStringList('collections') ?? const ['Umum'];

  Map<String, int> _tsMap(String key) {
    final raw = prefs.getString(key);
    if (raw == null) return {};
    try {
      return (jsonDecode(raw) as Map)
          .map((k, v) => MapEntry(k as String, (v as num).toInt()));
    } catch (_) {
      return {};
    }
  }

  void _setTsMap(String key, Map<String, int> m) => prefs.setString(key, jsonEncode(m));

  void addCollection(String name) {
    final n = name.trim();
    if (n.isEmpty) return;
    final list = collections.toList();
    if (!list.contains(n)) {
      list.add(n);
      prefs.setStringList('collections', list);
    }
    _setTsMap('collectionsAdd',
        _tsMap('collectionsAdd')..[n] = DateTime.now().millisecondsSinceEpoch);
    _setTsMap('collectionsDel', _tsMap('collectionsDel')..remove(n));
    notifyListeners();
  }

  void removeCollection(String name) {
    if (name == 'Umum') return; // the default collection is permanent
    final list = collections.toList()..remove(name);
    prefs.setStringList('collections', list);
    _setTsMap('collectionsDel',
        _tsMap('collectionsDel')..[name] = DateTime.now().millisecondsSinceEpoch);
    _setTsMap('collectionsAdd', _tsMap('collectionsAdd')..remove(name));
    notifyListeners();
  }

  /// Reader mode: 'mushaf' (15-line QCF page) or 'translation' (per-ayah scroll).
  String get readingMode => prefs.getString('readingMode') ?? 'mushaf';
  set readingMode(String v) {
    prefs.setString('readingMode', v);
    notifyListeners();
  }

  /// Arabic glyph size (points) for the translation reader + verse sheet.
  static const arabicSizePresets = [24.0, 28.0, 34.0, 40.0]; // S M L XL
  double get arabicFontSize => prefs.getDouble('arabicFontSize') ?? 28;
  set arabicFontSize(double v) {
    prefs.setDouble('arabicFontSize', v.clamp(18, 52).toDouble());
    notifyListeners();
  }

  /// Translation text size (points).
  static const transSizePresets = [14.0, 16.0, 19.0, 23.0]; // S M L XL
  double get translationFontSize => prefs.getDouble('translationFontSize') ?? 16;
  set translationFontSize(double v) {
    prefs.setDouble('translationFontSize', v.clamp(12, 30).toDouble());
    notifyListeners();
  }

  /// Home quick-access shortcuts. Ids: 0 = Al-Ma'thurat module, 1..114 = surah.
  List<int> get quickAccess {
    final raw = prefs.getStringList('quickAccess');
    if (raw == null) return const [0, 1, 36, 18, 112, 108];
    final ids = raw.map(int.tryParse).whereType<int>().toList();
    return ids.isEmpty ? const [0, 1, 36, 18, 112, 108] : ids;
  }

  set quickAccess(List<int> ids) {
    prefs.setStringList('quickAccess', ids.take(6).map((e) => e.toString()).toList());
    notifyListeners();
  }

  /// Tafsir edition (quran.com resource id; see kTafsirEditions).
  int get tafsirEdition => prefs.getInt('tafsirEdition') ?? 169;
  set tafsirEdition(int v) {
    prefs.setInt('tafsirEdition', v);
    notifyListeners();
  }

  /// Home-screen widget theme: 0 = follow system, 1 = light, 2 = dark.
  int get widgetTheme => (prefs.getInt('widgetTheme') ?? 0).clamp(0, 2);
  set widgetTheme(int v) {
    prefs.setInt('widgetTheme', v.clamp(0, 2));
    notifyListeners();
  }

  /// Progress period: '7d' | '30d' | '6mo' | '12mo' | 'year' | 'all'.
  String get progressPeriod => prefs.getString('progressPeriod') ?? '30d';
  set progressPeriod(String v) {
    prefs.setString('progressPeriod', v);
    notifyListeners();
  }

  /// Settings snapshot for cloud sync.
  Map<String, Object> exportSettings() => {
        'theme': themeMode.index,
        'transLang': transLang,
        'reciter': reciter,
        'tajweed': tajweed,
        'lastPage': lastPage,
        'readingMode': readingMode,
        'arabicFontSize': arabicFontSize,
        'translationFontSize': translationFontSize,
        'quickAccess': quickAccess,
        'prayerModes': prefs.getString('prayerModes') ?? '0,0,0,0,0',
        'azanSound': azanSound,
        'prayerZone': prayerZone,
        'progressPeriod': progressPeriod,
        'hijriOffset': hijriOffset,
        'tafsirEdition': tafsirEdition,
        'collections': collections, // kept for older clients
        'collectionsAdd': _tsMap('collectionsAdd'),
        'collectionsDel': _tsMap('collectionsDel'),
        'recentReads': prefs.getStringList('recentReads') ?? const [],
      };

  /// True while a server settings blob is being applied — sync listeners use
  /// this to tell remote-driven notifications apart from real local changes
  /// (otherwise every pull would schedule another sync cycle forever).
  bool get isApplyingRemote => _applyingRemote;
  bool _applyingRemote = false;

  /// Apply a synced settings map (server-wins on sign-in). Returns true when
  /// a prayer-relevant field (modes/sound/zone/hijri offset) changed, so the
  /// caller can reschedule azan + refresh the widget.
  bool applySettings(Map<String, dynamic> s) {
    final outer = _applyingRemote;
    _applyingRemote = true;
    try {
      return _applySettings(s);
    } finally {
      _applyingRemote = outer;
    }
  }

  String _prayerSnapshot() =>
      '${prefs.getString('prayerModes')}|${prefs.getInt('azanSound')}|'
      '${prefs.getString('prayerZone')}|${prefs.getInt('hijriOffset')}';

  bool _applySettings(Map<String, dynamic> s) {
    final prayerBefore = _prayerSnapshot();
    if (s['theme'] is int) {
      final i = s['theme'] as int;
      if (i >= 0 && i < ThemeMode.values.length) prefs.setInt('themeMode', i);
    }
    if (s['transLang'] is String) prefs.setString('transLang', s['transLang'] as String);
    if (s['reciter'] is String) prefs.setString('reciter', s['reciter'] as String);
    // note: legacy 'azan' key from older clients is intentionally ignored
    if (s['tajweed'] is bool) prefs.setBool('tajweed', s['tajweed'] as bool);
    // last-read position: keep the furthest, never rewind
    if (s['lastPage'] is int && (s['lastPage'] as int) > lastPage) {
      prefs.setInt('lastPage', s['lastPage'] as int);
    }
    if (s['readingMode'] is String) prefs.setString('readingMode', s['readingMode'] as String);
    if (s['arabicFontSize'] is num) {
      arabicFontSize = (s['arabicFontSize'] as num).toDouble(); // clamps via setter
    }
    if (s['translationFontSize'] is num) {
      translationFontSize = (s['translationFontSize'] as num).toDouble();
    }
    if (s['quickAccess'] is List) {
      final ids = (s['quickAccess'] as List).whereType<num>().map((e) => e.toInt()).toList();
      if (ids.isNotEmpty) quickAccess = ids;
    }
    if (s['prayerModes'] is String) prefs.setString('prayerModes', s['prayerModes'] as String);
    if (s['azanSound'] is int) prefs.setInt('azanSound', s['azanSound'] as int);
    if (s['prayerZone'] is String) prefs.setString('prayerZone', s['prayerZone'] as String);
    if (s['progressPeriod'] is String) prefs.setString('progressPeriod', s['progressPeriod'] as String);
    if (s['hijriOffset'] is int) hijriOffset = s['hijriOffset'] as int; // clamps via setter
    if (s['tafsirEdition'] is int) prefs.setInt('tafsirEdition', s['tafsirEdition'] as int);
    // note: widgetTheme is deliberately NOT synced — it is a per-device
    // display preference for that device's home-screen widget
    mergeSharedSets(s, notify: false);
    notifyListeners();
    return _prayerSnapshot() != prayerBefore;
  }

  /// Merges the commutative element-set halves of a synced settings blob —
  /// collections (LWW add/delete tombstones) and recentReads. Unlike the
  /// server-wins scalars in [applySettings], these merges can never revert a
  /// local edit, so the sync layer applies them on EVERY pull (including
  /// local-change cycles where scalars are skipped); otherwise a device's
  /// push clobbers the other device's tombstones and deletions resurrect.
  void mergeSharedSets(Map<String, dynamic> s, {bool notify = true}) {
    final outer = _applyingRemote;
    _applyingRemote = true;
    try {
      // collections: LWW-element-set merge — a name is alive when it has no
      // delete, or its (re-)add is at least as new as the delete. Legacy plain
      // lists count as adds at ts 0, so they never resurrect a newer delete.
      if (s['collections'] is List || s['collectionsAdd'] is Map || s['collectionsDel'] is Map) {
        final adds = _tsMap('collectionsAdd');
        final dels = _tsMap('collectionsDel');
        void mergeMax(Object? src, Map<String, int> into) {
          if (src is! Map) return;
          src.forEach((k, v) {
            if (k is String && v is num) {
              final t = v.toInt();
              if (t > (into[k] ?? -1)) into[k] = t;
            }
          });
        }

        mergeMax(s['collectionsAdd'], adds);
        mergeMax(s['collectionsDel'], dels);
        if (s['collections'] is List) {
          for (final n in (s['collections'] as List).whereType<String>()) {
            adds.putIfAbsent(n, () => 0);
          }
        }
        final names = <String>{...collections, ...adds.keys};
        bool alive(String n) => !dels.containsKey(n) || (adds[n] ?? 0) >= dels[n]!;
        final merged = ['Umum', ...names.where((n) => n != 'Umum' && alive(n))];
        prefs.setStringList('collections', merged);
        _setTsMap('collectionsAdd', adds);
        _setTsMap('collectionsDel', dels);
      }
      // recent reads: merge per surah keeping the newest timestamp
      if (s['recentReads'] is List) {
        final bySurah = <int, ({int surah, int page, int ts})>{};
        void fold(Iterable<String> entries) {
          for (final e in entries) {
            final p = e.split(':');
            if (p.length != 3) continue;
            final su = int.tryParse(p[0]), pg = int.tryParse(p[1]), t = int.tryParse(p[2]);
            if (su == null || pg == null || t == null) continue;
            final cur = bySurah[su];
            if (cur == null || t > cur.ts) bySurah[su] = (surah: su, page: pg, ts: t);
          }
        }

        fold(prefs.getStringList('recentReads') ?? const []);
        fold((s['recentReads'] as List).whereType<String>());
        final merged = bySurah.values.toList()..sort((a, b) => b.ts.compareTo(a.ts));
        prefs.setStringList(
            'recentReads', merged.take(5).map((r) => '${r.surah}:${r.page}:${r.ts}').toList());
      }
      if (notify) notifyListeners();
    } finally {
      _applyingRemote = outer;
    }
  }

  static Future<AppState> load() async {
    final prefs = await SharedPreferences.getInstance();
    // Migration: the old single azan on/off toggle became per-prayer modes.
    // Seed the modes for users who had azan enabled, otherwise their prayer
    // notifications would silently stop after the update.
    if (prefs.getBool('azanEnabled') == true && prefs.getString('prayerModes') == null) {
      await prefs.setString('prayerModes', '2,2,2,2,2');
    }
    await prefs.remove('azanEnabled');
    return AppState(prefs);
  }
}
