package com.arsafe.jharkhand.ar

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
                    // Ready
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
            _sessionState.value = ARSessionState.Error("AR installation declined by worker", false)
        } catch (e: UnavailableDeviceNotCompatibleException) {
            _sessionState.value = ARSessionState.Error("Device does not support ARCore", false)
        } catch (e: Exception) {
            _sessionState.value = ARSessionState.Error("AR error: \${e.message}", true)
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
}
