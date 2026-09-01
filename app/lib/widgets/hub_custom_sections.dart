import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../api/cakna_api.dart';

/// Renders the admin-created custom sections for a hub page.
/// Pass [sections] from hub.mapList(['customSections', pageKey]).
/// Data shape: { id, background, eyebrow?, title, blocks: SectionBlock[], ctaLabel?, ctaHref? }
/// SectionBlock: { id, type: "paragraph"|"text"|"image"|"bulletList", content?, align?,
///                 images?, imageStyle?, caption?, items?, itemDescriptions? }
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
    final bg = data['background'] as String? ?? 'white';
    final bgColor = bg == 'tint' ? const Color(0xFFF7F6F2) : Colors.white;
    final eyebrow = data['eyebrow'] as String? ?? '';
    final title = data['title'] as String? ?? '';
    final rawBlocks = data['blocks'];
    final blocks = (rawBlocks is List ? rawBlocks : <dynamic>[])
        .where((b) => b is Map)
        .map((b) => Map<String, dynamic>.from(b as Map))
        .toList();
    final ctaLabel = data['ctaLabel'] as String? ?? '';
    final ctaHref = data['ctaHref'] as String? ?? '';

    return Container(
      color: bgColor,
      padding: const EdgeInsets.fromLTRB(16, 24, 16, 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (eyebrow.isNotEmpty) ...[_eyebrowText(eyebrow), const SizedBox(height: 6)],
          if (title.isNotEmpty) _titleText(title),
          if (blocks.isNotEmpty) ...[
            const SizedBox(height: 12),
            for (final block in blocks) ...[
              _BlockWidget(data: block),
              const SizedBox(height: 8),
            ],
          ],
          if (ctaLabel.isNotEmpty) _ctaButton(ctaLabel, ctaHref),
        ],
      ),
    );
  }
}

// ── Block renderer ─────────────────────────────────────────────────────────

class _BlockWidget extends StatelessWidget {
  final Map<String, dynamic> data;
  const _BlockWidget({required this.data});

  @override
  Widget build(BuildContext context) {
    final type = data['type'] as String? ?? 'paragraph';
    switch (type) {
      case 'paragraph':
        final content = data['content'] as String? ?? '';
        if (content.trim().isEmpty) return const SizedBox.shrink();
        final align = data['align'] as String? ?? 'left';
        return Text(
          content,
          textAlign: switch (align) {
            'center' => TextAlign.center,
            'right' => TextAlign.right,
            'justify' => TextAlign.justify,
            _ => TextAlign.left,
          },
          style: const TextStyle(fontSize: 13.5, color: Color(0xFF6B7280), height: 1.6),
        );

      case 'text':
        final content = data['content'] as String? ?? '';
        if (content.trim().isEmpty) return const SizedBox.shrink();
        return Text(
          content,
          style: const TextStyle(
              fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF374151)),
        );

      case 'image':
        final rawImages = data['images'];
        final images = (rawImages is List ? rawImages : <dynamic>[])
            .map((e) => e?.toString() ?? '')
            .where((e) => e.isNotEmpty)
            .toList();
        if (images.isEmpty) return const SizedBox.shrink();
        final imageStyle = data['imageStyle'] as String? ?? 'gallery';
        final caption = data['caption'] as String? ?? '';
        return _ImageBlock(images: images, imageStyle: imageStyle, caption: caption);

      case 'bulletList':
        final rawItems = data['items'];
        final items = (rawItems is List ? rawItems : <dynamic>[])
            .map((e) => e?.toString() ?? '')
            .where((e) => e.isNotEmpty)
            .toList();
        if (items.isEmpty) return const SizedBox.shrink();
        final rawDescs = data['itemDescriptions'];
        final descs = (rawDescs is List ? rawDescs : <dynamic>[])
            .map((d) => d?.toString() ?? '')
            .toList();
        return _BulletListBlock(items: List<String>.from(items), itemDescriptions: descs);

      default:
        return const SizedBox.shrink();
    }
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

class _ImageBlock extends StatelessWidget {
  final List<String> images;
  final String imageStyle;
  final String caption;
  const _ImageBlock(
      {required this.images, required this.imageStyle, required this.caption});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (images.length == 1)
          _networkImage(images.first)
        else
          SizedBox(
            height: 160,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              itemCount: images.length,
              itemBuilder: (_, i) => Container(
                width: 220,
                margin: const EdgeInsets.only(right: 10),
                clipBehavior: Clip.antiAlias,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Image.network(
                  CaknaApi.resolveHubUrl(images[i]),
                  fit: BoxFit.cover,
                  errorBuilder: (_, __, ___) => const Center(
                    child: Icon(Icons.image_outlined,
                        color: Color(0xFFD1D5DB), size: 28),
                  ),
                ),
              ),
            ),
          ),
        if (caption.trim().isNotEmpty) ...[
          const SizedBox(height: 6),
          Text(caption,
              style: const TextStyle(
                  fontSize: 11.5, color: Color(0xFF9CA3AF), height: 1.4)),
        ],
      ],
    );
  }
}

class _BulletListBlock extends StatelessWidget {
  final List<String> items;
  final List<String> itemDescriptions;
  const _BulletListBlock(
      {required this.items, required this.itemDescriptions});

  @override
  Widget build(BuildContext context) {
    final hasDescs = itemDescriptions.any((d) => d.trim().isNotEmpty);
    if (hasDescs) {
      return _AccordionList(items: items, itemDescriptions: itemDescriptions);
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        for (var i = 0; i < items.length; i++)
          if (items[i].trim().isNotEmpty)
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
                    child: Text(items[i],
                        style: const TextStyle(
                            fontSize: 13.5,
                            color: Color(0xFF374151),
                            height: 1.5)),
                  ),
                ],
              ),
            ),
      ],
    );
  }
}

class _AccordionList extends StatefulWidget {
  final List<String> items;
  final List<String> itemDescriptions;
  const _AccordionList({required this.items, required this.itemDescriptions});

  @override
  State<_AccordionList> createState() => _AccordionListState();
}

class _AccordionListState extends State<_AccordionList> {
  int _openIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        for (var i = 0; i < widget.items.length; i++)
          if (widget.items[i].trim().isNotEmpty) ...[
            if (i > 0) const SizedBox(height: 6),
            _AccordionCard(
              title: widget.items[i],
              desc: i < widget.itemDescriptions.length
                  ? widget.itemDescriptions[i]
                  : '',
              isOpen: _openIndex == i,
              onTap: () =>
                  setState(() => _openIndex = _openIndex == i ? -1 : i),
            ),
          ],
      ],
    );
  }
}

class _AccordionCard extends StatelessWidget {
  final String title;
  final String desc;
  final bool isOpen;
  final VoidCallback onTap;
  const _AccordionCard({
    required this.title,
    required this.desc,
    required this.isOpen,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: double.infinity,
        decoration: BoxDecoration(
          color: const Color(0xFFFFF1F3),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: isOpen ? const Color(0xFFD94F6A) : const Color(0xFFFCE7EB),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 11, 12, 11),
              child: Row(
                children: [
                  Expanded(
                    child: Text(
                      title,
                      style: const TextStyle(
                          fontSize: 13.5,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFFD94F6A)),
                    ),
                  ),
                  AnimatedRotation(
                    turns: isOpen ? 0.125 : 0,
                    duration: const Duration(milliseconds: 200),
                    child: const Text(
                      '+',
                      style: TextStyle(
                          fontSize: 20,
                          color: Color(0xFF9CA3AF),
                          fontWeight: FontWeight.w300,
                          height: 1),
                    ),
                  ),
                ],
              ),
            ),
            AnimatedSize(
              duration: const Duration(milliseconds: 200),
              curve: Curves.easeInOut,
              child: isOpen && desc.trim().isNotEmpty
                  ? Padding(
                      padding: const EdgeInsets.fromLTRB(12, 0, 12, 11),
                      child: Text(
                        desc,
                        style: const TextStyle(
                            fontSize: 12.5,
                            color: Color(0xFF6B7280),
                            height: 1.4),
                      ),
                    )
                  : const SizedBox.shrink(),
            ),
          ],
        ),
      ),
    );
  }
}
