// Data induk Al-Ma'thurat — Wazifah Sughra (32) & Kubra (46), susunan Kubra.
// Sumber: modul AlMathurat.jsx (teks Quran disahkan terhadap api.quran.com
// skrip imla'i pada 2026-07-10). Doa lidah basah berzikir & Doa Rabitah
// dibaca PENUH dalam kedua-dua versi (maklum balas pengguna, rujuk kitab).
// reps: { s: ulangan Sughra (null = tiada dalam Sughra), k: ulangan Kubra }.
// arK/bmK/biK/rumiK: teks khusus Kubra jika berbeza. Medan boleh jadi
// { pagi, petang } untuk varian waktu.

export type Waktu = 'pagi' | 'petang';
export type TeksWaktu = string | { pagi: string; petang: string };

export interface MathuratMasterItem {
	reps: { s: number | null; k: number };
	jenis: 'quran' | 'zikir' | 'doa';
	tajuk: string;
	info: string;
	basmalah?: boolean;
	ar: TeksWaktu;
	bm: TeksWaktu;
	bi: TeksWaktu;
	rumi: TeksWaktu;
	arK?: TeksWaktu;
	bmK?: TeksWaktu;
	biK?: TeksWaktu;
	rumiK?: TeksWaktu;
}

export const MASTER: MathuratMasterItem[] = [
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Surah Al-Fatihah",
		"bi": "In the name of Allah, the Most Gracious, the Most Merciful. All praise is for Allah, Lord of all the worlds. The Most Gracious, the Most Merciful. Master of the Day of Judgement. You alone we worship, and You alone we ask for help. Guide us along the straight path — the path of those You have blessed, not of those who have earned Your anger, nor of those who have gone astray.",
		"info": "Ummul-Kitab, surah agung pembuka al-Quran yang wajib dibaca dalam setiap rakaat solat. Menjadi pembuka wirid sebagai pujian dan permohonan hidayah.",
		"rumi": "Bismillahir-rahmanir-rahim. Alhamdu lillahi rabbil-'alamin. Ar-rahmanir-rahim. Maliki yaumid-din. Iyyaka na'budu wa iyyaka nasta'in. Ihdinas-siratal-mustaqim. Siratal-lazina an'amta 'alaihim, ghairil-maghdubi 'alaihim wa lad-dallin.",
		"basmalah": false,
		"ar": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ﴿١﴾ ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ ﴿٢﴾ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ﴿٣﴾ مَـٰلِكِ يَوْمِ ٱلدِّينِ ﴿٤﴾ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾ ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ ﴿٦﴾ صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ ﴿٧﴾",
		"bm": "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang. Segala puji bagi Allah, Tuhan sekalian alam. Yang Maha Pemurah lagi Maha Penyayang. Yang Menguasai hari pembalasan. Engkau sahaja yang kami sembah dan kepada Engkau sahaja kami memohon pertolongan. Tunjukkanlah kami jalan yang lurus, iaitu jalan orang yang Engkau kurniakan nikmat, bukan jalan mereka yang dimurkai dan bukan pula jalan mereka yang sesat."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Baqarah 1–5",
		"bi": "Alif, Lam, Mim. This is the Book in which there is no doubt, a guidance for the God-conscious — those who believe in the unseen, establish prayer, and spend out of what We have provided for them; and who believe in what has been revealed to you and what was revealed before you, and are certain of the Hereafter. It is they who are upon guidance from their Lord, and it is they who are successful.",
		"info": "Ayat-ayat awal Surah al-Baqarah tentang sifat orang bertakwa. Rumah yang dibacakan Surah al-Baqarah tidak dimasuki syaitan (riwayat Muslim).",
		"rumi": "Alif-lam-mim. Zalikal-kitabu la raiba fih, hudal-lil-muttaqin. Al-lazina yu'minuna bil-ghaibi wa yuqimunas-salata wa mimma razaqnahum yunfiqun. Wal-lazina yu'minuna bima unzila ilaika wa ma unzila min qablika wa bil-akhirati hum yuqinun. Ula'ika 'ala hudam-mir-rabbihim wa ula'ika humul-muflihun.",
		"ar": "الٓمٓ ﴿١﴾ ذَٰلِكَ ٱلْكِتَـٰبُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ﴿٢﴾ ٱلَّذِينَ يُؤْمِنُونَ بِٱلْغَيْبِ وَيُقِيمُونَ ٱلصَّلَوٰةَ وَمِمَّا رَزَقْنَـٰهُمْ يُنفِقُونَ ﴿٣﴾ وَٱلَّذِينَ يُؤْمِنُونَ بِمَآ أُنزِلَ إِلَيْكَ وَمَآ أُنزِلَ مِن قَبْلِكَ وَبِٱلْـَٔاخِرَةِ هُمْ يُوقِنُونَ ﴿٤﴾ أُو۟لَـٰٓئِكَ عَلَىٰ هُدًۭى مِّن رَّبِّهِمْ ۖ وَأُو۟لَـٰٓئِكَ هُمُ ٱلْمُفْلِحُونَ ﴿٥﴾",
		"bm": "Alif, Lam, Mim. Kitab ini tiada keraguan padanya; petunjuk bagi orang yang bertakwa — mereka yang beriman kepada perkara ghaib, mendirikan solat dan menginfakkan sebahagian rezeki yang Kami kurniakan. Dan mereka yang beriman kepada apa yang diturunkan kepadamu dan sebelummu, serta yakin akan hari akhirat. Merekalah yang berada atas petunjuk daripada Tuhan mereka, dan merekalah orang yang berjaya."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Ayat Kursi (Al-Baqarah 255)",
		"bi": "Allah — there is no god but Him, the Ever-Living, the Sustainer of all. Neither drowsiness nor sleep overtakes Him. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what is behind them, while they encompass nothing of His knowledge except what He wills. His Kursi extends over the heavens and the earth, and preserving them does not weary Him. And He is the Most High, the Most Great.",
		"info": "Ayat paling agung dalam al-Quran (riwayat Muslim). Sesiapa membacanya pada waktu pagi, dia dipelihara hingga petang; dan sesiapa membacanya pada waktu petang, dia dipelihara hingga pagi (riwayat al-Hakim).",
		"rumi": "Allahu la ilaha illa huwal-haiyul-qaiyum. La ta'khuzuhu sinatuw-wa la naum. Lahu ma fis-samawati wa ma fil-ard. Man zal-lazi yasyfa'u 'indahu illa bi-iznih. Ya'lamu ma baina aidihim wa ma khalfahum, wa la yuhituna bisyai'im-min 'ilmihi illa bima sya'. Wasi'a kursiyyuhus-samawati wal-ard, wa la ya'uduhu hifzuhuma, wa huwal-'aliyyul-'azim.",
		"ar": "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ۚ لَا تَأْخُذُهُۥ سِنَةٌۭ وَلَا نَوْمٌۭ ۚ لَّهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ مَن ذَا ٱلَّذِى يَشْفَعُ عِندَهُۥٓ إِلَّا بِإِذْنِهِۦ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَىْءٍۢ مِّنْ عِلْمِهِۦٓ إِلَّا بِمَا شَآءَ ۚ وَسِعَ كُرْسِيُّهُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضَ ۖ وَلَا يَـُٔودُهُۥ حِفْظُهُمَا ۚ وَهُوَ ٱلْعَلِىُّ ٱلْعَظِيمُ ﴿٢٥٥﴾",
		"bm": "Allah, tiada tuhan melainkan Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri. Dia tidak mengantuk dan tidak tidur. Milik-Nya segala yang di langit dan di bumi. Siapakah yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya? Dia mengetahui apa yang di hadapan dan di belakang mereka, sedang mereka tidak meliputi sedikit pun ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi, dan Dia tidak berasa berat memelihara kedua-duanya. Dialah Yang Maha Tinggi lagi Maha Agung."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Baqarah 256",
		"bi": "There is no compulsion in religion; true guidance has become distinct from error. So whoever rejects false gods and believes in Allah has grasped the firmest handhold that will never break. And Allah is All-Hearing, All-Knowing.",
		"info": "Ayat selepas Ayat Kursi: sesiapa beriman kepada Allah telah berpegang pada simpulan tali yang tidak akan putus.",
		"rumi": "La ikraha fid-din, qat-tabaiyanar-rusydu minal-ghaiy. Famay-yakfur bit-taghuti wa yu'mim billahi faqadis-tamsaka bil-'urwatil-wusqa lan-fisama laha. Wallahu sami'un 'alim.",
		"ar": "لَآ إِكْرَاهَ فِى ٱلدِّينِ ۖ قَد تَّبَيَّنَ ٱلرُّشْدُ مِنَ ٱلْغَىِّ ۚ فَمَن يَكْفُرْ بِٱلطَّـٰغُوتِ وَيُؤْمِنۢ بِٱللَّهِ فَقَدِ ٱسْتَمْسَكَ بِٱلْعُرْوَةِ ٱلْوُثْقَىٰ لَا ٱنفِصَامَ لَهَا ۗ وَٱللَّهُ سَمِيعٌ عَلِيمٌ ﴿٢٥٦﴾",
		"bm": "Tiada paksaan dalam agama; sesungguhnya telah nyata kebenaran daripada kesesatan. Maka sesiapa yang mengingkari taghut dan beriman kepada Allah, dia telah berpegang pada simpulan tali yang teguh yang tidak akan putus. Dan Allah Maha Mendengar lagi Maha Mengetahui."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Baqarah 257",
		"bi": "Allah is the Protector of those who believe; He brings them out of darkness into light. As for those who disbelieve, their protectors are false gods who take them out of light into darkness. Those are the companions of the Fire; they will abide therein forever.",
		"info": "Janji Allah sebagai Pelindung orang beriman, mengeluarkan mereka daripada kegelapan kepada cahaya.",
		"rumi": "Allahu waliyyul-lazina amanu yukhrijuhum minaz-zulumati ilan-nur. Wal-lazina kafaru auliya'uhumut-taghutu yukhrijunahum minan-nuri ilaz-zulumat. Ula'ika ashabun-nar, hum fiha khalidun.",
		"ar": "ٱللَّهُ وَلِىُّ ٱلَّذِينَ ءَامَنُوا۟ يُخْرِجُهُم مِّنَ ٱلظُّلُمَـٰتِ إِلَى ٱلنُّورِ ۖ وَٱلَّذِينَ كَفَرُوٓا۟ أَوْلِيَآؤُهُمُ ٱلطَّـٰغُوتُ يُخْرِجُونَهُم مِّنَ ٱلنُّورِ إِلَى ٱلظُّلُمَـٰتِ ۗ أُو۟لَـٰٓئِكَ أَصْحَـٰبُ ٱلنَّارِ ۖ هُمْ فِيهَا خَـٰلِدُونَ ﴿٢٥٧﴾",
		"bm": "Allah Pelindung orang yang beriman; Dia mengeluarkan mereka daripada kegelapan kepada cahaya. Manakala orang yang kafir, pelindung mereka ialah taghut yang mengeluarkan mereka daripada cahaya kepada kegelapan. Merekalah ahli neraka; mereka kekal di dalamnya."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Baqarah 284",
		"bi": "To Allah belongs whatever is in the heavens and whatever is on the earth. Whether you reveal what is within yourselves or conceal it, Allah will bring you to account for it. Then He forgives whom He wills and punishes whom He wills, and Allah is Able to do all things.",
		"info": "Permulaan tiga ayat penutup Surah al-Baqarah tentang keluasan milik dan hisab Allah.",
		"rumi": "Lillahi ma fis-samawati wa ma fil-ard. Wa in tubdu ma fi anfusikum au tukhfuhu yuhasibkum bihillah. Fayaghfiru limay-yasya'u wa yu'azzibu may-yasya'. Wallahu 'ala kulli syai'in qadir.",
		"ar": "لِّلَّهِ مَا فِى ٱلسَّمَـٰوَٰتِ وَمَا فِى ٱلْأَرْضِ ۗ وَإِن تُبْدُوا۟ مَا فِىٓ أَنفُسِكُمْ أَوْ تُخْفُوهُ يُحَاسِبْكُم بِهِ ٱللَّهُ ۖ فَيَغْفِرُ لِمَن يَشَآءُ وَيُعَذِّبُ مَن يَشَآءُ ۗ وَٱللَّهُ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ ﴿٢٨٤﴾",
		"bm": "Milik Allah segala yang di langit dan di bumi. Sama ada kamu zahirkan apa yang dalam diri kamu atau kamu sembunyikannya, Allah akan menghisab kamu dengannya; lalu Dia mengampuni sesiapa yang Dia kehendaki dan mengazab sesiapa yang Dia kehendaki. Dan Allah Maha Berkuasa atas segala sesuatu."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Baqarah 285",
		"bi": "The Messenger believes in what has been sent down to him from his Lord, and so do the believers. All of them believe in Allah, His angels, His Books and His Messengers: 'We make no distinction between any of His Messengers.' And they say: 'We hear and we obey. Grant us Your forgiveness, our Lord; to You is the final return.'",
		"info": "Sesiapa membaca dua ayat terakhir Surah al-Baqarah pada waktu malam, ia mencukupinya (riwayat al-Bukhari dan Muslim).",
		"rumi": "Amanar-rasulu bima unzila ilaihi mir-rabbihi wal-mu'minun. Kullun amana billahi wa mala'ikatihi wa kutubihi wa rusulih, la nufarriqu baina ahadim-mir-rusulih. Wa qalu sami'na wa ata'na, ghufranaka rabbana wa ilaikal-masir.",
		"ar": "ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيْهِ مِن رَّبِّهِۦ وَٱلْمُؤْمِنُونَ ۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَـٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّقُ بَيْنَ أَحَدٍۢ مِّن رُّسُلِهِۦ ۚ وَقَالُوا۟ سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ ٱلْمَصِيرُ ﴿٢٨٥﴾",
		"bm": "Rasul telah beriman kepada apa yang diturunkan kepadanya daripada Tuhannya, dan begitu juga orang yang beriman. Semuanya beriman kepada Allah, para malaikat-Nya, kitab-kitab-Nya dan rasul-rasul-Nya: “Kami tidak membezakan antara seorang pun daripada rasul-rasul-Nya.” Dan mereka berkata: “Kami dengar dan kami taat. Ampunilah kami, wahai Tuhan kami, dan kepada Engkaulah tempat kembali.”"
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Baqarah 286",
		"bi": "Allah does not burden any soul beyond its capacity. It will have what it has earned, and it will bear what it has committed. 'Our Lord, do not take us to task if we forget or err. Our Lord, do not lay upon us a burden like that You laid upon those before us. Our Lord, do not burden us with what we have no strength to bear. Pardon us, forgive us, and have mercy upon us. You are our Protector, so grant us victory over the disbelieving people.'",
		"info": "Ayat terakhir Surah al-Baqarah yang mengandungi doa-doa keampunan, dan Allah menjawab setiap permohonannya (riwayat Muslim).",
		"rumi": "La yukallifullahu nafsan illa wus'aha. Laha ma kasabat wa 'alaiha mak-tasabat. Rabbana la tu'akhizna in nasina au akhta'na. Rabbana wa la tahmil 'alaina isran kama hamaltahu 'alal-lazina min qablina. Rabbana wa la tuhammilna ma la taqata lana bih. Wa'fu 'anna waghfir lana warhamna. Anta maulana fansurna 'alal-qaumil-kafirin.",
		"ar": "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ لَهَا مَا كَسَبَتْ وَعَلَيْهَا مَا ٱكْتَسَبَتْ ۗ رَبَّنَا لَا تُؤَاخِذْنَآ إِن نَّسِينَآ أَوْ أَخْطَأْنَا ۚ رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَآ إِصْرًۭا كَمَا حَمَلْتَهُۥ عَلَى ٱلَّذِينَ مِن قَبْلِنَا ۚ رَبَّنَا وَلَا تُحَمِّلْنَا مَا لَا طَاقَةَ لَنَا بِهِۦ ۖ وَٱعْفُ عَنَّا وَٱغْفِرْ لَنَا وَٱرْحَمْنَآ ۚ أَنتَ مَوْلَىٰنَا فَٱنصُرْنَا عَلَى ٱلْقَوْمِ ٱلْكَـٰفِرِينَ ﴿٢٨٦﴾",
		"bm": "Allah tidak membebani seseorang melainkan menurut kemampuannya. Baginya pahala yang diusahakan dan ke atasnya dosa yang dilakukan. “Wahai Tuhan kami, janganlah Engkau hukum kami jika kami terlupa atau tersilap. Wahai Tuhan kami, janganlah Engkau pikulkan kepada kami beban seperti yang Engkau pikulkan kepada mereka sebelum kami. Wahai Tuhan kami, janganlah Engkau bebankan kami apa yang kami tidak terdaya menanggungnya. Maafkanlah kami, ampunilah kami dan rahmatilah kami. Engkaulah Pelindung kami, maka tolonglah kami menghadapi kaum yang kafir.”"
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Ali 'Imran 1–2",
		"bi": "Alif, Lam, Mim. Allah — there is no god but Him, the Ever-Living, the Sustainer of all.",
		"info": "Pembukaan Surah Ali 'Imran menegaskan keesaan Allah Yang Maha Hidup lagi Maha Berdiri Sendiri.",
		"rumi": "Bismillahir-rahmanir-rahim. Alif-lam-mim. Allahu la ilaha illa huwal-haiyul-qaiyum.",
		"basmalah": true,
		"ar": "الٓمٓ ﴿١﴾ ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ ﴿٢﴾",
		"bm": "Alif, Lam, Mim. Allah, tiada tuhan melainkan Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri."
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Taha 111–112",
		"bi": "All faces will be humbled before the Ever-Living, the Sustainer of all, and whoever carries injustice will have failed. But whoever does righteous deeds while being a believer will fear neither injustice nor deprivation.",
		"info": "Ketundukan seluruh wajah kepada Allah al-Haiyul-Qaiyum, dan jaminan keamanan bagi mukmin yang beramal soleh.",
		"rumi": "Wa 'anatil-wujuhu lil-haiyil-qaiyum, wa qad khaba man hamala zulma. Wa may-ya'mal minas-salihati wa huwa mu'minun fala yakhafu zulmaw-wa la hadma.",
		"ar": " وَعَنَتِ ٱلْوُجُوهُ لِلْحَىِّ ٱلْقَيُّومِ ۖ وَقَدْ خَابَ مَنْ حَمَلَ ظُلْمًۭا ﴿١١١﴾ وَمَن يَعْمَلْ مِنَ ٱلصَّـٰلِحَـٰتِ وَهُوَ مُؤْمِنٌۭ فَلَا يَخَافُ ظُلْمًۭا وَلَا هَضْمًۭا ﴿١١٢﴾",
		"bm": "Dan tunduklah segala wajah kepada Yang Maha Hidup lagi Maha Berdiri Sendiri, dan sesungguhnya rugilah sesiapa yang memikul kezaliman. Dan sesiapa yang mengerjakan amal soleh sedang dia beriman, maka dia tidak akan bimbang dizalimi mahupun dikurangkan haknya."
	},
	{
		"reps": {
			"s": null,
			"k": 7
		},
		"jenis": "quran",
		"tajuk": "At-Tawbah 129",
		"bi": "But if they turn away, say: 'Sufficient for me is Allah; there is no god but Him. In Him I put my trust, and He is the Lord of the Mighty Throne.'",
		"info": "Dibaca 7 kali. Sesiapa membacanya 7 kali pagi dan petang, Allah mencukupkan urusan dunia dan akhiratnya (riwayat Abu Daud dan Ibnu as-Sunni).",
		"rumi": "Fa-in tawallau faqul hasbiyallahu la ilaha illa huw, 'alaihi tawakkaltu wa huwa rabbul-'arsyil-'azim.",
		"ar": "فَإِن تَوَلَّوْا۟ فَقُلْ حَسْبِىَ ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ۖ عَلَيْهِ تَوَكَّلْتُ ۖ وَهُوَ رَبُّ ٱلْعَرْشِ ٱلْعَظِيمِ ﴿١٢٩﴾",
		"bm": "Maka jika mereka berpaling, katakanlah: “Cukuplah Allah bagiku; tiada tuhan melainkan Dia. Kepada-Nya aku bertawakal, dan Dialah Tuhan Arasy yang agung.”"
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Isra' 110–111",
		"bi": "Say: 'Call upon Allah or call upon the Most Gracious — by whichever name you call, to Him belong the Most Beautiful Names.' Do not recite your prayer too loudly nor too quietly, but seek a way between. And say: 'All praise is for Allah, who has not taken a son, who has no partner in His dominion, and who needs no protector out of weakness — and magnify Him greatly.'",
		"info": "Ayat kemuliaan (ayat al-'izz), penutup Surah al-Isra': pujian kepada Allah yang tiada beranak, tiada sekutu dan tiada penolong kerana kehinaan.",
		"rumi": "Qulid-'ullaha awid-'ur-rahman, aiyam-ma tad'u falahul-asma'ul-husna. Wa la tajhar bisalatika wa la tukhafit biha wabtaghi baina zalika sabila. Wa qulil-hamdu lillahil-lazi lam yattakhiz waladaw-wa lam yakul-lahu syarikun fil-mulki wa lam yakul-lahu waliyyum-minaz-zulli wa kabbirhu takbira.",
		"ar": "قُلِ ٱدْعُوا۟ ٱللَّهَ أَوِ ٱدْعُوا۟ ٱلرَّحْمَـٰنَ ۖ أَيًّۭا مَّا تَدْعُوا۟ فَلَهُ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ ۚ وَلَا تَجْهَرْ بِصَلَاتِكَ وَلَا تُخَافِتْ بِهَا وَٱبْتَغِ بَيْنَ ذَٰلِكَ سَبِيلًۭا ﴿١١٠﴾ وَقُلِ ٱلْحَمْدُ لِلَّهِ ٱلَّذِى لَمْ يَتَّخِذْ وَلَدًۭا وَلَمْ يَكُن لَّهُۥ شَرِيكٌۭ فِى ٱلْمُلْكِ وَلَمْ يَكُن لَّهُۥ وَلِىٌّۭ مِّنَ ٱلذُّلِّ ۖ وَكَبِّرْهُ تَكْبِيرًۢا ﴿١١١﴾",
		"bm": "Katakanlah: “Serulah Allah atau serulah Ar-Rahman; dengan nama mana pun kamu menyeru, maka bagi-Nya nama-nama yang terbaik.” Janganlah engkau menyaringkan bacaan solatmu dan jangan pula terlalu memperlahankannya, dan carilah jalan pertengahan antara keduanya. Dan katakanlah: “Segala puji bagi Allah yang tidak mempunyai anak, tiada sekutu bagi-Nya dalam kerajaan-Nya, dan tidak memerlukan penolong kerana sebarang kehinaan; dan agungkanlah Dia dengan sebenar-benar pengagungan.”"
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Mu'minun 115–118",
		"bi": "Did you think that We created you in vain, and that you would not be returned to Us? Exalted is Allah, the True King; there is no god but Him, Lord of the Noble Throne. Whoever calls upon another god besides Allah, for which he has no proof, his reckoning is only with his Lord; indeed, the disbelievers will not succeed. And say: 'My Lord, forgive and have mercy, for You are the Best of those who show mercy.'",
		"info": "Peringatan bahawa manusia tidak diciptakan sia-sia, ditutup dengan doa memohon keampunan dan rahmat.",
		"rumi": "Afahasibtum annama khalaqnakum 'abasaw-wa annakum ilaina la turja'un. Fata'alallahul-malikul-haqq, la ilaha illa huwa rabbul-'arsyil-karim. Wa may-yad'u ma'allahi ilahan akhara la burhana lahu bihi fa-innama hisabuhu 'inda rabbih, innahu la yuflihul-kafirun. Wa qur-rabbighfir warham wa anta khairur-rahimin.",
		"ar": "أَفَحَسِبْتُمْ أَنَّمَا خَلَقْنَـٰكُمْ عَبَثًۭا وَأَنَّكُمْ إِلَيْنَا لَا تُرْجَعُونَ ﴿١١٥﴾ فَتَعَـٰلَى ٱللَّهُ ٱلْمَلِكُ ٱلْحَقُّ ۖ لَآ إِلَـٰهَ إِلَّا هُوَ رَبُّ ٱلْعَرْشِ ٱلْكَرِيمِ ﴿١١٦﴾ وَمَن يَدْعُ مَعَ ٱللَّهِ إِلَـٰهًا ءَاخَرَ لَا بُرْهَـٰنَ لَهُۥ بِهِۦ فَإِنَّمَا حِسَابُهُۥ عِندَ رَبِّهِۦٓ ۚ إِنَّهُۥ لَا يُفْلِحُ ٱلْكَـٰفِرُونَ ﴿١١٧﴾ وَقُل رَّبِّ ٱغْفِرْ وَٱرْحَمْ وَأَنتَ خَيْرُ ٱلرَّٰحِمِينَ ﴿١١٨﴾",
		"bm": "Adakah kamu menyangka bahawa Kami menciptakan kamu dengan sia-sia dan kamu tidak akan dikembalikan kepada Kami? Maha Tinggi Allah, Raja Yang Sebenar; tiada tuhan melainkan Dia, Tuhan Arasy yang mulia. Sesiapa yang menyeru tuhan lain bersama Allah tanpa sebarang bukti, maka hisabnya di sisi Tuhannya; sesungguhnya orang kafir tidak akan berjaya. Dan katakanlah: “Wahai Tuhanku, ampunilah dan rahmatilah, dan Engkaulah sebaik-baik pemberi rahmat.”"
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Ar-Rum 17–26",
		"bi": "So glorify Allah when you reach the evening and when you rise in the morning. To Him is all praise in the heavens and the earth — in the late afternoon and when you are at midday. He brings the living out of the dead and the dead out of the living, and revives the earth after its death; and thus will you be brought out. Among His signs is that He created you from dust — then behold, you are human beings spreading far and wide. And among His signs is that He created for you spouses from among yourselves so that you may find tranquillity in them, and He placed between you love and mercy; surely in that are signs for people who reflect. And among His signs is the creation of the heavens and the earth and the diversity of your languages and colours; surely in that are signs for those of knowledge. And among His signs is your sleep by night and day, and your seeking of His bounty; surely in that are signs for people who listen. And among His signs is that He shows you lightning, causing fear and hope, and sends down water from the sky, reviving the earth after its death; surely in that are signs for people who understand. And among His signs is that the heaven and the earth stand firm by His command; then when He calls you with a single call from the earth, behold, you will come forth. To Him belongs whoever is in the heavens and the earth; all are devoutly obedient to Him.",
		"info": "Ayat tasbih pagi dan petang, mengiringi renungan tanda-tanda kebesaran Allah pada penciptaan manusia, pasangan, langit, bumi dan hujan.",
		"rumi": "Fasubhanallahi hina tumsuna wa hina tusbihun. Wa lahul-hamdu fis-samawati wal-ardi wa 'asyiyyaw-wa hina tuzhirun. Yukhrijul-haiya minal-maiyiti wa yukhrijul-maiyita minal-haiyi wa yuhyil-arda ba'da mautiha, wa kazalika tukhrajun. Wa min ayatihi an khalaqakum min turabin summa iza antum basyarun tantasyirun. Wa min ayatihi an khalaqa lakum min anfusikum azwajal-litaskunu ilaiha wa ja'ala bainakum mawaddataw-wa rahmah, inna fi zalika la'ayatil-liqaumiy-yatafakkarun. Wa min ayatihi khalqus-samawati wal-ardi wakhtilafu alsinatikum wa alwanikum, inna fi zalika la'ayatil-lil-'alimin. Wa min ayatihi manamukum bil-laili wan-nahari wabtigha'ukum min fadlih, inna fi zalika la'ayatil-liqaumiy-yasma'un. Wa min ayatihi yurikumul-barqa khaufaw-wa tama'aw-wa yunazzilu minas-sama'i ma'an fayuhyi bihil-arda ba'da mautiha, inna fi zalika la'ayatil-liqaumiy-ya'qilun. Wa min ayatihi an taqumas-sama'u wal-ardu bi-amrih, summa iza da'akum da'watam-minal-ardi iza antum takhrujun. Wa lahu man fis-samawati wal-ard, kullul-lahu qanitun.",
		"ar": "فَسُبْحَـٰنَ ٱللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ ﴿١٧﴾ وَلَهُ ٱلْحَمْدُ فِى ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ وَعَشِيًّۭا وَحِينَ تُظْهِرُونَ ﴿١٨﴾ يُخْرِجُ ٱلْحَىَّ مِنَ ٱلْمَيِّتِ وَيُخْرِجُ ٱلْمَيِّتَ مِنَ ٱلْحَىِّ وَيُحْىِ ٱلْأَرْضَ بَعْدَ مَوْتِهَا ۚ وَكَذَٰلِكَ تُخْرَجُونَ ﴿١٩﴾ وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَكُم مِّن تُرَابٍۢ ثُمَّ إِذَآ أَنتُم بَشَرٌۭ تَنتَشِرُونَ ﴿٢٠﴾ وَمِنْ ءَايَـٰتِهِۦٓ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَٰجًۭا لِّتَسْكُنُوٓا۟ إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةًۭ وَرَحْمَةً ۚ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍۢ لِّقَوْمٍۢ يَتَفَكَّرُونَ ﴿٢١﴾ وَمِنْ ءَايَـٰتِهِۦ خَلْقُ ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ وَٱخْتِلَـٰفُ أَلْسِنَتِكُمْ وَأَلْوَٰنِكُمْ ۚ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍۢ لِّلْعَـٰلِمِينَ ﴿٢٢﴾ وَمِنْ ءَايَـٰتِهِۦ مَنَامُكُم بِٱلَّيْلِ وَٱلنَّهَارِ وَٱبْتِغَآؤُكُم مِّن فَضْلِهِۦٓ ۚ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍۢ لِّقَوْمٍۢ يَسْمَعُونَ ﴿٢٣﴾ وَمِنْ ءَايَـٰتِهِۦ يُرِيكُمُ ٱلْبَرْقَ خَوْفًۭا وَطَمَعًۭا وَيُنَزِّلُ مِنَ ٱلسَّمَآءِ مَآءًۭ فَيُحْىِۦ بِهِ ٱلْأَرْضَ بَعْدَ مَوْتِهَآ ۚ إِنَّ فِى ذَٰلِكَ لَـَٔايَـٰتٍۢ لِّقَوْمٍۢ يَعْقِلُونَ ﴿٢٤﴾ وَمِنْ ءَايَـٰتِهِۦٓ أَن تَقُومَ ٱلسَّمَآءُ وَٱلْأَرْضُ بِأَمْرِهِۦ ۚ ثُمَّ إِذَا دَعَاكُمْ دَعْوَةًۭ مِّنَ ٱلْأَرْضِ إِذَآ أَنتُمْ تَخْرُجُونَ ﴿٢٥﴾ وَلَهُۥ مَن فِى ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ ۖ كُلٌّۭ لَّهُۥ قَـٰنِتُونَ ﴿٢٦﴾",
		"bm": "Maka bertasbihlah kepada Allah ketika kamu berpetang dan ketika kamu berpagi. Bagi-Nya segala puji di langit dan di bumi, pada waktu malam dan ketika kamu berada pada waktu zohor. Dia mengeluarkan yang hidup daripada yang mati dan yang mati daripada yang hidup, serta menghidupkan bumi selepas matinya; demikianlah kamu akan dikeluarkan. Antara tanda-tanda-Nya: Dia menciptakan kamu daripada tanah, kemudian kamu menjadi manusia yang bertebaran di muka bumi. Antara tanda-tanda-Nya: Dia menciptakan untuk kamu pasangan daripada jenis kamu sendiri supaya kamu berasa tenteram kepadanya, dan Dia menjadikan antara kamu kasih sayang dan rahmat; sesungguhnya pada yang demikian terdapat tanda-tanda bagi kaum yang berfikir. Antara tanda-tanda-Nya: penciptaan langit dan bumi serta perbezaan bahasa dan warna kulit kamu; sesungguhnya pada yang demikian terdapat tanda-tanda bagi orang yang berilmu. Antara tanda-tanda-Nya: tidur kamu pada waktu malam dan siang serta usaha kamu mencari kurniaan-Nya; sesungguhnya pada yang demikian terdapat tanda-tanda bagi kaum yang mendengar. Antara tanda-tanda-Nya: Dia memperlihatkan kilat kepada kamu untuk menimbulkan rasa takut dan harapan, dan Dia menurunkan hujan dari langit lalu menghidupkan bumi dengannya selepas matinya; sesungguhnya pada yang demikian terdapat tanda-tanda bagi kaum yang berakal. Antara tanda-tanda-Nya: langit dan bumi berdiri teguh dengan perintah-Nya; kemudian apabila Dia memanggil kamu dengan satu panggilan dari bumi, dengan serta-merta kamu keluar. Dan milik-Nya sesiapa yang di langit dan di bumi; semuanya taat kepada-Nya."
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Ghafir 1–3",
		"bi": "Ha, Mim. The revelation of this Book is from Allah, the Almighty, the All-Knowing — Forgiver of sin, Acceptor of repentance, severe in punishment, Owner of abundant bounty. There is no god but Him; to Him is the final return.",
		"info": "Pembukaan Surah Ghafir memperkenalkan Allah sebagai Pengampun dosa, Penerima taubat dan Pemilik limpah kurnia.",
		"rumi": "Bismillahir-rahmanir-rahim. Ha-mim. Tanzilul-kitabi minallahil-'azizil-'alim. Ghafiriz-zambi wa qabilit-taubi syadidil-'iqabi zit-taul, la ilaha illa huw, ilaihil-masir.",
		"basmalah": true,
		"ar": "حمٓ ﴿١﴾ تَنزِيلُ ٱلْكِتَـٰبِ مِنَ ٱللَّهِ ٱلْعَزِيزِ ٱلْعَلِيمِ ﴿٢﴾ غَافِرِ ٱلذَّنۢبِ وَقَابِلِ ٱلتَّوْبِ شَدِيدِ ٱلْعِقَابِ ذِى ٱلطَّوْلِ ۖ لَآ إِلَـٰهَ إِلَّا هُوَ ۖ إِلَيْهِ ٱلْمَصِيرُ ﴿٣﴾",
		"bm": "Ha, Mim. Penurunan Kitab ini daripada Allah Yang Maha Perkasa lagi Maha Mengetahui; Pengampun dosa, Penerima taubat, keras hukuman-Nya, Pemilik limpah kurnia. Tiada tuhan melainkan Dia; kepada-Nyalah tempat kembali."
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Al-Hasyr 22–24",
		"bi": "He is Allah, besides whom there is no god: Knower of the unseen and the seen; He is the Most Gracious, the Most Merciful. He is Allah, besides whom there is no god: the King, the Most Holy, the Source of Peace, the Giver of security, the Guardian, the Almighty, the Compeller, the Supreme; glory be to Allah above all they associate with Him. He is Allah: the Creator, the Originator, the Fashioner; to Him belong the Most Beautiful Names. Whatever is in the heavens and the earth glorifies Him, and He is the Almighty, the All-Wise.",
		"info": "Penutup Surah al-Hasyr yang menghimpunkan nama-nama Allah yang terbaik; disebut kelebihan membacanya pagi dan petang dalam riwayat at-Tirmizi.",
		"rumi": "Huwallahul-lazi la ilaha illa huw, 'alimul-ghaibi wasy-syahadah, huwar-rahmanur-rahim. Huwallahul-lazi la ilaha illa huw, al-malikul-quddusus-salamul-mu'minul-muhaiminul-'azizul-jabbarul-mutakabbir, subhanallahi 'amma yusyrikun. Huwallahul-khaliqul-bari'ul-musawwir, lahul-asma'ul-husna. Yusabbihu lahu ma fis-samawati wal-ard, wa huwal-'azizul-hakim.",
		"ar": "هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَـٰهَ إِلَّا هُوَ ۖ عَـٰلِمُ ٱلْغَيْبِ وَٱلشَّهَـٰدَةِ ۖ هُوَ ٱلرَّحْمَـٰنُ ٱلرَّحِيمُ ﴿٢٢﴾ هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْمَلِكُ ٱلْقُدُّوسُ ٱلسَّلَـٰمُ ٱلْمُؤْمِنُ ٱلْمُهَيْمِنُ ٱلْعَزِيزُ ٱلْجَبَّارُ ٱلْمُتَكَبِّرُ ۚ سُبْحَـٰنَ ٱللَّهِ عَمَّا يُشْرِكُونَ ﴿٢٣﴾ هُوَ ٱللَّهُ ٱلْخَـٰلِقُ ٱلْبَارِئُ ٱلْمُصَوِّرُ ۖ لَهُ ٱلْأَسْمَآءُ ٱلْحُسْنَىٰ ۚ يُسَبِّحُ لَهُۥ مَا فِى ٱلسَّمَـٰوَٰتِ وَٱلْأَرْضِ ۖ وَهُوَ ٱلْعَزِيزُ ٱلْحَكِيمُ ﴿٢٤﴾",
		"bm": "Dialah Allah yang tiada tuhan melainkan Dia, Yang Mengetahui perkara ghaib dan nyata; Dialah Yang Maha Pemurah lagi Maha Penyayang. Dialah Allah yang tiada tuhan melainkan Dia, Maha Raja, Maha Suci, Maha Sejahtera, Pemberi keamanan, Maha Memelihara, Maha Perkasa, Maha Gagah, Maha Besar; Maha Suci Allah daripada apa yang mereka sekutukan. Dialah Allah, Maha Pencipta, Maha Mengadakan, Maha Pembentuk rupa; bagi-Nya nama-nama yang terbaik. Segala yang di langit dan di bumi bertasbih kepada-Nya, dan Dialah Yang Maha Perkasa lagi Maha Bijaksana."
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Surah Az-Zalzalah",
		"bi": "When the earth is shaken with its mighty quaking, and the earth brings forth its burdens, and man says: 'What is the matter with it?' — on that Day it will relate its news, because your Lord has inspired it. On that Day people will proceed in scattered groups to be shown their deeds. So whoever does an atom's weight of good will see it, and whoever does an atom's weight of evil will see it.",
		"info": "Menyamai separuh al-Quran dalam sebahagian riwayat (at-Tirmizi); peringatan bahawa amalan sekecil zarah pun akan diperlihatkan.",
		"rumi": "Bismillahir-rahmanir-rahim. Iza zulzilatil-ardu zilzalaha. Wa akhrajatil-ardu asqalaha. Wa qalal-insanu ma laha. Yauma'izin tuhaddisu akhbaraha. Bi-anna rabbaka auha laha. Yauma'iziy-yasdurun-nasu asytatal-liyurau a'malahum. Famay-ya'mal misqala zarratin khairay-yarah. Wa may-ya'mal misqala zarratin syarray-yarah.",
		"basmalah": true,
		"ar": "إِذَا زُلْزِلَتِ الْأَرْضُ زِلْزَالَهَا ﴿١﴾ وَأَخْرَجَتِ الْأَرْضُ أَثْقَالَهَا ﴿٢﴾ وَقَالَ ٱلْإِنسَـٰنُ مَا لَهَا ﴿٣﴾ يَوْمَئِذٍۢ تُحَدِّثُ أَخْبَارَهَا ﴿٤﴾ بِأَنَّ رَبَّكَ أَوْحَىٰ لَهَا ﴿٥﴾ يَوْمَئِذٍ يَصْدُرُ النَّاسُ أَشْتَاتًا لِّيُرَوْا أَعْمَـٰلَهُمْ ﴿٦﴾ فَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ خَيْرًا خَيْرًۭا يَرَهُۥ ﴿٧﴾ وَمَن يَعْمَلْ مِثْقَالَ ذَرَّةٍ شَرًّا خَيْرًۭا يَرَهُۥ ﴿٨﴾",
		"bm": "Apabila bumi digoncangkan dengan goncangannya yang dahsyat, dan bumi mengeluarkan segala isi kandungannya, dan manusia berkata: “Apakah yang terjadi kepadanya?” Pada hari itu bumi menceritakan beritanya, kerana Tuhanmu telah memerintahkannya. Pada hari itu manusia keluar berpuak-puak untuk diperlihatkan amalan mereka. Maka sesiapa yang mengerjakan kebaikan seberat zarah, nescaya dia akan melihatnya; dan sesiapa yang mengerjakan kejahatan seberat zarah, nescaya dia akan melihatnya."
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Surah Al-Kafirun",
		"bi": "Say: 'O disbelievers! I do not worship what you worship, nor are you worshippers of what I worship. Nor will I worship what you worship, nor will you worship what I worship. To you your religion, and to me mine.'",
		"info": "Menyamai satu perempat al-Quran (riwayat at-Tirmizi); pelepasan diri sepenuhnya daripada syirik.",
		"rumi": "Bismillahir-rahmanir-rahim. Qul ya aiyuhal-kafirun. La a'budu ma ta'budun. Wa la antum 'abiduna ma a'bud. Wa la ana 'abidum-ma 'abattum. Wa la antum 'abiduna ma a'bud. Lakum dinukum wa liya din.",
		"basmalah": true,
		"ar": "قُلْ يَـٰٓأَيُّهَا ٱلْكَـٰفِرُونَ ﴿١﴾ لَآ أَعْبُدُ مَا تَعْبُدُونَ ﴿٢﴾ وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ ﴿٣﴾ وَلَآ أَنَا۠ عَابِدٌۭ مَّا عَبَدتُّمْ ﴿٤﴾ وَلَآ أَنتُمْ عَـٰبِدُونَ مَآ أَعْبُدُ ﴿٥﴾ لَكُمْ دِينُكُمْ دِينُكُمْ وَلِىَ دِينِ ﴿٦﴾",
		"bm": "Katakanlah: “Wahai orang kafir! Aku tidak menyembah apa yang kamu sembah, dan kamu bukan penyembah apa yang aku sembah; dan aku tidak akan menyembah apa yang kamu sembah, dan kamu tidak akan menyembah apa yang aku sembah. Bagi kamu agama kamu, dan bagiku agamaku.”"
	},
	{
		"reps": {
			"s": null,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Surah An-Nasr",
		"bi": "When the victory of Allah and the conquest come, and you see people entering the religion of Allah in multitudes, then glorify the praise of your Lord and seek His forgiveness; indeed, He is Ever-Accepting of repentance.",
		"info": "Surah kemenangan dan istighfar; antara surah terakhir yang diturunkan secara lengkap.",
		"rumi": "Bismillahir-rahmanir-rahim. Iza ja'a nasrullahi wal-fath. Wa ra'aitan-nasa yadkhuluna fi dinillahi afwaja. Fasabbih bihamdi rabbika wastaghfirh, innahu kana tawwaba.",
		"basmalah": true,
		"ar": "إِذَا جَآءَ نَصْرُ ٱللَّهِ وَٱلْفَتْحُ ﴿١﴾ وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا ﴿٢﴾ فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ ۚ إِنَّهُۥ كَانَ تَوَّابًۢا ﴿٣﴾",
		"bm": "Apabila datang pertolongan Allah dan kemenangan, dan engkau melihat manusia masuk ke dalam agama Allah beramai-ramai, maka bertasbihlah dengan memuji Tuhanmu dan mohonlah keampunan-Nya; sesungguhnya Dia Maha Penerima taubat."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "quran",
		"tajuk": "Surah Al-Ikhlas",
		"bi": "Say: He is Allah, the One. Allah, the Eternal Refuge. He neither begets nor is born, and there is none comparable to Him.",
		"info": "Menyamai sepertiga al-Quran (riwayat al-Bukhari). Dibaca 3 kali pagi dan petang bersama al-Mu'awwizatain, mencukupimu daripada segala sesuatu (riwayat Abu Daud dan at-Tirmizi).",
		"rumi": "Bismillahir-rahmanir-rahim. Qul huwallahu ahad. Allahus-samad. Lam yalid wa lam yulad. Wa lam yakul-lahu kufuwan ahad.",
		"basmalah": true,
		"ar": "قُلْ هُوَ اللَّهُ أَحَدٌ ﴿١﴾ اللَّهُ الصَّمَدُ ﴿٢﴾ لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ ﴿٤﴾",
		"bm": "Katakanlah: Dialah Allah Yang Maha Esa. Allah tempat bergantung segala sesuatu. Dia tidak beranak dan tidak diperanakkan, dan tiada sesuatu pun yang setara dengan-Nya."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "quran",
		"tajuk": "Surah Al-Falaq",
		"bi": "Say: I seek refuge in the Lord of the daybreak, from the evil of what He has created; from the evil of the darkness when it settles; from the evil of those who blow on knots; and from the evil of an envier when he envies.",
		"info": "Salah satu al-Mu'awwizatain — perlindungan terbaik yang pernah diminta oleh sesiapa (riwayat Abu Daud), khususnya daripada sihir dan hasad.",
		"rumi": "Bismillahir-rahmanir-rahim. Qul a'uzu birabbil-falaq. Min syarri ma khalaq. Wa min syarri ghasiqin iza waqab. Wa min syarrin-naffasati fil-'uqad. Wa min syarri hasidin iza hasad.",
		"basmalah": true,
		"ar": "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ﴿١﴾ مِن شَرِّ مَا خَلَقَ ﴿٢﴾ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾ وَمِن شَرِّ ٱلنَّفَّـٰثَـٰتِ فِى ٱلْعُقَدِ ﴿٤﴾ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾",
		"bm": "Katakanlah: Aku berlindung dengan Tuhan yang menguasai subuh, daripada kejahatan makhluk ciptaan-Nya; daripada kejahatan malam apabila gelap gelita; daripada kejahatan peniup-peniup pada simpulan ikatan; dan daripada kejahatan pendengki apabila dia mendengki."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "quran",
		"tajuk": "Surah An-Nas",
		"bi": "Say: I seek refuge in the Lord of mankind, the King of mankind, the God of mankind, from the evil of the retreating whisperer, who whispers into the hearts of mankind, from among jinn and mankind.",
		"info": "Penutup al-Mu'awwizatain dan al-Quran; perlindungan daripada bisikan syaitan dari kalangan jin dan manusia.",
		"rumi": "Bismillahir-rahmanir-rahim. Qul a'uzu birabbin-nas. Malikin-nas. Ilahin-nas. Min syarril-waswasil-khannas. Al-lazi yuwaswisu fi sudurin-nas. Minal-jinnati wan-nas.",
		"basmalah": true,
		"ar": "قُلْ أَعُوذُ بِرَبِّ النَّاسِ ﴿١﴾ مَلِكِ النَّاسِ ﴿٢﴾ إِلَـٰهِ ٱلنَّاسِ ﴿٣﴾ مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ ﴿٤﴾ الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ ﴿٥﴾ مِنَ الْجِنَّةِ وَالنَّاسِ ﴿٦﴾",
		"bm": "Katakanlah: Aku berlindung dengan Tuhan manusia, Raja manusia, Tuhan yang disembah manusia, daripada kejahatan pembisik yang bersembunyi, yang membisikkan kejahatan dalam dada manusia, daripada kalangan jin dan manusia."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Segala kerajaan milik Allah",
		"bi": {
			"pagi": "We have entered the morning, and all sovereignty this morning belongs to Allah. All praise is for Allah; He has no partner, there is no god but Him, and to Him is the resurrection.",
			"petang": "We have entered the evening, and all sovereignty this evening belongs to Allah. All praise is for Allah; He has no partner, there is no god but Him, and to Him is the final return."
		},
		"info": "Zikir pagi dan petang Rasulullah ﷺ (riwayat Muslim), menyerahkan segala urusan hari kepada Pemilik segala kerajaan.",
		"rumi": {
			"pagi": "Asbahna wa asbahal-mulku lillah, wal-hamdu lillah, la syarika lah, la ilaha illa huwa wa ilaihin-nusyur.",
			"petang": "Amsaina wa amsal-mulku lillah, wal-hamdu lillah, la syarika lah, la ilaha illa huwa wa ilaihil-masir."
		},
		"ar": {
			"pagi": "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا شَرِيكَ لَهُ، لَا إِلَٰهَ إِلَّا هُوَ وَإِلَيْهِ النُّشُورُ.",
			"petang": "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لَا شَرِيكَ لَهُ، لَا إِلَٰهَ إِلَّا هُوَ وَإِلَيْهِ الْمَصِيرُ."
		},
		"bm": {
			"pagi": "Kami berpagi dan berpagilah segala kerajaan milik Allah. Segala puji bagi Allah; tiada sekutu bagi-Nya, tiada tuhan melainkan Dia, dan kepada-Nya kebangkitan.",
			"petang": "Kami berpetang dan berpetanglah segala kerajaan milik Allah. Segala puji bagi Allah; tiada sekutu bagi-Nya, tiada tuhan melainkan Dia, dan kepada-Nya tempat kembali."
		}
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Atas fitrah Islam",
		"bi": {
			"pagi": "We have entered the morning upon the natural way of Islam, the word of pure sincerity, the religion of our Prophet Muhammad ﷺ, and the way of our father Ibrahim — upright, and he was not of the polytheists.",
			"petang": "We have entered the evening upon the natural way of Islam, the word of pure sincerity, the religion of our Prophet Muhammad ﷺ, and the way of our father Ibrahim — upright, and he was not of the polytheists."
		},
		"info": "Ikrar harian di atas fitrah Islam, kalimah ikhlas dan millah Nabi Ibrahim (riwayat Ahmad).",
		"rumi": {
			"pagi": "Asbahna 'ala fitratil-islami wa kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammadin sallallahu 'alaihi wa sallam, wa 'ala millati abina Ibrahima hanifaw-wa ma kana minal-musyrikin.",
			"petang": "Amsaina 'ala fitratil-islami wa kalimatil-ikhlas, wa 'ala dini nabiyyina Muhammadin sallallahu 'alaihi wa sallam, wa 'ala millati abina Ibrahima hanifaw-wa ma kana minal-musyrikin."
		},
		"ar": {
			"pagi": "أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.",
			"petang": "أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ."
		},
		"bm": {
			"pagi": "Kami berpagi di atas fitrah Islam, kalimah ikhlas, agama Nabi kami Muhammad ﷺ, dan millah bapa kami Ibrahim yang lurus, dan dia bukan daripada golongan musyrik.",
			"petang": "Kami berpetang di atas fitrah Islam, kalimah ikhlas, agama Nabi kami Muhammad ﷺ, dan millah bapa kami Ibrahim yang lurus, dan dia bukan daripada golongan musyrik."
		}
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Nikmat, afiat dan perlindungan",
		"bi": {
			"pagi": "O Allah, I have entered this morning with blessing, well-being and protection from You; so complete upon me Your blessing, Your well-being and Your protection in this world and the Hereafter.",
			"petang": "O Allah, I have entered this evening with blessing, well-being and protection from You; so complete upon me Your blessing, Your well-being and Your protection in this world and the Hereafter."
		},
		"info": "Permohonan penyempurnaan tiga kurniaan asas — nikmat, afiat dan perlindungan — di dunia dan akhirat (riwayat Ibnu as-Sunni).",
		"rumi": {
			"pagi": "Allahumma inni asbahtu minka fi ni'matiw-wa 'afiyatiw-wa sitr, fa-atimma 'alaiya ni'mataka wa 'afiyataka wa sitraka fid-dunya wal-akhirah.",
			"petang": "Allahumma inni amsaitu minka fi ni'matiw-wa 'afiyatiw-wa sitr, fa-atimma 'alaiya ni'mataka wa 'afiyataka wa sitraka fid-dunya wal-akhirah."
		},
		"ar": {
			"pagi": "اللَّهُمَّ إِنِّي أَصْبَحْتُ مِنْكَ فِي نِعْمَةٍ وَعَافِيَةٍ وَسِتْرٍ، فَأَتِمَّ عَلَيَّ نِعْمَتَكَ وَعَافِيَتَكَ وَسِتْرَكَ فِي الدُّنْيَا وَالْآخِرَةِ.",
			"petang": "اللَّهُمَّ إِنِّي أَمْسَيْتُ مِنْكَ فِي نِعْمَةٍ وَعَافِيَةٍ وَسِتْرٍ، فَأَتِمَّ عَلَيَّ نِعْمَتَكَ وَعَافِيَتَكَ وَسِتْرَكَ فِي الدُّنْيَا وَالْآخِرَةِ."
		},
		"bm": {
			"pagi": "Ya Allah, aku berpagi dalam nikmat, afiat dan perlindungan daripada-Mu; maka sempurnakanlah nikmat-Mu, afiat-Mu dan perlindungan-Mu ke atasku di dunia dan akhirat.",
			"petang": "Ya Allah, aku berpetang dalam nikmat, afiat dan perlindungan daripada-Mu; maka sempurnakanlah nikmat-Mu, afiat-Mu dan perlindungan-Mu ke atasku di dunia dan akhirat."
		}
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Syukur atas segala nikmat",
		"bi": {
			"pagi": "O Allah, whatever blessing I or any of Your creation has received this morning is from You alone, without partner; so to You is all praise and to You is all thanks.",
			"petang": "O Allah, whatever blessing I or any of Your creation has received this evening is from You alone, without partner; so to You is all praise and to You is all thanks."
		},
		"info": "Sesiapa membacanya pada waktu pagi, dia telah menunaikan kesyukuran harinya; dan pada waktu petang, kesyukuran malamnya (riwayat Abu Daud).",
		"rumi": {
			"pagi": "Allahumma ma asbaha bi min ni'matin au bi-ahadim-min khalqika faminka wahdaka la syarika lak, falakal-hamdu wa lakasy-syukr.",
			"petang": "Allahumma ma amsa bi min ni'matin au bi-ahadim-min khalqika faminka wahdaka la syarika lak, falakal-hamdu wa lakasy-syukr."
		},
		"ar": {
			"pagi": "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
			"petang": "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ."
		},
		"bm": {
			"pagi": "Ya Allah, apa jua nikmat yang ada padaku atau pada mana-mana makhluk-Mu pagi ini, semuanya daripada-Mu semata-mata, tiada sekutu bagi-Mu; maka bagi-Mu segala puji dan bagi-Mu segala syukur.",
			"petang": "Ya Allah, apa jua nikmat yang ada padaku atau pada mana-mana makhluk-Mu petang ini, semuanya daripada-Mu semata-mata, tiada sekutu bagi-Mu; maka bagi-Mu segala puji dan bagi-Mu segala syukur."
		}
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Pujian sesuai keagungan-Nya",
		"bi": "My Lord, to You is all praise as befits the majesty of Your Face and the greatness of Your authority.",
		"info": "Pujian yang diriwayatkan menepati keagungan wajah Allah dan kebesaran kekuasaan-Nya, yang tidak mampu dihitung oleh para malaikat pencatat.",
		"rumi": "Ya rabbi lakal-hamdu kama yambaghi lijalali wajhika wa 'azimi sultanik.",
		"ar": "يَا رَبِّي لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَعَظِيمِ سُلْطَانِكَ.",
		"bm": "Wahai Tuhanku, bagi-Mu segala puji sebagaimana yang layak dengan keagungan wajah-Mu dan kebesaran kekuasaan-Mu."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Redha dengan Allah, Islam dan Rasul",
		"bi": "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad as Prophet and Messenger.",
		"info": "Sesiapa membacanya 3 kali pagi dan petang, menjadi hak Allah meredhainya pada hari kiamat (riwayat at-Tirmizi).",
		"rumi": "Raditu billahi rabba, wa bil-islami dina, wa bi-Muhammadin nabiyyaw-wa rasula.",
		"ar": "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ نَبِيًّا وَرَسُولًا.",
		"bm": "Aku redha Allah sebagai Tuhan, Islam sebagai agama, dan Muhammad sebagai nabi dan rasul."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Tasbih tanpa hingga",
		"bi": "Glory be to Allah and His is the praise — as many as His creation, as much as pleases Him, as heavy as His Throne, and as vast as the ink of His words.",
		"info": "Tasbih yang lebih berat timbangannya daripada zikir sepanjang pagi, sebagaimana diajar Nabi ﷺ kepada Juwairiyah r.a. (riwayat Muslim).",
		"rumi": "Subhanallahi wa bihamdihi 'adada khalqihi wa rida nafsihi wa zinata 'arsyihi wa midada kalimatih.",
		"ar": "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.",
		"bm": "Maha Suci Allah dan dengan puji-Nya, sebanyak bilangan makhluk-Nya, seredha diri-Nya, seberat Arasy-Nya dan sebanyak dakwat kalimah-kalimah-Nya."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Perlindungan dengan nama Allah",
		"bi": "In the name of Allah, with whose name nothing on earth or in heaven can cause harm, and He is the All-Hearing, the All-Knowing.",
		"info": "Sesiapa membacanya 3 kali pagi dan petang, tiada sesuatu pun dapat memudaratkannya (riwayat Abu Daud dan at-Tirmizi).",
		"rumi": "Bismillahil-lazi la yadurru ma'as-mihi syai'un fil-ardi wa la fis-sama'i wa huwas-sami'ul-'alim.",
		"ar": "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ.",
		"bm": "Dengan nama Allah yang dengan nama-Nya tiada sesuatu pun di bumi mahupun di langit dapat memberi mudarat, dan Dialah Yang Maha Mendengar lagi Maha Mengetahui."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Berlindung daripada syirik",
		"bi": "O Allah, we seek refuge in You from knowingly associating anything with You, and we seek Your forgiveness for what we do unknowingly.",
		"info": "Perlindungan daripada syirik yang disedari dan istighfar bagi syirik tersembunyi yang tidak disedari (riwayat Ahmad).",
		"rumi": "Allahumma inna na'uzu bika min an nusyrika bika syai'an na'lamuh, wa nastaghfiruka lima la na'lamuh.",
		"ar": "اللَّهُمَّ إِنَّا نَعُوذُ بِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ، وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ.",
		"bm": "Ya Allah, kami berlindung dengan-Mu daripada menyekutukan-Mu dengan sesuatu yang kami sedari, dan kami memohon ampun kepada-Mu bagi apa yang tidak kami sedari."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Kalimah Allah yang sempurna",
		"bi": "I seek refuge in the perfect words of Allah from the evil of what He has created.",
		"info": "Sesiapa membacanya pada waktu petang, tiada yang memudaratkannya pada malam itu (riwayat Muslim).",
		"rumi": "A'uzu bikalimatillahit-tammati min syarri ma khalaq.",
		"ar": "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ.",
		"bm": "Aku berlindung dengan kalimah-kalimah Allah yang sempurna daripada kejahatan makhluk ciptaan-Nya."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Berlindung daripada dukacita dan hutang",
		"bi": "O Allah, I seek refuge in You from anxiety and grief; I seek refuge in You from weakness and laziness; I seek refuge in You from cowardice and miserliness; and I seek refuge in You from being overwhelmed by debt and overpowered by men.",
		"info": "Doa Nabi ﷺ memohon perlindungan daripada lapan perkara: keluh-kesah, dukacita, lemah, malas, pengecut, bakhil, bebanan hutang dan penindasan manusia (riwayat al-Bukhari).",
		"rumi": "Allahumma inni a'uzu bika minal-hammi wal-hazan, wa a'uzu bika minal-'ajzi wal-kasal, wa a'uzu bika minal-jubni wal-bukhl, wa a'uzu bika min ghalabatid-daini wa qahrir-rijal.",
		"ar": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَأَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ، وَأَعُوذُ بِكَ مِنَ الْجُبْنِ وَالْبُخْلِ، وَأَعُوذُ بِكَ مِنْ غَلَبَةِ الدَّيْنِ وَقَهْرِ الرِّجَالِ.",
		"bm": "Ya Allah, aku berlindung dengan-Mu daripada keluh-kesah dan dukacita; daripada lemah dan malas; daripada sifat pengecut dan bakhil; serta daripada bebanan hutang dan penindasan manusia."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Afiat tubuh, pendengaran dan penglihatan",
		"bi": "O Allah, grant well-being to my body. O Allah, grant well-being to my hearing. O Allah, grant well-being to my sight.",
		"info": "Amalan Abu Bakrah r.a. yang dibaca 3 kali pagi dan petang mengikut sunnah Nabi ﷺ (riwayat Abu Daud).",
		"rumi": "Allahumma 'afini fi badani, allahumma 'afini fi sam'i, allahumma 'afini fi basari.",
		"ar": "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي.",
		"bm": "Ya Allah, kurniakanlah afiat pada tubuhku. Ya Allah, kurniakanlah afiat pada pendengaranku. Ya Allah, kurniakanlah afiat pada penglihatanku."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Berlindung daripada kufur dan kefakiran",
		"bi": "O Allah, I seek refuge in You from disbelief and poverty. O Allah, I seek refuge in You from the punishment of the grave. There is no god but You.",
		"info": "Perlindungan daripada kekufuran, kefakiran dan azab kubur — tiga perkara yang saling berkait (riwayat Abu Daud dan an-Nasa'i).",
		"rumi": "Allahumma inni a'uzu bika minal-kufri wal-faqr, allahumma inni a'uzu bika min 'azabil-qabr, la ilaha illa anta.",
		"ar": "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَٰهَ إِلَّا أَنْتَ.",
		"bm": "Ya Allah, aku berlindung dengan-Mu daripada kekufuran dan kefakiran. Ya Allah, aku berlindung dengan-Mu daripada azab kubur. Tiada tuhan melainkan Engkau."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Sayyidul Istighfar",
		"bi": "O Allah, You are my Lord; there is no god but You. You created me and I am Your servant, and I remain upon Your covenant and promise as best I can. I seek refuge in You from the evil of what I have done. I acknowledge Your favour upon me, and I acknowledge my sin — so forgive me, for none forgives sins but You.",
		"info": "Penghulu segala istighfar: sesiapa membacanya dengan penuh yakin pada waktu pagi lalu meninggal pada hari itu, dia ahli syurga; begitu juga pada waktu petang (riwayat al-Bukhari).",
		"rumi": "Allahumma anta rabbi la ilaha illa ant, khalaqtani wa ana 'abduk, wa ana 'ala 'ahdika wa wa'dika mas-tata't, a'uzu bika min syarri ma sana't, abu'u laka bini'matika 'alaiya wa abu'u bizambi, faghfir li fa-innahu la yaghfiruz-zunuba illa ant.",
		"ar": "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوءُ بِذَنْبِي، فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
		"bm": "Ya Allah, Engkau Tuhanku; tiada tuhan melainkan Engkau. Engkau menciptakan aku dan aku hamba-Mu; aku tetap atas janji dan ikrar kepada-Mu sedaya upayaku. Aku berlindung dengan-Mu daripada kejahatan perbuatanku; aku mengakui nikmat-Mu ke atasku dan aku mengakui dosaku. Maka ampunilah aku, kerana tiada yang mengampunkan dosa melainkan Engkau."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Istighfar",
		"bi": "I seek the forgiveness of Allah, the Most Great, besides whom there is no god, the Ever-Living, the Sustainer of all, and I repent to Him.",
		"info": "Sesiapa membacanya, diampunkan dosanya walaupun dia pernah lari daripada medan perang (riwayat Abu Daud dan at-Tirmizi).",
		"rumi": "Astaghfirullahal-'azimal-lazi la ilaha illa huwal-haiyul-qaiyumu wa atubu ilaih.",
		"ar": "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ.",
		"bm": "Aku memohon ampun kepada Allah Yang Maha Agung; tiada tuhan melainkan Dia, Yang Maha Hidup lagi Maha Berdiri Sendiri, dan aku bertaubat kepada-Nya."
	},
	{
		"reps": {
			"s": null,
			"k": 10
		},
		"jenis": "zikir",
		"tajuk": "Selawat Ibrahimiyyah",
		"bi": "O Allah, send Your blessings upon our master Muhammad and the family of our master Muhammad, as You sent blessings upon our master Ibrahim and the family of our master Ibrahim; and bestow Your grace upon our master Muhammad and the family of our master Muhammad, as You bestowed grace upon our master Ibrahim and the family of our master Ibrahim, in all the worlds. Indeed, You are Most Praiseworthy, Most Glorious.",
		"info": "Selawat paling sempurna sebagaimana diajarkan Nabi ﷺ apabila ditanya cara berselawat (riwayat al-Bukhari dan Muslim). Dibaca 10 kali dalam Wazifah Kubra.",
		"rumi": "Allahumma salli 'ala saiyidina Muhammadiw-wa 'ala ali saiyidina Muhammad, kama sallaita 'ala saiyidina Ibrahima wa 'ala ali saiyidina Ibrahim, wa barik 'ala saiyidina Muhammadiw-wa 'ala ali saiyidina Muhammad, kama barakta 'ala saiyidina Ibrahima wa 'ala ali saiyidina Ibrahim, fil-'alamina innaka hamidum-majid.",
		"ar": "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى سَيِّدِنَا إِبْرَاهِيمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيمَ، وَبَارِكْ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ، كَمَا بَارَكْتَ عَلَى سَيِّدِنَا إِبْرَاهِيمَ وَعَلَى آلِ سَيِّدِنَا إِبْرَاهِيمَ فِي ٱلْعَـٰلَمِينَ إِنَّكَ حَمِيدٌ مَجِيدٌ.",
		"bm": "Ya Allah, limpahkanlah selawat ke atas penghulu kami Muhammad dan keluarga penghulu kami Muhammad, sebagaimana Engkau berselawat ke atas penghulu kami Ibrahim dan keluarga penghulu kami Ibrahim; dan berkatilah penghulu kami Muhammad dan keluarga penghulu kami Muhammad, sebagaimana Engkau memberkati penghulu kami Ibrahim dan keluarga penghulu kami Ibrahim di sekalian alam. Sesungguhnya Engkau Maha Terpuji lagi Maha Mulia."
	},
	{
		"reps": {
			"s": null,
			"k": 100
		},
		"jenis": "zikir",
		"tajuk": "Tasbih, tahmid, tahlil dan takbir",
		"bi": "Glory be to Allah, all praise is for Allah, there is no god but Allah, and Allah is the Greatest.",
		"info": "Empat kalimah yang paling dicintai Allah (riwayat Muslim); dibaca 100 kali dalam Wazifah Kubra sebagai zikir teras.",
		"rumi": "Subhanallahi wal-hamdu lillahi wa la ilaha illallahu wallahu akbar.",
		"ar": "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَٰهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ.",
		"bm": "Maha Suci Allah, segala puji bagi Allah, tiada tuhan melainkan Allah, dan Allah Maha Besar."
	},
	{
		"reps": {
			"s": null,
			"k": 10
		},
		"jenis": "zikir",
		"tajuk": "Tahlil",
		"bi": "There is no god but Allah alone, with no partner. To Him belongs the dominion and to Him is all praise, and He is Able to do all things.",
		"info": "Sesiapa membacanya 10 kali, seolah-olah dia memerdekakan empat orang hamba daripada keturunan Nabi Ismail (riwayat al-Bukhari dan Muslim).",
		"rumi": "La ilaha illallahu wahdahu la syarika lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli syai'in qadir.",
		"ar": "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
		"bm": "Tiada tuhan melainkan Allah semata-mata, tiada sekutu bagi-Nya; milik-Nya segala kerajaan dan bagi-Nya segala puji, dan Dia Maha Berkuasa atas segala sesuatu."
	},
	{
		"reps": {
			"s": 3,
			"k": 3
		},
		"jenis": "zikir",
		"tajuk": "Tasbih kafarah majlis",
		"bi": "Glory be to You, O Allah, and Yours is the praise. I bear witness that there is no god but You; I seek Your forgiveness and I repent to You.",
		"info": "Kafarah majlis — penghapus kesilapan dan keterlanjuran kata sepanjang majlis (riwayat Abu Daud dan at-Tirmizi).",
		"rumi": "Subhanakallahumma wa bihamdika, asyhadu al-la ilaha illa ant, astaghfiruka wa atubu ilaik.",
		"ar": "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ، أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا أَنْتَ، أَسْتَغْفِرُكَ وَأَتُوبُ إِلَيْكَ.",
		"bm": "Maha Suci Engkau, ya Allah, dan dengan puji-Mu. Aku bersaksi bahawa tiada tuhan melainkan Engkau; aku memohon ampun dan bertaubat kepada-Mu."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "zikir",
		"tajuk": "Selawat ke atas Nabi ﷺ",
		"bi": "O Allah, send blessings upon our master Muhammad — Your servant, Your Prophet and Your Messenger, the unlettered Prophet — and upon his family and companions, and grant them abundant peace: as much as is encompassed by Your knowledge, written by Your Pen, and recorded in Your Book.",
		"info": "Selawat dengan bilangan tanpa hingga: sebanyak liputan ilmu Allah, tulisan pena-Nya dan hitungan kitab-Nya.",
		"rumi": "Allahumma salli 'ala saiyidina Muhammadin 'abdika wa nabiyyika wa rasulikan-nabiyyil-ummiy, wa 'ala alihi wa sahbihi wa sallim taslima, 'adada ma ahata bihi 'ilmuka wa khatta bihi qalamuka wa ahsahu kitabuk.",
		"ar": "اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ عَبْدِكَ وَنَبِيِّكَ وَرَسُولِكَ النَّبِيِّ الْأُمِّيِّ، وَعَلَى آلِهِ وَصَحْبِهِ وَسَلِّمْ تَسْلِيمًا، عَدَدَ مَا أَحَاطَ بِهِ عِلْمُكَ وَخَطَّ بِهِ قَلَمُكَ وَأَحْصَاهُ كِتَابُكَ.",
		"bm": "Ya Allah, limpahkanlah selawat ke atas penghulu kami Muhammad — hamba-Mu, nabi-Mu dan rasul-Mu, nabi yang ummi — serta ke atas keluarga dan para sahabatnya, dan kurniakanlah kesejahteraan sebanyak yang diliputi ilmu-Mu, ditulis oleh pena-Mu dan dihitung oleh kitab-Mu."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "zikir",
		"tajuk": "Redha ke atas para sahabat",
		"bi": "And be pleased, O Allah, with our masters Abu Bakr, 'Umar, 'Uthman and 'Ali, with all the Companions, and with the Successors and those who follow them in goodness until the Day of Judgement. Glory be to your Lord, the Lord of Honour, above what they describe; peace be upon the Messengers; and all praise is for Allah, Lord of all the worlds.",
		"info": "Memohon keredhaan Allah buat Khulafa' Rasyidin, seluruh sahabat dan tabiin, ditutup dengan ayat 180–182 Surah as-Saffat.",
		"rumi": "Wardallahumma 'an sadatina Abi Bakriw-wa 'Umara wa 'Usmana wa 'Aliy, wa 'anis-sahabati ajma'in, wa 'anit-tabi'ina wa tabi'ihim bi-ihsanin ila yaumid-din. Subhana rabbika rabbil-'izzati 'amma yasifun, wa salamun 'alal-mursalin, wal-hamdu lillahi rabbil-'alamin.",
		"ar": "وَارْضَ اللَّهُمَّ عَنْ سَادَاتِنَا أَبِي بَكْرٍ وَعُمَرَ وَعُثْمَانَ وَعَلِيٍّ، وَعَنِ الصَّحَابَةِ أَجْمَعِينَ، وَعَنِ التَّابِعِينَ وَتَابِعِيهِمْ بِإِحْسَانٍ إِلَى يَوْمِ الدِّينِ. سُبْحَانَ رَبِّكَ رَبِّ الْعِزَّةِ عَمَّا يَصِفُونَ، وَسَلَامٌ عَلَى الْمُرْسَلِينَ، وَالْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ.",
		"bm": "Ya Allah, redhailah penghulu-penghulu kami Abu Bakar, Umar, Uthman dan Ali, seluruh para sahabat, para tabiin dan mereka yang mengikuti mereka dengan baik hingga hari kiamat. Maha Suci Tuhanmu, Tuhan yang mempunyai keagungan, daripada apa yang mereka sifatkan; kesejahteraan ke atas para rasul; dan segala puji bagi Allah, Tuhan sekalian alam."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "doa",
		"tajuk": "Doa lidah yang basah berzikir",
		"bi": "O Allah, we ask You for a tongue moist with Your remembrance, a heart filled with gratitude to You, and a body light and yielding in obedience to You. O Allah, we ask You for complete faith, a humble heart, beneficial knowledge, true certainty, an upright religion, safety from every affliction, and complete independence from people. Grant us true faith in You, so that we fear none and hope in none but You, and worship nothing besides You. Extend Your hand of mercy over us, our families, our children and all who are with us; and do not leave us to ourselves even for the blink of an eye, or less than that, O Best of those who answer prayer. And may Allah's blessings be upon our master Muhammad, the noble Prophet, and upon his family and all his companions.",
		"info": "Himpunan doa yang disusun Imam Hasan al-Banna, memohon istiqamah zikir, iman yang sempurna dan kecukupan daripada bergantung kepada manusia.",
		"rumi": "Allahumma inna nas'aluka lisanan ratbam-bizikrik, wa qalbam-muf'amam-bisyukrik, wa badanan haiyinal-laiyinam-bita'atik. Allahumma inna nas'aluka imanan kamila, wa nas'aluka qalban khasyi'a, wa nas'aluka 'ilman nafi'a, wa nas'aluka yaqinan sadiqa, wa nas'aluka dinan qaiyima, wa nas'alukal-'afiyata min kulli baliyyah, wa nas'aluka tamamal-ghina 'anin-nas. Wa hab lana haqiqatal-imani bika hatta la nakhafa wa la narjuwa ghairak, wa la na'buda syai'an siwak, waj'al yadaka mabsutatan 'alaina wa 'ala ahlina wa auladina wa mam-ma'ana birahmatik, wa la takilna ila anfusina tarfata 'ainiw-wa la aqalla min zalik, ya ni'mal-mujib. Wa sallallahu 'ala saiyidina Muhammadinin-nabiyyil-karimi wa 'ala alihi wa sahbihi ajma'in.",
		"ar": "اللَّهُمَّ إِنَّا نَسْأَلُكَ لِسَانًا رَطِبًا بِذِكْرِكَ، وَقَلْبًا مُفْعَمًا بِشُكْرِكَ، وَبَدَنًا هَيِّنًا لَيِّنًا بِطَاعَتِكَ. اللَّهُمَّ إِنَّا نَسْأَلُكَ إِيمَانًا كَامِلًا، وَنَسْأَلُكَ قَلْبًا خَاشِعًا، وَنَسْأَلُكَ عِلْمًا نَافِعًا، وَنَسْأَلُكَ يَقِينًا صَادِقًا، وَنَسْأَلُكَ دِينًا قَيِّمًا، وَنَسْأَلُكَ الْعَافِيَةَ مِنْ كُلِّ بَلِيَّةٍ، وَنَسْأَلُكَ تَمَامَ الْغِنَى عَنِ النَّاسِ، وَهَبْ لَنَا حَقِيقَةَ الْإِيمَانِ بِكَ حَتَّى لَا نَخَافَ وَلَا نَرْجُو غَيْرَكَ، وَلَا نَعْبُدَ شَيْئًا سِوَاكَ، وَاجْعَلْ يَدَكَ مَبْسُوطَةً عَلَيْنَا وَعَلَى أَهْلِينَا وَأَوْلَادِنَا وَمَنْ مَعَنَا بِرَحْمَتِكَ، وَلَا تَكِلْنَا إِلَى أَنْفُسِنَا طَرْفَةَ عَيْنٍ وَلَا أَقَلَّ مِنْ ذَلِكَ، يَا نِعْمَ الْمُجِيبُ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ النَّبِيِّ الْكَرِيمِ وَعَلَى آلِهِ وَصَحْبِهِ أَجْمَعِينَ.",
		"bm": "Ya Allah, kami memohon kepada-Mu lidah yang sentiasa basah berzikir kepada-Mu, hati yang dipenuhi kesyukuran kepada-Mu, dan tubuh yang ringan lagi mudah mentaati-Mu. Ya Allah, kami memohon iman yang sempurna, hati yang khusyuk, ilmu yang bermanfaat, keyakinan yang benar, agama yang lurus, keselamatan daripada setiap bencana, dan kecukupan sepenuhnya daripada bergantung kepada manusia. Kurniakanlah kepada kami hakikat iman kepada-Mu sehingga kami tidak takut dan tidak berharap kepada selain-Mu, dan tidak menyembah sesuatu selain-Mu. Bentangkanlah tangan rahmat-Mu ke atas kami, keluarga kami, anak-anak kami dan sesiapa yang bersama kami; dan janganlah Engkau serahkan kami kepada diri kami sendiri walau sekelip mata, mahupun kurang daripada itu, wahai sebaik-baik yang memperkenankan doa. Selawat Allah ke atas penghulu kami Muhammad, nabi yang mulia, serta keluarga dan seluruh sahabatnya."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "quran",
		"tajuk": "Ali 'Imran 26–27",
		"bi": "Say: 'O Allah, Owner of all sovereignty! You give sovereignty to whom You will and take it from whom You will; You honour whom You will and humble whom You will. In Your hand is all good; indeed, You are Able to do all things. You merge the night into the day and the day into the night; You bring the living out of the dead and the dead out of the living; and You provide for whom You will without measure.'",
		"info": "Ayat kerajaan — pengakuan bahawa segala kekuasaan, kemuliaan dan rezeki di tangan Allah semata-mata.",
		"rumi": "Qulillahumma malikal-mulki tu'til-mulka man tasya'u wa tanzi'ul-mulka mimman tasya', wa tu'izzu man tasya'u wa tuzillu man tasya', biyadikal-khair, innaka 'ala kulli syai'in qadir. Tulijul-laila fin-nahari wa tulijun-nahara fil-lail, wa tukhrijul-haiya minal-maiyiti wa tukhrijul-maiyita minal-haiy, wa tarzuqu man tasya'u bighairi hisab.",
		"ar": "قُلِ ٱللَّهُمَّ مَـٰلِكَ ٱلْمُلْكِ تُؤْتِى ٱلْمُلْكَ مَن تَشَآءُ وَتَنزِعُ ٱلْمُلْكَ مِمَّن تَشَآءُ وَتُعِزُّ مَن تَشَآءُ وَتُذِلُّ مَن تَشَآءُ ۖ بِيَدِكَ ٱلْخَيْرُ ۖ إِنَّكَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌۭ ﴿٢٦﴾ تُولِجُ ٱلَّيْلَ فِى ٱلنَّهَارِ وَتُولِجُ ٱلنَّهَارَ فِى ٱلَّيْلِ ۖ وَتُخْرِجُ ٱلْحَىَّ مِنَ ٱلْمَيِّتِ وَتُخْرِجُ ٱلْمَيِّتَ مِنَ ٱلْحَىِّ ۖ وَتَرْزُقُ مَن تَشَآءُ بِغَيْرِ حِسَابٍۢ ﴿٢٧﴾",
		"bm": "Katakanlah: Ya Allah, Pemilik segala kerajaan! Engkau berikan kerajaan kepada sesiapa yang Engkau kehendaki dan Engkau cabut kerajaan daripada sesiapa yang Engkau kehendaki; Engkau muliakan sesiapa yang Engkau kehendaki dan Engkau hinakan sesiapa yang Engkau kehendaki. Di tangan-Mu segala kebaikan; sesungguhnya Engkau Maha Berkuasa atas segala sesuatu. Engkau masukkan malam ke dalam siang dan siang ke dalam malam; Engkau keluarkan yang hidup daripada yang mati dan yang mati daripada yang hidup; dan Engkau kurniakan rezeki kepada sesiapa yang Engkau kehendaki tanpa hisab."
	},
	{
		"reps": {
			"s": 1,
			"k": 1
		},
		"jenis": "doa",
		"tajuk": "Doa Rabitah",
		"bi": "O Allah, You know that these hearts have gathered upon love of You, met in obedience to You, united upon Your call, and pledged to support Your Sacred Law. So strengthen, O Allah, their bond; make their affection lasting; guide them along their paths; fill them with Your light that never fades; expand their breasts with the abundance of faith in You and beautiful trust in You; give them life through knowing You; and let them die as martyrs in Your path. Indeed, You are the Best Protector and the Best Helper. And send blessings and peace, O Allah, upon our master Muhammad, his family and his companions; and all praise is for Allah, Lord of all the worlds.",
		"info": "Doa Rabitah susunan Imam Hasan al-Banna, pengikat hati-hati orang beriman atas kecintaan, ketaatan dan dakwah — penutup Al-Ma'thurat.",
		"rumi": "Allahumma innaka ta'lamu anna hazihil-quluba qadij-tama'at 'ala mahabbatik, wal-taqat 'ala ta'atik, wa tawahhadat 'ala da'watik, wa ta'ahadat 'ala nusrati syari'atik. Fawassiqillahumma rabitataha, wa adim wuddaha, wahdiha subulaha, wamla'ha binurikal-lazi la yakhbu, wasyrah suduraha bifaidil-imani bika wa jamilit-tawakkuli 'alaik, wa ahyiha bima'rifatik, wa amit-ha 'alasy-syahadati fi sabilik, innaka ni'mal-maula wa ni'man-nasir. Wa sallallahu 'ala saiyidina Muhammadiw-wa 'ala alihi wa sahbihi wa sallam, wal-hamdu lillahi rabbil-'alamin.",
		"ar": "الْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ، وَالصَّلَاةٌ وَالسَّلَامُ عَلَى أَشْرَفِ الْأَنْبِيَاءِ وَالْمُرْسَلِينَ، وَعَلَى ءَالِهِ وَصَحْبِهِ أَجْمَعِينِ. اللَّهُمَّ إِنَّكَ تَعْلَمُ أَنَّ هَذِهِ الْقُلُوبَ قَدِ اجْتَمَعَتْ عَلَى مَحَبَّتِكَ، وَالْتَقَتْ عَلَى طَاعَتِكَ، وَتَوَحَّدَتْ عَلَى دَعْوَتِكَ، وَتَعَاهَدَتْ عَلَى نُصْرَةِ شَرِيعَتِكَ، فَوَثِّقِ اللَّهُمَّ رَابِطَتَهَا ﴿٣×﴾، وَأَدِمْ وُدَّهَا، وَاهْدِهَا سُبُلَهَا، وَامْلَأْهَا بِنُورِكَ الَّذِي لَا يَخْبُو، وَاشْرَحْ صُدُورَهَا بِفَيْضِ الْإِيمَانِ بِكَ وَجَمِيلِ التَّوَكُّلِ عَلَيْكَ، وَأَحْيِهَا بِمَعْرِفَتِكَ، وَأَمِتْهَا عَلَى الشَّهَادَةِ فِي سَبِيلِكَ، إِنَّكَ نِعْمَ الْمَوْلَى وَنِعْمَ النَّصِيرُ، وَصَلَّى اللَّهُ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِهِ وَصَحْبِهِ وَسَلَّمَ، وَالْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ.",
		"bm": "Segala puji bagi Allah, Tuhan Semesta Alam, dan selawat dan salam ke atas nabi dan rasul yang paling mulia, dan ke atas keluarganya dan semua sahabatnya. Ya Allah, sesungguhnya Engkau mengetahui bahawa hati-hati ini telah berhimpun atas kecintaan kepada-Mu, bertemu atas ketaatan kepada-Mu, bersatu atas dakwah-Mu, dan berjanji setia menegakkan syariat-Mu. Maka eratkanlah, ya Allah, ikatannya; kekalkanlah kasih sayangnya; tunjukkanlah jalan-jalannya; penuhilah ia dengan cahaya-Mu yang tidak pernah padam; lapangkanlah dadanya dengan limpahan iman kepada-Mu dan keindahan tawakal kepada-Mu; hidupkanlah ia dengan makrifat-Mu; dan matikanlah ia dalam keadaan syahid di jalan-Mu. Sesungguhnya Engkau sebaik-baik Pelindung dan sebaik-baik Penolong. Selawat dan salam Allah ke atas penghulu kami Muhammad, keluarga dan para sahabatnya; dan segala puji bagi Allah, Tuhan sekalian alam."
	}
];
