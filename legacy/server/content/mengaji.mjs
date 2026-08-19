/* Asas Mengaji (iqra'/muqaddam basics) — authored; no source data existed in the legacy file.
   Shape reverse-engineered from route node 11:
     doc.hija     = [[glyph, name], ...]            (28 hijaiyah letters; quiz skips index 27)
     doc.mg_sound = [roman, ...]                    (base consonant sound, parallel to hija)
     doc.hrk3     = [[mark, roman], ...]            (the 3 vowel marks used by the quiz)
     doc.harakat  = [[mark, name, sound, note], ...] (the "baris" teaching list) */
export function authorMengaji() {
  const hija = [
    ['ا', 'Alif'], ['ب', 'Ba'], ['ت', 'Ta'], ['ث', 'Tsa'], ['ج', 'Jim'], ['ح', 'Ha'], ['خ', 'Kha'],
    ['د', 'Dal'], ['ذ', 'Zal'], ['ر', 'Ra'], ['ز', 'Zai'], ['س', 'Sin'], ['ش', 'Syin'], ['ص', 'Sod'],
    ['ض', 'Dod'], ['ط', 'To'], ['ظ', 'Zo'], ['ع', 'Ain'], ['غ', 'Ghain'], ['ف', 'Fa'], ['ق', 'Qof'],
    ['ك', 'Kaf'], ['ل', 'Lam'], ['م', 'Mim'], ['ن', 'Nun'], ['و', 'Wau'], ['ه', 'Ha'], ['ي', 'Ya'],
  ];
  // distinct romanisations so the quiz's answer/distractor options never collide
  const mg_sound = [
    'a', 'b', 't', 'ts', 'j', 'ha', 'kh', 'd', 'dz', 'r', 'z', 's', 'sy', 'sh',
    'dh', 'th', 'zh', "'a", 'gh', 'f', 'q', 'k', 'l', 'm', 'n', 'w', 'h', 'y',
  ];
  const hrk3 = [['َ', 'a'], ['ِ', 'i'], ['ُ', 'u']];
  const harakat = [
    ['َ', 'Fathah (baris atas)', "bunyi 'a' — بَ = ba", "Fathah — the short vowel 'a'"],
    ['ِ', 'Kasrah (baris bawah)', "bunyi 'i' — بِ = bi", "Kasrah — the short vowel 'i'"],
    ['ُ', 'Dammah (baris hadapan)', "bunyi 'u' — بُ = bu", "Dammah — the short vowel 'u'"],
    ['ً', 'Fathatain (dua di atas)', "bunyi 'an' — بً = ban", "Fathatain — the 'an' ending"],
    ['ٍ', 'Kasratain (dua di bawah)', "bunyi 'in' — بٍ = bin", "Kasratain — the 'in' ending"],
    ['ٌ', 'Dammatain (dua di hadapan)', "bunyi 'un' — بٌ = bun", "Dammatain — the 'un' ending"],
    ['ْ', 'Sukun (tanda mati)', 'huruf mati — بْ', 'Sukun — a silent (vowel-less) letter'],
    ['ّ', 'Syaddah (sabdu)', 'huruf disabdukan — بّ', 'Shaddah — the letter is doubled'],
  ];
  return { hija, mg_sound, hrk3, harakat };
}
