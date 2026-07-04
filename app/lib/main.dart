import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'api/cakna_api.dart';
import 'data/db.dart';
import 'data/mathurat_repo.dart';
import 'data/quran_repo.dart';
import 'data/user_db.dart';
import 'screens/app_shell.dart';
import 'screens/onboarding_screen.dart';
import 'state/app_state.dart';
import 'state/audio_service.dart';
import 'state/auth.dart';
import 'state/mathurat_state.dart';
import 'state/sync_service.dart';
import 'state/user_data.dart';
import 'theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final appState = await AppState.load();
  final db = CaknaDb();
  final repo = QuranRepo(db);
  final userData = UserData(UserDb());
  await userData.ensureLoaded();
  final prefs = await SharedPreferences.getInstance();
  final auth = Auth(CaknaApi(prefs));
  await auth.init();
  final sync = SyncService(api: CaknaApi(prefs), auth: auth, userData: userData, appState: appState);
  runApp(CaknaApp(
    appState: appState,
    repo: repo,
    userData: userData,
    mathuratRepo: MathuratRepo(repo),
    prefs: prefs,
    auth: auth,
    sync: sync,
  ));
}

class CaknaApp extends StatelessWidget {
  final AppState appState;
  final QuranRepo repo;
  final UserData userData;
  final MathuratRepo mathuratRepo;
  final SharedPreferences prefs;
  final Auth auth;
  final SyncService sync;
  const CaknaApp({
    super.key,
    required this.appState,
    required this.repo,
    required this.userData,
    required this.mathuratRepo,
    required this.prefs,
    required this.auth,
    required this.sync,
  });

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: appState),
        Provider<QuranRepo>.value(value: repo),
        ChangeNotifierProvider(create: (_) => AudioService()),
        ChangeNotifierProvider.value(value: userData),
        Provider<MathuratRepo>.value(value: mathuratRepo),
        ChangeNotifierProvider(create: (_) => MathuratState(prefs)),
        ChangeNotifierProvider.value(value: auth),
        ChangeNotifierProvider.value(value: sync),
      ],
      child: Consumer<AppState>(
        builder: (context, app, _) => MaterialApp(
          title: 'Cakna',
          debugShowCheckedModeBanner: false,
          theme: caknaLight(),
          darkTheme: caknaDark(),
          themeMode: app.themeMode,
          home: app.onboarded ? const AppShell() : const OnboardingScreen(),
        ),
      ),
    );
  }
}
