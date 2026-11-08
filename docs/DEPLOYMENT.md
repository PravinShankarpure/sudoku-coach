# Sudoku Coach – deployment guide

A Progressive Web App (PWA): one responsive codebase that runs in any modern browser
and installs like a native app on Android, iOS/iPadOS, Windows, macOS, Linux and ChromeOS.
Works fully offline after the first visit.

## Files
- index.html     – the entire app (game, puzzle generator, step-by-step coach)
- manifest.json  – app name, icons and colours used when installing
- sw.js          – service worker for offline play
- icons/         – app icons (incl. maskable icon for Android, Apple touch icon)

## 1. Host it (pick one, all free; HTTPS is required for installing)
- Netlify: drag this folder onto https://app.netlify.com/drop
- GitHub Pages: push the folder to a repo → Settings → Pages → deploy from branch
- Vercel / Cloudflare Pages / Firebase Hosting: deploy the folder as a static site
Test locally: `python3 -m http.server 8080` then open http://localhost:8080

## 2. Install on devices
- Android / Windows / ChromeOS / Linux: open the URL in Chrome or Edge → "Install app"
  (or tap the "Install app" link on the home screen of the app)
- iPhone / iPad: open in Safari → Share → "Add to Home Screen"
- Mac: Safari → File → "Add to Dock", or install from Chrome

## 3. (Optional) Publish to Google Play / Apple App Store
Wrap the same files with Capacitor:
    npm init -y && npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
    npx cap init "Sudoku Coach" com.example.sudokucoach --web-dir=.
    npx cap add android && npx cap add ios
    npx cap open android   # build in Android Studio
    npx cap open ios       # build in Xcode (needs a Mac)
For Play Store only, PWABuilder (https://www.pwabuilder.com) can package the hosted URL directly.

## Updating
After changing files, bump `CACHE` in sw.js (e.g. 'sudoku-coach-v2') so installed apps fetch the new version.
