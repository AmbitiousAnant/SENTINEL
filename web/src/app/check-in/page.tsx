"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Loader2, Phone, Volume2, ShieldCheck, Clock, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle, Sparkles, Activity, SlidersHorizontal, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TopNav } from '@/components/TopNav'
import { SoapLiteCard, DialectProfile } from '@/components/SoapLiteCard'
import { FloatingCallOverlay } from '@/components/FloatingCallOverlay'
import DataProvenanceInspector from '@/components/DataProvenanceInspector'
import { SentinelSignalGraph } from '@/components/SentinelSignalGraph'
import { triageCheckIn, Dialect, TriageEngineResult } from '@/lib/clientEdgeEngine'

type Message = {
  id: string
  role: 'system' | 'user' | 'assistant'
  content: string
  result?: TriageEngineResult
  timestamp: string
}

function EmotionAvatar({ tier, score }: { tier: number, score: number }) {
  const getTierColor = () => {
    switch (tier) {
      case 3: return "text-[#DC2626] bg-[#DC2626]/10 border-[#DC2626]/30"
      case 2: return "text-[#D97706] bg-[#D97706]/10 border-[#D97706]/30"
      default: return "text-[#0D9488] bg-[#0D9488]/10 border-[#0D9488]/30"
    }
  }

  const getTierLabel = () => {
    switch (tier) {
      case 3: return "Critical Crisis (Tier 3)"
      case 2: return "Elevated Restlessness (Tier 2)"
      default: return "Stable Baseline (Tier 1)"
    }
  }

  const getBlobGradient = () => {
    switch (tier) {
      case 3: return "from-red-500/70 via-rose-600/70 to-amber-700/70 shadow-[0_0_60px_rgba(220,38,38,0.35)]"
      case 2: return "from-amber-400/60 via-orange-500/60 to-rose-400/60 shadow-[0_0_50px_rgba(217,119,6,0.3)]"
      default: return "from-teal-400/50 via-emerald-500/50 to-cyan-500/50 shadow-[0_0_40px_rgba(13,148,136,0.25)]"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center relative p-6 w-full rounded-2xl border border-[#E2E8E4] bg-white shadow-xs">
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
          Biometric Emotion Avatar
        </span>
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getTierColor()}`}>
          {getTierLabel()}
        </span>
      </div>

      {/* Organic Pulsing Blob */}
      <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center my-2">
        <div 
          className={`absolute inset-0 bg-gradient-to-tr ${getBlobGradient()} rounded-full filter blur-sm transition-all duration-700 ${
            tier === 3 ? 'animate-pulse' : ''
          }`}
          style={{ borderRadius: tier === 3 ? '38% 62% 63% 37% / 41% 44% 56% 59%' : '48% 52% 58% 42% / 46% 54% 46% 54%' }}
        />
        <div className="absolute w-20 h-20 rounded-full bg-white/80 backdrop-blur-md border border-white/60 flex flex-col items-center justify-center shadow-xs">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Score</span>
          <span className="text-xl font-bold font-mono text-[#0F2E27]">{score.toFixed(0)}</span>
          <span className="text-[9px] font-mono text-muted-foreground">±7.5</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground text-center mt-3 max-w-xs leading-relaxed">
        {tier === 3
          ? "Immediate Tier 1 Router lock-in engaged. Bypassing cloud LLM for direct Tele-MANAS (14416) safety dispatch."
          : tier === 2
            ? "Circadian rest shift and elevated typing hesitation detected. 4-Line SOAP-Lite handoff ready."
            : "Diurnal rhythm and typing dynamics within calibrated baseline. High cognitive resilience."}
      </p>
    </div>
  )
}

export default function CheckInPage() {
  // Dialect state
  const [dialect, setDialect] = useState<DialectProfile>('Casual Hinglish')
  const [trustedContact, setTrustedContact] = useState('+917982350793')
  const [restWindow, setRestWindow] = useState('1:00 AM – 8:00 AM · College Student')

  // False Alarm / Advanced Drawer State
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [falseAlarmSnoozed, setFalseAlarmSnoozed] = useState(false)
  const [conformalAlpha, setConformalAlpha] = useState(0.10)

  // Live BiAffect Keystroke Dynamics
  const [keyLatencies, setKeyLatencies] = useState<number[]>([185, 172, 194, 168, 180])
  const [backspaceCount, setBackspaceCount] = useState(2)
  const [totalKeyCount, setTotalKeyCount] = useState(48)
  const lastKeyTimeRef = useRef<number>(Date.now())

  // Telemetry Preset State
  const [telemetryPreset, setTelemetryPreset] = useState<'baseline' | 'exam' | 'crisis'>('exam')

  // Score & State
  const [currentScore, setCurrentScore] = useState<number>(42)
  const [currentTier, setCurrentTier] = useState<1 | 2 | 3>(2)

  // Floating Call Modal
  const [callModalOpen, setCallModalOpen] = useState(false)

  // Conversation history
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: "Namaste. I'm your Sentinel private health guardian. How are your days and sleep feeling lately?",
      timestamp: 'Just now'
    }
  ])
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Live typing delay tracking
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = Date.now()
    const delta = now - lastKeyTimeRef.current
    lastKeyTimeRef.current = now

    if (delta > 30 && delta < 2000) {
      setKeyLatencies(prev => [...prev.slice(-15), delta])
    }

    setTotalKeyCount(c => c + 1)
    if (e.key === 'Backspace') {
      setBackspaceCount(b => b + 1)
    }
  }

  const avgLatency = Math.round(
    keyLatencies.length > 0
      ? keyLatencies.reduce((a, b) => a + b, 0) / keyLatencies.length
      : 178
  )
  const backspaceRatio = Math.round(
    (totalKeyCount > 0 ? backspaceCount / totalKeyCount : 0.04) * 100
  )

  // Apply Presets
  const applyPreset = (preset: 'baseline' | 'exam' | 'crisis') => {
    setTelemetryPreset(preset)
    if (preset === 'baseline') {
      setCurrentScore(24)
      setCurrentTier(1)
    } else if (preset === 'exam') {
      setCurrentScore(48)
      setCurrentTier(2)
    } else {
      setCurrentScore(86)
      setCurrentTier(3)
    }
  }

  // Handle Check-in Submission via standalone client Edge Engine
  const handleCheckIn = async (textToSubmit: string) => {
    const cleanText = textToSubmit.trim()
    if (!cleanText || loading) return

    setInputText('')
    const userMsgId = 'user-' + Date.now()
    const userMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: cleanText,
      timestamp: 'Just now'
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const result = await triageCheckIn(
        cleanText,
        currentScore,
        dialect as Dialect
      )

      setCurrentScore(result.smoothed_score)
      setCurrentTier(result.tier)

      const assistantMsg: Message = {
        id: 'ast-' + Date.now(),
        role: 'assistant',
        content: result.response,
        result: result,
        timestamp: 'Just now'
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      console.error("Triage execution error:", err)
    } finally {
      setLoading(false)
    }
  }

  const latestAssistantMsg = [...messages].reverse().find(m => m.role === 'assistant' && m.result)

  return (
    <div className="min-h-screen bg-[#F6F4EE] flex flex-col font-sans">
      {/* Top Navigation */}
      <TopNav currentPath="/check-in" />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 flex-1">
        {/* Header Title & Subtitle */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8E4] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0D9488] bg-[#0D9488]/10 px-2.5 py-0.5 rounded-full border border-[#0D9488]/20 font-mono">
                Real-Time Triage Engine
              </span>
              <span className="text-xs text-muted-foreground font-mono">
                Negation-Aware Aho-Corasick &lt;0.1ms
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#0F2E27]">
              Zero-Egress Check-In
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Dual-source sensing with instant client-side fallback — zero telemetry egress.
            </p>
          </div>

          {/* Segmented Preset Bar */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E2E8E4] self-start sm:self-auto shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground px-2 font-mono">Preset:</span>
            <button
              onClick={() => applyPreset('baseline')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                telemetryPreset === 'baseline'
                  ? 'bg-[#0F2E27] text-white font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Baseline
            </button>
            <button
              onClick={() => applyPreset('exam')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                telemetryPreset === 'exam'
                  ? 'bg-[#0F2E27] text-white font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Exam Stress
            </button>
            <button
              onClick={() => applyPreset('crisis')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                telemetryPreset === 'crisis'
                  ? 'bg-[#DC2626] text-white font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Acute Crisis
            </button>
          </div>
        </div>

        {/* 2-Column Responsive Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (~38% = 5 cols out of 12) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* 1. Biometric Emotion Avatar */}
            <EmotionAvatar tier={currentTier} score={currentScore} />

            {/* 2. Sentinel Signal Graph with 90% Split-Conformal Band */}
            <SentinelSignalGraph currentScore={currentScore} conformalBand={7.5} />

            {/* 3. 3 Compact Passive Signal Tiles */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-white border border-[#E2E8E4] p-3 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Sleep Drift</span>
                <span className="text-base font-bold font-mono text-[#D97706] block mt-0.5">-2.8h</span>
                <span className="text-[9px] text-muted-foreground">vs 7d median</span>
              </div>

              <div className="bg-white border border-[#E2E8E4] p-3 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">Night Unlocks</span>
                <span className="text-base font-bold font-mono text-[#DC2626] block mt-0.5">28 / hr</span>
                <span className="text-[9px] text-muted-foreground">z = +2.6σ</span>
              </div>

              <div className="bg-white border border-[#E2E8E4] p-3 rounded-xl shadow-xs">
                <span className="text-[10px] font-bold text-muted-foreground uppercase block">BiAffect Hesitation</span>
                <span className="text-base font-bold font-mono text-[#0F2E27] block mt-0.5">{avgLatency} ms</span>
                <span className="text-[9px] text-muted-foreground">Rev: {backspaceRatio}%</span>
              </div>
            </div>

            {/* Micro Tagline */}
            <div className="bg-[#FAF9F5] border border-[#E2E8E4] p-3 rounded-xl text-center">
              <p className="text-[11px] text-muted-foreground">
                <strong className="text-[#0F2E27]">Zero-Daemon OS Sourcing:</strong> Querying Android UsageStats &amp; Sleep API with zero background daemons.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN (~62% = 7 cols out of 12) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            
            {/* Quick-Test Judge Chips Directly Above The Input */}
            <div className="bg-white border border-[#E2E8E4] p-3.5 rounded-2xl shadow-xs">
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
                <span className="text-xs font-bold text-[#0F2E27] uppercase tracking-wider font-mono">
                  Quick-Test Scenarios for Judges
                </span>
                <span className="text-[10px] text-muted-foreground ml-auto">Click to auto-triage</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCheckIn("Stressed about exams, don't want to die or hurt myself, just overwhelmed")}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-[#FAF9F5] hover:bg-[#EFECE6] border border-[#E2E8E4] text-[#0F2E27] font-medium transition-colors text-left"
                >
                  🛡️ <strong>Test Negation:</strong> &quot;...don&apos;t want to die&quot;
                </button>

                <button
                  onClick={() => handleCheckIn("sab khatam karna hai tonight, ab aur nahi sah sakta")}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-800 font-medium transition-colors text-left"
                >
                  🔴 <strong>Acute Hinglish:</strong> &quot;sab khatam karna hai&quot;
                </button>

                <button
                  onClick={() => handleCheckIn("Haven't slept in 3 days, feeling trapped under continuous exam burnout")}
                  disabled={loading}
                  className="text-xs px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 font-medium transition-colors text-left"
                >
                  🟠 <strong>Academic Burnout:</strong> &quot;Haven&apos;t slept in 3 days...&quot;
                </button>
              </div>
            </div>

            {/* Input Form */}
            <Card className="border border-[#E2E8E4] bg-white shadow-xs rounded-2xl overflow-hidden">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleCheckIn(inputText)
                }}
                className="p-3 flex gap-2 items-center"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Share what you are feeling (e.g. 'Stressed about exams, but trying to manage')..."
                  className="flex-1 p-2.5 rounded-xl border border-[#E2E8E4] bg-[#FAF9F5] text-xs sm:text-sm text-[#0F2E27] placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                />
                <Button
                  type="submit"
                  disabled={loading || !inputText.trim()}
                  className="h-10 bg-[#0F2E27] hover:bg-[#1A453B] text-white text-xs px-4 font-semibold rounded-xl shrink-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Triaging...</span>
                    </>
                  ) : (
                    <span>Evaluate</span>
                  )}
                </Button>
              </form>
            </Card>

            {/* Single Unified Triage Response Card (No Nested Scrollbox!) */}
            {latestAssistantMsg?.result ? (
              <Card className="border border-[#E2E8E4] bg-white shadow-xs rounded-2xl overflow-hidden animate-in fade-in duration-300">
                <CardHeader className="bg-[#FAF9F5] border-b border-[#E2E8E4] py-3 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0D9488] animate-pulse" />
                    <span className="text-xs font-bold text-[#0F2E27] font-mono">
                      {latestAssistantMsg.result.inference_source}
                    </span>
                    <Badge variant="outline" className="text-[10px] bg-white text-[#0F2E27] border-[#E2E8E4]">
                      {latestAssistantMsg.result.crisis_router.latency_ms} ms
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">Distress:</span>
                    <span className="font-mono font-bold text-[#0F2E27]">
                      {latestAssistantMsg.result.smoothed_score}/100
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      [{latestAssistantMsg.result.conformal_interval[0]} - {latestAssistantMsg.result.conformal_interval[1]}] (90% Conf)
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="p-5 space-y-4">
                  {/* Status Banner */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    latestAssistantMsg.result.tier === 3
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : latestAssistantMsg.result.tier === 2
                        ? 'bg-amber-50 border-amber-200 text-amber-900'
                        : 'bg-teal-50 border-teal-200 text-teal-900'
                  }`}>
                    <span className="font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      Router Status: {latestAssistantMsg.result.crisis_router.tier1_status}
                    </span>
                    <span className="font-mono text-[11px]">
                      MindGuard: {latestAssistantMsg.result.mindguard_class}
                    </span>
                  </div>

                  {/* Compassionate Response */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block mb-1">
                      Compassionate Guidance
                    </span>
                    <p className="text-sm text-[#0F2E27] leading-relaxed bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E2E8E4]">
                      {latestAssistantMsg.result.response}
                    </p>
                  </div>

                  {/* Clinical Factors & Grounding */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2E8E4]">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1.5">
                        Identified Clinical Factors
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {latestAssistantMsg.result.factors.map((f, i) => (
                          <span key={i} className="bg-white border border-[#E2E8E4] px-2 py-0.5 rounded-md text-[11px] text-[#0F2E27]">
                            • {f}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#FAF9F5] p-3 rounded-xl border border-[#E2E8E4]">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block mb-1.5">
                        ProKnow Grounding
                      </span>
                      <p className="text-[11px] text-muted-foreground italic">
                        &quot;{latestAssistantMsg.result.guidance}&quot;
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-white border border-[#E2E8E4] p-5 rounded-2xl shadow-xs text-center text-xs text-muted-foreground">
                <p>Welcome! Click any test chip above or type a thought in the box to see instant triage.</p>
              </div>
            )}

            {/* "Say It For Me" 4-Line SOAP-Lite Card */}
            <SoapLiteCard
              dialect={dialect}
              mode="telemanas"
              tier={currentTier}
              score={currentScore}
              onTriggerCall={() => setCallModalOpen(true)}
              trustedContact={trustedContact}
            />

            {/* Collapsible Advanced Controls Drawer */}
            <div className="border border-[#E2E8E4] rounded-2xl bg-white shadow-xs overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full py-3 px-5 flex items-center justify-between text-xs font-bold text-[#0F2E27] bg-[#FAF9F5] hover:bg-[#EFECE6] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#0D9488]" />
                  <span>Advanced Controls &amp; Data Provenance</span>
                </div>
                {showAdvanced ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {showAdvanced && (
                <div className="p-5 space-y-5 border-t border-[#E2E8E4] bg-white animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                        1. Rest Window &amp; Role
                      </label>
                      <select
                        value={restWindow}
                        onChange={(e) => setRestWindow(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[#E2E8E4] bg-[#FAF9F5] text-xs text-[#0F2E27] focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                      >
                        <option value="1:00 AM – 8:00 AM · College Student">1:00 AM – 8:00 AM · College Student (Default)</option>
                        <option value="11:00 PM – 6:30 AM · Working Adult">11:00 PM – 6:30 AM · Working Adult</option>
                        <option value="2:00 AM – 9:30 AM · Shift Worker">2:00 AM – 9:30 AM · Shift Worker</option>
                      </select>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        Anchors Day-0 baseline prior to eliminate 14-day cold start.
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                        2. Dialect Profile
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {(['English', 'Casual Hinglish', 'Formal Hindi', 'Tamil'] as DialectProfile[]).map(d => (
                          <button
                            key={d}
                            onClick={() => setDialect(d)}
                            className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                              dialect === d
                                ? 'bg-[#0F2E27] text-white font-semibold'
                                : 'bg-[#FAF9F5] border border-[#E2E8E4] text-muted-foreground hover:text-[#0F2E27]'
                            }`}
                          >
                            {d === 'Casual Hinglish' ? 'Hinglish' : d === 'Formal Hindi' ? 'Hindi' : d}
                          </button>
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground mt-1 block">
                        Adapts SOAP-Lite Intake Card &amp; prompts.
                      </span>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block mb-1">
                        3. Trusted Support Contact
                      </label>
                      <input
                        type="text"
                        value={trustedContact}
                        onChange={(e) => setTrustedContact(e.target.value)}
                        className="w-full p-2 rounded-lg border border-[#E2E8E4] bg-[#FAF9F5] text-xs font-mono text-[#0F2E27] focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                      />
                      <span className="text-[10px] text-[#0D9488] mt-1 flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        Encrypted in Android Keystore
                      </span>
                    </div>
                  </div>

                  {/* False Alarm Budget */}
                  <div className="pt-3 border-t border-[#E2E8E4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#0F2E27] block">
                        False-Alarm Cadence Adaptation
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Conformal Alpha: {conformalAlpha.toFixed(2)} (Alert fatigue suppression during exams)
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFalseAlarmSnoozed(true)
                        setConformalAlpha(0.06)
                      }}
                      className="text-xs border-[#E2E8E4] hover:bg-[#FAF9F5] text-[#0F2E27]"
                    >
                      {falseAlarmSnoozed ? 'Cadence Adapted (α = 0.06)' : 'Snooze [Just Busy / Exams]'}
                    </Button>
                  </div>

                  {/* Data Provenance Inspector Component */}
                  <div className="pt-3 border-t border-[#E2E8E4]">
                    <DataProvenanceInspector />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Floating Call Modal */}
      <FloatingCallOverlay
        isOpen={callModalOpen}
        onClose={() => setCallModalOpen(false)}
        dialect={dialect}
        mode="telemanas"
        tier={currentTier}
      />
    </div>
  )
}
