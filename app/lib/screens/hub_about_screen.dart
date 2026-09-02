import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../api/cakna_api.dart';
import '../state/hub_content.dart';
import '../widgets/hub_custom_sections.dart';

class HubAboutScreen extends StatelessWidget {
  const HubAboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hub = context.watch<HubContent>();
    final order = hub.aboutSectionOrder();

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
                  for (final key in order.where((k) => k != 'hero'))
                    ..._widgetsForKey(key, hub),
                  const SizedBox(height: 32),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _widgetsForKey(String key, HubContent hub) {
    switch (key) {
      case 'whoWeAre':
        return [_buildWhoWeAre(hub), const SizedBox(height: 20), ..._buildVisionMission(hub), const SizedBox(height: 20)];
      case 'purpose':
        return [_buildPurposes(hub), const SizedBox(height: 20)];
      case 'collabStats':
        return [_buildStats(hub), const SizedBox(height: 20)];
      case 'testimonial':
        return [_buildQuote(hub), const SizedBox(height: 20)];
      case 'cta':
        return [_buildCta(hub), const SizedBox(height: 8)];
      case 'customSections':
        return [HubCustomSections(sections: hub.mapList(['customSections', 'about']))];
      default:
        return [];
    }
  }

  Widget _buildHeader(BuildContext context, HubContent hub) {
    final eyebrow = hub.s(['aboutPage', 'eyebrow'], 'Tentang Kami');
    final heading = hub.s(['aboutPage', 'heading'], 'Who We Are & Why We Exist');
    final images = hub.strList(['aboutPage', 'heroBgImages']);
    final overlayVal = hub.s(['aboutPage', 'heroOverlay'], 'medium');
    final overlayOpacity = overlayVal == 'light' ? 0.15 : overlayVal == 'dark' ? 0.5 : 0.3;

    const padding = EdgeInsets.fromLTRB(20, 0, 20, 48);
    const radius = BorderRadius.only(
      bottomLeft: Radius.circular(28),
      bottomRight: Radius.circular(28),
    );
    final topPad = MediaQuery.of(context).padding.top + 20;

    final content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(height: topPad),
        Text(eyebrow,
            style: const TextStyle(
                fontFamily: 'Lora',
                fontSize: 28,
                fontWeight: FontWeight.w700,
                color: Colors.white,
                height: 1.2)),
        const SizedBox(height: 8),
        Text(heading, style: const TextStyle(fontSize: 14, color: Colors.white70)),
      ],
    );

    if (images.isNotEmpty) {
      return ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: [
            Positioned.fill(
              child: Image.network(CaknaApi.resolveHubUrl(images[0]), fit: BoxFit.cover),
            ),
            Positioned.fill(
              child: Container(
                  color: Color.fromRGBO(0, 0, 0, overlayOpacity + 0.2)),
            ),
            Padding(padding: padding, child: content),
          ],
        ),
      );
    }

    return Container(
      padding: padding,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF9E2A42), Color(0xFF6B1830)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: radius,
      ),
      child: content,
    );
  }

  Widget _buildWhoWeAre(HubContent hub) {
    final whoTitle = hub.s(['aboutPage', 'whoTitle'], 'HOME Cakna');
    final body = hub.s(
      ['aboutPage', 'whoBody'],
      'HOME Cakna ialah inisiatif Tanggungjawab Sosial Korporat (TSK) HOME, '
          'ditubuhkan pada 2018. Kami berdedikasi untuk mewujudkan perubahan bermakna '
          'melalui program yang berfokus kepada pendidikan, kesejahteraan, dan kelestarian.',
    );
    final quote = hub.s(['about', 'quote'], 'Service: Our Mission, Equation: Our Passion.');
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Label(whoTitle.toUpperCase()),
          const SizedBox(height: 10),
          Text(whoTitle,
              style: const TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827))),
          const SizedBox(height: 10),
          Text(body,
              style: const TextStyle(fontSize: 13.5, color: Color(0xFF374151), height: 1.6)),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1F3),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFFFCDD5)),
            ),
            child: Text(
              '"$quote"',
              style: const TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 14,
                  fontStyle: FontStyle.italic,
                  color: Color(0xFFD94F6A),
                  fontWeight: FontWeight.w600),
            ),
          ),
        ],
      ),
    );
  }

  List<Widget> _buildVisionMission(HubContent hub) {
    final visionTitle = hub.s(['aboutPage', 'visionTitle'], 'Our Vision');
    final visionText = hub.s(
      ['aboutPage', 'visionText'],
      'To be the cornerstone of positive change, where HOME connects individuals, '
          'families, and communities to opportunities that empower, nurture, and sustain brighter futures.',
    );
    final missionTitle = hub.s(['aboutPage', 'visionTitle2'], '');
    final missionText = hub.s(['aboutPage', 'visionText2'], '');

    Widget card(String title, String text) => _Card(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _Label(title.toUpperCase()),
              const SizedBox(height: 10),
              Text(text,
                  style: const TextStyle(fontSize: 13.5, color: Color(0xFF374151), height: 1.6)),
            ],
          ),
        );

    return [
      card(visionTitle, visionText),
      if (missionTitle.isNotEmpty) ...[const SizedBox(height: 12), card(missionTitle, missionText)],
    ];
  }

  Widget _buildPurposes(HubContent hub) {
    final raw = hub.mapList(['aboutPage', 'purpose']);
    final items = raw.isNotEmpty
        ? raw.map((p) => (p['title'] as String? ?? '', p['desc'] as String? ?? '')).toList()
        : [
            ('Transformasi Kehidupan Melalui Pendidikan',
                'Menyediakan program yang mudah diakses untuk membantu pelajar mengatasi halangan pembelajaran dan mencapai kejayaan.'),
            ('Mewujudkan Perubahan Sosial yang Berkekalan',
                'Memartabatkan komuniti melalui program TSK lestari yang menangani keperluan pendidikan, kebajikan, dan alam sekitar.'),
            ('Membina Komuniti yang Lebih Kukuh & Inklusif',
                'Memupuk perpaduan dan sokongan untuk semua, tanpa meninggalkan sesiapa.'),
            ('Memperkasa Generasi Seterusnya',
                'Menyediakan sumber pendidikan, bantuan kewangan, dan bimbingan untuk pelajar.'),
          ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(bottom: 4),
          child: Text(
            hub.s(['aboutPage', 'purposeTitle'], 'Matlamat Kami'),
            style: const TextStyle(
                fontFamily: 'Lora',
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Color(0xFF111827)),
          ),
        ),
        Builder(builder: (context) {
          final sub = hub.s(['aboutPage', 'purposeSubtitle'], '');
          if (sub.isEmpty) return const SizedBox(height: 12);
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Text(sub,
                style: const TextStyle(fontSize: 13, color: Color(0xFF6B7280))),
          );
        }),
        for (var i = 0; i < items.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: _Card(
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 28,
                    height: 28,
                    decoration: const BoxDecoration(
                        color: Color(0xFFD94F6A), shape: BoxShape.circle),
                    child: Center(
                      child: Text('${i + 1}',
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 13,
                              fontWeight: FontWeight.w700)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(items[i].$1,
                            style: const TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF111827))),
                        const SizedBox(height: 4),
                        Text(items[i].$2,
                            style: const TextStyle(
                                fontSize: 12.5, color: Color(0xFF6B7280), height: 1.5)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildStats(HubContent hub) {
    final raw = hub.mapList(['aboutPage', 'stats']);
    final items = raw.isNotEmpty
        ? raw.take(3).map((s) => (s['value'] as String? ?? '', s['label'] as String? ?? '')).toList()
        : [('200+', 'Francaisi'), ('5,000+', 'Kehidupan'), ('300+', 'Program TSK')];
    final collabTitle = hub.s(['aboutPage', 'collabTitle'], '');
    final collabSubtitle = hub.s(['aboutPage', 'collabSubtitle'], '');
    return _Card(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _Label(hub.s(['aboutPage', 'collabEyebrow'], 'Kolaborasi Nasional').toUpperCase()),
          if (collabTitle.isNotEmpty) ...[
            const SizedBox(height: 6),
            Text(collabTitle,
                style: const TextStyle(
                    fontFamily: 'Lora',
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827))),
          ],
          if (collabSubtitle.isNotEmpty) ...[
            const SizedBox(height: 4),
            Text(collabSubtitle,
                style: const TextStyle(fontSize: 12.5, color: Color(0xFF6B7280), height: 1.4)),
          ],
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              for (var i = 0; i < items.length; i++) ...[
                if (i > 0) const _VLine(),
                _StatItem(value: items[i].$1, label: items[i].$2),
              ],
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildQuote(HubContent hub) {
    final testimonial = hub.s(
      ['aboutPage', 'testimonial'],
      'Menjadi francaisi HOME bukan sekadar menjalankan perniagaan. '
          'Ia tentang memberi balik kepada komuniti. Melalui HOME Cakna, '
          'kami menjadi sebahagian daripada sesuatu yang lebih besar — '
          'membantu pelajar di luar bilik darjah.',
    );
    final author = hub.s(['aboutPage', 'testimonialAuthor'], 'Rithauddin, HOME Sungai Besar');
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: const Color(0xFF111827),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '"$testimonial"',
            style: const TextStyle(
                fontSize: 13,
                color: Colors.white70,
                height: 1.6,
                fontStyle: FontStyle.italic),
          ),
          const SizedBox(height: 10),
          Text('— $author',
              style: const TextStyle(
                  fontSize: 12, color: Color(0xFFD94F6A), fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildCta(HubContent hub) {
    final heading = hub.s(['aboutPage', 'ctaHeading'], '');
    final body = hub.s(['aboutPage', 'ctaText'], '');
    final label = hub.s(['aboutPage', 'ctaLabel'], '');
    final href = hub.s(['aboutPage', 'ctaHref'], '');
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
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
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
}

class _Card extends StatelessWidget {
  final Widget child;
  const _Card({required this.child});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: child,
    );
  }
}

class _Label extends StatelessWidget {
  final String text;
  const _Label(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(text,
        style: const TextStyle(
            fontSize: 10.5,
            fontWeight: FontWeight.w700,
            color: Color(0xFFD94F6A),
            letterSpacing: 1.2));
  }
}

class _StatItem extends StatelessWidget {
  final String value, label;
  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value,
            style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: Color(0xFFD94F6A))),
        const SizedBox(height: 2),
        Text(label,
            style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280))),
      ],
    );
  }
}

class _VLine extends StatelessWidget {
  const _VLine();

  @override
  Widget build(BuildContext context) {
    return Container(width: 1, height: 32, color: const Color(0xFFE5E7EB));
  }
}
