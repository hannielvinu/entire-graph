# AegisGraph

## One-sentence summary

AegisGraph is an evidence-driven safety layer for AI coding agents that utilizes Entire Graph structural intelligence to calculate blast radius, classifies evidence completeness against dynamic/runtime edge cases (Curveball response), executes deterministic contract verification, produces explainable SAFE / REVIEW / BLOCK decisions, enables Entire Checkpoint rollbacks, and streams architectural risk events to Databricks.

## Problem, intended user and why it matters

AI coding agents can generate modifications that appear locally correct but silently break downstream contracts or invariants in non-trivial repositories. 

The intended user is a software engineer or AI pair-programming agent working on multi-package codebases. AegisGraph ensures that agent changes do not trigger uncontrolled failure loops by grounding safety decisions in structural code graphs and deterministic tests, rather than blind heuristics.

## Selected Entire track and why Entire is essential

**Track 2 — Build with Graph Intelligence.**

Entire Graph is the foundational engine of AegisGraph. It provides deterministic, zero-egress structural analysis including entity-level semantic diffs, caller/callee traversals, type consumer mapping, and data flow tracking.

AegisGraph transforms raw Graph data into actionable decisioning:
1. Translates Graph relations into confirmed structural evidence.
2. Identifies when Graph evidence is incomplete (dynamic dispatch, reflection, registration, warnings).
3. Gates code changes with deterministic verification.
4. Leverages Entire Checkpoints for rollback and recovery when contracts fail.

## Architecture and main workflow

```
AGENT / CODE CHANGE
        |
        v
ENTIRE GRAPH SEMANTIC DIFF (`entire graph diff --json`)
        |
        v
ENTIRE GRAPH IMPACT ANALYSIS (`entire graph impact --format json`)
        |
        v
EVIDENCE CLASSIFICATION ENGINE
        |
        +-------------------+-------------------+
        |                                       |
        v                                       v
CONFIRMED STRUCTURAL EVIDENCE         INCOMPLETE / HEURISTIC EVIDENCE
(Direct Callers, Type Consumers)      (Dynamic Dispatch, Reflection, Warnings)
        |                                       |
        +-------------------+-------------------+
                            |
                            v
               DETERMINISTIC VERIFICATION
               (go vet, unit tests, contracts)
                            |
                            v
                   RISK DECISION ENGINE
                            |
        +-------------------+-------------------+
        |                   |                   |
      SAFE                REVIEW              BLOCK
(All Confirmed +      (Incomplete/         (Verification
 Verification PASS)   Uncertain Graph)      Failed)
        |                   |                   |
        +-------------------+-------------------+
                            |
                            v
                 STRUCTURED ANALYSIS EVENT
                            |
                            v
            DATABRICKS LAKEHOUSE / LOCAL SINK
```

## Entire Graph findings and capabilities used

Actual Entire Graph commands utilized:
- `entire graph version --json`: Identified plugin version `v0.4.0`.
- `entire graph diff --base <base> --head <head> --json`: Entity-level semantic diff identifying changed files, symbol types, and dependent counts.
- `entire graph impact --symbol <symbol> --repo <path> --format json`: Deep blast-radius analysis extracting callers, callees, type consumers, data flows, and completeness warnings.
- `entire checkpoints list`: Discovers available and stable checkpoints for rollback guidance.
- `entire checkpoint explain <id>`: Inspects session and commit metadata for safe recovery points.

## Noon Curveball: what changed and how we adapted

### The Curveball Constraint
*"Graph is evidence, not an oracle."* Codebases frequently feature dynamic dispatch, runtime handler registries, reflection, generated code, and partial analysis where static graphs cannot guarantee 100% completeness. "No relationship found" cannot be assumed to mean "no relationship exists."

### Invalidation of Previous Assumption
- **Old Assumption:** "If Entire Graph reports a relationship set, that set is complete and authoritative."
- **Invalidated By:** Dynamic runtime registration, Go `reflect`, interface dispatch, and analysis budget warnings.
- **New Behavior:** AegisGraph treats Graph output as structural evidence. If dynamic patterns, reflection, or graph warnings are detected, evidence is classified as `INCOMPLETE`, prompting mandatory deterministic verification and escalating clean changes to `REVIEW`.

## Evidence Classification

- **CONFIRMED:** Structural relationships directly proven by Entire Graph (e.g., direct call graph, concrete type consumption, data flow edges).
- **INCOMPLETE / HEURISTIC:** Unresolved dynamic dispatch, runtime registration (`reflect`, registry maps), generated code, or Graph analysis warnings.
- **VERIFY:** Required verification targets (targeted tests, compiler checks) before an agent's change can be accepted.

## Decision Rules

- **SAFE:** All relationships are CONFIRMED by Entire Graph, no incomplete patterns detected, and deterministic verification PASSES.
- **REVIEW:** Incomplete/heuristic evidence exists (Curveball condition) or large unverified blast radius detected, requiring human inspection.
- **BLOCK:** Deterministic verification FAILS or contract break detected. Recovery recommendation to a stable Entire Checkpoint is generated.

## Checkpoint links and what each checkpoint proves

- **`cdca4eeb37ef` (Pre-Curveball Stable Baseline):** Stable baseline commit `d347fa7` prior to Curveball injection.
- **AegisGraph Milestones:** Integration of Entire Graph adapters, evidence classification engine, deterministic verifier, Curveball dynamic handler, Databricks telemetry sink, and automated test suite.

## Setup, run and test instructions

### Prerequisites
- Go 1.22+ (tested with Go 1.26)
- Entire CLI with `entire-graph` plugin

### Building AegisGraph
```bash
cd aegisgraph
go build -o ../bin/aegisgraph.exe ./cmd
```

### Running Tests
```bash
cd aegisgraph
go test -v ./...
```

### Running AegisGraph Analysis
```bash
# Standard analysis
.\bin\aegisgraph.exe --repo . --base HEAD~1 --head HEAD

# Curveball incomplete-evidence + contract-break simulation
.\bin\aegisgraph.exe --simulate-curveball --simulate-verification-fail

# Machine-readable JSON output
.\bin\aegisgraph.exe --json
```

## Databricks integration

- **Integration Mode:** Dual-mode architecture supporting live Databricks Lakehouse SQL Warehouses and deterministic Local JSONL Sink (`aegisgraph_events.jsonl`).
- **Telemetry Event Schema:** Includes `event_id`, `timestamp`, `repository`, `commit`, `checkpoint`, `changed_symbols`, `impacted_symbols`, `confirmed_relationships`, `incomplete_relationships`, `verification_status`, `decision`, `decision_reason`, `recovery_required`, `curveball_mode`, and `analysis_version`.
- **SQL Analytics:** Provided in `aegisgraph/databricks_schema.sql` for computing blocked change frequency, incomplete graph analysis rates, and checkpoint recovery trends.
- **Status in Environment:** Live Databricks ingestion was unauthenticated in this environment; deterministic Lakehouse JSONL fallback active and verified.

## Known limitations and next steps

- Dynamic pattern detection currently relies on heuristic symbol and source pattern matching.
- Future versions will support cross-language multi-repository invariant enforcement and direct Databricks REST client auto-provisioning.


## Final Entire Checkpoint Note

AegisGraph implementation is complete and verified. The final implementation commit is `1781ee5`.

Entire Graph is used as structural evidence for semantic diff, impact analysis, and relationship analysis. AegisGraph explicitly distinguishes confirmed evidence from incomplete/heuristic evidence and requires deterministic verification before making safety decisions.

The Curveball response preserves fully resolved Graph behavior while routing incomplete analysis through verification and REVIEW/BLOCK decisions.

The stable pre-Curveball Entire checkpoint is `cdca4eeb37ef`. The final implementation was committed outside an Entire agent session, so commit `1781ee5` does not contain an Entire-Checkpoint trailer. This limitation is documented rather than reconstructed or fabricated.