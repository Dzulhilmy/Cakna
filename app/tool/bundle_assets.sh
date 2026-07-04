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
cp "$src/data/quran.db" "$src/data/"*.json "$here/assets/data/"
cp "$src/fonts/"*.ttf "$here/assets/fonts/"
cp -R "$src/images/"* "$here/assets/images/"
cp "$src/page_fonts/"*.ttf "$here/assets/page_fonts/"
cp "$src/sounds/"*.mp3 "$here/assets/sounds/"
echo "bundled: $(ls "$here/assets/page_fonts" | wc -l | tr -d ' ') page fonts, $(ls "$here/assets/data" | wc -l | tr -d ' ') data files"
