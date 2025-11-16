# Weather MVVM — React Native (Expo) Technical Challenge

## Overview

A small React Native (Expo) app that fetches weather for a city (VisualCrossing) and displays temperature, humidity, wind speed, and conditions. It follows MVVM architecture and includes offline caching, debounced search, pull-to-refresh, and dark mode.

## Features

- Search by city (debounced search)
- Displays: temperature (°C), humidity, wind speed, and conditions
- Offline caching of last successful search (AsyncStorage)
- Pull-to-refresh in details view
- Dark mode support (system)
- MVVM architecture: `models/`, `services/`, `viewmodels/`, `views/screens/`
- Error handling for network/API issues and invalid city names

## Tech

- Expo (managed) + TypeScript
- React Navigation (native stack)
- AsyncStorage
- Fetch API
- VisualCrossing Weather API

## Setup & Run (local)

1. Clone the repo:

   ```bash
   git clone <your-repo-url>
   cd WeatherMVVM
   ```

2. install dependencies:

   ```bash
   npm install
   npx expo install
   ```

3. Add VisualCrossing API key:

   ```bash
   Get a key from https://www.visualcrossing.com
   Add to .env or set EXPO_PUBLIC_VISUALCROSSING_KEY in your environment.
   ```

Alternatively, place the key in app.json under expo.extra then access via process.env.EXPO_PUBLIC_VISUALCROSSING_KEY.

4. Start the app:

   ```bash
   npx expo start
   Open in Expo Go (Android/iOS) or a simulator.
   ```
