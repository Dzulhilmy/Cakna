import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../theme.dart';

enum _Tab { hijaiyah, harakat, latihan }

class MengajiScreen extends StatefulWidget {
  const MengajiScreen({super.key});
  @override
  State<MengajiScreen> createState() => _MengajiScreenState();
}

class _MengajiScreenState extends State<MengajiScreen> {
  Map<String, dynamic>? _data;
  _Tab _tab = _Tab.hijaiyah;

  // quiz state
  int _quizIdx = 0;
  int? _chosen;
  int _score = 0;
  bool _quizDone = false;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final raw = await rootBundle.loadString('assets/data/mengaji.json');
    setState(() => _data = jsonDecode(raw) as Map<String, dynamic>);
  }

  void _pick(int idx) {
    if (_chosen != null) return; // already answered
    final hija = _data!['hija'] as List<dynamic>;
    final correct = idx == _quizIdx % hija.length;
    setState(() {
      _chosen = idx;
      if (correct) _score++;
    });
  }

  void _nextQuestion() {
    final hija = _data!['hija'] as List<dynamic>;
    if (_quizIdx + 1 >= hija.length) {
      setState(() => _quizDone = true);
    } else {
      setState(() {
        _quizIdx++;
        _chosen = null;
      });
    }
  }

  void _restartQuiz() {
    setState(() {
      _quizIdx = 0;
      _chosen = null;
      _score = 0;
      _quizDone = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    return Scaffold(
      appBar: AppBar(title: const Text('Asas Mengaji')),
      body: _data == null
          ? const Center(child: CircularProgressIndicator(strokeWidth: 2))
          : Column(
              children: [
                _TabBar(current: _tab, onChanged: (t) => setState(() => _tab = t), dark: dark),
                Expanded(
                  child: switch (_tab) {
                    _Tab.hijaiyah => _HijaiyahGrid(data: _data!, dark: dark),
                    _Tab.harakat => _HarakatList(data: _data!, dark: dark),
                    _Tab.latihan => _quizDone
                        ? _QuizResult(score: _score, total: (_data!['hija'] as List).length, onRestart: _restartQuiz)
                        : _QuizView(
                            data: _data!,
                            quizIdx: _quizIdx,
                            chosen: _chosen,
                            onPick: _pick,
                            onNext: _nextQuestion,
                            dark: dark,
                          ),
                  },
                ),
              ],
            ),
    );
  }
}

class _TabBar extends StatelessWidget {
  final _Tab current;
  final ValueChanged<_Tab> onChanged;
  final bool dark;
  const _TabBar({required this.current, required this.onChanged, required this.dark});

  @override
  Widget build(BuildContext context) {
    const tabs = [(_Tab.hijaiyah, 'Hijaiyah'), (_Tab.harakat, 'Baris'), (_Tab.latihan, 'Latihan')];
    return Container(
      color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
      child: Row(
        children: [
          for (final (tab, label) in tabs)
            Expanded(
              child: GestureDetector(
                onTap: () => onChanged(tab),
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 12),
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        color: current == tab ? CaknaColors.olive : Colors.transparent,
                        width: 2,
                      ),
                    ),
                  ),
                  child: Text(
                    label,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 13,
                      color: current == tab
                          ? CaknaColors.olive
                          : (dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft),
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class _HijaiyahGrid extends StatelessWidget {
  final Map<String, dynamic> data;
  final bool dark;
  const _HijaiyahGrid({required this.data, required this.dark});

  @override
  Widget build(BuildContext context) {
    final hija = data['hija'] as List<dynamic>;
    return GridView.builder(
      padding: const EdgeInsets.all(16),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 4,
        crossAxisSpacing: 10,
        mainAxisSpacing: 10,
        childAspectRatio: 0.9,
      ),
      itemCount: hija.length,
      itemBuilder: (_, i) {
        final letter = hija[i][0] as String;
        final name = hija[i][1] as String;
        return Container(
          decoration: BoxDecoration(
            color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: dark ? CaknaColors.borderDark : CaknaColors.border),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                letter,
                style: const TextStyle(
                    fontFamily: 'Uthmani', fontSize: 28, color: CaknaColors.olive),
              ),
              const SizedBox(height: 4),
              Text(
                name,
                style: TextStyle(
                    fontSize: 11,
                    color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _HarakatList extends StatelessWidget {
  final Map<String, dynamic> data;
  final bool dark;
  const _HarakatList({required this.data, required this.dark});

  @override
  Widget build(BuildContext context) {
    final harakat = data['harakat'] as List<dynamic>;
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: harakat.length,
      separatorBuilder: (_, _) => const SizedBox(height: 10),
      itemBuilder: (_, i) {
        final h = harakat[i];
        final mark = h[0] as String;
        final name = h[1] as String;
        final descMs = h[2] as String;
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: dark ? CaknaColors.surfaceDark : CaknaColors.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: dark ? CaknaColors.borderDark : CaknaColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: CaknaColors.olive.withValues(alpha: 0.1),
                ),
                child: Center(
                  child: Text(
                    'بَ'.replaceFirst('َ', mark),
                    style: const TextStyle(
                        fontFamily: 'Uthmani', fontSize: 28, color: CaknaColors.olive),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name,
                        style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15)),
                    const SizedBox(height: 2),
                    Text(descMs,
                        style: TextStyle(
                            fontSize: 13,
                            color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft)),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _QuizView extends StatelessWidget {
  final Map<String, dynamic> data;
  final int quizIdx;
  final int? chosen;
  final ValueChanged<int> onPick;
  final VoidCallback onNext;
  final bool dark;
  const _QuizView({
    required this.data,
    required this.quizIdx,
    required this.chosen,
    required this.onPick,
    required this.onNext,
    required this.dark,
  });

  @override
  Widget build(BuildContext context) {
    final hija = data['hija'] as List<dynamic>;
    final correct = quizIdx % hija.length;
    final letter = hija[correct][0] as String;

    // 3 wrong + 1 correct, shuffled by offset
    final options = <int>[];
    options.add(correct);
    var off = 1;
    while (options.length < 4) {
      final idx = (correct + off) % hija.length;
      options.add(idx);
      off++;
    }
    options.sort((a, b) => (a * 7 + quizIdx) % 11 - (b * 7 + quizIdx) % 11);

    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Text(
            'Huruf ${quizIdx + 1} / ${hija.length}',
            style: TextStyle(
                fontSize: 13, color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft),
          ),
          const SizedBox(height: 24),
          Container(
            width: 140,
            height: 140,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: CaknaColors.olive.withValues(alpha: 0.1),
              border: Border.all(color: CaknaColors.olive.withValues(alpha: 0.3), width: 2),
            ),
            child: Center(
              child: Text(
                letter,
                style: const TextStyle(
                    fontFamily: 'Uthmani', fontSize: 60, color: CaknaColors.olive),
              ),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Apakah nama huruf ini?',
            style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: dark ? CaknaColors.inkDark : CaknaColors.ink),
          ),
          const SizedBox(height: 24),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 3,
            physics: const NeverScrollableScrollPhysics(),
            children: [
              for (final opt in options)
                _OptionButton(
                  label: hija[opt][1] as String,
                  isCorrect: opt == correct,
                  chosen: chosen != null && options[options.indexOf(opt)] == chosen,
                  answered: chosen != null,
                  correctIdx: correct,
                  optIdx: opt,
                  onTap: () => onPick(options.indexOf(opt)),
                  dark: dark,
                ),
            ],
          ),
          const Spacer(),
          if (chosen != null)
            FilledButton(
              onPressed: onNext,
              style: FilledButton.styleFrom(
                backgroundColor: CaknaColors.olive,
                minimumSize: const Size(double.infinity, 48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              ),
              child: Text(quizIdx + 1 < hija.length ? 'Seterusnya →' : 'Selesai'),
            ),
        ],
      ),
    );
  }
}

class _OptionButton extends StatelessWidget {
  final String label;
  final bool isCorrect;
  final bool chosen;
  final bool answered;
  final int correctIdx;
  final int optIdx;
  final VoidCallback onTap;
  final bool dark;
  const _OptionButton({
    required this.label,
    required this.isCorrect,
    required this.chosen,
    required this.answered,
    required this.correctIdx,
    required this.optIdx,
    required this.onTap,
    required this.dark,
  });

  @override
  Widget build(BuildContext context) {
    Color bg = dark ? CaknaColors.surfaceDark : CaknaColors.surface;
    Color border = dark ? CaknaColors.borderDark : CaknaColors.border;
    Color text = dark ? CaknaColors.inkDark : CaknaColors.ink;

    if (answered) {
      if (isCorrect) {
        bg = Colors.green.shade100;
        border = Colors.green.shade400;
        text = Colors.green.shade800;
      } else if (chosen) {
        bg = Colors.red.shade50;
        border = Colors.red.shade300;
        text = Colors.red.shade700;
      }
    }

    return GestureDetector(
      onTap: answered ? null : onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: border),
        ),
        child: Center(
          child: Text(label,
              style: TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: text)),
        ),
      ),
    );
  }
}

class _QuizResult extends StatelessWidget {
  final int score;
  final int total;
  final VoidCallback onRestart;
  const _QuizResult({required this.score, required this.total, required this.onRestart});

  @override
  Widget build(BuildContext context) {
    final pct = (score / total * 100).round();
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚',
              style: const TextStyle(fontSize: 60),
            ),
            const SizedBox(height: 16),
            Text(
              '$score / $total betul',
              style: const TextStyle(
                  fontFamily: 'Lora', fontSize: 28, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(
              pct >= 80
                  ? 'Tahniah! Anda menguasai hijaiyah!'
                  : pct >= 50
                      ? 'Bagus! Teruskan berlatih.'
                      : 'Jangan putus asa — ulang semula.',
              textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 15, color: CaknaColors.inkSoft),
            ),
            const SizedBox(height: 32),
            FilledButton(
              onPressed: onRestart,
              style: FilledButton.styleFrom(
                backgroundColor: CaknaColors.olive,
                minimumSize: const Size(200, 48),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              ),
              child: const Text('Cuba lagi'),
            ),
          ],
        ),
      ),
    );
  }
}
