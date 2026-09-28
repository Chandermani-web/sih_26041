using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace ARSafe.Jharkhand.UnityAR
{
    /// <summary>
    /// Manages Google ARCore Depth API & AR Foundation AROcclusionManager.
    /// Provides per-pixel environment depth occlusion so virtual fire, equipment,
    /// and hazards realistically render in front of and behind physical objects (chairs, desks, walls).
    /// Gracefully falls back to plane-based tracking if Depth API is unsupported on the device.
    /// Official Reference: https://developers.google.com/ar/develop/unity-arf/depth/developer-guide
    /// </summary>
    [RequireComponent(typeof(AROcclusionManager))]
    public class ARDepthOcclusionManager : MonoBehaviour
    {
        [Header("AR Foundation Components")]
        [SerializeField] private AROcclusionManager occlusionManager;
        [SerializeField] private ARSession arSession;

        [Header("Occlusion Configuration")]
        [Tooltip("ARCore supports Disabled and Fastest modes. Fastest provides optimized depth-from-motion.")]
        [SerializeField] private EnvironmentDepthMode preferredDepthMode = EnvironmentDepthMode.Fastest;
        [SerializeField] private bool enableTemporalSmoothing = true;

        [Header("Status & Diagnostic Events")]
        public bool IsDepthSupported { get; private set; } = false;
        public bool IsOcclusionActive { get; private set; } = false;

        public delegate void DepthStatusChanged(bool supported, string message);
        public event DepthStatusChanged OnDepthStatusChanged;

        private void Awake()
        {
            if (occlusionManager == null)
            {
                occlusionManager = GetComponent<AROcclusionManager>();
            }
        }

        private IEnumerator Start()
        {
            // Verify AR Session availability
            yield return ARSession.CheckAvailability();

            if (ARSession.state == ARSessionState.NeedsInstall)
            {
                yield return ARSession.Install();
            }

            // Check if device supports Environment Depth subsystem
            CheckDepthSupportAndConfigure();
        }

        private void CheckDepthSupportAndConfigure()
        {
            if (occlusionManager == null)
            {
                OnDepthStatusChanged?.Invoke(false, "AROcclusionManager component missing.");
                return;
            }

            var descriptor = occlusionManager.descriptor;
            if (descriptor != null && descriptor.environmentDepthImageSupported != Supported.Unsupported)
            {
                IsDepthSupported = true;
                // Configure ARCore Depth API
                occlusionManager.requestedEnvironmentDepthMode = preferredDepthMode;

                if (descriptor.environmentDepthTemporalSmoothingSupported != Supported.Unsupported && enableTemporalSmoothing)
                {
                    occlusionManager.environmentDepthTemporalSmoothingRequested = true;
                }

                IsOcclusionActive = true;
                OnDepthStatusChanged?.Invoke(true, "ARCore Depth API active with environment occlusion.");
            }
            else
            {
                // Fallback: Plane tracking with standard z-buffer
                IsDepthSupported = false;
                IsOcclusionActive = false;
                occlusionManager.requestedEnvironmentDepthMode = EnvironmentDepthMode.Disabled;
                OnDepthStatusChanged?.Invoke(false, "Environment Depth unsupported. Gracefully falling back to plane detection & raycasting.");
            }
        }

        /// <summary>
        /// Allows toggling occlusion at runtime for performance diagnostics.
        /// </summary>
        public void ToggleOcclusion(bool enable)
        {
            if (!IsDepthSupported) return;

            occlusionManager.requestedEnvironmentDepthMode = enable ? preferredDepthMode : EnvironmentDepthMode.Disabled;
            IsOcclusionActive = enable;
        }
    }
}
