package aegisgraph

import "time"

// EvidenceCategory classifies the certainty level of code graph relationships.
type EvidenceCategory string

const (
	CategoryConfirmed  EvidenceCategory = "CONFIRMED"
	CategoryIncomplete EvidenceCategory = "INCOMPLETE"
	CategoryVerify     EvidenceCategory = "VERIFY"
)

// Decision defines the safety outcome.
type Decision string

const (
	DecisionSafe   Decision = "SAFE"
	DecisionReview Decision = "REVIEW"
	DecisionBlock  Decision = "BLOCK"
)

// IncompleteReason explains why static graph analysis cannot prove completeness.
type IncompleteReason string

const (
	ReasonDynamicDispatch IncompleteReason = "DYNAMIC_DISPATCH"
	ReasonRuntimeRegister IncompleteReason = "RUNTIME_REGISTRATION"
	ReasonReflection      IncompleteReason = "REFLECTION"
	ReasonGeneratedCode   IncompleteReason = "GENERATED_CODE"
	ReasonStringLookup    IncompleteReason = "STRING_LOOKUP"
	ReasonGraphWarning    IncompleteReason = "GRAPH_WARNING"
	ReasonPartialAnalysis IncompleteReason = "PARTIAL_ANALYSIS"
)

// EvidenceItem represents an individual piece of structural or heuristic intelligence.
type EvidenceItem struct {
	Category       EvidenceCategory `json:"category"`
	SourceSymbol   string           `json:"source_symbol"`
	TargetSymbol   string           `json:"target_symbol,omitempty"`
	RelationType   string           `json:"relation_type,omitempty"`
	FilePath       string           `json:"file_path,omitempty"`
	LineNumber     int              `json:"line_number,omitempty"`
	Description    string           `json:"description"`
	Reason         IncompleteReason `json:"reason,omitempty"`
	RequiresVerify bool             `json:"requires_verify"`
	VerifyMethod   string           `json:"verify_method,omitempty"`
}

// VerificationResult captures the deterministic validation outcome.
type VerificationResult struct {
	Method      string   `json:"method"`
	Passed      bool     `json:"passed"`
	Command     string   `json:"command,omitempty"`
	Output      string   `json:"output,omitempty"`
	ErrorDetail string   `json:"error_detail,omitempty"`
	ChecksRun   []string `json:"checks_run,omitempty"`
}

// RiskReport is the synthesized evaluation of graph evidence + deterministic verification.
type RiskReport struct {
	Repository             string             `json:"repository"`
	BaseCommit             string             `json:"base_commit"`
	HeadCommit             string             `json:"head_commit"`
	ChangedSymbols         []string           `json:"changed_symbols"`
	ImpactedSymbols        []string           `json:"impacted_symbols"`
	ConfirmedCount         int                `json:"confirmed_count"`
	IncompleteCount        int                `json:"incomplete_count"`
	VerifyRequiredCount    int                `json:"verify_required_count"`
	Evidence               []EvidenceItem     `json:"evidence"`
	Verification           VerificationResult `json:"verification"`
	Decision               Decision           `json:"decision"`
	DecisionReason         string             `json:"decision_reason"`
	RecoveryRequired       bool               `json:"recovery_required"`
	StableCheckpointID     string             `json:"stable_checkpoint_id,omitempty"`
	RecoveryRecommendation string             `json:"recovery_recommendation,omitempty"`
	CurveballModeActive    bool               `json:"curveball_mode_active"`
	Timestamp              time.Time          `json:"timestamp"`
}

// AnalysisEvent represents the telemetry event ingested into Databricks / local sink.
type AnalysisEvent struct {
	EventID                 string    `json:"event_id"`
	Timestamp               time.Time `json:"timestamp"`
	Repository              string    `json:"repository"`
	Commit                  string    `json:"commit"`
	Checkpoint              string    `json:"checkpoint,omitempty"`
	ChangedSymbols          []string  `json:"changed_symbols"`
	ImpactedSymbols         []string  `json:"impacted_symbols"`
	ConfirmedRelationships  int       `json:"confirmed_relationships"`
	IncompleteRelationships int       `json:"incomplete_relationships"`
	VerificationStatus      string    `json:"verification_status"`
	Decision                string    `json:"decision"`
	DecisionReason          string    `json:"decision_reason"`
	RecoveryRequired        bool      `json:"recovery_required"`
	CurveballMode           bool      `json:"curveball_mode"`
	AnalysisVersion         string    `json:"analysis_version"`
}
