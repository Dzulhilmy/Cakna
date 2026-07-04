import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:timezone/data/latest_all.dart' as tzdata;
import 'package:timezone/timezone.dart' as tz;
import '../utils/prayers.dart';

/// Schedules azan (prayer-time) notifications. Concrete instances are scheduled
/// for the next couple of days and refreshed whenever the toggle/location
/// changes, so shifting daily prayer times stay accurate.
class NotificationService {
  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _ready = false;

  static const _channel = AndroidNotificationChannel(
    'azan',
    'Waktu Solat',
    description: 'Notifikasi masuk waktu solat',
    importance: Importance.high,
    sound: RawResourceAndroidNotificationSound('azan'),
  );

  static Future<void> _init() async {
    if (_ready) return;
    tzdata.initializeTimeZones();
    try {
      tz.setLocalLocation(tz.getLocation((await FlutterTimezone.getLocalTimezone()).identifier));
    } catch (_) {
      tz.setLocalLocation(tz.getLocation('Asia/Kuala_Lumpur'));
    }
    await _plugin.initialize(
      settings: const InitializationSettings(
        android: AndroidInitializationSettings('@mipmap/ic_launcher'),
        iOS: DarwinInitializationSettings(
          requestAlertPermission: false,
          requestBadgePermission: false,
          requestSoundPermission: false,
        ),
      ),
    );
    await _plugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_channel);
    _ready = true;
  }

  static Future<bool> requestPermission() async {
    await _init();
    final ios = await _plugin
        .resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(alert: true, badge: true, sound: true);
    final android = await _plugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>()
        ?.requestNotificationsPermission();
    return ios ?? android ?? true;
  }

  static const _details = NotificationDetails(
    android: AndroidNotificationDetails(
      'azan',
      'Waktu Solat',
      channelDescription: 'Notifikasi masuk waktu solat',
      importance: Importance.high,
      priority: Priority.high,
      sound: RawResourceAndroidNotificationSound('azan'),
    ),
    iOS: DarwinNotificationDetails(sound: 'azan.caf'),
  );

  /// (Re)schedule azan for the next two days at the given location.
  static Future<void> scheduleAzan(double lat, double lng) async {
    await _init();
    await _plugin.cancelAll();
    final now = DateTime.now();
    var id = 0;
    for (var dayOffset = 0; dayOffset <= 1; dayOffset++) {
      final date = now.add(Duration(days: dayOffset));
      final calc = PrayerCalc.forDate(lat, lng, date);
      final prayers = <(String, DateTime)>[
        ('Subuh', calc.fajr),
        ('Zohor', calc.dhuhr),
        ('Asar', calc.asr),
        ('Maghrib', calc.maghrib),
        ('Isyak', calc.isha),
      ];
      for (final (name, time) in prayers) {
        if (time.isBefore(now)) continue;
        await _plugin.zonedSchedule(
          id: id++,
          title: 'Waktu $name',
          body: 'Telah masuk waktu solat $name.',
          scheduledDate: tz.TZDateTime.from(time, tz.local),
          notificationDetails: _details,
          androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
        );
      }
    }
  }

  static Future<void> cancelAll() async {
    await _init();
    await _plugin.cancelAll();
  }

  /// Fire an immediate notification (used to verify the pipeline).
  static Future<void> showNow(String name) async {
    await _init();
    await _plugin.show(
      id: 999,
      title: 'Waktu $name',
      body: 'Telah masuk waktu solat $name.',
      notificationDetails: _details,
    );
  }
}
