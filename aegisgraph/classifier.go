package aegisgraph

import (
	"fmt"
)

// EvidenceClassifier classifies graph impact intelligence into Confirmed, Incomplete, and Verify categories.
type EvidenceClassifier struct{}

// NewEvidenceClassifier creates a new classifier.
func NewEvidenceClassifier() *EvidenceClassifier {
	return &EvidenceClassifier{}
}

// Classify processes raw graph impact and diff outputs to produce structured evidence items.
func (c *EvidenceClassifier) Classify(symbol string, impact *GraphImpactOutput, sourceSnippet string) ([]EvidenceItem, []string) {
	var items []EvidenceItem
	var impactedSymbols []string
	impactedMap := make(map[string]bool)

	// Check for Curveball dynamic / reflection / registration patterns
	isDynamic, reason, dynDesc := DetectDynamicPatterns(symbol, sourceSnippet)
	if isDynamic {
		items = append(items, EvidenceItem{
			Category:       CategoryIncomplete,
			SourceSymbol:   symbol,
			Reason:         reason,
			Description:    dynDesc,
			RequiresVerify: true,
			VerifyMethod:   "compiler/type/targeted-test verification",
		})
	}

	// Check graph warnings
	if impact != nil {
		for _, w := range impact.Warnings {
			if w.Severity == "warning" || w.Severity == "error" {
				items = append(items, EvidenceItem{
					Category:       CategoryIncomplete,
					SourceSymbol:   symbol,
					Reason:         ReasonGraphWarning,
					Description:    fmt.Sprintf("Graph emitted %s: %s (%s)", w.Code, w.EffectOnSemanticCompleteness, w.Severity),
					RequiresVerify: true,
					VerifyMethod:   "deterministic source verification",
				})
			}
		}

		if impact.Stats.PartialFailures > 0 || impact.Stats.CompletenessLevel != "ok" {
			items = append(items, EvidenceItem{
				Category:       CategoryIncomplete,
				SourceSymbol:   symbol,
				Reason:         ReasonPartialAnalysis,
				Description:    fmt.Sprintf("Partial analysis detected: completeness level %s with %d partial failures", impact.Stats.CompletenessLevel, impact.Stats.PartialFailures),
				RequiresVerify: true,
				VerifyMethod:   "repository-native validation",
			})
		}

		// Process direct Callers
		for _, caller := range impact.Callers.Entries {
			if !impactedMap[caller.Name] {
				impactedMap[caller.Name] = true
				impactedSymbols = append(impactedSymbols, caller.Name)
			}
			items = append(items, EvidenceItem{
				Category:     CategoryConfirmed,
				SourceSymbol: symbol,
				TargetSymbol: caller.Name,
				RelationType: "CALLER",
				FilePath:     caller.FilePath,
				LineNumber:   caller.Line,
				Description:  fmt.Sprintf("Direct caller: %s in %s:%d", caller.Name, caller.FilePath, caller.Line),
			})
		}

		// Process Callees
		for _, callee := range impact.Callees.Entries {
			if !impactedMap[callee.Name] {
				impactedMap[callee.Name] = true
				impactedSymbols = append(impactedSymbols, callee.Name)
			}
			items = append(items, EvidenceItem{
				Category:     CategoryConfirmed,
				SourceSymbol: symbol,
				TargetSymbol: callee.Name,
				RelationType: "CALLEE",
				FilePath:     callee.FilePath,
				LineNumber:   callee.Line,
				Description:  fmt.Sprintf("Direct callee: %s in %s:%d", callee.Name, callee.FilePath, callee.Line),
			})
		}

		// Process Type Consumers
		for _, tc := range impact.TypeConsumers.Entries {
			if !impactedMap[tc.Name] {
				impactedMap[tc.Name] = true
				impactedSymbols = append(impactedSymbols, tc.Name)
			}
			items = append(items, EvidenceItem{
				Category:     CategoryConfirmed,
				SourceSymbol: symbol,
				TargetSymbol: tc.Name,
				RelationType: "TYPE_CONSUMER",
				FilePath:     tc.FilePath,
				LineNumber:   tc.Line,
				Description:  fmt.Sprintf("Type consumer: %s in %s:%d", tc.Name, tc.FilePath, tc.Line),
			})
		}

		// Process Data Flows
		for _, df := range impact.DataFlows.Entries {
			if !impactedMap[df.Name] {
				impactedMap[df.Name] = true
				impactedSymbols = append(impactedSymbols, df.Name)
			}
			items = append(items, EvidenceItem{
				Category:     CategoryConfirmed,
				SourceSymbol: symbol,
				TargetSymbol: df.Name,
				RelationType: "DATA_FLOW",
				FilePath:     df.FilePath,
				LineNumber:   df.Line,
				Description:  fmt.Sprintf("Data flow: %s in %s:%d", df.Name, df.FilePath, df.Line),
			})
		}
	}

	return items, impactedSymbols
}
