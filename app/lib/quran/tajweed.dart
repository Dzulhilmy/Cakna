import 'package:flutter/material.dart';

/// Tajweed rule colouring for word text. The bundled quran.db stores a
/// per-character rule code per word (`quran_word.rules`, comma-separated, one
/// token per character of `text_uthmani`). Recitation rules 1–9 are coloured;
/// waqf marks (20–27) keep the default text colour.
class Tajweed {
  /// rule code → colour
  static const colors = <int, Color>{
    1: Color(0xFFC62828), // Mad lazim — deep red
    2: Color(0xFFD84315), // Mad wajib / jaiz — red-orange
    3: Color(0xFFEF6C00), // Mad lin / aridh — orange
    4: Color(0xFF9E9E9E), // Mad silah sughra / dagger alef — grey
    5: Color(0xFF2E7D32), // Ghunnah, Ikhfa, Iqlab, Idgham bighunnah — green
    6: Color(0xFF6D6D6D), // Idgham bilaghunnah, lam syamsiah, hamzah wasal — grey
    7: Color(0xFF1565C0), // Tafkhim ra' — blue
    8: Color(0xFF00838F), // Qalqalah — teal
    9: Color(0xFF9E9E9E), // two sukun meeting — grey
  };

  /// Grouped legend (colour → label) for the UI.
  static const legend = <(int, String)>[
    (1, 'Mad (bacaan panjang)'),
    (5, 'Ghunnah / Ikhfa / Iqlab'),
    (8, 'Qalqalah'),
    (7, "Tafkhim ra'"),
    (6, 'Idgham / huruf senyap'),
  ];

  /// Builds coloured spans for one word given its raw `rules` string.
  /// Falls back to a single plain span if the rule tokens don't line up with
  /// the characters (so it never mis-colours).
  static List<InlineSpan> spans(String arabic, String? rules, TextStyle base) {
    if (rules == null || rules.replaceAll(',', '').isEmpty) {
      return [TextSpan(text: arabic, style: base)];
    }
    final tokens = rules.split(',');
    // rules has one token PER CODEPOINT (harakat count separately), so iterate
    // over runes, not grapheme clusters.
    final runes = arabic.runes.toList();
    if (tokens.length != runes.length) {
      return [TextSpan(text: arabic, style: base)];
    }
    final out = <InlineSpan>[];
    final buf = StringBuffer();
    Color? cur;
    void flush() {
      if (buf.isEmpty) return;
      out.add(TextSpan(
        text: buf.toString(),
        style: cur == null ? base : base.copyWith(color: cur),
      ));
      buf.clear();
    }

    for (var i = 0; i < runes.length; i++) {
      final code = int.tryParse(tokens[i]);
      final color = code == null ? null : colors[code];
      if (color != cur) {
        flush();
        cur = color;
      }
      buf.writeCharCode(runes[i]);
    }
    flush();
    return out;
  }
}
