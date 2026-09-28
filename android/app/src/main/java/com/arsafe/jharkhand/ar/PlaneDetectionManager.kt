package com.arsafe.jharkhand.ar

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
}
