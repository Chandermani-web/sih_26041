using System.Collections.Generic;
using UnityEngine;
using UnityEngine.XR.ARFoundation;
using UnityEngine.XR.ARSubsystems;

namespace ARSafe.Jharkhand.UnityAR
{
    /// <summary>
    /// Performs raycasting against detected physical planes (floors/tables)
    /// and anchors the virtual industrial incident (conveyor switchgear, fire, extinguishers)
    /// in the worker's real environment using ARAnchorManager.
    /// Official Reference: https://docs.unity3d.com/Packages/com.unity.xr.arfoundation@5.1/manual/features/raycasting.html
    /// </summary>
    [RequireComponent(typeof(ARRaycastManager))]
    [RequireComponent(typeof(ARPlaneManager))]
    public class ARRaycastPlacementManager : MonoBehaviour
    {
        [Header("AR Foundation Managers")]
        [SerializeField] private ARRaycastManager raycastManager;
        [SerializeField] private ARPlaneManager planeManager;
        [SerializeField] private ARAnchorManager anchorManager;

        [Header("Placement Reticle & Prefabs")]
        [SerializeField] private GameObject placementReticlePrefab;
        [SerializeField] private GameObject industrialEmergencyScenarioPrefab;

        private GameObject spawnedReticle;
        private ARAnchor anchoredIncident;
        private static readonly List<ARRaycastHit> hits = new List<ARRaycastHit>();

        public bool IsScenarioPlaced => anchoredIncident != null;
        public Pose CurrentPlacementPose { get; private set; }
        public bool HasValidPlaneHit { get; private set; }

        public delegate void ScenarioPlacedHandler(Pose pose);
        public event ScenarioPlacedHandler OnScenarioPlaced;

        private void Awake()
        {
            if (raycastManager == null) raycastManager = GetComponent<ARRaycastManager>();
            if (planeManager == null) planeManager = GetComponent<ARPlaneManager>();
            if (anchorManager == null) anchorManager = GetComponent<ARAnchorManager>();

            if (placementReticlePrefab != null)
            {
                spawnedReticle = Instantiate(placementReticlePrefab);
                spawnedReticle.SetActive(false);
            }
        }

        private void Update()
        {
            if (IsScenarioPlaced) return;

            UpdatePlacementPose();
            UpdatePlacementIndicator();
        }

        private void UpdatePlacementPose()
        {
            // Raycast from the center of the camera screen
            var screenCenter = new Vector2(Screen.width * 0.5f, Screen.height * 0.5f);

            // Raycast against horizontal planes detected by ARCore
            if (raycastManager.Raycast(screenCenter, hits, TrackableType.PlaneWithinPolygon))
            {
                HasValidPlaneHit = true;
                CurrentPlacementPose = hits[0].pose;
            }
            else
            {
                HasValidPlaneHit = false;
            }
        }

        private void UpdatePlacementIndicator()
        {
            if (spawnedReticle == null) return;

            if (HasValidPlaneHit)
            {
                spawnedReticle.SetActive(true);
                spawnedReticle.transform.SetPositionAndRotation(CurrentPlacementPose.position, CurrentPlacementPose.rotation);
            }
            else
            {
                spawnedReticle.SetActive(false);
            }
        }

        /// <summary>
        /// Called when the worker taps the screen to anchor the industrial scenario in their physical room.
        /// </summary>
        public bool TryPlaceScenario()
        {
            if (IsScenarioPlaced || !HasValidPlaneHit) return false;

            // Spawn and anchor the virtual emergency incident to the real floor
            GameObject incidentInstance = Instantiate(industrialEmergencyScenarioPrefab, CurrentPlacementPose.position, CurrentPlacementPose.rotation);

            if (anchorManager != null)
            {
                anchoredIncident = incidentInstance.AddComponent<ARAnchor>();
            }

            // Hide the reticle once placed
            if (spawnedReticle != null)
            {
                spawnedReticle.SetActive(false);
            }

            // Disable plane visualization to maintain immersive real environment view
            foreach (var plane in planeManager.trackables)
            {
                plane.gameObject.SetActive(false);
            }
            planeManager.enabled = false;

            OnScenarioPlaced?.Invoke(CurrentPlacementPose);
            return true;
        }
    }
}
