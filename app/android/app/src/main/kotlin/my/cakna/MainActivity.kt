package my.cakna

import com.ryanheise.audioservice.AudioServiceActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

// AudioServiceActivity (a FlutterActivity subclass) hosts the media session
// for background recitation playback with lock-screen controls.
class MainActivity : AudioServiceActivity() {

    override fun configureFlutterEngine(flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)

        // Page-font loader channel.
        // Release: reads from the PAD install-time pack (asset path "page_fonts/pN.ttf").
        // Debug:   falls back to the Flutter-bundled path ("flutter_assets/assets/page_fonts/pN.ttf").
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "my.cakna/pagefont")
            .setMethodCallHandler { call, result ->
                if (call.method != "load") { result.notImplemented(); return@setMethodCallHandler }
                val path = call.argument<String>("path")
                    ?: return@setMethodCallHandler result.error("ARG", "no path", null)
                try {
                    // PAD install-time pack path (release build, Play Store install).
                    result.success(assets.open(path).readBytes())
                } catch (_: Exception) {
                    try {
                        // Flutter bundle path fallback (debug, direct-run, sideload).
                        result.success(assets.open("flutter_assets/assets/$path").readBytes())
                    } catch (e: Exception) {
                        result.error("NOTFOUND", e.message, null)
                    }
                }
            }
    }
}
