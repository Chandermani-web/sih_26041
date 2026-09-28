package com.arsafe.jharkhand.scoring

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
}
