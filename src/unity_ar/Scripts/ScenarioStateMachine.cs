using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace ARSafe.Jharkhand.UnityAR
{
    public enum ScenarioStage
    {
        ENVIRONMENT_SCANNING = 0,     // 0:00 - 0:30
        INITIAL_INCIDENT = 1,         // 0:30 - 1:00
        HAZARD_IDENTIFICATION = 2,    // 1:00 - 1:45
        DECISION_MAKING = 3,          // 1:45 - 2:30
        MANUAL_EXTINGUISHER = 4,      // 2:30 - 3:15
        EMERGENCY_ESCALATION = 5,     // 3:15 - 4:15
        SAFE_ZONE_EVACUATION = 6,     // 4:15 - 4:45
        KNOWLEDGE_ASSESSMENT = 7,     // 4:45 - 5:00
        COMPLETED = 8
    }

    /// <summary>
    /// Governs the complete 4-5 minute timeline of the industrial emergency simulation.
    /// Drives dynamic incident progression, worker observation, escalation, and evaluation.
    /// </summary>
    public class ScenarioStateMachine : MonoBehaviour
    {
        [Header("State & Timing")]
        [SerializeField] private ScenarioStage currentStage = ScenarioStage.ENVIRONMENT_SCANNING;
        [SerializeField] private float scenarioTimer = 0f;
        [SerializeField] private bool isRunning = false;

        [Header("System References")]
        [SerializeField] private DynamicFireSystem fireSystem;
        [SerializeField] private ExtinguisherInteraction extinguisherSystem;
        [SerializeField] private ARRaycastPlacementManager placementManager;
        [SerializeField] private UnityScoringEngine scoringEngine;

        public ScenarioStage CurrentStage => currentStage;
        public float ScenarioTimer => scenarioTimer;

        public delegate void StageChangedHandler(ScenarioStage newStage, string instruction);
        public event StageChangedHandler OnStageChanged;

        private void Start()
        {
            if (placementManager != null)
            {
                placementManager.OnScenarioPlaced += HandleScenarioPlaced;
            }
        }

        private void Update()
        {
            if (!isRunning) return;

            scenarioTimer += Time.deltaTime;

            // Manage time-based incident escalations
            switch (currentStage)
            {
                case ScenarioStage.INITIAL_INCIDENT:
                    if (scenarioTimer >= 30f && scenarioTimer < 60f)
                    {
                        // Transition: Electrical flicker -> Small fire
                        if (fireSystem.CurrentLevel == FireLevel.SPARK && scenarioTimer > 45f)
                        {
                            fireSystem.SetFireLevel(FireLevel.SMALL_FIRE);
                        }
                    }
                    if (scenarioTimer >= 60f)
                    {
                        SetStage(ScenarioStage.HAZARD_IDENTIFICATION, "Inspect the scene. Locate the fire hazard source.");
                    }
                    break;

                case ScenarioStage.HAZARD_IDENTIFICATION:
                    // If worker neglects hazard, fire gradually grows!
                    if (scenarioTimer > 85f && fireSystem.CurrentLevel == FireLevel.SMALL_FIRE)
                    {
                        fireSystem.SetFireLevel(FireLevel.MEDIUM_FIRE);
                    }
                    if (scenarioTimer > 105f)
                    {
                        // Proceed to decision making
                        SetStage(ScenarioStage.DECISION_MAKING, "Select the appropriate fire extinguishing agent for electrical conveyor fire.");
                    }
                    break;

                case ScenarioStage.MANUAL_EXTINGUISHER:
                    if (fireSystem.CurrentLevel == FireLevel.EXTINGUISHED)
                    {
                        scoringEngine.RecordAction("Extinguisher Operation", "Fire extinguished with continuous PASS technique", 25, true);
                        SetStage(ScenarioStage.EMERGENCY_ESCALATION, "Secondary smoke hazard spreading. Locate safe intake airway escapeway.");
                    }
                    break;
            }
        }

        private void HandleScenarioPlaced(Pose pose)
        {
            isRunning = true;
            scenarioTimer = 30f; // Start Phase 2: Initial Incident
            SetStage(ScenarioStage.INITIAL_INCIDENT, "Incident anchored in real environment. Observe equipment status.");
            if (fireSystem != null)
            {
                fireSystem.SetFireLevel(FireLevel.SPARK);
            }
        }

        public void WorkerIdentifiedHazard()
        {
            if (currentStage == ScenarioStage.HAZARD_IDENTIFICATION || currentStage == ScenarioStage.INITIAL_INCIDENT)
            {
                scoringEngine.RecordAction("Hazard Identification", "Located conveyor motor friction ignition source", 15, true);
                SetStage(ScenarioStage.DECISION_MAKING, "Select certified extinguisher for live electrical mine conveyor.");
            }
        }

        public void WorkerSelectedExtinguisher(ExtinguisherType type)
        {
            if (currentStage != ScenarioStage.DECISION_MAKING) return;

            extinguisherSystem.SelectExtinguisher(type);

            if (type == ExtinguisherType.ABC_DryPowder)
            {
                scoringEngine.RecordAction("Equipment Selection", "Selected ABC Dry Chemical Powder (MAP 90%)", 15, true);
                SetStage(ScenarioStage.MANUAL_EXTINGUISHER, "Aim nozzle at base of fire. Press and hold trigger to discharge powder.");
            }
            else
            {
                scoringEngine.RecordAction("Equipment Selection", $"Selected {type} (Electrical shock hazard)", -10, false);
                fireSystem.EscalateFire();
            }
        }

        public void WorkerSelectedExit(bool isIntakeAirwaySafe)
        {
            if (currentStage != ScenarioStage.EMERGENCY_ESCALATION) return;

            if (isIntakeAirwaySafe)
            {
                scoringEngine.RecordAction("Emergency Decision", "Identified clear intake airway exit route", 15, true);
                SetStage(ScenarioStage.SAFE_ZONE_EVACUATION, "Navigate along the illuminated route to the Safe Muster Zone.");
            }
            else
            {
                scoringEngine.RecordAction("Emergency Decision", "Attempted escape through smoke-filled return airway", -10, false);
            }
        }

        public void WorkerReachedSafeZone()
        {
            if (currentStage == ScenarioStage.SAFE_ZONE_EVACUATION)
            {
                scoringEngine.RecordAction("Evacuation", "Worker safely reached underground safe muster zone", 20, true);
                SetStage(ScenarioStage.KNOWLEDGE_ASSESSMENT, "Complete final practical safety evaluation.");
            }
        }

        public void SetStage(ScenarioStage stage, string instruction)
        {
            currentStage = stage;
            OnStageChanged?.Invoke(currentStage, instruction);
        }
    }

    /// <summary>
    /// Real-time Scoring Engine enforcing DGMS safety criteria:
    /// Hazard ID (15) + Equipment Selection (15) + Extinguisher (25) + Emergency Decision (15) + Evacuation (20) + Knowledge (10) = 100 max.
    /// </summary>
    public class UnityScoringEngine : MonoBehaviour
    {
        private int currentScore = 0;
        private readonly List<string> actionLog = new List<string>();

        public int CurrentScore => Mathf.Clamp(currentScore, 0, 100);

        public void RecordAction(string category, string detail, int points, bool isCorrect)
        {
            currentScore = Mathf.Clamp(currentScore + points, 0, 100);
            actionLog.Add($"[{category}] {detail}: {(points >= 0 ? "+" : "")}{points} pts");
        }
    }
}
