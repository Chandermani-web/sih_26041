package com.arsafe.jharkhand.scenarios

interface SafetyScenario {
    val id: String
    val name: String
    val totalSteps: Int
    fun executeStep(stepIndex: Int, actionData: Map<String, Any>): StepOutcome
}

data class StepOutcome(
    val isSuccess: Boolean,
    val pointsAwarded: Int,
    val feedback: String,
    val nextStepIndex: Int
)

class ScenarioManager {
    private val scenarios = mapOf(
        "fire-explosion" to FireScenario(),
        "gas-leak" to GasLeakScenario()
    )

    fun getScenario(id: String): SafetyScenario? = scenarios[id]
}

class FireScenario : SafetyScenario {
    override val id: String = "fire-explosion"
    override val name: String = "Fire & Explosion Response"
    override val totalSteps: Int = 5

    override fun executeStep(stepIndex: Int, actionData: Map<String, Any>): StepOutcome {
        return when (stepIndex) {
            1 -> StepOutcome(true, 20, "Electric conveyor hazard identified", 2)
            2 -> {
                val chosen = actionData["extinguisherType"] as? String
                if (chosen == "abc_dry_powder") {
                    StepOutcome(true, 20, "Correct ABC powder selected", 3)
                } else {
                    StepOutcome(false, -10, "Incorrect extinguisher for live electric fire", 2)
                }
            }
            3 -> StepOutcome(true, 30, "PASS sweep technique executed", 4)
            4 -> StepOutcome(true, 20, "Primary intake airway exit verified", 5)
            5 -> StepOutcome(true, 20, "Underground safe muster point reached", 6)
            else -> StepOutcome(false, 0, "Scenario complete", 6)
        }
    }
}

class GasLeakScenario : SafetyScenario {
    override val id: String = "gas-leak"
    override val name: String = "Gas Leak & Confined Space"
    override val totalSteps: Int = 5

    override fun executeStep(stepIndex: Int, actionData: Map<String, Any>): StepOutcome {
        return when (stepIndex) {
            1 -> StepOutcome(true, 20, "CH4 and H2S gas alarm confirmed", 2)
            2 -> {
                val ppe = actionData["ppeType"] as? String
                if (ppe == "scba_apparatus") {
                    StepOutcome(true, 20, "Positive-pressure SCBA deployed", 3)
                } else {
                    StepOutcome(false, -10, "Inadequate PPE! Fatal gas hazard", 2)
                }
            }
            3 -> StepOutcome(true, 20, "Power isolated (Lockout/Tagout)", 4)
            4 -> StepOutcome(true, 20, "Buddy worker verified", 5)
            5 -> StepOutcome(true, 20, "Refuge chamber safely sealed", 6)
            else -> StepOutcome(false, 0, "Scenario complete", 6)
        }
    }
}
