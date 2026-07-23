#!/usr/bin/env bash
# Copies the Quran content DBs, fonts, images and page-fonts from the extracted
# Tilawah APK into the Flutter app's assets. The large binaries (quran.db,
# audio_timing.db, page_fonts) are git-ignored, so run this after a fresh clone
# before `flutter run`.
set -euo pipefail
here="$(cd "$(dirname "$0")/.." && pwd)"
src="$here/../Tilawah/extracted/assets/flutter_assets/assets"

if [ ! -d "$src" ]; then
  echo "error: extracted Tilawah assets not found at $src" >&2
  exit 1
fi

mkdir -p "$here/assets/"{data,fonts,images,page_fonts,sounds}
# Only the data files the app actually loads — a blanket *.json copy would
# resurrect the dead Tilawah JSONs that were removed from the bundle.
cp "$src/data/quran.db" "$src/data/audio_timing.db" "$here/assets/data/"
cp "$src/data/mathurat.json" "$src/data/rule_detail_"*.json \
   "$src/data/surah_audio_data.json" "$here/assets/data/"
cp "$src/fonts/"*.ttf "$here/assets/fonts/"
cp -R "$src/images/"* "$here/assets/images/"
cp "$src/page_fonts/"*.ttf "$here/assets/page_fonts/"
cp "$src/sounds/"*.mp3 "$here/assets/sounds/"

# The source quran.db ships wrong juz numbers at 4 boundaries and dirty
# name_en values — apply the committed data fixes.
"$here/../tools/fix_quran_db.sh"

echo "bundled: $(ls "$here/assets/page_fonts" | wc -l | tr -d ' ') page fonts, $(ls "$here/assets/data" | wc -l | tr -d ' ') data files"
