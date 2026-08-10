import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/reciters.dart';
import '../services/tafsir_service.dart';
import '../state/app_state.dart';
import '../state/audio_service.dart';
import '../state/auth.dart';
import '../state/sync_service.dart';
import '../theme.dart';
import '../widgets/cakna_mark.dart';
import 'auth_screen.dart';
import 'donation_screen.dart';
import 'mathurat_screen.dart';
import 'prayer_times_screen.dart';
import 'progress_screen.dart';
import 'quran_settings_screen.dart';

final _reciters = [for (final r in kReciters) (r.id, r.name)];

const _langs = [('ms', 'Bahasa Melayu'), ('en', 'English'), ('id', 'Bahasa Indonesia')];

/// App version — single source (keep in sync with pubspec `version`).
const kAppVersion = '1.0.0';

/// Profile tab — matches Tilawah's layout: app identity, account prompt,
/// settings list, and info list.
class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Watch so the Qari / Terjemahan / Bahasa tile labels refresh after a
    // change (this screen lives in a const IndexedStack).
    context.watch<AppState>();
    return Scaffold(
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 32),
        children: [
          SizedBox(height: MediaQuery.of(context).padding.top + 20),
          const _AppIdentity(),
          const SizedBox(height: 20),
          const _AccountCard(),
          const SizedBox(height: 20),
          _SettingsCard(children: [
            _SettingsTile(
              icon: Icons.menu_book_outlined,
              label: 'Tetapan Quran',
              onTap: () => Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const QuranSettingsScreen())),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.translate,
              label: 'Terjemahan',
              value: _langName(context),
              onTap: () => _pickLang(context),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.record_voice_over_outlined,
              label: 'Qari',
              value: _reciterName(context),
              onTap: () => _pickReciter(context),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.auto_stories_outlined,
              label: 'Urus tafsir',
              value: tafsirEditionName(context.watch<AppState>().tafsirEdition),
              onTap: () => _pickTafsir(context),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.access_time,
              label: 'Waktu solat',
              onTap: () => Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const PrayerTimesScreen())),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.wb_twilight_outlined,
              label: "Al-Ma'thurat",
              onTap: () => Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const MathuratScreen())),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.insights_outlined,
              label: 'Kemajuan bacaan',
              onTap: () => Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const ProgressScreen())),
            ),
          ]),
          const SizedBox(height: 16),
          _SettingsCard(children: [
            _SettingsTile(
              icon: Icons.favorite_outline,
              label: 'Buat sumbangan',
              onTap: () => Navigator.push(
                  context, MaterialPageRoute(builder: (_) => const DonationScreen())),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.info_outline,
              label: 'Tentang kami',
              onTap: () => _info(context, 'Tentang Cakna',
                  'Cakna — Mushaf Digital. Membaca, mendengar dan menghayati al-Quran.'),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.description_outlined,
              label: 'Terma & polisi privasi',
              onTap: () => _info(context, 'Terma & Polisi Privasi',
                  'Data anda (penanda, nota, kemajuan bacaan, tetapan) disimpan pada '
                  'peranti ini. Jika anda log masuk, data tersebut turut disegerak dan '
                  'disimpan dengan selamat pada pelayan Cakna (cakna.qcxis.com) supaya '
                  'boleh diakses merentas peranti.\n\n'
                  'Lokasi peranti digunakan hanya untuk mengira waktu solat dan arah '
                  'kiblat (termasuk widget skrin utama), dan tidak dikongsi dengan '
                  'pihak ketiga. Audio bacaan dialirkan dari CDN Islamic Network / '
                  'EveryAyah; audio yang dimuat turun disimpan pada peranti anda '
                  'sahaja. Teks tafsir diperoleh dari API Quran.com; waktu solat '
                  'rasmi diperoleh dari JAKIM e-Solat.\n\n'
                  'Anda boleh memadam akaun dan semua data awan pada bila-bila masa '
                  'melalui "Padam akaun". Untuk sebarang pertanyaan privasi, hubungi '
                  'qcxissdnbhd@gmail.com.'),
            ),
            const _RowDivider(),
            _SettingsTile(
              icon: Icons.mail_outline,
              label: 'Hubungi kami',
              onTap: () => _info(context, 'Hubungi kami', 'qcxissdnbhd@gmail.com'),
            ),
          ]),
          const SizedBox(height: 20),
          const Center(
            child: Text('Cakna · versi $kAppVersion',
                style: TextStyle(fontSize: 12, color: CaknaColors.inkSoft)),
          ),
        ],
      ),
    );
  }

  static String _langName(BuildContext context) {
    final v = context.read<AppState>().transLang;
    return _langs.firstWhere((l) => l.$1 == v, orElse: () => _langs.first).$2;
  }

  static String _reciterName(BuildContext context) {
    final v = context.read<AppState>().reciter;
    return _reciters.firstWhere((r) => r.$1 == v, orElse: () => _reciters.first).$2;
  }

  Future<void> _pickLang(BuildContext context) async {
    final app = context.read<AppState>();
    final v = await _pickSheet(context, 'Bahasa', _langs, app.transLang);
    if (v != null) app.transLang = v;
  }

  Future<void> _pickReciter(BuildContext context) async {
    final app = context.read<AppState>();
    final v = await _pickSheet(context, 'Qari', _reciters, app.reciter);
    if (v != null && context.mounted) {
      app.reciter = v;
      await context.read<AudioService>().setReciter(v);
    }
  }

  Future<void> _pickTafsir(BuildContext context) async {
    final app = context.read<AppState>();
    final v = await _pickSheet(
      context,
      'Urus tafsir',
      [for (final (id, name) in kTafsirEditions) ('$id', name)],
      '${app.tafsirEdition}',
    );
    if (v != null && context.mounted) app.tafsirEdition = int.parse(v);
  }

  static Future<String?> _pickSheet(
      BuildContext context, String title, List<(String, String)> items, String current) {
    return showModalBottomSheet<String>(
      context: context,
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(22))),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
              child: Align(
                alignment: Alignment.centerLeft,
                child: Text(title,
                    style: const TextStyle(
                        fontFamily: 'Lora', fontSize: 18, fontWeight: FontWeight.w600)),
              ),
            ),
            for (final (id, name) in items)
              ListTile(
                title: Text(name),
                trailing: id == current
                    ? const Icon(Icons.check, color: CaknaColors.olive)
                    : null,
                onTap: () => Navigator.pop(ctx, id),
              ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  void _info(BuildContext context, String title, String body) => showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: Text(title),
          content: Text(body),
          actions: [TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Tutup'))],
        ),
      );
}

class _AppIdentity extends StatelessWidget {
  const _AppIdentity();

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          width: 80,
          height: 80,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: const LinearGradient(
              colors: [CaknaColors.olive, CaknaColors.oliveDeep],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: const Center(child: CaknaMark(size: 46, color: Colors.white)),
        ),
        const SizedBox(height: 12),
        const Text('Cakna',
            style: TextStyle(fontFamily: 'Lora', fontSize: 24, fontWeight: FontWeight.w600)),
        const SizedBox(height: 2),
        const Text('Versi $kAppVersion', style: TextStyle(fontSize: 12.5, color: CaknaColors.inkSoft)),
      ],
    );
  }
}

class _AccountCard extends StatelessWidget {
  const _AccountCard();

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<Auth>();
    final sync = context.watch<SyncService>();

    if (auth.signedIn) {
      return Container(
        decoration: BoxDecoration(
          color: CaknaColors.olive.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.25)),
        ),
        child: Column(
          children: [
            ListTile(
              leading: const Icon(Icons.cloud_done_outlined, color: CaknaColors.olive),
              title: Text(auth.email ?? 'Akaun',
                  style: const TextStyle(fontWeight: FontWeight.w600)),
              subtitle: Text(sync.syncing
                  ? 'Menyegerak…'
                  : sync.lastSynced != null
                      ? 'Disegerak ke awan'
                      : 'Log masuk'),
            ),
            const Divider(height: 1),
            ListTile(
              leading: const Icon(Icons.logout, color: CaknaColors.inkSoft),
              title: const Text('Log keluar'),
              onTap: () => context.read<Auth>().logout(),
            ),
            const Divider(height: 1),
            ListTile(
              leading: const Icon(Icons.delete_forever_outlined, color: Color(0xFFB3261E)),
              title: const Text('Padam akaun', style: TextStyle(color: Color(0xFFB3261E))),
              subtitle: const Text('Padam akaun & semua data awan secara kekal'),
              onTap: () => _confirmDelete(context),
            ),
          ],
        ),
      );
    }

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: CaknaColors.olive.withValues(alpha: 0.08),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.20)),
      ),
      child: Column(
        children: [
          const Text(
            'Urus koleksi, penanda & nota dengan akaun Cakna anda (jejak kemajuan)',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13.5, height: 1.4),
          ),
          const SizedBox(height: 14),
          FilledButton(
            style: FilledButton.styleFrom(
              backgroundColor: CaknaColors.olive,
              minimumSize: const Size.fromHeight(48),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: () => Navigator.push(
                context, MaterialPageRoute(builder: (_) => const AuthScreen())),
            child: const Text('Cipta akaun',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () => Navigator.push(
                context, MaterialPageRoute(builder: (_) => const AuthScreen())),
            style: TextButton.styleFrom(foregroundColor: CaknaColors.oliveDeep),
            child: const Text('Sudah ada akaun? Log masuk di sini'),
          ),
        ],
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context) async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Padam akaun?'),
        content: const Text(
            'Akaun anda dan semua data yang disegerak (penanda, nota, kemajuan) '
            'akan dipadam secara kekal. Tindakan ini tidak boleh dibatalkan.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Batal')),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: const Color(0xFFB3261E)),
            onPressed: () => Navigator.pop(ctx, true),
            child: const Text('Padam kekal'),
          ),
        ],
      ),
    );
    if (ok != true || !context.mounted) return;
    try {
      await context.read<Auth>().deleteAccount();
      if (context.mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Akaun telah dipadam.')));
      }
    } catch (_) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Gagal memadam akaun. Cuba lagi.')));
      }
    }
  }
}

class _SettingsCard extends StatelessWidget {
  final List<Widget> children;
  const _SettingsCard({required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: Column(children: children),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? value;
  final VoidCallback onTap;
  const _SettingsTile(
      {required this.icon, required this.label, this.value, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
        child: Row(
          children: [
            Icon(icon, size: 21, color: CaknaColors.olive),
            const SizedBox(width: 14),
            Expanded(child: Text(label, style: const TextStyle(fontSize: 14.5))),
            if (value != null)
              Padding(
                padding: const EdgeInsets.only(right: 6),
                child: Text(value!,
                    style: const TextStyle(fontSize: 12.5, color: CaknaColors.inkSoft)),
              ),
            const Icon(Icons.chevron_right, size: 20, color: CaknaColors.inkSoft),
          ],
        ),
      ),
    );
  }
}

class _RowDivider extends StatelessWidget {
  const _RowDivider();
  @override
  Widget build(BuildContext context) => const Divider(height: 1, indent: 51);
}
