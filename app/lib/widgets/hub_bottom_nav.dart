import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

const _kHomeSvg =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>';
const _kAboutSvg =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';
const _kFormSvg =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>';
const _kSetemSvg =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm-9 9.15V18l9 4.95 9-4.95v-5.85L12 17 3 12.15z"/></svg>';
const _kCsrSvg =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>';

const _kRose = Color(0xFFD94F6A);
const _kIdle = Color(0xFF9CA3AF);

class HubBottomNav extends StatelessWidget {
  final int index;
  final ValueChanged<int> onSelected;
  const HubBottomNav({super.key, required this.index, required this.onSelected});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Color(0xFFFFFFFF),
        border: Border(top: BorderSide(color: Color(0xFFE4E4E7))),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: 62,
          child: Row(
            children: [
              _Tab(svg: _kHomeSvg, label: 'Home', sel: index == 0, onTap: () => onSelected(0)),
              _Tab(svg: _kAboutSvg, label: 'Tentang', sel: index == 1, onTap: () => onSelected(1)),
              _FormTab(sel: index == 2, onTap: () => onSelected(2)),
              _Tab(svg: _kSetemSvg, label: 'SETEM', sel: index == 3, onTap: () => onSelected(3)),
              _Tab(svg: _kCsrSvg, label: 'Berita', sel: index == 4, onTap: () => onSelected(4)),
            ],
          ),
        ),
      ),
    );
  }
}

class _Tab extends StatelessWidget {
  final String svg, label;
  final bool sel;
  final VoidCallback onTap;
  const _Tab({required this.svg, required this.label, required this.sel, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final c = sel ? _kRose : _kIdle;
    return Expanded(
      child: InkResponse(
        onTap: onTap,
        radius: 42,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.string(svg,
                width: 22, height: 22, colorFilter: ColorFilter.mode(c, BlendMode.srcIn)),
            const SizedBox(height: 3),
            Text(label,
                style: TextStyle(
                    fontSize: 10.5,
                    height: 1,
                    fontWeight: sel ? FontWeight.w600 : FontWeight.w500,
                    color: c)),
          ],
        ),
      ),
    );
  }
}

class _FormTab extends StatelessWidget {
  final bool sel;
  final VoidCallback onTap;
  const _FormTab({required this.sel, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: InkResponse(
        onTap: onTap,
        radius: 42,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: sel ? _kRose : _kIdle,
                boxShadow: sel
                    ? [
                        BoxShadow(
                            color: _kRose.withValues(alpha: 0.35),
                            blurRadius: 10,
                            offset: const Offset(0, 4))
                      ]
                    : null,
              ),
              child: Center(
                child: SvgPicture.string(_kFormSvg,
                    width: 22,
                    height: 22,
                    colorFilter: const ColorFilter.mode(Colors.white, BlendMode.srcIn)),
              ),
            ),
            const SizedBox(height: 2),
            Text('Borang',
                style: TextStyle(
                    fontSize: 10.5,
                    height: 1,
                    fontWeight: sel ? FontWeight.w600 : FontWeight.w500,
                    color: sel ? _kRose : _kIdle)),
          ],
        ),
      ),
    );
  }
}
