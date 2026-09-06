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
  Radio,
  Zap
} from 'lucide-react';

type Scenario = 'NORMAL' | 'CURVEBALL' | 'BLOCK';
type ActiveTab = 'overview' | 'graph' | 'verification' | 'checkpoints' | 'events';

export const App: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('NORMAL');
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<number>(6);
  const [showRecoveryModal, setShowRecoveryModal] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);

  // Trigger cybernetic analysis sequence
  const runCyberAnalysis = (targetScenario: Scenario) => {
    setScenario(targetScenario);
    setIsScanning(true);
    setActiveStage(1);

    const intervals = [200, 450, 750, 1050, 1350, 1650];
    intervals.forEach((time, index) => {
      setTimeout(() => {
        setActiveStage(index + 1);
        if (index === intervals.length - 1) {
          setIsScanning(false);
        }
      }, time);
    });
  };

  useEffect(() => {
    runCyberAnalysis('NORMAL');
  }, []);

  useEffect(() => {
    if (!autoRotate) return;
    const scenarios: Scenario[] = ['NORMAL', 'CURVEBALL', 'BLOCK'];
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % scenarios.length;
      runCyberAnalysis(scenarios[idx]);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const scenarioData = {
    NORMAL: {
      changeName: 'Final-Entire-Checkpoint-Note',
      filePath: 'BUILDATHON.md:L148-156',
      baseRef: 'HEAD~1 (829017f)',
      headRef: 'HEAD (49956db)',
      decision: 'REVIEW',
      reason: 'Graph evidence classified 2 working-tree warnings & partial coverage. Deterministic contract verification required.',
      confirmedCount: 6,
      incompleteCount: 2,
      verifyCount: 2,
      verificationPassed: true,
      latencyMs: 142,
      terminalLogs: [
        '⚡ [AEGISGRAPH-CORE] Initializing zero-egress semantic AST analyzer...',
        '⚡ [ENTIRE-GRAPH] Extracted 6 confirmed call/type structural edges.',
        '⚠ [WARNING] W_WORKTREE_SNAPSHOT: uncommitted working tree active.',
        '⚡ [VERIFIER] Executing deterministic compiler & vet harness...',
        '✓ go vet ./... -> 0 errors, 0 warnings (PASS)',
        '✓ go test -short ./... -> 4/4 suites satisfied (0.51s)',
        '-----------------------------------------------------------------',
        '★ GATE VERDICT: SAFE TO REVIEW (NO BREAKING INVARIANTS FOUND)'
      ],
      nodes: [
        { id: 'src', name: 'Final-Entire-Checkpoint-Note', kind: 'DIFF_SOURCE', status: 'source', file: 'BUILDATHON.md' },
        { id: 'c1', name: 'VerificationEngine.Run', kind: 'CALLER', status: 'confirmed', file: 'aegisgraph/verifier.go:21', rel: 'CALLS' },
        { id: 'c2', name: 'DecisionEngine.Evaluate', kind: 'METHOD', status: 'confirmed', file: 'aegisgraph/decision.go:15', rel: 'CALLS' },
        { id: 't1', name: 'RiskReport.Evidence', kind: 'TYPE_MAP', status: 'confirmed', file: 'aegisgraph/model.go:52', rel: 'USES_TYPE' },
        { id: 'w1', name: 'W_WORKTREE_SNAPSHOT', kind: 'GRAPH_WARN', status: 'incomplete', file: 'Entire Engine', rel: 'WARNING' },
        { id: 'w2', name: 'W_PARTIAL_ANALYSIS', kind: 'PARTIAL_AST', status: 'incomplete', file: 'Entire Engine', rel: 'DEGRADED' },
      ],
      eventId: 'evt_1788684880056506300'
    },
    CURVEBALL: {
      changeName: 'DynamicHandlerRegistry & TokenValidator',
      filePath: 'internal/auth/registry.go:L34',
      baseRef: 'HEAD~1 (829017f)',
      headRef: 'HEAD (49956db)',
      decision: 'REVIEW',
      reason: 'CURVEBALL PROTOCOL: Dynamic dispatch & Go reflect.ValueOf detected. Static graph cannot guarantee complete consumer coverage.',
      confirmedCount: 4,
      incompleteCount: 3,
      verifyCount: 3,
      verificationPassed: true,
      latencyMs: 188,
      terminalLogs: [
        '⚡ [AEGISGRAPH-CORE] Scanning changed symbols for non-static primitives...',
        '⚠ [CURVEBALL TRIGGER] Reflection pattern detected: reflect.ValueOf(handlerRegistry)',
        '⚠ [INCOMPLETE EVIDENCE] Dynamic handler registration cannot be proven statically.',
        '⚡ [VERIFIER] Escalating to targeted runtime contract tests...',
        '✓ go test -v ./internal/auth/... -> PASS (0.59s)',
        '✓ Type integrity preserved across known static call-sites',
        '-----------------------------------------------------------------',
        '★ GATE VERDICT: REVIEW REQUIRED (UNCERTAIN DYNAMIC CONSUMERS FLAGGED)'
      ],
      nodes: [
        { id: 'src', name: 'DynamicHandlerRegistry', kind: 'DIFF_SOURCE', status: 'source', file: 'internal/auth/registry.go' },
        { id: 'c1', name: 'VerificationEngine.Run', kind: 'CALLER', status: 'confirmed', file: 'aegisgraph/verifier.go:21', rel: 'CALLS' },
        { id: 'd1', name: 'reflect.ValueOf() (Reflection)', kind: 'DYNAMIC', status: 'incomplete', file: 'registry.go:42', rel: 'DYNAMIC_DISPATCH' },
        { id: 'd2', name: 'RuntimeHandlerMap', kind: 'REGISTRY', status: 'incomplete', file: 'registry.go:55', rel: 'RUNTIME_REGISTER' },
        { id: 'w1', name: 'W_WORKTREE_SNAPSHOT', kind: 'GRAPH_WARN', status: 'incomplete', file: 'Entire Engine', rel: 'WARNING' }
      ],
      eventId: 'evt_1788685038140373400'
    },
    BLOCK: {
      changeName: 'ValidateToken (Breaking Signature)',
      filePath: 'internal/auth/session.go:L18',
      baseRef: 'HEAD~1 (829017f)',
      headRef: 'HEAD (49956db)',
      decision: 'BLOCK',
      reason: 'CRITICAL INVARIANT BREACH: Downstream CheckoutService contract failed. Safe recovery checkpoint available.',
      confirmedCount: 4,
      incompleteCount: 3,
      verifyCount: 3,
      verificationPassed: false,
      latencyMs: 42,
      terminalLogs: [
        '⚡ [AEGISGRAPH-CORE] Evaluating API signature change for ValidateToken...',
        '⚡ [ENTIRE-GRAPH] Downstream blast-radius target: CheckoutService.ProcessOrder',
        '✕ [FATAL] COMPILER/TYPE MISMATCH in session_test.go:42:',
        '  cannot use token (variable of type string) as TokenPayload in argument to CheckoutService',
        '✕ --- FAIL: TestTokenValidationContract (0.04s)',
        '⚡ [REMEDIATION] Halting deployment pipeline. Rollback point identified.',
        '-----------------------------------------------------------------',
        '★ GATE VERDICT: BLOCKED (INVARIANT VIOLATION PREVENTED)'
      ],
      nodes: [
        { id: 'src', name: 'ValidateToken', kind: 'DIFF_SOURCE', status: 'source', file: 'internal/auth/session.go' },
        { id: 'brk', name: 'CheckoutService.ProcessOrder', kind: 'BROKEN_DEP', status: 'broken', file: 'internal/checkout/order.go:88', rel: 'CONTRACT_FAIL' },
        { id: 'c1', name: 'SessionMiddleware', kind: 'CALLER', status: 'confirmed', file: 'internal/http/auth.go:12', rel: 'CALLS' },
        { id: 'd1', name: 'DynamicHandlerRegistry', kind: 'DYNAMIC', status: 'incomplete', file: 'internal/auth/registry.go', rel: 'DYNAMIC_DISPATCH' },
      ],
      eventId: 'evt_1788685144275184200'
    }
  };

  const current = scenarioData[scenario];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-space)' }}>
      
      {/* FUTURISTIC CYBER SIDEBAR */}
      <aside style={{
        width: '300px',
        backgroundColor: 'var(--bg-deep)',
        borderRight: '1px solid rgba(0, 240, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px 20px',
        gap: '24px',
        zIndex: 10,
        position: 'relative'
      }}>
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(0, 240, 255, 0.5)',
            border: '1px solid rgba(255,255,255,0.4)'
          }}>
            <Shield size={26} color="#030712" strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-cyber" style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '1px', color: '#fff' }}>
              AEGIS<span style={{ color: 'var(--neon-cyan)' }}>GRAPH</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--neon-cyan)', fontWeight: 700, letterSpacing: '1px', fontFamily: 'Orbitron' }}>
              AI SAFETY SENTINEL
            </div>
          </div>
        </div>

        {/* Interactive Scenario Launchpad */}
        <div className="cyber-card" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--neon-cyan)', letterSpacing: '1px', fontFamily: 'Orbitron' }}>
              LIVE SIMULATION MATRIX
            </span>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              style={{
                fontSize: '0.65rem',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-neon)',
                background: autoRotate ? 'rgba(0, 240, 255, 0.2)' : 'transparent',
                color: autoRotate ? 'var(--neon-cyan)' : 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              {autoRotate ? 'Auto-Cycle ON' : 'Auto-Cycle OFF'}
            </button>
          </div>

          {[
            { key: 'NORMAL', label: '1. Normal Diff', badge: 'REVIEW', color: 'var(--neon-cyan)', icon: Sparkles },
            { key: 'CURVEBALL', label: '2. Dynamic Curveball', badge: 'REVIEW', color: 'var(--neon-amber)', icon: Flame },
            { key: 'BLOCK', label: '3. Contract Breach', badge: 'BLOCK', color: 'var(--neon-rose)', icon: XCircle }
          ].map(item => {
            const Icon = item.icon;
            const isSelected = scenario === item.key;
            return (
              <button
                key={item.key}
                onClick={() => runCyberAnalysis(item.key as Scenario)}
                disabled={isScanning}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: isSelected ? `1px solid ${item.color}` : '1px solid rgba(255,255,255,0.04)',
                  background: isSelected ? `rgba(${item.key === 'BLOCK' ? '255,0,85,0.15' : item.key === 'CURVEBALL' ? '255,183,3,0.15' : '0,240,255,0.15'})` : 'rgba(255,255,255,0.02)',
                  color: isSelected ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  boxShadow: isSelected ? `0 0 20px ${item.color}35` : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon size={18} color={item.color} />
                  {item.label}
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  fontFamily: 'Orbitron',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: isSelected ? item.color : 'rgba(255,255,255,0.06)',
                  color: isSelected ? '#030712' : 'var(--text-muted)',
                  fontWeight: 900
                }}>
                  {item.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cyber Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {[
            { id: 'overview', label: 'Safety Overview', icon: Activity },
            { id: 'graph', label: 'Graph Topology', icon: Layers },
            { id: 'verification', label: 'Deterministic Verifier', icon: CheckCircle2 },
            { id: 'checkpoints', label: 'Checkpoint Recovery', icon: RotateCcw },
            { id: 'events', label: 'Databricks Lakehouse', icon: Database },
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
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(90deg, rgba(0, 240, 255, 0.15), transparent)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--neon-cyan)' : '3px solid transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  fontWeight: isActive ? 800 : 500,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={18} color={isActive ? 'var(--neon-cyan)' : 'var(--text-muted)'} />
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Sentinel System Telemetry */}
        <div style={{
          marginTop: 'auto',
          padding: '16px',
          borderRadius: '12px',
          background: 'rgba(0, 240, 255, 0.03)',
          border: '1px solid rgba(0, 240, 255, 0.15)',
          fontSize: '0.78rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-cyan)', fontWeight: 800, marginBottom: '6px', fontFamily: 'Orbitron' }}>
            <Radio size={14} color="var(--neon-emerald)" />
            ZERO-EGRESS AIRGAP
          </div>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.4, fontSize: '0.75rem' }}>
            "Entire Graph is evidence — never an infallible oracle."
          </p>
          <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            <span>Graph Engine: <b style={{ color: '#fff' }}>v0.4.0</b></span>
            <span>Kernel: <b style={{ color: '#fff' }}>Go 1.26</b></span>
          </div>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto' }}>
        
        {/* TOP STATUS BAR */}
        <header style={{
          padding: '18px 40px',
          borderBottom: '1px solid rgba(0, 240, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'rgba(5, 11, 24, 0.7)',
          backdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h1 className="font-cyber text-glow-cyan" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#fff' }}>
                AI CODE CHANGE SAFETY INTELLIGENCE
              </h1>
              {isScanning && (
                <span style={{
                  padding: '3px 12px',
                  borderRadius: '20px',
                  background: 'rgba(0, 240, 255, 0.2)',
                  border: '1px solid var(--neon-cyan)',
                  color: 'var(--neon-cyan)',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  fontFamily: 'Orbitron',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Zap size={14} color="var(--neon-cyan)" />
                  QUANTUM GRAPH SCANNING ACTIVE...
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Autonomous Blast-Radius Adjudication • Deterministic Verifier • Time-Traveling Rollback
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => runCyberAnalysis(scenario)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                border: '1px solid var(--neon-cyan)',
                backgroundColor: 'rgba(0, 240, 255, 0.1)',
                color: 'var(--neon-cyan)',
                fontSize: '0.82rem',
                fontWeight: 800,
                fontFamily: 'Orbitron',
                cursor: 'pointer',
                boxShadow: '0 0 16px rgba(0,240,255,0.2)'
              }}
            >
              <Play size={14} />
              Re-Scan AST
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
              <span style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                repo: <b style={{ color: '#fff' }}>entire-graph</b>
              </span>
              <span style={{ padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                branch: <b style={{ color: '#fff' }}>main</b>
              </span>
            </div>
          </div>
        </header>

        {/* DASHBOARD BODY */}
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1650px', margin: '0 auto', width: '100%' }}>

          {/* DYNAMIC PIPELINE SCANNER */}
          <div className="cyber-card" style={{ padding: '28px 32px' }}>
            {isScanning && <div className="laser-line" />}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <span className="font-cyber" style={{ fontSize: '0.82rem', fontWeight: 900, color: 'var(--neon-cyan)', letterSpacing: '1px' }}>
                AUTONOMOUS GRAPH PIPELINE STAGES
              </span>
              <span style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', fontFamily: 'JetBrains Mono' }}>
                Phase {activeStage} of 6 Synchronized
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {[
                { step: 1, title: 'CODE CHANGE', desc: 'Diff extraction', active: activeStage >= 1, color: 'var(--neon-purple)' },
                { step: 2, title: 'SEMANTIC DIFF', desc: 'AST Symbol Parser', active: activeStage >= 2, color: 'var(--neon-cyan)' },
                { step: 3, title: 'GRAPH IMPACT', desc: `${current.confirmedCount} Verified Edges`, active: activeStage >= 3, color: 'var(--neon-cyan)' },
                { step: 4, title: 'CLASSIFIER', desc: `${current.incompleteCount} Incomplete/Warn`, active: activeStage >= 4, color: 'var(--neon-amber)' },
                { step: 5, title: 'VERIFIER', desc: current.verificationPassed ? 'PASS' : 'FAIL', active: activeStage >= 5, color: current.verificationPassed ? 'var(--neon-emerald)' : 'var(--neon-rose)' },
                { step: 6, title: 'RISK GATE', desc: current.decision, active: activeStage >= 6, color: current.decision === 'BLOCK' ? 'var(--neon-rose)' : 'var(--neon-amber)' },
              ].map((stage, idx, arr) => (
                <React.Fragment key={stage.step}>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                    zIndex: 2,
                    minWidth: '150px',
                    opacity: stage.active ? 1 : 0.3,
                    transform: stage.active ? 'scale(1)' : 'scale(0.92)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--bg-deep)',
                      border: `2px solid ${stage.active ? stage.color : 'rgba(255,255,255,0.1)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '1rem',
                      fontFamily: 'Orbitron',
                      color: stage.color,
                      boxShadow: stage.active ? `0 0 20px ${stage.color}60` : 'none'
                    }}>
                      {stage.step}
                    </div>
                    <div className="font-cyber" style={{ fontSize: '0.8rem', fontWeight: 900, textAlign: 'center' }}>{stage.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>{stage.desc}</div>
                  </div>

                  {idx < arr.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: '3px',
                      background: stage.active ? 'linear-gradient(90deg, var(--neon-cyan), var(--neon-purple))' : 'rgba(255,255,255,0.06)',
                      margin: '0 8px',
                      marginTop: '-36px',
                      boxShadow: stage.active ? '0 0 12px var(--neon-cyan)' : 'none',
                      transition: 'all 0.3s ease'
                    }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* MAIN HERO CARD */}
          <div className="cyber-card holo-card" style={{
            padding: '36px',
            borderLeft: `6px solid ${current.decision === 'BLOCK' ? 'var(--neon-rose)' : 'var(--neon-amber)'}`,
            boxShadow: current.decision === 'BLOCK' ? '0 0 50px rgba(255,0,85,0.2)' : '0 0 50px rgba(255,183,3,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span className="font-cyber" style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--neon-cyan)', letterSpacing: '1px' }}>
                    ARTIFACT UNDER EVALUATION
                  </span>
                  <span style={{ fontSize: '0.78rem', padding: '3px 12px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.06)', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    {current.baseRef} → {current.headRef}
                  </span>
                </div>
                <h2 className="font-cyber" style={{ fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <FileCode2 size={32} color="var(--neon-cyan)" />
                  {current.changeName}
                </h2>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '6px', fontFamily: 'JetBrains Mono' }}>
                  File Target: <span style={{ color: '#fff' }}>{current.filePath}</span>
                </div>
              </div>

              {/* Glowing Cyber Decision Badge */}
              <div>
                <div className={current.decision === 'BLOCK' ? 'text-glow-rose' : 'text-glow-amber'} style={{
                  padding: '14px 38px',
                  borderRadius: '14px',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  fontFamily: 'Orbitron',
                  letterSpacing: '2px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: current.decision === 'BLOCK' ? 'rgba(255, 0, 85, 0.15)' : 'rgba(255, 183, 3, 0.15)',
                  color: current.decision === 'BLOCK' ? 'var(--neon-rose)' : 'var(--neon-amber)',
                  border: `2px solid ${current.decision === 'BLOCK' ? 'var(--neon-rose)' : 'var(--neon-amber)'}`,
                  boxShadow: current.decision === 'BLOCK' ? '0 0 35px rgba(255,0,85,0.4)' : '0 0 35px rgba(255,183,3,0.3)'
                }}>
                  {current.decision === 'BLOCK' ? <XCircle size={30} /> : <AlertTriangle size={30} />}
                  {current.decision}
                </div>
              </div>
            </div>

            {/* Decision Reason Callout */}
            <div style={{
              margin: '28px 0',
              padding: '20px 24px',
              backgroundColor: 'rgba(3, 7, 18, 0.8)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              fontSize: '1rem',
              lineHeight: 1.6,
              color: '#f1f5f9'
            }}>
              <span className="font-cyber" style={{ fontWeight: 900, color: 'var(--neon-cyan)' }}>EXPLAINABLE VERDICT: </span>
              {current.reason}
            </div>

            {/* Key Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '28px' }}>
              <div className="cyber-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, fontFamily: 'Orbitron' }}>CONFIRMED EDGES</div>
                <div className="text-glow-emerald" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-emerald)', marginTop: '6px', fontFamily: 'Orbitron' }}>
                  {current.confirmedCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Direct structural callers & consumers</div>
              </div>

              <div className="cyber-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, fontFamily: 'Orbitron' }}>INCOMPLETE / HEURISTIC</div>
                <div className="text-glow-amber" style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--neon-amber)', marginTop: '6px', fontFamily: 'Orbitron' }}>
                  {current.incompleteCount}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Curveball dynamic patterns flagged</div>
              </div>

              <div className="cyber-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, fontFamily: 'Orbitron' }}>DETERMINISTIC VERIFIER</div>
                <div className={current.verificationPassed ? 'text-glow-emerald' : 'text-glow-rose'} style={{ fontSize: '2.5rem', fontWeight: 900, color: current.verificationPassed ? 'var(--neon-emerald)' : 'var(--neon-rose)', marginTop: '6px', fontFamily: 'Orbitron' }}>
                  {current.verificationPassed ? 'PASS' : 'FAIL'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Compiler, go vet, and contract tests</div>
              </div>

              <div className="cyber-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 800, fontFamily: 'Orbitron' }}>STABLE RECOVERY POINT</div>
                <div className="text-glow-cyan" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--neon-cyan)', marginTop: '12px', fontFamily: 'JetBrains Mono' }}>
                  cdca4eeb37ef
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>Pre-Curveball verified state</div>
              </div>
            </div>

            {/* BLOCK RECOVERY ACTION BANNER */}
            {current.decision === 'BLOCK' && (
              <div style={{
                marginTop: '28px',
                padding: '24px 28px',
                borderRadius: '12px',
                background: 'rgba(255, 0, 85, 0.15)',
                border: '2px solid var(--neon-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 0 40px rgba(255,0,85,0.25)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <RotateCcw size={36} color="var(--neon-rose)" />
                  <div>
                    <div className="font-cyber" style={{ fontWeight: 900, color: 'var(--neon-rose)', fontSize: '1.15rem' }}>
                      INVARIANT BREACH DETECTED — RECOVERY GUIDANCE READY
                    </div>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Safe repository state preserved at Entire Checkpoint <code style={{ color: '#fff', fontWeight: 800 }}>cdca4eeb37ef</code>.
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowRecoveryModal(true)}
                  style={{
                    padding: '14px 28px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: 'var(--neon-rose)',
                    color: '#fff',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    fontFamily: 'Orbitron',
                    cursor: 'pointer',
                    boxShadow: '0 0 24px rgba(255,0,85,0.5)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Inspect Checkpoint
                </button>
              </div>
            )}
          </div>

          {/* DUAL PANELS: GRAPH TOPOLOGY + DETERMINISTIC VERIFIER */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '32px' }}>
            
            {/* Interactive Graph Topology */}
            <div className="cyber-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Layers size={24} color="var(--neon-cyan)" />
                  <h3 className="font-cyber" style={{ fontSize: '1.25rem', fontWeight: 900 }}>Structural Blast-Radius Graph</h3>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', fontFamily: 'JetBrains Mono' }}>
                  Provider: Entire Graph v0.4.0
                </div>
              </div>

              {/* Node Matrix Grid */}
              <div style={{
                padding: '24px',
                backgroundColor: 'rgba(3, 7, 18, 0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(0, 240, 255, 0.15)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div className="font-cyber" style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>
                  AFFECTED AST NODES (Click to inspect relationships):
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  {current.nodes.map(n => {
                    const isSelected = selectedNode === n.id;
                    let badgeColor = 'var(--neon-emerald)';
                    let borderStyle = '1px solid rgba(0, 255, 136, 0.4)';
                    let bgColor = 'rgba(0, 255, 136, 0.08)';

                    if (n.status === 'source') {
                      badgeColor = 'var(--neon-purple)';
                      borderStyle = '1px solid var(--neon-purple)';
                      bgColor = 'rgba(157, 78, 221, 0.15)';
                    } else if (n.status === 'incomplete') {
                      badgeColor = 'var(--neon-amber)';
                      borderStyle = '1px dashed var(--neon-amber)';
                      bgColor = 'rgba(255, 183, 3, 0.1)';
                    } else if (n.status === 'broken') {
                      badgeColor = 'var(--neon-rose)';
                      borderStyle = '1px solid var(--neon-rose)';
                      bgColor = 'rgba(255, 0, 85, 0.2)';
                    }

                    return (
                      <div
                        key={n.id}
                        onClick={() => setSelectedNode(isSelected ? null : n.id)}
                        style={{
                          padding: '16px',
                          borderRadius: '10px',
                          background: bgColor,
                          border: borderStyle,
                          cursor: 'pointer',
                          boxShadow: isSelected ? `0 0 20px ${badgeColor}60` : 'none',
                          transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span className="font-cyber" style={{ fontSize: '0.7rem', fontWeight: 900, color: badgeColor }}>
                            {n.kind} {n.rel && `(${n.rel})`}
                          </span>
                          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'Orbitron' }}>{n.status.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, marginTop: '6px', color: '#fff' }}>
                          {n.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'JetBrains Mono' }}>
                          {n.file}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '20px', lineHeight: 1.5 }}>
                <b style={{ color: 'var(--neon-cyan)' }}>Curveball Rule Enforced:</b> Confirmed edges are structural ground truth. Dynamic / heuristic patterns are never claimed as complete and trigger deterministic verification.
              </div>
            </div>

            {/* Futuristic Verifier Terminal */}
            <div className="cyber-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Terminal size={24} color={current.verificationPassed ? 'var(--neon-emerald)' : 'var(--neon-rose)'} />
                  <h3 className="font-cyber" style={{ fontSize: '1.25rem', fontWeight: 900 }}>Deterministic Verifier</h3>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--neon-cyan)', fontFamily: 'JetBrains Mono' }}>
                  {current.latencyMs}ms Latency
                </span>
              </div>

              <div style={{
                flex: 1,
                padding: '20px',
                backgroundColor: '#02040a',
                borderRadius: '12px',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.8rem',
                lineHeight: 1.7,
                color: current.verificationPassed ? '#00ff88' : '#ff0055',
                overflowY: 'auto',
                minHeight: '280px',
                boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8)'
              }}>
                <div style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>$ aegisgraph --verify-contracts --repo entire-graph</div>
                {current.terminalLogs.map((log, i) => (
                  <div key={i} style={{ 
                    color: log.startsWith('✕') ? 'var(--neon-rose)' : log.startsWith('⚠') ? 'var(--neon-amber)' : log.startsWith('★') ? 'var(--neon-cyan)' : 'inherit',
                    fontWeight: log.startsWith('★') ? 800 : 500
                  }}>
                    {log}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* TELEMETRY & CHECKPOINT ROW */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            
            {/* Databricks Architectural Risk Intelligence */}
            <div className="cyber-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Database size={24} color="var(--neon-cyan)" />
                  <h3 className="font-cyber" style={{ fontSize: '1.25rem', fontWeight: 900 }}>Databricks Lakehouse Telemetry</h3>
                </div>
                <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: '4px', background: 'rgba(0,240,255,0.15)', color: 'var(--neon-cyan)', fontFamily: 'Orbitron' }}>
                  FALLBACK ACTIVE
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                Analysis events recorded to Delta table schema <code style={{ color: '#fff' }}>aegisgraph.analysis_events</code> (Local JSONL Fallback active).
              </div>

              <div style={{
                padding: '18px',
                backgroundColor: 'rgba(3, 7, 18, 0.8)',
                borderRadius: '10px',
                fontFamily: 'JetBrains Mono',
                fontSize: '0.78rem',
                border: '1px solid rgba(0, 240, 255, 0.15)',
                color: '#cbd5e1',
                lineHeight: 1.7
              }}>
                <div><b>event_id:</b> <span style={{ color: 'var(--neon-cyan)' }}>{current.eventId}</span></div>
                <div><b>repository:</b> entire-graph</div>
                <div><b>decision:</b> <span style={{ color: current.decision === 'BLOCK' ? 'var(--neon-rose)' : 'var(--neon-amber)', fontWeight: 800 }}>{current.decision}</span></div>
                <div><b>confirmed_relationships:</b> {current.confirmedCount}</div>
                <div><b>incomplete_relationships:</b> {current.incompleteCount}</div>
                <div><b>verification_status:</b> {current.verificationPassed ? 'PASS' : 'FAIL'}</div>
              </div>
            </div>

            {/* Entire Checkpoint Provenance */}
            <div className="cyber-card" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <RotateCcw size={24} color="var(--neon-purple)" />
                <h3 className="font-cyber" style={{ fontSize: '1.25rem', fontWeight: 900 }}>Entire Checkpoint Provenance</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0, 240, 255, 0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: 'var(--neon-cyan)', fontFamily: 'JetBrains Mono' }}>
                      cdca4eeb37ef
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--neon-emerald)', fontWeight: 800, fontFamily: 'Orbitron' }}>● STABLE BASELINE</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    Commit: <code style={{ color: '#fff' }}>d347fa7</code> — chore: checkpoint stable pre-Curveball state
                  </div>
                </div>

                <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff', fontFamily: 'JetBrains Mono' }}>
                      Commit 452e35b
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'Orbitron' }}>RELEASE HEAD</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    feat: enhance judge dashboard with live interactive pipeline scanning and rich graph topology
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
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="cyber-card" style={{
            width: '640px',
            padding: '40px',
            border: '2px solid var(--neon-rose)',
            boxShadow: '0 0 60px rgba(255,0,85,0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <RotateCcw size={36} color="var(--neon-rose)" />
              <h3 className="font-cyber" style={{ fontSize: '1.45rem', fontWeight: 900, color: '#fff' }}>
                TIME-TRAVELING CHECKPOINT RECOVERY
              </h3>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px' }}>
              The change was <strong style={{ color: 'var(--neon-rose)' }}>BLOCKED</strong> because deterministic contract verification failed against downstream consumer dependencies.
              AegisGraph has determined that the safest remediation path is rolling back to the last verified stable Entire Checkpoint:
            </p>

            <div style={{
              padding: '20px',
              backgroundColor: '#02040a',
              borderRadius: '10px',
              fontFamily: 'JetBrains Mono',
              fontSize: '0.95rem',
              color: 'var(--neon-cyan)',
              marginBottom: '32px',
              border: '1px solid var(--neon-cyan)',
              boxShadow: '0 0 20px rgba(0,240,255,0.2)'
            }}>
              entire checkpoint explain cdca4eeb37ef
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowRecoveryModal(false)}
                style={{
                  padding: '12px 28px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  fontFamily: 'Orbitron',
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
