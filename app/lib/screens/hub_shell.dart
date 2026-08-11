import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/auth.dart';
import '../state/hub_application_state.dart';
import '../state/hub_content.dart';
import '../widgets/hub_bottom_nav.dart';
import 'hub_about_screen.dart';
import 'hub_csr_screen.dart';
import 'hub_form_screen.dart';
import 'hub_home_screen.dart';
import 'hub_setem_screen.dart';

class HubShell extends StatefulWidget {
  const HubShell({super.key});

  @override
  State<HubShell> createState() => _HubShellState();
}

class _HubShellState extends State<HubShell> {
  int _index = 0;
  late final HubContent _hub;
  final _appState = HubApplicationState();

  @override
  void initState() {
    super.initState();
    _hub = HubContent();
    _appState.load();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final api = context.read<Auth>().api;
    _hub.load(api);
    _appState.loadFromServer(api);
  }

  @override
  void dispose() {
    _appState.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    const pages = [
      HubHomeScreen(),
      HubAboutScreen(),
      HubFormScreen(),
      HubSetemScreen(),
      HubCsrScreen(),
    ];
    return MultiProvider(
      providers: [
        ChangeNotifierProvider<HubContent>.value(value: _hub),
        ChangeNotifierProvider<HubApplicationState>.value(value: _appState),
      ],
      child: Scaffold(
        backgroundColor: const Color(0xFFF7F6F2),
        body: IndexedStack(index: _index, children: pages),
        bottomNavigationBar: HubBottomNav(
          index: _index,
          onSelected: (i) => setState(() => _index = i),
        ),
      ),
    );
  }
}
