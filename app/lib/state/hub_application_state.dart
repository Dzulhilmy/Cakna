import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../api/cakna_api.dart';

/// Tracks the user's funding applications.
/// Seeded from the server on sign-in; falls back to locally-persisted last submission.
class HubApplicationState extends ChangeNotifier {
  List<Map<String, dynamic>> _applications = [];
  List<Map<String, dynamic>> get applications => _applications;

  Map<String, dynamic>? get lastApp =>
      _applications.isNotEmpty ? _applications.first : null;

  Future<void> load() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString('hub_last_application');
      if (raw != null) {
        final decoded = jsonDecode(raw) as Map<String, dynamic>;
        _applications = [decoded];
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> loadFromServer(CaknaApi api) async {
    try {
      final list = await api.hubMyFunding();
      if (list.isEmpty) return;
      _applications = list
          .whereType<Map<String, dynamic>>()
          .map(_normalise)
          .toList();
      notifyListeners();
    } catch (_) {}
  }

  /// Save the most-recently submitted application locally and prepend to list.
  Future<void> save({
    required String programName,
    required String cawangan,
    required String kluster,
    String? id,
    String? reference,
    String status = 'pending_dept',
  }) async {
    final entry = {
      'programName': programName,
      'cawangan': cawangan,
      'kluster': kluster,
      'submittedAt': DateTime.now().toIso8601String(),
      'status': status,
      if (id != null) 'id': id,
      if (reference != null) 'reference': reference,
    };
    _applications = [entry, ..._applications.where((a) => a['id'] != id)];
    notifyListeners();
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('hub_last_application', jsonEncode(entry));
    } catch (_) {}
  }

  /// Map server field names to the shape the home screen card expects.
  static Map<String, dynamic> _normalise(Map<String, dynamic> app) => {
        'programName': app['nama_program'] ?? app['programName'] ?? '',
        'cawangan': app['cawangan'] ?? '',
        'kluster': app['kluster'] ?? '',
        'submittedAt': app['created_at'] ?? app['submittedAt'] ?? '',
        'status': app['status'] ?? 'pending_dept',
        'id': app['id'] ?? '',
        'reference': app['reference'] ?? '',
      };
}
