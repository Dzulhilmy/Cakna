import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../api/cakna_api.dart';
import '../state/auth.dart';
import '../state/hub_application_state.dart';

class HubFormScreen extends StatefulWidget {
  const HubFormScreen({super.key});

  @override
  State<HubFormScreen> createState() => _HubFormScreenState();
}

class _HubFormScreenState extends State<HubFormScreen> {
  final _formKey = GlobalKey<FormState>();
  int _step = 0;
  bool _submitting = false;

  // Step 1 — Maklumat Francaisi
  final _cawangan = TextEditingController();
  final _namaFrancaisi = TextEditingController();
  final _ajk = TextEditingController();
  String? _kluster;

  // Step 2 — Maklumat Program
  final _namaProgram = TextEditingController();
  final _tarikh = TextEditingController();
  final _lokasi = TextEditingController();
  final _penerangan = TextEditingController();
  final _jumlahPeserta = TextEditingController();
  final _kategoriPenerima = TextEditingController();
  final _namaKomuniti = TextEditingController();

  // Step 3 — Kewangan
  final _jumlahPerbelanjaan = TextEditingController();
  final _sumberDana = TextEditingController();
  final _pautanGambar = TextEditingController();

  // Step 4 — Impak
  final _impak = TextEditingController();
  final _cadangan = TextEditingController();

  static const _steps = ['Francaisi', 'Program', 'Kewangan', 'Impak'];

  @override
  void dispose() {
    for (final c in [
      _cawangan, _namaFrancaisi, _ajk,
      _namaProgram, _tarikh, _lokasi, _penerangan,
      _jumlahPeserta, _kategoriPenerima, _namaKomuniti,
      _jumlahPerbelanjaan, _sumberDana, _pautanGambar,
      _impak, _cadangan,
    ]) {
      c.dispose();
    }
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _submitting = true);
    try {
      final api = context.read<Auth>().api;
      final body = {
        'cawangan': _cawangan.text.trim(),
        'nama_francaisi': _namaFrancaisi.text.trim(),
        'ajk': _ajk.text.trim(),
        'kluster': _kluster ?? '',
        'nama_program': _namaProgram.text.trim(),
        'tarikh': _tarikh.text.trim(),
        'lokasi': _lokasi.text.trim(),
        'penerangan': _penerangan.text.trim(),
        'jumlah_peserta': _jumlahPeserta.text.trim(),
        'kategori_penerima': _kategoriPenerima.text.trim(),
        'nama_komuniti': _namaKomuniti.text.trim(),
        'jumlah_perbelanjaan':
            double.tryParse(_jumlahPerbelanjaan.text.replaceAll(',', '')) ?? 0.0,
        'sumber_dana': _sumberDana.text.trim(),
        'pautan_gambar': _pautanGambar.text.trim(),
        'impak': _impak.text.trim(),
        'cadangan': _cadangan.text.trim(),
      };
      final result = await api.hubSubmitFunding(body);
      if (!mounted) return;
      final app = result['app'] as Map<String, dynamic>?;
      await context.read<HubApplicationState>().save(
            programName: _namaProgram.text.trim(),
            cawangan: _cawangan.text.trim(),
            kluster: _kluster ?? '',
            id: app?['id'] as String?,
            reference: app?['reference'] as String?,
          );
      _showSuccess();
    } on ApiException catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.message), backgroundColor: const Color(0xFFDC2626)),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  void _showSuccess() {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) => Dialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: const BoxDecoration(
                  color: Color(0xFFFFF1F3), shape: BoxShape.circle),
                child: const Icon(Icons.check_circle_rounded,
                    color: Color(0xFFD94F6A), size: 36),
              ),
              const SizedBox(height: 16),
              const Text('Borang Dihantar!',
                  style: TextStyle(
                      fontFamily: 'Lora',
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF111827))),
              const SizedBox(height: 8),
              const Text(
                'Permohonan anda telah dihantar untuk semakan admin dan PIC. '
                'Anda akan dihubungi dalam masa 3–5 hari bekerja.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 13.5, color: Color(0xFF6B7280), height: 1.5),
              ),
              const SizedBox(height: 20),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.pop(context);
                    _resetForm();
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFD94F6A),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('Selesai', style: TextStyle(fontWeight: FontWeight.w600)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _resetForm() {
    for (final c in [
      _cawangan, _namaFrancaisi, _ajk,
      _namaProgram, _tarikh, _lokasi, _penerangan,
      _jumlahPeserta, _kategoriPenerima, _namaKomuniti,
      _jumlahPerbelanjaan, _sumberDana, _pautanGambar,
      _impak, _cadangan,
    ]) {
      c.clear();
    }
    setState(() {
      _kluster = null;
      _step = 0;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F2),
      body: Column(
        children: [
          _buildHeader(context),
          _buildStepBar(),
          Expanded(
            child: Form(
              key: _formKey,
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
                child: AnimatedSwitcher(
                  duration: const Duration(milliseconds: 260),
                  transitionBuilder: (child, anim) =>
                      FadeTransition(opacity: anim, child: child),
                  child: _buildCurrentStep(),
                ),
              ),
            ),
          ),
          _buildFooter(),
        ],
      ),
    );
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(20, MediaQuery.of(context).padding.top + 16, 20, 20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFFD94F6A), Color(0xFF9E2A42)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: const Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Borang Permohonan',
              style: TextStyle(
                  fontFamily: 'Lora',
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: Colors.white)),
          SizedBox(height: 4),
          Text('Permohonan program CSR untuk semakan admin & PIC',
              style: TextStyle(fontSize: 12.5, color: Colors.white70)),
        ],
      ),
    );
  }

  Widget _buildStepBar() {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          for (var i = 0; i < _steps.length; i++) ...[
            Expanded(
              child: Column(
                children: [
                  Row(
                    children: [
                      if (i > 0)
                        Expanded(
                          child: Container(
                            height: 2,
                            color: i <= _step
                                ? const Color(0xFFD94F6A)
                                : const Color(0xFFE5E7EB),
                          ),
                        ),
                      Container(
                        width: 26,
                        height: 26,
                        decoration: BoxDecoration(
                          color: i < _step
                              ? const Color(0xFFD94F6A)
                              : i == _step
                                  ? const Color(0xFFFFF1F3)
                                  : const Color(0xFFF3F4F6),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: i <= _step
                                ? const Color(0xFFD94F6A)
                                : const Color(0xFFE5E7EB),
                          ),
                        ),
                        child: Center(
                          child: i < _step
                              ? const Icon(Icons.check, size: 13, color: Colors.white)
                              : Text('${i + 1}',
                                  style: TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      color: i == _step
                                          ? const Color(0xFFD94F6A)
                                          : const Color(0xFF9CA3AF))),
                        ),
                      ),
                      if (i < _steps.length - 1)
                        Expanded(
                          child: Container(
                            height: 2,
                            color: i < _step
                                ? const Color(0xFFD94F6A)
                                : const Color(0xFFE5E7EB),
                          ),
                        ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(_steps[i],
                      style: TextStyle(
                          fontSize: 9.5,
                          fontWeight:
                              i == _step ? FontWeight.w700 : FontWeight.w500,
                          color: i <= _step
                              ? const Color(0xFFD94F6A)
                              : const Color(0xFF9CA3AF))),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildCurrentStep() {
    return switch (_step) {
      0 => _Step1(
          key: const ValueKey(0),
          cawangan: _cawangan,
          namaFrancaisi: _namaFrancaisi,
          ajk: _ajk,
          kluster: _kluster,
          onKlusterChanged: (v) => setState(() => _kluster = v),
        ),
      1 => _Step2(
          key: const ValueKey(1),
          namaProgram: _namaProgram,
          tarikh: _tarikh,
          lokasi: _lokasi,
          penerangan: _penerangan,
          jumlahPeserta: _jumlahPeserta,
          kategoriPenerima: _kategoriPenerima,
          namaKomuniti: _namaKomuniti,
        ),
      2 => _Step3(
          key: const ValueKey(2),
          jumlahPerbelanjaan: _jumlahPerbelanjaan,
          sumberDana: _sumberDana,
          pautanGambar: _pautanGambar,
        ),
      _ => _Step4(
          key: const ValueKey(3),
          impak: _impak,
          cadangan: _cadangan,
        ),
    };
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE5E7EB))),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            if (_step > 0)
              Expanded(
                child: OutlinedButton(
                  onPressed: () => setState(() => _step--),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: const Color(0xFF374151),
                    side: const BorderSide(color: Color(0xFFE5E7EB)),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('Kembali'),
                ),
              ),
            if (_step > 0) const SizedBox(width: 10),
            Expanded(
              flex: 2,
              child: ElevatedButton(
                onPressed: _submitting
                    ? null
                    : () {
                        if (_step < _steps.length - 1) {
                          setState(() => _step++);
                        } else {
                          _submit();
                        }
                      },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFD94F6A),
                  foregroundColor: Colors.white,
                  disabledBackgroundColor: const Color(0xFFE5E7EB),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(vertical: 14),
                ),
                child: _submitting
                    ? const SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(
                            strokeWidth: 2, color: Colors.white))
                    : Text(
                        _step < _steps.length - 1 ? 'Seterusnya' : 'Hantar Borang',
                        style: const TextStyle(fontWeight: FontWeight.w700)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────── Step 1 — Maklumat Francaisi ────────────────

class _Step1 extends StatelessWidget {
  final TextEditingController cawangan, namaFrancaisi, ajk;
  final String? kluster;
  final ValueChanged<String?> onKlusterChanged;

  const _Step1({
    super.key,
    required this.cawangan,
    required this.namaFrancaisi,
    required this.ajk,
    required this.kluster,
    required this.onKlusterChanged,
  });

  static const _klusterOptions = [
    'Assist', 'Biz', 'Circle', 'Digital', 'Edu', 'Future', 'Green',
  ];

  @override
  Widget build(BuildContext context) {
    return _FormSection(
      title: 'Maklumat Francaisi',
      children: [
        _Field(controller: cawangan, label: 'Cawangan', hint: 'cth: Kuala Lumpur Selatan'),
        _Field(controller: namaFrancaisi, label: 'Nama Francaisi', hint: 'Nama pusat francaisi'),
        _Field(controller: ajk, label: 'Nama AJK', hint: 'Nama Ahli Jawatankuasa'),
        DropdownButtonFormField<String>(
          initialValue: kluster,
          decoration: _fieldDecoration('Kluster / Teras'),
          hint: const Text('Pilih kluster'),
          items: _klusterOptions
              .map((k) => DropdownMenuItem(value: k, child: Text(k)))
              .toList(),
          onChanged: onKlusterChanged,
          validator: (v) => v == null ? 'Sila pilih kluster' : null,
        ),
      ],
    );
  }
}

// ─────────────── Step 2 — Maklumat Program ──────────────────

class _Step2 extends StatelessWidget {
  final TextEditingController namaProgram, tarikh, lokasi, penerangan,
      jumlahPeserta, kategoriPenerima, namaKomuniti;

  const _Step2({
    super.key,
    required this.namaProgram,
    required this.tarikh,
    required this.lokasi,
    required this.penerangan,
    required this.jumlahPeserta,
    required this.kategoriPenerima,
    required this.namaKomuniti,
  });

  @override
  Widget build(BuildContext context) {
    return _FormSection(
      title: 'Maklumat Program',
      children: [
        _Field(controller: namaProgram, label: 'Nama Program', hint: 'cth: SETEM Bengkel Matematik'),
        _DateField(controller: tarikh, label: 'Tarikh Program'),
        _Field(controller: lokasi, label: 'Lokasi', hint: 'Alamat lengkap atau nama tempat'),
        _Field(
          controller: penerangan,
          label: 'Penerangan Program',
          hint: 'Huraikan program secara ringkas...',
          maxLines: 4,
        ),
        _Field(
          controller: jumlahPeserta,
          label: 'Jumlah Peserta',
          hint: 'cth: 50',
          keyboardType: TextInputType.number,
          inputFormatters: [FilteringTextInputFormatter.digitsOnly],
        ),
        _Field(controller: kategoriPenerima, label: 'Kategori Penerima', hint: 'cth: Pelajar B40, Golongan OKU'),
        _Field(controller: namaKomuniti, label: 'Nama Komuniti / Kampung', hint: 'Nama kawasan yang diberi manfaat'),
      ],
    );
  }
}

// ─────────────── Step 3 — Maklumat Kewangan ─────────────────

class _Step3 extends StatelessWidget {
  final TextEditingController jumlahPerbelanjaan, sumberDana, pautanGambar;

  const _Step3({
    super.key,
    required this.jumlahPerbelanjaan,
    required this.sumberDana,
    required this.pautanGambar,
  });

  @override
  Widget build(BuildContext context) {
    return _FormSection(
      title: 'Maklumat Kewangan',
      children: [
        TextFormField(
          controller: jumlahPerbelanjaan,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'^\d+\.?\d{0,2}'))],
          decoration: _fieldDecoration('Jumlah Perbelanjaan (RM)').copyWith(
            prefixText: 'RM ',
            prefixStyle: const TextStyle(color: Color(0xFF374151), fontWeight: FontWeight.w600),
          ),
          validator: (v) =>
              v == null || v.isEmpty ? 'Sila masukkan jumlah perbelanjaan' : null,
        ),
        _Field(controller: sumberDana, label: 'Sumber Dana', hint: 'cth: HQ CAKNA, Tabung Cawangan'),
        _Field(
          controller: pautanGambar,
          label: 'Pautan Gambar / Google Drive',
          hint: 'https://drive.google.com/...',
          keyboardType: TextInputType.url,
          required: false,
        ),
      ],
    );
  }
}

// ─────────────── Step 4 — Impak & Cadangan ──────────────────

class _Step4 extends StatelessWidget {
  final TextEditingController impak, cadangan;

  const _Step4({super.key, required this.impak, required this.cadangan});

  @override
  Widget build(BuildContext context) {
    return _FormSection(
      title: 'Impak & Cadangan',
      children: [
        _Field(
          controller: impak,
          label: 'Impak Program',
          hint: 'Huraikan impak yang dicapai oleh program ini...',
          maxLines: 5,
        ),
        _Field(
          controller: cadangan,
          label: 'Cadangan Penambahbaikan',
          hint: 'Cadangan untuk meningkatkan program pada masa hadapan...',
          maxLines: 4,
          required: false,
        ),
        Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF1F3),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: const Color(0xFFFFCDD5)),
          ),
          child: const Row(
            children: [
              Icon(Icons.info_outline, size: 16, color: Color(0xFFD94F6A)),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Borang ini akan dihantar kepada admin dan PIC untuk semakan dan kelulusan.',
                  style: TextStyle(fontSize: 12, color: Color(0xFF9E2A42), height: 1.4),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ────────────── Shared form widgets ─────────────────────────

class _FormSection extends StatelessWidget {
  final String title;
  final List<Widget> children;
  const _FormSection({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title,
            style: const TextStyle(
                fontFamily: 'Lora',
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Color(0xFF111827))),
        const SizedBox(height: 16),
        for (var i = 0; i < children.length; i++) ...[
          children[i],
          if (i < children.length - 1) const SizedBox(height: 14),
        ],
      ],
    );
  }
}

class _Field extends StatelessWidget {
  final TextEditingController controller;
  final String label, hint;
  final int maxLines;
  final TextInputType keyboardType;
  final List<TextInputFormatter>? inputFormatters;
  final bool required;

  const _Field({
    required this.controller,
    required this.label,
    required this.hint,
    this.maxLines = 1,
    this.keyboardType = TextInputType.text,
    this.inputFormatters,
    this.required = true,
  });

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      keyboardType: keyboardType,
      inputFormatters: inputFormatters,
      decoration: _fieldDecoration(label).copyWith(hintText: hint),
      validator: required
          ? (v) => v == null || v.trim().isEmpty ? 'Medan ini diperlukan' : null
          : null,
    );
  }
}

class _DateField extends StatelessWidget {
  final TextEditingController controller;
  final String label;
  const _DateField({required this.controller, required this.label});

  @override
  Widget build(BuildContext context) {
    return TextFormField(
      controller: controller,
      readOnly: true,
      decoration: _fieldDecoration(label).copyWith(
        hintText: 'Pilih tarikh',
        suffixIcon: const Icon(Icons.calendar_today_outlined,
            size: 18, color: Color(0xFF9CA3AF)),
      ),
      onTap: () async {
        final picked = await showDatePicker(
          context: context,
          initialDate: DateTime.now(),
          firstDate: DateTime(2020),
          lastDate: DateTime(2030),
          builder: (context, child) => Theme(
            data: Theme.of(context).copyWith(
              colorScheme: const ColorScheme.light(primary: Color(0xFFD94F6A)),
            ),
            child: child!,
          ),
        );
        if (picked != null) {
          controller.text =
              '${picked.day.toString().padLeft(2, '0')}/${picked.month.toString().padLeft(2, '0')}/${picked.year}';
        }
      },
      validator: (v) =>
          v == null || v.isEmpty ? 'Sila pilih tarikh' : null,
    );
  }
}

InputDecoration _fieldDecoration(String label) {
  return InputDecoration(
    labelText: label,
    labelStyle: const TextStyle(fontSize: 13.5, color: Color(0xFF6B7280)),
    filled: true,
    fillColor: Colors.white,
    contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
    ),
    enabledBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: Color(0xFFD94F6A), width: 1.5),
    ),
    errorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: Color(0xFFEF4444)),
    ),
    focusedErrorBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.5),
    ),
  );
}
