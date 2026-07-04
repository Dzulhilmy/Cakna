import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import '../state/audio_service.dart';
import '../theme.dart';
import '../widgets/khatam_card.dart';
import 'reader_screen.dart';

const _reciters = [
  ('ar.alafasy', 'Mishary Alafasy'),
  ('ar.abdulbasitmurattal', 'Abdul Basit (Murattal)'),
  ('ar.husary', 'Al-Husary'),
  ('ar.abdurrahmaansudais', 'Abdurrahman As-Sudais'),
  ('ar.saoodshuraym', 'Saood Ash-Shuraym'),
];

const _langs = [('ms', 'Bahasa Melayu'), ('en', 'English'), ('id', 'Bahasa Indonesia')];

/// The "Profil" tab. Local-only (Option A): identity is a guest, everything
/// shown is on-device settings + reading progress. Sign-in/sync is a future
/// (backend) decision, surfaced as a disabled "coming soon" row.
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final app = context.watch<AppState>();
    return Scaffold(
      body: ListView(
        padding: EdgeInsets.zero,
        children: [
          const _Banner(),
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _ContinueCard(page: app.lastPage),
                const SizedBox(height: 14),
                const KhatamCard(),
                const SizedBox(height: 20),
                const _SectionTitle('Tetapan'),
                Card(
                  child: Column(
                    children: [
                      _SettingRow(
                        icon: Icons.brightness_6_outlined,
                        label: 'Tema',
                        trailing: SegmentedButton<ThemeMode>(
                          style: const ButtonStyle(visualDensity: VisualDensity.compact),
                          segments: const [
                            ButtonSegment(value: ThemeMode.light, icon: Icon(Icons.light_mode, size: 18)),
                            ButtonSegment(value: ThemeMode.system, icon: Icon(Icons.brightness_auto, size: 18)),
                            ButtonSegment(value: ThemeMode.dark, icon: Icon(Icons.dark_mode, size: 18)),
                          ],
                          selected: {app.themeMode},
                          showSelectedIcon: false,
                          onSelectionChanged: (s) => app.themeMode = s.first,
                        ),
                      ),
                      const Divider(height: 1),
                      _SettingRow(
                        icon: Icons.translate,
                        label: 'Terjemahan',
                        trailing: _Dropdown(
                          value: app.transLang,
                          items: _langs,
                          onChanged: (v) => app.transLang = v,
                        ),
                      ),
                      const Divider(height: 1),
                      _SettingRow(
                        icon: Icons.record_voice_over_outlined,
                        label: 'Qari',
                        trailing: _Dropdown(
                          value: app.reciter,
                          items: _reciters,
                          onChanged: (v) {
                            app.reciter = v;
                            context.read<AudioService>().reciter = v;
                          },
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
                const _SectionTitle('Akaun'),
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.cloud_sync_outlined, color: CaknaColors.teal),
                    title: const Text('Log masuk untuk segerak'),
                    subtitle: const Text('Akan datang — simpan penanda & nota merentas peranti'),
                    trailing: const Icon(Icons.chevron_right, color: CaknaColors.inkSoft),
                    onTap: () => ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Segerak akaun akan datang.')),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                const _SectionTitle('Mengenai'),
                const Card(
                  child: Padding(
                    padding: EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Cakna',
                            style: TextStyle(
                                fontFamily: 'Lora',
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                                color: CaknaColors.tealDeep)),
                        SizedBox(height: 2),
                        Text('Mushaf Digital · versi 1.0.0',
                            style: TextStyle(fontSize: 12, color: CaknaColors.inkSoft)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _Banner extends StatelessWidget {
  const _Banner();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      decoration: const BoxDecoration(
        image: DecorationImage(image: AssetImage('assets/images/bg_profile.png'), fit: BoxFit.cover),
      ),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [CaknaColors.teal.withValues(alpha: 0.85), CaknaColors.tealBright.withValues(alpha: 0.6)],
            begin: Alignment.bottomLeft,
            end: Alignment.topRight,
          ),
        ),
        padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const CircleAvatar(
              radius: 34,
              backgroundColor: Colors.white24,
              child: Icon(Icons.person, size: 38, color: Colors.white),
            ),
            const SizedBox(height: 10),
            const Text('Tetamu',
                style: TextStyle(
                    color: Colors.white, fontSize: 22, fontFamily: 'Lora', fontWeight: FontWeight.w600)),
            const Text('Data disimpan pada peranti ini',
                style: TextStyle(color: Colors.white70, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}

class _ContinueCard extends StatelessWidget {
  final int page;
  const _ContinueCard({required this.page});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () => Navigator.push(
          context, MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: page))),
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(18),
          gradient: const LinearGradient(
              colors: [CaknaColors.teal, CaknaColors.tealBright],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight),
        ),
        child: Row(
          children: [
            const Icon(Icons.menu_book, color: Colors.white, size: 28),
            const SizedBox(width: 14),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Sambung bacaan', style: TextStyle(color: Colors.white70, fontSize: 12)),
                Text('Halaman $page',
                    style: const TextStyle(
                        color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700)),
              ],
            ),
            const Spacer(),
            const Icon(Icons.arrow_forward_ios, color: Colors.white70, size: 15),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  final String text;
  const _SectionTitle(this.text);

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.only(bottom: 8, left: 4),
        child: Text(text.toUpperCase(),
            style: const TextStyle(
                fontSize: 11, fontWeight: FontWeight.w700, letterSpacing: 0.6, color: CaknaColors.inkSoft)),
      );
}

class _SettingRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final Widget trailing;
  const _SettingRow({required this.icon, required this.label, required this.trailing});

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        child: Row(
          children: [
            Icon(icon, size: 20, color: CaknaColors.teal),
            const SizedBox(width: 12),
            Text(label, style: const TextStyle(fontSize: 14)),
            const Spacer(),
            trailing,
          ],
        ),
      );
}

class _Dropdown extends StatelessWidget {
  final String value;
  final List<(String, String)> items;
  final ValueChanged<String> onChanged;
  const _Dropdown({required this.value, required this.items, required this.onChanged});

  @override
  Widget build(BuildContext context) {
    return DropdownButton<String>(
      value: value,
      underline: const SizedBox.shrink(),
      borderRadius: BorderRadius.circular(12),
      style: const TextStyle(fontSize: 13, color: CaknaColors.tealDeep, fontWeight: FontWeight.w600),
      items: [
        for (final (id, name) in items) DropdownMenuItem(value: id, child: Text(name)),
      ],
      onChanged: (v) => v == null ? null : onChanged(v),
    );
  }
}
