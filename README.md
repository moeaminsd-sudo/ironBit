# IronBit (Android) · v0.6

Pixel-art gym app. Training, food, muscle map, calendar and gym maps run offline from bundled files in `app/src/main/assets/`. The club, leaderboard and ideas use demo data until the online version is added. The weather card is the only feature that uses the internet; without a connection it simply hides.

## Get the APK (no Android Studio needed)

1. Create a free GitHub account and a new **empty** repository.
2. Upload the contents of this folder to it (or let Claude push it for you).
3. Open the repo's **Actions** tab. The "Build IronBit APK" workflow runs on every push (about 3–5 minutes).
4. Open the finished run, download **IronBit-apk**, unzip it and copy `app-debug.apk` to your phone.
5. On the phone, open the file and allow "Install unknown apps" for your file manager when asked.

## Music controls

IronBit can show and control whatever is playing (Spotify, Anghami, YouTube Music and others). Android asks once for **notification access**; IronBit uses it only to find the active music player and never reads or stores notifications.

## Custom art

Drop your PNGs into `app/src/main/assets/art/` and list their names (without `.png`) in `art/manifest.json`. Anything listed replaces the built-in drawing with the same name. See the IronBit Art Kit for names and sizes.

## Build locally instead

Open the folder in Android Studio and press Run, or run `gradle assembleDebug` with the Android SDK installed.

## Before Play Store release

- Replace the sample gym list and prices with real data.
- Connect the club, leaderboard and ideas to an online backend (e.g. Firebase).
- Add your Amazon Associates tag (`AFF_TAG` in `index.html`) and Amazon's affiliate disclosure stays on the shop page.
- Set the real donation flow (Google Play may require tips to go through Play Billing).
- Build a signed release bundle (`gradle bundleRelease`) with your own upload key.
