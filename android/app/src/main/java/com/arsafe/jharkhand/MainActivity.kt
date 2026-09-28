package com.arsafe.jharkhand

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MaterialTheme(
                colorScheme = darkColorScheme(
                    primary = androidx.compose.ui.graphics.Color(0xFFF59E0B),
                    secondary = androidx.compose.ui.graphics.Color(0xFF10B981),
                    background = androidx.compose.ui.graphics.Color(0xFF0F172A),
                    surface = androidx.compose.ui.graphics.Color(0xFF1E293B)
                )
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    ARSafeMainScreen()
                }
            }
        }
    }
}

@Composable
fun ARSafeMainScreen() {
    var hasCameraPermission by remember { mutableStateOf(false) }

    val permissionLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        hasCameraPermission = isGranted
    }

    LaunchedEffect(Unit) {
        permissionLauncher.launch(Manifest.permission.CAMERA)
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(androidx.compose.ui.unit.dp(16))
    ) {
        Text(
            text = "AR-SAFE Jharkhand",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary
        )
        Text(
            text = "DGMS Industrial Safety Training Simulator",
            style = MaterialTheme.typography.bodyMedium,
            color = androidx.compose.ui.graphics.Color(0xFF94A3B8)
        )
    }
}
