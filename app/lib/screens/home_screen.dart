import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../services/location_service.dart';
import '../services/solat_service.dart';
import '../state/app_state.dart';
import '../state/user_data.dart';
import '../theme.dart';
import '../utils/hijri.dart';
import '../utils/prayers.dart';
import 'halaqah_screen.dart';
import 'mathurat_screen.dart';
import 'prayer_times_screen.dart';
import 'progress_screen.dart';
import 'qibla_screen.dart';
import 'quick_access_picker.dart';
import 'reader_screen.dart';
import 'search_screen.dart';

/// Home dashboard — matches Tilawah's layout (olive identity): gradient header
/// with search, prayer-times card, continue reading, quick access, this week.
class HomeScreen extends StatelessWidget {
  final void Function(int tabIndex)? onNavigateTab;
  const HomeScreen({super.key, this.onNavigateTab});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          const _Header(),
          Transform.translate(
            offset: const Offset(0, -34),
            child: Column(
              children: [
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  child: _PrayerCard(),
                ),
                const SizedBox(height: 22),
                _ContinueReading(onOpenQuran: () => onNavigateTab?.call(2)),
                const SizedBox(height: 22),
                _HomeBookmarks(onOpenCollections: () => onNavigateTab?.call(1)),
                const SizedBox(height: 22),
                const _QuickAccess(),
                const SizedBox(height: 22),
                const _ThisWeek(),
                const SizedBox(height: 8),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────── header ────────

class _Header extends StatelessWidget {
  const _Header();

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 16, 20, 46),
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
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Cakna',
                        style: TextStyle(
                            fontFamily: 'Lora',
                            fontSize: 26,
                            fontWeight: FontWeight.w600,
                            height: 1.05,
                            color: Colors.white)),
                    const SizedBox(height: 2),
                    // Prefer today's official JAKIM Hijri (fetched by the
                    // prayer card — the notifier rebuilds this label when it
                    // lands); tabular conversion is the offline fallback.
                    ValueListenableBuilder<String?>(
                      valueListenable: SolatService.hijriNotifier,
                      builder: (context, _, _) {
                        // the notifier only TRIGGERS the rebuild — the value is
                        // read from the day-keyed pref so yesterday's fetch
                        // can't linger past midnight
                        final hijri =
                            HijriDate.tryParse(SolatService.officialHijri(app.prefs)) ??
                                HijriDate.fromGregorian(DateTime.now(),
                                    offsetDays: app.hijriOffset);
                        return Text('${hijri.day} ${hijri.monthName} • ${hijri.year} AH',
                            style: const TextStyle(fontSize: 12.5, color: Colors.white70));
                      },
                    ),
                  ],
                ),
              ),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  _RoundIconButton(
                    icon: Icons.headphones_outlined,
                    onTap: () => Navigator.push(
                        context, MaterialPageRoute(builder: (_) => const HalaqahScreen())),
                  ),
                  const SizedBox(width: 8),
                  _RoundIconButton(
                    icon: app.themeMode == ThemeMode.dark
                        ? Icons.light_mode_outlined
                        : Icons.dark_mode_outlined,
                    onTap: () => app.themeMode =
                        app.themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark,
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 18),
          _SearchBar(onTap: () => Navigator.push(
              context, MaterialPageRoute(builder: (_) => const SearchScreen()))),
        ],
      ),
    );
  }
}

class _RoundIconButton extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  const _RoundIconButton({required this.icon, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white.withValues(alpha: 0.18),
      shape: const CircleBorder(),
      child: InkWell(
        onTap: onTap,
        customBorder: const CircleBorder(),
        child: Padding(
          padding: const EdgeInsets.all(9),
          child: Icon(icon, size: 20, color: Colors.white),
        ),
      ),
    );
  }
}

class _SearchBar extends StatelessWidget {
  final VoidCallback onTap;
  const _SearchBar({required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Material(
      color: Colors.white,
      borderRadius: BorderRadius.circular(14),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: const Padding(
          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          child: Row(
            children: [
              Icon(Icons.search, size: 21, color: CaknaColors.inkSoft),
              SizedBox(width: 10),
              Text('Cari dalam Quran…',
                  style: TextStyle(fontSize: 14.5, color: CaknaColors.inkSoft)),
            ],
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────── prayer card ───────

class _PrayerCard extends StatefulWidget {
  const _PrayerCard();

  @override
  State<_PrayerCard> createState() => _PrayerCardState();
}

class _PrayerCardState extends State<_PrayerCard> with WidgetsBindingObserver {
  PrayerCalc? _calc;
  bool _fallback = false;
  String? _placeName;
  Timer? _ticker;
  DateTime _now = DateTime.now();
  int _loadedDay = DateTime.now().day;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _load();
    _ticker = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      final now = DateTime.now();
      // reload across midnight so the countdown/times don't go stale
      if (now.day != _loadedDay) _load();
      setState(() => _now = now);
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) _load();
  }

  Future<void> _load() async {
    _loadedDay = DateTime.now().day;
    final loc = await LocationService.currentSilent();
    if (!mounted) return;
    final app = context.read<AppState>();
    final zone = app.prayerZone == 'Automatik' ? null : app.prayerZone;
    final res = await SolatService.forDate(app.prefs, loc.lat, loc.lng, DateTime.now(), zoneCode: zone);
    if (!mounted) return;
    setState(() {
      _calc = res.calc;
      _fallback = loc.isFallback;
      _placeName = res.zone.shortName;
    });
    if (!loc.isFallback) {
      final name = await LocationService.placeName(loc.lat, loc.lng);
      if (name != null && mounted) setState(() => _placeName = name);
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _ticker?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final calc = _calc;
    return GestureDetector(
      onTap: () => Navigator.push(
          context, MaterialPageRoute(builder: (_) => const PrayerTimesScreen())),
      child: Container(
        decoration: BoxDecoration(
          color: Theme.of(context).cardColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Theme.of(context).dividerColor),
          boxShadow: [
            BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 16,
                offset: const Offset(0, 6)),
          ],
        ),
        padding: const EdgeInsets.fromLTRB(18, 16, 18, 14),
        child: calc == null
            ? const SizedBox(
                height: 120, child: Center(child: CircularProgressIndicator(strokeWidth: 2)))
            : _buildBody(context, calc),
      ),
    );
  }

  Widget _buildBody(BuildContext context, PrayerCalc calc) {
    final (nextName, nextTime) = calc.nextPrayer(_now);
    final diff = nextTime.difference(_now);
    final cd = diff.isNegative ? '00:00:00' : _hms(diff);
    final items = <(String, String, DateTime)>[
      ('Subuh', 'ic_fajr', calc.fajr),
      ('Syuruk', 'ic_sunrise_row', calc.syuruk),
      ('Zohor', 'ic_dhuhr', calc.dhuhr),
      ('Asar', 'ic_asr', calc.asr),
      ('Maghrib', 'ic_maghrib', calc.maghrib),
      ('Isyak', 'ic_isha', calc.isha),
    ];
    return Column(
      children: [
        Row(
          children: [
            const Text('Waktu solat',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
            const SizedBox(width: 6),
            InkWell(
              onTap: _load,
              customBorder: const CircleBorder(),
              child: const Padding(
                padding: EdgeInsets.all(2),
                child: Icon(Icons.refresh, size: 16, color: CaknaColors.inkSoft),
              ),
            ),
            const Spacer(),
            Text('$nextName ',
                style: const TextStyle(fontSize: 12.5, color: CaknaColors.inkSoft)),
            Text(cd,
                style: const TextStyle(
                    fontSize: 12.5,
                    fontWeight: FontWeight.w700,
                    color: CaknaColors.olive,
                    fontFeatures: [FontFeature.tabularFigures()])),
          ],
        ),
        const SizedBox(height: 14),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            for (final (name, icon, time) in items)
              _PrayerCell(name: name, icon: icon, time: time, highlight: name == nextName),
          ],
        ),
        const SizedBox(height: 12),
        const Divider(height: 1),
        const SizedBox(height: 10),
        Row(
          children: [
            const Icon(Icons.location_on_outlined, size: 15, color: CaknaColors.inkSoft),
            const SizedBox(width: 4),
            Text(_placeName ?? (_fallback ? 'Kuala Lumpur' : 'Lokasi semasa'),
                style: const TextStyle(fontSize: 12.5, color: CaknaColors.inkSoft)),
            const Spacer(),
            InkWell(
              onTap: () => Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const QiblaScreen())),
              child: const Row(
                children: [
                  Icon(Icons.explore_outlined, size: 15, color: CaknaColors.olive),
                  SizedBox(width: 4),
                  Text('Kiblat',
                      style: TextStyle(
                          fontSize: 12.5, fontWeight: FontWeight.w600, color: CaknaColors.olive)),
                ],
              ),
            ),
          ],
        ),
      ],
    );
  }

  static String _hms(Duration d) {
    String two(int n) => n.toString().padLeft(2, '0');
    return '${two(d.inHours)}:${two(d.inMinutes % 60)}:${two(d.inSeconds % 60)}';
  }
}

class _PrayerCell extends StatelessWidget {
  final String name, icon;
  final DateTime time;
  final bool highlight;
  const _PrayerCell(
      {required this.name, required this.icon, required this.time, required this.highlight});

  @override
  Widget build(BuildContext context) {
    // the olive ramp is dark-on-dark in dark mode — the "next prayer"
    // emphasis needs a bright accent there
    final dark = Theme.of(context).brightness == Brightness.dark;
    final accent = dark ? const Color(0xFFDACB8E) : CaknaColors.oliveDeep;
    final color = highlight
        ? (dark ? const Color(0xFFDACB8E) : CaknaColors.olive)
        : CaknaColors.inkSoft;
    final t = DateFormat('h:mm').format(time);
    final ampm = DateFormat('a').format(time).toLowerCase();
    return Column(
      children: [
        SvgPicture.asset('assets/images/$icon.svg',
            width: 21,
            height: 21,
            colorFilter: ColorFilter.mode(color, BlendMode.srcIn)),
        const SizedBox(height: 5),
        Text(name,
            style: TextStyle(
                fontSize: 10,
                fontWeight: highlight ? FontWeight.w700 : FontWeight.w500,
                color: highlight ? accent : CaknaColors.inkSoft)),
        const SizedBox(height: 2),
        Text(t,
            style: TextStyle(
                fontSize: 11.5,
                fontWeight: FontWeight.w700,
                color: highlight ? accent : null)),
        Text(ampm, style: const TextStyle(fontSize: 8.5, color: CaknaColors.inkSoft)),
      ],
    );
  }
}

// ──────────────────────────────────────────────── continue reading ─────────

class _ContinueReading extends StatefulWidget {
  final VoidCallback onOpenQuran;
  const _ContinueReading({required this.onOpenQuran});

  @override
  State<_ContinueReading> createState() => _ContinueReadingState();
}

class _ContinueReadingState extends State<_ContinueReading> {
  // cache per page — AppState notifies on every reader page swipe and the
  // cards must not re-query the DB (and flicker) each time
  final _infoCache = <int, Future<_ContinueInfo>>{};

  VoidCallback get onOpenQuran => widget.onOpenQuran;

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    // one card per recently-read surah (newest first); fall back to the single
    // last-read page before any history exists
    final pages = app.recentReads.isEmpty
        ? [app.lastPage]
        : [for (final r in app.recentReads) r.page];
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: _SectionHead(title: 'Sambung bacaan', actionLabel: 'Al-Quran', onAction: onOpenQuran),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 150,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            children: [
              for (var i = 0; i < pages.length; i++)
                Padding(
                  padding: EdgeInsets.only(right: i == pages.length - 1 ? 0 : 12),
                  child: FutureBuilder<_ContinueInfo>(
                    future: _infoCache.putIfAbsent(pages[i], () => _resolve(context, pages[i])),
                    builder: (context, snap) => _ContinueCard(
                      page: pages[i],
                      info: snap.data,
                      first: i == 0,
                      onTap: () => Navigator.push(
                          context,
                          MaterialPageRoute(
                              builder: (_) => ReaderScreen(initialPage: pages[i]))),
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Future<_ContinueInfo> _resolve(BuildContext context, int page) async {
    final repo = context.read<QuranRepo>();
    final verses = await repo.versesForPage(page);
    if (verses.isEmpty) return const _ContinueInfo(surahId: 1, startPage: 1, endPage: 604);
    final sid = verses.first.surahId;
    final surahVerses = await repo.versesForSurah(sid);
    final startPage = surahVerses.isEmpty ? page : surahVerses.first.page;
    final endPage = surahVerses.isEmpty ? page : surahVerses.last.page;
    return _ContinueInfo(surahId: sid, startPage: startPage, endPage: endPage);
  }
}

class _ContinueInfo {
  final int surahId, startPage, endPage;
  const _ContinueInfo({required this.surahId, required this.startPage, required this.endPage});
}

// ─────────────────────────────────────────────────────── bookmarks ─────────

class _HomeBookmarks extends StatelessWidget {
  final VoidCallback onOpenCollections;
  const _HomeBookmarks({required this.onOpenCollections});

  @override
  Widget build(BuildContext context) {
    final marks = context.watch<UserData>().recentBookmarks.take(6).toList();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: _SectionHead(
              title: 'Penanda', actionLabel: 'Koleksi', onAction: onOpenCollections),
        ),
        const SizedBox(height: 12),
        if (marks.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            // Tapping the empty-state hint opens the collections page too, so
            // users can get there without aiming for the small "Koleksi" link.
            child: InkWell(
              onTap: onOpenCollections,
              borderRadius: BorderRadius.circular(18),
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(18),
                  color: Theme.of(context).cardColor,
                  border: Border.all(color: Theme.of(context).dividerColor),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: CaknaColors.olive.withValues(alpha: 0.12),
                      ),
                      child: const Icon(Icons.bookmark_border, color: CaknaColors.olive),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Text(
                        'Tambah penanda dan berikan label untuk akses pantas di sini.',
                        style: TextStyle(fontSize: 12.5, color: CaknaColors.inkSoft, height: 1.4),
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(Icons.chevron_right, size: 20, color: CaknaColors.inkSoft),
                  ],
                ),
              ),
            ),
          )
        else
          SizedBox(
            height: 64,
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                for (final m in marks)
                  Padding(
                    padding: const EdgeInsets.only(right: 10),
                    child: _BookmarkChip(verseId: m.verseId, collection: m.collection),
                  ),
              ],
            ),
          ),
      ],
    );
  }
}

class _BookmarkChip extends StatefulWidget {
  final int verseId;
  final String collection;
  const _BookmarkChip({required this.verseId, required this.collection});

  @override
  State<_BookmarkChip> createState() => _BookmarkChipState();
}

class _BookmarkChipState extends State<_BookmarkChip> {
  Future<Verse>? _verseFuture;

  int get verseId => widget.verseId;
  String get collection => widget.collection;

  @override
  Widget build(BuildContext context) {
    final repo = context.read<QuranRepo>();
    _verseFuture ??= repo.verse(verseId);
    return FutureBuilder<Verse>(
      future: _verseFuture,
      builder: (context, snap) {
        final v = snap.data;
        return InkWell(
          onTap: v == null
              ? null
              : () => Navigator.push(context,
                  MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: v.page))),
          borderRadius: BorderRadius.circular(14),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 9),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(14),
              color: Theme.of(context).cardColor,
              border: Border.all(color: Theme.of(context).dividerColor),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.bookmark, size: 14, color: CaknaColors.olive),
                    const SizedBox(width: 5),
                    FutureBuilder<Surah>(
                      future: v == null ? null : repo.surah(v.surahId),
                      builder: (context, s) => Text(
                        v == null
                            ? '…'
                            : '${s.data?.nameTrans ?? 'Surah ${v.surahId}'} ${v.surahId}:${v.verseNumber}',
                        style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 3),
                Text(collection,
                    style: const TextStyle(fontSize: 10.5, color: CaknaColors.inkSoft)),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _ContinueCard extends StatelessWidget {
  final int page;
  final _ContinueInfo? info;
  final bool first;
  final VoidCallback onTap;
  const _ContinueCard(
      {required this.page, required this.info, this.first = true, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    // progress within the surah, not the whole mushaf
    final start = info?.startPage ?? 1, end = info?.endPage ?? 604;
    final span = (end - start + 1).clamp(1, 604);
    final progress = ((page - start + 1) / span).clamp(0.0, 1.0);
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(18),
      child: Container(
        width: 220,
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          color: Theme.of(context).cardColor,
          border: Border.all(color: Theme.of(context).dividerColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(first ? 'Terakhir dibaca' : 'Bacaan sebelumnya',
                style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft)),
            const Spacer(),
            if (info != null)
              SvgPicture.asset(
                'assets/images/sname_${info!.surahId}.svg',
                height: 34,
                alignment: Alignment.centerRight,
                colorFilter: ColorFilter.mode(
                    dark ? CaknaColors.oliveBright : CaknaColors.oliveDeep, BlendMode.srcIn),
                placeholderBuilder: (_) => const SizedBox(height: 34),
              )
            else
              const SizedBox(height: 34),
            const Spacer(),
            Text('Halaman $page / ${info?.endPage ?? 604}',
                style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 6,
                backgroundColor: CaknaColors.olive.withValues(alpha: 0.12),
                valueColor: const AlwaysStoppedAnimation(CaknaColors.olive),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ──────────────────────────────────────────────────── quick access ─────────

class _QuickAccess extends StatelessWidget {
  const _QuickAccess();

  Future<void> _manage(BuildContext context) async {
    final app = context.read<AppState>();
    final result = await Navigator.push<List<int>>(
      context,
      MaterialPageRoute(builder: (_) => QuickAccessPicker(initial: app.quickAccess)),
    );
    if (result != null) app.quickAccess = result;
  }

  @override
  Widget build(BuildContext context) {
    final repo = context.read<QuranRepo>();
    final ids = context.watch<AppState>().quickAccess;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionHead(title: 'Akses pantas', actionLabel: 'Urus', onAction: () => _manage(context)),
          const SizedBox(height: 12),
          FutureBuilder<List<Surah>>(
            future: repo.surahs(),
            builder: (context, snap) {
              final byId = {for (final s in (snap.data ?? const <Surah>[])) s.id: s};
              return GridView.count(
                crossAxisCount: 3,
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                mainAxisSpacing: 12,
                crossAxisSpacing: 12,
                childAspectRatio: 1.35,
                children: [
                  for (final id in ids)
                    if (id == 0)
                      _QuickTile(
                        label: "Al-Ma'thurat",
                        child: const Icon(Icons.brightness_5_outlined,
                            size: 30, color: CaknaColors.olive),
                        onTap: () => Navigator.push(context,
                            MaterialPageRoute(builder: (_) => const MathuratScreen())),
                      )
                    else
                      _QuickTile(
                        label: byId[id]?.nameTrans ?? 'Surah $id',
                        child: SvgPicture.asset('assets/images/sname_$id.svg',
                            height: 30,
                            colorFilter:
                                const ColorFilter.mode(CaknaColors.olive, BlendMode.srcIn),
                            placeholderBuilder: (_) => Text('$id',
                                style: const TextStyle(color: CaknaColors.olive))),
                        onTap: () async {
                          final verses = await repo.versesForSurah(id);
                          if (!context.mounted || verses.isEmpty) return;
                          Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (_) => ReaderScreen(initialPage: verses.first.page)));
                        },
                      ),
                ],
              );
            },
          ),
        ],
      ),
    );
  }
}

class _QuickTile extends StatelessWidget {
  final String label;
  final Widget child;
  final VoidCallback onTap;
  const _QuickTile({required this.label, required this.child, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: Theme.of(context).cardColor,
          border: Border.all(color: Theme.of(context).dividerColor),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(height: 40, child: Center(child: child)),
            const SizedBox(height: 6),
            Text(label,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft)),
          ],
        ),
      ),
    );
  }
}

// ───────────────────────────────────────────────────────── this week ───────

class _ThisWeek extends StatelessWidget {
  const _ThisWeek();

  @override
  Widget build(BuildContext context) {
    final u = context.watch<UserData>();
    final now = DateTime.now();
    // Monday as the first day of the week.
    final monday = DateTime(now.year, now.month, now.day)
        .subtract(Duration(days: now.weekday - 1));
    const labels = ['Is', 'Se', 'Ra', 'Kh', 'Ju', 'Sa', 'Ah']; // Isnin..Ahad
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _SectionHead(
            title: 'Bacaan Minggu Ini (Halaman)',
            actionLabel: 'Lihat kemajuan',
            onAction: () => Navigator.push(
                context, MaterialPageRoute(builder: (_) => const ProgressScreen())),
          ),
          const SizedBox(height: 14),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              for (var i = 0; i < 7; i++)
                _DayDot(
                  label: labels[i],
                  date: monday.add(Duration(days: i)),
                  count: u.pagesOnDay(monday.add(Duration(days: i))),
                  isToday: _sameDay(monday.add(Duration(days: i)), now),
                  isFuture: monday.add(Duration(days: i)).isAfter(now),
                ),
            ],
          ),
        ],
      ),
    );
  }

  static bool _sameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;
}

class _DayDot extends StatelessWidget {
  final String label;
  final DateTime date;
  final int count;
  final bool isToday, isFuture;
  const _DayDot(
      {required this.label,
      required this.date,
      required this.count,
      required this.isToday,
      required this.isFuture});

  @override
  Widget build(BuildContext context) {
    final done = count > 0;
    final Color bg;
    final Color fg;
    if (done) {
      bg = CaknaColors.olive;
      fg = Colors.white;
    } else if (isToday) {
      bg = CaknaColors.olive.withValues(alpha: 0.14);
      fg = CaknaColors.oliveDeep;
    } else {
      bg = Theme.of(context).dividerColor.withValues(alpha: 0.5);
      fg = CaknaColors.inkSoft;
    }
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft)),
        const SizedBox(height: 6),
        Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: bg,
            border: isToday && !done
                ? Border.all(color: CaknaColors.olive, width: 1.5)
                : null,
          ),
          alignment: Alignment.center,
          child: done
              ? (count > 1
                  ? Text('$count',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: fg))
                  : Icon(Icons.check, size: 18, color: fg))
              : Text(isFuture ? '' : '·',
                  style: TextStyle(fontSize: 16, color: fg)),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────── shared ────────

class _SectionHead extends StatelessWidget {
  final String title;
  final String? actionLabel;
  final VoidCallback? onAction;
  const _SectionHead({required this.title, this.actionLabel, this.onAction});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Text(title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700, fontFamily: 'Lora')),
        ),
        if (actionLabel != null) ...[
          const SizedBox(width: 4),
          // Padded, rounded hit area + chevron so the "see all" action reads as
          // tappable and is comfortable to hit (the bare text was a tiny target).
          InkWell(
            onTap: onAction,
            borderRadius: BorderRadius.circular(20),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(actionLabel!,
                      style: const TextStyle(
                          fontSize: 12.5, fontWeight: FontWeight.w600, color: CaknaColors.olive)),
                  const Icon(Icons.chevron_right, size: 16, color: CaknaColors.olive),
                ],
              ),
            ),
          ),
        ],
      ],
    );
  }
}
