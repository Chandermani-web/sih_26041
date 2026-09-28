# AR-SAFE Unity AR Module (Unity 2022.3 LTS / 2023.2 + AR Foundation 5.1+)

**AR-Based Industrial Emergency Training Simulator for Jharkhand Mining & Manufacturing Workers**

This folder contains the complete C# scripts and architecture for the Unity AR emergency simulation module.

---

### Prerequisites & Verified Official Packages
1. **Unity Editor**: Unity 2022.3 LTS (recommended: `2022.3.28f1` or later) or Unity 2023.2.
2. **Package Manager Dependencies** (`manifest.json`):
   - `com.unity.xr.arfoundation`: `5.1.5`
   - `com.unity.xr.arcore`: `5.1.5` (Google ARCore XR Plugin)
   - `com.unity.xr.management`: `4.4.1`
   - `com.unity.modules.androidjni`: `1.0.0`

---

### ARCore Depth API & Occlusion Setup
Official Reference: https://developers.google.com/ar/develop/unity-arf/depth/developer-guide
1. In Unity, go to **Project Settings > XR Plug-in Management > ARCore**.
2. Set **Depth Mode** to **Depth Optional** (or Depth Required if targeting depth-only phones).
3. In your AR Scene:
   - Select the **Main Camera** under **XR Origin**.
   - Add the **`AROcclusionManager`** component.
   - Attach our script: **`ARDepthOcclusionManager.cs`**.
   - The script sets `requestedEnvironmentDepthMode = EnvironmentDepthMode.Fastest` and requests temporal smoothing.
   - If the user's phone does not support the Depth API, the script automatically falls back to plane detection & raycasting without crashing.

---

### Scene Hierarchy
```
AR_Emergency_Scene
├── XR Origin (Mobile AR)
│   ├── Camera Offset
│   │   └── Main Camera (ARCameraBackground, AROcclusionManager, ARCameraManager)
│   ├── ARRaycastManager (Raycast against PlaneWithinPolygon)
│   ├── ARPlaneManager (Plane visualization during scan)
│   └── ARAnchorManager (Pins industrial machinery to detected real-world surface)
├── Managers
│   ├── ARDepthOcclusionManager.cs
│   ├── ARRaycastPlacementManager.cs
│   ├── ScenarioStateMachine.cs
│   └── UnityAndroidBridge.cs
└── Prefabs/
    └── IndustrialEmergencyScenario.prefab (Conveyor motor bed, DynamicFireSystem, AudioSources)
```

---

### Building for Android (Unity as a Library)
1. In Unity, go to **File > Build Settings**.
2. Select **Android** platform.
3. Check **Export Project** checkbox.
4. Export into the `android/unity_ar_module` folder.
5. In the Android Studio Gradle project, include the `unityLibrary` module as documented in `android/README.md`.
