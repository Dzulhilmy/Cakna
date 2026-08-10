import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:url_launcher/url_launcher.dart';
import '../theme.dart';

// ─── Donation configuration ────────────────────────────────────────────────
// Update these constants to set the live payment details.
const _bankName = 'Maybank';
const _accountHolder = 'QCXIS SDN BHD';
const _accountNumber = '5640 5696 1234'; // ← replace with live account
const _referencePrefix = 'CAKNA';
// Online payment gateway link (e.g. Stripe, Billplz, DuitNow Online).
// Leave empty to hide the "Bayar Atas Talian" button.
const _paymentUrl = ''; // ← replace with live URL
// ───────────────────────────────────────────────────────────────────────────

const _presets = [5, 10, 20, 50, 100];

class DonationScreen extends StatefulWidget {
  const DonationScreen({super.key});

  @override
  State<DonationScreen> createState() => _DonationScreenState();
}

class _DonationScreenState extends State<DonationScreen> {
  int? _selected = 10;
  final _custom = TextEditingController();
  bool _useCustom = false;

  @override
  void dispose() {
    _custom.dispose();
    super.dispose();
  }

  int get _amount {
    if (_useCustom) return int.tryParse(_custom.text) ?? 0;
    return _selected ?? 0;
  }

  void _selectPreset(int v) {
    setState(() {
      _selected = v;
      _useCustom = false;
      _custom.clear();
    });
  }

  void _copy(String text, String label) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$label disalin'), duration: const Duration(seconds: 2)));
  }

  Future<void> _openOnline() async {
    if (_paymentUrl.isEmpty) return;
    final amount = _amount;
    final uri = Uri.parse(amount > 0
        ? '$_paymentUrl?amount=${amount * 100}'
        : _paymentUrl);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Tidak dapat membuka pautan pembayaran.')));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Buat sumbangan')),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 40),
        children: [
          const SizedBox(height: 12),
          const Text(
            'Sokongan anda membantu kami terus menyediakan pengalaman membaca Quran yang terbaik.',
            style: TextStyle(fontSize: 14, height: 1.5),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 24),
          // Amount selector
          Text('Pilih jumlah (RM)',
              style: TextStyle(
                  fontSize: 13, fontWeight: FontWeight.w600, color: CaknaColors.inkSoft)),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final v in _presets)
                _AmountChip(
                  label: 'RM $v',
                  selected: !_useCustom && _selected == v,
                  onTap: () => _selectPreset(v),
                ),
              _AmountChip(
                label: 'Lain-lain',
                selected: _useCustom,
                onTap: () => setState(() {
                  _useCustom = true;
                  _selected = null;
                }),
              ),
            ],
          ),
          if (_useCustom) ...[
            const SizedBox(height: 12),
            TextField(
              controller: _custom,
              keyboardType: TextInputType.number,
              autofocus: true,
              onChanged: (_) => setState(() {}),
              decoration: const InputDecoration(
                labelText: 'Jumlah (RM)',
                prefixText: 'RM ',
                border: OutlineInputBorder(),
              ),
            ),
          ],
          const SizedBox(height: 28),
          // Bank transfer section
          _SectionHeader(label: 'Pindahan bank / DuitNow'),
          const SizedBox(height: 12),
          _BankCard(
            bankName: _bankName,
            accountHolder: _accountHolder,
            accountNumber: _accountNumber,
            reference: _amount > 0 ? '$_referencePrefix$_amount' : _referencePrefix,
            onCopyAccount: () => _copy(_accountNumber.replaceAll(' ', ''), 'No. akaun'),
            onCopyRef: _amount > 0
                ? () => _copy('$_referencePrefix$_amount', 'Rujukan')
                : null,
          ),
          if (_paymentUrl.isNotEmpty) ...[
            const SizedBox(height: 28),
            _SectionHeader(label: 'Bayar atas talian'),
            const SizedBox(height: 12),
            FilledButton.icon(
              style: FilledButton.styleFrom(
                backgroundColor: CaknaColors.olive,
                minimumSize: const Size.fromHeight(52),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: _openOnline,
              icon: const Icon(Icons.open_in_new),
              label: Text(
                _amount > 0 ? 'Bayar RM $_amount' : 'Teruskan pembayaran',
                style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
              ),
            ),
          ],
          const SizedBox(height: 28),
          Center(
            child: Text(
              'Terima kasih atas sokongan anda 🙏',
              style: TextStyle(fontSize: 13, color: CaknaColors.inkSoft),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String label;
  const _SectionHeader({required this.label});

  @override
  Widget build(BuildContext context) {
    return Text(label,
        style: const TextStyle(
            fontSize: 13, fontWeight: FontWeight.w600, color: CaknaColors.inkSoft));
  }
}

class _AmountChip extends StatelessWidget {
  final String label;
  final bool selected;
  final VoidCallback onTap;
  const _AmountChip({required this.label, required this.selected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
        decoration: BoxDecoration(
          color: selected ? CaknaColors.olive : Theme.of(context).cardColor,
          border: Border.all(
              color: selected
                  ? CaknaColors.olive
                  : Theme.of(context).dividerColor),
          borderRadius: BorderRadius.circular(24),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: selected ? Colors.white : null,
          ),
        ),
      ),
    );
  }
}

class _BankCard extends StatelessWidget {
  final String bankName, accountHolder, accountNumber, reference;
  final VoidCallback onCopyAccount;
  final VoidCallback? onCopyRef;
  const _BankCard({
    required this.bankName,
    required this.accountHolder,
    required this.accountNumber,
    required this.reference,
    required this.onCopyAccount,
    required this.onCopyRef,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Theme.of(context).dividerColor),
      ),
      child: Column(
        children: [
          _Row(label: 'Bank', value: bankName),
          const Divider(height: 1),
          _Row(label: 'Nama penerima', value: accountHolder),
          const Divider(height: 1),
          _Row(
            label: 'No. akaun',
            value: accountNumber,
            trailing: IconButton(
              icon: const Icon(Icons.copy_outlined, size: 18),
              onPressed: onCopyAccount,
              tooltip: 'Salin',
            ),
          ),
          if (onCopyRef != null) ...[
            const Divider(height: 1),
            _Row(
              label: 'Rujukan',
              value: reference,
              trailing: IconButton(
                icon: const Icon(Icons.copy_outlined, size: 18),
                onPressed: onCopyRef,
                tooltip: 'Salin rujukan',
              ),
            ),
          ],
        ],
      ),
    );
  }
}

class _Row extends StatelessWidget {
  final String label, value;
  final Widget? trailing;
  const _Row({required this.label, required this.value, this.trailing});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          SizedBox(
            width: 120,
            child: Text(label,
                style: const TextStyle(fontSize: 13, color: CaknaColors.inkSoft)),
          ),
          Expanded(
            child: Text(value,
                style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
          ),
          ?trailing,
        ],
      ),
    );
  }
}
