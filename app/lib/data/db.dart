import 'dart:io';
import 'package:flutter/services.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';

/// Opens the bundled read-only content databases. sqflite needs a filesystem
/// path, so on first launch we copy the asset DBs into the app support dir
/// (guarded by a version marker so upgrades re-copy).
class CaknaDb {
  static const _assetVersion = 1; // bump when the bundled DBs change
  Database? _quran;

  Future<Database> get quran async => _quran ??= await _open('quran.db');

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
