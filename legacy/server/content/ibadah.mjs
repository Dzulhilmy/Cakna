/* Panduan Ibadah — authored (Shafi'i school, Malaysian practice); no source data in the legacy file.
   Shape reverse-engineered from route node 8:
     doc.sections = { wuduk|solat|tay|umrah|haji: [ {flag, desc_ms, desc_en, arabic?, quran_ref?}, ... ] }
                    flag 1 = rukun, 2 = wajib, 0 = sunat (hidden when "show sunnah" is off)
     doc.batal      = { ms:[...], en:[...] }          things that nullify wudu
     doc.rakaat     = [ [name, count], ... ]           obligatory-prayer unit counts
     doc.tawaf_ar   = [ {arabic, tajweed}, ... ]       istilam phrase
     doc.tawaf_doa  = [ {quran_ref:{surah,ayah_from,ayah_to}}, ... ]  one per tawaf circuit
     doc.ihram_ban  = { ms:[...], en:[...] }           ihram prohibitions
     doc.rukun_haji = { ms:[...], en:[...] }           pillars of hajj */

// title_ms/title_en = short heading (also the {#each} key, unique within a section);
// desc_ms/desc_en = the fuller explanation shown beneath.
const step = (flag, tMs, tEn, dMs, dEn) => ({ flag, title_ms: tMs, title_en: tEn, desc_ms: dMs, desc_en: dEn });

export function authorIbadah() {
  const wuduk = [
    step(1, 'Niat', 'Intention', 'Berniat di dalam hati ketika mula membasuh muka.', 'Intend in the heart when beginning to wash the face.'),
    step(1, 'Membasuh muka', 'Wash the face', 'Membasuh seluruh muka dari dahi ke dagu, dan telinga ke telinga.', 'Wash the whole face, forehead to chin and ear to ear.'),
    step(1, 'Membasuh tangan', 'Wash the arms', 'Membasuh kedua-dua tangan hingga ke siku.', 'Wash both arms up to the elbows.'),
    step(1, 'Menyapu kepala', 'Wipe the head', 'Menyapu sebahagian kepala dengan air.', 'Wipe part of the head with water.'),
    step(1, 'Membasuh kaki', 'Wash the feet', 'Membasuh kedua-dua kaki hingga ke buku lali.', 'Wash both feet up to the ankles.'),
    step(1, 'Tertib', 'In order', 'Melakukan rukun mengikut susunan di atas.', 'Perform the pillars in the sequence above.'),
    step(0, 'Bismillah', 'Bismillah', 'Membaca Bismillah sebelum mula berwuduk.', 'Say Bismillah before starting wudu.'),
    step(0, 'Membasuh tapak tangan', 'Wash the palms', 'Membasuh kedua-dua tapak tangan sebelum muka.', 'Wash both palms before the face.'),
    step(0, 'Berkumur', 'Rinse the mouth', 'Berkumur-kumur (madmadah).', 'Rinse the mouth (madmadah).'),
    step(0, 'Istinsyaq', 'Istinsyaq', 'Memasukkan air ke hidung lalu menghembuskannya.', 'Draw water into the nose then expel it.'),
    step(0, 'Menyapu telinga', 'Wipe the ears', 'Menyapu seluruh kepala dan kedua-dua telinga.', 'Wipe the whole head and both ears.'),
    step(0, 'Dahulukan yang kanan', 'Right side first', 'Mendahulukan anggota yang kanan.', 'Begin with the right side.'),
    step(0, 'Tiga kali', 'Three times', 'Mengulang setiap basuhan sebanyak tiga kali.', 'Repeat each washing three times.'),
    step(0, 'Doa selepas wuduk', 'Du\'a after wudu', 'Membaca doa selepas selesai berwuduk.', 'Recite the du\'a after completing wudu.'),
  ];

  const solat = [
    step(1, 'Niat', 'Intention', 'Berniat solat di dalam hati.', 'Intend the prayer in the heart.'),
    step(1, 'Takbiratul ihram', 'Opening takbir', 'Mengangkat takbir "Allahu Akbar" untuk memulakan solat.', 'Raise the takbir "Allahu Akbar" to begin the prayer.'),
    step(1, 'Berdiri', 'Standing', 'Berdiri betul bagi yang berkuasa.', 'Stand upright for those who are able.'),
    step(1, 'Membaca Al-Fatihah', 'Reciting Al-Fatihah', 'Membaca Surah Al-Fatihah pada setiap rakaat.', 'Recite Surah Al-Fatihah in every unit.'),
    step(1, 'Rukuk', 'Bowing', 'Rukuk serta tomakninah (berhenti seketika).', 'Bow (ruku\') with stillness.'),
    step(1, 'Iktidal', 'Rising', 'Bangun dari rukuk (iktidal) serta tomakninah.', 'Rise from ruku\' (i\'tidal) with stillness.'),
    step(1, 'Sujud', 'Prostration', 'Sujud dua kali serta tomakninah.', 'Prostrate twice with stillness.'),
    step(1, 'Duduk antara dua sujud', 'Sitting between sujud', 'Duduk antara dua sujud serta tomakninah.', 'Sit between the two prostrations with stillness.'),
    step(1, 'Duduk tahiyat akhir', 'Final sitting', 'Duduk untuk tahiyat akhir.', 'Sit for the final tashahhud.'),
    step(1, 'Tahiyat akhir', 'Final tashahhud', 'Membaca bacaan tahiyat akhir.', 'Recite the final tashahhud.'),
    step(1, 'Selawat', 'Salawat', 'Berselawat ke atas Nabi ﷺ dalam tahiyat akhir.', 'Send salawat upon the Prophet ﷺ in the final tashahhud.'),
    step(1, 'Salam', 'Salam', 'Memberi salam yang pertama.', 'Give the first salam.'),
    step(1, 'Tertib', 'In order', 'Melakukan rukun mengikut susunannya.', 'Perform the pillars in their sequence.'),
    step(0, 'Doa iftitah', 'Opening du\'a', 'Membaca doa iftitah selepas takbir.', 'Recite the opening du\'a after the takbir.'),
    step(0, 'Ta\'awwuz', 'Ta\'awwudh', 'Membaca ta\'awwuz sebelum Al-Fatihah.', 'Recite ta\'awwudh before Al-Fatihah.'),
    step(0, 'Membaca surah', 'Reciting a surah', 'Membaca surah selepas Al-Fatihah pada dua rakaat pertama.', 'Recite a surah after Al-Fatihah in the first two units.'),
    step(0, 'Mengangkat tangan', 'Raising the hands', 'Mengangkat tangan ketika takbir, rukuk dan iktidal.', 'Raise the hands at takbir, ruku\' and i\'tidal.'),
  ];

  const tay = [
    step(1, 'Niat', 'Intention', 'Berniat harus solat ketika menyapu muka.', 'Intend to permit prayer when wiping the face.'),
    step(1, 'Menyapu muka', 'Wipe the face', 'Menyapu seluruh muka dengan debu tanah yang suci.', 'Wipe the whole face with clean earth/dust.'),
    step(1, 'Menyapu tangan', 'Wipe the arms', 'Menyapu kedua-dua tangan hingga ke siku.', 'Wipe both arms up to the elbows.'),
    step(1, 'Tertib', 'In order', 'Tertib antara dua sapuan.', 'In order between the two wipings.'),
    step(0, 'Bismillah', 'Bismillah', 'Membaca Bismillah sebelum mula.', 'Say Bismillah before starting.'),
    step(0, 'Dahulukan yang kanan', 'Right side first', 'Mendahulukan anggota yang kanan.', 'Begin with the right side.'),
    step(0, 'Sekali tepuk', 'One strike', 'Menepuk debu sekali untuk muka dan sekali untuk tangan.', 'One strike of dust for the face and one for the hands.'),
  ];

  const umrah = [
    step(1, 'Ihram', 'Ihram', 'Berniat umrah dan berihram dari miqat.', 'Intend umrah and enter ihram from the miqat.'),
    step(1, 'Tawaf', 'Tawaf', 'Tawaf tujuh pusingan mengelilingi Kaabah.', 'Seven circuits around the Ka\'bah.'),
    step(1, 'Sa\'ie', 'Sa\'i', 'Sa\'ie tujuh perjalanan antara Safa dan Marwah.', 'Seven laps between Safa and Marwah.'),
    step(1, 'Tahallul', 'Tahallul', 'Bercukur atau bergunting rambut.', 'Shave or trim the hair.'),
    step(1, 'Tertib', 'In order', 'Mengikut susunan rukun di atas.', 'Following the sequence of pillars above.'),
    step(0, 'Mandi & wangian', 'Bath & scent', 'Mandi sunat dan memakai wangian sebelum ihram.', 'Recommended bath and scent before ihram.'),
    step(0, 'Talbiah', 'Talbiyah', 'Bertalbiah sepanjang perjalanan.', 'Recite the talbiyah throughout.'),
    step(0, 'Solat di Maqam Ibrahim', 'Prayer at Maqam Ibrahim', 'Solat sunat dua rakaat di belakang Maqam Ibrahim.', 'Two-unit prayer behind Maqam Ibrahim.'),
  ];

  const haji = [
    step(1, 'Ihram', 'Ihram', 'Berniat haji dan berihram dari miqat.', 'Intend hajj and enter ihram from the miqat.'),
    step(1, 'Wukuf di Arafah', 'Standing at Arafah', 'Wukuf di Arafah pada 9 Zulhijjah.', 'Stand (wuquf) at Arafah on the 9th of Dhul-Hijjah.'),
    step(1, 'Tawaf ifadah', 'Tawaf al-ifadah', 'Tawaf ifadah mengelilingi Kaabah.', 'Tawaf al-ifadah around the Ka\'bah.'),
    step(1, 'Sa\'ie', 'Sa\'i', 'Sa\'ie antara Safa dan Marwah.', 'Sa\'i between Safa and Marwah.'),
    step(1, 'Tahallul', 'Tahallul', 'Bercukur atau bergunting rambut.', 'Shave or trim the hair.'),
    step(1, 'Tertib', 'In order', 'Tertib pada kebanyakan rukun.', 'In order for most of the pillars.'),
    step(2, 'Mabit di Muzdalifah', 'Mabit at Muzdalifah', 'Bermalam (mabit) di Muzdalifah.', 'Stay overnight (mabit) at Muzdalifah.'),
    step(2, 'Mabit di Mina', 'Mabit at Mina', 'Bermalam di Mina pada hari-hari Tasyrik.', 'Stay overnight at Mina during the days of Tashriq.'),
    step(2, 'Melontar jamrah', 'Stoning the jamarat', 'Melontar jamrah mengikut hari yang ditetapkan.', 'Stone the jamarat on the appointed days.'),
    step(0, 'Tawaf wida\'', 'Farewell tawaf', 'Tawaf selamat tinggal sebelum meninggalkan Makkah.', 'Farewell tawaf before leaving Makkah.'),
  ];

  const batal = {
    ms: [
      'Keluar sesuatu dari qubul atau dubur (air kencing, tahi, angin dsb).',
      'Hilang akal kerana tidur nyenyak, mabuk, gila atau pengsan.',
      'Bersentuh kulit lelaki dan perempuan yang bukan mahram tanpa lapik.',
      'Menyentuh kemaluan sendiri atau orang lain dengan tapak tangan.',
    ],
    en: [
      'Anything exiting the private parts (urine, stool, wind, etc.).',
      'Loss of consciousness through deep sleep, intoxication, insanity or fainting.',
      'Skin contact between a man and a non-mahram woman without a barrier.',
      'Touching the private parts with the palm of the hand.',
    ],
  };

  const rakaat = [
    ['Subuh', 2], ['Zohor', 4], ['Asar', 4], ['Maghrib', 3], ['Isyak', 4],
  ];

  const tawaf_ar = [
    { arabic: 'بِسْمِ اللَّهِ وَاللَّهُ أَكْبَرُ', tajweed: [] },
  ];

  // one suggested Quranic du'a per circuit (istilam at the Black Stone corner begins each round)
  const tawaf_doa = [
    { quran_ref: { surah: 2, ayah_from: 201, ayah_to: 201 } },
    { quran_ref: { surah: 2, ayah_from: 127, ayah_to: 127 } },
    { quran_ref: { surah: 2, ayah_from: 128, ayah_to: 128 } },
    { quran_ref: { surah: 3, ayah_from: 8, ayah_to: 8 } },
    { quran_ref: { surah: 3, ayah_from: 16, ayah_to: 16 } },
    { quran_ref: { surah: 2, ayah_from: 250, ayah_to: 250 } },
    { quran_ref: { surah: 2, ayah_from: 286, ayah_to: 286 } },
  ];

  const ihram_ban = {
    ms: [
      'Memakai pakaian berjahit (bagi lelaki).',
      'Menutup kepala bagi lelaki; menutup muka dan dua tapak tangan bagi perempuan.',
      'Memakai wangian pada badan atau pakaian.',
      'Memotong kuku, mencabut atau mencukur rambut/bulu.',
      'Memburu atau membunuh binatang buruan darat.',
      'Berkahwin, mengahwinkan atau meminang.',
      'Bersetubuh dan segala yang mendorong kepadanya.',
      'Bertengkar, mengumpat atau melakukan maksiat.',
    ],
    en: [
      'Wearing sewn/tailored garments (for men).',
      'Covering the head for men; covering the face and hands for women.',
      'Applying perfume to the body or clothing.',
      'Cutting nails or removing/shaving hair.',
      'Hunting or killing land game.',
      'Marrying, conducting a marriage, or proposing.',
      'Sexual intercourse and anything leading to it.',
      'Quarrelling, backbiting, or committing sins.',
    ],
  };

  const rukun_haji = {
    ms: [
      'Ihram (berniat memulakan haji).',
      'Wukuf di Arafah.',
      'Tawaf ifadah.',
      'Sa\'ie antara Safa dan Marwah.',
      'Bercukur atau bergunting rambut.',
      'Tertib pada kebanyakan rukun.',
    ],
    en: [
      'Ihram (intending to begin hajj).',
      'Standing at Arafah (wuquf).',
      'Tawaf al-ifadah.',
      'Sa\'i between Safa and Marwah.',
      'Shaving or trimming the hair.',
      'Observing the order of most pillars.',
    ],
  };

  return {
    sections: { wuduk, solat, tay, umrah, haji },
    batal, rakaat, tawaf_ar, tawaf_doa, ihram_ban, rukun_haji,
  };
}
