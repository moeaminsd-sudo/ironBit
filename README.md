# IronBit (Android)

Pixel-art, fully offline gym app for Dubai. The app has no INTERNET permission: the UI, fonts, food data and gym map are bundled in `app/src/main/assets/`.

## Get the APK (no Android Studio needed)

1. Create a free GitHub account and a new **empty** repository.
2. Upload the contents of this folder to it (or let Claude push it for you).
3. Open the repo's **Actions** tab. The "Build IronBit APK" workflow runs on every push (about 3–5 minutes).
4. Open the finished run, download **IronBit-apk**, unzip it and copy `app-debug.apk` to your phone.
5. On the phone, open the file and allow "Install unknown apps" for your file manager when asked.

## Build locally instead

Open the folder in Android Studio and press Run, or run `gradle assembleDebug` with the Android SDK installed.

## Before Play Store release

- Replace the sample gym list and prices with real data.
- Set the real donation flow (Google Play may require tips to go through Play Billing).
- Build a signed release bundle (`gradle bundleRelease`) with your own upload key.
