import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../theme.dart';

class IbadahScreen extends StatefulWidget {
  const IbadahScreen({super.key});
  @override
  State<IbadahScreen> createState() => _IbadahScreenState();
}

class _IbadahScreenState extends State<IbadahScreen>
    with SingleTickerProviderStateMixin {
  Map<String, dynamic>? _data;
  late TabController _tabs;

  static const _sections = [
    ('wuduk', 'Wuduk'),
    ('solat', 'Solat'),
    ('tay', 'Tayammum'),
    ('umrah', 'Umrah'),
    ('haji', 'Haji'),
  ];

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: _sections.length, vsync: this);
    _load();
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  Future<void> _load() async {
    final raw = await rootBundle.loadString('assets/data/ibadah.json');
    setState(() => _data = jsonDecode(raw) as Map<String, dynamic>);
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Panduan Ibadah'),
        bottom: TabBar(
          controller: _tabs,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          labelColor: CaknaColors.olive,
          unselectedLabelColor: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft,
          indicatorColor: CaknaColors.olive,
          labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
          tabs: [for (final (_, label) in _sections) Tab(text: label)],
        ),
      ),
      body: _data == null
          ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
          : TabBarView(
              controller: _tabs,
              children: [
                for (final (key, label) in _sections)
                  _SectionView(
                    key: ValueKey(key),
                    sectionKey: key,
                    label: label,
                    data: _data!,
                    dark: dark,
                  ),
              ],
            ),
    );
  }
}

class _SectionView extends StatelessWidget {
  final String sectionKey;
  final String label;
  final Map<String, dynamic> data;
  final bool dark;
  const _SectionView({
    super.key,
    required this.sectionKey,
    required this.label,
    required this.data,
    required this.dark,
  });

  @override
  Widget build(BuildContext context) {
    final sections = data['sections'] as Map<String, dynamic>;
    final steps = sections[sectionKey] as List<dynamic>? ?? [];

    // Extra info panels depending on section
    List<Widget> extras = [];
    if (sectionKey == 'solat') {
      final rakaat = data['rakaat'] as List<dynamic>;
      extras = [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: _InfoCard(
            title: 'Bilangan Rakaat',
            dark: dark,
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                for (final r in rakaat)
                  _RakaatChip(name: r[0] as String, count: r[1] as int, dark: dark),
              ],
            ),
          ),
        ),
      ];
    }
    if (sectionKey == 'wuduk' && data['batal'] != null) {
      final batal = data['batal'] as Map<String, dynamic>;
      final list = batal['ms'] as List<dynamic>;
      extras = [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: _InfoCard(
            title: 'Perkara yang membatalkan wuduk',
            dark: dark,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                for (final (i, item) in list.indexed)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('${i + 1}. ',
                            style: TextStyle(
                                fontSize: 13,
                                color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
                        Expanded(
                            child: Text(item as String,
                                style: const TextStyle(fontSize: 13))),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ),
      ];
    }

    return ListView(
      padding: const EdgeInsets.symmetric(vertical: 16),
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: Text(
            '$label — Langkah demi langkah',
            style: const TextStyle(
                fontFamily: 'Lora', fontSize: 16, fontWeight: FontWeight.w600),
          ),
        ),
        for (final (i, step) in steps.indexed)
          _StepTile(index: i, step: step, dark: dark),
        const SizedBox(height: 8),
        ...extras,
      ],
    );
  }
}

class _StepTile extends StatelessWidget {
  final int index;
  final dynamic step;
  final bool dark;
  const _StepTile({required this.index, required this.step, required this.dark});

  @override
  Widget build(BuildContext context) {
    final hasArabic = step['arabic'] != null && (step['arabic'] as String).isNotEmpty;
    final desc = step['desc_ms'] as String? ?? '';

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: dark ? CaknaColors.borderDark : CaknaColors.border),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: CaknaColors.olive.withValues(alpha: 0.12),
            ),
            child: Center(
              child: Text(
                '${index + 1}',
                style: const TextStyle(
                    fontSize: 12, fontWeight: FontWeight.w700, color: CaknaColors.olive),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  step['title_ms'] as String,
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 14.5),
                ),
                if (hasArabic) ...[
                  const SizedBox(height: 8),
                  Align(
                    alignment: Alignment.centerRight,
                    child: Text(
                      step['arabic'] as String,
                      textAlign: TextAlign.right,
                      textDirection: TextDirection.rtl,
                      style: const TextStyle(
                          fontFamily: 'Uthmani', fontSize: 20, height: 1.8, color: CaknaColors.olive),
                    ),
                  ),
                ],
                if (desc.isNotEmpty) ...[
                  const SizedBox(height: 6),
                  Text(
                    desc,
                    style: TextStyle(
                        fontSize: 13,
                        height: 1.5,
                        color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final String title;
  final Widget child;
  final bool dark;
  const _InfoCard({required this.title, required this.child, required this.dark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: dark
            ? CaknaColors.o700.withValues(alpha: 0.25)
            : CaknaColors.o300.withValues(alpha: 0.12),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.25)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: CaknaColors.olive)),
          const SizedBox(height: 10),
          child,
        ],
      ),
    );
  }
}

class _RakaatChip extends StatelessWidget {
  final String name;
  final int count;
  final bool dark;
  const _RakaatChip({required this.name, required this.count, required this.dark});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: dark ? CaknaColors.borderDark : CaknaColors.border),
      ),
      child: RichText(
        text: TextSpan(
          style: DefaultTextStyle.of(context).style.copyWith(fontSize: 13),
          children: [
            TextSpan(text: name, style: const TextStyle(fontWeight: FontWeight.w600)),
            TextSpan(
                text: '  $count rakaat',
                style: TextStyle(color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
          ],
        ),
      ),
    );
  }
}
