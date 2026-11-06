# IronBit (Android) · v0.3

Pixel-art gym app. Training, food, muscle map, calendar and gym maps run offline from bundled files in `app/src/main/assets/`. The club, leaderboard and ideas use demo data until the online version is added.

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
- Connect the club, leaderboard and ideas to an online backend (e.g. Firebase).
- Set the real donation flow (Google Play may require tips to go through Play Billing).
- Build a signed release bundle (`gradle bundleRelease`) with your own upload key.
