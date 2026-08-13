import 'package:flutter/material.dart';
import 'package:flutter_quill/flutter_quill.dart' show FlutterQuillLocalizations;
import 'package:just_audio_background/just_audio_background.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api/cakna_api.dart';
import 'data/db.dart';
import 'data/mathurat_repo.dart';
import 'data/quran_repo.dart';
import 'data/timing_repo.dart';
import 'data/user_db.dart';
import 'screens/hub_shell.dart';
import 'screens/onboarding_screen.dart';
import 'services/location_service.dart';
import 'services/notification_service.dart';
import 'services/prayer_widget_service.dart';
import 'state/app_state.dart';
import 'state/audio_downloads.dart';
import 'state/audio_service.dart';
import 'state/auth.dart';
import 'state/mathurat_state.dart';
import 'state/sync_service.dart';
import 'state/user_data.dart';
import 'theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // media session for background recitation + lock-screen controls.
  // Guarded with a timeout: on some emulators the MediaBrowserService
  // connection can stall and block startup on the splash screen forever.
  // Real devices connect in well under a second, so this never triggers there.
  try {
    await JustAudioBackground.init(
      androidNotificationChannelId: 'my.cakna.audio',
      androidNotificationChannelName: 'Bacaan Quran',
      androidNotificationOngoing: true,
    ).timeout(const Duration(seconds: 6));
  } catch (e) {
    debugPrint('JustAudioBackground.init skipped (timeout/emulator): $e');
  }
  final appState = await AppState.load();
  final db = CaknaDb();
  final repo = QuranRepo(db);
  final timing = TimingRepo(db);
  final userData = UserData(UserDb());
  try {
    await userData.ensureLoaded();
  } catch (e) {
    // Never white-screen on a DB/schema hiccup — start with an empty store.
    debugPrint('UserData.ensureLoaded failed: $e');
  }
  final prefs = await SharedPreferences.getInstance();
  final mathuratState = MathuratState(prefs);
  final api = CaknaApi(prefs);
  final auth = Auth(api);
  await auth.init();
  final sync = SyncService(
    api: api,
    auth: auth,
    userData: userData,
    appState: appState,
    mathuratState: mathuratState,
    // remote prayer settings landed → the pending azan set and the widget
    // carry stale zone/sound/modes until rebuilt
    onPrayerSettingsChanged: () => LocationService.currentSilent().then((loc) {
      if (appState.anyPrayerNotif) {
        NotificationService.scheduleAzan(prefs, loc.lat, loc.lng,
            modes: appState.prayerModes, zoneCode: appState.prayerZone);
      } else {
        NotificationService.cancelAll();
      }
      PrayerWidgetService.update(prefs, loc.lat, loc.lng, zoneCode: appState.prayerZone);
    }),
  );
  // Re-schedule azan on every launch with fresh (JAKIM) times over a 7-day
  // horizon — covers the case where the user never reopens the prayer screen —
  // and refresh the home-screen widget with today's times.
  LocationService.currentSilent().then((loc) {
    if (appState.anyPrayerNotif) {
      NotificationService.scheduleAzan(prefs, loc.lat, loc.lng,
          modes: appState.prayerModes, zoneCode: appState.prayerZone);
    }
    PrayerWidgetService.update(prefs, loc.lat, loc.lng, zoneCode: appState.prayerZone);
  });
  runApp(CaknaApp(
    appState: appState,
    repo: repo,
    timing: timing,
    userData: userData,
    mathuratRepo: MathuratRepo(repo),
    prefs: prefs,
    mathuratState: mathuratState,
    auth: auth,
    sync: sync,
  ));
}

class CaknaApp extends StatefulWidget {
  final AppState appState;
  final QuranRepo repo;
  final TimingRepo timing;
  final UserData userData;
  final MathuratRepo mathuratRepo;
  final SharedPreferences prefs;
  final MathuratState mathuratState;
  final Auth auth;
  final SyncService sync;
  const CaknaApp({
    super.key,
    required this.appState,
    required this.repo,
    required this.timing,
    required this.userData,
    required this.mathuratRepo,
    required this.prefs,
    required this.mathuratState,
    required this.auth,
    required this.sync,
  });

  @override
  State<CaknaApp> createState() => _CaknaAppState();
}

class _CaknaAppState extends State<CaknaApp> {
  late final AppLifecycleListener _lifecycle;

  @override
  void initState() {
    super.initState();
    // Top up the 7-day azan horizon whenever the app comes back to the
    // foreground and the pending set is stale — without this, notifications
    // silently stop for users who don't relaunch the app for a week. The
    // same hook retries a settings push that was made offline.
    _lifecycle = AppLifecycleListener(onResume: () {
      _topUpAzan();
      widget.sync.onAppResumed();
    });
  }

  void _topUpAzan() {
    final app = widget.appState;
    LocationService.currentSilent().then((loc) {
      if (app.anyPrayerNotif) {
        NotificationService.rescheduleIfStale(widget.prefs, loc.lat, loc.lng,
            modes: app.prayerModes, zoneCode: app.prayerZone);
      }
      PrayerWidgetService.update(widget.prefs, loc.lat, loc.lng, zoneCode: app.prayerZone);
    });
  }

  @override
  void dispose() {
    _lifecycle.dispose();
    super.dispose();
  }

  AppState get appState => widget.appState;
  QuranRepo get repo => widget.repo;
  TimingRepo get timing => widget.timing;
  UserData get userData => widget.userData;
  MathuratRepo get mathuratRepo => widget.mathuratRepo;
  SharedPreferences get prefs => widget.prefs;
  Auth get auth => widget.auth;
  SyncService get sync => widget.sync;

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: appState),
        Provider<QuranRepo>.value(value: repo),
        ChangeNotifierProvider(create: (_) => AudioDownloads()),
        ChangeNotifierProxyProvider<AudioDownloads, AudioService>(
          create: (ctx) => AudioService(repo, ctx.read<AudioDownloads>(), timing),
          update: (_, _, audio) => audio!,
        ),
        ChangeNotifierProvider.value(value: userData),
        Provider<MathuratRepo>.value(value: mathuratRepo),
        ChangeNotifierProvider.value(value: widget.mathuratState),
        ChangeNotifierProvider.value(value: auth),
        ChangeNotifierProvider.value(value: sync),
      ],
      // Selector, not Consumer: AppState notifies on every page turn
      // (lastPage/recentReads) and the app shell must only rebuild when the
      // theme or onboarding state actually changes.
      child: Selector<AppState, (ThemeMode, bool)>(
        selector: (_, app) => (app.themeMode, app.onboarded),
        builder: (context, sel, _) => MaterialApp(
          title: 'Cakna',
          debugShowCheckedModeBanner: false,
          theme: caknaLight(),
          darkTheme: caknaDark(),
          themeMode: sel.$1,
          // required by the flutter_quill note editor
          localizationsDelegates: FlutterQuillLocalizations.localizationsDelegates,
          home: sel.$2 ? const HubShell() : const OnboardingScreen(),
        ),
      ),
    );
  }
}
