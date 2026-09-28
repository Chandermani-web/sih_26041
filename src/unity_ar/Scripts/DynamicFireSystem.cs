using System.Collections;
using UnityEngine;

namespace ARSafe.Jharkhand.UnityAR
{
    public enum FireLevel
    {
        FIRE_LEVEL_0 = 0,
        SPARK = 1,
        SMALL_FIRE = 2,
        MEDIUM_FIRE = 3,
        LARGE_FIRE = 4,
        CONTROLLED = 5,
        EXTINGUISHED = 6
    }

    /// <summary>
    /// Implements a dynamic, responsive industrial fire system anchored to real surfaces.
    /// Responds continuously to worker actions and time escalation.
    /// Manages flame particle systems, billowing smoke, electrical arc sparks, and crackle audio.
    /// </summary>
    public class DynamicFireSystem : MonoBehaviour
    {
        [Header("Fire Level & Health")]
        [SerializeField] private FireLevel currentLevel = FireLevel.FIRE_LEVEL_0;
        [Range(0f, 100f)] [SerializeField] private float fireHealth = 0f;

        [Header("Particle Systems")]
        [SerializeField] private ParticleSystem sparkParticles;
        [SerializeField] private ParticleSystem flameParticles;
        [SerializeField] private ParticleSystem smokeParticles;
        [SerializeField] private ParticleSystem heatDistortionParticles;

        [Header("Audio Components")]
        [SerializeField] private AudioSource sparkAudioSource;
        [SerializeField] private AudioSource fireCrackleAudioSource;
        [SerializeField] private AudioSource industrialAlarmAudioSource;

        [Header("Colliders")]
        [SerializeField] private Collider fireBaseCollider;

        public FireLevel CurrentLevel => currentLevel;
        public float FireHealth => fireHealth;
        public Collider FireBaseCollider => fireBaseCollider;

        public delegate void FireStateChangedHandler(FireLevel newLevel);
        public event FireStateChangedHandler OnFireStateChanged;

        private Coroutine escalationRoutine;

        private void Start()
        {
            SetFireLevel(FireLevel.FIRE_LEVEL_0);
        }

        /// <summary>
        /// Transitions the fire into a specific level and updates particle emissions & audio.
        /// </summary>
        public void SetFireLevel(FireLevel level)
        {
            currentLevel = level;

            switch (level)
            {
                case FireLevel.FIRE_LEVEL_0:
                    fireHealth = 0f;
                    StopAllParticles();
                    break;

                case FireLevel.SPARK:
                    fireHealth = 20f;
                    if (sparkParticles != null) sparkParticles.Play();
                    if (sparkAudioSource != null) sparkAudioSource.Play();
                    break;

                case FireLevel.SMALL_FIRE:
                    fireHealth = 40f;
                    UpdateParticles(scale: 0.4f, smokeRate: 10f);
                    if (fireCrackleAudioSource != null) fireCrackleAudioSource.volume = 0.3f;
                    break;

                case FireLevel.MEDIUM_FIRE:
                    fireHealth = 70f;
                    UpdateParticles(scale: 0.75f, smokeRate: 25f);
                    if (fireCrackleAudioSource != null) fireCrackleAudioSource.volume = 0.6f;
                    if (industrialAlarmAudioSource != null && !industrialAlarmAudioSource.isPlaying)
                        industrialAlarmAudioSource.Play();
                    break;

                case FireLevel.LARGE_FIRE:
                    fireHealth = 100f;
                    UpdateParticles(scale: 1.2f, smokeRate: 50f);
                    if (fireCrackleAudioSource != null) fireCrackleAudioSource.volume = 1.0f;
                    break;

                case FireLevel.CONTROLLED:
                    UpdateParticles(scale: 0.2f, smokeRate: 15f);
                    if (fireCrackleAudioSource != null) fireCrackleAudioSource.volume = 0.2f;
                    break;

                case FireLevel.EXTINGUISHED:
                    fireHealth = 0f;
                    StopAllParticles();
                    if (smokeParticles != null)
                    {
                        // Smoldering white residue smoke
                        var main = smokeParticles.main;
                        main.startColor = new Color(0.9f, 0.9f, 0.9f, 0.3f);
                        smokeParticles.Play();
                    }
                    if (fireCrackleAudioSource != null) fireCrackleAudioSource.Stop();
                    if (industrialAlarmAudioSource != null) industrialAlarmAudioSource.Stop();
                    break;
            }

            OnFireStateChanged?.Invoke(currentLevel);
        }

        /// <summary>
        /// Called when the worker continuously applies the correct extinguisher onto the fire base.
        /// </summary>
        public void ApplyExtinguisherSupression(float suppressionRate)
        {
            if (currentLevel == FireLevel.EXTINGUISHED) return;

            fireHealth = Mathf.Max(0f, fireHealth - (suppressionRate * Time.deltaTime));

            if (fireHealth <= 0f)
            {
                SetFireLevel(FireLevel.EXTINGUISHED);
            }
            else if (fireHealth < 30f && currentLevel != FireLevel.CONTROLLED)
            {
                SetFireLevel(FireLevel.CONTROLLED);
            }
            else if (fireHealth < 60f && currentLevel == FireLevel.LARGE_FIRE)
            {
                SetFireLevel(FireLevel.MEDIUM_FIRE);
            }
        }

        /// <summary>
        /// Natural escalation if worker ignores the incident or selects the wrong equipment.
        /// </summary>
        public void EscalateFire()
        {
            if (currentLevel == FireLevel.SPARK) SetFireLevel(FireLevel.SMALL_FIRE);
            else if (currentLevel == FireLevel.SMALL_FIRE) SetFireLevel(FireLevel.MEDIUM_FIRE);
            else if (currentLevel == FireLevel.MEDIUM_FIRE) SetFireLevel(FireLevel.LARGE_FIRE);
        }

        private void UpdateParticles(float scale, float smokeRate)
        {
            if (flameParticles != null)
            {
                flameParticles.transform.localScale = Vector3.one * scale;
                if (!flameParticles.isPlaying) flameParticles.Play();
            }
            if (smokeParticles != null)
            {
                var emission = smokeParticles.emission;
                emission.rateOverTime = smokeRate;
                if (!smokeParticles.isPlaying) smokeParticles.Play();
            }
        }

        private void StopAllParticles()
        {
            if (sparkParticles != null) sparkParticles.Stop();
            if (flameParticles != null) flameParticles.Stop();
            if (smokeParticles != null) smokeParticles.Stop();
            if (heatDistortionParticles != null) heatDistortionParticles.Stop();
        }
    }
}
