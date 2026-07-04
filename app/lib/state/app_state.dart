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

  /// whether the first-run onboarding has been completed
  bool get onboarded => prefs.getBool('onboarded') ?? false;
  set onboarded(bool v) {
    prefs.setBool('onboarded', v);
    notifyListeners();
  }

  /// verse translation language: 'ms' | 'en' | 'id'
  String get transLang => prefs.getString('transLang') ?? 'ms';
  set transLang(String v) {
    prefs.setString('transLang', v);
    notifyListeners();
  }

  /// audio reciter edition id (islamic.network), e.g. 'ar.alafasy'
  String get reciter => prefs.getString('reciter') ?? 'ar.alafasy';
  set reciter(String v) {
    prefs.setString('reciter', v);
    notifyListeners();
  }

  /// azan (prayer-time) notifications enabled
  bool get azanEnabled => prefs.getBool('azanEnabled') ?? false;
  set azanEnabled(bool v) {
    prefs.setBool('azanEnabled', v);
    notifyListeners();
  }

  /// colour Arabic by tajweed rule in the verse sheet
  bool get tajweed => prefs.getBool('tajweed') ?? true;
  set tajweed(bool v) {
    prefs.setBool('tajweed', v);
    notifyListeners();
  }

  /// Settings snapshot for cloud sync.
  Map<String, Object> exportSettings() => {
        'theme': themeMode.index,
        'transLang': transLang,
        'reciter': reciter,
        'azan': azanEnabled,
        'tajweed': tajweed,
        'lastPage': lastPage,
      };

  /// Apply a synced settings map (server-wins on sign-in).
  void applySettings(Map<String, dynamic> s) {
    if (s['theme'] is int) prefs.setInt('themeMode', s['theme'] as int);
    if (s['transLang'] is String) prefs.setString('transLang', s['transLang'] as String);
    if (s['reciter'] is String) prefs.setString('reciter', s['reciter'] as String);
    if (s['azan'] is bool) prefs.setBool('azanEnabled', s['azan'] as bool);
    if (s['tajweed'] is bool) prefs.setBool('tajweed', s['tajweed'] as bool);
    if (s['lastPage'] is int) prefs.setInt('lastPage', s['lastPage'] as int);
    notifyListeners();
  }

  static Future<AppState> load() async => AppState(await SharedPreferences.getInstance());
}
