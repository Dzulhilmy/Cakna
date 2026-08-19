import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../api/cakna_api.dart';

/// Renders the admin-created custom sections for a hub page.
/// Pass [sections] from hub.mapList(['customSections', pageKey]).
class HubCustomSections extends StatelessWidget {
  final List<Map<String, dynamic>> sections;
  const HubCustomSections({super.key, required this.sections});

  @override
  Widget build(BuildContext context) {
    if (sections.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (final s in sections) _CustomSection(data: s),
      ],
    );
  }
}

class _CustomSection extends StatelessWidget {
  final Map<String, dynamic> data;
  const _CustomSection({required this.data});

  @override
  Widget build(BuildContext context) {
    final layout = data['layout'] as String? ?? 'text';
    final bg = data['background'] as String? ?? 'white';
    final bgColor = bg == 'tint' ? const Color(0xFFF7F6F2) : Colors.white;

    return Container(
      color: bgColor,
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
      child: switch (layout) {
        'gallery' => _GalleryLayout(data: data),
        'bullets' => _BulletsLayout(data: data),
        'imageText' => _ImageTextLayout(data: data),
        _ => _TextLayout(data: data),
      },
    );
  }
}

// ── shared helpers ─────────────────────────────────────────────────────────

Widget _eyebrowText(String text) => Text(
      text.toUpperCase(),
      style: const TextStyle(
          fontSize: 10.5,
          fontWeight: FontWeight.w700,
          color: Color(0xFFD94F6A),
          letterSpacing: 1.2),
    );

Widget _titleText(String text) => Text(
      text,
      style: const TextStyle(
          fontFamily: 'Lora',
          fontSize: 18,
          fontWeight: FontWeight.w700,
          color: Color(0xFF111827),
          height: 1.3),
    );

Widget _bodyParagraphs(String body) {
  final paras =
      body.split(RegExp(r'\n\s*\n')).where((p) => p.trim().isNotEmpty).toList();
  if (paras.isEmpty) return const SizedBox.shrink();
  return Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      for (final p in paras) ...[
        const SizedBox(height: 10),
        Text(p,
            style: const TextStyle(
                fontSize: 13.5, color: Color(0xFF374151), height: 1.6)),
      ],
    ],
  );
}

Widget _ctaButton(String label, String href) {
  if (label.isEmpty) return const SizedBox.shrink();
  return Padding(
    padding: const EdgeInsets.only(top: 16),
    child: GestureDetector(
      onTap: () async {
        final uri = Uri.tryParse(href);
        if (uri != null) await launchUrl(uri, mode: LaunchMode.externalApplication);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 11),
        decoration: BoxDecoration(
          color: const Color(0xFFD94F6A),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Text(label,
            style: const TextStyle(
                color: Colors.white,
                fontSize: 13.5,
                fontWeight: FontWeight.w600)),
      ),
    ),
  );
}

Widget _networkImage(String url, {double height = 200}) {
  final resolved = CaknaApi.resolveHubUrl(url);
  return ClipRRect(
    borderRadius: BorderRadius.circular(14),
    child: Image.network(
      resolved,
      height: height,
      width: double.infinity,
      fit: BoxFit.cover,
      errorBuilder: (ctx, err, st) => Container(
        height: height,
        color: const Color(0xFFF3F4F6),
        child: const Center(
          child: Icon(Icons.image_outlined, color: Color(0xFFD1D5DB), size: 32),
        ),
      ),
      loadingBuilder: (_, child, progress) {
        if (progress == null) return child;
        return Container(
          height: height,
          color: const Color(0xFFF3F4F6),
          child: const Center(
            child: CircularProgressIndicator(
                strokeWidth: 2, color: Color(0xFFD94F6A)),
          ),
        );
      },
    ),
  );
}

// ── layout variants ────────────────────────────────────────────────────────

class _TextLayout extends StatelessWidget {
  final Map<String, dynamic> data;
  const _TextLayout({required this.data});

  @override
  Widget build(BuildContext context) {
    final eyebrow = data['eyebrow'] as String? ?? '';
    final title = data['title'] as String? ?? '';
    final body = data['body'] as String? ?? '';
    final ctaLabel = data['ctaLabel'] as String? ?? '';
    final ctaHref = data['ctaHref'] as String? ?? '';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (eyebrow.isNotEmpty) ...[_eyebrowText(eyebrow), const SizedBox(height: 6)],
        if (title.isNotEmpty) _titleText(title),
        if (body.isNotEmpty) _bodyParagraphs(body),
        if (ctaLabel.isNotEmpty) _ctaButton(ctaLabel, ctaHref),
      ],
    );
  }
}

class _ImageTextLayout extends StatelessWidget {
  final Map<String, dynamic> data;
  const _ImageTextLayout({required this.data});

  @override
  Widget build(BuildContext context) {
    final eyebrow = data['eyebrow'] as String? ?? '';
    final title = data['title'] as String? ?? '';
    final body = data['body'] as String? ?? '';
    final ctaLabel = data['ctaLabel'] as String? ?? '';
    final ctaHref = data['ctaHref'] as String? ?? '';
    final images = (data['images'] as List<dynamic>?)?.whereType<String>().toList() ?? [];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (images.isNotEmpty) ...[
          _networkImage(images.first),
          const SizedBox(height: 14),
        ],
        if (eyebrow.isNotEmpty) ...[_eyebrowText(eyebrow), const SizedBox(height: 6)],
        if (title.isNotEmpty) _titleText(title),
        if (body.isNotEmpty) _bodyParagraphs(body),
        if (ctaLabel.isNotEmpty) _ctaButton(ctaLabel, ctaHref),
      ],
    );
  }
}

class _GalleryLayout extends StatelessWidget {
  final Map<String, dynamic> data;
  const _GalleryLayout({required this.data});

  @override
  Widget build(BuildContext context) {
    final eyebrow = data['eyebrow'] as String? ?? '';
    final title = data['title'] as String? ?? '';
    final images = (data['images'] as List<dynamic>?)?.whereType<String>().toList() ?? [];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (eyebrow.isNotEmpty) ...[_eyebrowText(eyebrow), const SizedBox(height: 6)],
        if (title.isNotEmpty) _titleText(title),
        if (images.isNotEmpty) ...[
          const SizedBox(height: 12),
          SizedBox(
            height: 180,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: images.length,
              itemBuilder: (_, i) => Container(
                width: 240,
                margin: const EdgeInsets.only(right: 10),
                clipBehavior: Clip.antiAlias,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Image.network(
                  CaknaApi.resolveHubUrl(images[i]),
                  fit: BoxFit.cover,
                  errorBuilder: (ctx, err, st) => const Center(
                    child: Icon(Icons.image_outlined,
                        color: Color(0xFFD1D5DB), size: 28),
                  ),
                ),
              ),
            ),
          ),
        ],
      ],
    );
  }
}

class _BulletsLayout extends StatelessWidget {
  final Map<String, dynamic> data;
  const _BulletsLayout({required this.data});

  @override
  Widget build(BuildContext context) {
    final eyebrow = data['eyebrow'] as String? ?? '';
    final title = data['title'] as String? ?? '';
    final body = data['body'] as String? ?? '';
    final ctaLabel = data['ctaLabel'] as String? ?? '';
    final ctaHref = data['ctaHref'] as String? ?? '';
    final bullets =
        (data['bullets'] as List<dynamic>?)?.whereType<String>().toList() ?? [];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (eyebrow.isNotEmpty) ...[_eyebrowText(eyebrow), const SizedBox(height: 6)],
        if (title.isNotEmpty) _titleText(title),
        if (body.isNotEmpty) _bodyParagraphs(body),
        if (bullets.isNotEmpty) ...[
          const SizedBox(height: 12),
          for (final b in bullets)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Padding(
                    padding: EdgeInsets.only(top: 6),
                    child: CircleAvatar(
                        radius: 3, backgroundColor: Color(0xFFD94F6A)),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(b,
                        style: const TextStyle(
                            fontSize: 13.5,
                            color: Color(0xFF374151),
                            height: 1.5)),
                  ),
                ],
              ),
            ),
        ],
        if (ctaLabel.isNotEmpty) _ctaButton(ctaLabel, ctaHref),
      ],
    );
  }
}
