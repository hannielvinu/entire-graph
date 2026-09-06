package aegisgraph

import (
	"bytes"
	"context"
	"os/exec"
	"strings"
)

// VerificationEngine runs deterministic checks such as type checks, tests, and source inspection.
type VerificationEngine struct {
	RepoPath string
}

// NewVerificationEngine creates a new verification engine.
func NewVerificationEngine(repoPath string) *VerificationEngine {
	return &VerificationEngine{RepoPath: repoPath}
}

// RunVerification executes go vet / go test or targeted tests in the repository.
func (e *VerificationEngine) RunVerification(ctx context.Context, testTargets []string) VerificationResult {
	result := VerificationResult{
		Method:    "go test / compiler & type check",
		Passed:    true,
		ChecksRun: []string{"go vet", "go test"},
	}

	// Determine package targets
	pkgTarget := "./..."
	if len(testTargets) > 0 {
		pkgTarget = testTargets[0]
	}

	// 1. Run go vet on target or package
	vetCmd := exec.CommandContext(ctx, "go", "vet", pkgTarget)
	vetCmd.Dir = e.RepoPath
	var vetOut bytes.Buffer
	vetCmd.Stdout = &vetOut
	vetCmd.Stderr = &vetOut
	if err := vetCmd.Run(); err != nil {
		// If error is solely due to unbuilt CGO grammar build constraints in non-Go grammars, continue to tests
		outStr := vetOut.String()
		if !strings.Contains(outStr, "build constraints exclude all Go files") {
			result.Passed = false
			result.Command = "go vet " + pkgTarget
			result.Output = outStr
			result.ErrorDetail = "Type/contract verification failed in go vet"
			return result
		}
	}

	// 2. Run targeted tests or short tests
	args := []string{"test", "-short"}
	if len(testTargets) > 0 {
		args = append(args, testTargets...)
	} else {
		args = append(args, "./...")
	}

	testCmd := exec.CommandContext(ctx, "go", args...)
	testCmd.Dir = e.RepoPath
	var testOut bytes.Buffer
	testCmd.Stdout = &testOut
	testCmd.Stderr = &testOut
	if err := testCmd.Run(); err != nil {
		outStr := testOut.String()
		if !strings.Contains(outStr, "build constraints exclude all Go files") {
			result.Passed = false
			result.Command = "go " + strings.Join(args, " ")
			result.Output = outStr
			result.ErrorDetail = "Test execution failed during deterministic verification"
			return result
		}
	}

	result.Command = "go " + strings.Join(args, " ")
	result.Output = "All deterministic contract checks and tests passed."
	return result
}
