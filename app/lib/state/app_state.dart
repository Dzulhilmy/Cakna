import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Lightweight app-wide state: theme mode, last-read position, reading language.
class AppState extends ChangeNotifier {
  final SharedPreferences prefs;
  AppState(this.prefs);

  ThemeMode get themeMode =>
      ThemeMode.values[prefs.getInt('themeMode') ?? ThemeMode.system.index];
  set themeMode(ThemeMode m) {
    prefs.setInt('themeMode', m.index);
    notifyListeners();
  }

  int get lastPage => prefs.getInt('lastPage') ?? 1;
  set lastPage(int p) {
    prefs.setInt('lastPage', p);
    notifyListeners();
  }

  /// verse translation language: 'ms' | 'en' | 'id'
  String get transLang => prefs.getString('transLang') ?? 'ms';
  set transLang(String v) {
    prefs.setString('transLang', v);
    notifyListeners();
  }

  static Future<AppState> load() async => AppState(await SharedPreferences.getInstance());
}
