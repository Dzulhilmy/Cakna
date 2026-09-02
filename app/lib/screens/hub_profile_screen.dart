import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../state/app_state.dart';
import '../state/auth.dart';
import '../utils/hub_l10n.dart';

class HubProfileScreen extends StatefulWidget {
  const HubProfileScreen({super.key});

  @override
  State<HubProfileScreen> createState() => _HubProfileScreenState();
}

class _HubProfileScreenState extends State<HubProfileScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabs;
  final _loginEmail = TextEditingController();
  final _loginPw = TextEditingController();
  final _regEmail = TextEditingController();
  final _regPw = TextEditingController();
  final _regPwConfirm = TextEditingController();
  bool _loginPwVisible = false;
  bool _regPwVisible = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
    _tabs.addListener(() => setState(() => _error = null));
  }

  @override
  void dispose() {
    _tabs.dispose();
    _loginEmail.dispose();
    _loginPw.dispose();
    _regEmail.dispose();
    _regPw.dispose();
    _regPwConfirm.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    setState(() => _error = null);
    final auth = context.read<Auth>();
    try {
      await auth.login(_loginEmail.text.trim(), _loginPw.text);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    }
  }

  Future<void> _register() async {
    setState(() => _error = null);
    if (_regPw.text != _regPwConfirm.text) {
      final lang = context.read<AppState>().uiLang;
      setState(() => _error = tHub('pw_mismatch', lang));
      return;
    }
    final auth = context.read<Auth>();
    try {
      await auth.register(_regEmail.text.trim(), _regPw.text);
    } catch (e) {
      if (mounted) setState(() => _error = e.toString());
    }
  }

  Future<void> _logout() async {
    final auth = context.read<Auth>();
    await auth.logout();
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<Auth>();
    final lang = context.select<AppState, String>((app) => app.uiLang);
    final topPad = MediaQuery.of(context).padding.top;

    return Scaffold(
      backgroundColor: const Color(0xFFF7F6F2),
      body: Column(
        children: [
          // ── Gradient header ─────────────────────────────────────────────
          Container(
            padding: EdgeInsets.fromLTRB(20, topPad + 14, 20, 28),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFFC0324E), Color(0xFF7A1530)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(28),
                bottomRight: Radius.circular(28),
              ),
            ),
            child: Row(
              children: [
                InkWell(
                  onTap: () => Navigator.pop(context),
                  borderRadius: BorderRadius.circular(20),
                  child: Padding(
                    padding: const EdgeInsets.all(4),
                    child: const Icon(Icons.arrow_back_ios_new_rounded,
                        color: Colors.white, size: 18),
                  ),
                ),
                const SizedBox(width: 12),
                Text(
                  tHub('profile', lang),
                  style: const TextStyle(
                    fontFamily: 'Lora',
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
          // ── Body ────────────────────────────────────────────────────────
          Expanded(
            child: auth.signedIn
                ? _buildProfile(auth, lang)
                : _buildAuthForms(auth, lang),
          ),
        ],
      ),
    );
  }

  // ── Signed-in profile ─────────────────────────────────────────────────────
  Widget _buildProfile(Auth auth, String lang) {
    final initials = (auth.email ?? '?')[0].toUpperCase();
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          const SizedBox(height: 16),
          // Avatar
          Container(
            width: 80,
            height: 80,
            decoration: const BoxDecoration(
              color: Color(0xFFD94F6A),
              shape: BoxShape.circle,
            ),
            child: Center(
              child: Text(
                initials,
                style: const TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(height: 14),
          Text(
            auth.email ?? '',
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: Color(0xFF111827),
            ),
          ),
          const SizedBox(height: 4),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
            decoration: BoxDecoration(
              color: const Color(0xFFFFF1F3),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Text(
              tHub('franchisee', lang),
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: Color(0xFFD94F6A),
              ),
            ),
          ),
          const SizedBox(height: 28),
          // Info card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tHub('account_info', lang),
                  style: const TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: Color(0xFF9CA3AF),
                    letterSpacing: 1.2,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    const Icon(Icons.email_outlined,
                        size: 16, color: Color(0xFF9CA3AF)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        auth.email ?? '',
                        style: const TextStyle(
                            fontSize: 14, color: Color(0xFF374151)),
                      ),
                    ),
                  ],
                ),
                const Divider(height: 20),
                InkWell(
                  borderRadius: BorderRadius.circular(8),
                  onTap: () {
                    Clipboard.setData(ClipboardData(text: auth.email ?? ''));
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text(tHub('email_copied', lang)),
                        duration: const Duration(seconds: 2),
                      ),
                    );
                  },
                  child: Row(
                    children: [
                      const Icon(Icons.copy_outlined,
                          size: 16, color: Color(0xFF9CA3AF)),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          tHub('copy_email', lang),
                          style: const TextStyle(
                              fontSize: 13, color: Color(0xFF6B7280)),
                        ),
                      ),
                      const Icon(Icons.chevron_right,
                          size: 16, color: Color(0xFFD1D5DB)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Logout button
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: auth.busy ? null : _logout,
              icon: auth.busy
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Color(0xFFD94F6A)),
                    )
                  : const Icon(Icons.logout_rounded,
                      size: 18, color: Color(0xFFD94F6A)),
              label: Text(
                auth.busy ? tHub('loading', lang) : tHub('logout', lang),
                style: const TextStyle(
                    color: Color(0xFFD94F6A), fontWeight: FontWeight.w600),
              ),
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFFD94F6A)),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
                padding: const EdgeInsets.symmetric(vertical: 14),
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ── Login / Register ───────────────────────────────────────────────────────
  Widget _buildAuthForms(Auth auth, String lang) {
    return Column(
      children: [
        const SizedBox(height: 20),
        // Tab bar
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Container(
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFFEDE9E4),
              borderRadius: BorderRadius.circular(12),
            ),
            child: TabBar(
              controller: _tabs,
              labelColor: Colors.white,
              unselectedLabelColor: const Color(0xFF6B7280),
              labelStyle:
                  const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
              indicator: BoxDecoration(
                color: const Color(0xFFD94F6A),
                borderRadius: BorderRadius.circular(10),
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              tabs: [
                Tab(text: tHub('login_tab', lang)),
                Tab(text: tHub('register_tab', lang)),
              ],
            ),
          ),
        ),
        const SizedBox(height: 4),
        // Error banner
        if (_error != null)
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 8, 20, 0),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(
                color: const Color(0xFFFEF2F2),
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: const Color(0xFFFCA5A5)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline_rounded,
                      size: 16, color: Color(0xFFDC2626)),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      _error!,
                      style: const TextStyle(
                          fontSize: 13, color: Color(0xFFDC2626)),
                    ),
                  ),
                ],
              ),
            ),
          ),
        // Forms
        Expanded(
          child: TabBarView(
            controller: _tabs,
            children: [
              _buildLoginForm(auth, lang),
              _buildRegisterForm(auth, lang),
            ],
          ),
        ),
      ],
    );
  }

  Future<void> _ssoLogin() async {
    setState(() => _error = null);
    final auth = context.read<Auth>();
    try {
      await auth.ssoLogin();
    } catch (e) {
      if (!mounted) return;
      if (e is PlatformException && e.code == 'CANCELED') return;
      setState(() => _error = e.toString());
    }
  }

  Widget _buildLoginForm(Auth auth, String lang) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _field(
            controller: _loginEmail,
            label: tHub('email_label', lang),
            hint: tHub('email_hint', lang),
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 14),
          _pwField(
            controller: _loginPw,
            label: tHub('password_label', lang),
            visible: _loginPwVisible,
            onToggle: () => setState(() => _loginPwVisible = !_loginPwVisible),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: auth.busy ? null : _login,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFD94F6A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
                padding: const EdgeInsets.symmetric(vertical: 15),
                elevation: 0,
              ),
              child: auth.busy
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white),
                    )
                  : Text(tHub('login_btn', lang),
                      style: const TextStyle(
                          fontSize: 15, fontWeight: FontWeight.w600)),
            ),
          ),
          const SizedBox(height: 20),
          // ── SSO divider ──────────────────────────────────────────────
          Row(
            children: [
              const Expanded(child: Divider(color: Color(0xFFE5E7EB))),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                child: Text(
                  tHub('or_divider', lang),
                  style: TextStyle(
                      fontSize: 12.5, color: Colors.grey.shade500),
                ),
              ),
              const Expanded(child: Divider(color: Color(0xFFE5E7EB))),
            ],
          ),
          const SizedBox(height: 20),
          // ── QCXIS SSO button ─────────────────────────────────────────
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: auth.busy ? null : _ssoLogin,
              style: OutlinedButton.styleFrom(
                side: const BorderSide(color: Color(0xFFD1D5DB)),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
                padding: const EdgeInsets.symmetric(vertical: 14),
                backgroundColor: Colors.white,
              ),
              child: auth.busy
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Color(0xFFD94F6A)),
                    )
                  : Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        // QCXIS shield icon
                        Container(
                          width: 22,
                          height: 22,
                          decoration: const BoxDecoration(
                            color: Color(0xFF0D9488),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.shield_outlined,
                              size: 13, color: Colors.white),
                        ),
                        const SizedBox(width: 10),
                        Text(
                          tHub('sso_btn', lang),
                          style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF374151)),
                        ),
                      ],
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRegisterForm(Auth auth, String lang) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 40),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _field(
            controller: _regEmail,
            label: tHub('email_label', lang),
            hint: tHub('email_hint', lang),
            icon: Icons.email_outlined,
            keyboardType: TextInputType.emailAddress,
          ),
          const SizedBox(height: 14),
          _pwField(
            controller: _regPw,
            label: tHub('password_label', lang),
            visible: _regPwVisible,
            onToggle: () => setState(() => _regPwVisible = !_regPwVisible),
          ),
          const SizedBox(height: 14),
          _pwField(
            controller: _regPwConfirm,
            label: tHub('confirm_pw_label', lang),
            visible: _regPwVisible,
            onToggle: () => setState(() => _regPwVisible = !_regPwVisible),
          ),
          const SizedBox(height: 24),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: auth.busy ? null : _register,
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFD94F6A),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
                padding: const EdgeInsets.symmetric(vertical: 15),
                elevation: 0,
              ),
              child: auth.busy
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white),
                    )
                  : Text(tHub('register_btn', lang),
                      style: const TextStyle(
                          fontSize: 15, fontWeight: FontWeight.w600)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _field({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF374151))),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          keyboardType: keyboardType,
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 14),
            prefixIcon: Icon(icon, size: 18, color: const Color(0xFF9CA3AF)),
            filled: true,
            fillColor: Colors.white,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
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
              borderSide:
                  const BorderSide(color: Color(0xFFD94F6A), width: 1.5),
            ),
          ),
        ),
      ],
    );
  }

  Widget _pwField({
    required TextEditingController controller,
    required String label,
    required bool visible,
    required VoidCallback onToggle,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Color(0xFF374151))),
        const SizedBox(height: 6),
        TextFormField(
          controller: controller,
          obscureText: !visible,
          decoration: InputDecoration(
            hintText: '••••••••',
            hintStyle: const TextStyle(color: Color(0xFF9CA3AF), fontSize: 14),
            prefixIcon: const Icon(Icons.lock_outline_rounded,
                size: 18, color: Color(0xFF9CA3AF)),
            suffixIcon: IconButton(
              icon: Icon(
                visible
                    ? Icons.visibility_off_outlined
                    : Icons.visibility_outlined,
                size: 18,
                color: const Color(0xFF9CA3AF),
              ),
              onPressed: onToggle,
            ),
            filled: true,
            fillColor: Colors.white,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 14),
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
              borderSide:
                  const BorderSide(color: Color(0xFFD94F6A), width: 1.5),
            ),
          ),
        ),
      ],
    );
  }
}
