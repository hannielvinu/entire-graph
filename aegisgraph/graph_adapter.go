package aegisgraph

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os/exec"
	"strings"
)

// GraphDiffFile represents a file modified in the diff.
type GraphDiffFile struct {
	Path     string            `json:"path"`
	Status   string            `json:"status"`
	Language string            `json:"language"`
	Changes  []GraphDiffChange `json:"changes"`
}

// GraphDiffChange represents an entity-level symbol change.
type GraphDiffChange struct {
	Type            string `json:"type"`
	Kind            string `json:"kind"`
	Name            string `json:"name"`
	OldSignature    string `json:"old_signature,omitempty"`
	NewSignature    string `json:"new_signature,omitempty"`
	BeforeStartLine int    `json:"before_start_line,omitempty"`
	AfterStartLine  int    `json:"after_start_line,omitempty"`
	DependentsCount int    `json:"dependents_count"`
}

// GraphDiffOutput is the output from `entire graph diff --json`.
type GraphDiffOutput struct {
	Base  string          `json:"base"`
	Head  string          `json:"head"`
	Files []GraphDiffFile `json:"files"`
}

// GraphImpactEntry represents an impacted neighbor.
type GraphImpactEntry struct {
	Name     string `json:"name"`
	Kind     string `json:"kind"`
	FilePath string `json:"file_path"`
	Line     int    `json:"line"`
	Relation string `json:"relation"`
}

// GraphWarning represents a warning emitted during graph analysis.
type GraphWarning struct {
	Code                         string `json:"code"`
	Severity                     string `json:"severity"`
	EffectOnSemanticCompleteness string `json:"effect_on_semantic_completeness"`
}

// GraphImpactOutput is the parsed output from `entire graph impact --format json`.
type GraphImpactOutput struct {
	FormatVersion int            `json:"format_version"`
	Commit        string         `json:"commit"`
	Query         string         `json:"query"`
	Callers       struct {
		Total   int                `json:"total"`
		Entries []GraphImpactEntry `json:"entries"`
	} `json:"callers"`
	Callees struct {
		Total   int                `json:"total"`
		Entries []GraphImpactEntry `json:"entries"`
	} `json:"callees"`
	TypeConsumers struct {
		Total   int                `json:"total"`
		Entries []GraphImpactEntry `json:"entries"`
	} `json:"type_consumers"`
	DataFlows struct {
		Total   int                `json:"total"`
		Entries []GraphImpactEntry `json:"entries"`
	} `json:"data_flows"`
	Warnings        []GraphWarning `json:"warnings"`
	PartialFailures []any          `json:"partial_failures"`
	Stats           struct {
		CompletenessLevel string `json:"completeness_level"`
		PartialFailures   int    `json:"partial_failures"`
	} `json:"stats"`
}

// EntireGraphAdapter executes actual `entire graph` commands.
type EntireGraphAdapter struct {
	RepoPath string
}

// NewEntireGraphAdapter creates a new adapter for the target repo.
func NewEntireGraphAdapter(repoPath string) *EntireGraphAdapter {
	return &EntireGraphAdapter{RepoPath: repoPath}
}

// RunSemanticDiff executes `entire graph diff --base <base> --head <head> --json`.
func (a *EntireGraphAdapter) RunSemanticDiff(ctx context.Context, base, head string) (*GraphDiffOutput, error) {
	cmd := exec.CommandContext(ctx, "entire", "graph", "diff", "--base", base, "--head", head, "--json", "--repo", a.RepoPath)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("entire graph diff failed: %w (stderr: %s)", err, stderr.String())
	}

	var output GraphDiffOutput
	if err := json.Unmarshal(stdout.Bytes(), &output); err != nil {
		return nil, fmt.Errorf("failed to parse entire graph diff JSON: %w", err)
	}

	return &output, nil
}

// RunImpact executes `entire graph impact --symbol <symbol> --repo <repo> --format json`.
func (a *EntireGraphAdapter) RunImpact(ctx context.Context, symbol string) (*GraphImpactOutput, error) {
	cmd := exec.CommandContext(ctx, "entire", "graph", "impact", "--symbol", symbol, "--repo", a.RepoPath, "--format", "json")
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("entire graph impact failed for %q: %w (stderr: %s)", symbol, err, stderr.String())
	}

	var output GraphImpactOutput
	if err := json.Unmarshal(stdout.Bytes(), &output); err != nil {
		return nil, fmt.Errorf("failed to parse entire graph impact JSON for %q: %w", symbol, err)
	}

	return &output, nil
}

// ExtractChangedSymbols extracts symbol names and file paths from diff.
func (a *EntireGraphAdapter) ExtractChangedSymbols(diff *GraphDiffOutput) []string {
	var symbols []string
	seen := make(map[string]bool)
	for _, f := range diff.Files {
		for _, ch := range f.Changes {
			name := ch.Name
			if name == "" {
				name = f.Path
			}
			if !seen[name] {
				seen[name] = true
				symbols = append(symbols, name)
			}
		}
		if len(f.Changes) == 0 && !seen[f.Path] {
			seen[f.Path] = true
			symbols = append(symbols, f.Path)
		}
	}
	return symbols
}

// DetectDynamicPatterns inspects source lines or symbol names for dynamic patterns that invalidate static completeness.
func DetectDynamicPatterns(symbol, codeSnippet string) (bool, IncompleteReason, string) {
	lower := strings.ToLower(codeSnippet + " " + symbol)
	if strings.Contains(lower, "reflect.") || strings.Contains(lower, "reflection") {
		return true, ReasonReflection, "Reflection or runtime type inspection used; static graph cannot guarantee complete consumer coverage."
	}
	if strings.Contains(lower, "register") || strings.Contains(lower, "handlerregistry") || strings.Contains(lower, "pluginmap") {
		return true, ReasonRuntimeRegister, "Dynamic registration pattern detected; static call graph cannot resolve runtime registrations."
	}
	if strings.Contains(lower, "dispatch") || strings.Contains(lower, "invoke") || strings.Contains(lower, "dyn_") {
		return true, ReasonDynamicDispatch, "Dynamic dispatch / indirect lookup detected."
	}
	if strings.Contains(lower, "generated") || strings.Contains(lower, "gen.go") || strings.Contains(lower, "pb.go") {
		return true, ReasonGeneratedCode, "Generated code pattern detected; downstream consumers may be dynamically mapped."
	}
	return false, "", ""
}
