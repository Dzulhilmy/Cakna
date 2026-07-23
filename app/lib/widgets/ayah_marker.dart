import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import '../theme.dart';

const _arabicIndic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
String _arabicNum(int n) =>
    n.toString().split('').map((d) => _arabicIndic[int.parse(d)]).join();

/// Authentic Quran ayah-end ornament (Tilawah's `ic_verse_number.svg`) with the
/// ayah number centred inside — used by the mushaf, translation mode and
/// Al-Ma'thurat so every ayah-end marker looks the same.
class AyahEndMarker extends StatelessWidget {
  final int number;
  final double size;
  final Color? color;
  const AyahEndMarker({super.key, required this.number, this.size = 30, this.color});

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    final c = color ?? (dark ? const Color(0xFFDACB8E) : CaknaColors.oliveDeep);
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          SvgPicture.asset(
            'assets/images/ic_verse_number.svg',
            width: size,
            height: size,
            colorFilter: ColorFilter.mode(c, BlendMode.srcIn),
          ),
          Text(
            _arabicNum(number),
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Uthmani',
              fontSize: size * 0.34,
              height: 1.0,
              color: c,
            ),
          ),
        ],
      ),
    );
  }
}
