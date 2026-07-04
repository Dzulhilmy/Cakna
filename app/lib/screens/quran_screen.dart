import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../theme.dart';
import 'reader_screen.dart';
import 'search_screen.dart';

/// Quran tab: Surah / Juz list. Tapping opens the mushaf reader at that page.
class QuranScreen extends StatefulWidget {
  const QuranScreen({super.key});

  @override
  State<QuranScreen> createState() => _QuranScreenState();
}

class _QuranScreenState extends State<QuranScreen> with SingleTickerProviderStateMixin {
  late final TabController _tabs = TabController(length: 2, vsync: this);

  @override
  Widget build(BuildContext context) {
    final repo = context.read<QuranRepo>();
    return Scaffold(
      appBar: AppBar(
        title: const Text('Al-Quran'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () => Navigator.push(
                context, MaterialPageRoute(builder: (_) => const SearchScreen())),
          ),
        ],
        bottom: TabBar(
          controller: _tabs,
          labelColor: CaknaColors.teal,
          indicatorColor: CaknaColors.teal,
          tabs: const [Tab(text: 'Surah'), Tab(text: 'Juzuk')],
        ),
      ),
      body: FutureBuilder<List<Surah>>(
        future: repo.surahs(),
        builder: (context, snap) {
          if (!snap.hasData) {
            return const Center(child: CircularProgressIndicator(strokeWidth: 2));
          }
          final surahs = snap.data!;
          return TabBarView(
            controller: _tabs,
            children: [
              _SurahList(surahs: surahs, repo: repo),
              _JuzList(repo: repo),
            ],
          );
        },
      ),
    );
  }
}

class _SurahList extends StatelessWidget {
  final List<Surah> surahs;
  final QuranRepo repo;
  const _SurahList({required this.surahs, required this.repo});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: surahs.length,
      separatorBuilder: (context, _) => const Divider(height: 1, indent: 68),
      itemBuilder: (context, i) {
        final s = surahs[i];
        return ListTile(
          leading: _NumberMedallion(n: s.id),
          title: Text(s.nameTrans,
              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
          subtitle: Text('${s.isMakki ? "Makkiyah" : "Madaniyah"} · ${s.verseCount} ayat',
              style: const TextStyle(fontSize: 12)),
          trailing: _SurahNameGlyph(id: s.id, fallback: s.name),
          onTap: () async {
            final verses = await repo.versesForSurah(s.id);
            if (!context.mounted) return;
            Navigator.push(
              context,
              MaterialPageRoute(
                  builder: (_) => ReaderScreen(initialPage: verses.first.page)),
            );
          },
        );
      },
    );
  }
}

class _JuzList extends StatelessWidget {
  final QuranRepo repo;
  const _JuzList({required this.repo});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      itemCount: 30,
      separatorBuilder: (context, _) => const Divider(height: 1, indent: 68),
      itemBuilder: (context, i) {
        final juz = i + 1;
        return ListTile(
          leading: _NumberMedallion(n: juz),
          title: Text('Juzuk $juz', style: const TextStyle(fontWeight: FontWeight.w600)),
          onTap: () async {
            final page = await repo.firstPageOfJuz(juz);
            if (!context.mounted) return;
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: page)),
            );
          },
        );
      },
    );
  }
}

/// The surah name rendered from its bundled calligraphic SVG (tinted to the
/// theme), falling back to Uthmani text if the asset is missing.
class _SurahNameGlyph extends StatelessWidget {
  final int id;
  final String fallback;
  const _SurahNameGlyph({required this.id, required this.fallback});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final color = dark ? CaknaColors.tealBright : CaknaColors.tealDeep;
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 130),
      child: SvgPicture.asset(
        'assets/images/sname_$id.svg',
        height: 26,
        fit: BoxFit.contain,
        alignment: Alignment.centerRight,
        colorFilter: ColorFilter.mode(color, BlendMode.srcIn),
        placeholderBuilder: (_) => Text(fallback,
            style: TextStyle(fontFamily: 'Uthmani', fontSize: 20, color: color)),
      ),
    );
  }
}

class _NumberMedallion extends StatelessWidget {
  final int n;
  const _NumberMedallion({required this.n});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 40,
      height: 40,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: CaknaColors.teal.withValues(alpha: 0.10),
        border: Border.all(color: CaknaColors.teal.withValues(alpha: 0.3)),
      ),
      child: Text('$n',
          style: const TextStyle(
              fontWeight: FontWeight.w700, color: CaknaColors.tealDeep, fontSize: 13)),
    );
  }
}
