# Panduan TWA — Terbitkan Nur Al-Quran ke Google Play

TWA (Trusted Web Activity) membungkus PWA ini sebagai aplikasi Android sebenar
untuk Google Play — membolehkan notifikasi azan latar belakang penuh, ikon
di Play Store, dan kemas kini automatik (aplikasi sentiasa memuatkan versi
web terkini, tiada penghantaran semula APK untuk kemas kini kandungan).

## Prasyarat

1. PWA ini telah dihoskan di HTTPS (contoh: https://quran.qcgroup.my) — lihat README.md
2. Node.js 18+ dan JDK 17 dipasang
3. Akaun Google Play Console (yuran sekali RM~85 / USD25)

## Langkah 1 — Pasang Bubblewrap

    npm install -g @bubblewrap/cli

## Langkah 2 — Mulakan projek TWA

    mkdir nur-al-quran-twa && cd nur-al-quran-twa
    bubblewrap init --manifest https://quran.qcgroup.my/manifest.webmanifest

Jawab soalan wizard:
- Application name: Nur Al-Quran
- Package ID: my.qcgroup.nuralquran (format terbalik domain — kekal selamanya!)
- Signing key: benarkan Bubblewrap menjana keystore baharu.
  **SIMPAN fail keystore dan kata laluannya dengan selamat** — hilang = tidak
  boleh kemas kini aplikasi lagi.

## Langkah 3 — Bina

    bubblewrap build

Menghasilkan `app-release-signed.apk` (ujian) dan `app-release-bundle.aab`
(untuk Play Console).

## Langkah 4 — Digital Asset Links (WAJIB)

Supaya aplikasi buka penuh tanpa bar URL, Android perlu bukti anda memiliki
domain. Bubblewrap mencetak kandungan `assetlinks.json` selepas binaan
(atau jana semula: `bubblewrap fingerprint generateAssetLinks`).

Muat naik fail itu ke:

    https://quran.qcgroup.my/.well-known/assetlinks.json

(Untuk hosting folder statik: cipta folder `.well-known` dalam pakej PWA
dan letakkan fail di dalamnya.)

## Langkah 5 — Play Console

1. Cipta aplikasi baharu → muat naik `app-release-bundle.aab`
2. Lengkapkan: penerangan (BM & EN), tangkapan skrin telefon (min 2),
   ikon 512×512 (guna icons/icon-512.png), banner ciri 1024×500
3. Kategori: Lifestyle / Education · Rating kandungan: semua umur
4. Hantar untuk semakan (biasanya 1–7 hari)

## Notifikasi azan latar belakang (selepas TWA)

Aplikasi web ini sudah ada notifikasi azan **semasa aplikasi dibuka**
(togol dalam panel Waktu Solat). Untuk azan berbunyi walaupun aplikasi
tertutup, tambah selepas TWA stabil:

- **Pilihan mudah:** Firebase Cloud Messaging (FCM) + Cloud Function berjadual
  yang menghantar push mengikut zon waktu solat pengguna.
- **Pilihan penuh:** tukar pembungkus kepada **Capacitor** dan guna plugin
  `@capacitor/local-notifications` — notifikasi dijadualkan secara setempat
  pada peranti, tiada pelayan diperlukan. Laluan ini juga membuka pintu iOS
  App Store dengan asas kod yang sama.

## Kemas kini aplikasi selepas terbit

Kandungan web: cukup naik taraf fail di hosting + naikkan versi cache dalam
sw.js — pengguna terima automatik, tiada penghantaran Play Console.
Hanya perubahan pembungkus (ikon, nama, kebenaran) memerlukan
`bubblewrap update` + `bubblewrap build` + muat naik AAB baharu.

— Disediakan untuk QC Group Sdn. Bhd.
