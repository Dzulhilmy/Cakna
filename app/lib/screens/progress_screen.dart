import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import '../state/user_data.dart';
import '../theme.dart';

const _periods = [
  ('7d', '7 hari lepas'),
  ('30d', '30 hari lepas'),
  ('6mo', '6 bulan lepas'),
  ('12mo', '12 bulan lepas'),
  ('year', 'Tahun ini'),
  ('all', 'Sepanjang masa'),
];

/// Start of the selected period (inclusive); null = all time.
DateTime? _cutoff(String period) {
  final now = DateTime.now();
  final today = DateTime(now.year, now.month, now.day);
  // day-based spans avoid month-end day overflow (e.g. Mar 31 - 6 months)
  return switch (period) {
    '7d' => today.subtract(const Duration(days: 6)),
    '30d' => today.subtract(const Duration(days: 29)),
    '6mo' => today.subtract(const Duration(days: 182)),
    '12mo' => today.subtract(const Duration(days: 364)),
    'year' => DateTime(now.year, 1, 1),
    'all' => null,
    _ => today.subtract(const Duration(days: 29)), // matches _periodLabel fallback
  };
}

String _periodLabel(String period) =>
    _periods.firstWhere((p) => p.$1 == period, orElse: () => _periods[1]).$2;

/// Reading-progress dashboard (matches Tilawah's Progress screen, olive
/// identity): period selector, stat tiles, this-week strip, monthly heatmaps,
/// achievements.
class ProgressScreen extends StatelessWidget {
  const ProgressScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final u = context.watch<UserData>();
    final app = context.watch<AppState>();
    final cutoff = _cutoff(app.progressPeriod);
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          _Header(u: u),
          Transform.translate(
            offset: const Offset(0, -34),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: _PeriodSelector(
                    period: app.progressPeriod,
                    onPick: (p) => app.progressPeriod = p,
                  ),
                ),
                const SizedBox(height: 14),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: _StatsRow(u: u, cutoff: cutoff),
                ),
                const SizedBox(height: 24),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: _WeekStrip(u: u),
                ),
                const SizedBox(height: 24),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: _YearHeatmaps(u: u),
                ),
                const SizedBox(height: 24),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  child: _Achievements(u: u),
                ),
                const SizedBox(height: 24),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Header extends StatelessWidget {
  final UserData u;
  const _Header({required this.u});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: EdgeInsets.fromLTRB(8, MediaQuery.of(context).padding.top + 6, 16, 44),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: dark
              ? [CaknaColors.oliveDeep, CaknaColors.o900]
              : [CaknaColors.olive, CaknaColors.oliveDeep],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.only(
          bottomLeft: Radius.circular(28),
          bottomRight: Radius.circular(28),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.maybePop(context),
              ),
              const Text('Kemajuan bacaan',
                  style: TextStyle(
                      fontFamily: 'Lora',
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                      color: Colors.white)),
            ],
          ),
          const SizedBox(height: 4),
          const Padding(
            padding: EdgeInsets.only(left: 12),
            child: Text('Perjalanan tilawah anda',
                style: TextStyle(fontSize: 13, color: Colors.white70)),
          ),
        ],
      ),
    );
  }
}

class _PeriodSelector extends StatelessWidget {
  final String period;
  final ValueChanged<String> onPick;
  const _PeriodSelector({required this.period, required this.onPick});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Material(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(22),
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: () => _open(context),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: Theme.of(context).dividerColor),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(_periodLabel(period),
                    style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.w600)),
                const SizedBox(width: 6),
                const Icon(Icons.keyboard_arrow_down, size: 20, color: CaknaColors.inkSoft),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _open(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            for (final (id, label) in _periods)
              ListTile(
                title: Text(label),
                trailing:
                    id == period ? const Icon(Icons.check, color: CaknaColors.olive) : null,
                onTap: () {
                  onPick(id);
                  Navigator.pop(ctx);
                },
              ),
          ],
        ),
      ),
    );
  }
}

class _StatsRow extends StatelessWidget {
  final UserData u;
  final DateTime? cutoff;
  const _StatsRow({required this.u, required this.cutoff});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _StatTile(value: '${u.minutesSince(cutoff)}', label: 'Minit', icon: Icons.schedule_outlined)),
        const SizedBox(width: 12),
        Expanded(child: _StatTile(value: '${u.pagesSince(cutoff)}', label: 'Halaman', icon: Icons.menu_book_outlined)),
        const SizedBox(width: 12),
        Expanded(child: _StatTile(value: '${u.activeDaysSince(cutoff)}', label: 'Hari', icon: Icons.calendar_today_outlined)),
      ],
    );
  }
}

class _StatTile extends StatelessWidget {
  final String value, label;
  final IconData icon;
  const _StatTile({required this.value, required this.label, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 8),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Theme.of(context).dividerColor),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 14,
              offset: const Offset(0, 5)),
        ],
      ),
      child: Column(
        children: [
          Icon(icon,
              size: 20,
              color: Theme.of(context).brightness == Brightness.dark
                  ? CaknaColors.oliveBright
                  : CaknaColors.olive),
          const SizedBox(height: 8),
          // oliveDeep is near-black — unreadable on the dark card
          Text(value,
              style: TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                  color: Theme.of(context).brightness == Brightness.dark
                      ? const Color(0xFFDACB8E)
                      : CaknaColors.oliveDeep)),
          const SizedBox(height: 2),
          Text(label, style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft)),
        ],
      ),
    );
  }
}

class _WeekStrip extends StatelessWidget {
  final UserData u;
  const _WeekStrip({required this.u});

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final monday =
        DateTime(now.year, now.month, now.day).subtract(Duration(days: now.weekday - 1));
    const labels = ['Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa', 'Ah'];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Minggu ini',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, fontFamily: 'Lora')),
        const SizedBox(height: 14),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            for (var i = 0; i < 7; i++)
              () {
                final d = monday.add(Duration(days: i));
                final c = u.pagesOnDay(d);
                final today = d.year == now.year && d.month == now.month && d.day == now.day;
                return Column(
                  children: [
                    Text(labels[i], style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft)),
                    const SizedBox(height: 6),
                    Container(
                      width: 34,
                      height: 34,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: c > 0
                            ? CaknaColors.olive
                            : Theme.of(context).dividerColor.withValues(alpha: 0.5),
                        border: today && c == 0
                            ? Border.all(color: CaknaColors.olive, width: 1.5)
                            : null,
                      ),
                      alignment: Alignment.center,
                      child: c > 0
                          ? (c > 1
                              ? Text('$c',
                                  style: const TextStyle(
                                      fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white))
                              : const Icon(Icons.check, size: 16, color: Colors.white))
                          : null,
                    ),
                  ],
                );
              }(),
          ],
        ),
      ],
    );
  }
}

class _YearHeatmaps extends StatelessWidget {
  final UserData u;
  const _YearHeatmaps({required this.u});

  static const _monthMs = [
    'Januari', 'Februari', 'Mac', 'April', 'Mei', 'Jun',
    'Julai', 'Ogos', 'September', 'Oktober', 'November', 'Disember',
  ];

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    // this year's elapsed months, newest first
    final months = List.generate(now.month, (i) => DateTime(now.year, now.month - i, 1));
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Tahun ini',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, fontFamily: 'Lora')),
        const SizedBox(height: 14),
        for (final m in months) ...[
          _MonthGrid(u: u, month: m, name: _monthMs[m.month - 1]),
          const SizedBox(height: 16),
        ],
      ],
    );
  }
}

class _MonthGrid extends StatelessWidget {
  final UserData u;
  final DateTime month;
  final String name;
  const _MonthGrid({required this.u, required this.month, required this.name});

  Color _intensity(BuildContext context, int c) {
    if (c <= 0) return Theme.of(context).dividerColor.withValues(alpha: 0.45);
    if (c < 3) return CaknaColors.olive.withValues(alpha: 0.35);
    if (c < 8) return CaknaColors.olive.withValues(alpha: 0.65);
    return CaknaColors.olive;
  }

  @override
  Widget build(BuildContext context) {
    final days = DateTime(month.year, month.month + 1, 0).day;
    final now = DateTime.now();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('$name ${month.year}',
            style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 5,
          runSpacing: 5,
          children: [
            for (var d = 1; d <= days; d++)
              () {
                final date = DateTime(month.year, month.month, d);
                final future = date.isAfter(DateTime(now.year, now.month, now.day));
                return Container(
                  width: 13,
                  height: 13,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(3),
                    color: future
                        ? Colors.transparent
                        : _intensity(context, u.pagesOnDay(date)),
                    border: future
                        ? Border.all(color: Theme.of(context).dividerColor.withValues(alpha: 0.3))
                        : null,
                  ),
                );
              }(),
          ],
        ),
      ],
    );
  }
}

class _Achievements extends StatelessWidget {
  final UserData u;
  const _Achievements({required this.u});

  @override
  Widget build(BuildContext context) {
    // Tilawah's streak ladder (3d/7d/14d/1/3/6 bulan/1 tahun) + page milestones
    final badges = <(String, IconData, bool)>[
      ('Mula membaca', Icons.auto_stories_outlined, u.activeDays >= 1),
      ('3 hari berturut', Icons.filter_3, u.streak >= 3),
      ('7 hari berturut', Icons.filter_7, u.streak >= 7),
      ('14 hari berturut', Icons.calendar_view_week, u.streak >= 14),
      ('1 bulan berturut', Icons.calendar_month_outlined, u.streak >= 30),
      ('3 bulan berturut', Icons.event_repeat, u.streak >= 90),
      ('6 bulan berturut', Icons.hourglass_bottom, u.streak >= 180),
      ('1 tahun berturut', Icons.workspace_premium_outlined, u.streak >= 365),
      ('30 hari aktif', Icons.local_fire_department_outlined, u.activeDays >= 30),
      ('100 halaman', Icons.menu_book_outlined, u.readCount >= 100),
      ('300 halaman', Icons.library_books_outlined, u.readCount >= 300),
      ('Khatam', Icons.emoji_events_outlined, u.readCount >= 604),
    ];
    final unlocked = badges.where((b) => b.$3).length;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Text('Pencapaian',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, fontFamily: 'Lora')),
            const SizedBox(width: 8),
            Text('$unlocked/${badges.length}',
                style: const TextStyle(fontSize: 13, color: CaknaColors.inkSoft)),
          ],
        ),
        const SizedBox(height: 14),
        GridView.count(
          crossAxisCount: 4,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 14,
          crossAxisSpacing: 12,
          childAspectRatio: 0.82,
          children: [
            for (final (label, icon, done) in badges) _Badge(label: label, icon: icon, done: done),
          ],
        ),
      ],
    );
  }
}

class _Badge extends StatelessWidget {
  final String label;
  final IconData icon;
  final bool done;
  const _Badge({required this.label, required this.icon, required this.done});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 52,
          height: 52,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: done
                ? CaknaColors.olive.withValues(alpha: 0.14)
                : Theme.of(context).dividerColor.withValues(alpha: 0.4),
            border: done ? Border.all(color: CaknaColors.olive.withValues(alpha: 0.4)) : null,
          ),
          child: Icon(icon,
              size: 24, color: done ? CaknaColors.olive : CaknaColors.inkSoft.withValues(alpha: 0.6)),
        ),
        const SizedBox(height: 6),
        Text(label,
            textAlign: TextAlign.center,
            maxLines: 2,
            style: TextStyle(
                fontSize: 9.5,
                height: 1.2,
                color: done ? CaknaColors.oliveDeep : CaknaColors.inkSoft)),
      ],
    );
  }
}
