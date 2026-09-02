/// Hub-section UI translations.
/// [lang] is 'en' or 'ms'. Falls back to English if a key is missing.
String tHub(String key, String lang) {
  final dict = lang == 'en' ? _en : _ms;
  return dict[key] ?? _en[key] ?? key;
}

const _ms = <String, String>{
  // bottom nav
  'nav_about': 'Tentang',
  'nav_form': 'Borang',
  'nav_news': 'Berita',
  // home section headers
  'sec_notices': 'NOTIS SAYA',
  'sec_events': 'ACARA',
  'sec_announcements': 'MAKLUMAN',
  // application card
  'my_application': 'Aplikasi Saya',
  'status_approved': 'Diluluskan',
  'status_revision': 'Perlu Pindaan',
  'status_final': 'Semakan Akhir',
  'status_pending': 'Menunggu Semakan',
  'submitted_on': 'Dihantar',
  // quick shortcuts
  'cakna_app_title': 'Aplikasi Cakna',
  'cakna_app_subtitle': "Al-Quran, Waktu Solat, Al-Ma'thurat & Nota",
  'more': 'Lagi',
  'policy_title': 'Polisi & Panduan',
  'policy_subtitle': 'Polisi, SOP, Garis Panduan & Manual',
  // footer
  'contact_us': 'Hubungi Kami',
  // core detail sheet
  'program_header': 'PROGRAM',
  'no_programs': 'Tiada program lagi untuk teras ini.',
  // profile screen
  'profile': 'Profil',
  'franchisee': 'Francaisi',
  'account_info': 'MAKLUMAT AKAUN',
  'login_tab': 'Log Masuk',
  'register_tab': 'Daftar',
  'login_btn': 'Log Masuk',
  'register_btn': 'Daftar Akaun',
  'email_label': 'E-mel',
  'email_hint': 'nama@contoh.com',
  'password_label': 'Kata Laluan',
  'confirm_pw_label': 'Sahkan Kata Laluan',
  'logout': 'Log Keluar',
  'loading': 'Menunggu...',
  'or_divider': 'atau',
  'sso_btn': 'Teruskan dengan QCXIS',
  'pw_mismatch': 'Kata laluan tidak sepadan.',
  'copy_email': 'Salin e-mel',
  'email_copied': 'E-mel disalin',
};

const _en = <String, String>{
  // bottom nav
  'nav_about': 'About',
  'nav_form': 'Form',
  'nav_news': 'News',
  // home section headers
  'sec_notices': 'MY NOTICES',
  'sec_events': 'EVENTS',
  'sec_announcements': 'ANNOUNCEMENTS',
  // application card
  'my_application': 'My Application',
  'status_approved': 'Approved',
  'status_revision': 'Needs Revision',
  'status_final': 'Final Review',
  'status_pending': 'Pending Review',
  'submitted_on': 'Submitted',
  // quick shortcuts
  'cakna_app_title': 'Cakna App',
  'cakna_app_subtitle': "Al-Quran, Prayer Times, Al-Ma'thurat & Notes",
  'more': 'More',
  'policy_title': 'Policy & Guidelines',
  'policy_subtitle': 'Policies, SOPs, Guidelines & Manual',
  // footer
  'contact_us': 'Contact Us',
  // core detail sheet
  'program_header': 'PROGRAMS',
  'no_programs': 'No programs yet for this core.',
  // profile screen
  'profile': 'Profile',
  'franchisee': 'Franchisee',
  'account_info': 'ACCOUNT INFO',
  'login_tab': 'Log In',
  'register_tab': 'Register',
  'login_btn': 'Log In',
  'register_btn': 'Create Account',
  'email_label': 'Email',
  'email_hint': 'name@example.com',
  'password_label': 'Password',
  'confirm_pw_label': 'Confirm Password',
  'logout': 'Log Out',
  'loading': 'Loading...',
  'or_divider': 'or',
  'sso_btn': 'Continue with QCXIS',
  'pw_mismatch': 'Passwords do not match.',
  'copy_email': 'Copy email',
  'email_copied': 'Email copied',
};
