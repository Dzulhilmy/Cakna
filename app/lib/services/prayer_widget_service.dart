import 'package:home_widget/home_widget.dart';
import 'package:intl/intl.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/hijri.dart';
import 'solat_service.dart';

/// Feeds the Android home-screen prayer widget (Tilawah parity): writes
/// today's AND tomorrow's times to the widget data store (the provider picks
/// the set matching the current date, so the widget rolls over at midnight
/// even if the app isn't opened) and asks the provider to redraw. Called on
/// launch, app resume, and prayer-settings changes. Best-effort — a failure
/// never affects the app.
class PrayerWidgetService {
  static Future<void> update(
    SharedPreferences prefs,
    double lat,
    double lng, {
    String? zoneCode,
  }) async {
    try {
      final now = DateTime.now();
      final zone = zoneCode == 'Automatik' ? null : zoneCode;

      Future<void> saveDay(String prefix, DateTime day) async {
        final res = await SolatService.forDate(prefs, lat, lng, day, zoneCode: zone);
        final c = res.calc;
        String f(DateTime t) =>
            '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
        final hijri = HijriDate.tryParse(res.hijri) ??
            HijriDate.fromGregorian(day, offsetDays: prefs.getInt('hijriOffset') ?? 0);
        await HomeWidget.saveWidgetData('${prefix}day', DateFormat('yyyy-MM-dd').format(day));
        await HomeWidget.saveWidgetData(
            '${prefix}date', '${DateFormat('d MMM').format(day)} · ${hijri.label}');
        await HomeWidget.saveWidgetData('${prefix}subuh', f(c.fajr));
        await HomeWidget.saveWidgetData('${prefix}syuruk', f(c.syuruk));
        await HomeWidget.saveWidgetData('${prefix}zohor', f(c.dhuhr));
        await HomeWidget.saveWidgetData('${prefix}asar', f(c.asr));
        await HomeWidget.saveWidgetData('${prefix}maghrib', f(c.maghrib));
        await HomeWidget.saveWidgetData('${prefix}isyak', f(c.isha));
        if (prefix == 'w_') {
          await HomeWidget.saveWidgetData('w_zone', res.zone.shortName);
        }
      }

      await saveDay('w_', now);
      await saveDay('w2_', now.add(const Duration(days: 1)));
      // 0 = follow system, 1 = light, 2 = dark
      await HomeWidget.saveWidgetData('w_theme', prefs.getInt('widgetTheme') ?? 0);
      await HomeWidget.updateWidget(
        name: 'PrayerWidgetProvider',
        qualifiedAndroidName: 'my.cakna.PrayerWidgetProvider',
      );
    } catch (_) {/* widget refresh is best-effort */}
  }
}
