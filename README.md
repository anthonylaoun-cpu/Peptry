# LooksMax AI - React Native App

A next-generation AI aesthetics mobile app that provides data-driven insights on facial and body features through advanced AI analysis.

## Features

- **Face Scanner**: AI-powered facial analysis evaluating jawline, symmetry, skin clarity, eye area, and more
- **Body Scanner**: Comprehensive body analysis including body fat estimation, muscle definition, and proportions
- **Premium Paywall**: Results locked until premium subscription (€3.99/week)
- **Native Camera**: Use device camera or photo library for scanning
- **Futuristic UI**: Dark theme with purple gradients and neon effects

## Tech Stack

- **Framework**: Expo / React Native
- **Navigation**: Expo Router
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Animations**: React Native Reanimated
- **Icons**: Expo Vector Icons (Ionicons)
- **Storage**: AsyncStorage

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on device/simulator:
- Press `i` for iOS Simulator
- Press `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

## Project Structure

```
├── app/
│   ├── _layout.tsx      # Root layout
│   ├── index.tsx        # Auth screen
│   ├── dashboard.tsx    # Main dashboard
│   ├── scanner.tsx      # Camera/upload scanner
│   ├── results.tsx      # Analysis results
│   └── paywall.tsx      # Premium subscription
├── assets/              # App icons and splash
├── global.css           # TailwindCSS styles
└── app.json             # Expo configuration
```

## Screens

1. **Auth Screen** (`/`) - Google, Apple, Email sign-in
2. **Dashboard** (`/dashboard`) - Face & Body scanner options
3. **Scanner** (`/scanner?type=face|body`) - Camera or upload
4. **Results** (`/results?type=face|body`) - Score and metrics
5. **Paywall** (`/paywall`) - Premium unlock

## Building for Production

### iOS
```bash
npx expo build:ios
```

### Android
```bash
npx expo build:android
```

## Adding App Icons

Place these files in the `assets/` folder:
- `icon.png` - 1024x1024 app icon
- `splash.png` - 1284x2778 splash screen
- `adaptive-icon.png` - 1024x1024 Android adaptive icon
- `favicon.png` - 48x48 web favicon

## License

MIT License

## Disclaimer

This application provides educational content only. It does not provide medical advice, prescriptions, or treatment recommendations.
