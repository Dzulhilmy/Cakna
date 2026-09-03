import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../theme.dart';

class SelawatScreen extends StatefulWidget {
  const SelawatScreen({super.key});
  @override
  State<SelawatScreen> createState() => _SelawatScreenState();
}

class _SelawatScreenState extends State<SelawatScreen> {
  List<dynamic>? _stanzas;
  bool _showMs = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final raw = await rootBundle.loadString('assets/data/selawat.json');
    setState(() => _stanzas = jsonDecode(raw) as List<dynamic>);
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Selawat Nabi'),
        actions: [
          TextButton(
            onPressed: () => setState(() => _showMs = !_showMs),
            child: Text(
              _showMs ? 'EN' : 'MS',
              style: const TextStyle(fontWeight: FontWeight.w700, color: CaknaColors.olive),
            ),
          ),
        ],
      ),
      body: _stanzas == null
          ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
          : ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 40),
              itemCount: _stanzas!.length + 1,
              itemBuilder: (_, i) {
                if (i == 0) return _header(dark);
                final s = _stanzas![i - 1];
                final jenis = s['jenis'] as String;
                return _StanzaCard(stanza: s, jenis: jenis, showMs: _showMs, dark: dark);
              },
            ),
    );
  }

  Widget _header(bool dark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Column(
        children: [
          Text(
            'أَشْرَقَ الْبَدْرُ عَلَيْنَا',
            textAlign: TextAlign.center,
            textDirection: TextDirection.rtl,
            style: TextStyle(
              fontFamily: 'Uthmani',
              fontSize: 24,
              color: dark ? CaknaColors.inkDark : CaknaColors.ink,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Ashraqal Badr — Selawat Nabi',
            style: TextStyle(
              fontSize: 13,
              color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft,
            ),
          ),
          const SizedBox(height: 16),
          Divider(color: dark ? CaknaColors.borderDark : CaknaColors.border),
        ],
      ),
    );
  }
}

class _StanzaCard extends StatelessWidget {
  final dynamic stanza;
  final String jenis;
  final bool showMs;
  final bool dark;
  const _StanzaCard({required this.stanza, required this.jenis, required this.showMs, required this.dark});

  @override
  Widget build(BuildContext context) {
    final baris = stanza['baris'] as List<dynamic>;
    final isUlang = jenis == 'ulang';
    final isPenutup = jenis == 'penutup';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isUlang
            ? (dark ? CaknaColors.o700.withValues(alpha: 0.3) : CaknaColors.o300.withValues(alpha: 0.15))
            : (dark ? CaknaColors.surfaceDark : CaknaColors.surface),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isUlang
              ? CaknaColors.olive.withValues(alpha: 0.4)
              : (dark ? CaknaColors.borderDark : CaknaColors.border),
        ),
      ),
      child: Column(
        children: [
          if (isUlang)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.repeat, size: 12, color: CaknaColors.olive.withValues(alpha: 0.7)),
                  const SizedBox(width: 4),
                  Text(
                    'Ulang bersama',
                    style: TextStyle(
                        fontSize: 11,
                        color: CaknaColors.olive.withValues(alpha: 0.8),
                        fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          if (isPenutup)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Text(
                'Penutup',
                style: TextStyle(
                    fontSize: 11,
                    color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft,
                    fontWeight: FontWeight.w600),
              ),
            ),
          for (final b in baris) ...[
            Text(
              b['ar'] as String,
              textAlign: TextAlign.center,
              textDirection: TextDirection.rtl,
              style: const TextStyle(
                fontFamily: 'Uthmani',
                fontSize: 22,
                height: 1.8,
                color: CaknaColors.olive,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              (showMs ? b['ms'] : b['en']) as String,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                height: 1.5,
                color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft,
              ),
            ),
            if (baris.last != b) const SizedBox(height: 10),
          ],
        ],
      ),
    );
  }
}
