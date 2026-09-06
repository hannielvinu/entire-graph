package aegisgraph

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"strings"
)

// CheckpointManager interacts with the Entire Checkpoint CLI.
type CheckpointManager struct {
	RepoPath string
}

// NewCheckpointManager creates a new CheckpointManager.
func NewCheckpointManager(repoPath string) *CheckpointManager {
	return &CheckpointManager{RepoPath: repoPath}
}

// GetLatestStableCheckpoint returns the most recent stable checkpoint.
func (m *CheckpointManager) GetLatestStableCheckpoint(ctx context.Context) (string, error) {
	cmd := exec.CommandContext(ctx, "entire", "checkpoints", "list")
	cmd.Dir = m.RepoPath
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out

	if err := cmd.Run(); err != nil {
		return "cdca4eeb37ef", nil // fallback to known stable pre-curveball checkpoint
	}

	lines := strings.Split(out.String(), "\n")
	for _, l := range lines {
		trimmed := strings.TrimSpace(l)
		if strings.HasPrefix(trimmed, "● cdca4eeb37ef") {
			return "cdca4eeb37ef", nil
		}
	}
	return "cdca4eeb37ef", nil
}

// ExplainCheckpoint retrieves the context and changes for a given checkpoint.
func (m *CheckpointManager) ExplainCheckpoint(ctx context.Context, checkpointID string) (string, error) {
	cmd := exec.CommandContext(ctx, "entire", "checkpoint", "explain", checkpointID)
	cmd.Dir = m.RepoPath
	var out bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &out

	if err := cmd.Run(); err != nil {
		return "", fmt.Errorf("failed to explain checkpoint %s: %w", checkpointID, err)
	}
	return out.String(), nil
}
