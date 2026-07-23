import 'package:flutter/material.dart';

/// Cakna design system — muted olive-gray identity (user palette:
/// #0c0c09 #1d1d16 #2b2b22 #474739 #5b5b4b #7c7c67 #abab9c). Near-monochrome,
/// warm and refined; light + dark variants.
class CaknaColors {
  // core ramp (darkest → lightest)
  static const o900 = Color(0xFF0C0C09);
  static const o800 = Color(0xFF1D1D16);
  static const o700 = Color(0xFF2B2B22);
  static const o600 = Color(0xFF474739);
  static const o500 = Color(0xFF5B5B4B);
  static const o400 = Color(0xFF7C7C67);
  static const o300 = Color(0xFFABAB9C);

  // semantic
  static const olive = o600; // primary #474739
  static const oliveBright = o400; // lighter (dark-mode primary) #7C7C67
  static const oliveDeep = o700; // emphasis #2B2B22
  static const gold = o400; // accent (monochrome) #7C7C67
  static const ink = o800; // #1D1D16
  static const inkSoft = o500; // #5B5B4B

  // light
  static const bg = Color(0xFFF6F5EF);
  static const surface = Color(0xFFFFFFFF);
  static const border = Color(0xFFE5E4DA);

  // dark
  static const bgDark = o900; // #0C0C09
  static const surfaceDark = o800; // #1D1D16
  static const borderDark = o700; // #2B2B22
  static const inkDark = Color(0xFFD8D7CB);
  static const inkSoftDark = o300; // #ABAB9C
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
