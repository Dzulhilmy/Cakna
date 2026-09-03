import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme.dart';

class AsmaScreen extends StatefulWidget {
  const AsmaScreen({super.key});
  @override
  State<AsmaScreen> createState() => _AsmaScreenState();
}

class _AsmaScreenState extends State<AsmaScreen> {
  List<dynamic>? _items;
  String _query = '';

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final raw = await rootBundle.loadString('assets/data/asma.json');
    setState(() => _items = jsonDecode(raw) as List<dynamic>);
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final items = (_items ?? []).where((a) {
      if (_query.isEmpty) return true;
      final q = _query.toLowerCase();
      return (a['translit'] as String).toLowerCase().contains(q) ||
          (a['meaning_ms'] as String).toLowerCase().contains(q) ||
          (a['arabic'] as String).contains(q);
    }).toList();

    return Scaffold(
      appBar: AppBar(title: const Text('Asmaul Husna')),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: TextField(
              decoration: InputDecoration(
                hintText: 'Cari nama…',
                prefixIcon: const Icon(Icons.search, size: 20),
                filled: true,
                fillColor: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: dark ? CaknaColors.borderDark : CaknaColors.border),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: dark ? CaknaColors.borderDark : CaknaColors.border),
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 10),
              ),
              onChanged: (v) => setState(() => _query = v),
            ),
          ),
          if (_items == null)
            const Expanded(child: Center(child: CircularProgressIndicator(strokeWidth: 2)))
          else
            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
                itemCount: items.length,
                separatorBuilder: (_, _) => const SizedBox(height: 10),
                itemBuilder: (_, i) {
                  final a = items[i];
                  return _AsmaCard(a: a, dark: dark);
                },
              ),
            ),
        ],
      ),
    );
  }
}

class _AsmaCard extends StatelessWidget {
  final dynamic a;
  final bool dark;
  const _AsmaCard({required this.a, required this.dark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: dark ? CaknaColors.borderDark : CaknaColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: CaknaColors.olive.withValues(alpha: 0.12),
            ),
            child: Center(
              child: Text(
                '${a['position']}',
                style: const TextStyle(
                    fontSize: 12, fontWeight: FontWeight.w700, color: CaknaColors.olive),
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  a['translit'] as String,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                ),
                const SizedBox(height: 2),
                Text(
                  a['meaning_ms'] as String,
                  style: TextStyle(
                      fontSize: 13,
                      color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Text(
            a['arabic'] as String,
            textAlign: TextAlign.right,
            textDirection: TextDirection.rtl,
            style: const TextStyle(
              fontFamily: 'Uthmani',
              fontSize: 22,
              color: CaknaColors.olive,
            ),
          ),
        ],
      ),
    );
  }
}
