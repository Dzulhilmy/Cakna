import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import '../theme.dart';
import '../widgets/cakna_mark.dart';

class _Slide {
  final Widget art;
  final String title;
  final String body;
  const _Slide(this.art, this.title, this.body);
}

/// First-run intro. Finishing (or skipping) sets AppState.onboarded, which
/// swaps the root over to the app shell.
class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final _controller = PageController();
  int _page = 0;

  static const _slides = <_Slide>[
    _Slide(CaknaMark(size: 96, color: CaknaColors.oliveDeep), 'Selamat datang ke Cakna',
        'Cakna bermaksud hadir, peka dan sedia membantu. Aplikasi rasmi komuniti HOME — menghubungkan ibadah harian, program komuniti dan Al-Quran dalam satu genggaman.'),
    _Slide(Icon(Icons.menu_book, size: 84, color: CaknaColors.olive), 'Baca, dengar, hafaz',
        'Ketuk ayat untuk audio dan terjemahan, lihat perkataan demi perkataan, dan tandakan penanda serta nota anda.'),
    _Slide(Icon(Icons.mosque_outlined, size: 84, color: CaknaColors.olive), 'Teman ibadah harian',
        "Waktu solat, arah kiblat, Al-Ma'thurat dan penjejak khatam — semuanya dalam satu aplikasi."),
  ];

  void _finish() => context.read<AppState>().onboarded = true;

  void _next() {
    if (_page < _slides.length - 1) {
      _controller.nextPage(duration: const Duration(milliseconds: 300), curve: Curves.easeOut);
    } else {
      _finish();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final last = _page == _slides.length - 1;
    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            Align(
              alignment: Alignment.centerRight,
              child: TextButton(
                onPressed: _finish,
                style: TextButton.styleFrom(foregroundColor: CaknaColors.inkSoft),
                child: const Text('Langkau'),
              ),
            ),
            Expanded(
              child: PageView.builder(
                controller: _controller,
                itemCount: _slides.length,
                onPageChanged: (i) => setState(() => _page = i),
                itemBuilder: (context, i) {
                  final s = _slides[i];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 32),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        s.art,
                        const SizedBox(height: 40),
                        Text(s.title,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontFamily: 'Lora',
                                fontSize: 26,
                                fontWeight: FontWeight.w600,
                                color: CaknaColors.oliveDeep)),
                        const SizedBox(height: 14),
                        Text(s.body,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                                fontSize: 15, height: 1.6, color: CaknaColors.inkSoft)),
                      ],
                    ),
                  );
                },
              ),
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                for (var i = 0; i < _slides.length; i++)
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: i == _page ? 22 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: i == _page ? CaknaColors.olive : CaknaColors.border,
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
              ],
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(32, 24, 32, 24),
              child: FilledButton(
                style: FilledButton.styleFrom(
                    backgroundColor: CaknaColors.olive,
                    minimumSize: const Size.fromHeight(52),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                onPressed: _next,
                child: Text(last ? 'Mula membaca' : 'Seterusnya',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
