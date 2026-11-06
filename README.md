# IronBit (Android) · v0.8

**Get fit, bit by bit.** A free, pixel-art gym app with no ads and no login. Everything runs from files inside the app, so it works offline anywhere in the world.

## Features

- **Training:** routines with an animated pixel character, a routine generator, a muscle map, a routine builder, a calendar and a streak tracker.
- **Food:** protein and calorie targets, nutrition facts for every food, a plate calculator, and 110 gym recipes with search, filters and a shopping list.
- **Progress:** XP and 120 levels, stats charts, a weight log and a daily briefing.
- **Rewards:** coins, 4 kinds of chests, an item shop, outfits, room decor, keyboard skins and event themes.
- **Leagues:** 10 leagues with monthly promotion, a weekly knockout at the top, and weekly and all-time leaderboards.
- **Merlift the wizard:** the most jacked wizard ever seen. He visits rarely with stats, tips and jokes, and sends the odd reminder notification.
- **Extras:**
  - pixel keyboard with English, Arabic and emojis
  - notes
  - follows
  - backup export and import
  - music controls
  - weather in your city

## Internet use

Internet is only used for the weather card. The club, leagues and follows use demo players until the online version is added.

## Get the APK (no Android Studio needed)

1. Upload the contents of this folder to this repository. Skip the `.github` folder after the first upload so the build doesn't run twice.
2. Open the **Actions** tab. The "Build IronBit APK" workflow runs on every push and takes about 3–5 minutes.
3. Open the finished run, download **IronBit-apk**, unzip it and copy `app-debug.apk` to your phone.
4. On the phone, open the file and allow "Install unknown apps" when asked.

## Build locally instead

Open the folder in Android Studio (**File → Open**), let it finish its first setup, then press **Run ▶** with a phone connected or an emulator running. The app's code is in `app/src/main/assets/index.html`. `MainActivity.java` handles the phone features.

## Custom art

Put PNGs in `app/src/main/assets/art/` and list their names (without `.png`) in `art/manifest.json`. Each one replaces the built-in drawing with the same name.

## Before Play Store release

- Replace the sample gym list and prices with real data.
- Connect the club, leagues and follows to an online backend (Firebase), with optional Google sign-in.
- Set up the coin packs in Google Play Billing.
- Add your Amazon Associates tag (`AFF_TAG` in `index.html`) for the gear shop.
- Build a signed release bundle (`gradle bundleRelease`) with your own upload key.

## Feedback

Report bugs and suggest features from **Settings → Help IronBit grow** in the app.
