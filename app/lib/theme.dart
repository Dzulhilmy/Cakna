import 'package:flutter/material.dart';

/// Cakna design system — teal identity (derived from the app icon/tab assets:
/// primary #0EA8AC, bright #1DBCC0), on Inter (UI) + Lora (display) + Uthmani
/// (Arabic). Light and dark variants.
class CaknaColors {
  static const teal = Color(0xFF0EA8AC);
  static const tealBright = Color(0xFF1DBCC0);
  static const tealDeep = Color(0xFF0A7F82);
  static const gold = Color(0xFFE0E356); // compass/accent yellow-green
  static const ink = Color(0xFF1B2A2B);
  static const inkSoft = Color(0xFF5A6B6C);

  // light
  static const bg = Color(0xFFF4F7F7);
  static const surface = Color(0xFFFFFFFF);
  static const border = Color(0xFFE4EAEA);

  // dark
  static const bgDark = Color(0xFF0E1618);
  static const surfaceDark = Color(0xFF162124);
  static const borderDark = Color(0xFF233336);
  static const inkDark = Color(0xFFE7EDED);
  static const inkSoftDark = Color(0xFF93A6A7);
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

ThemeData caknaLight() => _base(
      Brightness.light,
      const ColorScheme.light(
        primary: CaknaColors.teal,
        secondary: CaknaColors.tealBright,
        surface: CaknaColors.surface,
        onPrimary: Colors.white,
        onSurface: CaknaColors.ink,
      ),
    );

ThemeData caknaDark() => _base(
      Brightness.dark,
      const ColorScheme.dark(
        primary: CaknaColors.tealBright,
        secondary: CaknaColors.teal,
        surface: CaknaColors.surfaceDark,
        onPrimary: Color(0xFF04211F),
        onSurface: CaknaColors.inkDark,
      ),
    );
