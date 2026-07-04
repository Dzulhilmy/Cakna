import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'data/db.dart';
import 'data/mathurat_repo.dart';
import 'data/quran_repo.dart';
import 'data/user_db.dart';
import 'screens/app_shell.dart';
import 'state/app_state.dart';
import 'state/audio_service.dart';
import 'state/mathurat_state.dart';
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
  runApp(CaknaApp(
    appState: appState,
    repo: repo,
    userData: userData,
    mathuratRepo: MathuratRepo(repo),
    prefs: prefs,
  ));
}

class CaknaApp extends StatelessWidget {
  final AppState appState;
  final QuranRepo repo;
  final UserData userData;
  final MathuratRepo mathuratRepo;
  final SharedPreferences prefs;
  const CaknaApp({
    super.key,
    required this.appState,
    required this.repo,
    required this.userData,
    required this.mathuratRepo,
    required this.prefs,
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
      ],
      child: Consumer<AppState>(
        builder: (context, app, _) => MaterialApp(
          title: 'Cakna',
          debugShowCheckedModeBanner: false,
          theme: caknaLight(),
          darkTheme: caknaDark(),
          themeMode: app.themeMode,
          home: const AppShell(),
        ),
      ),
    );
  }
}
