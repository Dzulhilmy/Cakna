import 'package:flutter/material.dart';

/// Cakna design system — olive identity (Tailwind lime family: primary
/// lime-700 #4D7C0F, bright lime-500 #84CC16, deep lime-800 #3F6212) with warm
/// gold accent and warm neutrals. Light and dark variants.
class CaknaColors {
  static const olive = Color(0xFF4D7C0F); // primary
  static const oliveBright = Color(0xFF84CC16); // lighter (dark-mode primary, gradients)
  static const oliveDeep = Color(0xFF3F6212); // emphasis text
  static const gold = Color(0xFFCA8A04); // warm gold accent (Tailwind yellow-600)
  static const ink = Color(0xFF1F2410);
  static const inkSoft = Color(0xFF6B6F5A);

  // light
  static const bg = Color(0xFFF6F6EF);
  static const surface = Color(0xFFFFFFFF);
  static const border = Color(0xFFE7E8DD);

  // dark
  static const bgDark = Color(0xFF14170E);
  static const surfaceDark = Color(0xFF1E2216);
  static const borderDark = Color(0xFF343A28);
  static const inkDark = Color(0xFFEAECE0);
  static const inkSoftDark = Color(0xFFA6AB93);
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
        primary: CaknaColors.olive,
        secondary: CaknaColors.oliveBright,
        surface: CaknaColors.surface,
        onPrimary: Colors.white,
        onSurface: CaknaColors.ink,
      ),
    );

ThemeData caknaDark() => _base(
      Brightness.dark,
      const ColorScheme.dark(
        primary: CaknaColors.oliveBright,
        secondary: CaknaColors.olive,
        surface: CaknaColors.surfaceDark,
        onPrimary: Color(0xFF14200A),
        onSurface: CaknaColors.inkDark,
      ),
    );
