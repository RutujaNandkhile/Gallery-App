# Gallery App — React Native Intern Assignment

A React Native (Expo) + TypeScript app implementing registration, login,
session persistence, an image gallery with search/filter/pagination,
favorites, a full-screen image viewer with download, and profile
management — built around a centralized Context API state layer.

---

## 1. Requirements

- Node.js 18 or newer
- npm (comes with Node) or yarn
- A phone with the **Expo Go** app installed (App Store / Play Store), **or**
  Android Studio / Xcode if you'd rather use an emulator/simulator
- Internet connection (the gallery pulls images from `picsum.photos`)

---

## 2. Setup & Run

```bash
# 1. Unzip the project and move into it
cd GalleryApp

# 2. Install dependencies
npm install

# 3. Start the Metro bundler
npx expo start
```

This opens a screen in your terminal (and a browser tab) with a QR code.

- **On a physical phone:** open the **Expo Go** app and scan the QR code
  (Android: in-app scanner; iOS: use the Camera app, it will prompt to open
  in Expo Go). The phone and computer must be on the same Wi-Fi network.
- **On Android emulator:** press `a` in the terminal where Metro is running.
- **On iOS simulator (Mac only):** press `i` in the terminal.
- **In a browser (quickest sanity check, some native features like
  save-to-gallery won't work):** press `w`.

The first launch takes a little longer while the JS bundle is built.

### Test the flow
1. Register a new account (all fields are validated).
2. You're logged in automatically and land on the Gallery tab.
3. Browse, search by author, filter A–M / N–Z, scroll to load more, pull
   down to refresh, tap ♡ to favorite.
4. Tap an image to open full-screen details and download it.
5. Check the Favorites tab, then Profile to edit your info, switch dark
   mode, or log out.
6. Close and reopen the app — you'll still be logged in (session
   persistence via AsyncStorage).

---

## 3. Building an APK (optional)

This project uses **EAS Build** (Expo's cloud build service) since it
avoids needing a local Android SDK setup.

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

EAS will give you a download link for the finished `.apk` once the cloud
build finishes (usually a few minutes). Alternatively, run
`npx expo prebuild` to generate a native `android/` folder and build
locally with `./gradlew assembleRelease` if you already have Android
Studio set up.

---

## 4. Libraries Used

| Library | Purpose |
|---|---|
| `expo` | Managed React Native runtime — avoids native build config for this assignment |
| `@react-navigation/native`, `native-stack`, `bottom-tabs` | Navigation: auth stack, bottom tabs, per-tab stacks |
| `@react-native-async-storage/async-storage` | Local persistence: users, session, favorites, theme |
| `@react-native-picker/picker` | Native dropdown for City selection |
| `expo-file-system` | Downloads full-size images to local cache before saving |
| `expo-media-library` | Saves downloaded images into the device's photo gallery |
| `expo-sharing` | Web fallback share sheet (MediaLibrary isn't available on web) |
| `react-native-gesture-handler`, `react-native-screens`, `react-native-safe-area-context` | Required peer libraries for React Navigation |
| TypeScript | Static typing across the whole app |

State management is handled with the built-in **Context API**
(`AuthContext`, `FavoritesContext`, `ThemeContext`) rather than an extra
library, since the app's shared state (session, favorites, theme) is small
and doesn't need Redux-style middleware.

---

## 5. Folder Structure

```
GalleryApp/
├── App.tsx                  # Composition root: wraps providers + navigator
├── src/
│   ├── components/          # Reusable, presentation-only UI pieces
│   │   ├── EmptyState.tsx
│   │   ├── FilterChips.tsx
│   │   ├── FormInput.tsx
│   │   ├── ImageCard.tsx
│   │   ├── Loader.tsx
│   │   ├── PrimaryButton.tsx
│   │   └── SearchBar.tsx
│   ├── context/              # Centralized state management (Context API)
│   │   ├── AuthContext.tsx        # register/login/logout, session, profile
│   │   ├── FavoritesContext.tsx   # per-user favorite image ids
│   │   └── ThemeContext.tsx       # light/dark mode
│   ├── hooks/                # Reusable custom hooks
│   │   ├── useDebounce.ts
│   │   └── usePaginatedImages.ts  # fetch + infinite scroll + refresh
│   ├── navigation/
│   │   ├── AuthStack.tsx     # Login / Register
│   │   ├── AppTabs.tsx       # Gallery / Favorites / Profile tabs
│   │   ├── RootNavigator.tsx # Switches Auth vs App based on session
│   │   └── types.ts          # Navigation param list types
│   ├── screens/
│   │   ├── RegisterScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx          # gallery, search, filter, pagination
│   │   ├── FavoritesScreen.tsx
│   │   ├── ImageDetailsScreen.tsx  # full screen viewer + download
│   │   └── ProfileScreen.tsx
│   ├── services/
│   │   ├── api.ts                # picsum.photos fetch wrapper
│   │   ├── favoritesLookup.ts    # resolves favorite ids -> full image data
│   │   └── storage.ts            # single source of truth for AsyncStorage keys
│   ├── theme/
│   │   └── colors.ts             # light/dark color tokens
│   ├── types/
│   │   └── index.ts              # shared TS interfaces & enums
│   └── utils/
│       └── validation.ts         # form validation + password hashing
├── app.json
├── babel.config.js
├── package.json
└── tsconfig.json
```

**Why this structure:** screens stay thin (layout + wiring), business logic
lives in `context/`, `hooks/`, and `services/`, and `components/` holds
only reusable, dumb UI. This keeps any single file small and avoids prop
drilling — screens read what they need directly from context via hooks
like `useAuth()` and `useFavorites()`.

---

## 6. Assumptions Made

- **No real backend.** "Registration" and "login" are simulated entirely
  with AsyncStorage. Passwords are run through a small local hash function
  before being stored (see `utils/validation.ts`) — this is **not**
  cryptographically secure and is only meant to avoid storing plaintext
  passwords for this offline demo. A production app would authenticate
  against a real server.
- **Favorites are scoped per user account** (keyed by email), so logging in
  as a different user shows that user's own favorites.
- **Image IDs from `picsum.photos/v2/list`** are used both as unique keys
  and to build thumbnail/full-size URLs via `picsum.photos/id/{id}/...`,
  since the list endpoint's `download_url` already points at a specific
  fixed size.
- **Filter (A–M / N–Z)** is implemented as author-name-initial buckets, as
  suggested in the assignment brief; search and filter apply together on
  top of whatever pages have been loaded so far.
- **Pagination only advances while no search/filter is active** — once the
  user searches or filters, "load more" pauses so infinite scroll doesn't
  fetch pages that immediately get filtered away; scrolling further just
  reveals more of what's already loaded that matches.
- **Download-to-gallery** uses `expo-media-library`, which requires a
  physical device or emulator with Photos/Media permissions — it falls
  back to the share sheet on web, where that API isn't available.

---

## 7. Bonus Features Implemented

- ✅ Profile avatar selection (emoji-based avatar set)
- ✅ Dark mode support (persisted, toggle in Profile)
- ✅ Debounced search (`useDebounce` hook, 350ms)
- ✅ Reusable components (`FormInput`, `PrimaryButton`, `SearchBar`, `ImageCard`, etc.)
- ✅ Custom hooks for API/pagination (`usePaginatedImages`) and search debounce (`useDebounce`)
- ✅ Pull-to-refresh with duplicate-call prevention (`requestInFlight` guard in `usePaginatedImages`)
