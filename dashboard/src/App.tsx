import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Database, 
  Layers, 
  FileCode2, 
  Terminal,
  Info
} from 'lucide-react';

type Scenario = 'NORMAL' | 'CURVEBALL' | 'BLOCK';
type ActiveTab = 'overview' | 'graph' | 'verification' | 'checkpoints' | 'events';

export const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('NORMAL');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);

  // Scenario state data
  const scenarioData = {
    NORMAL: {
      changeName: 'Final-Entire-Checkpoint-Note',
      baseRef: 'HEAD~1',
      headRef: 'HEAD',
      decision: 'REVIEW',
      reason: 'Graph evidence is incomplete (worktree warning & degraded completeness). Deterministic verification required.',
      confirmed: 6,
      incomplete: 2,
      verifyCount: 2,
      verificationPassed: true,
      verificationOutput: 'All deterministic contract checks and tests passed.',
      warnings: [
        'W_WORKTREE_SNAPSHOT: Snapshot records read from working tree (--worktree requested)',
        'Partial analysis detected: completeness level degraded with 1 partial failure'
      ],
      eventId: 'evt_1788684880056506300'
    },
    CURVEBALL: {
      changeName: 'DynamicHandlerRegistry & TokenValidator',
      baseRef: 'HEAD~1',
      headRef: 'HEAD',
      decision: 'REVIEW',
      reason: 'Curveball active: Reflection / dynamic registration pattern detected. Static Entire Graph cannot prove completeness.',
      confirmed: 4,
      incomplete: 3,
      verifyCount: 3,
      verificationPassed: true,
      verificationOutput: 'All deterministic compiler checks and unit test suites passed.',
      warnings: [
        'Dynamic dispatch / runtime type registration pattern detected (Go reflect.ValueOf)',
        'W_WORKTREE_SNAPSHOT: snapshot records are read from working tree',
        'Partial analysis detected: completeness level degraded with 1 partial failure'
      ],
      eventId: 'evt_1788685038140373400'
    },
    BLOCK: {
      changeName: 'ValidateToken (Contract Broken)',
      baseRef: 'HEAD~1',
      headRef: 'HEAD',
      decision: 'BLOCK',
      reason: 'Deterministic verification failed: Downstream consumer contract test failed (Type mismatch in CheckoutService).',
      confirmed: 4,
      incomplete: 3,
      verifyCount: 3,
      verificationPassed: false,
      verificationOutput: '--- FAIL: TestTokenValidationContract (0.04s)\n    session_test.go:42: downstream consumer expected TokenPayload, received raw string',
      warnings: [
        'Dynamic registration / reflection detected',
        'Downstream contract break detected across package boundary'
      ],
      eventId: 'evt_1788685144275184200'
    }
  };

  const current = scenarioData[scenario];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        gap: '24px'
      }}>
        {/* Logo & Product Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #38bdf8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Shield size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>AEGISGRAPH</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Evidence Safety Layer</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'graph', label: 'Graph Evidence', icon: Layers },
            { id: 'verification', label: 'Verification', icon: CheckCircle2 },
            { id: 'checkpoints', label: 'Checkpoints', icon: RotateCcw },
            { id: 'events', label: 'Risk Events', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? '#38bdf8' : 'var(--text-muted)'} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Core Tagline Badge */}
        <div style={{
          marginTop: 'auto',
          padding: '14px',
          borderRadius: '10px',
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-color)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--accent-blue)', marginBottom: '4px' }}>Core Principle:</div>
          "Entire Graph is evidence — not an oracle."
          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(51,65,85,0.4)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            Entire Graph: <span style={{ color: '#fff' }}>v0.4.0</span><br />
            Engine: <span style={{ color: '#fff' }}>AegisGraph v1.0</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{
          padding: '16px 32px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(12px)'
        }}>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 700 }}>AI Code Change Safety Intelligence</h1>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Graph evidence → verification → decision
            </p>
          </div>

          {/* Scenario Selector & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(30, 41, 59, 0.6)', padding: '4px 6px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '8px', paddingRight: '4px' }}>
                DEMO SCENARIO:
              </span>
              {(['NORMAL', 'CURVEBALL', 'BLOCK'] as Scenario[]).map(sc => (
                <button
                  key={sc}
                  onClick={() => setScenario(sc)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    background: scenario === sc 
                      ? (sc === 'BLOCK' ? 'var(--accent-red)' : sc === 'CURVEBALL' ? 'var(--accent-amber)' : 'var(--accent-blue)')
                      : 'transparent',
                    color: scenario === sc ? '#090d16' : 'var(--text-secondary)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {sc}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', boxShadow: '0 0 8px var(--accent-green)' }} />
                Online / Local
              </span>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span>repo: <code style={{ color: '#fff' }}>entire-graph</code></span>
              <span style={{ color: 'var(--border-color)' }}>|</span>
              <span>branch: <code style={{ color: '#fff' }}>main</code></span>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Pipeline Visualizer */}
          <div className="glass-panel" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '16px' }}>
              Autonomous Safety Pipeline
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {[
                { step: '1', title: 'CODE CHANGE', desc: current.changeName.substring(0, 18) + '...', color: 'var(--accent-purple)' },
                { step: '2', title: 'SEMANTIC DIFF', desc: 'Diff entity parser', color: 'var(--accent-blue)' },
                { step: '3', title: 'GRAPH IMPACT', desc: `${current.confirmed} Confirmed edges`, color: 'var(--accent-blue)' },
                { step: '4', title: 'EVIDENCE', desc: `${current.incomplete} Incomplete/heuristic`, color: 'var(--accent-amber)' },
                { step: '5', title: 'VERIFICATION', desc: current.verificationPassed ? 'PASS' : 'FAIL', color: current.verificationPassed ? 'var(--accent-green)' : 'var(--accent-red)' },
                { step: '6', title: 'DECISION', desc: current.decision, color: current.decision === 'BLOCK' ? 'var(--accent-red)' : 'var(--accent-amber)' },
              ].map((stage, idx, arr) => (
                <React.Fragment key={stage.step}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 2,
                    minWidth: '130px'
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-secondary)',
                      border: `2px solid ${stage.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      color: stage.color,
                      boxShadow: `0 0 12px ${stage.color}33`
                    }}>
                      {stage.step}
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, textAlign: 'center' }}>{stage.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>{stage.desc}</div>
                  </div>

                  {idx < arr.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: '2px',
                      background: 'linear-gradient(90deg, rgba(56,189,248,0.4), rgba(129,140,248,0.4))',
                      margin: '0 8px',
                      marginTop: '-28px'
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* MAIN HERO CARD: CURRENT CHANGE ANALYSIS */}
          <div className="glass-panel" style={{ padding: '28px', borderLeft: `4px solid ${current.decision === 'BLOCK' ? 'var(--accent-red)' : 'var(--accent-amber)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>CURRENT CHANGE ANALYSIS</span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(51, 65, 85, 0.4)', color: 'var(--text-secondary)' }}>
                    {current.baseRef} → {current.headRef}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileCode2 size={24} color="#38bdf8" />
                  {current.changeName}
                </h2>
              </div>

              {/* Decision Badge */}
              <div style={{ textAlign: 'right' }}>
                <div className={current.decision === 'BLOCK' ? 'badge-block' : 'badge-review'} style={{
                  padding: '8px 24px',
                  borderRadius: '10px',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  {current.decision === 'BLOCK' ? <XCircle size={20} /> : <AlertTriangle size={20} />}
                  {current.decision}
                </div>
              </div>
            </div>

            {/* Decision Reason */}
            <div style={{
              margin: '20px 0',
              padding: '14px 18px',
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              borderRadius: '8px',
              border: '1px solid rgba(51, 65, 85, 0.5)',
              fontSize: '0.9rem',
              lineHeight: 1.5,
              color: '#cbd5e1'
            }}>
              <span style={{ fontWeight: 700, color: '#fff' }}>Decision Reason: </span>
              {current.reason}
            </div>

            {/* Metric Summary Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginTop: '24px' }}>
              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>CONFIRMED EVIDENCE</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-green)', marginTop: '4px' }}>{current.confirmed}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Direct structural callers & consumers</div>
              </div>

              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>INCOMPLETE EVIDENCE</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>{current.incomplete}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Dynamic / Reflection / Warnings</div>
              </div>

              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DETERMINISTIC VERIFICATION</div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: current.verificationPassed ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '4px' }}>
                  {current.verificationPassed ? 'PASS' : 'FAIL'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>go vet / tests / contract checks</div>
              </div>

              <div style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>STABLE RECOVERY CHECKPOINT</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px', fontFamily: 'JetBrains Mono' }}>
                  cdca4eeb37ef
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Pre-Curveball baseline</div>
              </div>
            </div>

            {/* Recovery Action if Blocked */}
            {current.decision === 'BLOCK' && (
              <div style={{
                marginTop: '20px',
                padding: '16px',
                borderRadius: '8px',
                background: 'rgba(248, 113, 113, 0.1)',
                border: '1px solid rgba(248, 113, 113, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <RotateCcw size={24} color="var(--accent-red)" />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--accent-red)' }}>RECOVERY REQUIRED: Entire Checkpoint Available</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Safe state preserved at checkpoint <code style={{ color: '#fff' }}>cdca4eeb37ef</code>.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecoveryModal(true)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'var(--accent-red)',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer'
                  }}
                >
                  View Recovery Checkpoint
                </button>
              </div>
            )}
          </div>

          {/* DUAL PANELS: GRAPH EVIDENCE + CURVEBALL INTEL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
            
            {/* Graph Visualization Panel */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={20} color="#38bdf8" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Structural Blast-Radius Evidence</h3>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Entire Graph v0.4.0 Engine</div>
              </div>

              {/* Graph Visual Mock Nodes */}
              <div style={{
                padding: '24px',
                backgroundColor: 'rgba(9, 13, 22, 0.8)',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                {/* Source Node */}
                <div style={{
                  padding: '12px 16px',
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  border: '1px solid var(--accent-purple)',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem'
                }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-purple)' }}>SOURCE SYMBOL (DIFF)</div>
                  {current.changeName}
                </div>

                {/* Edges & Targets */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{
                    padding: '12px',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--accent-green)', fontWeight: 700 }}>CONFIRMED CALLER</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '2px' }}>VerificationEngine.Run</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>verifier.go:21 (CALLS)</div>
                  </div>

                  <div style={{
                    padding: '12px',
                    backgroundColor: 'rgba(52, 211, 153, 0.1)',
                    border: '1px solid rgba(52, 211, 153, 0.3)',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--accent-green)', fontWeight: 700 }}>TYPE CONSUMER</div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '2px' }}>RiskReport</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>model.go:52 (USES_TYPE)</div>
                  </div>

                  <div style={{
                    gridColumn: 'span 2',
                    padding: '12px',
                    backgroundColor: 'rgba(251, 191, 36, 0.1)',
                    border: '1px dashed rgba(251, 191, 36, 0.4)',
                    borderRadius: '6px'
                  }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', fontWeight: 700 }}>
                      ⚠ INCOMPLETE / HEURISTIC (CURVEBALL)
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '2px' }}>
                      Dynamic Dispatch / Runtime Registry
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      reflect.ValueOf() detected; static call graph cannot prove 100% consumer coverage.
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '14px', lineHeight: 1.4 }}>
                * Entire Graph provides deterministic structural evidence. AegisGraph refuses to assume incomplete graphs are complete.
              </div>
            </div>

            {/* Curveball Intelligence Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <AlertTriangle size={20} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Curveball Response Engine</h3>
              </div>

              <div style={{
                padding: '14px',
                backgroundColor: 'rgba(251, 191, 36, 0.08)',
                border: '1px solid rgba(251, 191, 36, 0.3)',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#fef3c7',
                lineHeight: 1.5,
                marginBottom: '16px'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Constraint Invalidation:</div>
                "Static code graphs cannot prove completeness in presence of dynamic dispatch, reflection, or generated code."
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>ACTIVE GRAPH WARNINGS:</div>
                {current.warnings.map((w, i) => (
                  <div key={i} style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.75rem',
                    color: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Info size={14} color="#38bdf8" />
                    {w}
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Telemetrics ID:</div>
                <code style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{current.eventId}</code>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Sink: Local Lakehouse Fallback Active
                </div>
              </div>
            </div>

          </div>

          {/* VERIFICATION AND EVENT AUDIT ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            
            {/* Deterministic Verification Log */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Terminal size={20} color="#34d399" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Deterministic Verification</h3>
              </div>

              <pre style={{
                padding: '16px',
                backgroundColor: '#050811',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                fontSize: '0.78rem',
                color: current.verificationPassed ? '#34d399' : '#f87171',
                overflowX: 'auto',
                lineHeight: 1.5,
                minHeight: '120px'
              }}>
                {`$ go test -short ./...\n` + current.verificationOutput}
              </pre>
            </div>

            {/* Checkpoint Provenance */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <RotateCcw size={20} color="#818cf8" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Entire Checkpoint Provenance</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8' }}>cdca4eeb37ef</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-green)' }}>● STABLE BASELINE</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Commit: <code style={{ color: '#fff' }}>d347fa7</code> — chore: checkpoint stable pre-Curveball state
                  </div>
                </div>

                <div style={{ padding: '12px', borderRadius: '6px', backgroundColor: 'rgba(30, 41, 59, 0.4)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>Commit 49956db</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RELEASE</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    fix: finalize AegisGraph buildathon verification and documentation
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* RECOVERY MODAL FOR JUDGES */}
      {showRecoveryModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '560px', padding: '32px', border: '1px solid var(--accent-red)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <RotateCcw size={28} color="var(--accent-red)" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Entire Checkpoint Recovery Guidance</h3>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              The change was <strong style={{ color: 'var(--accent-red)' }}>BLOCKED</strong> because deterministic contract verification failed against downstream consumers.
              AegisGraph protects the codebase by pointing directly to the last verified stable Entire checkpoint:
            </p>

            <div style={{
              padding: '16px',
              backgroundColor: '#050811',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.85rem',
              color: '#38bdf8',
              marginBottom: '24px',
              border: '1px solid var(--border-color)'
            }}>
              entire checkpoint explain cdca4eeb37ef
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowRecoveryModal(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'rgba(51, 65, 85, 0.8)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
