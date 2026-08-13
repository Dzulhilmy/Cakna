import 'dart:io';
import 'package:flutter/services.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

/// Opens the bundled read-only content databases. sqflite needs a filesystem
/// path, so on first launch we copy the asset DBs into the app support dir
/// (guarded by a version marker so upgrades re-copy).
///
/// Memory note: rootBundle.load pulls the whole asset into RAM for the copy
/// (~88 MB quran.db / ~34 MB audio_timing.db, transient, first launch or
/// upgrade only — Flutter has no streaming asset API). Separately the 604
/// runtime-loaded page fonts have no unload API; worst case (paging the whole
/// mushaf in one session) is ~91 MB, an accepted ceiling.
class CaknaDb {
  static const _assetVersion = 3; // bump when the bundled DBs change (v3: name_ms, text/translation reseed from extracted JSON)
  Database? _quran;
  Database? _timing;

  Future<Database> get quran async => _quran ??= await _open('quran.db');

  /// Word-level audio timings (timing_segments) for word-by-word highlight.
  Future<Database> get timing async => _timing ??= await _open('audio_timing.db');

  Future<Database> _open(String name) async {
    final dir = await getApplicationSupportDirectory();
    final dst = p.join(dir.path, name);
    final marker = File(p.join(dir.path, '$name.v'));
    final needCopy = !await File(dst).exists() ||
        !await marker.exists() ||
        (await marker.readAsString()).trim() != '$_assetVersion';

    if (needCopy) {
      final bytes = await rootBundle.load('assets/data/$name');
      await File(dst).writeAsBytes(
        bytes.buffer.asUint8List(bytes.offsetInBytes, bytes.lengthInBytes),
        flush: true,
      );
      await marker.writeAsString('$_assetVersion');
    }
    return openReadOnlyDatabase(dst);
  }
}
