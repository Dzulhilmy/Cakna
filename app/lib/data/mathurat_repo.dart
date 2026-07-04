import 'dart:convert';
import 'package:flutter/services.dart';
import 'models.dart';
import 'quran_repo.dart';

/// Loads the bundled Al-Ma'thurat items and resolves Quran-range text from the
/// content DB.
class MathuratRepo {
  final QuranRepo _quran;
  MathuratRepo(this._quran);

  List<MathuratItem>? _items;

  Future<List<MathuratItem>> items() async {
    if (_items != null) return _items!;
    final raw = await rootBundle.loadString('assets/data/mathurat.json');
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    return _items = list.map(MathuratItem.fromJson).toList();
  }

  /// The verses of a Quran-range item, for rendering Arabic + translation.
  Future<List<Verse>> versesFor(QuranRef ref) async {
    final all = await _quran.versesForSurah(ref.surah);
    return all.where((v) => v.verseNumber >= ref.ayahFrom && v.verseNumber <= ref.ayahTo).toList();
  }
}
