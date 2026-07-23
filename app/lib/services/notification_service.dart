import 'dart:async' show unawaited;

import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter_timezone/flutter_timezone.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:timezone/data/latest_all.dart' as tzdata;
import 'package:timezone/timezone.dart' as tz;
import 'solat_service.dart';

/// Schedules azan (prayer-time) notifications from the official JAKIM times
/// (for today) with an astronomical fallback, over a 7-day horizon, using exact
/// alarms that survive reboot. Vibrate mode uses a separate silent channel so
/// Android O+ actually stays silent.
class NotificationService {
  static final _plugin = FlutterLocalNotificationsPlugin();
  static bool _ready = false;

  // One channel per selectable azan sound — an Android channel's sound is
  // immutable once created. Index 1 keeps the original 'azan' channel id for
  // installed-base compatibility; 2 and 3 are the Tilawah-parity variants.
  static const _soundChannels = [
    AndroidNotificationChannel(
      'azan',
      'Azan 1 (Waktu Solat)',
      description: 'Notifikasi masuk waktu solat dengan bunyi azan',
      importance: Importance.high,
      sound: RawResourceAndroidNotificationSound('azan'),
    ),
    AndroidNotificationChannel(
      'azan_s2',
      'Azan 2 (Waktu Solat)',
      description: 'Notifikasi masuk waktu solat dengan bunyi azan',
      importance: Importance.high,
      sound: RawResourceAndroidNotificationSound('azan2'),
    ),
    AndroidNotificationChannel(
      'azan_s3',
      'Azan 3 (Waktu Solat)',
      description: 'Notifikasi masuk waktu solat dengan bunyi azan',
      importance: Importance.high,
      sound: RawResourceAndroidNotificationSound('azan3'),
    ),
  ];

  static const _vibrateChannel = AndroidNotificationChannel(
    'azan_silent',
    'Waktu Solat (Getar)',
    description: 'Notifikasi masuk waktu solat tanpa bunyi (getar sahaja)',
    importance: Importance.high,
    playSound: false,
    enableVibration: true,
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
    final android =
        _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    for (final c in _soundChannels) {
      await android?.createNotificationChannel(c);
    }
    await android?.createNotificationChannel(_vibrateChannel);
    _ready = true;
  }

  static Future<bool> requestPermission() async {
    await _init();
    final ios = await _plugin
        .resolvePlatformSpecificImplementation<IOSFlutterLocalNotificationsPlugin>()
        ?.requestPermissions(alert: true, badge: true, sound: true);
    final android =
        _plugin.resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();
    final androidGranted = await android?.requestNotificationsPermission();
    // exact alarms (Android 12+) so azan fires on time under Doze
    await android?.requestExactAlarmsPermission();
    return ios ?? androidGranted ?? true;
  }

  /// Details for azan sound variant 1..3.
  static NotificationDetails _soundDetails(int sound) {
    final i = sound.clamp(1, 3);
    final channel = _soundChannels[i - 1];
    return NotificationDetails(
      android: AndroidNotificationDetails(
        channel.id,
        channel.name,
        channelDescription: channel.description,
        importance: Importance.high,
        priority: Priority.high,
        sound: channel.sound,
      ),
      iOS: DarwinNotificationDetails(sound: i == 1 ? 'azan.caf' : 'azan$i.caf'),
    );
  }

  static const _silentDetails = NotificationDetails(
    android: AndroidNotificationDetails(
      'azan_silent',
      'Waktu Solat (Getar)',
      channelDescription: 'Notifikasi masuk waktu solat tanpa bunyi',
      importance: Importance.high,
      priority: Priority.high,
      playSound: false,
      enableVibration: true,
    ),
    iOS: DarwinNotificationDetails(presentSound: false),
  );

  /// (Re)schedule azan for the next 7 days (5 prayers × 7 = 35 pending, under
  /// iOS's 64-notification cap). Official JAKIM times are used for today;
  /// astronomical fallback for the following days. Only prayers with mode > 0
  /// fire (mode 1 = vibrate/silent, mode 2 = azan sound).
  static bool _scheduling = false;
  // a reschedule requested while one is in flight is coalesced (latest args
  // win) instead of silently dropped — rapid settings taps must all land
  static ({
    SharedPreferences prefs,
    double lat,
    double lng,
    Map<String, int>? modes,
    String? zoneCode
  })? _pendingSchedule;

  /// Reschedule on app resume, but only when the pending set is getting stale
  /// (last scheduled more than 12h ago) so routine foregrounding stays cheap.
  static Future<void> rescheduleIfStale(
    SharedPreferences prefs,
    double lat,
    double lng, {
    Map<String, int>? modes,
    String? zoneCode,
  }) async {
    final last = prefs.getInt('azanScheduledAt') ?? 0;
    final age = DateTime.now().millisecondsSinceEpoch - last;
    if (age < const Duration(hours: 12).inMilliseconds) return;
    await scheduleAzan(prefs, lat, lng, modes: modes, zoneCode: zoneCode);
  }

  static Future<void> scheduleAzan(
    SharedPreferences prefs,
    double lat,
    double lng, {
    Map<String, int>? modes,
    String? zoneCode,
  }) async {
    // Serialize: a launch-time reschedule and a settings-change reschedule can
    // race, and two cancelAll()+schedule() interleavings corrupt the set.
    if (_scheduling) {
      _pendingSchedule = (prefs: prefs, lat: lat, lng: lng, modes: modes, zoneCode: zoneCode);
      return;
    }
    _scheduling = true;
    try {
      await _init();
      await _plugin.cancelAll();
      final now = DateTime.now();
      final zone = zoneCode == 'Automatik' ? null : zoneCode;
      // 0 = Tiada (silences mode-2 prayers to vibrate), 1..3 = azan variant
      final sound = (prefs.getInt('azanSound') ?? 1).clamp(0, 3);
      var id = 0;
      for (var dayOffset = 0; dayOffset <= 6; dayOffset++) {
        final date = now.add(Duration(days: dayOffset));
        final res = await SolatService.forDate(prefs, lat, lng, date, zoneCode: zone);
        final calc = res.calc;
        final prayers = <(String, DateTime)>[
          ('Subuh', calc.fajr),
          ('Zohor', calc.dhuhr),
          ('Asar', calc.asr),
          ('Maghrib', calc.maghrib),
          ('Isyak', calc.isha),
        ];
        for (final (name, time) in prayers) {
          if (time.isBefore(now)) continue;
          final mode = modes?[name] ?? 2;
          if (mode == 0) continue;
          await _plugin.zonedSchedule(
            id: id++,
            title: 'Waktu $name',
            body: 'Telah masuk waktu solat $name.',
            scheduledDate: tz.TZDateTime.from(time, tz.local),
            notificationDetails: (mode == 2 && sound != 0) ? _soundDetails(sound) : _silentDetails,
            androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
          );
        }
      }
      await prefs.setInt('azanScheduledAt', DateTime.now().millisecondsSinceEpoch);
    } finally {
      _scheduling = false;
      final p = _pendingSchedule;
      if (p != null) {
        _pendingSchedule = null;
        unawaited(scheduleAzan(p.prefs, p.lat, p.lng, modes: p.modes, zoneCode: p.zoneCode));
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
      notificationDetails: _soundDetails(1),
    );
  }
}
