import 'dart:io';
import 'package:flutter/services.dart';

/// Loads the per-page QCF fonts on demand and registers each as family
/// "QCFP{N}". Each page font maps the words' **`text_code`** private-use
/// codepoints to page-justified glyphs, giving the authentic 15-line Madani
/// mushaf.
///
/// **Android (release)**: fonts ship via the `pagefontpack` Play Asset
/// Delivery install-time pack; read via a native method channel which calls
/// `AssetManager.open("page_fonts/pN.ttf")`.
///
/// **Android (debug / sideload)**: the channel falls back to the Flutter-
/// bundled path (`flutter_assets/assets/page_fonts/pN.ttf`) so development
/// works without a Play Store install.
///
/// **iOS**: reads directly from Flutter's asset bundle via `rootBundle`.
class PageFontLoader {
  static final _loaded = <int>{};
  static final _inflight = <int, Future<void>>{};
  static const _channel = MethodChannel('my.cakna/pagefont');

  static String family(int page) => 'QCFP$page';

  static bool isLoaded(int page) => _loaded.contains(page);

  static Future<void> load(int page) {
    if (_loaded.contains(page)) return Future.value();
    return _inflight.putIfAbsent(page, () async {
      final ByteData data;
      if (Platform.isAndroid) {
        final bytes = await _channel.invokeMethod<Uint8List>(
            'load', {'path': 'page_fonts/p$page.ttf'});
        if (bytes == null) throw Exception('page font $page not found');
        data = ByteData.view(bytes.buffer);
      } else {
        data = await rootBundle.load('assets/page_fonts/p$page.ttf');
      }
      final loader = FontLoader(family(page))..addFont(Future.value(data));
      await loader.load();
      _loaded.add(page);
      _inflight.remove(page);
    });
  }
}
