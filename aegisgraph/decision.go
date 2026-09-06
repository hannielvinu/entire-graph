package aegisgraph

import (
	"fmt"
)

// DecisionEngine evaluates graph evidence + verification result to produce SAFE, REVIEW, or BLOCK decisions.
type DecisionEngine struct{}

// NewDecisionEngine creates a new decision engine.
func NewDecisionEngine() *DecisionEngine {
	return &DecisionEngine{}
}

// Evaluate applies deterministic rules to reach a decision.
func (e *DecisionEngine) Evaluate(report *RiskReport) {
	// 1. If deterministic verification failed -> BLOCK
	if !report.Verification.Passed {
		report.Decision = DecisionBlock
		report.DecisionReason = fmt.Sprintf("Deterministic verification failed: %s", report.Verification.ErrorDetail)
		report.RecoveryRequired = true
		report.RecoveryRecommendation = fmt.Sprintf("Recover repository to stable Entire Checkpoint %s using 'entire checkpoint explain %s'", report.StableCheckpointID, report.StableCheckpointID)
		return
	}

	// 2. If incomplete / heuristic evidence exists (Curveball condition)
	if report.IncompleteCount > 0 {
		report.Decision = DecisionReview
		report.DecisionReason = fmt.Sprintf("Graph evidence is incomplete (%d incomplete/heuristic findings). Human review or targeted verification required before accepting change.", report.IncompleteCount)
		report.RecoveryRequired = false
		return
	}

	// 3. If there are high-risk breaking changes or large unverified blast radius
	if len(report.ImpactedSymbols) > 50 {
		report.Decision = DecisionReview
		report.DecisionReason = fmt.Sprintf("Large blast radius detected (%d impacted symbols). Review recommended.", len(report.ImpactedSymbols))
		report.RecoveryRequired = false
		return
	}

	// 4. Safe: Evidence is confirmed, verification passed
	report.Decision = DecisionSafe
	report.DecisionReason = "All structural relationships confirmed by Entire Graph and deterministic verification passed."
	report.RecoveryRequired = false
}
