import React, { useState } from 'react';
import { useLocalization } from '../localization/LocalizationContext';
import { Code2, Folder, FileCode, Check, Copy, Terminal, ExternalLink } from 'lucide-react';

interface AndroidFile {
  path: string;
  name: string;
  language: string;
  package: string;
  description: string;
  code: string;
}

const ANDROID_PROJECT_FILES: AndroidFile[] = [
  {
    path: 'android/build.gradle.kts',
    name: 'build.gradle.kts (Project)',
    language: 'kotlin',
    package: 'root',
    description: 'Root Gradle build configuration with Android Gradle Plugin 8.5 & Kotlin 2.0',
    code: `// Root Gradle Build File for AR-SAFE (SIH 2026)
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.jetbrains.kotlin.android) apply false
    alias(libs.plugins.compose.compiler) apply false
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
    }
}`
  },
  {
    path: 'android/app/build.gradle.kts',
    name: 'app/build.gradle.kts',
    language: 'kotlin',
    package: 'app',
    description: 'App-level dependencies: Jetpack Compose Material 3, Google ARCore, Sceneview AR, Room',
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.jetbrains.kotlin.android)
    alias(libs.plugins.compose.compiler)
    id("kotlin-kapt")
}

android {
    namespace = "com.arsafe.jharkhand"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.arsafe.jharkhand"
        minSdk = 26 // Android 8.0+ for ARCore compatibility
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0-SIH26"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }
}

dependencies {
    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.ui)
    implementation(libs.androidx.material3)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.androidx.navigation.compose)

    // Google ARCore SDK
    implementation("com.google.ar:core:1.45.0")

    // Sceneview AR for Filament/Jetpack Compose
    implementation("io.github.sceneview:arsceneview:2.2.1")

    // Room Database for Offline Storage
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")

    // QR Code Generator
    implementation("com.google.zxing:core:3.5.3")
}`
  },
  {
    path: 'android/app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    package: 'manifest',
    description: 'Permissions for Rear Camera, ARCore optional/required flags, and Hardware Features',
    code: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Camera Permission for ARCore Spatial Tracking -->
    <uses-permission android:name="android.permission.CAMERA" />

    <!-- Google ARCore Hardware Feature Requirement -->
    <uses-feature
        android:name="android.hardware.camera.ar"
        android:required="true" />
    <uses-feature
        android:name="android.hardware.camera"
        android:required="true" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ARSafeJharkhand">

        <!-- Google Play Services for AR (ARCore) metadata -->
        <meta-data
            android:name="com.google.ar.core"
            android:value="required" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:screenOrientation="portrait"
            android:theme="@style/Theme.ARSafeJharkhand">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
  },
  {
    path: 'android/app/src/main/java/com/arsafe/jharkhand/MainActivity.kt',
    name: 'MainActivity.kt',
    language: 'kotlin',
    package: 'com.arsafe.jharkhand',
    description: 'Main Jetpack Compose entry point handling Navigation, Camera Permissions, and Themes',
    code: `package com.arsafe.jharkhand

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.arsafe.jharkhand.ui.navigation.ARSafeNavRoute
import com.arsafe.jharkhand.ui.screens.HomeScreen
import com.arsafe.jharkhand.ui.screens.LoginScreen
import com.arsafe.jharkhand.ui.screens.ARSimulationScreen
import com.arsafe.jharkhand.ui.screens.CertificateScreen
import com.arsafe.jharkhand.ui.theme.ARSafeTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ARSafeTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    ARSafeAppNavigation()
                }
            }
        }
    }
}

@Composable
fun ARSafeAppNavigation() {
    val navController = rememberNavController()

    NavHost(
        navController = navController,
        startDestination = ARSafeNavRoute.Login.route
    ) {
        composable(ARSafeNavRoute.Login.route) {
            LoginScreen(
                onLoginSuccess = { workerId ->
                    navController.navigate(ARSafeNavRoute.Home.createRoute(workerId)) {
                        popUpTo(ARSafeNavRoute.Login.route) { inclusive = true }
                    }
                }
            )
        }
        composable(ARSafeNavRoute.Home.route) { backStackEntry ->
            val workerId = backStackEntry.arguments?.getString("workerId") ?: "JH-W-001"
            HomeScreen(
                workerId = workerId,
                onStartAR = { moduleId ->
                    navController.navigate(ARSafeNavRoute.ARSimulation.createRoute(moduleId))
                }
            )
        }
        composable(ARSafeNavRoute.ARSimulation.route) { backStackEntry ->
            val moduleId = backStackEntry.arguments?.getString("moduleId") ?: "fire-explosion"
            ARSimulationScreen(
                moduleId = moduleId,
                onComplete = { result ->
                    navController.navigate(ARSafeNavRoute.Certificate.createRoute(result.certificateId))
                },
                onExit = {
                    navController.popBackStack()
                }
            )
        }
        composable(ARSafeNavRoute.Certificate.route) { backStackEntry ->
            val certId = backStackEntry.arguments?.getString("certId") ?: ""
            CertificateScreen(
                certificateId = certId,
                onNavigateHome = {
                    navController.popBackStack(ARSafeNavRoute.Home.route, false)
                }
            )
        }
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/arsafe/jharkhand/ar/ARSessionManager.kt',
    name: 'ARSessionManager.kt',
    language: 'kotlin',
    package: 'com.arsafe.jharkhand.ar',
    description: 'Manages ARCore Session lifecycle, camera configuration, and hardware support checks',
    code: `package com.arsafe.jharkhand.ar

import android.app.Activity
import android.content.Context
import com.google.ar.core.ArCoreApk
import com.google.ar.core.Config
import com.google.ar.core.Session
import com.google.ar.core.exceptions.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

sealed class ARSessionState {
    object Uninitialized : ARSessionState()
    object RequestingInstall : ARSessionState()
    object Ready : ARSessionState()
    data class Error(val message: String, val isRecoverable: Boolean) : ARSessionState()
}

class ARSessionManager(private val context: Context) {

    private var session: Session? = null
    private val _sessionState = MutableStateFlow<ARSessionState>(ARSessionState.Uninitialized)
    val sessionState: StateFlow<ARSessionState> = _sessionState

    fun checkARCoreAvailability(activity: Activity): Boolean {
        val availability = ArCoreApk.getInstance().checkAvailability(context)
        if (availability.isTransient) {
            return false
        }
        return availability.isSupported
    }

    fun initSession(activity: Activity): Session? {
        if (session != null) return session

        try {
            when (ArCoreApk.getInstance().requestInstall(activity, true)) {
                ArCoreApk.InstallStatus.INSTALL_REQUESTED -> {
                    _sessionState.value = ARSessionState.RequestingInstall
                    return null
                }
                ArCoreApk.InstallStatus.INSTALLED -> {
                    // Proceed to session creation
                }
            }

            val newSession = Session(context)
            val config = Config(newSession).apply {
                planeFindingMode = Config.PlaneFindingMode.HORIZONTAL
                lightEstimationMode = Config.LightEstimationMode.ENVIRONMENTAL_HDR
                focusMode = Config.FocusMode.AUTO
                updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
            }
            newSession.configure(config)
            session = newSession
            _sessionState.value = ARSessionState.Ready
            return newSession
        } catch (e: UnavailableArcoreNotInstalledException) {
            _sessionState.value = ARSessionState.Error("Please install Google Play Services for AR", false)
        } catch (e: UnavailableUserDeclinedInstallationException) {
            _sessionState.value = ARSessionState.Error("AR installation declined by user", false)
        } catch (e: UnavailableDeviceNotCompatibleException) {
            _sessionState.value = ARSessionState.Error("Device does not meet ARCore requirements", false)
        } catch (e: Exception) {
            _sessionState.value = ARSessionState.Error("Failed to initialize AR: \${e.message}", true)
        }
        return null
    }

    fun resume() {
        session?.resume()
    }

    fun pause() {
        session?.pause()
    }

    fun destroy() {
        session?.close()
        session = null
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/arsafe/jharkhand/ar/PlaneDetectionManager.kt',
    name: 'PlaneDetectionManager.kt',
    language: 'kotlin',
    package: 'com.arsafe.jharkhand.ar',
    description: 'Filters detected horizontal planes for stable ground surface placement',
    code: `package com.arsafe.jharkhand.ar

import com.google.ar.core.Frame
import com.google.ar.core.Plane
import com.google.ar.core.TrackingState
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow

data class DetectedPlaneInfo(
    val hasHorizontalSurface: Boolean,
    val surfaceAreaEstimate: Float,
    val planeCount: Int
)

class PlaneDetectionManager {

    private val _planeState = MutableStateFlow(
        DetectedPlaneInfo(hasHorizontalSurface = false, surfaceAreaEstimate = 0f, planeCount = 0)
    )
    val planeState: StateFlow<DetectedPlaneInfo> = _planeState

    fun updatePlanes(frame: Frame) {
        val updatedPlanes = frame.getUpdatedTrackables(Plane::class.java)
        var horizontalCount = 0
        var totalArea = 0f

        for (plane in updatedPlanes) {
            if (plane.type == Plane.Type.HORIZONTAL_UPWARD_FACING &&
                plane.trackingState == TrackingState.TRACKING
            ) {
                horizontalCount++
                totalArea += (plane.extentX * plane.extentZ)
            }
        }

        _planeState.value = DetectedPlaneInfo(
            hasHorizontalSurface = horizontalCount > 0,
            surfaceAreaEstimate = totalArea,
            planeCount = horizontalCount
        )
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/arsafe/jharkhand/scoring/ScoringEngine.kt',
    name: 'ScoringEngine.kt',
    language: 'kotlin',
    package: 'com.arsafe.jharkhand.scoring',
    description: 'Deterministic rule-based scoring engine enforcing DGMS safety criteria',
    code: `package com.arsafe.jharkhand.scoring

data class SafetyActionRecord(
    val stepId: Int,
    val stepName: String,
    val pointsAwarded: Int,
    val isCorrect: Boolean,
    val feedback: String,
    val timestamp: Long = System.currentTimeMillis()
)

data class EvaluationResult(
    val totalScore: Int,
    val passingScore: Int = 80,
    val isPassed: Boolean,
    val strongAreas: List<String>,
    val weakAreas: List<String>,
    val actionLog: List<SafetyActionRecord>
)

class ScoringEngine(private val passingBenchmark: Int = 80) {

    private val actions = mutableListOf<SafetyActionRecord>()

    fun recordAction(stepId: Int, stepName: String, points: Int, isCorrect: Boolean, feedback: String) {
        actions.add(SafetyActionRecord(stepId, stepName, points, isCorrect, feedback))
    }

    fun computeScore(): Int {
        val raw = actions.sumOf { it.pointsAwarded }
        // Rule: Score must never go below 0, maximum is 100
        return raw.coerceIn(0, 100)
    }

    fun evaluate(): EvaluationResult {
        val finalScore = computeScore()
        val isPassed = finalScore >= passingBenchmark

        val strong = actions.filter { it.isCorrect }.map { "\${it.stepName}: Validated" }
        val weak = actions.filter { !it.isCorrect }.map { "\${it.stepName}: \${it.feedback}" }

        return EvaluationResult(
            totalScore = finalScore,
            passingScore = passingBenchmark,
            isPassed = isPassed,
            strongAreas = strong,
            weakAreas = weak,
            actionLog = actions.toList()
        )
    }

    fun reset() {
        actions.clear()
    }
}`
  },
  {
    path: 'android/app/src/main/java/com/arsafe/jharkhand/storage/LocalStorageManager.kt',
    name: 'LocalStorageManager.kt',
    language: 'kotlin',
    package: 'com.arsafe.jharkhand.storage',
    description: 'Room Database & SharedPreferences offline repository with sync queue',
    code: `package com.arsafe.jharkhand.storage

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "training_records")
data class TrainingRecordEntity(
    @PrimaryKey val sessionId: String,
    val workerId: String,
    val workerName: String,
    val moduleId: String,
    val score: Int,
    val isPassed: Boolean,
    val completedAt: Long,
    val certificateId: String?,
    val isSyncedWithBackend: Boolean = false
)

@Dao
interface TrainingRecordDao {
    @Query("SELECT * FROM training_records ORDER BY completedAt DESC")
    fun getAllRecords(): Flow<List<TrainingRecordEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRecord(record: TrainingRecordEntity)

    @Query("SELECT * FROM training_records WHERE isSyncedWithBackend = 0")
    suspend fun getPendingSyncQueue(): List<TrainingRecordEntity>
}

@Database(entities = [TrainingRecordEntity::class], version = 1, exportSchema = false)
abstract class ARSafeDatabase : RoomDatabase() {
    abstract fun trainingRecordDao(): TrainingRecordDao

    companion object {
        @Volatile
        private var INSTANCE: ARSafeDatabase? = null

        fun getDatabase(context: Context): ARSafeDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ARSafeDatabase::class.java,
                    "arsafe_offline.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}`
  }
];

export const AndroidProjectExplorer: React.FC = () => {
  const { t } = useLocalization();
  const [selectedFile, setSelectedFile] = useState<AndroidFile>(ANDROID_PROJECT_FILES[3]);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Title & Architecture Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                com.arsafe.jharkhand
              </span>
              <span className="text-xs text-slate-400">Android Studio Iguana / Jellyfish</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {t.androidDev.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {t.androidDev.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1.5 rounded-xl">
              Clean Architecture · Offline First
            </span>
          </div>
        </div>

        {/* Clean Architecture Diagram */}
        <div className="mt-5 p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto">
          <div className="text-[11px] text-amber-400 font-bold mb-1">
            PROJECT ARCHITECTURE LAYERS:
          </div>
          <div className="whitespace-pre text-slate-400">
            UI (Jetpack Compose M3) → ViewModels (Kotlin StateFlow) → Domain Use Cases → ARCore Session / Sceneview → Local Room Storage
          </div>
        </div>
      </div>

      {/* Code Inspector: File Tree + Code Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Left Side: File Explorer */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 space-y-2 bg-slate-950/50">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span>Project Files</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500">{ANDROID_PROJECT_FILES.length} Files</span>
          </div>

          <div className="space-y-1">
            {ANDROID_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full p-2.5 rounded-xl text-left transition flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <FileCode className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-mono font-medium truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{file.package}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Test on Physical Android Device Notice */}
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-1.5">
            <span className="font-bold text-amber-300 flex items-center gap-1">
              <Terminal className="w-3.5 h-3.5" />
              <span>Physical Device Testing:</span>
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Open the <code className="text-amber-400 font-mono">android/</code> directory in Android Studio. Ensure Google Play Services for AR (ARCore) is enabled on the physical phone.
            </p>
          </div>
        </div>

        {/* Right Side: Code Viewer */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950">
          {/* File Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-900/60">
            <div>
              <span className="text-xs font-mono text-amber-400 font-bold block">{selectedFile.path}</span>
              <p className="text-[11px] text-slate-400">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Code Body */}
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[560px] overflow-y-auto selection:bg-amber-500/30">
            <code>{selectedFile.code}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
