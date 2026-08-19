import 'package:flutter/material.dart';

class HubDocsScreen extends StatelessWidget {
  final Map<String, dynamic> docs;
  const HubDocsScreen({super.key, required this.docs});

  static const _kDocs = [
    ('policy', 'Polisi', Icons.gavel_outlined, 'Dasar & peraturan operasi'),
    ('sop', 'SOP', Icons.checklist_outlined, 'Standard Operating Procedure'),
    ('guidelines', 'Garis Panduan', Icons.menu_book_outlined, 'Panduan pelaksanaan program'),
    ('manual', 'Manual', Icons.article_outlined, 'Manual rujukan lengkap'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F2),
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          _buildHeader(context),
          Transform.translate(
            offset: const Offset(0, -24),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (final (key, label, icon, desc) in _kDocs) ...[
                    _DocCard(
                      label: label,
                      icon: icon,
                      desc: desc,
                      doc: docs[key] is Map
                          ? (docs[key] as Map<String, dynamic>? ?? {})
                          : {},
                    ),
                    const SizedBox(height: 12),
                  ],
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 8, 20, 48),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF9E2A42), Color(0xFF6B1830)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: const Icon(Icons.chevron_left, color: Colors.white, size: 28),
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
          ),
          const SizedBox(height: 12),
          const Text('Polisi & Panduan',
              style: TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  height: 1.2)),
          const SizedBox(height: 8),
          const Text('Dokumen rasmi, SOP & garis panduan operasi',
              style: TextStyle(fontSize: 13.5, color: Colors.white70)),
        ],
      ),
    );
  }
}

class _DocCard extends StatelessWidget {
  final String label, desc;
  final IconData icon;
  final Map<String, dynamic> doc;
  const _DocCard({
    required this.label,
    required this.desc,
    required this.icon,
    required this.doc,
  });

  @override
  Widget build(BuildContext context) {
    final title = doc['title'] as String? ?? label;
    final subtitle = doc['subtitle'] as String? ?? desc;
    final lastUpdated = doc['lastUpdated'] as String? ?? '';

    return GestureDetector(
      onTap: () {
        final content = doc['content'] as String? ?? '';
        showModalBottomSheet(
          context: context,
          isScrollControlled: true,
          backgroundColor: Colors.transparent,
          builder: (_) => _DocDetailSheet(
            title: title,
            subtitle: subtitle,
            content: content,
            lastUpdated: lastUpdated,
          ),
        );
      },
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 10,
                offset: const Offset(0, 3)),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 48,
              height: 48,
              decoration: BoxDecoration(
                color: const Color(0xFFFFF1F3),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: const Color(0xFFD94F6A), size: 24),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: const TextStyle(
                          fontFamily: 'Lora',
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827))),
                  const SizedBox(height: 3),
                  Text(subtitle,
                      style: const TextStyle(fontSize: 12.5, color: Color(0xFF6B7280))),
                  if (lastUpdated.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text('Kemaskini: $lastUpdated',
                        style: const TextStyle(
                            fontSize: 11, color: Color(0xFF9CA3AF))),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(Icons.chevron_right_rounded, color: Color(0xFFD1D5DB), size: 22),
          ],
        ),
      ),
    );
  }
}

class _DocDetailSheet extends StatelessWidget {
  final String title, subtitle, content, lastUpdated;
  const _DocDetailSheet({
    required this.title,
    required this.subtitle,
    required this.content,
    required this.lastUpdated,
  });

  @override
  Widget build(BuildContext context) {
    final paragraphs = content
        .split(RegExp(r'\n\s*\n'))
        .where((p) => p.trim().isNotEmpty)
        .toList();

    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      maxChildSize: 0.95,
      minChildSize: 0.4,
      builder: (context, controller) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: ListView(
            controller: controller,
            padding: const EdgeInsets.fromLTRB(20, 0, 20, 40),
            children: [
              const Padding(
                padding: EdgeInsets.symmetric(vertical: 12),
                child: Center(
                  child: SizedBox(
                    width: 40,
                    height: 4,
                    child: DecoratedBox(
                      decoration: BoxDecoration(
                        color: Color(0xFFE5E7EB),
                        borderRadius: BorderRadius.all(Radius.circular(2)),
                      ),
                    ),
                  ),
                ),
              ),
              Text(title,
                  style: const TextStyle(
                      fontFamily: 'Lora',
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827))),
              if (subtitle.isNotEmpty) ...[
                const SizedBox(height: 6),
                Text(subtitle,
                    style: const TextStyle(fontSize: 13.5, color: Color(0xFF6B7280))),
              ],
              if (lastUpdated.isNotEmpty) ...[
                const SizedBox(height: 6),
                Text('Kemaskini: $lastUpdated',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF9CA3AF))),
              ],
              const SizedBox(height: 20),
              const Divider(color: Color(0xFFE5E7EB)),
              const SizedBox(height: 16),
              if (paragraphs.isEmpty)
                const Text('Tiada kandungan.',
                    style: TextStyle(fontSize: 14, color: Color(0xFF9CA3AF)))
              else
                for (final para in paragraphs) ...[
                  Text(para,
                      style: const TextStyle(
                          fontSize: 14, color: Color(0xFF374151), height: 1.7)),
                  const SizedBox(height: 14),
                ],
            ],
          ),
        );
      },
    );
  }
}
