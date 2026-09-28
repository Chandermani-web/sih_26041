# AR-SAFE — Android Native Prototype (SIH 2026)

**AR-Based Industrial Safety Training Simulator for Jharkhand Mining & Manufacturing Workers**

## Overview
This directory contains the production-grade Android Gradle project implementing:
- **Kotlin 2.0 & Jetpack Compose Material 3**
- **Google ARCore SDK (v1.45.0)** with horizontal plane tracking and hit-testing
- **Sceneview AR / Filament** for lightweight 3D object rendering (fire, smoke, extinguishers, gas plumes)
- **Room Database** for 100% offline local persistence with pending sync queue
- **Localization** for English, Hindi (हिन्दी), and Santali (ᱥᱟᱱᱛᱟᱲᱤ)
- **Rule-Based Scoring Engine** (0-100 pts, 80 pts passing threshold)
- **ZXing QR Code Generator** for verifiable digital certificates

## Package Structure
```
com.arsafe.jharkhand
├── ar/
│   ├── ARSessionManager.kt       # ARCore Session & Hardware Support check
│   └── PlaneDetectionManager.kt  # Horizontal surface detection & filtering
├── scenarios/
│   ├── ScenarioManager.kt        # Abstract scenario runner
│   ├── FireScenario.kt           # Fire & Explosion 5-step scenario
│   └── GasLeakScenario.kt        # Gas Leak & Confined Space 5-step scenario
├── scoring/
│   └── ScoringEngine.kt          # Deterministic penalty/reward scoring
├── certificate/
│   └── CertificateManager.kt     # Digital certificate & QR code generation
├── storage/
│   └── LocalStorageManager.kt    # Room SQLite database with sync queue
├── localization/
│   └── LocalizationManager.kt    # English, Hindi, Santali string resolver
└── MainActivity.kt               # Jetpack Compose navigation host
```

## How to Test on a Physical Android Phone
1. Open this `android/` directory in **Android Studio** (Hedgehog, Iguana, or Jellyfish).
2. Connect an Android phone running Android 8.0+ (API 26+) with Developer Options & USB Debugging enabled.
3. Ensure **Google Play Services for AR** is installed on the phone (automatically requested if missing).
4. Run `:app` (Shift + F10).
5. Grant Camera permission when prompted.
6. Slowly scan the floor surface until the detection reticle appears, then tap to place the 3D safety training drill.
