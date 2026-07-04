import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../state/app_state.dart';
import '../theme.dart';
import 'reader_screen.dart';

/// Full-text search over the mushaf. Arabic queries are diacritic-insensitive;
/// other queries match the selected translation language.
class SearchScreen extends StatefulWidget {
  final String? initialQuery; // dev/verification seed
  const SearchScreen({super.key, this.initialQuery});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final _controller = TextEditingController();
  Timer? _debounce;
  List<Verse> _results = [];
  bool _searching = false;
  String _query = '';

  @override
  void initState() {
    super.initState();
    if (widget.initialQuery != null && widget.initialQuery!.isNotEmpty) {
      _controller.text = widget.initialQuery!;
      WidgetsBinding.instance.addPostFrameCallback((_) => _run(widget.initialQuery!));
    }
  }

  @override
  void dispose() {
    _debounce?.cancel();
    _controller.dispose();
    super.dispose();
  }

  void _onChanged(String value) {
    _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 300), () => _run(value));
  }

  Future<void> _run(String value) async {
    final q = value.trim();
    setState(() => _query = q);
    if (q.length < 2) {
      setState(() => _results = []);
      return;
    }
    setState(() => _searching = true);
    final lang = context.read<AppState>().transLang;
    final res = await context.read<QuranRepo>().search(q, lang: lang);
    if (!mounted) return;
    setState(() {
      _results = res;
      _searching = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final isArabic = RegExp(r'[؀-ۿ]').hasMatch(_query);
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: TextField(
          controller: _controller,
          autofocus: true,
          onChanged: _onChanged,
          textInputAction: TextInputAction.search,
          decoration: const InputDecoration(
            hintText: 'Cari ayat, terjemahan…',
            border: InputBorder.none,
          ),
        ),
        actions: [
          if (_query.isNotEmpty)
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: () {
                _controller.clear();
                _run('');
              },
            ),
        ],
      ),
      body: _body(isArabic),
    );
  }

  Widget _body(bool isArabic) {
    if (_searching) {
      return const Center(child: CircularProgressIndicator(strokeWidth: 2));
    }
    if (_query.length < 2) {
      return const _Hint();
    }
    if (_results.isEmpty) {
      return const Center(
        child: Text('Tiada padanan ditemui.', style: TextStyle(color: CaknaColors.inkSoft)),
      );
    }
    final lang = context.read<AppState>().transLang;
    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 4),
          child: Align(
            alignment: Alignment.centerLeft,
            child: Text('${_results.length} padanan${_results.length >= 60 ? "+" : ""}',
                style: const TextStyle(fontSize: 12, color: CaknaColors.inkSoft)),
          ),
        ),
        Expanded(
          child: ListView.separated(
            itemCount: _results.length,
            separatorBuilder: (_, _) => const Divider(height: 1, indent: 16),
            itemBuilder: (context, i) => _ResultTile(verse: _results[i], arabic: isArabic, lang: lang),
          ),
        ),
      ],
    );
  }
}

class _ResultTile extends StatelessWidget {
  final Verse verse;
  final bool arabic;
  final String lang;
  const _ResultTile({required this.verse, required this.arabic, required this.lang});

  @override
  Widget build(BuildContext context) {
    final repo = context.read<QuranRepo>();
    final snippet = arabic
        ? verse.textUthmani
        : switch (lang) {
            'en' => verse.translationEn,
            'id' => verse.translationId,
            _ => verse.translationMs,
          };
    return FutureBuilder<Surah>(
      future: repo.surah(verse.surahId),
      builder: (context, snap) {
        final name = snap.data?.nameTrans ?? '';
        return ListTile(
          title: Text(
            snippet,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            textAlign: arabic ? TextAlign.right : TextAlign.left,
            textDirection: arabic ? TextDirection.rtl : TextDirection.ltr,
            style: arabic ? const TextStyle(fontFamily: 'Uthmani', fontSize: 18) : null,
          ),
          subtitle: Padding(
            padding: const EdgeInsets.only(top: 4),
            child: Text('$name · ${verse.surahId}:${verse.verseNumber} · Hal. ${verse.page}',
                style: const TextStyle(fontSize: 12, color: CaknaColors.tealDeep)),
          ),
          onTap: () => Navigator.push(context,
              MaterialPageRoute(builder: (_) => ReaderScreen(initialPage: verse.page))),
        );
      },
    );
  }
}

class _Hint extends StatelessWidget {
  const _Hint();

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.search, size: 48, color: CaknaColors.teal.withValues(alpha: 0.35)),
          const SizedBox(height: 12),
          const Text('Taip perkataan Arab atau terjemahan\nuntuk mencari ayat.',
              textAlign: TextAlign.center, style: TextStyle(color: CaknaColors.inkSoft)),
        ],
      ),
    );
  }
}
