import 'package:flutter/services.dart';

/// Loads the per-page QCF fonts (assets/page_fonts/p{N}.ttf) on demand and
/// registers each as family "QCFP{N}". Each page font maps the words' code_v2
/// private-use codepoints to page-justified glyphs, giving the authentic
/// 15-line Madani mushaf.
class PageFontLoader {
  static final _loaded = <int>{};
  static final _inflight = <int, Future<void>>{};

  static String family(int page) => 'QCFP$page';

  static bool isLoaded(int page) => _loaded.contains(page);

  static Future<void> load(int page) {
    if (_loaded.contains(page)) return Future.value();
    return _inflight.putIfAbsent(page, () async {
      final data = await rootBundle.load('assets/page_fonts/p$page.ttf');
      final loader = FontLoader(family(page))
        ..addFont(Future.value(data));
      await loader.load();
      _loaded.add(page);
      _inflight.remove(page);
    });
  }
}
