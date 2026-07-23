import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../data/models.dart';
import '../data/quran_repo.dart';
import '../theme.dart';

/// Lets the user choose up to 6 shortcuts for the Home "Akses pantas" grid
/// (matches Tilawah's quick-access manager). Id 0 = Al-Ma'thurat module,
/// 1..114 = surah. Returns the selected id list via Navigator.pop.
class QuickAccessPicker extends StatefulWidget {
  final List<int> initial;
  const QuickAccessPicker({super.key, required this.initial});

  @override
  State<QuickAccessPicker> createState() => _QuickAccessPickerState();
}

class _QuickAccessPickerState extends State<QuickAccessPicker> {
  static const _max = 6;
  late final List<int> _selected = widget.initial.toList();
  String _query = '';

  bool _matches(int id, String name) {
    if (_query.isEmpty) return true;
    final q = _query.toLowerCase();
    return name.toLowerCase().contains(q) || id.toString() == q;
  }

  void _toggle(int id) {
    setState(() {
      if (_selected.contains(id)) {
        _selected.remove(id);
      } else if (_selected.length < _max) {
        _selected.add(id);
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Maksimum 6 pilihan. Nyahpilih satu dahulu.')));
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final repo = context.read<QuranRepo>();
    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
            icon: const Icon(Icons.close), onPressed: () => Navigator.pop(context)),
        title: const Text('Akses pantas'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, _selected),
            child: const Text('Selesai',
                style: TextStyle(fontWeight: FontWeight.w600, color: CaknaColors.olive)),
          ),
        ],
      ),
      body: FutureBuilder<List<Surah>>(
        future: repo.surahs(),
        builder: (context, snap) {
          if (!snap.hasData) {
            return const Center(child: CircularProgressIndicator(strokeWidth: 2));
          }
          final surahs = snap.data!;
          final items = <(int, String, String)>[
            (0, "Al-Ma'thurat", 'Al-Ma\'thurat'),
            for (final s in surahs) (s.id, s.nameTrans, s.name),
          ].where((it) => _matches(it.$1, it.$2)).toList();
          return Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(12),
                child: TextField(
                  decoration: InputDecoration(
                    hintText: 'Cari surah…',
                    prefixIcon: const Icon(Icons.search),
                    filled: true,
                    fillColor: Theme.of(context).cardColor,
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
                    contentPadding: EdgeInsets.zero,
                  ),
                  onChanged: (v) => setState(() => _query = v),
                ),
              ),
              Expanded(
                child: ListView.separated(
                  itemCount: items.length,
                  separatorBuilder: (_, _) => const Divider(height: 1, indent: 64),
                  itemBuilder: (context, i) {
                    final (id, name, _) = items[i];
                    final selected = _selected.contains(id);
                    return ListTile(
                      leading: SizedBox(
                        width: 36,
                        child: Text(id.toString().padLeft(2, '0'),
                            style: const TextStyle(color: CaknaColors.inkSoft, fontSize: 13)),
                      ),
                      title: Text(name, style: const TextStyle(fontWeight: FontWeight.w500)),
                      trailing: Icon(
                        selected ? Icons.check_circle : Icons.circle_outlined,
                        color: selected ? CaknaColors.olive : CaknaColors.inkSoft.withValues(alpha: 0.5),
                      ),
                      onTap: () => _toggle(id),
                    );
                  },
                ),
              ),
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 6, 16, 12),
                  child: Column(
                    children: [
                      Text('Pilih sehingga 6 surah untuk akses pantas (${_selected.length}/6)',
                          style: const TextStyle(fontSize: 12, color: CaknaColors.inkSoft)),
                      const SizedBox(height: 8),
                      FilledButton(
                        style: FilledButton.styleFrom(
                          backgroundColor: CaknaColors.olive,
                          minimumSize: const Size.fromHeight(48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
                        ),
                        onPressed: () => Navigator.pop(context, _selected),
                        child: const Text('Selesai',
                            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
