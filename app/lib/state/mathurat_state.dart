import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';

String _todayKey() {
  final n = DateTime.now();
  return '${n.year}-${n.month.toString().padLeft(2, '0')}-${n.day.toString().padLeft(2, '0')}';
}

/// Daily-reset Al-Ma'thurat progress: four independent count arrays
/// (sughra/kubra × pagi/petang), each indexed by the original 0..27 item index.
/// Resets when the stored date != today. Persisted as JSON in prefs.
class MathuratState extends ChangeNotifier {
  final SharedPreferences _prefs;
  static const _key = 'mathurat_progress';

  final String _date = _todayKey();
  String version = 's'; // 's' sughra | 'k' kubra
  bool showMeaning = true;
  final Map<String, List<int>> _counts = {
    's_pagi': List.filled(28, 0),
    's_petang': List.filled(28, 0),
    'k_pagi': List.filled(28, 0),
    'k_petang': List.filled(28, 0),
  };

  MathuratState(this._prefs) {
    _load();
  }

  void _load() {
    version = _prefs.getString('mathurat_version') ?? 's';
    showMeaning = _prefs.getBool('mathurat_maksud') ?? true;
    final raw = _prefs.getString(_key);
    if (raw != null) {
      try {
        final j = jsonDecode(raw) as Map<String, dynamic>;
        if (j['d'] == _date) {
          for (final k in _counts.keys) {
            final arr = (j[k] as List?)?.cast<int>();
            if (arr != null && arr.length == 28) _counts[k] = List.of(arr);
          }
        }
      } catch (_) {/* keep zeros */}
    }
  }

  void _persist() {
    _prefs.setString(_key, jsonEncode({'d': _date, ..._counts}));
  }

  String _activeKey(bool pagi) => '${version}_${pagi ? 'pagi' : 'petang'}';

  int count(bool pagi, int index) => _counts[_activeKey(pagi)]![index];

  void increment(bool pagi, int index, int target) {
    final arr = _counts[_activeKey(pagi)]!;
    if (arr[index] >= target) return;
    arr[index]++;
    _persist();
    notifyListeners();
  }

  void resetActive(bool pagi) {
    _counts[_activeKey(pagi)] = List.filled(28, 0);
    _persist();
    notifyListeners();
  }

  void setVersion(String v) {
    version = v;
    _prefs.setString('mathurat_version', v);
    notifyListeners();
  }

  void setShowMeaning(bool v) {
    showMeaning = v;
    _prefs.setBool('mathurat_maksud', v);
    notifyListeners();
  }
}
