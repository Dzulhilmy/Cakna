import 'package:flutter/material.dart';

/// Cakna design system — rose pink identity synced with cakna.org brand palette.
/// Core ramp mirrors the web tokens: rose-950 → rose-200.
class CaknaColors {
  // core ramp (darkest → lightest)
  static const o900 = Color(0xFF0D0809);
  static const o800 = Color(0xFF1E1119);
  static const o700 = Color(0xFF3B1B2C);
  static const o600 = Color(0xFF7B3558);
  static const o500 = Color(0xFF9B4A6F);
  static const o400 = Color(0xFFC47095);
  static const o300 = Color(0xFFE0A8BF);

  // semantic
  static const olive = o600; // primary rose #7B3558
  static const oliveBright = o400; // lighter rose (dark-mode primary) #C47095
  static const oliveDeep = o700; // dark rose emphasis #3B1B2C
  static const gold = o400; // accent rose #C47095
  static const ink = o800; // #1E1119
  static const inkSoft = o500; // #9B4A6F

  // light
  static const bg = Color(0xFFF9F2F6);
  static const surface = Color(0xFFFFFFFF);
  static const border = Color(0xFFF0DCE8);

  // dark
  static const bgDark = o900; // #0D0809
  static const surfaceDark = o800; // #1E1119
  static const borderDark = o700; // #3B1B2C
  static const inkDark = Color(0xFFF0D9E6);
  static const inkSoftDark = o300; // #E0A8BF
}

ThemeData _base(Brightness b, ColorScheme scheme) {
  final dark = b == Brightness.dark;
  return ThemeData(
    useMaterial3: true,
    brightness: b,
    colorScheme: scheme,
    scaffoldBackgroundColor: dark ? CaknaColors.bgDark : CaknaColors.bg,
    fontFamily: 'Inter',
    appBarTheme: AppBarTheme(
      backgroundColor: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
      foregroundColor: dark ? CaknaColors.inkDark : CaknaColors.ink,
      elevation: 0,
      centerTitle: true,
      titleTextStyle: TextStyle(
        fontFamily: 'Lora',
        fontWeight: FontWeight.w600,
        fontSize: 18,
        color: dark ? CaknaColors.inkDark : CaknaColors.ink,
      ),
    ),
    cardTheme: CardThemeData(
      color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: dark ? CaknaColors.borderDark : CaknaColors.border),
      ),
    ),
    dividerColor: dark ? CaknaColors.borderDark : CaknaColors.border,
  );
}

// Built once — MaterialApp rebuilds on AppState notifications and must not
// reconstruct the full ThemeData objects each time.
final ThemeData _caknaLight = _base(
  Brightness.light,
  const ColorScheme.light(
    primary: CaknaColors.olive,
    secondary: CaknaColors.oliveBright,
    surface: CaknaColors.surface,
    onPrimary: Colors.white,
    onSurface: CaknaColors.ink,
  ),
);

final ThemeData _caknaDark = _base(
  Brightness.dark,
  const ColorScheme.dark(
    primary: CaknaColors.o300,
    secondary: CaknaColors.oliveBright,
    surface: CaknaColors.surfaceDark,
    onPrimary: CaknaColors.o900,
    onSurface: CaknaColors.inkDark,
  ),
);

ThemeData caknaLight() => _caknaLight;

ThemeData caknaDark() => _caknaDark;
