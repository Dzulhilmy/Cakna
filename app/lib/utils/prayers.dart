import 'dart:math' as math;
import 'package:adhan/adhan.dart';

/// Prayer-time computation (JAKIM-style: Fajr 20°, Isha 18°, Asr Shafi'i —
/// matches the `singapore` method) and qibla bearing.
class PrayerCalc {
  final double lat, lng;
  final DateTime fajr, syuruk, dhuha, dhuhr, asr, maghrib, isha, imsak;

  PrayerCalc._({
    required this.lat,
    required this.lng,
    required this.imsak,
    required this.fajr,
    required this.syuruk,
    required this.dhuha,
    required this.dhuhr,
    required this.asr,
    required this.maghrib,
    required this.isha,
  });

  /// Build from explicit prayer times (e.g. official JAKIM e-Solat) so the
  /// same nextPrayer/countdown/row UI works regardless of source. [dhuha] is
  /// optional (older server payloads omit it) — falls back to syuruk + 28 min,
  /// the JAKIM takwim convention.
  factory PrayerCalc.fromTimes({
    required double lat,
    required double lng,
    required DateTime imsak,
    required DateTime fajr,
    required DateTime syuruk,
    DateTime? dhuha,
    required DateTime dhuhr,
    required DateTime asr,
    required DateTime maghrib,
    required DateTime isha,
  }) =>
      PrayerCalc._(
        lat: lat,
        lng: lng,
        imsak: imsak,
        fajr: fajr,
        syuruk: syuruk,
        dhuha: dhuha ?? syuruk.add(const Duration(minutes: 28)),
        dhuhr: dhuhr,
        asr: asr,
        maghrib: maghrib,
        isha: isha,
      );

  factory PrayerCalc.forDate(double lat, double lng, DateTime date) {
    final params = CalculationMethod.singapore.getParameters()..madhab = Madhab.shafi;
    final pt = PrayerTimes(
      Coordinates(lat, lng),
      DateComponents.from(date),
      params,
    );
    return PrayerCalc._(
      lat: lat,
      lng: lng,
      imsak: pt.fajr.subtract(const Duration(minutes: 10)),
      fajr: pt.fajr,
      syuruk: pt.sunrise,
      dhuha: pt.sunrise.add(const Duration(minutes: 28)),
      dhuhr: pt.dhuhr,
      asr: pt.asr,
      maghrib: pt.maghrib,
      isha: pt.isha,
    );
  }

  /// Ordered (label, time) for the 5 obligatory prayers + the informational
  /// times (Imsak, Syuruk, Dhuha), for display.
  List<(String, DateTime)> get all => [
        ('Imsak', imsak),
        ('Subuh', fajr),
        ('Syuruk', syuruk),
        ('Dhuha', dhuha),
        ('Zohor', dhuhr),
        ('Asar', asr),
        ('Maghrib', maghrib),
        ('Isyak', isha),
      ];

  /// The next upcoming prayer among the 5 obligatory ones (label, time).
  (String, DateTime) nextPrayer(DateTime now) {
    final sched = [
      ('Subuh', fajr),
      ('Zohor', dhuhr),
      ('Asar', asr),
      ('Maghrib', maghrib),
      ('Isyak', isha),
    ];
    for (final p in sched) {
      if (p.$2.isAfter(now)) return p;
    }
    // after Isyak → tomorrow's Subuh
    final tomorrow = PrayerCalc.forDate(lat, lng, now.add(const Duration(days: 1)));
    return ('Subuh', tomorrow.fajr);
  }
}

/// Great-circle initial bearing (degrees from North) to the Kaaba.
double qiblaBearing(double lat, double lng) {
  const kaabaLat = 21.4225, kaabaLng = 39.8262;
  const rad = math.pi / 180;
  final phi1 = lat * rad, phi2 = kaabaLat * rad;
  final dLng = (kaabaLng - lng) * rad;
  final y = math.sin(dLng);
  final x = math.cos(phi1) * math.tan(phi2) - math.sin(phi1) * math.cos(dLng);
  final b = math.atan2(y, x) / rad;
  return (b + 360) % 360;
}
