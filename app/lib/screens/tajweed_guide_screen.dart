import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import 'package:provider/provider.dart';
import '../quran/tajweed.dart';
import '../state/app_state.dart';
import '../theme.dart';

/// Tajweed sub-screen (Tilawah parity): the colour toggle plus the full rules
/// reference from rule_detail_{ms,en,id}.json, grouped by colour code.
class TajweedGuideScreen extends StatefulWidget {
  const TajweedGuideScreen({super.key});

  @override
  State<TajweedGuideScreen> createState() => _TajweedGuideScreenState();
}

class _RuleDetail {
  final int rule;
  final String title, description;
  _RuleDetail(this.rule, this.title, this.description);
}

class _TajweedGuideScreenState extends State<TajweedGuideScreen> {
  late Future<List<_RuleDetail>> _future;
  String _lang = '';

  Future<List<_RuleDetail>> _load(String lang) async {
    // only ms/en/id files ship; anything else falls back to ms
    final file = const ['ms', 'en', 'id'].contains(lang) ? lang : 'ms';
    final raw = await rootBundle.loadString('assets/data/rule_detail_$file.json');
    final list = (jsonDecode(raw) as List).cast<Map<String, dynamic>>();
    return [
      for (final e in list)
        if (int.tryParse('${e['rule']}') != null)
          _RuleDetail(int.parse('${e['rule']}'), '${e['title']}', '${e['description']}'),
    ];
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    if (_lang != app.transLang) {
      _lang = app.transLang;
      _future = _load(_lang);
    }
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(title: const Text('Tajwid')),
      body: FutureBuilder<List<_RuleDetail>>(
        future: _future,
        builder: (context, snap) {
          final details = snap.data ?? const <_RuleDetail>[];
          final byRule = <int, List<_RuleDetail>>{};
          for (final d in details) {
            (byRule[d.rule] ??= []).add(d);
          }
          final codes = byRule.keys.toList()..sort();
          return ListView(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
            children: [
              Card(
                child: SwitchListTile(
                  title: const Text('Warna tajwid'),
                  subtitle: const Text('Warnakan hukum tajwid dalam bacaan'),
                  activeThumbColor: CaknaColors.olive,
                  value: app.tajweed,
                  onChanged: (v) => app.tajweed = v,
                ),
              ),
              const SizedBox(height: 14),
              const Padding(
                padding: EdgeInsets.symmetric(horizontal: 4),
                child: Text('Panduan hukum',
                    style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
              ),
              const SizedBox(height: 6),
              for (final code in codes)
                Card(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            // waqf-mark groups (20–27) have no text colour —
                            // an outlined swatch avoids implying one
                            Container(
                              width: 14,
                              height: 14,
                              decoration: BoxDecoration(
                                color: Tajweed.colors[code],
                                border: Tajweed.colors[code] == null
                                    ? Border.all(color: CaknaColors.inkSoft, width: 1.2)
                                    : null,
                                borderRadius: BorderRadius.circular(4),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                                Tajweed.colors[code] == null
                                    ? 'Tanda waqaf $code'
                                    : 'Kumpulan $code',
                                style: const TextStyle(
                                    fontSize: 12.5,
                                    fontWeight: FontWeight.w700,
                                    color: CaknaColors.inkSoft)),
                          ],
                        ),
                        const SizedBox(height: 8),
                        for (final d in byRule[code]!) ...[
                          Text(d.title,
                              style:
                                  const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
                          const SizedBox(height: 2),
                          Text(d.description,
                              style: TextStyle(
                                  fontSize: 12.5,
                                  height: 1.45,
                                  color:
                                      dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
                          if (d != byRule[code]!.last) const SizedBox(height: 10),
                        ],
                      ],
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
