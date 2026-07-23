import 'dart:async';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import '../services/location_service.dart';
import '../services/notification_service.dart';
import '../services/prayer_widget_service.dart';
import '../services/solat_service.dart';
import '../state/app_state.dart';
import '../theme.dart';
import '../utils/hijri.dart';
import '../utils/jakim_zones.dart';
import '../utils/prayers.dart';
import 'qibla_screen.dart';

/// Prayer-times detail (matches Tilawah): photo header, day navigation, dark
/// prayer cards with per-prayer notification modes, and a settings modal.
class PrayerTimesScreen extends StatefulWidget {
  const PrayerTimesScreen({super.key});

  @override
  State<PrayerTimesScreen> createState() => _PrayerTimesScreenState();
}

class _PrayerTimesScreenState extends State<PrayerTimesScreen> {
  double _lat = LocationService.fallback.lat;
  double _lng = LocationService.fallback.lng;
  bool _fallback = false;
  bool _located = false;
  int _dayOffset = 0;
  Timer? _ticker;
  DateTime _now = DateTime.now();

  PrayerCalc? _calc;
  bool _official = false;
  String? _placeName;
  String? _officialHijri;

  @override
  void initState() {
    super.initState();
    _load();
    _ticker = Timer.periodic(const Duration(seconds: 30), (_) {
      if (mounted) setState(() => _now = DateTime.now());
    });
  }

  Future<void> _load() async {
    final loc = await LocationService.current();
    if (!mounted) return;
    setState(() {
      _lat = loc.lat;
      _lng = loc.lng;
      _fallback = loc.isFallback;
      _located = true;
    });
    await _loadCalc();
  }

  Future<void> _loadCalc() async {
    final app = context.read<AppState>();
    final zone = app.prayerZone == 'Automatik' ? null : app.prayerZone;
    final res = await SolatService.forDate(app.prefs, _lat, _lng, _date, zoneCode: zone);
    if (!mounted) return;
    setState(() {
      _calc = res.calc;
      _official = res.official;
      _officialHijri = res.hijri;
      _placeName = res.zone.shortName;
    });
    if (!_fallback) {
      final name = await LocationService.placeName(_lat, _lng);
      if (name != null && mounted) setState(() => _placeName = name);
    }
  }

  @override
  void dispose() {
    _ticker?.cancel();
    super.dispose();
  }

  DateTime get _date => DateTime.now().add(Duration(days: _dayOffset));

  @override
  Widget build(BuildContext context) {
    final calc = _calc;
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          _Header(onSettings: _openSettings),
          Transform.translate(
            offset: const Offset(0, -24),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  _DateNav(
                    date: _date,
                    offset: _dayOffset,
                    onPrev: () {
                      setState(() => _dayOffset--);
                      _loadCalc();
                    },
                    onNext: () {
                      setState(() => _dayOffset++);
                      _loadCalc();
                    },
                    fallback: _fallback,
                    located: _located,
                    placeName: _placeName,
                    official: _official && _dayOffset == 0,
                    officialHijri: _dayOffset == 0 ? _officialHijri : null,
                  ),
                  const SizedBox(height: 16),
                  if (!_located || calc == null)
                    const Padding(
                      padding: EdgeInsets.all(24),
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  else
                    _PrayerList(calc: calc, now: _now, isToday: _dayOffset == 0),
                  const SizedBox(height: 16),
                  _QiblatPill(),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _openSettings() async {
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => _SettingsSheet(lat: _lat, lng: _lng),
    );
    if (mounted) await _loadCalc(); // zone/settings may have changed
  }
}

class _Header extends StatelessWidget {
  final VoidCallback onSettings;
  const _Header({required this.onSettings});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/images/bg_prayer_times.jpg'),
          fit: BoxFit.cover,
        ),
      ),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.black.withValues(alpha: 0.55), Colors.black.withValues(alpha: 0.15)],
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
          ),
        ),
        child: SafeArea(
          bottom: false,
          child: Column(
            children: [
              Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => Navigator.maybePop(context),
                  ),
                  const Spacer(),
                  IconButton(
                    icon: const Icon(Icons.settings_outlined, color: Colors.white),
                    onPressed: onSettings,
                  ),
                ],
              ),
              const Spacer(),
              const Align(
                alignment: Alignment.centerLeft,
                child: Padding(
                  padding: EdgeInsets.fromLTRB(20, 0, 20, 30),
                  child: Text('Waktu Solat',
                      style: TextStyle(
                          fontFamily: 'Lora',
                          fontSize: 26,
                          fontWeight: FontWeight.w600,
                          color: Colors.white)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DateNav extends StatelessWidget {
  final DateTime date;
  final int offset;
  final VoidCallback onPrev, onNext;
  final bool fallback, located, official;
  final String? placeName;
  final String? officialHijri;
  const _DateNav({
    required this.date,
    required this.offset,
    required this.onPrev,
    required this.onNext,
    required this.fallback,
    required this.located,
    required this.official,
    this.placeName,
    this.officialHijri,
  });

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    // Prefer JAKIM's authoritative Hijri date for today; else the tabular calc.
    final hijri = HijriDate.tryParse(officialHijri) ??
        HijriDate.fromGregorian(date, offsetDays: app.hijriOffset);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 12),
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
      child: Row(
        children: [
          IconButton(
            icon: const Icon(Icons.chevron_left),
            color: offset > 0 ? CaknaColors.olive : CaknaColors.inkSoft,
            onPressed: offset > 0 ? onPrev : null,
          ),
          Expanded(
            child: Column(
              children: [
                Text(DateFormat('EEEE, dd MMM yyyy').format(date),
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700)),
                const SizedBox(height: 2),
                Text('${hijri.day} ${hijri.monthName} ${hijri.year} AH',
                    style: const TextStyle(fontSize: 11.5, color: CaknaColors.inkSoft)),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.location_on_outlined, size: 13, color: CaknaColors.inkSoft),
                    const SizedBox(width: 3),
                    Text(placeName ?? (fallback ? 'Kuala Lumpur' : 'Lokasi semasa'),
                        style: const TextStyle(fontSize: 11.5, color: CaknaColors.inkSoft)),
                  ],
                ),
                const SizedBox(height: 3),
                Text(official ? 'Waktu rasmi JAKIM e-Solat' : 'Anggaran astronomi',
                    style: TextStyle(
                        fontSize: 10,
                        color: official ? CaknaColors.olive : CaknaColors.inkSoft.withValues(alpha: 0.8))),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.chevron_right, color: CaknaColors.olive),
            onPressed: onNext,
          ),
        ],
      ),
    );
  }
}

class _PrayerList extends StatelessWidget {
  final PrayerCalc calc;
  final DateTime now;
  final bool isToday;
  const _PrayerList({required this.calc, required this.now, required this.isToday});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    final nextName = isToday ? calc.nextPrayer(now).$1 : null;
    final rows = <(String, IconData, DateTime, bool)>[
      ('Imsak', Icons.nights_stay_outlined, calc.imsak, false),
      ('Subuh', Icons.wb_twilight, calc.fajr, true),
      ('Syuruk', Icons.wb_sunny_outlined, calc.syuruk, false),
      ('Dhuha', Icons.light_mode_outlined, calc.dhuha, false),
      ('Zohor', Icons.wb_sunny, calc.dhuhr, true),
      ('Asar', Icons.wb_sunny_outlined, calc.asr, true),
      ('Maghrib', Icons.wb_twilight, calc.maghrib, true),
      ('Isyak', Icons.nightlight_round, calc.isha, true),
    ];
    return Column(
      children: [
        for (final (name, icon, time, notifiable) in rows)
          Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: _PrayerCard(
              name: name,
              icon: icon,
              time: time,
              highlight: name == nextName,
              mode: notifiable ? app.prayerMode(name) : null,
              onCycleMode: notifiable
                  ? () async {
                      final next = (app.prayerMode(name) + 1) % 3;
                      app.setPrayerMode(name, next);
                      await _reschedule(context);
                    }
                  : null,
            ),
          ),
      ],
    );
  }

  Future<void> _reschedule(BuildContext context) async {
    final app = context.read<AppState>();
    if (app.anyPrayerNotif) {
      final granted = await NotificationService.requestPermission();
      if (granted) {
        await NotificationService.scheduleAzan(app.prefs, calc.lat, calc.lng,
            modes: app.prayerModes, zoneCode: app.prayerZone);
      }
    } else {
      await NotificationService.cancelAll();
    }
  }
}

class _PrayerCard extends StatelessWidget {
  final String name;
  final IconData icon;
  final DateTime time;
  final bool highlight;
  final int? mode; // null = not notifiable (e.g. Syuruk)
  final VoidCallback? onCycleMode;
  const _PrayerCard({
    required this.name,
    required this.icon,
    required this.time,
    required this.highlight,
    required this.mode,
    required this.onCycleMode,
  });

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final bg = highlight
        ? CaknaColors.olive
        : (dark ? CaknaColors.surfaceDark : CaknaColors.o700.withValues(alpha: 0.92));
    final fg = Colors.white;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(16),
        border: highlight ? null : Border.all(color: Colors.white.withValues(alpha: 0.06)),
      ),
      child: Row(
        children: [
          Icon(icon, size: 22, color: fg.withValues(alpha: 0.9)),
          const SizedBox(width: 14),
          Text(name,
              style: TextStyle(
                  fontSize: 15,
                  fontWeight: highlight ? FontWeight.w700 : FontWeight.w600,
                  color: fg)),
          const Spacer(),
          Text(DateFormat('h:mm a').format(time),
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: fg)),
          if (mode != null) ...[
            const SizedBox(width: 12),
            InkWell(
              onTap: onCycleMode,
              customBorder: const CircleBorder(),
              child: Padding(
                padding: const EdgeInsets.all(4),
                child: Icon(_modeIcon(mode!), size: 20, color: fg.withValues(alpha: 0.9)),
              ),
            ),
          ],
        ],
      ),
    );
  }

  static IconData _modeIcon(int mode) => switch (mode) {
        1 => Icons.vibration,
        2 => Icons.volume_up,
        _ => Icons.notifications_off_outlined,
      };
}

class _QiblatPill extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: () => Navigator.push(
          context, MaterialPageRoute(builder: (_) => const QiblaScreen())),
      icon: const Icon(Icons.explore_outlined, size: 18),
      label: const Text('Lihat Kiblat'),
      style: OutlinedButton.styleFrom(
        foregroundColor: CaknaColors.olive,
        side: BorderSide(color: CaknaColors.olive.withValues(alpha: 0.5)),
        minimumSize: const Size.fromHeight(48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
      ),
    );
  }
}

// ─────────────────────────────────────────────────── settings sheet ────────

class _SettingsSheet extends StatelessWidget {
  final double lat, lng;
  const _SettingsSheet({required this.lat, required this.lng});

  static const _sounds = ['Tiada', 'Azan 1', 'Azan 2', 'Azan 3'];

  Future<void> _reschedule(BuildContext context) async {
    final app = context.read<AppState>();
    if (app.anyPrayerNotif) {
      final granted = await NotificationService.requestPermission();
      if (granted) {
        await NotificationService.scheduleAzan(app.prefs, lat, lng,
            modes: app.prayerModes, zoneCode: app.prayerZone);
      }
    } else {
      await NotificationService.cancelAll();
    }
    await PrayerWidgetService.update(app.prefs, lat, lng, zoneCode: app.prayerZone);
  }

  static String _zoneLabel(String code) {
    if (code == 'Automatik') return 'Automatik (ikut lokasi)';
    final z = JakimZones.byCode(code);
    return z == null ? code : z.label;
  }

  Future<void> _pickZone(BuildContext context, AppState app) async {
    // all 60 official JAKIM zones, grouped by state, + the Automatik option
    final byState = JakimZones.byState;
    final picked = await showModalBottomSheet<String>(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      isScrollControlled: true,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.7,
        expand: false,
        builder: (ctx, scroll) => ListView(
          controller: scroll,
          children: [
            ListTile(
              title: const Text('Automatik (ikut lokasi)'),
              trailing: app.prayerZone == 'Automatik'
                  ? const Icon(Icons.check, color: CaknaColors.olive)
                  : null,
              onTap: () => Navigator.pop(ctx, 'Automatik'),
            ),
            for (final e in byState.entries) ...[
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 18, 16, 4),
                child: Text(e.key,
                    style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                        color: CaknaColors.oliveDeep)),
              ),
              for (final z in e.value)
                ListTile(
                  dense: true,
                  title: Text(z.area, maxLines: 2, overflow: TextOverflow.ellipsis),
                  subtitle: Text(z.code,
                      style: const TextStyle(fontSize: 11, color: CaknaColors.inkSoft)),
                  trailing: app.prayerZone == z.code
                      ? const Icon(Icons.check, color: CaknaColors.olive)
                      : null,
                  onTap: () => Navigator.pop(ctx, z.code),
                ),
            ],
          ],
        ),
      ),
    );
    if (picked != null) app.prayerZone = picked;
  }

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    return DraggableScrollableSheet(
      initialChildSize: 0.75,
      minChildSize: 0.5,
      maxChildSize: 0.95,
      expand: false,
      builder: (context, scroll) => Container(
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: ListView(
          controller: scroll,
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 32),
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                    color: CaknaColors.inkSoft.withValues(alpha: 0.4),
                    borderRadius: BorderRadius.circular(2)),
              ),
            ),
            const SizedBox(height: 18),
            const Text('Tetapan waktu solat',
                style: TextStyle(fontFamily: 'Lora', fontSize: 20, fontWeight: FontWeight.w600)),
            const SizedBox(height: 20),
            const _SheetLabel('Zon & takwim'),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.public, color: CaknaColors.olive),
                    title: const Text('Zon waktu solat'),
                    subtitle: Text(_zoneLabel(app.prayerZone)),
                    trailing: const Icon(Icons.chevron_right, color: CaknaColors.inkSoft),
                    onTap: () async {
                      final before = app.prayerZone;
                      await _pickZone(context, app);
                      // pending azan + the widget carry zone-specific times
                      if (app.prayerZone != before && context.mounted) {
                        await _reschedule(context);
                      }
                    },
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.event_outlined, color: CaknaColors.olive),
                    title: const Text('Laras tarikh Hijri'),
                    subtitle: Text(app.hijriOffset == 0
                        ? 'Tiada larasan'
                        : '${app.hijriOffset > 0 ? '+' : ''}${app.hijriOffset} hari'),
                    trailing: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        IconButton(
                          icon: const Icon(Icons.remove_circle_outline),
                          color: CaknaColors.olive,
                          onPressed: () => app.hijriOffset = app.hijriOffset - 1,
                        ),
                        IconButton(
                          icon: const Icon(Icons.add_circle_outline),
                          color: CaknaColors.olive,
                          onPressed: () => app.hijriOffset = app.hijriOffset + 1,
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const _SheetLabel('Notifikasi solat'),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.music_note_outlined, color: CaknaColors.olive),
                    title: const Text('Bunyi azan'),
                    trailing: DropdownButton<int>(
                      value: app.azanSound,
                      underline: const SizedBox.shrink(),
                      items: [
                        for (var i = 0; i < _sounds.length; i++)
                          DropdownMenuItem(value: i, child: Text(_sounds[i])),
                      ],
                      onChanged: (v) async {
                        if (v == null) return;
                        app.azanSound = v;
                        // the sound is baked into each scheduled notification,
                        // so the pending set must be rebuilt
                        await _reschedule(context);
                      },
                    ),
                  ),
                  const Divider(height: 1),
                  for (final key in AppState.prayerKeys)
                    _PrayerModeRow(
                      name: key,
                      mode: app.prayerMode(key),
                      onChanged: (m) async {
                        app.setPrayerMode(key, m);
                        await _reschedule(context);
                      },
                    ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            const _ModeLegend(),
            const SizedBox(height: 20),
            const _SheetLabel('Konfigurasi widget'),
            Card(
              child: ListTile(
                leading: const Icon(Icons.widgets_outlined, color: CaknaColors.olive),
                title: const Text('Tema widget'),
                subtitle: const Text('Widget waktu solat di skrin utama'),
                trailing: DropdownButton<int>(
                  value: app.widgetTheme,
                  underline: const SizedBox.shrink(),
                  items: const [
                    DropdownMenuItem(value: 0, child: Text('Sistem')),
                    DropdownMenuItem(value: 1, child: Text('Cerah')),
                    DropdownMenuItem(value: 2, child: Text('Gelap')),
                  ],
                  onChanged: (v) async {
                    if (v == null) return;
                    app.widgetTheme = v;
                    await PrayerWidgetService.update(app.prefs, lat, lng,
                        zoneCode: app.prayerZone);
                  },
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _SheetLabel extends StatelessWidget {
  final String text;
  const _SheetLabel(this.text);
  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 8, left: 2),
        child: Text(text.toUpperCase(),
            style: const TextStyle(
                fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: CaknaColors.inkSoft)),
      );
}

class _PrayerModeRow extends StatelessWidget {
  final String name;
  final int mode;
  final ValueChanged<int> onChanged;
  const _PrayerModeRow({required this.name, required this.mode, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          Expanded(child: Text(name, style: const TextStyle(fontSize: 14))),
          _seg(Icons.notifications_off_outlined, 0),
          _seg(Icons.vibration, 1),
          _seg(Icons.volume_up, 2),
        ],
      ),
    );
  }

  Widget _seg(IconData icon, int value) {
    final selected = mode == value;
    return Padding(
      padding: const EdgeInsets.only(left: 8),
      child: InkWell(
        onTap: () => onChanged(value),
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(10),
            color: selected ? CaknaColors.olive : CaknaColors.olive.withValues(alpha: 0.08),
          ),
          child: Icon(icon, size: 18, color: selected ? Colors.white : CaknaColors.inkSoft),
        ),
      ),
    );
  }
}

class _ModeLegend extends StatelessWidget {
  const _ModeLegend();
  @override
  Widget build(BuildContext context) {
    Widget item(IconData i, String t) => Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(i, size: 15, color: CaknaColors.inkSoft),
            const SizedBox(width: 4),
            Text(t, style: const TextStyle(fontSize: 11.5, color: CaknaColors.inkSoft)),
          ],
        );
    return Wrap(
      spacing: 16,
      runSpacing: 6,
      children: [
        item(Icons.notifications_off_outlined, 'Tiada'),
        item(Icons.vibration, 'Getar'),
        item(Icons.volume_up, 'Azan'),
      ],
    );
  }
}
