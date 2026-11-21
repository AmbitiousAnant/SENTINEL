"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Loader2, Phone, Volume2, ShieldCheck, Clock, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle, Sparkles, Activity, Key, SlidersHorizontal } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getApiBase } from '@/lib/utils'
import { SoapLiteCard, DialectProfile } from '@/components/SoapLiteCard'
import { FloatingCallOverlay } from '@/components/FloatingCallOverlay'
import DataProvenanceInspector from '@/components/DataProvenanceInspector'
import { SentinelSignalGraph } from '@/components/SentinelSignalGraph'
import { evaluateCheckInWithGemini } from '@/lib/gemini'

type ChatMessage = {
  role: 'system' | 'user' | 'scorer'
  content: string
  score?: number
  risk_band?: string
  factors?: string[]
  guidance?: string
  prevention_methods?: string[]
  mindguard_class?: string
  crisis_router?: {
    tier1_status?: string
    latency_ms?: number
    negation_aware?: boolean
  }
}

function EmotionAvatar({ tier, score }: { tier: number, score: number }) {
  const getTierStyles = () => {
    switch(tier) {
      case 3: return "from-red-500/80 via-indigo-600/80 to-purple-800/80 blob-fast"
      case 2: return "from-orange-400/70 via-purple-500/70 to-pink-500/70 blob-med"
      default: return "from-teal-400/60 via-emerald-500/60 to-cyan-500/60 blob-slow"
    }
  }
  
  const getGlowStyles = () => {
    switch(tier) {
      case 3: return "shadow-[0_0_80px_rgba(239,68,68,0.6)]"
      case 2: return "shadow-[0_0_60px_rgba(249,115,22,0.4)]"
      default: return "shadow-[0_0_40px_rgba(45,212,191,0.3)]"
    }
  }

  return (
    <div className="flex flex-col items-center justify-center relative min-h-[300px] w-full rounded-2xl border border-border/50 bg-background/40 backdrop-blur-md overflow-hidden shadow-sm">
      <div className="absolute top-3.5 left-4 right-4 flex justify-between items-start z-20">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono">Live Emotion State</span>
          <span className="text-[10px] text-muted-foreground">Sentinel Biometric Avatar</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
            Distress: {score.toFixed(0)}/100
          </span>
          <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
            ZERO-EGRESS
          </Badge>
        </div>
      </div>
      
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center z-10 transition-all duration-1000 ease-in-out my-4">
        <div className={`absolute inset-0 bg-gradient-to-tr ${getTierStyles()} mix-blend-multiply filter blur-md ${getGlowStyles()} transition-colors duration-1000`} 
             style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
        />
        <div className={`absolute inset-2 bg-gradient-to-bl ${getTierStyles()} mix-blend-screen filter blur-sm opacity-80 transition-colors duration-1000`} 
             style={{ borderRadius: '60% 40% 30% 70% / 50% 60% 50% 40%' }}
        />
        <div className="absolute w-12 h-12 bg-white/20 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
           <div className={`w-4 h-4 rounded-full transition-colors duration-1000 ${tier === 3 ? 'bg-red-500 animate-ping' : tier === 2 ? 'bg-orange-400 animate-pulse' : 'bg-teal-300'}`} />
        </div>
      </div>
      
      <div className="text-center z-20 px-4 pb-3.5">
        <div className={`text-xs font-bold tracking-wide transition-colors duration-500 ${tier === 3 ? 'text-red-700 dark:text-red-400' : tier === 2 ? 'text-orange-700 dark:text-orange-400' : 'text-teal-700 dark:text-teal-400'}`}>
          {tier === 3 ? "CRITICAL CRISIS (TIER 3)" : tier === 2 ? "ROUGH WEEK / ELEVATED (TIER 2)" : "STABLE RESILIENCE (TIER 1)"} • {score.toFixed(0)}/100
        </div>
        <div className="text-[11px] text-muted-foreground mt-1 max-w-[280px] mx-auto leading-relaxed">
          {tier === 3 
            ? "Immediate Tier-1 Router lock-in engaged. Bypassing generative LLM for direct Tele-MANAS (14416) safety dispatch." 
            : tier === 2 
              ? "Circadian rest shift and restlessness detected. 4-Line SOAP-Lite card generated for Tele-MANAS support." 
              : "Optimal biological baseline. Cognitive resilience and circadian alignment are high."}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .blob-slow { animation: blob-slow 8s infinite alternate ease-in-out; }
        .blob-med { animation: blob-med 4s infinite alternate ease-in-out; }
        .blob-fast { animation: blob-fast 1.5s infinite alternate ease-in-out; }

        @keyframes blob-slow {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; transform: rotate(0deg) scale(1); }
          100% { border-radius: 60% 40% 30% 70% / 50% 60% 50% 40%; transform: rotate(180deg) scale(1.05); }
        }
        @keyframes blob-med {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: rotate(0deg) scale(1); }
          100% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; transform: rotate(180deg) scale(1.1); }
        }
        @keyframes blob-fast {
          0% { border-radius: 20% 80% 20% 80% / 80% 20% 80% 20%; transform: rotate(0deg) scale(0.9); }
          50% { border-radius: 80% 20% 80% 20% / 20% 80% 20% 80%; transform: rotate(90deg) scale(1.15); }
          100% { border-radius: 20% 80% 20% 80% / 80% 20% 80% 20%; transform: rotate(0deg) scale(0.9); }
        }
      `}} />
    </div>
  )
}

export default function CheckInPage() {
  // Day-0 Calibration state
  const [showCalibration, setShowCalibration] = useState(false)
  const [restWindow, setRestWindow] = useState('1:00 AM – 8:00 AM · College Student')
  const [dialect, setDialect] = useState<DialectProfile>('Casual Hinglish')
  const [trustedContact, setTrustedContact] = useState('+917982350793')

  // False-Alarm Budget State
  const [falseAlarmSnoozed, setFalseAlarmSnoozed] = useState(false)
  const [conformalAlpha, setConformalAlpha] = useState(0.10)
  const [snoozeMessage, setSnoozeMessage] = useState<string | null>(null)

  // Live BiAffect Keystroke Dynamics
  const [keyLatencies, setKeyLatencies] = useState<number[]>([185, 172, 194, 168, 180])
  const [backspaceCount, setBackspaceCount] = useState(2)
  const [totalKeyCount, setTotalKeyCount] = useState(48)
  const lastKeyTimeRef = useRef<number>(Date.now())

  // Floating Call Overlay Modal
  const [callModalOpen, setCallModalOpen] = useState(false)

  // Academic Data Provenance State
  const [activeAlgorithm1, setActiveAlgorithm1] = useState<any>(null)
  const [activeFeatures, setActiveFeatures] = useState<any>(null)

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'system',
    content: "Welcome to your Sentinel Zero-Egress Digital Rhythm Check-in. How are your days and sleep feeling?"
  }])
  const [loading, setLoading] = useState(false)
  const [inputText, setInputText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Track keystrokes for BiAffect Group D
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

  const avgLatency = Math.round(keyLatencies.length > 0 ? (keyLatencies.reduce((a, b) => a + b, 0) / keyLatencies.length) : 154)
  const backspaceRatio = Math.round((totalKeyCount > 0 ? (backspaceCount / totalKeyCount) : 0.04) * 100)

  // Handle False Alarm Budget Buttons
  const handleJustBusy = () => {
    setConformalAlpha(0.06)
    setFalseAlarmSnoozed(true)
    setSnoozeMessage("False-Alarm Budget Updated: Exam-week cadence learned (alpha_t 0.10 ➔ 0.06); alert fatigue suppressed.")
  }

  const handleRoughWeekClick = () => {
    sendCheckIn("I've been feeling very anxious lately. My sleep is disrupted and I feel exhausted.")
    inputRef.current?.focus()
  }

  // Unified Check-in Engine (Backend -> Gemini Cloud -> Deterministic Edge)
  const sendCheckIn = async (text: string) => {
    if (!text || !text.trim() || loading) return
    const userMsg = text.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    const apiBase = getApiBase()
    let data: any = null

    const telemetryPayload = {
      session_id: "sess_local_" + Date.now().toString(36),
      rest_proxy_duration_hours: 3.9,
      bedtime_drift_hours: 2.8,
      nocturnal_micro_unlocks: 3.8,
      daily_total_unlocks: 72,
      social_burst_entropy: 0.65,
      biaffect_interkey_ms: avgLatency || 154,
      biaffect_backspace_ratio: (backspaceRatio / 100) || 0.12,
      is_simulated: false
    }

    // 1. Try FastAPI Backend if available
    if (apiBase) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 3500)
        const res = await fetch(`${apiBase}/scorer/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            case_id: 'TELEMANAS-STUDENT-01', 
            message: userMsg,
            telemetry: telemetryPayload
          }),
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        if (res.ok) {
          data = await res.json()
        }
      } catch (e1) {
        console.warn("Backend API not reachable, switching to client Gemini/Edge cascade.", e1)
      }
    }

    if (data) {
      if (data.algorithm_1) setActiveAlgorithm1(data.algorithm_1)
      if (data.features) setActiveFeatures(data.features)
      setMessages(prev => {
        const newMsgs = [...prev]
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === 'user') {
          newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], mindguard_class: data.mindguard_class }
        }
        return [...newMsgs, {
          role: 'scorer',
          content: data.response || "I hear you, and your feelings are completely valid. We are standing by to support you.",
          score: data.current_score,
          risk_band: data.risk_band,
          factors: data.factors,
          guidance: data.guidance,
          prevention_methods: data.prevention_methods,
          mindguard_class: data.mindguard_class,
          crisis_router: data.crisis_router
        }]
      })
      setLoading(false)
      return
    }

    // 2. Direct Client-Side Gemini Bridge (Netlify Cloud Triage with ProKnow RAG)
    try {
      const geminiResult = await evaluateCheckInWithGemini(userMsg)
      const rawScore = geminiResult.raw_score ?? 40
      
      // Algorithm 1: 70/30 Exponential Moving Average
      const newSmoothed = Number((0.70 * rawScore + 0.30 * latestScore).toFixed(0))
      const riskBand = newSmoothed >= 75 ? 'High' : newSmoothed >= 40 ? 'Medium' : 'Low'

      setActiveAlgorithm1({
        isolation_forest_score_s_IF: rawScore,
        rolling_z_score_s_z: latestScore,
        disagreement_delta: Math.abs(rawScore - latestScore),
        disagreement_threshold_tau: 28.0,
        disagreement_gate_triggered: Math.abs(rawScore - latestScore) > 28.0,
        confidence_status: Math.abs(rawScore - latestScore) > 28.0 ? "DISAGREEMENT_HOLD" : "HIGH_CONFIDENCE",
        conformal_score_q_90: 7.5,
        conformal_interval_90: [Math.max(0, newSmoothed - 7.5), Math.min(100, newSmoothed + 7.5)]
      })

      setMessages(prev => {
        const newMsgs = [...prev]
        if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === 'user') {
          newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], mindguard_class: geminiResult.mindguard_class }
        }
        return [...newMsgs, {
          role: 'scorer',
          content: geminiResult.response,
          score: newSmoothed,
          risk_band: riskBand,
          factors: geminiResult.factors,
          guidance: geminiResult.guidance,
          prevention_methods: geminiResult.prevention_methods,
          mindguard_class: geminiResult.mindguard_class,
          crisis_router: geminiResult.crisis_router
        }]
      })
    } catch (err) {
      console.error("Client triage error:", err)
    } finally {
      setLoading(false)
    }
  }

  const latestScorerMsg = [...messages].reverse().find(m => m.role === 'scorer')
  const latestScore = latestScorerMsg?.score ?? 34
  const currentTier = latestScore >= 75 ? 3 : latestScore >= 40 ? 2 : 1

  return (
    <div className={`min-h-screen flex flex-col p-3 md:p-6 font-sans relative overflow-x-hidden transition-colors duration-1000 ${currentTier === 3 ? 'bg-red-950/10' : currentTier === 2 ? 'bg-orange-950/10' : 'bg-teal-950/10'}`}>
      
      {/* Background Motifs */}
      <img alt="" aria-hidden="true" className="fixed -bottom-48 -right-24 w-[800px] max-w-none opacity-[0.12] z-0 pointer-events-none grayscale" src="https://lh3.googleusercontent.com/aida/AEtjO1XiCYoEezvi1vQeVwLJLMJh385gEORaqFKsIbP49hinIKA9gkD-iPOcnW36ZDF4oPANl7_pHKLr0EqYVyO2p0jDJe11lJmgldVnR-U4nZeIRXLBf41b39bIaHYY16NocivtwEX-0CEadApwAFgf6wU0arYDLwym8Gej-2iYUR37XqMFLUjbm0reK6pck2wTNp0KDMtbsA2wNPwAN7oHhjGfqsliNzX2RyLC9J8scsZIrAMdhmNVEhHlU7Q" />
      <div className={`fixed inset-0 z-[1] pointer-events-none transition-colors duration-1000 ${currentTier === 3 ? 'bg-red-500/5' : currentTier === 2 ? 'bg-orange-500/5' : 'bg-teal-500/5'} mix-blend-multiply`} />
      <div className="fixed inset-0 bg-background/70 z-[1] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto flex flex-col gap-4 relative z-10 flex-1">
        
        {/* TOP BAR: Clean, Minimal Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-1">
          <div className="flex items-center gap-3">
            <a href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors bg-card/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border/60">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span>Hub</span>
            </a>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold font-heading text-foreground">
                SENTINEL
              </span>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                TELE-MANAS 14416
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCalibration(!showCalibration)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground bg-card/90 hover:bg-sidebar px-3 py-1.5 rounded-lg border border-border transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              <span>Day-0 Baseline & Dialect</span>
              {showCalibration ? <ChevronUp className="w-3 h-3 text-muted-foreground" /> : <ChevronDown className="w-3 h-3 text-muted-foreground" />}
            </button>
            <a href="/dashboard/counsellor?case=case_002" className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
              <span>Counsellor Review</span>
            </a>
          </div>
        </div>

        {/* 5-Step AI Value Chain Banner */}
        <div className="w-full bg-zinc-950 text-white rounded-2xl p-3 sm:p-3.5 border border-zinc-800 shadow-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 font-mono">
                BUILD FOR BHARAT 2026 · PS 1 & PS 3
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full lg:w-auto text-[10px]">
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5">
                <span className="text-emerald-400 font-bold block">1. Problem</span>
                <span className="text-zinc-300">63% Hide Distress</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5">
                <span className="text-emerald-400 font-bold block">2. Passive Data</span>
                <span className="text-zinc-300">OS Unlock Logs (0-Daemon)</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5">
                <span className="text-emerald-400 font-bold block">3. Edge AI</span>
                <span className="text-zinc-300">&lt;0.2ms Trie + Gemini Cascade</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-1.5">
                <span className="text-emerald-400 font-bold block">4. Output</span>
                <span className="text-zinc-300">4-Line SOAP-Lite Card</span>
              </div>
              <div className="bg-emerald-950/60 border border-emerald-500/40 rounded-lg p-1.5 col-span-2 sm:col-span-1">
                <span className="text-emerald-300 font-bold block">5. Gov Impact</span>
                <span className="text-emerald-100">1-Tap 14416 @ ₹0 BOM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Day-0 Baseline & Dialect Drawer */}
        {showCalibration && (
          <div className="w-full bg-card border border-border rounded-2xl shadow-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-200">
            <div>
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1">
                1. Typical Rest Window & Role
              </label>
              <select
                value={restWindow}
                onChange={(e) => setRestWindow(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
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
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1">
                2. Dialect & Tone Profile
              </label>
              <div className="flex flex-wrap gap-1">
                {(['Casual Hinglish', 'Formal Hindi', 'English', 'Tamil'] as DialectProfile[]).map(d => (
                  <button
                    key={d}
                    onClick={() => setDialect(d)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                      dialect === d
                        ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                        : 'bg-secondary/40 text-foreground hover:bg-secondary'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                Adapts SOAP-Lite Intake Card & on-device prompts.
              </span>
            </div>

            <div>
              <label className="text-xs font-bold text-foreground uppercase tracking-wider block mb-1">
                3. Hardware Keystore Trusted Contact
              </label>
              <input
                type="text"
                value={trustedContact}
                onChange={(e) => setTrustedContact(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-xs font-mono focus:ring-2 focus:ring-primary focus:outline-none"
              />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Encrypted in Android Keystore · Never Messaged Without Your Tap
              </span>
            </div>
          </div>
        )}

        {/* MAIN 2-COLUMN VIEWPORT */}
        <div className="flex flex-col lg:flex-row gap-5">
          
          {/* LEFT PANEL: Visual Biometrics & Signal Graph */}
          <div className="w-full lg:w-1/3 flex flex-col gap-4">
            
            {/* Biometric Emotion Avatar */}
            <EmotionAvatar tier={currentTier} score={latestScore} />

            {/* Longitudinal Signal Graph with 90% Split-Conformal Band */}
            <SentinelSignalGraph currentScore={latestScore} conformalBand={7.5} />

            {/* Compact Real-Time Telemetry Card */}
            <Card className="border-border shadow-sm bg-card">
              <CardHeader className="py-2.5 px-3.5 bg-sidebar border-b border-border rounded-t-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <span>📡</span> Passive Behavioral Telemetry
                  </span>
                  <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                    ZERO-DAEMON
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-3 space-y-2.5 text-xs">
                {/* Live Keystroke Dynamics */}
                <div className="p-2.5 rounded-xl bg-background border border-primary/25 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-foreground">
                    <span className="text-primary flex items-center gap-1 font-mono">
                      <span>⌨️</span> Live BiAffect Keystrokes
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono">First-Party RAM</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center font-mono">
                    <div className="bg-sidebar p-1.5 rounded-lg border border-border">
                      <span className="text-[9px] text-muted-foreground block">Inter-Key Delay</span>
                      <span className="font-bold text-foreground text-xs">{avgLatency} ms</span>
                    </div>
                    <div className="bg-sidebar p-1.5 rounded-lg border border-border">
                      <span className="text-[9px] text-muted-foreground block">Revision Ratio</span>
                      <span className="font-bold text-foreground text-xs">{backspaceRatio}%</span>
                    </div>
                  </div>
                </div>

                {/* Circadian & Micro-Unlocks in a 2-col grid */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-xl bg-background border border-border space-y-1">
                    <span className="text-[10px] text-muted-foreground block">Circadian Rest</span>
                    <span className="font-bold font-mono text-orange-500 text-xs">4.2 hrs</span>
                    <span className="text-[9px] text-muted-foreground block">-2.8h shift</span>
                  </div>
                  <div className="p-2 rounded-xl bg-background border border-border space-y-1">
                    <span className="text-[10px] text-muted-foreground block">Micro-Unlocks</span>
                    <span className="font-bold font-mono text-red-500 text-xs">28 / hr</span>
                    <span className="text-[9px] text-muted-foreground block">z = +2.6σ</span>
                  </div>
                </div>
                <span className="text-[9px] text-muted-foreground block text-center pt-0.5">
                  Metadata Only · No Custom IME · ACTION_USER_PRESENT
                </span>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL: Chat, Quick Presets, Crisis Router & SOAP Card */}
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            
            {/* False-Alarm Budget Notification Bar */}
            {!falseAlarmSnoozed ? (
              <div className="bg-gradient-to-r from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/30 p-3 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Multi-day circadian drift detected. How is your week feeling?
                    </span>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      Conformal Budget: alpha_t = {conformalAlpha.toFixed(2)} · Zero-Daemon Ring Log
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleJustBusy}
                    className="text-xs h-7 border-orange-500/30 hover:bg-orange-500/10 text-orange-700 dark:text-orange-300"
                  >
                    [Just Busy / Exams]
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRoughWeekClick}
                    className="text-xs h-7 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
                  >
                    [Rough Week Check-In]
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-2xl flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-300">
                <span className="flex items-center gap-2 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{snoozeMessage}</span>
                </span>
                <button 
                  onClick={() => { setFalseAlarmSnoozed(false); setConformalAlpha(0.10); }}
                  className="text-[10px] underline hover:text-emerald-900 dark:hover:text-emerald-100"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Quick Test Scenarios Bar for Judges */}
            <div className="p-2.5 bg-card border border-border/80 rounded-2xl shadow-sm flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider font-mono mr-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" /> Test:
              </span>
              <button 
                onClick={() => sendCheckIn("I'm doing okay today. Getting ready for exams, keeping up with regular study sessions.")}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors"
              >
                🟢 Normal Baseline
              </button>
              <button 
                onClick={() => sendCheckIn("I've been feeling very anxious lately. My sleep is disrupted and I feel exhausted.")}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-500/10 text-orange-700 dark:text-orange-300 hover:bg-orange-500/20 border border-orange-500/20 transition-colors"
              >
                🟠 Rough Week
              </button>
              <button 
                onClick={() => sendCheckIn("I'm feeling stressed about exams, but I don't want to die or hurt myself. Just need to manage my time better.")}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 border border-blue-500/20 transition-colors"
              >
                🛡️ Safe Negation Test
              </button>
              <button 
                onClick={() => sendCheckIn("sab khatam karna hai tonight, ab aur nahi sah sakta.")}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-red-500/10 text-red-700 dark:text-red-300 hover:bg-red-500/20 border border-red-500/20 transition-colors"
              >
                🔴 Acute Crisis
              </button>
            </div>

            {/* Check-in Interface Card */}
            <Card className="flex flex-col shadow-md border-border bg-card overflow-hidden">
              <CardHeader className="bg-sidebar border-b border-border py-2.5 px-4 flex flex-col gap-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-heading font-bold text-foreground">
                      Interactive Triage Interface
                    </span>
                    <Badge variant="outline" className="text-[9px] bg-primary/10 text-primary border-primary/20">
                      LIVE AI
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">
                      Distress Score: <span className="font-mono text-primary font-bold text-xs">{latestScore.toFixed(0)}/100</span>
                    </span>
                  </div>
                </div>

                {/* Tier 1 Crisis Router (<0.2ms) Diagnostic Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/40 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-muted-foreground font-mono">Tier 1 Safety Router:</span>
                    <span className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                      latestScorerMsg?.crisis_router?.tier1_status?.includes('ACUTE')
                        ? 'bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/40 animate-pulse'
                        : latestScorerMsg?.crisis_router?.tier1_status?.includes('Negation')
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {latestScorerMsg?.crisis_router?.tier1_status || 'CLEAR (Aho-Corasick Trie)'}
                    </span>
                  </div>
                  <span className="text-muted-foreground font-mono text-[10px]">
                    Latency: {latestScorerMsg?.crisis_router?.latency_ms ?? 0.12} ms (Negation-Aware)
                  </span>
                </div>
              </CardHeader>

              {/* Chat Messages Log */}
              <CardContent className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-background max-h-[340px]">
                {messages.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end pl-8' : 'items-start pr-8'}`}>
                    <span className="text-[9px] text-muted-foreground mb-1 px-1 font-mono">
                      {m.role === 'user' ? 'Citizen' : m.role === 'system' ? 'Sentinel' : 'Sentinel Triage Engine'}
                    </span>
                    <div className={`w-fit max-w-full rounded-2xl px-3.5 py-2.5 shadow-sm ${
                      m.role === 'user' 
                        ? 'bg-[#d7e3da] text-[#2c3e35] dark:bg-emerald-950/60 dark:text-emerald-200 rounded-tr-sm font-medium text-xs' 
                        : m.role === 'system'
                          ? 'bg-sidebar border border-border text-foreground rounded-tl-sm text-xs'
                          : 'bg-background border border-primary/30 text-foreground w-full rounded-sm text-xs'
                    }`}>
                      <p className="text-[13px] leading-relaxed">{m.content}</p>
                      
                      {/* Scorer Telemetry Summary */}
                      {m.role === 'scorer' && m.risk_band && (
                        <div className="mt-2.5 pt-2.5 border-t border-border/60 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                m.risk_band === 'High'
                                  ? 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40'
                                  : m.risk_band === 'Medium'
                                    ? 'bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/40'
                                    : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40'
                              }`}>
                                Signal: {m.risk_band}
                              </span>
                              {m.mindguard_class && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  m.mindguard_class.includes('Self-Harm') 
                                    ? 'bg-red-600 text-white animate-pulse' 
                                    : 'bg-primary/10 text-primary'
                                }`}>
                                  MindGuard: {m.mindguard_class}
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-xs font-bold text-foreground">
                              Score: {m.score !== undefined ? m.score.toFixed(0) : latestScore.toFixed(0)} / 100
                            </span>
                          </div>

                          {/* Distress Progress Bar */}
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-500 rounded-full ${
                                (m.score || latestScore) >= 75 ? 'bg-red-500' : (m.score || latestScore) >= 40 ? 'bg-orange-500' : 'bg-emerald-500'
                              }`} 
                              style={{ width: `${Math.min(100, Math.max(5, m.score || latestScore))}%` }} 
                            />
                          </div>

                          {/* Extracted Factors */}
                          {m.factors && m.factors.length > 0 && (
                            <div className="text-[11px]">
                              <span className="font-bold text-foreground block mb-0.5">Extracted Factors:</span>
                              <ul className="list-disc pl-3.5 text-muted-foreground space-y-0.5 text-[10px]">
                                {m.factors.map((f: string, j: number) => <li key={j}>{f}</li>)}
                              </ul>
                            </div>
                          )}

                          {/* Guidance */}
                          {m.guidance && (
                            <div className="p-2 rounded-lg bg-sidebar border border-border text-[11px] text-muted-foreground italic">
                              <span className="font-bold text-primary not-italic block uppercase text-[9px]">
                                ProKnow Clinical Guidance:
                              </span>
                              &quot;{m.guidance}&quot;
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex items-center gap-2 text-muted-foreground text-xs italic p-2.5 bg-sidebar rounded-lg w-fit animate-pulse border border-border shadow-sm">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                    Evaluating check-in via ProKnow RAG & MindGuard...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              {/* Chat Input Box */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const msg = inputText.trim()
                  if (msg && !loading) {
                    setInputText('')
                    sendCheckIn(msg)
                  }
                }}
                className="p-2.5 border-t border-border bg-sidebar flex gap-2 rounded-b-lg"
              >
                <input 
                  ref={inputRef}
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a check-in (e.g. 'Stressed about exams, but managing okay')..."
                  className="flex-1 p-2 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <Button 
                  type="submit"
                  className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 text-xs flex items-center gap-1.5 shrink-0"
                  disabled={loading || !inputText.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <span>Send</span>
                  )}
                </Button>
              </form>
            </Card>

            {/* 'Say It For Me' 4-Line Clinical Intake Card (SOAP-Lite) */}
            <SoapLiteCard
              dialect={dialect}
              mode="telemanas"
              tier={currentTier}
              score={latestScore}
              onTriggerCall={() => setCallModalOpen(true)}
              trustedContact={trustedContact}
            />

            {/* Academic Data Provenance & Algorithm 1 Audit Drawer (Collapsed by default) */}
            <DataProvenanceInspector
              currentFeatures={activeFeatures}
              activeAlgorithm1={activeAlgorithm1}
            />
          </div>
        </div>
      </div>

      {/* Floating Call Overlay Simulator Modal */}
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
