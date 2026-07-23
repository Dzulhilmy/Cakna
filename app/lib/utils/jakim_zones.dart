import 'dart:math' as math;

/// The complete official JAKIM e-Solat zone table (60 zones covering every
/// Malaysian state), each with the official Malay area description and a
/// representative coordinate (the main named town) so the nearest zone can be
/// auto-picked from GPS. Every code verified live against the e-Solat API on
/// 2026-07-08 (note: Gua Musang is KTN02 — the old KTN03 code is dead).
/// Official prayer times come from the zone takwim, not per-city astronomy.
class JakimZone {
  final String state;
  final String code; // e.g. WLY01
  final String area; // official JAKIM "Kawasan" description
  final double lat, lng;
  const JakimZone(this.state, this.code, this.area, this.lat, this.lng);

  String get label => '$code · $area';

  /// Short display name: the first named town of the area (state name for
  /// whole-state zones).
  String get shortName {
    if (area.startsWith('Seluruh Negeri')) return state;
    final t = area.contains(': ') ? area.split(': ').last : area;
    return t.split(',').first.trim();
  }
}

class JakimZones {
  static const all = <JakimZone>[
    // Johor
    JakimZone('Johor', 'JHR01', 'Pulau Aur dan Pulau Pemanggil', 2.4585, 104.5211),
    JakimZone('Johor', 'JHR02', 'Johor Bahru, Kota Tinggi, Mersing, Kulai', 1.4927, 103.7414),
    JakimZone('Johor', 'JHR03', 'Kluang, Pontian', 2.0257, 103.3185),
    JakimZone('Johor', 'JHR04', 'Batu Pahat, Muar, Segamat, Gemas Johor, Tangkak', 1.8548, 102.9325),
    // Kedah
    JakimZone('Kedah', 'KDH01', 'Kota Setar, Kubang Pasu, Pokok Sena', 6.1248, 100.3678),
    JakimZone('Kedah', 'KDH02', 'Kuala Muda, Yan, Pendang', 5.6470, 100.4877),
    JakimZone('Kedah', 'KDH03', 'Padang Terap, Sik', 6.2486, 100.6086),
    JakimZone('Kedah', 'KDH04', 'Baling', 5.6753, 100.9186),
    JakimZone('Kedah', 'KDH05', 'Bandar Baharu, Kulim', 5.3654, 100.5610),
    JakimZone('Kedah', 'KDH06', 'Langkawi', 6.3227, 99.8511),
    JakimZone('Kedah', 'KDH07', 'Puncak Gunung Jerai', 5.7889, 100.4340),
    // Kelantan
    JakimZone('Kelantan', 'KTN01',
        'Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai, Mukim Chiku',
        6.1254, 102.2381),
    JakimZone('Kelantan', 'KTN02', 'Gua Musang (Galas dan Bertam), Jeli, Jajahan Kecil Lojing',
        4.8840, 101.9686),
    // Melaka
    JakimZone('Melaka', 'MLK01', 'Seluruh Negeri Melaka', 2.1896, 102.2501),
    // Negeri Sembilan
    JakimZone('Negeri Sembilan', 'NGS01', 'Tampin, Jempol', 2.4675, 102.2290),
    JakimZone('Negeri Sembilan', 'NGS02', 'Jelebu, Kuala Pilah, Rembau', 2.7375, 102.2515),
    JakimZone('Negeri Sembilan', 'NGS03', 'Port Dickson, Seremban', 2.7297, 101.9381),
    // Pahang
    JakimZone('Pahang', 'PHG01', 'Pulau Tioman', 2.8167, 104.1667),
    JakimZone('Pahang', 'PHG02', 'Kuantan, Pekan, Muadzam Shah', 3.8077, 103.3260),
    JakimZone('Pahang', 'PHG03', 'Jerantut, Temerloh, Maran, Bera, Chenor, Jengka', 3.4494, 102.4210),
    JakimZone('Pahang', 'PHG04', 'Bentong, Lipis, Raub', 3.5222, 101.9086),
    JakimZone('Pahang', 'PHG05', 'Genting Sempah, Janda Baik, Bukit Tinggi', 3.3667, 101.8500),
    JakimZone('Pahang', 'PHG06', 'Cameron Highlands, Genting Highlands, Bukit Fraser',
        4.4699, 101.3831),
    JakimZone('Pahang', 'PHG07', 'Zon Khas Daerah Rompin (Rompin, Endau, Pontian)', 2.8064, 103.4870),
    // Perak
    JakimZone('Perak', 'PRK01', 'Tapah, Slim River, Tanjung Malim', 4.1993, 101.2610),
    JakimZone('Perak', 'PRK02', 'Kuala Kangsar, Sg. Siput, Ipoh, Batu Gajah, Kampar',
        4.5975, 101.0901),
    JakimZone('Perak', 'PRK03', 'Lenggong, Pengkalan Hulu, Grik', 5.4260, 101.1290),
    JakimZone('Perak', 'PRK04', 'Temengor, Belum', 5.5500, 101.3600),
    JakimZone('Perak', 'PRK05',
        'Kg Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor',
        4.0259, 101.0213),
    JakimZone('Perak', 'PRK06', 'Selama, Taiping, Bagan Serai, Parit Buntar', 4.8500, 100.7333),
    JakimZone('Perak', 'PRK07', 'Bukit Larut', 4.8600, 100.7950),
    // Perlis
    JakimZone('Perlis', 'PLS01', 'Seluruh Negeri Perlis', 6.4414, 100.1986),
    // Pulau Pinang
    JakimZone('Pulau Pinang', 'PNG01', 'Seluruh Negeri Pulau Pinang', 5.4141, 100.3288),
    // Sabah
    JakimZone('Sabah', 'SBH01',
        'Bahagian Sandakan (Timur): Bandar Sandakan, Bukit Garam, Semawang, Temanggong, Tambisan, Sukau',
        5.8402, 118.1179),
    JakimZone('Sabah', 'SBH02',
        'Bahagian Sandakan (Barat): Beluran, Telupid, Pinangah, Terusan, Kuamut', 5.9500, 117.5833),
    JakimZone('Sabah', 'SBH03',
        'Bahagian Tawau (Timur): Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku',
        5.0270, 118.3270),
    JakimZone('Sabah', 'SBH04',
        'Bahagian Tawau (Barat): Bandar Tawau, Balong, Merotai, Kalabakan', 4.2445, 117.8912),
    JakimZone('Sabah', 'SBH05', 'Bahagian Kudat: Kudat, Kota Marudu, Pitas, Pulau Banggi',
        6.8837, 116.8467),
    JakimZone('Sabah', 'SBH06', 'Gunung Kinabalu', 6.0750, 116.5583),
    JakimZone('Sabah', 'SBH07',
        'Bahagian Pantai Barat: Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar, Putatan',
        5.9804, 116.0735),
    JakimZone('Sabah', 'SBH08',
        'Bahagian Pendalaman (Atas): Pensiangan, Keningau, Tambunan, Nabawan', 5.3378, 116.1602),
    JakimZone('Sabah', 'SBH09',
        'Bahagian Pendalaman (Bawah): Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pasia, Membakut, Weston',
        5.3474, 115.7455),
    // Sarawak
    JakimZone('Sarawak', 'SWK01', 'Limbang, Lawas, Sundar, Trusan', 4.7554, 115.0080),
    JakimZone('Sarawak', 'SWK02', 'Miri, Niah, Bekenu, Sibuti, Marudi', 4.3995, 113.9914),
    JakimZone('Sarawak', 'SWK03', 'Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu', 3.1710, 113.0410),
    JakimZone('Sarawak', 'SWK04',
        'Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit', 2.2870, 111.8308),
    JakimZone('Sarawak', 'SWK05', 'Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai',
        2.1276, 111.5195),
    JakimZone('Sarawak', 'SWK06',
        'Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong, Spaoh, Pusa, Saratok',
        1.2372, 111.4630),
    JakimZone('Sarawak', 'SWK07', 'Serian, Simunjan, Samarahan, Sebuyau, Meludam', 1.1667, 110.5667),
    JakimZone('Sarawak', 'SWK08', 'Kuching, Bau, Lundu, Sematan', 1.5535, 110.3593),
    JakimZone('Sarawak', 'SWK09', 'Zon Khas (Kampung Patarikan)', 2.0200, 113.9000),
    // Selangor
    JakimZone('Selangor', 'SGR01',
        'Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Shah Alam', 3.0733, 101.5185),
    JakimZone('Selangor', 'SGR02', 'Kuala Selangor, Sabak Bernam', 3.3400, 101.2500),
    JakimZone('Selangor', 'SGR03', 'Klang, Kuala Langat', 3.0333, 101.4500),
    // Terengganu
    JakimZone('Terengganu', 'TRG01', 'Kuala Terengganu, Marang, Kuala Nerus', 5.3302, 103.1408),
    JakimZone('Terengganu', 'TRG02', 'Besut, Setiu', 5.7500, 102.5500),
    JakimZone('Terengganu', 'TRG03', 'Hulu Terengganu', 5.0630, 102.9250),
    JakimZone('Terengganu', 'TRG04', 'Dungun, Kemaman', 4.7570, 103.4200),
    // Wilayah Persekutuan
    JakimZone('Wilayah Persekutuan', 'WLY01', 'Kuala Lumpur, Putrajaya', 3.1390, 101.6869),
    JakimZone('Wilayah Persekutuan', 'WLY02', 'Labuan', 5.2831, 115.2308),
  ];

  /// Zones grouped by state, preserving the order above (for the picker).
  static Map<String, List<JakimZone>> get byState {
    final out = <String, List<JakimZone>>{};
    for (final z in all) {
      (out[z.state] ??= []).add(z);
    }
    return out;
  }

  /// Nearest zone (great-circle) to a coordinate — used to auto-select a zone
  /// from GPS. Falls back to Kuala Lumpur.
  static JakimZone nearest(double lat, double lng) {
    JakimZone best = byCode('WLY01')!;
    var bestD = double.infinity;
    for (final z in all) {
      final d = _haversine(lat, lng, z.lat, z.lng);
      if (d < bestD) {
        bestD = d;
        best = z;
      }
    }
    return best;
  }

  static JakimZone? byCode(String code) {
    for (final z in all) {
      if (z.code == code) return z;
    }
    return null;
  }

  static double _haversine(double la1, double lo1, double la2, double lo2) {
    const r = 6371.0;
    const rad = math.pi / 180;
    final dLa = (la2 - la1) * rad, dLo = (lo2 - lo1) * rad;
    final a = math.sin(dLa / 2) * math.sin(dLa / 2) +
        math.cos(la1 * rad) * math.cos(la2 * rad) * math.sin(dLo / 2) * math.sin(dLo / 2);
    return r * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a));
  }
}
