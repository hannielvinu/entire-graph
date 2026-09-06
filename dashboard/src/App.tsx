import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  XCircle, 
  RotateCcw, 
  Database, 
  Layers, 
  Terminal
} from 'lucide-react';

type Scenario = 'NORMAL' | 'CURVEBALL' | 'BLOCK';

export const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('NORMAL');
  const [showModal, setShowModal] = useState<boolean>(false);

  const scenarioData = {
    NORMAL: {
      title: 'Final-Entire-Checkpoint-Note',
      file: 'BUILDATHON.md:L148-156',
      decision: 'REVIEW',
      reason: 'Graph evidence contains working tree snapshot warnings and degraded completeness level. Deterministic verification required before approval.',
      confirmed: 6,
      incomplete: 2,
      verify: 2,
      verPassed: true,
      verOutput: 'PASS: 4/4 packages validated. go vet and unit tests satisfied in 0.51s.',
      warnings: [
        'W_WORKTREE_SNAPSHOT: Snapshot records read from working tree (--worktree requested)',
        'Partial analysis detected: completeness level degraded with 1 partial failure'
      ],
      nodes: [
        { name: 'BUILDATHON.md', type: 'Diff Target', rel: 'MODIFIED', status: 'source' },
        { name: 'VerificationEngine.RunVerification', type: 'Function', rel: 'CALLS', status: 'confirmed' },
        { name: 'DecisionEngine.Evaluate', type: 'Method', rel: 'CALLS', status: 'confirmed' },
        { name: 'RiskReport.Evidence', type: 'Type', rel: 'USES_TYPE', status: 'confirmed' },
        { name: 'Entire Graph Engine', type: 'Warning', rel: 'W_WORKTREE_SNAPSHOT', status: 'warning' },
      ],
      eventId: 'evt_1788684880056506300'
    },
    CURVEBALL: {
      title: 'DynamicHandlerRegistry & TokenValidator',
      file: 'internal/auth/registry.go:L34',
      decision: 'REVIEW',
      reason: 'Curveball Trigger: Dynamic dispatch and Go reflect.ValueOf detected. Entire Graph cannot guarantee complete consumer coverage.',
      confirmed: 4,
      incomplete: 3,
      verify: 3,
      verPassed: true,
      verOutput: 'PASS: Runtime type assertions and targeted contract checks passed in 0.59s.',
      warnings: [
        'Dynamic dispatch / runtime type registration detected (Go reflect.ValueOf)',
        'W_WORKTREE_SNAPSHOT: Snapshot records read from working tree',
        'Partial analysis detected: completeness level degraded with 1 partial failure'
      ],
      nodes: [
        { name: 'registry.go', type: 'Diff Target', rel: 'MODIFIED', status: 'source' },
        { name: 'VerificationEngine.Run', type: 'Method', rel: 'CALLS', status: 'confirmed' },
        { name: 'reflect.ValueOf()', type: 'Reflection', rel: 'DYNAMIC_DISPATCH', status: 'warning' },
        { name: 'RuntimeHandlerMap', type: 'Registry', rel: 'RUNTIME_REGISTER', status: 'warning' },
      ],
      eventId: 'evt_1788685038140373400'
    },
    BLOCK: {
      title: 'ValidateToken (Breaking Signature)',
      file: 'internal/auth/session.go:L18',
      decision: 'BLOCK',
      reason: 'Deterministic verification failed: Downstream CheckoutService contract broken. Rollback to stable checkpoint required.',
      confirmed: 4,
      incomplete: 3,
      verify: 3,
      verPassed: false,
      verOutput: '--- FAIL: TestTokenValidationContract (0.04s)\n    session_test.go:42: downstream consumer expected TokenPayload, received raw string',
      warnings: [
        'Dynamic registration / reflection detected',
        'Downstream consumer contract test failed'
      ],
      nodes: [
        { name: 'session.go', type: 'Diff Target', rel: 'MODIFIED', status: 'source' },
        { name: 'CheckoutService.ProcessOrder', type: 'Consumer', rel: 'CONTRACT_BREAK', status: 'broken' },
        { name: 'SessionMiddleware', type: 'Caller', rel: 'CALLS', status: 'confirmed' },
        { name: 'DynamicHandlerRegistry', type: 'Dynamic', rel: 'DYNAMIC_DISPATCH', status: 'warning' },
      ],
      eventId: 'evt_1788685144275184200'
    }
  };

  const curr = scenarioData[scenario];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg)' }}>
      {/* Top Navbar */}
      <header style={{
        height: '56px',
        borderBottom: '1px solid var(--border)',
        backgroundColor: 'var(--surface-1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            backgroundColor: 'var(--blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.2px' }}>AEGISGRAPH</span>
          <span style={{ color: 'var(--border-light)' }}>/</span>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Safety Layer</span>
        </div>

        {/* Demo Scenario Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--surface-2)', padding: '3px', borderRadius: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-dim)', padding: '0 8px' }}>SCENARIOS:</span>
          {(['NORMAL', 'CURVEBALL', 'BLOCK'] as Scenario[]).map(sc => (
            <button
              key={sc}
              onClick={() => setScenario(sc)}
              style={{
                border: 'none',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: scenario === sc ? 'var(--surface-1)' : 'transparent',
                color: scenario === sc ? '#fff' : 'var(--text-muted)',
                boxShadow: scenario === sc ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.1s ease'
              }}
            >
              {sc === 'NORMAL' ? '1. Normal' : sc === 'CURVEBALL' ? '2. Curveball' : '3. Contract Block'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>repo: <strong style={{ color: 'var(--text-main)' }}>entire-graph</strong></span>
          <span>branch: <strong style={{ color: 'var(--text-main)' }}>main</strong></span>
          <span>Entire Graph: <strong style={{ color: 'var(--text-main)' }}>v0.4.0</strong></span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1400px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Core Narrative Banner */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '13px'
        }}>
          <div>
            <strong style={{ color: 'var(--blue)' }}>Core Principle: </strong>
            <span style={{ color: 'var(--text-muted)' }}>
              "Entire Graph provides structural evidence — it is not an oracle. Incomplete dynamic patterns trigger deterministic verification."
            </span>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Track 2: Build with Graph Intelligence</span>
        </div>

        {/* Primary Analysis Overview Card */}
        <div className="panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
                Evaluated Code Change
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 600 }}>{curr.title}</h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'JetBrains Mono' }}>
                Target: {curr.file}
              </div>
            </div>

            <div>
              <span className={curr.decision === 'BLOCK' ? 'badge badge-block' : 'badge badge-review'} style={{ fontSize: '13px', padding: '6px 14px' }}>
                {curr.decision === 'BLOCK' ? <XCircle size={14} /> : <AlertTriangle size={14} />}
                DECISION: {curr.decision}
              </span>
            </div>
          </div>

          {/* Reason Box */}
          <div style={{
            padding: '12px 14px',
            backgroundColor: 'var(--surface-2)',
            borderRadius: '6px',
            fontSize: '13px',
            color: 'var(--text-main)',
            borderLeft: `3px solid ${curr.decision === 'BLOCK' ? 'var(--rose)' : 'var(--amber)'}`,
            marginBottom: '20px'
          }}>
            <strong>Analysis Reason: </strong>{curr.reason}
          </div>

          {/* 4 Core Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-2)', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>CONFIRMED EVIDENCE</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--emerald)', marginTop: '4px' }}>{curr.confirmed}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Direct structural relationships</div>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-2)', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>INCOMPLETE EVIDENCE</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--amber)', marginTop: '4px' }}>{curr.incomplete}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Dynamic / unverified patterns</div>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-2)', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>VERIFICATION VERDICT</div>
              <div style={{ fontSize: '24px', fontWeight: 700, color: curr.verPassed ? 'var(--emerald)' : 'var(--rose)', marginTop: '4px' }}>
                {curr.verPassed ? 'PASS' : 'FAIL'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Deterministic test harness</div>
            </div>

            <div style={{ padding: '12px 16px', backgroundColor: 'var(--surface-2)', borderRadius: '6px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 600 }}>STABLE CHECKPOINT</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--blue)', marginTop: '8px', fontFamily: 'JetBrains Mono' }}>
                cdca4eeb37ef
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Known good recovery target</div>
            </div>
          </div>

          {/* Recovery Callout if Blocked */}
          {curr.decision === 'BLOCK' && (
            <div style={{
              marginTop: '16px',
              padding: '12px 16px',
              backgroundColor: 'var(--rose-subtle)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <RotateCcw size={18} color="var(--rose)" />
                <span style={{ fontSize: '13px', color: 'var(--rose)', fontWeight: 600 }}>
                  Deployment Blocked: Downstream contract broken. Safe rollback available.
                </span>
              </div>
              <button
                onClick={() => setShowModal(true)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'var(--rose)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                View Rollback Command
              </button>
            </div>
          )}
        </div>

        {/* 2-Column Section: Structural Graph + Verification Log */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Structural Graph Evidence */}
          <div className="panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--blue)" />
                <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Structural Blast-Radius Evidence</h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>Entire Graph v0.4.0</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {curr.nodes.map((node, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 12px',
                    backgroundColor: 'var(--surface-2)',
                    borderRadius: '6px',
                    borderLeft: `3px solid ${node.status === 'confirmed' ? 'var(--emerald)' : node.status === 'broken' ? 'var(--rose)' : 'var(--amber)'}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#fff' }}>{node.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-dim)', fontFamily: 'JetBrains Mono' }}>{node.type}</div>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'JetBrains Mono',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--surface-1)',
                    color: node.status === 'confirmed' ? 'var(--emerald)' : node.status === 'broken' ? 'var(--rose)' : 'var(--amber)'
                  }}>
                    {node.rel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deterministic Verification Log */}
          <div className="panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Terminal size={16} color="var(--emerald)" />
                <h3 style={{ fontSize: '14px', fontWeight: 600 }}>Deterministic Verifier Log</h3>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-dim)' }}>go vet & contract tests</span>
            </div>

            <pre style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#070a13',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              fontSize: '12px',
              fontFamily: 'JetBrains Mono',
              color: curr.verPassed ? 'var(--emerald)' : 'var(--rose)',
              lineHeight: 1.5,
              overflowX: 'auto',
              minHeight: '180px'
            }}>
              {`$ aegisgraph --verify\n` + curr.verOutput}
            </pre>
          </div>

        </div>

        {/* Provenance & Telemetry Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          <div className="panel" style={{ padding: '16px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
              <Database size={16} color="var(--blue)" />
              <span>Databricks Lakehouse Telemetry</span>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Structured event ID: <code style={{ color: 'var(--blue)' }}>{curr.eventId}</code>
            </div>
            <div style={{ color: 'var(--text-dim)', marginTop: '4px' }}>
              Sink: Local JSONL Lakehouse Fallback Active (Live credentials not configured)
            </div>
          </div>

          <div className="panel" style={{ padding: '16px', fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: 600 }}>
              <RotateCcw size={16} color="var(--text-muted)" />
              <span>Entire Checkpoint History</span>
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Stable Baseline: <code style={{ color: 'var(--emerald)' }}>cdca4eeb37ef</code> (Commit d347fa7)
            </div>
            <div style={{ color: 'var(--text-dim)', marginTop: '4px' }}>
              Latest Release: Commit 452e35b / b78bb43
            </div>
          </div>

        </div>

      </main>

      {/* Rollback Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="panel" style={{ width: '480px', padding: '24px', border: '1px solid var(--rose)' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--rose)', marginBottom: '8px' }}>
              Rollback to Stable Entire Checkpoint
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
              The change failed deterministic verification. AegisGraph recommends restoring the last known safe state:
            </p>
            <div style={{
              padding: '12px',
              backgroundColor: '#070a13',
              borderRadius: '6px',
              fontFamily: 'JetBrains Mono',
              fontSize: '13px',
              color: 'var(--blue)',
              marginBottom: '16px'
            }}>
              entire checkpoint explain cdca4eeb37ef
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: 'var(--surface-3)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
