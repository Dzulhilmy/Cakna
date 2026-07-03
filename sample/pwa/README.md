# Nur Al-Quran — Pakej PWA

Mushaf digital 604 halaman (Madani) dengan tajwid berwarna, audio qari, terjemahan
BM / English / Indonesia, transliterasi rumi, waktu solat, kiblat, zikir & tasbih,
Asmaul Husna, doa pilihan, sasaran khatam, nota, sorotan dan mod uji hafazan.
Teks Al-Quran dibenam sepenuhnya — berfungsi luar talian.

## Kandungan pakej

    index.html                  Aplikasi penuh (teks Quran + 3 terjemahan + transliterasi dibenam)
    manifest.webmanifest        Manifest PWA (nama, ikon, warna tema, mod standalone)
    sw.js                       Service worker (cache cangkerang, font & audio)
    icons/icon-192.png          Ikon aplikasi 192×192
    icons/icon-512.png          Ikon aplikasi 512×512
    icons/icon-maskable-512.png Ikon maskable (Android adaptive)
    icons/icon-180.png          Ikon Apple touch (iOS)

## Cara terbitkan (deploy)

PWA mesti dihidangkan melalui HTTPS. Pilih mana-mana satu:

1. **Netlify / Vercel / Cloudflare Pages (percuma, paling mudah)**
   Seret keseluruhan folder ini ke papan pemuka — siap dalam seminit.
   Contoh hasil: https://nur-al-quran.netlify.app

2. **GitHub Pages**
   Muat naik folder ke repo, aktifkan Pages pada branch utama.

3. **Hos sendiri / cPanel (contoh: subdomain qcgroup.my)**
   Muat naik semua fail ke folder awam subdomain, contohnya
   https://quran.qcgroup.my — pastikan SSL aktif.

Ujian pantas di komputer sendiri (tanpa hos):

    cd folder-ini
    python3 -m http.server 8080
    # buka http://localhost:8080 (service worker berfungsi di localhost)

## Cara pengguna pasang ke telefon

* **Android (Chrome):** buka URL → muncul gesaan "Add to Home screen" /
  menu ⋮ → *Add to Home screen* → aplikasi terpasang dengan ikon,
  buka skrin penuh tanpa bar pelayar.
* **iPhone/iPad (Safari):** buka URL → butang Kongsi → *Add to Home Screen*.

Selepas dibuka sekali, teks Al-Quran, terjemahan dan semua modul berfungsi
**tanpa internet**. Font disimpan dalam cache selepas muatan pertama. Audio
qari distrim bila ada talian; ayat yang pernah dimainkan turut di-cache
(had 300 fail) supaya boleh diulang tanpa talian.

## Nota versi & kemas kini

* Nombor versi cache ada di baris pertama `sw.js` (`nur-al-quran-v1`).
  Setiap kali `index.html` dikemas kini, naikkan ke `v2`, `v3`, dst. —
  pengguna akan menerima toast "Versi baharu sedia" secara automatik.
* Fail ini juga boleh dibuka terus (dwiklik) tanpa hosting — semua ciri
  berfungsi kecuali pemasangan ke skrin utama dan cache service worker.

## Langkah seterusnya (pilihan)

* **Play Store / App Store:** bungkus URL PWA ini dengan TWA (Bubblewrap)
  untuk Android atau Capacitor untuk iOS — membolehkan notifikasi push
  waktu solat dan azan.
* **Domain jenama:** contoh quran.qcgroup.my atau nuralquran.my.

## Sumber data

* Teks Arab & terjemahan: Tanzil.net (melalui repo Kristories/quran) —
  Basmeih (BM), Sahih International (EN), Kemenag (ID)
* Transliterasi: risan/quran-json
* Peta halaman Mushaf Madani: MohamadHajjRabee/quran-qcf4
* Audio: cdn.islamic.network (Alafasy, Abdul Basit, Al-Husary)
* Waktu solat dikira secara astronomi (anggaran) — rujuk JAKIM/e-Solat
  untuk waktu muktamad.

— Dibangunkan untuk QC Group Sdn. Bhd.
