# Cakna — release build

## Android (Play Store)

### One-time setup
Signing secrets are **git-ignored** — recreate them on a new machine:

1. Generate an upload keystore (keep it safe — losing it means you can't update the app):
   ```
   keytool -genkeypair -v -keystore android/app/cakna-upload.jks \
     -keyalg RSA -keysize 2048 -validity 10000 -alias cakna \
     -dname "CN=Cakna, O=QC Group, C=MY"
   ```
2. Create `android/key.properties` (git-ignored):
   ```
   storePassword=<your password>
   keyPassword=<your password>
   keyAlias=cakna
   storeFile=cakna-upload.jks
   ```
   > The committed `cakna-upload.jks` / `key.properties` were placeholders for
   > build verification — **replace them with your own** before publishing.

### Build
```
flutter clean
flutter pub get
flutter build appbundle --release      # -> build/app/outputs/bundle/release/app-release.aab
```
Release config: R8 shrink + resource shrink, core-library desugaring
(required by flutter_local_notifications), ProGuard keep-rules in
`android/app/proguard-rules.pro`.

### Size note (~133 MB AAB)
The bulk is bundled content: `quran.db` (~88 MB) + 604 QCF page-fonts (~91 MB).
`audio_timing.db` was dropped (word-timing karaoke isn't used). If Play size
limits become an issue, move `assets/page_fonts/` to a **Play Asset Delivery**
install-time asset pack.

## iOS (App Store)
Needs a paid Apple Developer account + provisioning (not automatable here):
1. Open `ios/Runner.xcworkspace` in Xcode, set the Team + a real bundle id.
2. Add `ios/Runner/azan.caf` to the Runner target (Build Phases → Copy Bundle
   Resources) so the azan notification sound plays.
3. Product → Archive → distribute to App Store Connect.

## Assets are reproducible
Bundled DB/fonts/images are git-ignored; regenerate with `tool/bundle_assets.sh`
(needs the extracted Tilawah assets present). App icon: `tool/icon/`.
