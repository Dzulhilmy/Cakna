import 'dart:convert';

import 'package:flutter_quill/flutter_quill.dart';

/// Notes are stored as a Quill Delta JSON string (rich notes) with plain-text
/// back-compat: anything that doesn't parse as a delta is treated as a legacy
/// plain-text note.

/// The note body as displayable plain text (for list previews).
String notePlainText(String body) {
  final doc = _tryDelta(body);
  return doc == null ? body : doc.toPlainText().trim();
}

/// The note body as a Quill document for editing.
Document noteDocument(String body) {
  final doc = _tryDelta(body);
  if (doc != null) return doc;
  final d = Document();
  if (body.trim().isNotEmpty) d.insert(0, body);
  return d;
}

/// Encodes an edited document back to the stored string ('' when empty).
String encodeNote(Document doc) {
  if (doc.toPlainText().trim().isEmpty) return '';
  return jsonEncode(doc.toDelta().toJson());
}

Document? _tryDelta(String body) {
  final t = body.trim();
  if (!t.startsWith('[')) return null;
  try {
    return Document.fromJson(jsonDecode(t) as List);
  } catch (_) {
    return null;
  }
}
