import 'package:geocoding/geocoding.dart' as geo;
import 'package:geolocator/geolocator.dart';

/// Resolves the device location, handling permission requests. Falls back to
/// Kuala Lumpur so prayer times / qibla always render something sensible.
class LocationService {
  static const fallback = (lat: 3.139, lng: 101.6869, name: 'Kuala Lumpur');

  /// Reverse-geocode to a "City, State" label (null on failure/offline).
  static Future<String?> placeName(double lat, double lng) async {
    try {
      final marks = await geo.placemarkFromCoordinates(lat, lng);
      if (marks.isEmpty) return null;
      final m = marks.first;
      final city = (m.locality != null && m.locality!.isNotEmpty)
          ? m.locality
          : m.subAdministrativeArea;
      final state = m.administrativeArea;
      if (city == null || city.isEmpty) return (state?.isNotEmpty == true) ? state : null;
      if (state != null && state.isNotEmpty && state != city) return '$city, $state';
      return city;
    } catch (_) {
      return null;
    }
  }

  /// Location without prompting: uses the device position only if permission
  /// was already granted, else the fallback. Safe to call on passive screens
  /// (e.g. the home dashboard) that shouldn't trigger a permission dialog.
  static Future<({double lat, double lng, bool isFallback})> currentSilent() async {
    try {
      final perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.whileInUse || perm == LocationPermission.always) {
        if (await Geolocator.isLocationServiceEnabled()) {
          final pos = await Geolocator.getCurrentPosition(
            locationSettings: const LocationSettings(accuracy: LocationAccuracy.low),
          );
          return (lat: pos.latitude, lng: pos.longitude, isFallback: false);
        }
      }
    } catch (_) {/* fall through */}
    return (lat: fallback.lat, lng: fallback.lng, isFallback: true);
  }

  static Future<({double lat, double lng, bool isFallback})> current() async {
    try {
      if (!await Geolocator.isLocationServiceEnabled()) {
        return (lat: fallback.lat, lng: fallback.lng, isFallback: true);
      }
      var perm = await Geolocator.checkPermission();
      if (perm == LocationPermission.denied) {
        perm = await Geolocator.requestPermission();
      }
      if (perm == LocationPermission.denied || perm == LocationPermission.deniedForever) {
        return (lat: fallback.lat, lng: fallback.lng, isFallback: true);
      }
      final pos = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(accuracy: LocationAccuracy.low),
      );
      return (lat: pos.latitude, lng: pos.longitude, isFallback: false);
    } catch (_) {
      return (lat: fallback.lat, lng: fallback.lng, isFallback: true);
    }
  }
}
