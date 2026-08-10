import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../state/auth.dart';
import '../theme.dart';
import '../widgets/cakna_mark.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  final _email = TextEditingController();
  final _password = TextEditingController();
  bool _register = false;
  String? _error;

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _ssoLogin() async {
    setState(() => _error = null);
    try {
      await context.read<Auth>().ssoLogin();
      if (mounted) Navigator.pop(context);
    } on Exception catch (e) {
      final msg = e.toString();
      if (msg.contains('CANCELED') || msg.contains('UserCanceled')) return;
      setState(() => _error = 'Log masuk QCXIS gagal. Cuba lagi.');
    }
  }

  Future<void> _submit() async {
    setState(() => _error = null);
    final email = _email.text.trim();
    final pw = _password.text;
    if (!email.contains('@') || pw.length < 6) {
      setState(() => _error = 'Masukkan e-mel sah dan kata laluan (min. 6 aksara).');
      return;
    }
    final auth = context.read<Auth>();
    try {
      if (_register) {
        await auth.register(email, pw);
      } else {
        await auth.login(email, pw);
      }
      if (mounted) Navigator.pop(context);
    } catch (e) {
      setState(() => _error = _register
          ? 'Pendaftaran gagal — e-mel mungkin telah digunakan.'
          : 'Log masuk gagal — semak e-mel dan kata laluan.');
    }
  }

  @override
  Widget build(BuildContext context) {
    final busy = context.watch<Auth>().busy;
    return Scaffold(
      appBar: AppBar(title: Text(_register ? 'Daftar akaun' : 'Log masuk')),
      body: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          const SizedBox(height: 12),
          const Center(child: CaknaMark(size: 64, color: CaknaColors.oliveDeep)),
          const SizedBox(height: 16),
          Text(
            _register ? 'Cipta akaun Cakna' : 'Selamat kembali',
            textAlign: TextAlign.center,
            style: const TextStyle(
                fontFamily: 'Lora', fontSize: 22, fontWeight: FontWeight.w600, color: CaknaColors.oliveDeep),
          ),
          const SizedBox(height: 6),
          const Text('Segerak penanda, nota dan kemajuan merentas peranti.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 13, color: CaknaColors.inkSoft)),
          const SizedBox(height: 28),
          TextField(
            controller: _email,
            keyboardType: TextInputType.emailAddress,
            autocorrect: false,
            decoration: const InputDecoration(labelText: 'E-mel', border: OutlineInputBorder()),
          ),
          const SizedBox(height: 14),
          TextField(
            controller: _password,
            obscureText: true,
            decoration: const InputDecoration(labelText: 'Kata laluan', border: OutlineInputBorder()),
          ),
          if (_error != null) ...[
            const SizedBox(height: 12),
            Text(_error!, style: const TextStyle(color: Color(0xFFC62828), fontSize: 13)),
          ],
          const SizedBox(height: 22),
          FilledButton(
            style: FilledButton.styleFrom(
                backgroundColor: CaknaColors.olive, minimumSize: const Size.fromHeight(52)),
            onPressed: busy ? null : _submit,
            child: busy
                ? const SizedBox(
                    width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : Text(_register ? 'Daftar' : 'Log masuk',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
          ),
          const SizedBox(height: 14),
          Center(
            child: TextButton(
              onPressed: () => setState(() {
                _register = !_register;
                _error = null;
              }),
              style: TextButton.styleFrom(foregroundColor: CaknaColors.inkSoft),
              child: Text(_register
                  ? 'Sudah ada akaun? Log masuk'
                  : 'Belum ada akaun? Daftar'),
            ),
          ),
          const _OrDivider(),
          const SizedBox(height: 14),
          OutlinedButton.icon(
            style: OutlinedButton.styleFrom(
              minimumSize: const Size.fromHeight(52),
              side: const BorderSide(color: CaknaColors.olive),
              foregroundColor: CaknaColors.oliveDeep,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            onPressed: busy ? null : _ssoLogin,
            icon: const Icon(Icons.account_circle_outlined),
            label: const Text('Log masuk dengan QCXIS',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w500)),
          ),
        ],
      ),
    );
  }
}

class _OrDivider extends StatelessWidget {
  const _OrDivider();
  @override
  Widget build(BuildContext context) {
    return Row(children: [
      const Expanded(child: Divider()),
      Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12),
        child: Text('atau', style: TextStyle(fontSize: 12, color: CaknaColors.inkSoft)),
      ),
      const Expanded(child: Divider()),
    ]);
  }
}
