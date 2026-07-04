import 'package:geolocator/geolocator.dart';

/// Resolves the device location, handling permission requests. Falls back to
/// Kuala Lumpur so prayer times / qibla always render something sensible.
class LocationService {
  static const fallback = (lat: 3.139, lng: 101.6869, name: 'Kuala Lumpur');

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
