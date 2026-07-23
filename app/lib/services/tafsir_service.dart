import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

/// Tafsir editions served by the quran.com API (verified live 2026-07-08 —
/// the API offers no Malay/Indonesian tafsir, so the choices are English and
/// Arabic).
const kTafsirEditions = <(int, String)>[
  (169, 'Ibn Kathir (Ringkas) · English'),
  (168, "Ma'arif al-Qur'an · English"),
  (16, 'Tafsir Muyassar · Arab'),
  (14, 'Tafsir Ibn Kathir · Arab'),
];

String tafsirEditionName(int id) =>
    kTafsirEditions.firstWhere((e) => e.$1 == id, orElse: () => kTafsirEditions.first).$2;

/// Per-ayah tafsir from api.quran.com, cached locally in a small sqlite DB so
/// each passage is fetched at most once.
class TafsirService {
  static Database? _db;

  static Future<Database> _cache() async {
    if (_db != null) return _db!;
    final dir = await getApplicationSupportDirectory();
    _db = await openDatabase(
      p.join(dir.path, 'tafsir_cache.db'),
      version: 1,
      onCreate: (db, _) => db.execute(
          'CREATE TABLE cache (edition INTEGER, vkey TEXT, body TEXT, PRIMARY KEY (edition, vkey))'),
    );
    return _db!;
  }

  /// Plain-text tafsir for an ayah, or null when offline with no cache.
  static Future<String?> fetch(int edition, int surah, int ayah) async {
    final vkey = '$surah:$ayah';
    final db = await _cache();
    final hit = await db.query('cache',
        where: 'edition = ? AND vkey = ?', whereArgs: [edition, vkey], limit: 1);
    if (hit.isNotEmpty) return hit.first['body'] as String;
    try {
      final resp = await http
          .get(Uri.parse('https://api.quran.com/api/v4/tafsirs/$edition/by_ayah/$vkey'))
          .timeout(const Duration(seconds: 12));
      if (resp.statusCode != 200) return null;
      final raw = (jsonDecode(resp.body) as Map)['tafsir']?['text'] as String?;
      if (raw == null || raw.trim().isEmpty) return null;
      final text = _plainText(raw);
      await db.insert('cache', {'edition': edition, 'vkey': vkey, 'body': text},
          conflictAlgorithm: ConflictAlgorithm.replace);
      return text;
    } catch (_) {
      return null;
    }
  }

  /// Converts the API's HTML into readable plain text (headings and
  /// paragraphs become line breaks).
  static String _plainText(String html) {
    var t = html
        .replaceAll(RegExp(r'<(h[1-6])[^>]*>', caseSensitive: false), '\n\n')
        .replaceAll(RegExp(r'</h[1-6]>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
        .replaceAll(RegExp(r'</p>', caseSensitive: false), '\n\n')
        .replaceAll(RegExp(r'<[^>]+>'), '');
    t = t
        .replaceAll('&nbsp;', ' ')
        .replaceAll('&amp;', '&')
        .replaceAll('&lt;', '<')
        .replaceAll('&gt;', '>')
        .replaceAll('&quot;', '"')
        .replaceAll('&#39;', "'");
    return t.replaceAll(RegExp(r'\n{3,}'), '\n\n').trim();
  }
}
