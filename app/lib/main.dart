import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'data/db.dart';
import 'data/quran_repo.dart';
import 'screens/app_shell.dart';
import 'state/app_state.dart';
import 'state/audio_service.dart';
import 'theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final appState = await AppState.load();
  final db = CaknaDb();
  runApp(CaknaApp(appState: appState, repo: QuranRepo(db)));
}

class CaknaApp extends StatelessWidget {
  final AppState appState;
  final QuranRepo repo;
  const CaknaApp({super.key, required this.appState, required this.repo});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: appState),
        Provider<QuranRepo>.value(value: repo),
        ChangeNotifierProvider(create: (_) => AudioService()),
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
