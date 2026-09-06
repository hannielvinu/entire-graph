# AegisGraph

## One-sentence summary

AegisGraph is a developer safety layer for AI coding agents that uses Entire Graph to analyze the downstream blast radius of code changes and Entire Checkpoints to preserve and recover development context when a contract or invariant is broken.

## Problem, intended user and why it matters

AI coding agents can make locally correct changes that silently break downstream consumers elsewhere in a codebase.

The intended user is a developer using an AI coding agent on a non-trivial repository.

AegisGraph aims to detect these downstream contract risks before they become uncontrolled repair loops, provide evidence for the affected code, and preserve a known-good development state for recovery.

## Selected Entire track and why Entire is essential

Selected track: Track 2 — Build with Graph Intelligence.

Entire is essential because AegisGraph uses the structural relationships in the Entire Graph to identify downstream callers, consumers and affected parts of the codebase.

The product does not use Entire merely for tracking. Graph evidence is converted into an actionable blast-radius and change-risk analysis that can be verified against source code and tests.

## Architecture and main workflow

Planned architecture:

Coding Agent
    |
    v
AegisGraph
    |
    v
Entire Graph
    |
    v
Blast-Radius Analysis
    |
    v
Deterministic Contract / Invariant Verification
    |
    +---- PASS ----> Continue / checkpoint
    |
    +---- FAIL ----> Recovery + scoped repair guidance

The initial implementation will prioritize a narrow end-to-end workflow rather than a large feature set.

## Entire Graph findings and verification

[TO BE COMPLETED DURING THE BUILD]

Record:
- Graph searches performed
- Definitions identified
- Relationships identified
- Impact analysis results
- How findings were verified against source code
- How findings were verified against tests

## Noon Curveball: what changed and how we adapted

[TO BE COMPLETED AFTER THE NOON CURVEBALL]

Record:
- Original assumption
- Official Curveball constraint
- Affected architecture
- Graph impact analysis
- Implementation change
- Tests added or changed
- Final verification

## Checkpoint links and what each checkpoint proves

### Checkpoint 1 — Initial understanding and architecture

[TO BE COMPLETED]

Proves:
- Original problem understanding
- Intended architecture
- Initial assumptions

### Checkpoint 2 — Pre-noon stable state

[TO BE COMPLETED]

Proves:
- Last stable implementation before the Curveball
- Current architecture
- Completed functionality
- Remaining risks

### Checkpoint 3 — Curveball response

[TO BE COMPLETED]

Proves:
- How the project adapted to the new constraint
- Graph evidence used
- Changed implementation
- Verification

### Checkpoint 4 — Final implementation and verification

[TO BE COMPLETED]

Proves:
- Final implementation
- Tests
- Graph evidence
- Final semantic verification

## Setup, run and test instructions

[TO BE COMPLETED AFTER IMPLEMENTATION]

Document:
- Required tools
- Installation
- Configuration
- How to run AegisGraph
- How to run the demo
- How to run tests
- Expected output

## Databricks use, data sources and limitations

Databricks: [NOT CURRENTLY PLANNED / TO BE DECIDED]

If Databricks is used, document:
- Databricks capability used
- Why it is essential
- Workspace/app/endpoint
- Data sources
- Data provenance
- Reproduction steps
- Limitations
- Curveball impact

## Known limitations and next steps

Initial limitations:

- The first implementation will focus on a narrow developer workflow.
- Deterministic invariant verification will initially target a limited set of contract types.
- Automated repair will be scoped to the demonstrated workflow.
- The prototype will prioritize reliable evidence and reproducibility over broad language/framework coverage.

Future directions:

- Broader language support
- More invariant types
- Stronger agent integration
- Progressive scope narrowing
- Richer Graph visualization
- Cross-repository organizational invariants
- Optional Databricks-backed telemetry and analysis