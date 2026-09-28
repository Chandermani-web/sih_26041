import { ScoringAction, TrainingSessionResult, ModuleId } from '../types';

export interface ScoringConfig {
  passingThreshold: number; // default 80
  maxScore: number; // 100
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  passingThreshold: 80,
  maxScore: 100,
};

export class ScoringEngine {
  private config: ScoringConfig;
  private actions: ScoringAction[] = [];

  constructor(config: Partial<ScoringConfig> = {}) {
    this.config = { ...DEFAULT_SCORING_CONFIG, ...config };
  }

  reset(): void {
    this.actions = [];
  }

  recordAction(action: Omit<ScoringAction, 'id' | 'timestamp'>): ScoringAction {
    const recordedAction: ScoringAction = {
      ...action,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
    };
    this.actions.push(recordedAction);
    return recordedAction;
  }

  calculateCurrentScore(): number {
    let rawScore = 0;
    for (const act of this.actions) {
      rawScore += act.awardedPoints;
    }
    // Rules:
    // Score must never go below 0
    // Maximum score = 100
    const clampedScore = Math.min(this.config.maxScore, Math.max(0, rawScore));
    return clampedScore;
  }

  evaluateSession(
    workerId: string,
    workerName: string,
    moduleId: ModuleId,
    moduleTitle: string,
    moduleCode: string,
    durationSeconds: number
  ): TrainingSessionResult {
    const totalScore = this.calculateCurrentScore();
    const isPassed = totalScore >= this.config.passingThreshold;

    const strongAreas: string[] = [];
    const weakAreas: string[] = [];

    this.actions.forEach((act) => {
      if (act.isCorrect && act.awardedPoints > 0) {
        strongAreas.push(`${act.stepTitle}: ${act.actionTaken} (+${act.awardedPoints} pts)`);
      } else {
        weakAreas.push(`${act.stepTitle}: ${act.feedback || 'Action failed safety validation'} (${act.awardedPoints} pts)`);
      }
    });

    if (strongAreas.length === 0 && isPassed) {
      strongAreas.push('All manual safety milestones verified under DGMS standards');
    }
    if (weakAreas.length === 0 && !isPassed) {
      weakAreas.push('Total score below 80% passing threshold');
    }

    const sessionId = `test_${Date.now()}`;
    const timestampStr = new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14);
    const certificateId = isPassed
      ? (moduleId === 'fire-explosion' ? `JH-FIRE-${timestampStr}` : `JH-GAS-${timestampStr}`)
      : undefined;

    return {
      sessionId,
      workerId,
      workerName,
      moduleId,
      moduleTitle,
      moduleCode,
      totalScore,
      passingScore: this.config.passingThreshold,
      isPassed,
      completedAt: new Date().toISOString(),
      durationSeconds,
      actions: [...this.actions],
      certificateId,
      strongAreas,
      weakAreas,
    };
  }

  getRecordedActions(): ScoringAction[] {
    return [...this.actions];
  }
}
