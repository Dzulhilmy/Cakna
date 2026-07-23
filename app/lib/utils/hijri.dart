/// Gregorian → Hijri conversion (tabular / Kuwaiti algorithm) for display in
/// the header. Within ~1 day of the official Umm al-Qura / JAKIM calendar —
/// good enough for a date label, not for fiqh rulings.
class HijriDate {
  final int day, month, year; // month 1..12
  const HijriDate(this.day, this.month, this.year);

  static const monthsMs = [
    'Muharram', 'Safar', 'Rabiulawal', 'Rabiulakhir', 'Jamadilawal',
    'Jamadilakhir', 'Rejab', 'Syaaban', 'Ramadan', 'Syawal',
    'Zulkaedah', 'Zulhijjah',
  ];

  String get monthName => monthsMs[month - 1];

  /// e.g. "18 Muharram 1448 AH"
  String get label => '$day $monthName $year AH';

  /// Parse an ISO Hijri string "YYYY-MM-DD" (e.g. from the JAKIM feed).
  static HijriDate? tryParse(String? iso) {
    if (iso == null) return null;
    final p = iso.split('-');
    if (p.length != 3) return null;
    final y = int.tryParse(p[0]), m = int.tryParse(p[1]), d = int.tryParse(p[2]);
    if (y == null || m == null || d == null || m < 1 || m > 12) return null;
    return HijriDate(d, m, y);
  }

  factory HijriDate.fromGregorian(DateTime g, {int offsetDays = 0}) {
    if (offsetDays != 0) g = g.add(Duration(days: offsetDays));
    final y = g.year, m = g.month, d = g.day;
    final int jd;
    if (y > 1582 || (y == 1582 && m > 10) || (y == 1582 && m == 10 && d > 14)) {
      jd = ((1461 * (y + 4800 + ((m - 14) ~/ 12))) ~/ 4) +
          ((367 * (m - 2 - 12 * ((m - 14) ~/ 12))) ~/ 12) -
          ((3 * ((y + 4900 + ((m - 14) ~/ 12)) ~/ 100)) ~/ 4) +
          d -
          32075;
    } else {
      jd = 367 * y -
          ((7 * (y + 5001 + ((m - 9) ~/ 7))) ~/ 4) +
          ((275 * m) ~/ 9) +
          d +
          1729777;
    }

    var l = jd - 1948440 + 10632;
    final n = (l - 1) ~/ 10631;
    l = l - 10631 * n + 354;
    final j = ((10985 - l) ~/ 5316) * ((50 * l) ~/ 17719) +
        (l ~/ 5670) * ((43 * l) ~/ 15238);
    l = l -
        ((30 - j) ~/ 15) * ((17719 * j) ~/ 50) -
        (j ~/ 16) * ((15238 * j) ~/ 43) +
        29;
    final month = (24 * l) ~/ 709;
    final day = l - ((709 * month) ~/ 24);
    final year = 30 * n + j - 30;
    return HijriDate(day, month, year);
  }
}
