import 'package:flutter/foundation.dart';
import '../api/cakna_api.dart';

/// Holds the site_content blob fetched from the Hub admin dashboard.
/// Provided at HubShell level; screens watch this notifier to rebuild when data arrives.
/// All accessors return safe defaults so screens work offline too.
class HubContent extends ChangeNotifier {
  Map<String, dynamic> site = {};
  List<dynamic> programs = [];
  List<dynamic> notifications = [];
  List<dynamic> events = [];
  List<dynamic> notices = [];
  bool _loaded = false;

  Future<void> load(CaknaApi api) async {
    if (_loaded) return;
    await _fetch(api);
  }

  Future<void> refresh(CaknaApi api) async {
    _loaded = false;
    await _fetch(api);
  }

  Future<void> _fetch(CaknaApi api) async {
    // Public calls always run first — failure here is a real network problem.
    try {
      final results = await Future.wait([api.hubSite(), api.hubPrograms()]);
      site = results[0] as Map<String, dynamic>;
      programs = results[1] as List<dynamic>;
    } catch (_) {}

    // Auth-gated calls are best-effort; failure just means the user isn't signed in.
    try {
      final results = await Future.wait([
        api.hubNotifications(),
        api.hubEvents(),
        api.hubNotices(),
      ]);
      notifications = results[0];
      events = results[1];
      notices = results[2];
    } catch (_) {}

    _loaded = true;
    notifyListeners();
  }

  Future<void> markNoticeRead(CaknaApi api, String id) async {
    try {
      await api.hubMarkNoticeRead(id);
      notices = notices.map((n) {
        final m = Map<String, dynamic>.from(n as Map);
        if (m['id'] == id) {
          final rb = List<dynamic>.from(m['read_by'] as List? ?? []);
          if (!rb.contains(id)) rb.add(id);
          m['read_by'] = rb;
        }
        return m;
      }).toList();
      notifyListeners();
    } catch (_) {}
  }

  /// Force a refresh on next [load] call (e.g. after submitting a form).
  void invalidate() {
    _loaded = false;
  }

  /// Safe string value at [keys] path, returns [fallback] if missing or wrong type.
  String s(List<String> keys, String fallback) {
    dynamic v = site;
    for (final k in keys) {
      if (v is! Map<String, dynamic>) return fallback;
      v = v[k];
    }
    return v is String ? v : fallback;
  }

  /// Safe list-of-maps at [keys] path, returns [] if missing or wrong type.
  List<Map<String, dynamic>> mapList(List<String> keys) {
    dynamic v = site;
    for (final k in keys) {
      if (v is! Map<String, dynamic>) return [];
      v = v[k];
    }
    if (v is! List) return [];
    return v.whereType<Map<String, dynamic>>().toList();
  }

  /// Safe list-of-strings at [keys] path, returns [] if missing or wrong type.
  List<String> strList(List<String> keys) {
    dynamic v = site;
    for (final k in keys) {
      if (v is! Map<String, dynamic>) return [];
      v = v[k];
    }
    if (v is! List) return [];
    return v.whereType<String>().toList();
  }

  /// Section display order for the Setem page. Falls back to the canonical default.
  List<String> setemSectionOrder() {
    final raw = strList(['sectionOrder', 'setemPage']);
    return raw.isNotEmpty
        ? raw
        : const ['hero', 'gap', 'whatIsSetem', 'whatToExpect', 'whoIsItFor', 'ourProcess', 'cta', 'customSections'];
  }

  /// Section display order for the About page. Falls back to the canonical default.
  List<String> aboutSectionOrder() {
    final raw = strList(['sectionOrder', 'aboutPage']);
    return raw.isNotEmpty
        ? raw
        : const ['hero', 'whoWeAre', 'purpose', 'collabStats', 'testimonial', 'cta', 'customSections'];
  }
}
