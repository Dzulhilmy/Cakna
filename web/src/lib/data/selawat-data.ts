export type BaitJenis = 'ulang' | 'bait' | 'penutup';

export interface SatuBaris {
	ar: string;
	ms: string;
	en: string;
}

export interface Bait {
	id: number;
	jenis: BaitJenis;
	baris: SatuBaris[];
}

export const SELAWAT_NABI: Bait[] = [
	{
		id: 1,
		jenis: 'ulang',
		baris: [
			{ ar: 'صَلَّى اللَّهُ عَلَى مُحَمَّد', ms: 'Selawat Allah ke atas Muhammad', en: 'Allah sends blessings upon Muhammad' },
			{ ar: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', ms: 'Selawat salam dipohon lagi', en: 'May Allah bless him and grant him peace' }
		]
	},
	{
		id: 2,
		jenis: 'ulang',
		baris: [
			{ ar: 'صَلَّى اللَّهُ عَلَى مُحَمَّد', ms: 'Selawat Allah ke atas Muhammad', en: 'Allah sends blessings upon Muhammad' },
			{ ar: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', ms: 'Selawat salam dipohon lagi', en: 'May Allah bless him and grant him peace' }
		]
	},
	{
		id: 3,
		jenis: 'bait',
		baris: [
			{ ar: 'يَا نَبِيُّ سَلَامٌ عَلَيْكَ', ms: 'Wahai Nabi salam atasmu', en: 'O Prophet, peace be upon you' },
			{ ar: 'يَا رَسُولُ سَلَامٌ عَلَيْكَ', ms: 'Wahai Rasul, salam atasmu', en: 'O Messenger, peace be upon you' }
		]
	},
	{
		id: 4,
		jenis: 'bait',
		baris: [
			{ ar: 'يَاحَبِيبُ سَلَامٌ عَلَيْكَ', ms: 'Wahai kekasih, salam atasmu', en: 'O Beloved, peace be upon you' },
			{ ar: 'صَلَوَاتُ اللَّهِ عَلَيْكَ', ms: 'Selawat Allah ke atasmu', en: "Allah's blessings be upon you" }
		]
	},
	{
		id: 5,
		jenis: 'bait',
		baris: [
			{ ar: 'أَشْرَقَ الْبَدْرُ عَلَيْنَا', ms: 'Bulan purnama menyinari kita', en: 'The full moon has risen over us' },
			{ ar: 'فَاخْتَفَتْ مِنْهُ الْبُدُورُ', ms: 'Hilang segala cahaya (selain cahayamu)', en: 'And all other moons have faded away' }
		]
	},
	{
		id: 6,
		jenis: 'bait',
		baris: [
			{ ar: 'مِثْلَ حُسْنِكَ مَا رَأَيْنَا', ms: 'Indah menawan tak pernah dilihat', en: 'Never have we seen such beauty as yours' },
			{ ar: 'قَطُّ يَا وَجْهَ السُّرُورِ', ms: 'Wahai wajah gembira sepanjang hayat', en: 'O face of joy, never before' }
		]
	},
	{
		id: 7,
		jenis: 'bait',
		baris: [
			{ ar: 'أَنْتَ شَمْسٌ أَنْتَ بَدْرٌ', ms: 'Kaulah matahari, kaulah bulan', en: 'You are the sun, you are the moon' },
			{ ar: 'أَنْتَ نُورٌ فَوْقَ نُورٍ', ms: 'Kaulah cahaya mengatasi cahaya', en: 'You are a light above all light' }
		]
	},
	{
		id: 8,
		jenis: 'bait',
		baris: [
			{ ar: 'أَنْتَ إِكْسِيرٌ وَغَالِي', ms: 'Kaulah rahsia hidup mulia', en: 'You are the elixir and the precious one' },
			{ ar: 'أَنْتَ مِصْبَاحُ الصُّدُورِ', ms: 'Kaulah penyuluh jiwa', en: 'You are the lamp that lights the hearts' }
		]
	},
	{
		id: 9,
		jenis: 'bait',
		baris: [
			{ ar: 'يَا حَبِيبِي يَا مُحَمَّد', ms: 'Wahai kekasihku, ya Muhammad', en: 'O my beloved, O Muhammad' },
			{ ar: 'يَاعَرُوسَ الْخَافِقَيْنِ', ms: 'Wahai pendamping indah sejagat', en: 'O groom of the two horizons' }
		]
	},
	{
		id: 10,
		jenis: 'bait',
		baris: [
			{ ar: 'يَا مُؤَيَّدٌ يَا مُمَجَّدٌ', ms: 'Wahai Nabi dijulang dipuja', en: 'O the supported, O the glorified' },
			{ ar: 'يَا إِمَامَ الْقِبْلَتَيْنِ', ms: 'Wahai imam dua kiblat', en: 'O imam of the two qiblas' }
		]
	},
	{
		id: 11,
		jenis: 'bait',
		baris: [
			{ ar: 'يَا كَرِيمَ الْوَالِدَيْنِ', ms: 'Wahai penghulu keturunan mulia', en: 'O noble of noble parentage' },
			{ ar: 'مَن رَأَى وَجْهَكَ يَسْعَد', ms: 'Bahagialah orang memandang wajahmu', en: 'Whoever sees your face finds happiness' }
		]
	},
	{
		id: 12,
		jenis: 'bait',
		baris: [
			{ ar: 'وَرِدْنَا يَوْمَ النُّشُورِ', ms: 'Kunjungi kami pada hari akhirat', en: 'Grant us your intercession on the Day of Resurrection' },
			{ ar: 'حَوْضُكَ الصَّافِي الْمُبَرَّدِ', ms: 'Kolam airmu sejuk jernih', en: 'From your pool, clear and cool' }
		]
	},
	{
		id: 13,
		jenis: 'bait',
		baris: [
			{ ar: 'بِالسُّرَى إِلَّا إِلَيْكَ', ms: 'Tiada terhenti rindukan selain kepadamu', en: 'In the night journey, none but towards you' },
			{ ar: 'مَا رَأَيْنَا الْعِيسَ حَنَّتْ', ms: 'Sepanjang malam unta berjalan rindukan', en: 'The camels yearning throughout the night' }
		]
	},
	{
		id: 14,
		jenis: 'bait',
		baris: [
			{ ar: 'وَالْمَلَا صَلُّوا عَلَيْكَ', ms: 'Dan para Malaikat turut berselawat', en: 'And the angels also send blessings upon you' },
			{ ar: 'وَالْغَمَامَةُ قَدْ أَظَلَّتْ', ms: 'Engkau dipayungi awan putih', en: 'As the cloud provided you shade' }
		]
	},
	{
		id: 15,
		jenis: 'bait',
		baris: [
			{ ar: 'مُسْتَجِيبُ الدَّعَوَاتِ', ms: 'Dialah yang menyahut semua seruan', en: 'The One who answers all supplications' },
			{ ar: 'عَالِمُ السِّرِّ وَأَخْفَى', ms: 'Allah mengetahui rahsia yang tersembunyi', en: 'The Knower of secrets and what is more hidden' }
		]
	},
	{
		id: 16,
		jenis: 'bait',
		baris: [
			{ ar: 'بِجَمِيعِ الصَّالِحَاتِ', ms: 'Dengan segala amalan soleh', en: 'With all righteous deeds' },
			{ ar: 'رَبِّ إِرْحَمْنَا جَمِيعًا', ms: 'Wahai Tuhan, rahmatilah kami semua', en: 'O Lord, have mercy upon all of us' }
		]
	},
	{
		id: 17,
		jenis: 'bait',
		baris: [
			{ ar: 'عَدَّ تَحْرِيرِ السُّطُورِ', ms: 'Sebanyak baris kertas yang ditulis', en: 'As many as the lines of writing' },
			{ ar: 'وَصَلَاةُ اللَّهِ عَلَى أَحْمَد', ms: 'Dan selawat Allah ke atas Ahmad', en: "And Allah's blessings upon Ahmad" }
		]
	},
	{
		id: 18,
		jenis: 'bait',
		baris: [
			{ ar: 'صَاحِبُ الْوَجْهِ الْمُنِيرِ', ms: 'Empunya wajah berseri menawan', en: 'The owner of the radiant, beautiful face' },
			{ ar: 'أَحْمَدُ الْهَادِي مُحَمَّدٌ', ms: 'Ahmad Muhammad petunjuk jalan', en: 'Ahmad, the Guide, Muhammad' }
		]
	},
	{
		id: 19,
		jenis: 'ulang',
		baris: [
			{ ar: 'صَلَّى اللَّهُ عَلَى مُحَمَّد', ms: 'Selawat Allah ke atas Muhammad', en: 'Allah sends blessings upon Muhammad' },
			{ ar: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', ms: 'Selawat salam dipohon lagi', en: 'May Allah bless him and grant him peace' }
		]
	},
	{
		id: 20,
		jenis: 'ulang',
		baris: [
			{ ar: 'صَلَّى اللَّهُ عَلَى مُحَمَّد', ms: 'Selawat Allah ke atas Muhammad', en: 'Allah sends blessings upon Muhammad' },
			{ ar: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ', ms: 'Selawat salam dipohon lagi', en: 'May Allah bless him and grant him peace' }
		]
	},
	{
		id: 21,
		jenis: 'penutup',
		baris: [
			{
				ar: 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَيْهِ',
				ms: 'Wahai Tuhan, selawat, salam dan keberkatan atasnya',
				en: 'O Allah, bestow blessings, peace and grace upon him'
			}
		]
	}
];
