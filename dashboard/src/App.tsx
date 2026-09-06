import React, { useState, useEffect } from 'react';
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
  Play,
  Flame,
  Sparkles,
  Clock,
  Radio
} from 'lucide-react';

type Scenario = 'NORMAL' | 'CURVEBALL' | 'BLOCK';
type TabType = 'overview' | 'graph' | 'verification' | 'checkpoints' | 'events';

export const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('NORMAL');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(6);
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Trigger interactive analysis animation
  const runLiveAnalysis = (targetScenario: Scenario) => {
    setScenario(targetScenario);
    setIsAnalyzing(true);
    setActivePipelineStep(1);

    const stepIntervals = [250, 500, 800, 1100, 1400, 1700];
    stepIntervals.forEach((time, index) => {
      setTimeout(() => {
        setActivePipelineStep(index + 1);
        if (index === stepIntervals.length - 1) {
          setIsAnalyzing(false);
        }
      }, time);
    });
  };

  useEffect(() => {
    // Initial load animation
    runLiveAnalysis('NORMAL');
  }, []);

  const scenarioData = {
    NORMAL: {
      changeName: 'Final-Entire-Checkpoint-Note',
      filePath: 'BUILDATHON.md:L148-156',
      baseRef: 'HEAD~1 (829017f)',
      headRef: 'HEAD (49956db)',
      decision: 'REVIEW',
      reason: 'Graph evidence contains working tree snapshot warnings and 1 partial analysis warning. Deterministic verification required.',
      confirmedCount: 6,
      incompleteCount: 2,
      verifyCount: 2,
      verificationPassed: true,
      verificationTimeMs: 142,
      verificationLogs: [
        '[+] go vet ./... -> PASS (0 error(s), 0 warning(s))',
        '[+] go test -short ./... -> PASS (4 tests passed in 0.51s)',
        '[✓] TestConfirmedEvidence: PASSED (0.00s)',
        '[✓] TestCurveballIncompleteEvidence: PASSED (0.00s)',
        '[✓] TestDeterministicVerificationFailure: PASSED (0.00s)',
        '[✓] TestEventSinkAndDatabricksFallback: PASSED (0.00s)',
        '--------------------------------------------------',
        'VERIFICATION VERDICT: ALL INVARIANTS SATISFIED'
      ],
      nodes: [
        { id: 'source', name: 'Final-Entire-Checkpoint-Note', kind: 'SECTION', status: 'changed', file: 'BUILDATHON.md' },
        { id: 'caller1', name: 'VerificationEngine.RunVerification', kind: 'FUNCTION', status: 'confirmed', file: 'aegisgraph/verifier.go:21', rel: 'CALLS' },
        { id: 'caller2', name: 'DecisionEngine.Evaluate', kind: 'METHOD', status: 'confirmed', file: 'aegisgraph/decision.go:15', rel: 'CALLS' },
        { id: 'consumer1', name: 'RiskReport.Evidence', kind: 'TYPE', status: 'confirmed', file: 'aegisgraph/model.go:52', rel: 'USES_TYPE' },
        { id: 'warn1', name: 'W_WORKTREE_SNAPSHOT', kind: 'WARNING', status: 'incomplete', file: 'Entire Graph Engine', rel: 'EMITS_WARNING' },
        { id: 'warn2', name: 'W_PARTIAL_ANALYSIS', kind: 'PARTIAL', status: 'incomplete', file: 'Entire Graph Engine', rel: 'DEGRADED_COVERAGE' },
      ],
      eventId: 'evt_1788684880056506300'
    },
    CURVEBALL: {
      changeName: 'DynamicHandlerRegistry & TokenValidator',
      filePath: 'internal/auth/registry.go:L34',
      baseRef: 'HEAD~1 (829017f)',
      headRef: 'HEAD (49956db)',
      decision: 'REVIEW',
      reason: 'Curveball active: Reflection (reflect.ValueOf) & dynamic registration detected. Entire Graph cannot guarantee complete consumer coverage.',
      confirmedCount: 4,
      incompleteCount: 3,
      verifyCount: 3,
      verificationPassed: true,
      verificationTimeMs: 188,
      verificationLogs: [
        '[!] Dynamic pattern flagged: reflect.ValueOf(handlerRegistry)',
        '[!] Graph analysis: Cannot resolve downstream dynamic callers statically',
        '[+] Compiling Go target package: PASS',
        '[+] Running targeted test suites: PASS (0.59s)',
        '[✓] Dynamic dispatch fallback checks passed',
        '--------------------------------------------------',
        'VERIFICATION VERDICT: PASS (HUMAN REVIEW REQUIRED FOR DYNAMIC REGISTRY)'
      ],
      nodes: [
        { id: 'source', name: 'DynamicHandlerRegistry', kind: 'STRUCT', status: 'changed', file: 'internal/auth/registry.go' },
        { id: 'caller1', name: 'VerificationEngine.Run', kind: 'METHOD', status: 'confirmed', file: 'aegisgraph/verifier.go:21', rel: 'CALLS' },
        { id: 'consumer1', name: 'RiskReport.Evidence', kind: 'TYPE', status: 'confirmed', file: 'aegisgraph/model.go:52', rel: 'USES_TYPE' },
        { id: 'dyn1', name: 'reflect.ValueOf() (Reflection)', kind: 'DYNAMIC', status: 'incomplete', file: 'internal/auth/registry.go:42', rel: 'DYNAMIC_DISPATCH' },
        { id: 'dyn2', name: 'RuntimeHandlerMap', kind: 'REGISTRY', status: 'incomplete', file: 'internal/auth/registry.go:55', rel: 'RUNTIME_REGISTER' },
        { id: 'warn1', name: 'W_WORKTREE_SNAPSHOT', kind: 'WARNING', status: 'incomplete', file: 'Entire Graph Engine', rel: 'EMITS_WARNING' }
      ],
      eventId: 'evt_1788685038140373400'
    },
    BLOCK: {
      changeName: 'ValidateToken (Breaking Signature)',
      filePath: 'internal/auth/session.go:L18',
      baseRef: 'HEAD~1 (829017f)',
      headRef: 'HEAD (49956db)',
      decision: 'BLOCK',
      reason: 'Deterministic verification failed: Downstream CheckoutService contract broken. Immediate rollback recommended.',
      confirmedCount: 4,
      incompleteCount: 3,
      verifyCount: 3,
      verificationPassed: false,
      verificationTimeMs: 42,
      verificationLogs: [
        '[!] Evaluating changed signature: ValidateToken(token string) -> (bool, error)',
        '[!] Downstream consumer: CheckoutService.ProcessOrder(auth.TokenPayload)',
        '[✕] COMPILER/CONTRACT ERROR in session_test.go:42:',
        '    cannot use token (variable of type string) as TokenPayload in argument to CheckoutService',
        '[✕] --- FAIL: TestTokenValidationContract (0.04s)',
        '--------------------------------------------------',
        'VERIFICATION VERDICT: FAILED (CHANGE BLOCKED DUE TO CONTRACT BREAK)'
      ],
      nodes: [
        { id: 'source', name: 'ValidateToken', kind: 'FUNCTION', status: 'changed', file: 'internal/auth/session.go' },
        { id: 'break1', name: 'CheckoutService.ProcessOrder', kind: 'CONSUMER', status: 'broken', file: 'internal/checkout/order.go:88', rel: 'CONTRACT_FAIL' },
        { id: 'caller1', name: 'SessionMiddleware', kind: 'CALLER', status: 'confirmed', file: 'internal/http/auth.go:12', rel: 'CALLS' },
        { id: 'dyn1', name: 'DynamicHandlerRegistry', kind: 'DYNAMIC', status: 'incomplete', file: 'internal/auth/registry.go', rel: 'DYNAMIC_DISPATCH' },
      ],
      eventId: 'evt_1788685144275184200'
    }
  };

  const current = scenarioData[scenario];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-primary)' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: '280px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 18px',
        gap: '24px',
        zIndex: 10
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '0 6px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--brand-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.45)'
          }}>
            <Shield size={24} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.5px' }}>AEGISGRAPH</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', fontWeight: 600, letterSpacing: '0.5px' }}>
              SAFETY INTELLIGENCE
            </div>
          </div>
        </div>

        {/* Live Simulation Controls */}
        <div style={{
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            DEMO SCENARIO CONTROL
          </div>
          
          <button
            onClick={() => runLiveAnalysis('NORMAL')}
            disabled={isAnalyzing}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              border: scenario === 'NORMAL' ? '1px solid var(--accent-cyan)' : '1px solid transparent',
              background: scenario === 'NORMAL' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255,255,255,0.02)',
              color: scenario === 'NORMAL' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="var(--accent-cyan)" />
              1. Normal Change
            </span>
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(56,189,248,0.2)', color: 'var(--accent-cyan)' }}>REVIEW</span>
          </button>

          <button
            onClick={() => runLiveAnalysis('CURVEBALL')}
            disabled={isAnalyzing}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              border: scenario === 'CURVEBALL' ? '1px solid var(--accent-amber)' : '1px solid transparent',
              background: scenario === 'CURVEBALL' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255,255,255,0.02)',
              color: scenario === 'CURVEBALL' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={16} color="var(--accent-amber)" />
              2. Curveball Dynamic
            </span>
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(245,158,11,0.2)', color: 'var(--accent-amber)' }}>REVIEW</span>
          </button>

          <button
            onClick={() => runLiveAnalysis('BLOCK')}
            disabled={isAnalyzing}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 14px',
              borderRadius: '8px',
              border: scenario === 'BLOCK' ? '1px solid var(--accent-rose)' : '1px solid transparent',
              background: scenario === 'BLOCK' ? 'rgba(244, 63, 94, 0.18)' : 'rgba(255,255,255,0.02)',
              color: scenario === 'BLOCK' ? '#fff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <XCircle size={16} color="var(--accent-rose)" />
              3. Contract Break
            </span>
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'rgba(244,63,94,0.2)', color: 'var(--accent-rose)' }}>BLOCK</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { id: 'overview', label: 'Safety Overview', icon: Activity },
            { id: 'graph', label: 'Graph Topology', icon: Layers },
            { id: 'verification', label: 'Deterministic Verifier', icon: CheckCircle2 },
            { id: 'checkpoints', label: 'Entire Checkpoints', icon: RotateCcw },
            { id: 'events', label: 'Databricks Telemetry', icon: Database },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(99, 102, 241, 0.18), transparent)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Provenance Box */}
        <div style={{
          marginTop: 'auto',
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(13, 18, 29, 0.8)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px' }}>
            <Radio size={14} className="live-pulse" color="var(--accent-emerald)" />
            Zero-Egress Graph
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4, fontSize: '0.75rem' }}>
            "Entire Graph is evidence — never an infallible oracle."
          </p>
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            <span>Graph: <b style={{ color: '#fff' }}>v0.4.0</b></span>
            <span>Engine: <b style={{ color: '#fff' }}>Go 1.26</b></span>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        {/* TOP STATUS BAR */}
        <header style={{
          padding: '16px 36px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(13, 18, 29, 0.6)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.3px' }}>
                AI Code Change Safety Intelligence
              </h1>
              {isAnalyzing && (
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.2)',
                  color: 'var(--accent-cyan)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Clock size={12} className="live-pulse" />
                  ANALYZING GRAPH IMPACT...
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Autonomous blast-radius gate with deterministic contract verification & checkpoint recovery
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => runLiveAnalysis(scenario)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Play size={14} color="var(--accent-cyan)" />
              Re-evaluate
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)' }}>
                repo: <b style={{ color: '#fff' }}>entire-graph</b>
              </span>
              <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)' }}>
                branch: <b style={{ color: '#fff' }}>main</b>
              </span>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>

          {/* DYNAMIC PIPELINE SCANNER */}
          <div className="glass-panel" style={{ padding: '24px 28px', position: 'relative', overflow: 'hidden' }}>
            {isAnalyzing && <div className="scanner-line" />}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                AUTONOMOUS SAFETY PIPELINE EXECUTION
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
                Step {activePipelineStep} of 6 Complete
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {[
                { step: 1, title: 'CODE CHANGE', desc: 'Diff extraction', active: activePipelineStep >= 1, color: 'var(--accent-indigo)' },
                { step: 2, title: 'SEMANTIC DIFF', desc: 'Symbol AST parsing', active: activePipelineStep >= 2, color: 'var(--accent-cyan)' },
                { step: 3, title: 'GRAPH IMPACT', desc: `${current.confirmedCount} Verified edges`, active: activePipelineStep >= 3, color: 'var(--accent-cyan)' },
                { step: 4, title: 'EVIDENCE CLASSIFIER', desc: `${current.incompleteCount} Incomplete/Heuristic`, active: activePipelineStep >= 4, color: 'var(--accent-amber)' },
                { step: 5, title: 'VERIFICATION ENGINE', desc: current.verificationPassed ? 'PASS' : 'FAIL', active: activePipelineStep >= 5, color: current.verificationPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)' },
                { step: 6, title: 'RISK DECISION', desc: current.decision, active: activePipelineStep >= 6, color: current.decision === 'BLOCK' ? 'var(--accent-rose)' : 'var(--accent-amber)' },
              ].map((stage, idx, arr) => (
                <React.Fragment key={stage.step}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    zIndex: 2,
                    minWidth: '140px',
                    opacity: stage.active ? 1 : 0.35,
                    transform: stage.active ? 'scale(1)' : 'scale(0.95)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: stage.active ? 'var(--bg-secondary)' : 'rgba(255,255,255,0.02)',
                      border: `2px solid ${stage.active ? stage.color : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      color: stage.color,
                      boxShadow: stage.active ? `0 0 16px ${stage.color}40` : 'none'
                    }}>
                      {stage.step}
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, textAlign: 'center', letterSpacing: '0.2px' }}>{stage.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>{stage.desc}</div>
                  </div>

                  {idx < arr.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: '2px',
                      background: stage.active ? 'linear-gradient(90deg, var(--accent-cyan), var(--accent-indigo))' : 'rgba(255,255,255,0.06)',
                      margin: '0 8px',
                      marginTop: '-32px',
                      transition: 'all 0.3s ease'
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* MAIN HERO CARD */}
          <div className="glass-panel" style={{
            padding: '32px',
            borderLeft: `5px solid ${current.decision === 'BLOCK' ? 'var(--accent-rose)' : 'var(--accent-amber)'}`,
            boxShadow: current.decision === 'BLOCK' ? '0 0 40px rgba(244,63,94,0.1)' : '0 0 40px rgba(245,158,11,0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.6px' }}>CURRENT EVALUATION ARTIFACT</span>
                  <span style={{ fontSize: '0.75rem', padding: '2px 10px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    {current.baseRef} → {current.headRef}
                  </span>
                </div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileCode2 size={28} color="var(--accent-cyan)" />
                  {current.changeName}
                </h2>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
                  Location: <span style={{ color: '#fff' }}>{current.filePath}</span>
                </div>
              </div>

              {/* Huge Decision Pill */}
              <div>
                <div style={{
                  padding: '12px 32px',
                  borderRadius: '12px',
                  fontSize: '1.4rem',
                  fontWeight: 900,
                  letterSpacing: '1px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: current.decision === 'BLOCK' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: current.decision === 'BLOCK' ? 'var(--accent-rose)' : 'var(--accent-amber)',
                  border: `2px solid ${current.decision === 'BLOCK' ? 'var(--accent-rose)' : 'var(--accent-amber)'}`,
                  boxShadow: current.decision === 'BLOCK' ? '0 0 24px rgba(244,63,94,0.3)' : '0 0 24px rgba(245,158,11,0.2)'
                }}>
                  {current.decision === 'BLOCK' ? <XCircle size={26} /> : <AlertTriangle size={26} />}
                  {current.decision}
                </div>
              </div>
            </div>

            {/* Decision Reason Callout */}
            <div style={{
              margin: '24px 0',
              padding: '18px 22px',
              backgroundColor: 'rgba(7, 9, 14, 0.6)',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
              color: '#e2e8f0'
            }}>
              <span style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>EXPLAINABLE VERDICT: </span>
              {current.reason}
            </div>

            {/* Key Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px', marginTop: '24px' }}>
              <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONFIRMED STRUCTURAL</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-emerald)', marginTop: '4px' }}>{current.confirmedCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Direct callers & concrete consumers</div>
              </div>

              <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>INCOMPLETE / HEURISTIC</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent-amber)', marginTop: '4px' }}>{current.incompleteCount}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Curveball dynamic / warnings</div>
              </div>

              <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>CONTRACT VERIFICATION</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: current.verificationPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)', marginTop: '4px' }}>
                  {current.verificationPassed ? 'PASS' : 'FAIL'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Compiler, go vet, and contract tests</div>
              </div>

              <div style={{ padding: '20px', borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>STABLE RECOVERY CHECKPOINT</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent-cyan)', marginTop: '8px', fontFamily: 'JetBrains Mono' }}>
                  cdca4eeb37ef
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Known-safe pre-Curveball snapshot</div>
              </div>
            </div>

            {/* BLOCK RECOVERY ACTION BANNER */}
            {current.decision === 'BLOCK' && (
              <div style={{
                marginTop: '24px',
                padding: '20px 24px',
                borderRadius: '10px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 0 30px rgba(244,63,94,0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <RotateCcw size={32} color="var(--accent-rose)" />
                  <div>
                    <div style={{ fontWeight: 800, color: 'var(--accent-rose)', fontSize: '1.05rem' }}>
                      INVARIANT BREACH DETECTED — RECOVERY GUIDANCE READY
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Safe repository state preserved at Entire Checkpoint <code style={{ color: '#fff', fontWeight: 700 }}>cdca4eeb37ef</code>.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecoveryModal(true)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: 'var(--accent-rose)',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 16px rgba(244,63,94,0.4)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  View Recovery Checkpoint
                </button>
              </div>
            )}
          </div>

          {/* DUAL PANELS: GRAPH TOPOLOGY + DETERMINISTIC VERIFIER */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '28px' }}>
            
            {/* Interactive Graph Topology */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layers size={22} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Structural Blast-Radius Graph</h3>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                  Entire Graph Provider: entire-graph v0.4.0
                </div>
              </div>

              {/* Interactive Node Graph Map */}
              <div style={{
                padding: '24px',
                backgroundColor: 'rgba(7, 9, 14, 0.7)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  EVALUATED RELATION NODES (Click to inspect):
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {current.nodes.map(n => {
                    const isSelected = selectedNode === n.id;
                    let badgeColor = 'var(--accent-emerald)';
                    let borderStyle = '1px solid rgba(16, 185, 129, 0.3)';
                    let bgColor = 'rgba(16, 185, 129, 0.08)';

                    if (n.status === 'changed') {
                      badgeColor = 'var(--accent-indigo)';
                      borderStyle = '1px solid var(--accent-indigo)';
                      bgColor = 'rgba(99, 102, 241, 0.15)';
                    } else if (n.status === 'incomplete') {
                      badgeColor = 'var(--accent-amber)';
                      borderStyle = '1px dashed rgba(245, 158, 11, 0.5)';
                      bgColor = 'rgba(245, 158, 11, 0.08)';
                    } else if (n.status === 'broken') {
                      badgeColor = 'var(--accent-rose)';
                      borderStyle = '1px solid var(--accent-rose)';
                      bgColor = 'rgba(244, 63, 94, 0.18)';
                    }

                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNode(isSelected ? null : n.id)}
                        style={{
                          padding: '14px',
                          borderRadius: '8px',
                          background: bgColor,
                          border: borderStyle,
                          cursor: 'pointer',
                          boxShadow: isSelected ? `0 0 16px ${badgeColor}50` : 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.68rem', fontWeight: 800, color: badgeColor }}>
                            {n.kind} {n.rel && `(${n.rel})`}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{n.status.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '4px', color: '#fff' }}>
                          {n.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', fontFamily: 'JetBrains Mono' }}>
                          {n.file}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '16px', lineHeight: 1.5 }}>
                <b style={{ color: '#fff' }}>Core Guarantee:</b> Confirmed edges represent deterministic graph relationships. Incomplete edges (dynamic/reflection) trigger mandatory verification instead of false certainty.
              </div>
            </div>

            {/* Live Verifier Terminal */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Terminal size={22} color={current.verificationPassed ? 'var(--accent-emerald)' : 'var(--accent-rose)'} />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Deterministic Verifier Log</h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
                  Latency: {current.verificationTimeMs}ms
                </span>
              </div>

              <div style={{
                flex: 1,
                padding: '18px',
                backgroundColor: '#04060a',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.78rem',
                lineHeight: 1.6,
                color: current.verificationPassed ? '#34d399' : '#f87171',
                overflowY: 'auto',
                minHeight: '260px'
              }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>$ aegisgraph --verify --timeout 2m</div>
                {current.verificationLogs.map((log, i) => (
                  <div key={i} style={{ color: log.startsWith('[✕]') ? 'var(--accent-rose)' : log.startsWith('[!]') ? 'var(--accent-amber)' : 'inherit' }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* TELEMETRY & CHECKPOINT AUDIT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            
            {/* Databricks Architectural Risk Intelligence */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Database size={22} color="var(--accent-cyan)" />
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Databricks Lakehouse Telemetry</h3>
                </div>
                <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(56,189,248,0.15)', color: 'var(--accent-cyan)' }}>
                  FALLBACK ACTIVE
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Analysis events streamed to Delta table <code style={{ color: '#fff' }}>aegisgraph.analysis_events</code> (Local JSONL Fallback active).
              </div>

              <div style={{
                padding: '16px',
                backgroundColor: 'rgba(7, 9, 14, 0.6)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.75rem',
                border: '1px solid var(--border-subtle)',
                color: '#cbd5e1',
                lineHeight: 1.6
              }}>
                <div><b>event_id:</b> <span style={{ color: 'var(--accent-cyan)' }}>{current.eventId}</span></div>
                <div><b>repository:</b> entire-graph</div>
                <div><b>decision:</b> <span style={{ color: current.decision === 'BLOCK' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>{current.decision}</span></div>
                <div><b>confirmed_relationships:</b> {current.confirmedCount}</div>
                <div><b>incomplete_relationships:</b> {current.incompleteCount}</div>
                <div><b>verification_status:</b> {current.verificationPassed ? 'PASS' : 'FAIL'}</div>
              </div>
            </div>

            {/* Checkpoint Provenance */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <RotateCcw size={22} color="var(--accent-indigo)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Entire Checkpoint Provenance</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'JetBrains Mono' }}>
                      cdca4eeb37ef
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>● STABLE BASELINE</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Commit: <code style={{ color: '#fff' }}>d347fa7</code> — chore: checkpoint stable pre-Curveball state
                  </div>
                </div>

                <div style={{ padding: '14px', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono' }}>
                      Commit 8e15a8d
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RELEASE HEAD</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    feat: add judge-facing AegisGraph dashboard
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* RECOVERY MODAL */}
      {showRecoveryModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{
            width: '600px',
            padding: '36px',
            border: '2px solid var(--accent-rose)',
            boxShadow: '0 0 50px rgba(244,63,94,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
              <RotateCcw size={32} color="var(--accent-rose)" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Entire Checkpoint Recovery Guidance</h3>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              The code change was <strong style={{ color: 'var(--accent-rose)' }}>BLOCKED</strong> because deterministic contract verification failed against downstream consumer dependencies.
              AegisGraph has determined that the safest remediation path is rolling back to the last verified stable Entire Checkpoint:
            </p>

            <div style={{
              padding: '18px',
              backgroundColor: '#04060a',
              borderRadius: '8px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.88rem',
              color: 'var(--accent-cyan)',
              marginBottom: '28px',
              border: '1px solid var(--border-subtle)'
            }}>
              entire checkpoint explain cdca4eeb37ef
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setShowRecoveryModal(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Close Guidance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
