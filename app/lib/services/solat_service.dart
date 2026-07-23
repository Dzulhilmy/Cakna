import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/jakim_zones.dart';
import '../utils/prayers.dart';

/// Prayer times for a day, with their source. Official JAKIM e-Solat times
/// (via the cakna.qcxis.com proxy) when online for *today*; otherwise the
/// astronomical `PrayerCalc` fallback so the app still works offline / for
/// other days.
class SolatResult {
  final PrayerCalc calc;
  final String? hijri; // "YYYY-MM-DD" from JAKIM, else null
  final JakimZone zone;
  final bool official;
  SolatResult({required this.calc, required this.zone, required this.official, this.hijri});
}

class SolatService {
  // Same override as CaknaApi.base — see cakna_api.dart.
  static const _base = String.fromEnvironment(
    'CAKNA_API_BASE',
    defaultValue: 'https://cakna.qcxis.com/api',
  );

  /// Fires when today's official Hijri date is (re)fetched, so widgets that
  /// display it (e.g. the home header) can rebuild without a full state poke.
  static final hijriNotifier = ValueNotifier<String?>(null);

  /// Resolve prayer times for [date]. Uses official JAKIM times for today
  /// (cached per zone for the day); falls back to astronomical calc otherwise.
  static Future<SolatResult> forDate(
    SharedPreferences prefs,
    double lat,
    double lng,
    DateTime date, {
    String? zoneCode,
  }) async {
    final explicit = zoneCode != null ? JakimZones.byCode(zoneCode) : null;
    final zone = explicit ?? JakimZones.nearest(lat, lng);
    // The astronomical fallback must follow the SELECTED zone's location, not
    // the device's — azan is scheduled 7 days out through this path, and a
    // device in KL with zone SBH07 (Kota Kinabalu) would otherwise fire up to
    // ~1h off for every non-today day. Automatik keeps the device coords.
    final calcLat = explicit?.lat ?? lat, calcLng = explicit?.lng ?? lng;

    if (_sameDay(date, DateTime.now())) {
      final official = await _officialToday(prefs, zone, calcLat, calcLng, date);
      if (official != null) return official;
    }
    return SolatResult(
      calc: PrayerCalc.forDate(calcLat, calcLng, date),
      zone: zone,
      official: false,
    );
  }

  static Future<SolatResult?> _officialToday(
      SharedPreferences prefs, JakimZone zone, double lat, double lng, DateTime date) async {
    final dayKey = _dayKey(date);
    final cacheKey = 'solat_${zone.code}';

    Map<String, dynamic>? data;
    final cached = prefs.getString(cacheKey);
    if (cached != null) {
      try {
        final m = jsonDecode(cached) as Map<String, dynamic>;
        if (m['_day'] == dayKey) data = m;
      } catch (_) {/* ignore corrupt cache */}
    }

    if (data == null) {
      try {
        final resp = await http
            .get(Uri.parse('$_base/solat/${zone.code}'))
            .timeout(const Duration(seconds: 8));
        if (resp.statusCode == 200) {
          final m = jsonDecode(resp.body) as Map<String, dynamic>;
          m['_day'] = dayKey;
          await prefs.setString(cacheKey, jsonEncode(m));
          data = m;
        }
      } catch (_) {/* offline / upstream error → fall back */}
    }
    if (data == null) return null;

    try {
      final times = (data['times'] as Map).cast<String, dynamic>();
      DateTime at(String k) => _parse(date, times[k] as String);
      final calc = PrayerCalc.fromTimes(
        lat: lat,
        lng: lng,
        imsak: at('Imsak'),
        fajr: at('Subuh'),
        syuruk: at('Syuruk'),
        // older server payloads have no Dhuha key → fromTimes falls back
        dhuha: times['Dhuha'] is String ? at('Dhuha') : null,
        dhuhr: at('Zohor'),
        asr: at('Asar'),
        maghrib: at('Maghrib'),
        isha: at('Isyak'),
      );
      final hijri = data['hijri'] as String?;
      if (hijri != null) {
        // shared with widgets (e.g. the home header) that show today's Hijri
        // date but don't do their own solat fetch
        await prefs.setString('hijriOfficial', '$dayKey|$hijri');
        hijriNotifier.value = hijri;
      }
      return SolatResult(
        calc: calc,
        zone: zone,
        official: true,
        hijri: hijri,
      );
    } catch (_) {
      return null; // malformed payload → astronomical fallback
    }
  }

  /// Today's official JAKIM Hijri date ("YYYY-MM-DD"), if one was fetched
  /// today; null otherwise (caller falls back to the tabular conversion).
  static String? officialHijri(SharedPreferences prefs) {
    final raw = prefs.getString('hijriOfficial');
    if (raw == null) return null;
    final i = raw.indexOf('|');
    if (i < 0 || raw.substring(0, i) != _dayKey(DateTime.now())) return null;
    return raw.substring(i + 1);
  }

  /// "HH:MM:SS" Malaysian wall-clock (UTC+8, no DST) → the correct absolute
  /// instant expressed in device-local time, so times are right even when the
  /// device timezone isn't Asia/Kuala_Lumpur.
  static DateTime _parse(DateTime date, String hhmmss) {
    final p = hhmmss.split(':');
    final h = int.parse(p[0]), m = int.parse(p[1]), s = p.length > 2 ? int.parse(p[2]) : 0;
    return DateTime.utc(date.year, date.month, date.day, h, m, s)
        .subtract(const Duration(hours: 8))
        .toLocal();
  }

  static bool _sameDay(DateTime a, DateTime b) =>
      a.year == b.year && a.month == b.month && a.day == b.day;

  static String _dayKey(DateTime d) =>
      '${d.year}-${d.month.toString().padLeft(2, '0')}-${d.day.toString().padLeft(2, '0')}';
}
