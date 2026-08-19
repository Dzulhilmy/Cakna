import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../state/hub_content.dart';
import '../widgets/hub_custom_sections.dart';

class HubSetemScreen extends StatelessWidget {
  const HubSetemScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hub = context.watch<HubContent>();
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
                  _buildChallenges(hub),
                  const SizedBox(height: 20),
                  _buildWhatIsSetem(hub),
                  const SizedBox(height: 20),
                  _buildFeatures(hub),
                  const SizedBox(height: 20),
                  _buildAudience(hub),
                  const SizedBox(height: 20),
                  _buildFlow(hub),
                  const SizedBox(height: 20),
                  _buildCta(hub),
                  const SizedBox(height: 8),
                  HubCustomSections(
                    sections: hub.mapList(['customSections', 'setem']),
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

  Widget _buildHeader(BuildContext context, HubContent hub) {
    final eyebrow = hub.s(['setemPage', 'eyebrow'], 'SETEM');
    final heading = hub.s(['setemPage', 'heading'], 'Math Therapy Seminar');
    final subtext = hub.s(
      ['setemPage', 'subtext'],
      'Merapatkan jurang matematik, satu pelajar pada satu masa — '
          'bengkel khusus yang membantu pelajar mengatasi ketakutan terhadap matematik.',
    );
    return Container(
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 20, 20, 48),
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
          Text(eyebrow,
              style: const TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 36,
                  fontWeight: FontWeight.w700,
                  color: Colors.white)),
          const SizedBox(height: 4),
          Text(heading,
              style: const TextStyle(
                  fontSize: 16,
                  color: Colors.white70,
                  fontWeight: FontWeight.w500)),
          const SizedBox(height: 10),
          Text(subtext,
              style: const TextStyle(fontSize: 13, color: Colors.white60, height: 1.5)),
        ],
      ),
    );
  }

  Widget _buildChallenges(HubContent hub) {
    final gapTitle = hub.s(['setemPage', 'gapTitle'], 'Cabaran yang Kita Hadapi');
    final gapSubtitle = hub.s(['setemPage', 'gapSubtitle'], '');
    final raw = hub.mapList(['setemPage', 'gapStats']);
    final stats = raw.isNotEmpty
        ? raw.take(2).map((s) => (s['value'] as String? ?? '', s['label'] as String? ?? '')).toList()
        : [
            ('40%', 'Pelajar mengalami kebimbangan matematik'),
            ('PISA\n2018', 'Malaysia di bawah purata antarabangsa'),
          ];
    // third gapStat used as the warning note (Low Proficiency row)
    final warningLabel = raw.length > 2
        ? (raw[2]['label'] as String? ?? '')
        : 'Ramai pelajar sekolah rendah masih kesukaran dengan aritmetik asas.';
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(gapTitle),
        if (gapSubtitle.isNotEmpty) ...[
          const SizedBox(height: 4),
          Text(gapSubtitle,
              style: const TextStyle(fontSize: 12.5, color: Color(0xFF6B7280), height: 1.4)),
        ],
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(
              child: _StatCard(
                value: stats[0].$1,
                label: stats[0].$2,
                color: const Color(0xFFEF4444),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: _StatCard(
                value: stats.length > 1 ? stats[1].$1 : 'PISA\n2018',
                label: stats.length > 1 ? stats[1].$2 : 'Malaysia di bawah purata antarabangsa',
                color: const Color(0xFFF59E0B),
              ),
            ),
          ],
        ),
        if (warningLabel.isNotEmpty) ...[
          const SizedBox(height: 10),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Row(
              children: [
                const Icon(Icons.warning_amber_rounded, color: Color(0xFFF59E0B), size: 20),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    warningLabel,
                    style: const TextStyle(fontSize: 13, color: Color(0xFF374151), height: 1.5),
                  ),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildWhatIsSetem(HubContent hub) {
    final whatEyebrow = hub.s(['setemPage', 'whatEyebrow'], 'Do You Know SETEM?');
    final whatTitle = hub.s(['setemPage', 'whatTitle'], 'What is SETEM?');
    final body = hub.s(
      ['setemPage', 'whatBody'],
      'SETEM ialah bengkel khusus yang direka untuk membantu pelajar mengatasi '
          'ketakutan dan kesukaran dengan matematik. Menggunakan pendekatan terapeutik '
          'yang diperibadikan, SETEM bertujuan untuk meningkatkan keyakinan pelajar, '
          'memperbaiki pemahaman mereka, dan menjadikan pembelajaran matematik menyeronokkan.',
    );
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(whatEyebrow.toUpperCase(),
              style: const TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFFD94F6A),
                  letterSpacing: 1.2)),
          const SizedBox(height: 6),
          Text(whatTitle,
              style: const TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827))),
          const SizedBox(height: 10),
          Text(body,
              style: const TextStyle(fontSize: 13.5, color: Color(0xFF374151), height: 1.65)),
        ],
      ),
    );
  }

  Widget _buildFeatures(HubContent hub) {
    final expectTitle = hub.s(['setemPage', 'expectTitle'], 'What to Expect');
    final raw = hub.strList(['setemPage', 'expect']);
    final labels = raw.isNotEmpty
        ? raw
        : [
            'Bengkel Interaktif',
            'Aktiviti Matematik Menarik',
            'Tingkat Keyakinan Matematik',
            'Pembelajaran Kolaboratif & Seronok',
            'Teknik Matematik Gunaan',
            'Pendekatan Whole-Brain Learning',
          ];
    final iconMap = <String, IconData>{
      for (final e in [
        ('interactive', Icons.group_work_outlined),
        ('engaging', Icons.extension_outlined),
        ('confidence', Icons.trending_up),
        ('collaborative', Icons.emoji_people_outlined),
        ('applied', Icons.calculate_outlined),
        ('whole-brain', Icons.psychology_outlined),
        ('bengkel', Icons.group_work_outlined),
        ('aktiviti', Icons.extension_outlined),
        ('keyakinan', Icons.trending_up),
        ('kolaboratif', Icons.emoji_people_outlined),
        ('teknik', Icons.calculate_outlined),
        ('whole', Icons.psychology_outlined),
      ])
        e.$1: e.$2,
    };
    IconData iconFor(String label) {
      final lower = label.toLowerCase();
      for (final entry in iconMap.entries) {
        if (lower.contains(entry.key)) return entry.value;
      }
      return Icons.check_circle_outline;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _SectionTitle(expectTitle),
        const SizedBox(height: 12),
        Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Column(
            children: [
              for (var i = 0; i < labels.length; i++) ...[
                if (i > 0) const Divider(height: 1, indent: 16, endIndent: 16),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 13),
                  child: Row(
                    children: [
                      Icon(iconFor(labels[i]), size: 20, color: const Color(0xFFD94F6A)),
                      const SizedBox(width: 12),
                      Text(labels[i],
                          style: const TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w500,
                              color: Color(0xFF374151))),
                    ],
                  ),
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildAudience(HubContent hub) {
    final audienceEyebrow = hub.s(['setemPage', 'audienceEyebrow'], 'Who Should Join?');
    final audienceTitle = hub.s(['setemPage', 'audienceTitle'], 'A New Approach to Learning Math');
    final raw = hub.mapList(['setemPage', 'audience']);
    final groups = raw.isNotEmpty
        ? raw.map((g) => (g['title'] as String? ?? '', g['desc'] as String? ?? '')).toList()
        : [
            ('Pelajar', 'Pelajar sekolah rendah dan menengah yang kesukaran dengan matematik asas.'),
            ('Yang Mengalami Kebimbangan', 'Sesiapa yang mengalami kebimbangan atau fobia terhadap matematik.'),
            ('Ibu Bapa', 'Ibu bapa yang ingin memahami kaedah terapi matematik untuk anak mereka.'),
          ];
    final icons = [
      Icons.school_outlined,
      Icons.sentiment_dissatisfied_outlined,
      Icons.family_restroom_outlined,
    ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(audienceEyebrow.toUpperCase(),
            style: const TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFFD94F6A),
                letterSpacing: 1.2)),
        const SizedBox(height: 4),
        _SectionTitle(audienceTitle),
        const SizedBox(height: 12),
        for (var i = 0; i < groups.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: const BoxDecoration(
                        color: Color(0xFFFFF1F3), shape: BoxShape.circle),
                    child: Icon(
                      i < icons.length ? icons[i] : Icons.person_outline,
                      color: const Color(0xFFD94F6A),
                      size: 20,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(groups[i].$1,
                            style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF111827))),
                        const SizedBox(height: 3),
                        Text(groups[i].$2,
                            style: const TextStyle(
                                fontSize: 12.5, color: Color(0xFF6B7280), height: 1.4)),
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

  Widget _buildFlow(HubContent hub) {
    final processEyebrow = hub.s(['setemPage', 'processEyebrow'], 'Want Us at Your School?');
    final processTitle = hub.s(['setemPage', 'processTitle'], "Here's the Simple Flow");
    final raw = hub.mapList(['setemPage', 'steps']);
    final steps = raw.isNotEmpty
        ? raw.map((s) => (s['title'] as String? ?? '', s['desc'] as String? ?? '')).toList()
        : [
            ('Isi Borang', 'Sediakan maklumat asas tentang sekolah dan minat anda terhadap SETEM.'),
            ('Pengesahan & Tindak Lanjut', 'Pasukan kami akan menyemak dan menghubungi anda.'),
            ('Perbincangan Program', 'Kami berbincang jadual program mengikut keperluan sekolah.'),
            ('Pengesahan Akhir', 'Sahkan tarikh, logistik, dan keperluan untuk pelaksanaan lancar.'),
            ('SETEM Bermula!', 'Bersedia untuk pengalaman matematik yang bermakna di sekolah anda!'),
          ];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(processEyebrow.toUpperCase(),
            style: const TextStyle(
                fontSize: 10.5,
                fontWeight: FontWeight.w700,
                color: Color(0xFFD94F6A),
                letterSpacing: 1.2)),
        const SizedBox(height: 4),
        _SectionTitle(processTitle),
        const SizedBox(height: 12),
        for (var i = 0; i < steps.length; i++)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Column(
                  children: [
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: i == steps.length - 1
                            ? const Color(0xFFD94F6A)
                            : const Color(0xFFF3F4F6),
                        shape: BoxShape.circle,
                        border: Border.all(
                            color: i == steps.length - 1
                                ? const Color(0xFFD94F6A)
                                : const Color(0xFFE5E7EB)),
                      ),
                      child: Center(
                        child: Text('${i + 1}',
                            style: TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                                color: i == steps.length - 1
                                    ? Colors.white
                                    : const Color(0xFF374151))),
                      ),
                    ),
                    if (i < steps.length - 1)
                      Container(width: 2, height: 28, color: const Color(0xFFE5E7EB)),
                  ],
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 4),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(steps[i].$1,
                            style: const TextStyle(
                                fontSize: 13.5,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFF111827))),
                        const SizedBox(height: 3),
                        Text(steps[i].$2,
                            style: const TextStyle(
                                fontSize: 12.5, color: Color(0xFF6B7280), height: 1.4)),
                        const SizedBox(height: 8),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
      ],
    );
  }

  Widget _buildCta(HubContent hub) {
    final ctaHeading = hub.s(['setemPage', 'ctaHeading'], 'Bawa SETEM ke Sekolah Anda');
    final ctaText = hub.s(
      ['setemPage', 'ctaText'],
      'Berikan setiap pelajar peluang untuk cemerlang dalam matematik.',
    );
    final ctaLabel = hub.s(['setemPage', 'ctaLabel'], '');
    final ctaHref = hub.s(['setemPage', 'ctaHref'], '');
    final phone = hub.s(['footer', 'phone'], '011-2111 0110');
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFD94F6A), Color(0xFF9E2A42)],
        ),
        borderRadius: BorderRadius.circular(18),
      ),
      child: Column(
        children: [
          Text(ctaHeading,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.white)),
          const SizedBox(height: 6),
          Text(
            ctaText,
            textAlign: TextAlign.center,
            style: const TextStyle(fontSize: 13, color: Colors.white70, height: 1.5),
          ),
          const SizedBox(height: 14),
          if (ctaLabel.isNotEmpty)
            GestureDetector(
              onTap: () async {
                final uri = Uri.tryParse(ctaHref);
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
                child: Text(ctaLabel,
                    style: const TextStyle(
                        fontSize: 13.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFFD94F6A))),
              ),
            )
          else
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.phone_outlined, size: 16, color: Colors.white),
                const SizedBox(width: 6),
                Text(phone,
                    style: const TextStyle(
                        fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
              ],
            ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) {
    return Text(text,
        style: const TextStyle(
            fontFamily: 'Lora',
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: Color(0xFF111827)));
  }
}

class _StatCard extends StatelessWidget {
  final String value, label;
  final Color color;
  const _StatCard({required this.value, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withValues(alpha: 0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(value,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: color)),
          const SizedBox(height: 4),
          Text(label,
              style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280), height: 1.4)),
        ],
      ),
    );
  }
}
