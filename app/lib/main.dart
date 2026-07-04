import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'data/db.dart';
import 'data/quran_repo.dart';
import 'data/user_db.dart';
import 'screens/app_shell.dart';
import 'state/app_state.dart';
import 'state/audio_service.dart';
import 'state/user_data.dart';
import 'theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final appState = await AppState.load();
  final db = CaknaDb();
  final userData = UserData(UserDb());
  await userData.ensureLoaded();
  runApp(CaknaApp(appState: appState, repo: QuranRepo(db), userData: userData));
}

class CaknaApp extends StatelessWidget {
  final AppState appState;
  final QuranRepo repo;
  final UserData userData;
  const CaknaApp(
      {super.key, required this.appState, required this.repo, required this.userData});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: appState),
        Provider<QuranRepo>.value(value: repo),
        ChangeNotifierProvider(create: (_) => AudioService()),
        ChangeNotifierProvider.value(value: userData),
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
