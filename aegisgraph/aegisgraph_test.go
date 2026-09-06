package aegisgraph

import (
	"context"
	"os"
	"testing"
)

// TestConfirmedEvidence verifies that clean structural evidence leads to SAFE.
func TestConfirmedEvidence(t *testing.T) {
	classifier := NewEvidenceClassifier()
	decider := NewDecisionEngine()

	mockImpact := &GraphImpactOutput{
		Commit: "abc1234",
		Stats: struct {
			CompletenessLevel string `json:"completeness_level"`
			PartialFailures   int    `json:"partial_failures"`
		}{CompletenessLevel: "ok", PartialFailures: 0},
	}
	mockImpact.Callers.Entries = []GraphImpactEntry{
		{Name: "CheckoutService", FilePath: "internal/checkout.go", Line: 42, Relation: "CALLS"},
	}

	evidence, impacted := classifier.Classify("ValidateToken", mockImpact, "func ValidateToken() bool { return true }")
	if len(evidence) == 0 {
		t.Fatalf("expected evidence items, got 0")
	}

	report := &RiskReport{
		Repository:      ".",
		ChangedSymbols:  []string{"ValidateToken"},
		ImpactedSymbols: impacted,
		ConfirmedCount:  len(evidence),
		IncompleteCount: 0,
		Evidence:        evidence,
		Verification: VerificationResult{
			Method: "go test",
			Passed: true,
			Output: "PASS",
		},
	}

	decider.Evaluate(report)
	if report.Decision != DecisionSafe {
		t.Fatalf("expected DecisionSafe, got %s", report.Decision)
	}
}

// TestCurveballIncompleteEvidence verifies that dynamic/reflection patterns trigger REVIEW.
func TestCurveballIncompleteEvidence(t *testing.T) {
	classifier := NewEvidenceClassifier()
	decider := NewDecisionEngine()

	mockImpact := &GraphImpactOutput{
		Stats: struct {
			CompletenessLevel string `json:"completeness_level"`
			PartialFailures   int    `json:"partial_failures"`
		}{CompletenessLevel: "ok", PartialFailures: 0},
	}

	dynamicSnippet := "func RegisterHandler() { reflect.ValueOf(handlerRegistry) }"
	evidence, impacted := classifier.Classify("RegisterHandler", mockImpact, dynamicSnippet)

	incompleteCount := 0
	for _, ev := range evidence {
		if ev.Category == CategoryIncomplete {
			incompleteCount++
		}
	}

	if incompleteCount == 0 {
		t.Fatalf("expected incomplete evidence for dynamic registration/reflection, got 0")
	}

	report := &RiskReport{
		Repository:      ".",
		ChangedSymbols:  []string{"RegisterHandler"},
		ImpactedSymbols: impacted,
		ConfirmedCount:  0,
		IncompleteCount: incompleteCount,
		Evidence:        evidence,
		Verification: VerificationResult{
			Method: "go test",
			Passed: true,
			Output: "PASS",
		},
	}

	decider.Evaluate(report)
	if report.Decision != DecisionReview {
		t.Fatalf("expected DecisionReview for incomplete graph evidence, got %s", report.Decision)
	}
}

// TestDeterministicVerificationFailure verifies that verification failures trigger BLOCK + Recovery.
func TestDeterministicVerificationFailure(t *testing.T) {
	decider := NewDecisionEngine()

	report := &RiskReport{
		Repository:         ".",
		ChangedSymbols:     []string{"ValidateToken"},
		ImpactedSymbols:    []string{"CheckoutService"},
		ConfirmedCount:     1,
		IncompleteCount:    0,
		StableCheckpointID: "cdca4eeb37ef",
		Verification: VerificationResult{
			Method:      "go test",
			Passed:      false,
			ErrorDetail: "Downstream consumer contract test failed.",
		},
	}

	decider.Evaluate(report)
	if report.Decision != DecisionBlock {
		t.Fatalf("expected DecisionBlock, got %s", report.Decision)
	}
	if !report.RecoveryRequired {
		t.Fatalf("expected RecoveryRequired to be true")
	}
}

// TestEventSinkAndDatabricksFallback verifies event recording and local fallback.
func TestEventSinkAndDatabricksFallback(t *testing.T) {
	tmpFile := "test_events.jsonl"
	defer os.Remove(tmpFile)

	sink := NewDatabricksEventSink(tmpFile)
	event := &AnalysisEvent{
		EventID:                 "evt_test_123",
		Repository:              "entire-graph",
		Commit:                  "d347fa7",
		Decision:                "BLOCK",
		DecisionReason:          "Downstream contract failure",
		ConfirmedRelationships:  2,
		IncompleteRelationships: 1,
		VerificationStatus:      "FAIL",
		RecoveryRequired:        true,
		CurveballMode:           true,
		AnalysisVersion:         "v1.0.0",
	}

	if err := sink.RecordEvent(context.Background(), event); err != nil {
		t.Fatalf("failed to record event: %v", err)
	}

	if _, err := os.Stat(tmpFile); os.IsNotExist(err) {
		t.Fatalf("expected event file %s to be created", tmpFile)
	}
}
