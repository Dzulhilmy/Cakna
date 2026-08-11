import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../api/cakna_api.dart';
import '../state/auth.dart';
import '../state/hub_application_state.dart';
import '../state/hub_content.dart';
import 'app_shell.dart';
import 'hub_profile_screen.dart';

// ─────────────────────────────────────────────────────────────── core data ─

class _CoreInfo {
  final String id, name, sub;
  final IconData icon;
  final Color color;
  const _CoreInfo({
    required this.id,
    required this.name,
    required this.sub,
    required this.icon,
    required this.color,
  });
}

const _kCores = <_CoreInfo>[
  _CoreInfo(id: 'assist', name: 'Assist', sub: 'Kebajikan', icon: Icons.volunteer_activism, color: Color(0xFF3B82F6)),
  _CoreInfo(id: 'biz', name: 'Biz', sub: 'Perniagaan', icon: Icons.business_center, color: Color(0xFF8B5CF6)),
  _CoreInfo(id: 'circle', name: 'Circle', sub: 'Kesihatan', icon: Icons.favorite, color: Color(0xFF10B981)),
  _CoreInfo(id: 'digital', name: 'Digital', sub: 'Inovasi', icon: Icons.devices, color: Color(0xFF0EA5E9)),
  _CoreInfo(id: 'edu', name: 'Edu', sub: 'Pendidikan', icon: Icons.school, color: Color(0xFFF59E0B)),
  _CoreInfo(id: 'future', name: 'Future', sub: 'Kepimpinan', icon: Icons.rocket_launch, color: Color(0xFFEC4899)),
  _CoreInfo(id: 'green', name: 'Green', sub: 'Alam Sekitar', icon: Icons.eco, color: Color(0xFF22C55E)),
];

// ──────────────────────────────────────────────────────────────── screen ───

class HubHomeScreen extends StatelessWidget {
  const HubHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final hub = context.watch<HubContent>();
    final auth = context.watch<Auth>();
    final appState = context.watch<HubApplicationState>();
    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F2),
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          _buildHeader(context, hub, auth),
          Transform.translate(
            offset: const Offset(0, -28),
            child: Column(
              children: [
                _buildStatsCard(hub),
                const SizedBox(height: 16),
                if (auth.signedIn && appState.lastApp != null) ...[
                  _buildApplicationCard(context, appState.lastApp!),
                  const SizedBox(height: 16),
                ],
                if (auth.signedIn && hub.notices.isNotEmpty) ...[
                  _buildNoticesSection(context, hub),
                  const SizedBox(height: 16),
                ],
                if (auth.signedIn && hub.notifications.isNotEmpty) ...[
                  _buildNotificationsSection(hub.notifications),
                  const SizedBox(height: 16),
                ],
                if (auth.signedIn && hub.events.isNotEmpty) ...[
                  _buildEventsSection(hub.events),
                  const SizedBox(height: 16),
                ],
                const SizedBox(height: 8),
                _buildAboutSection(hub),
                const SizedBox(height: 24),
                _buildCoresSection(context, hub),
                const SizedBox(height: 24),
                _buildGallerySection(hub),
                _buildPartnersSection(hub),
                _buildCtaSection(hub),
                const SizedBox(height: 24),
                _buildMoreCard(context),
                const SizedBox(height: 20),
                _buildContactCard(hub),
                const SizedBox(height: 20),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ── hero ──────────────────────────────────────────────────────────────────

  Widget _buildHeader(BuildContext context, HubContent hub, Auth auth) {
    final eyebrow = hub.s(['hero', 'eyebrow'], 'HOME CAKNA');
    final heading = hub.s(['hero', 'heading'], 'Building a\nCompassionate\nCommunity');
    final subtext = hub.s(['hero', 'subtext'], 'One Touch, a Thousand Meanings.');
    return Container(
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 18, 20, 52),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFC0324E), Color(0xFF7A1530)],
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
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.18),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 7,
                      height: 7,
                      decoration: const BoxDecoration(
                          color: Color(0xFFFFADB9), shape: BoxShape.circle),
                    ),
                    const SizedBox(width: 6),
                    Text(eyebrow.toUpperCase(),
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10.5,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1.3)),
                  ],
                ),
              ),
              const Spacer(),
              InkWell(
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const HubProfileScreen()),
                ),
                borderRadius: BorderRadius.circular(22),
                child: Container(
                  width: 38,
                  height: 38,
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                    border: Border.all(
                        color: Colors.white.withValues(alpha: 0.3), width: 1.5),
                  ),
                  child: auth.signedIn
                      ? Center(
                          child: Text(
                            (auth.email ?? '?')[0].toUpperCase(),
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        )
                      : const Icon(Icons.person_outline_rounded,
                          color: Colors.white, size: 20),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            heading,
            style: const TextStyle(
                fontFamily: 'Lora',
                fontSize: 26,
                fontWeight: FontWeight.w700,
                color: Colors.white,
                height: 1.25),
          ),
          const SizedBox(height: 8),
          Text(
            subtext,
            style: const TextStyle(fontSize: 13.5, color: Colors.white70),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  // ── impact stats ──────────────────────────────────────────────────────────

  Widget _buildStatsCard(HubContent hub) {
    final raw = hub.mapList(['impact', 'stats']);
    final pairs = raw.isNotEmpty
        ? raw.take(4).map((s) => (
              s['value'] as String? ?? '',
              s['label'] as String? ?? '',
            )).toList()
        : [
            ('5,000+', 'Pelajar'),
            ('300+', 'Keluarga'),
            ('174+', 'Cawangan'),
            ('90%', 'Kejayaan'),
          ];
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.06),
                blurRadius: 16,
                offset: const Offset(0, 6)),
          ],
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            for (var i = 0; i < pairs.length; i++) ...[
              if (i > 0) const _VDiv(),
              _StatCell(value: pairs[i].$1, label: pairs[i].$2),
            ],
          ],
        ),
      ),
    );
  }

  // ── my application card ───────────────────────────────────────────────────

  Widget _buildApplicationCard(BuildContext context, Map<String, dynamic> app) {
    final program = app['programName'] as String? ?? 'Program';
    final cawangan = app['cawangan'] as String? ?? '';
    final status = app['status'] as String? ?? 'pending';
    final rawDate = app['submittedAt'] as String?;
    final date = rawDate != null ? DateTime.tryParse(rawDate) : null;
    final dateLabel = date != null ? '${date.day}/${date.month}/${date.year}' : '';
    final (statusLabel, statusColor) = switch (status) {
      'approved' => ('Diluluskan', const Color(0xFF10B981)),
      'needs_revision' => ('Perlu Pindaan', const Color(0xFFF59E0B)),
      'pending_cakna' => ('Semakan Akhir', const Color(0xFF8B5CF6)),
      _ => ('Menunggu Semakan', const Color(0xFF6B7280)),
    };
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.all(16),
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
            Row(
              children: [
                const Icon(Icons.assignment_outlined,
                    size: 16, color: Color(0xFFD94F6A)),
                const SizedBox(width: 6),
                const Text('Aplikasi Saya',
                    style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF6B7280),
                        letterSpacing: 0.8)),
                const Spacer(),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: statusColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(statusLabel,
                      style: TextStyle(
                          fontSize: 10.5,
                          fontWeight: FontWeight.w600,
                          color: statusColor)),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text(program,
                style: const TextStyle(
                    fontFamily: 'Lora',
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827)),
                maxLines: 1,
                overflow: TextOverflow.ellipsis),
            if (cawangan.isNotEmpty) ...[
              const SizedBox(height: 3),
              Row(children: [
                const Icon(Icons.location_on_outlined, size: 13, color: Color(0xFF9CA3AF)),
                const SizedBox(width: 4),
                Text(cawangan, style: const TextStyle(fontSize: 12.5, color: Color(0xFF6B7280))),
              ]),
            ],
            if (dateLabel.isNotEmpty) ...[
              const SizedBox(height: 4),
              Row(children: [
                const Icon(Icons.calendar_today_outlined, size: 12, color: Color(0xFF9CA3AF)),
                const SizedBox(width: 4),
                Text('Dihantar $dateLabel',
                    style: const TextStyle(fontSize: 11.5, color: Color(0xFF9CA3AF))),
              ]),
            ],
          ],
        ),
      ),
    );
  }

  // ── notices section (personal workflow messages) ──────────────────────────

  Widget _buildNoticesSection(BuildContext context, HubContent hub) {
    final notices = hub.notices;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.mark_email_unread_outlined,
                  size: 15, color: Color(0xFFD94F6A)),
              const SizedBox(width: 6),
              const Text(
                'NOTIS SAYA',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF6B7280),
                  letterSpacing: 0.8,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...notices.take(5).map((n) {
            final m = n as Map<String, dynamic>;
            final id = m['id'] as String? ?? '';
            final title = m['title'] as String? ?? '';
            final body = m['body'] as String? ?? '';
            final kind = m['kind'] as String? ?? 'info';
            final readBy = (m['read_by'] as List?) ?? [];
            final isUnread = readBy.isEmpty;
            final (iconData, iconColor, bgColor) = switch (kind) {
              'approved' => (
                  Icons.check_circle_outline,
                  const Color(0xFF10B981),
                  const Color(0xFFF0FDF4)
                ),
              'rejected' || 'needs_revision' => (
                  Icons.error_outline,
                  const Color(0xFFF59E0B),
                  const Color(0xFFFFFBEB)
                ),
              'approval_needed' => (
                  Icons.pending_outlined,
                  const Color(0xFF3B82F6),
                  const Color(0xFFEFF6FF)
                ),
              _ => (
                  Icons.info_outline,
                  const Color(0xFF6B7280),
                  const Color(0xFFF9FAFB)
                ),
            };
            return GestureDetector(
              onTap: () {
                if (isUnread && id.isNotEmpty) {
                  hub.markNoticeRead(context.read<Auth>().api, id);
                }
              },
              child: Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: isUnread ? bgColor : Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: isUnread
                        ? iconColor.withValues(alpha: 0.25)
                        : const Color(0xFFE5E7EB),
                  ),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(7),
                      decoration: BoxDecoration(
                        color: iconColor.withValues(alpha: 0.12),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(iconData, size: 16, color: iconColor),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Expanded(
                                child: Text(
                                  title,
                                  style: TextStyle(
                                    fontSize: 13,
                                    fontWeight: isUnread
                                        ? FontWeight.w600
                                        : FontWeight.w500,
                                    color: const Color(0xFF111827),
                                  ),
                                ),
                              ),
                              if (isUnread)
                                Container(
                                  width: 7,
                                  height: 7,
                                  decoration: BoxDecoration(
                                    color: iconColor,
                                    shape: BoxShape.circle,
                                  ),
                                ),
                            ],
                          ),
                          if (body.isNotEmpty) ...[
                            const SizedBox(height: 3),
                            Text(
                              body,
                              style: const TextStyle(
                                fontSize: 12,
                                color: Color(0xFF6B7280),
                                height: 1.4,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // ── events section ────────────────────────────────────────────────────────

  Widget _buildEventsSection(List<dynamic> events) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.calendar_month_outlined,
                  size: 15, color: Color(0xFFD94F6A)),
              const SizedBox(width: 6),
              const Text(
                'ACARA',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF6B7280),
                  letterSpacing: 0.8,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...events.take(3).map((e) {
            final m = e as Map<String, dynamic>;
            final title = m['title'] as String? ?? '';
            final tarikh = m['tarikh'] as String? ?? '';
            final lokasi = m['lokasi'] as String? ?? '';
            final kluster = m['kluster'] as String? ?? '';
            final anjuran = m['anjuran'] as String? ?? '';
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
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
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: const Color(0xFFD94F6A).withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.event_outlined,
                        size: 16, color: Color(0xFFD94F6A)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          title,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF111827),
                          ),
                        ),
                        if (tarikh.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.access_time,
                                  size: 11, color: Color(0xFF9CA3AF)),
                              const SizedBox(width: 4),
                              Text(
                                tarikh,
                                style: const TextStyle(
                                    fontSize: 11.5, color: Color(0xFF6B7280)),
                              ),
                              if (lokasi.isNotEmpty) ...[
                                const SizedBox(width: 8),
                                const Icon(Icons.place_outlined,
                                    size: 11, color: Color(0xFF9CA3AF)),
                                const SizedBox(width: 3),
                                Expanded(
                                  child: Text(
                                    lokasi,
                                    style: const TextStyle(
                                        fontSize: 11.5,
                                        color: Color(0xFF6B7280)),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ],
                        if (anjuran.isNotEmpty || kluster.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Wrap(
                            spacing: 6,
                            children: [
                              if (kluster.isNotEmpty)
                                _eventChip(kluster,
                                    const Color(0xFFEFF6FF),
                                    const Color(0xFF3B82F6)),
                              if (anjuran.isNotEmpty)
                                _eventChip(anjuran,
                                    const Color(0xFFF3F4F6),
                                    const Color(0xFF6B7280)),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _eventChip(String label, Color bg, Color fg) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(10),
        ),
        child: Text(label,
            style: TextStyle(
                fontSize: 10.5, fontWeight: FontWeight.w500, color: fg)),
      );

  // ── notifications section ─────────────────────────────────────────────────

  Widget _buildNotificationsSection(List<dynamic> notifications) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.notifications_outlined, size: 15, color: Color(0xFFD94F6A)),
              const SizedBox(width: 6),
              const Text(
                'MAKLUMAN',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF6B7280),
                  letterSpacing: 0.8,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          ...notifications.take(3).map((n) {
            final m = n as Map<String, dynamic>;
            final title = m['title'] as String? ?? '';
            final content = m['content'] as String? ?? '';
            final callout = m['callout'] as String? ?? '';
            final type = m['type'] as String? ?? 'info';
            final (iconData, iconColor) = switch (type) {
              'alert' => (Icons.warning_amber_rounded, const Color(0xFFF59E0B)),
              'success' => (Icons.check_circle_outline, const Color(0xFF10B981)),
              _ => (Icons.info_outline, const Color(0xFF3B82F6)),
            };
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFE5E7EB)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    padding: const EdgeInsets.all(7),
                    decoration: BoxDecoration(
                      color: iconColor.withValues(alpha: 0.1),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(iconData, size: 16, color: iconColor),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (title.isNotEmpty)
                          Text(
                            title,
                            style: const TextStyle(
                              fontSize: 13.5,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF111827),
                            ),
                          ),
                        if (content.isNotEmpty) ...[
                          const SizedBox(height: 3),
                          Text(
                            content,
                            style: const TextStyle(
                              fontSize: 12.5,
                              color: Color(0xFF6B7280),
                              height: 1.4,
                            ),
                            maxLines: 2,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                        if (callout.isNotEmpty) ...[
                          const SizedBox(height: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: iconColor.withValues(alpha: 0.08),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              callout,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: iconColor,
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }

  // ── about section ─────────────────────────────────────────────────────────

  Widget _buildAboutSection(HubContent hub) {
    final eyebrow = hub.s(['about', 'eyebrow'], 'About Us');
    final title = hub.s(['about', 'title'], 'Who Are We?');
    final body = hub.s(['about', 'body'],
        'HOME Cakna is the Corporate Social Responsibility (CSR) initiative of HOME, '
        'established in 2018. We are dedicated to creating meaningful change by empowering '
        'communities through structured, impactful programs focused on education, well-being, '
        'and sustainability.\n\nCakna means more than just care — it means being present, '
        'being aware, and being ready to help.');
    final quote = hub.s(['about', 'quote'], 'Service: Our Mission, Equation: Our Passion.');
    final quoteSub = hub.s(['about', 'quoteSub'],
        'Our mission: to deliver accurate, transparent, and continuous support to HOME families nationwide.');

    final paragraphs = body
        .split(RegExp(r'\n\s*\n'))
        .where((p) => p.trim().isNotEmpty)
        .toList();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE5E7EB)),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.04),
                blurRadius: 16,
                offset: const Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (eyebrow.isNotEmpty) ...[
              Text(eyebrow.toUpperCase(),
                  style: const TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFD94F6A),
                      letterSpacing: 1.2)),
              const SizedBox(height: 6),
            ],
            Text(title,
                style: const TextStyle(
                    fontFamily: 'Lora',
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF111827))),
            for (final para in paragraphs) ...[
              const SizedBox(height: 12),
              Text(para,
                  style: const TextStyle(
                      fontSize: 13.5, color: Color(0xFF374151), height: 1.6)),
            ],
            if (quote.isNotEmpty) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF1F3),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFFFCDD5)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('"$quote"',
                        style: const TextStyle(
                            fontFamily: 'Lora',
                            fontSize: 14,
                            fontStyle: FontStyle.italic,
                            color: Color(0xFFD94F6A),
                            fontWeight: FontWeight.w600,
                            height: 1.4)),
                    if (quoteSub.isNotEmpty) ...[
                      const SizedBox(height: 8),
                      Text(quoteSub,
                          style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFF6B7280),
                              height: 1.4)),
                    ],
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  // ── 7 cores ───────────────────────────────────────────────────────────────

  Widget _buildCoresSection(BuildContext context, HubContent hub) {
    final title = hub.s(['programs', 'title'], '7 Teras Program');
    final subtitle = hub.s(['programs', 'subtitle'],
        'Setiap teras membangunkan program komuniti tersendiri.');
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(title,
              style: const TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Color(0xFF111827))),
        ),
        const SizedBox(height: 4),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(subtitle,
              style: const TextStyle(fontSize: 12.5, color: Color(0xFF6B7280))),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 104,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            children: [
              for (final core in _kCores)
                _CoreChip(
                  core: core,
                  onTap: () => _showCoreDetail(context, hub, core),
                ),
            ],
          ),
        ),
      ],
    );
  }

  void _showCoreDetail(BuildContext context, HubContent hub, _CoreInfo core) {
    final programs = hub.programs
        .whereType<Map<String, dynamic>>()
        .where((p) => (p['core_id'] as String?) == core.id)
        .toList();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _CoreDetailSheet(core: core, programs: programs),
    );
  }

  // ── gallery ───────────────────────────────────────────────────────────────

  Widget _buildGallerySection(HubContent hub) {
    final eyebrow = hub.s(['homeGallery', 'eyebrow'], 'In Action');
    final title = hub.s(['homeGallery', 'title'], 'Our Programs & Activities');
    final images = hub.strList(['homeGallery', 'images']);
    if (images.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(eyebrow.toUpperCase(),
                  style: const TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFD94F6A),
                      letterSpacing: 1.2)),
              const SizedBox(height: 4),
              Text(title,
                  style: const TextStyle(
                      fontFamily: 'Lora',
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827))),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 200,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: images.length,
            itemBuilder: (context, index) {
              return Container(
                width: 260,
                margin: const EdgeInsets.only(right: 12),
                clipBehavior: Clip.antiAlias,
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Image.network(
                  CaknaApi.resolveHubUrl(images[index]),
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const Center(
                    child: Icon(Icons.image_outlined,
                        color: Color(0xFFD1D5DB), size: 32),
                  ),
                  loadingBuilder: (_, child, progress) {
                    if (progress == null) return child;
                    return const Center(
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Color(0xFFD94F6A)),
                    );
                  },
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  // ── partners ──────────────────────────────────────────────────────────────

  Widget _buildPartnersSection(HubContent hub) {
    final eyebrow = hub.s(['partners', 'eyebrow'], 'In Collaboration With');
    final title = hub.s(['partners', 'title'], 'Program Partners');
    final logos = hub.strList(['partners', 'logos']);
    if (logos.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(eyebrow.toUpperCase(),
                  style: const TextStyle(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFFD94F6A),
                      letterSpacing: 1.2)),
              const SizedBox(height: 4),
              Text(title,
                  style: const TextStyle(
                      fontFamily: 'Lora',
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827))),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 80,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: logos.length,
            itemBuilder: (context, index) {
              return Container(
                width: 110,
                height: 80,
                margin: const EdgeInsets.only(right: 12),
                clipBehavior: Clip.antiAlias,
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFFE5E7EB)),
                ),
                padding: const EdgeInsets.all(10),
                child: Image.network(
                  CaknaApi.resolveHubUrl(logos[index]),
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => const Center(
                    child: Icon(Icons.business_outlined,
                        color: Color(0xFFD1D5DB), size: 28),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  // ── CTA banner ────────────────────────────────────────────────────────────

  Widget _buildCtaSection(HubContent hub) {
    final heading = hub.s(['cta', 'heading'], 'Join the CAKNA family today');
    final body = hub.s(['cta', 'body'],
        'Register as a Franchisee to submit programme reports, apply for funding, '
        'and receive official announcements from HQ CAKNA.');

    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFFD94F6A), Color(0xFF9E2A42)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(heading,
                style: const TextStyle(
                    fontFamily: 'Lora',
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    height: 1.3)),
            if (body.isNotEmpty) ...[
              const SizedBox(height: 10),
              Text(body,
                  style: const TextStyle(
                      fontSize: 13, color: Colors.white70, height: 1.5)),
            ],
          ],
        ),
      ),
    );
  }

  // ── Quran app shortcut ────────────────────────────────────────────────────

  Widget _buildMoreCard(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: InkWell(
        onTap: () => Navigator.push(
            context, MaterialPageRoute(builder: (_) => const _QuranWrapper())),
        borderRadius: BorderRadius.circular(18),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFE5E7EB)),
          ),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(12),
                  gradient: const LinearGradient(
                    colors: [Color(0xFF474739), Color(0xFF2B2B22)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: const Icon(Icons.menu_book_rounded,
                    color: Colors.white, size: 24),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Aplikasi Cakna',
                        style: TextStyle(
                            fontFamily: 'Lora',
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF111827))),
                    SizedBox(height: 3),
                    Text("Al-Quran, Waktu Solat, Al-Ma'thurat & Nota",
                        style: TextStyle(fontSize: 12, color: Color(0xFF6B7280))),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                decoration: BoxDecoration(
                  color: const Color(0xFFF3F4F6),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Text('Lagi',
                    style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: Color(0xFF374151))),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ── contact / footer ──────────────────────────────────────────────────────

  Widget _buildContactCard(HubContent hub) {
    final phone = hub.s(['footer', 'phone'], '011-2111 0110');
    final email = hub.s(['footer', 'email'], 'info@home.edu.my');
    final tagline = hub.s(['footer', 'tagline'], '');
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: const Color(0xFF111827),
          borderRadius: BorderRadius.circular(18),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Hubungi Kami',
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w700)),
            if (tagline.isNotEmpty) ...[
              const SizedBox(height: 6),
              Text(tagline,
                  style: const TextStyle(
                      fontSize: 11.5, color: Colors.white38, height: 1.4)),
            ],
            const SizedBox(height: 10),
            Row(children: [
              const Icon(Icons.phone_outlined, size: 15, color: Colors.white54),
              const SizedBox(width: 8),
              Text(phone,
                  style: const TextStyle(color: Colors.white70, fontSize: 13)),
            ]),
            const SizedBox(height: 6),
            Row(children: [
              const Icon(Icons.email_outlined, size: 15, color: Colors.white54),
              const SizedBox(width: 8),
              Text(email,
                  style: const TextStyle(color: Colors.white70, fontSize: 13)),
            ]),
            const SizedBox(height: 6),
            const Row(children: [
              Icon(Icons.language, size: 15, color: Colors.white54),
              SizedBox(width: 8),
              Text('cakna.org',
                  style: TextStyle(
                      color: Color(0xFFD94F6A),
                      fontSize: 13,
                      fontWeight: FontWeight.w600)),
            ]),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────── supporting widgets ─

class _StatCell extends StatelessWidget {
  final String value, label;
  const _StatCell({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value,
            style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w800,
                color: Color(0xFFD94F6A))),
        const SizedBox(height: 2),
        Text(label,
            style: const TextStyle(fontSize: 10.5, color: Color(0xFF6B7280))),
      ],
    );
  }
}

class _VDiv extends StatelessWidget {
  const _VDiv();

  @override
  Widget build(BuildContext context) =>
      Container(width: 1, height: 28, color: const Color(0xFFE5E7EB));
}

class _CoreChip extends StatelessWidget {
  final _CoreInfo core;
  final VoidCallback onTap;
  const _CoreChip({required this.core, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 84,
        margin: const EdgeInsets.only(right: 10),
        decoration: BoxDecoration(
          color: core.color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: core.color.withValues(alpha: 0.2)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 38,
              height: 38,
              decoration:
                  BoxDecoration(color: core.color, shape: BoxShape.circle),
              child: Icon(core.icon, color: Colors.white, size: 18),
            ),
            const SizedBox(height: 6),
            Text(core.name,
                style: TextStyle(
                    fontSize: 11.5,
                    fontWeight: FontWeight.w700,
                    color: core.color)),
            Text(core.sub,
                style: const TextStyle(
                    fontSize: 9.5, color: Color(0xFF6B7280)),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis),
          ],
        ),
      ),
    );
  }
}

// ── core detail bottom sheet ───────────────────────────────────────────────

class _CoreDetailSheet extends StatelessWidget {
  final _CoreInfo core;
  final List<Map<String, dynamic>> programs;
  const _CoreDetailSheet({required this.core, required this.programs});

  @override
  Widget build(BuildContext context) {
    return DraggableScrollableSheet(
      initialChildSize: programs.isEmpty ? 0.4 : 0.55,
      maxChildSize: 0.9,
      minChildSize: 0.3,
      builder: (context, controller) {
        return Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: ListView(
            controller: controller,
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE5E7EB),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              Row(
                children: [
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                        color: core.color, shape: BoxShape.circle),
                    child: Icon(core.icon, color: Colors.white, size: 26),
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Core ${core.name}',
                          style: const TextStyle(
                              fontFamily: 'Lora',
                              fontSize: 22,
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF111827))),
                      Text(core.sub,
                          style: const TextStyle(
                              fontSize: 14, color: Color(0xFF6B7280))),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 24),
              if (programs.isNotEmpty) ...[
                const Text('PROGRAM',
                    style: TextStyle(
                        fontSize: 10.5,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF6B7280),
                        letterSpacing: 1.2)),
                const SizedBox(height: 12),
                for (final p in programs) ...[
                  _ProgramTile(core: core, program: p),
                  const SizedBox(height: 8),
                ],
              ] else
                Text('Tiada program lagi untuk teras ini.',
                    style: TextStyle(
                        color: Colors.grey[400], fontSize: 13, height: 1.5)),
            ],
          ),
        );
      },
    );
  }
}

class _ProgramTile extends StatelessWidget {
  final _CoreInfo core;
  final Map<String, dynamic> program;
  const _ProgramTile({required this.core, required this.program});

  @override
  Widget build(BuildContext context) {
    final name = program['name'] as String? ?? '';
    final desc = program['description'] as String? ?? '';
    final imageUrl = program['image'] as String? ?? '';
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: core.color.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: core.color.withValues(alpha: 0.15)),
      ),
      child: Row(
        children: [
          if (imageUrl.isNotEmpty)
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                CaknaApi.resolveHubUrl(imageUrl),
                width: 44,
                height: 44,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) => _fallbackIcon(),
              ),
            )
          else
            _fallbackIcon(),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name,
                    style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF111827))),
                if (desc.isNotEmpty) ...[
                  const SizedBox(height: 3),
                  Text(desc,
                      style: const TextStyle(
                          fontSize: 12.5,
                          color: Color(0xFF6B7280),
                          height: 1.4)),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _fallbackIcon() {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
          color: core.color.withValues(alpha: 0.15), shape: BoxShape.circle),
      child: Icon(core.icon, color: core.color, size: 20),
    );
  }
}

// ── Quran wrapper ──────────────────────────────────────────────────────────

class _QuranWrapper extends StatelessWidget {
  const _QuranWrapper();

  @override
  Widget build(BuildContext context) {
    final topPad = MediaQuery.of(context).padding.top;
    return Column(
      children: [
        Container(
          color: const Color(0xFF1D1D16),
          height: topPad + 44,
          padding: EdgeInsets.fromLTRB(8, topPad, 16, 0),
          child: Row(
            children: [
              Material(
                color: Colors.transparent,
                child: InkWell(
                  onTap: () => Navigator.pop(context),
                  borderRadius: BorderRadius.circular(24),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 10),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.arrow_back_ios_new_rounded,
                            size: 15, color: Colors.white),
                        const SizedBox(width: 6),
                        Text(
                          'HOME CAKNA',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: Colors.white.withValues(alpha: 0.85),
                            letterSpacing: 0.8,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
        Expanded(
          child: MediaQuery.removePadding(
            context: context,
            removeTop: true,
            child: const AppShell(),
          ),
        ),
      ],
    );
  }
}
