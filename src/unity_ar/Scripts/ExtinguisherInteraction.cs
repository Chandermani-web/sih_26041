using UnityEngine;

namespace ARSafe.Jharkhand.UnityAR
{
    public enum ExtinguisherType
    {
        Water = 0,
        Foam = 1,
        ABC_DryPowder = 2,
        CO2 = 3
    }

    /// <summary>
    /// Handles manual fire extinguisher physics and P.A.S.S. protocol interaction in Unity.
    /// Detects whether the worker is aiming the extinguisher nozzle at the base of the fire
    /// while continuously holding the discharge lever.
    /// </summary>
    public class ExtinguisherInteraction : MonoBehaviour
    {
        [Header("Extinguisher Configuration")]
        [SerializeField] private ExtinguisherType selectedType = ExtinguisherType.ABC_DryPowder;
        [SerializeField] private ParticleSystem dischargeParticleCone;
        [SerializeField] private AudioSource sprayHissAudioSource;
        [SerializeField] private Transform nozzleTip;
        [SerializeField] private float maxSprayDistance = 4.5f;
        [SerializeField] private float suppressionRate = 22f;

        [Header("Target References")]
        [SerializeField] private DynamicFireSystem targetFireSystem;
        [SerializeField] private Camera arCamera;

        public bool IsDischarging { get; private set; } = false;
        public bool IsAimingAtFireBase { get; private set; } = false;

        public void SelectExtinguisher(ExtinguisherType type)
        {
            selectedType = type;
        }

        /// <summary>
        /// Called when the worker presses and holds the discharge lever on screen.
        /// </summary>
        public void StartDischarge()
        {
            IsDischarging = true;

            if (dischargeParticleCone != null && !dischargeParticleCone.isPlaying)
            {
                dischargeParticleCone.Play();
            }
            if (sprayHissAudioSource != null && !sprayHissAudioSource.isPlaying)
            {
                sprayHissAudioSource.Play();
            }
        }

        /// <summary>
        /// Called when the worker releases the discharge trigger.
        /// </summary>
        public void StopDischarge()
        {
            IsDischarging = false;

            if (dischargeParticleCone != null)
            {
                dischargeParticleCone.Stop();
            }
            if (sprayHissAudioSource != null)
            {
                sprayHissAudioSource.Stop();
            }
        }

        private void Update()
        {
            if (arCamera == null) arCamera = Camera.main;

            CheckAimAlignment();

            if (IsDischarging && IsAimingAtFireBase && targetFireSystem != null)
            {
                // Only correct ABC Dry Powder efficiently suppresses live electrical conveyor fire
                if (selectedType == ExtinguisherType.ABC_DryPowder)
                {
                    targetFireSystem.ApplyExtinguisherSupression(suppressionRate);
                }
                else
                {
                    // Minimal or negative suppression for improper agents
                    targetFireSystem.ApplyExtinguisherSupression(2f);
                }
            }
        }

        private void CheckAimAlignment()
        {
            if (arCamera == null || targetFireSystem == null) return;

            Ray ray = arCamera.ViewportPointToRay(new Vector3(0.5f, 0.5f, 0f));
            if (Physics.Raycast(ray, out RaycastHit hit, maxSprayDistance))
            {
                if (hit.collider == targetFireSystem.FireBaseCollider)
                {
                    IsAimingAtFireBase = true;
                    return;
                }
            }

            IsAimingAtFireBase = false;
        }
    }
}
