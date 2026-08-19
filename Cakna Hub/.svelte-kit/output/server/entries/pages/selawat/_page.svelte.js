import { i as head, e as escape_html, d as ensure_array_like, f as attr_class, h as derived } from "../../../chunks/index.js";
import { b as settings, S as SideNav } from "../../../chunks/SideNav.js";
import { C as Chevron_left } from "../../../chunks/chevron-left.js";
const SELAWAT_NABI = [
  {
    id: 1,
    jenis: "ulang",
    baris: [
      { ar: "صَلَّى اللَّهُ عَلَى مُحَمَّد", ms: "Allah bersolawat ke atas Muhammad", en: "Allah sends blessings upon Muhammad" },
      { ar: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", ms: "Allah bersolawat dan salam ke atasnya", en: "May Allah bless him and grant him peace" }
    ]
  },
  {
    id: 2,
    jenis: "ulang",
    baris: [
      { ar: "صَلَّى اللَّهُ عَلَى مُحَمَّد", ms: "Allah bersolawat ke atas Muhammad", en: "Allah sends blessings upon Muhammad" },
      { ar: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", ms: "Allah bersolawat dan salam ke atasnya", en: "May Allah bless him and grant him peace" }
    ]
  },
  {
    id: 3,
    jenis: "bait",
    baris: [
      { ar: "يَا نَبِيُّ سَلَامٌ عَلَيْكَ", ms: "Wahai Nabi salam ke atasmu", en: "O Prophet, peace be upon you" },
      { ar: "يَا رَسُولُ سَلَامٌ عَلَيْكَ", ms: "Wahai Rasul salam ke atasmu", en: "O Messenger, peace be upon you" }
    ]
  },
  {
    id: 4,
    jenis: "bait",
    baris: [
      { ar: "يَاحَبِيبُ سَلَامٌ عَلَيْكَ", ms: "Wahai kekasih salam ke atasmu", en: "O Beloved, peace be upon you" },
      { ar: "صَلَوَاتُ اللَّهِ عَلَيْكَ", ms: "Solawat (rahmat) Allah ke atasmu", en: "Allah's blessings be upon you" }
    ]
  },
  {
    id: 5,
    jenis: "bait",
    baris: [
      { ar: "أَشْرَقَ الْبَدْرُ عَلَيْنَا", ms: "Bulan purnama terbit menyinari kita", en: "The full moon has risen over us" },
      { ar: "فَاخْتَفَتْ مِنْهُ الْبُدُورُ", ms: "Hilang lenyap segala cahaya", en: "And all other moons have faded away" }
    ]
  },
  {
    id: 6,
    jenis: "bait",
    baris: [
      { ar: "مِثْلَ حُسْنِكَ مَا رَأَيْنَا", ms: "Seperti keindahanmu tak pernah kami lihat", en: "Never have we seen such beauty as yours" },
      { ar: "قَطُّ يَا وَجْهَ السُّرُورِ", ms: "Selamanya wahai wajah yang gembira", en: "O face of joy, never before" }
    ]
  },
  {
    id: 7,
    jenis: "bait",
    baris: [
      { ar: "أَنْتَ شَمْسٌ أَنْتَ بَدْرٌ", ms: "Kaulah matahari, kaulah rembulan", en: "You are the sun, you are the moon" },
      { ar: "أَنْتَ نُورٌ فَوْقَ نُورٍ", ms: "Kau cahaya mengatasi cahaya", en: "You are a light above all light" }
    ]
  },
  {
    id: 8,
    jenis: "bait",
    baris: [
      { ar: "أَنْتَ إِكْسِيرٌ وَغَالِي", ms: "Kaulah rahsia hidup mulia dan bernilai", en: "You are the elixir and the precious one" },
      { ar: "أَنْتَ مِصْبَاحُ الصُّدُورِ", ms: "Kaulah obor penyuluh jiwa", en: "You are the lamp that lights the hearts" }
    ]
  },
  {
    id: 9,
    jenis: "bait",
    baris: [
      { ar: "يَا حَبِيبِي يَا مُحَمَّد", ms: "Wahai kekasihku wahai Muhammad", en: "O my beloved, O Muhammad" },
      { ar: "يَاعَرُوسَ الْخَافِقَيْنِ", ms: "Wahai pengantin indah sejagat", en: "O groom of the two horizons" }
    ]
  },
  {
    id: 10,
    jenis: "bait",
    baris: [
      { ar: "يَا مُؤَيَّدٌ يَا مُمَجَّدٌ", ms: "Wahai Nabi yang dijulang puja", en: "O the supported, O the glorified" },
      { ar: "يَا إِمَامَ الْقِبْلَتَيْنِ", ms: "Wahai imam dua kiblat", en: "O imam of the two qiblas" }
    ]
  },
  {
    id: 11,
    jenis: "bait",
    baris: [
      { ar: "يَا كَرِيمَ الْوَالِدَيْنِ", ms: "Wahai penghulu keturunan mulia", en: "O noble of noble parentage" },
      { ar: "مَن رَأَى وَجْهَكَ يَسْعَد", ms: "Bahagialah orang memandang wajahmu", en: "Whoever sees your face finds happiness" }
    ]
  },
  {
    id: 12,
    jenis: "bait",
    baris: [
      { ar: "وَرِدْنَا يَوْمَ النُّشُورِ", ms: "Kunjungi kami pada hari akhirat", en: "Grant us your intercession on the Day of Resurrection" },
      { ar: "حَوْضُكَ الصَّافِي الْمُبَرَّدِ", ms: "Kolam airmu sejuk jernih", en: "From your pool, clear and cool" }
    ]
  },
  {
    id: 13,
    jenis: "bait",
    baris: [
      { ar: "بِالسُّرَى إِلَّا إِلَيْكَ", ms: "Tiada terhenti rindukan selain kepadamu", en: "In the night journey, none but towards you" },
      { ar: "مَا رَأَيْنَا الْعِيسَ حَنَّتْ", ms: "Sepanjang malam unta berjalan rindukan", en: "The camels yearning throughout the night" }
    ]
  },
  {
    id: 14,
    jenis: "bait",
    baris: [
      { ar: "وَالْمَلَا صَلُّوا عَلَيْكَ", ms: "Dan para Malaikat turut berselawat", en: "And the angels also send blessings upon you" },
      { ar: "وَالْغَمَامَةُ قَدْ أَظَلَّتْ", ms: "Engkau dipayungi awan putih", en: "As the cloud provided you shade" }
    ]
  },
  {
    id: 15,
    jenis: "bait",
    baris: [
      { ar: "مُسْتَجِيبُ الدَّعَوَاتِ", ms: "Dialah yang menyahut semua seruan", en: "The One who answers all supplications" },
      { ar: "عَالِمُ السِّرِّ وَأَخْفَى", ms: "Allah mengetahui rahsia yang tersembunyi", en: "The Knower of secrets and what is more hidden" }
    ]
  },
  {
    id: 16,
    jenis: "bait",
    baris: [
      { ar: "بِجَمِيعِ الصَّالِحَاتِ", ms: "Dengan segala amalan soleh", en: "With all righteous deeds" },
      { ar: "رَبِّ إِرْحَمْنَا جَمِيعًا", ms: "Wahai Tuhan, rahmatilah kami semua", en: "O Lord, have mercy upon all of us" }
    ]
  },
  {
    id: 17,
    jenis: "bait",
    baris: [
      { ar: "عَدَّ تَحْرِيرِ السُّطُورِ", ms: "Sebanyak baris kertas yang ditulis", en: "As many as the lines of writing" },
      { ar: "وَصَلَاةُ اللَّهِ عَلَى أَحْمَد", ms: "Dan selawat Allah ke atas Ahmad", en: "And Allah's blessings upon Ahmad" }
    ]
  },
  {
    id: 18,
    jenis: "bait",
    baris: [
      { ar: "صَاحِبُ الْوَجْهِ الْمُنِيرِ", ms: "Empunya wajah berseri menawan", en: "The owner of the radiant, beautiful face" },
      { ar: "أَحْمَدُ الْهَادِي مُحَمَّدٌ", ms: "Ahmad Muhammad petunjuk jalan", en: "Ahmad, the Guide, Muhammad" }
    ]
  },
  {
    id: 19,
    jenis: "ulang",
    baris: [
      { ar: "صَلَّى اللَّهُ عَلَى مُحَمَّد", ms: "Selawat Allah ke atas Muhammad", en: "Allah sends blessings upon Muhammad" },
      { ar: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", ms: "Selawat salam dipohon lagi", en: "May Allah bless him and grant him peace" }
    ]
  },
  {
    id: 20,
    jenis: "ulang",
    baris: [
      { ar: "صَلَّى اللَّهُ عَلَى مُحَمَّد", ms: "Selawat Allah ke atas Muhammad", en: "Allah sends blessings upon Muhammad" },
      { ar: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", ms: "Selawat salam dipohon lagi", en: "May Allah bless him and grant him peace" }
    ]
  },
  {
    id: 21,
    jenis: "penutup",
    baris: [
      {
        ar: "اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَيْهِ",
        ms: "Wahai Tuhan, selawat, salam dan keberkatan atasnya",
        en: "O Allah, bestow blessings, peace and grace upon him"
      }
    ]
  }
];
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let lang = derived(() => settings.value.uiLang === "en" ? "en" : "ms");
    const openingRefrain = SELAWAT_NABI[0];
    const displayList = (() => {
      const out = [];
      let baitCount = 0;
      const visible = SELAWAT_NABI.filter((b) => b.id <= 10 || b.id >= 19);
      for (let i = 0; i < visible.length; i++) {
        const bait = visible[i];
        out.push({ ...bait, key: String(bait.id) });
        if (bait.jenis === "bait") {
          baitCount++;
          if (baitCount % 2 === 0 && visible[i + 1]?.jenis === "bait") {
            out.push({ ...openingRefrain, key: `chorus-${baitCount}a` });
            out.push({ ...openingRefrain, key: `chorus-${baitCount}b` });
          }
        }
      }
      return out;
    })();
    head("zpwq6y", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Selawat Nabi — Cakna</title>`);
      });
    });
    $$renderer2.push(`<div class="sl-root svelte-zpwq6y"><header class="sl-header svelte-zpwq6y"><a href="https://cakna.org/hub" class="hdr-btn svelte-zpwq6y">`);
    Chevron_left($$renderer2, { size: 20 });
    $$renderer2.push(`<!----></a> <div class="hdr-center svelte-zpwq6y"><span class="hdr-title svelte-zpwq6y">Selawat Nabi</span> <span class="hdr-sub svelte-zpwq6y">Selawat Ashraqal Badr</span></div> <button class="lang-btn svelte-zpwq6y" aria-label="Toggle language">${escape_html(settings.value.uiLang === "en" ? "EN" : "MS")}</button></header> <main class="sl-main svelte-zpwq6y"><div class="sl-intro svelte-zpwq6y"><p class="sl-eyebrow svelte-zpwq6y">Cakna · Selawat</p> <h1 class="sl-arab-title svelte-zpwq6y">صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ</h1> <p class="sl-sub-text svelte-zpwq6y">Ashraqal Badr · 21 rangkap</p></div> <div class="sl-senarai svelte-zpwq6y"><!--[-->`);
    const each_array = ensure_array_like(displayList);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let bait = each_array[$$index_1];
      $$renderer2.push(`<div${attr_class("bait-card svelte-zpwq6y", void 0, {
        "card-ulang": bait.jenis === "ulang",
        "card-penutup": bait.jenis === "penutup"
      })}><!--[-->`);
      const each_array_1 = ensure_array_like(bait.baris);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let baris = each_array_1[$$index];
        $$renderer2.push(`<div class="baris-wrap svelte-zpwq6y"><p class="ar-text svelte-zpwq6y" dir="rtl">${escape_html(baris.ar)}</p> <p class="trans-text svelte-zpwq6y">${escape_html(lang() === "en" ? baris.en : baris.ms)}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <p class="sl-nota svelte-zpwq6y">${escape_html(lang() === "en" ? "Recite with sincerity and love for the Prophet ﷺ" : "Bacalah dengan tulus dan kasih sayang kepada Nabi ﷺ")}</p></main></div> `);
    SideNav($$renderer2, { active: "selawat" });
    $$renderer2.push(`<!---->`);
  });
}
export {
  _page as default
};
