import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../api/cakna_api.dart';
import '../state/hub_content.dart';
import '../widgets/hub_custom_sections.dart';

const _kFallbackStories = [
  _Story(
    date: '25 Mac 2025',
    category: 'CSR Francaisi',
    title: 'Beyond the Classroom: HOME Tanjung Minyak\'s Community Impact',
    excerpt:
        'HOME Tanjung Minyak membuktikan bahawa kitar semula boleh mengubah kehidupan. '
        'Melalui kempen "Recycle to Donate", barangan kitar semula dikumpul dan ditukar '
        'kepada sumbangan untuk Palestin.',
  ),
  _Story(
    date: '10 Februari 2025',
    category: 'CSR Pendidikan',
    title: 'Program Baca & Faham: Membina Asas Literasi di Komuniti B40',
    excerpt:
        'HOME Kelantan melancarkan program literasi mingguan untuk kanak-kanak dari keluarga '
        'B40. Lebih 80 pelajar menerima bimbingan membaca secara percuma.',
  ),
  _Story(
    date: '5 Januari 2025',
    category: 'CSR Alam Sekitar',
    title: 'Go Green: Kempen Penanaman Pokok Bersama Komuniti Setempat',
    excerpt:
        'Lebih 200 pokok ditanam dalam satu hari oleh sukarelawan HOME bersama komuniti '
        'setempat di Selangor. Inisiatif ini sebahagian daripada program Green Cakna.',
  ),
];

class HubCsrScreen extends StatelessWidget {
  const HubCsrScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hub = context.watch<HubContent>();
    final raw = hub.mapList(['csrPage', 'stories']);
    final stories = raw.isNotEmpty
        ? raw
            .map((s) => _Story(
                  date: s['date'] as String? ?? '',
                  category: s['category'] as String? ?? '',
                  title: s['title'] as String? ?? '',
                  excerpt: s['excerpt'] as String? ?? '',
                  cover: s['cover'] as String?,
                  images: (s['images'] as List<dynamic>?)
                          ?.whereType<String>()
                          .toList() ??
                      [],
                ))
            .toList()
        : _kFallbackStories;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F2),
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          _buildHeader(context, hub),
          Transform.translate(
            offset: const Offset(0, -24),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (final s in stories) ...[
                    _StoryCard(story: s),
                    const SizedBox(height: 12),
                  ],
                  const SizedBox(height: 8),
                  _buildCta(hub),
                  const SizedBox(height: 8),
                  HubCustomSections(
                    sections: hub.mapList(['customSections', 'csr']),
                  ),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCta(HubContent hub) {
    final heading = hub.s(['csrPage', 'ctaHeading'], '');
    final body = hub.s(['csrPage', 'ctaText'], '');
    final label = hub.s(['csrPage', 'ctaLabel'], '');
    final href = hub.s(['csrPage', 'ctaHref'], '');
    if (heading.isEmpty && label.isEmpty) return const SizedBox.shrink();
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFD94F6A), Color(0xFF9E2A42)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (heading.isNotEmpty)
            Text(heading,
                style: const TextStyle(
                    fontFamily: 'Lora',
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    height: 1.3)),
          if (body.isNotEmpty) ...[
            const SizedBox(height: 8),
            Text(body,
                style: const TextStyle(
                    fontSize: 13, color: Colors.white70, height: 1.5)),
          ],
          if (label.isNotEmpty) ...[
            const SizedBox(height: 14),
            GestureDetector(
              onTap: () async {
                final uri = Uri.tryParse(href);
                if (uri != null) {
                  await launchUrl(uri, mode: LaunchMode.externalApplication);
                }
              },
              child: Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Text(label,
                    style: const TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFFD94F6A))),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context, HubContent hub) {
    final eyebrow = hub.s(['csrPage', 'eyebrow'], 'CSR Stories');
    final heading = hub.s(['csrPage', 'heading'], 'Berita CSR');
    final subtext =
        hub.s(['csrPage', 'subtext'], 'Kisah-kisah impak komuniti HOME Cakna');
    return Container(
      padding: EdgeInsets.fromLTRB(
          20, MediaQuery.of(context).padding.top + 20, 20, 48),
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
          if (eyebrow.isNotEmpty) ...[
            Text(eyebrow,
                style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: Colors.white60,
                    letterSpacing: 0.8)),
            const SizedBox(height: 6),
          ],
          Text(heading,
              style: const TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: Colors.white)),
          const SizedBox(height: 6),
          Text(subtext,
              style: const TextStyle(fontSize: 13.5, color: Colors.white70)),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────── story card & detail ───

class _StoryCard extends StatelessWidget {
  final _Story story;
  const _StoryCard({required this.story});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => showModalBottomSheet(
        context: context,
        isScrollControlled: true,
        backgroundColor: Colors.transparent,
        builder: (_) => _StoryDetailSheet(story: story),
      ),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 12,
                offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // cover image
            if (story.cover != null && story.cover!.isNotEmpty)
              ClipRRect(
                borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(18)),
                child: Image.network(
                  CaknaApi.resolveHubUrl(story.cover!),
                  height: 180,
                  width: double.infinity,
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const SizedBox.shrink(),
                  loadingBuilder: (_, child, progress) {
                    if (progress == null) return child;
                    return Container(
                      height: 180,
                      color: const Color(0xFFF3F4F6),
                      child: const Center(
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Color(0xFFD94F6A)),
                      ),
                    );
                  },
                ),
              )
            else
              Container(
                height: 4,
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                      colors: [Color(0xFFD94F6A), Color(0xFF9E2A42)]),
                  borderRadius:
                      BorderRadius.vertical(top: Radius.circular(18)),
                ),
              ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFF1F3),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(story.category,
                            style: const TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFFD94F6A))),
                      ),
                      const Spacer(),
                      Text(story.date,
                          style: const TextStyle(
                              fontSize: 11, color: Color(0xFF9CA3AF))),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(story.title,
                      style: const TextStyle(
                          fontFamily: 'Lora',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFF111827),
                          height: 1.3)),
                  const SizedBox(height: 8),
                  Text(story.excerpt,
                      style: const TextStyle(
                          fontSize: 13, color: Color(0xFF6B7280), height: 1.6),
                      maxLines: 3,
                      overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 12),
                  const Row(
                    children: [
                      Text('Baca selanjutnya',
                          style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFFD94F6A))),
                      SizedBox(width: 4),
                      Icon(Icons.arrow_forward_rounded,
                          size: 15, color: Color(0xFFD94F6A)),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _StoryDetailSheet extends StatelessWidget {
  final _Story story;
  const _StoryDetailSheet({required this.story});

  @override
  Widget build(BuildContext context) {
    final hasCover = story.cover != null && story.cover!.isNotEmpty;
    return DraggableScrollableSheet(
      initialChildSize: hasCover ? 0.75 : 0.6,
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
            padding: EdgeInsets.zero,
            children: [
              // drag handle
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE5E7EB),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
              ),
              // cover image
              if (hasCover)
                ClipRRect(
                  child: Image.network(
                    CaknaApi.resolveHubUrl(story.cover!),
                    height: 220,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => const SizedBox.shrink(),
                    loadingBuilder: (_, child, progress) {
                      if (progress == null) return child;
                      return Container(
                        height: 220,
                        color: const Color(0xFFF3F4F6),
                        child: const Center(
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Color(0xFFD94F6A)),
                        ),
                      );
                    },
                  ),
                ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 32),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFFF1F3),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(story.category,
                              style: const TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFFD94F6A))),
                        ),
                        const Spacer(),
                        Text(story.date,
                            style: const TextStyle(
                                fontSize: 12, color: Color(0xFF9CA3AF))),
                      ],
                    ),
                    const SizedBox(height: 14),
                    Text(story.title,
                        style: const TextStyle(
                            fontFamily: 'Lora',
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF111827),
                            height: 1.3)),
                    const SizedBox(height: 14),
                    Text(story.excerpt,
                        style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF374151),
                            height: 1.7)),
                    // gallery
                    if (story.images.isNotEmpty) ...[
                      const SizedBox(height: 24),
                      const Text('GALERI',
                          style: TextStyle(
                              fontSize: 10.5,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF6B7280),
                              letterSpacing: 1.2)),
                      const SizedBox(height: 12),
                      SizedBox(
                        height: 160,
                        child: ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: story.images.length,
                          itemBuilder: (context, index) {
                            return Container(
                              width: 220,
                              margin: const EdgeInsets.only(right: 10),
                              clipBehavior: Clip.antiAlias,
                              decoration: BoxDecoration(
                                color: const Color(0xFFF3F4F6),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Image.network(
                                CaknaApi.resolveHubUrl(story.images[index]),
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) => const Center(
                                  child: Icon(Icons.image_outlined,
                                      color: Color(0xFFD1D5DB), size: 28),
                                ),
                              ),
                            );
                          },
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

// ──────────────────────────────────────────────────────────────── model ────

class _Story {
  final String date, category, title, excerpt;
  final String? cover;
  final List<String> images;
  const _Story({
    required this.date,
    required this.category,
    required this.title,
    required this.excerpt,
    this.cover,
    this.images = const [],
  });
}
