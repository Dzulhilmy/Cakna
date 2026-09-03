import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme.dart';

class DhikrScreen extends StatefulWidget {
  const DhikrScreen({super.key});
  @override
  State<DhikrScreen> createState() => _DhikrScreenState();
}

class _DhikrScreenState extends State<DhikrScreen> {
  List<dynamic>? _items;
  // count per item index
  late List<int> _counts;
  int _active = 0; // which dhikr is selected

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final raw = await rootBundle.loadString('assets/data/dhikr.json');
    final list = jsonDecode(raw) as List<dynamic>;
    setState(() {
      _items = list;
      _counts = List.filled(list.length, 0);
    });
  }

  void _tap() {
    if (_items == null) return;
    final target = _items![_active]['target_count'] as int;
    if (_counts[_active] < target) {
      HapticFeedback.selectionClick();
      setState(() => _counts[_active]++);
      if (_counts[_active] == target) {
        HapticFeedback.mediumImpact();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Alhamdulillah — ${_items![_active]['label_ms']} selesai!'),
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  void _reset() {
    setState(() => _counts[_active] = 0);
    HapticFeedback.lightImpact();
  }

  @override
  Widget build(BuildContext context) {
    final dark = Theme.of(context).brightness == Brightness.dark;
    if (_items == null) {
      return Scaffold(
        appBar: AppBar(title: const Text('Zikir')),
        body: const Center(child: CircularProgressIndicator(strokeWidth: 2)),
      );
    }
    final item = _items![_active];
    final target = item['target_count'] as int;
    final count = _counts[_active];
    final done = count >= target;

    return Scaffold(
      appBar: AppBar(title: const Text('Zikir')),
      body: Column(
        children: [
          // dhikr selector chips
          SizedBox(
            height: 50,
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              scrollDirection: Axis.horizontal,
              itemCount: _items!.length,
              separatorBuilder: (_, _) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final active = i == _active;
                return GestureDetector(
                  onTap: () => setState(() => _active = i),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 150),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: active ? CaknaColors.olive : Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                          color: active
                              ? CaknaColors.olive
                              : (dark ? CaknaColors.borderDark : CaknaColors.border)),
                    ),
                    child: Text(
                      'Zikir ${i + 1}',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: active ? Colors.white : (dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          // main counter area
          Expanded(
            child: GestureDetector(
              onTap: _tap,
              child: Container(
                width: double.infinity,
                color: Colors.transparent,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      item['arabic'] as String,
                      textAlign: TextAlign.center,
                      textDirection: TextDirection.rtl,
                      style: TextStyle(
                        fontFamily: 'Uthmani',
                        fontSize: 32,
                        height: 2.0,
                        color: done ? CaknaColors.olive : (dark ? CaknaColors.inkDark : CaknaColors.ink),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      item['label_ms'] as String,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft,
                      ),
                    ),
                    const SizedBox(height: 40),
                    // counter circle
                    Stack(
                      alignment: Alignment.center,
                      children: [
                        SizedBox(
                          width: 180,
                          height: 180,
                          child: CircularProgressIndicator(
                            value: target == 0 ? 0 : count / target,
                            strokeWidth: 8,
                            backgroundColor: dark ? CaknaColors.borderDark : CaknaColors.border,
                            color: done ? CaknaColors.olive : CaknaColors.o400,
                          ),
                        ),
                        Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              '$count',
                              style: TextStyle(
                                fontFamily: 'Lora',
                                fontSize: 56,
                                fontWeight: FontWeight.w700,
                                color: done ? CaknaColors.olive : (dark ? CaknaColors.inkDark : CaknaColors.ink),
                              ),
                            ),
                            Text(
                              '/ $target',
                              style: TextStyle(
                                fontSize: 16,
                                color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 32),
                    Text(
                      done ? 'Selesai — ketuk untuk ulang' : 'Ketuk skrin untuk kira',
                      style: TextStyle(
                        fontSize: 13,
                        color: dark ? CaknaColors.inkSoftDark : CaknaColors.inkSoft,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          // reset button
          Padding(
            padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
            child: OutlinedButton.icon(
              onPressed: count > 0 ? _reset : null,
              icon: const Icon(Icons.refresh, size: 18),
              label: const Text('Set semula'),
              style: OutlinedButton.styleFrom(
                foregroundColor: CaknaColors.olive,
                side: const BorderSide(color: CaknaColors.olive),
                minimumSize: const Size(double.infinity, 46),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
