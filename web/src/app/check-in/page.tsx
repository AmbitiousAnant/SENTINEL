"use client"
import { useState, useRef, useEffect } from 'react'
import { Loader2, Phone } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent); const API_BASE = isAndroid ? "http://10.0.2.2:8000/api" : "http://127.0.0.1:8000/api"

const TELEMETRY_DATA = {
  1: {
    sleep: [{day: 'Mon', hrs: 7}, {day: 'Tue', hrs: 8}, {day: 'Wed', hrs: 7.5}, {day: 'Thu', hrs: 7}, {day: 'Fri', hrs: 8}],
    social: [{app: 'WhatsApp', mins: 45}, {app: 'Calls', mins: 30}, {app: 'Insta', mins: 60}],
    hr: 72, hrVariance: "Normal (±5 bpm)"
  },
  2: {
    sleep: [{day: 'Mon', hrs: 6}, {day: 'Tue', hrs: 5}, {day: 'Wed', hrs: 4.5}, {day: 'Thu', hrs: 5}, {day: 'Fri', hrs: 4}],
    social: [{app: 'WhatsApp', mins: 15}, {app: 'Calls', mins: 5}, {app: 'Insta', mins: 120}],
    hr: 88, hrVariance: "Elevated (±12 bpm)"
  },
  3: {
    sleep: [{day: 'Mon', hrs: 4}, {day: 'Tue', hrs: 3}, {day: 'Wed', hrs: 2}, {day: 'Thu', hrs: 2.5}, {day: 'Fri', hrs: 1.5}],
    social: [{app: 'WhatsApp', mins: 0}, {app: 'Calls', mins: 0}, {app: 'Insta', mins: 15}],
    hr: 110, hrVariance: "High/Erratic (±18 bpm)"
  }
}

type ChatMessage = {
  role: 'system' | 'user' | 'scorer'
  content: string
  score?: number
  risk_band?: string
  factors?: string[]
  guidance?: string
  prevention_methods?: string[]
  mindguard_class?: string
}

const PRE_SCRIPTED_MESSAGES = [
  "I couldn't sleep at all last night. Every sound makes me jump.",
  "The police came to ask questions today. I feel like they are angry with me.",
  "I'm trying to stay strong for my family, but I just feel so hopeless and tired.",
  "They walked past my house again. I am terrified they will do something tonight."
]

function EmotionAvatar({ tier }: { tier: number }) {
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
    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[350px] w-full rounded-xl border border-border/50 bg-background/40 backdrop-blur-md overflow-hidden shadow-sm mt-4">
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Live Emotion State</span>
          <span className="text-[10px] text-muted-foreground">Sentinel Biometric Avatar</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
          ROADMAP
        </Badge>
      </div>
      
      {/* The Avatar Blob */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center z-10 transition-all duration-1000 ease-in-out">
        {/* Core */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${getTierStyles()} mix-blend-multiply filter blur-md ${getGlowStyles()} transition-colors duration-1000`} 
             style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }}
        />
        <div className={`absolute inset-2 bg-gradient-to-bl ${getTierStyles()} mix-blend-screen filter blur-sm opacity-80 transition-colors duration-1000`} 
             style={{ borderRadius: '60% 40% 30% 70% / 50% 60% 50% 40%' }}
        />
        {/* Inner Eye / Core Pulse */}
        <div className="absolute w-12 h-12 bg-white/20 rounded-full backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner">
           <div className={`w-4 h-4 rounded-full transition-colors duration-1000 ${tier === 3 ? 'bg-red-500 animate-ping' : tier === 2 ? 'bg-orange-400 animate-pulse' : 'bg-teal-300'}`} />
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center z-20 px-4">
        <div className={`text-sm font-bold tracking-wide transition-colors duration-500 ${tier === 3 ? 'text-red-700 dark:text-red-400' : tier === 2 ? 'text-orange-700 dark:text-orange-400' : 'text-teal-700 dark:text-teal-400'}`}>
          {tier === 3 ? "CRITICAL DISTRESS" : tier === 2 ? "ELEVATED ANXIETY" : "STABLE BASELINE"}
        </div>
        <div className="text-xs text-muted-foreground mt-1 max-w-[250px] mx-auto leading-relaxed">
          {tier === 3 ? "Immediate intervention protocols engaged. High risk of self-harm or escalation." : tier === 2 ? "Monitoring heightened physiological markers. Recommended counseling." : "No significant distress patterns detected. Resiliency is high."}
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
          100% { border-radius: 20% 80% 20% 80% / 80% 20% 80% 20%; transform: rotate(180deg) scale(0.9); }
        }
      `}} />
    </div>
  )
}


export default function CheckInPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    role: 'system',
    content: "Welcome to your check-in. How have you been feeling over the last 24 hours?"
  }])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendCheckIn = async (text: string) => {
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setLoading(true)

    // Simulate network round-trip time for demo visibility
    setTimeout(() => {
      fetch(`${API_BASE}/scorer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: "case_001", message: text })
      })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => {
          const newMsgs = [...prev]
          if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === 'user') {
            newMsgs[newMsgs.length - 1] = { ...newMsgs[newMsgs.length - 1], mindguard_class: data.mindguard_class }
          }
          return [...newMsgs, {
            role: 'scorer',
            content: `Distress Level Assessed`,
            score: data.current_score,
            risk_band: data.risk_band,
            factors: data.factors,
            guidance: data.guidance,
            prevention_methods: data.prevention_methods
          }]
        })
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
    }, 1200)
  }

  const playAudio = async (text: string) => {
    try {
      const res = await fetch(`${API_BASE}/voice/tts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language: "en" })
      })
      
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json()
        if (data.audioContent) {
          const audio = new Audio("data:audio/wav;base64," + data.audioContent)
          audio.play()
        } else {
          alert("Could not play audio (missing audioContent in response).")
        }
      } else {
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const audio = new Audio(url)
        audio.play()
      }
    } catch (e) {
      alert("Error playing audio. Please ensure RIME_API_KEY is configured.")
    }
  }

  const latestScore = messages.filter(m => m.score !== undefined).pop()?.score || 50
  const currentTier = latestScore >= 75 ? 3 : latestScore >= 40 ? 2 : 1

  return (
    <div className={`min-h-screen flex flex-col p-4 md:p-8 font-sans relative overflow-x-hidden transition-colors duration-1000 ${currentTier === 3 ? 'bg-red-950/10' : currentTier === 2 ? 'bg-orange-950/10' : 'bg-teal-950/10'}`}>
      {/* Botanical Background (Atmospheric Design) */}
      <img alt="" aria-hidden="true" className="fixed -bottom-48 -right-24 w-[800px] max-w-none opacity-[0.15] z-0 pointer-events-none grayscale" src="https://lh3.googleusercontent.com/aida/AEtjO1XiCYoEezvi1vQeVwLJLMJh385gEORaqFKsIbP49hinIKA9gkD-iPOcnW36ZDF4oPANl7_pHKLr0EqYVyO2p0jDJe11lJmgldVnR-U4nZeIRXLBf41b39bIaHYY16NocivtwEX-0CEadApwAFgf6wU0arYDLwym8Gej-2iYUR37XqMFLUjbm0reK6pck2wTNp0KDMtbsA2wNPwAN7oHhjGfqsliNzX2RyLC9J8scsZIrAMdhmNVEhHlU7Q" />
      <div className={`fixed inset-0 z-[1] pointer-events-none transition-colors duration-1000 ${currentTier === 3 ? 'bg-red-500/5' : currentTier === 2 ? 'bg-orange-500/5' : 'bg-teal-500/5'} mix-blend-multiply`}></div>
      <div className="fixed inset-0 bg-background/60 z-[1] pointer-events-none"></div>

      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-6 relative z-10 flex-1">
        
        {/* LEFT PANEL: Simulation Controls & SIH AI Status */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h1 className="text-3xl font-heading font-bold text-primary mb-1">Sentinel Simulator</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Trigger synthetic scenarios to observe the zero-egress Edge-AI pipeline.
          </p>

          <Card className="shadow-sm border-border bg-card">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg font-heading text-foreground">Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <Button 
                variant="outline" 
                className="w-full justify-start border-border hover:bg-accent/30 text-foreground whitespace-normal text-left h-auto py-3 font-medium transition-colors"
                onClick={() => sendCheckIn("I'm doing okay today. Slept a bit better. Just trying to stay busy with work.")}
                disabled={loading}
              >
                Stable: &quot;I&apos;m doing okay today...&quot;
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-border hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/30 text-foreground whitespace-normal text-left h-auto py-3 font-medium transition-colors"
                onClick={() => sendCheckIn("I've been feeling very anxious lately. My sleep is disrupted and I feel exhausted.")}
                disabled={loading}
              >
                Elevated: &quot;I&apos;ve been feeling very anxious...&quot;
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 text-foreground whitespace-normal text-left h-auto py-3 font-medium transition-colors"
                onClick={() => sendCheckIn("They walked past my house again. I am terrified. I can't take this anymore, I just want it all to end tonight.")}
                disabled={loading}
              >
                Critical: &quot;They walked past my house again...&quot;
              </Button>
            </CardContent>
          </Card>

          {/* Restored Telemetry Dashboard */}
          <Card className="mt-2 border-border shadow-sm bg-card">
            <CardHeader className="pb-2 bg-sidebar border-b border-border rounded-t-lg">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2 font-bold">
                Simulated Telemetry
                <Badge variant="outline" className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/20">
                  ROADMAP
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="text-xs text-muted-foreground italic mb-2 border-l-2 border-primary/30 pl-2">
                Roadmap — signal set informed by MindGuard (Ji et al.) and BiAffect (Cao et al.).
              </div>
              
              {/* Heart Rate Sparkline */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-semibold text-foreground uppercase">Avg Resting Heart Rate</span>
                  <span className="text-lg font-bold text-primary">105 BPM</span>
                </div>
                <div className="text-[10px] text-muted-foreground">High/Erratic (±15 bpm)</div>
              </div>

              {/* Circadian Rhythm (Sleep) - Native SVG */}
              <div>
                <span className="text-xs font-semibold text-foreground uppercase mb-2 block">Circadian Cycle (Sleep Hrs)</span>
                <div className="h-28 w-full border-b border-l border-border flex items-end p-1 relative">
                  <div className="absolute -left-4 bottom-0 text-[8px] text-muted-foreground">0</div>
                  <div className="absolute -left-4 top-0 text-[8px] text-muted-foreground">10</div>
                  
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <polyline 
                      points="0,60 25,70 50,80 75,75 100,85" 
                      fill="none" 
                      stroke="#426656" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    <circle cx="0" cy="60" r="2" fill="#426656" />
                    <circle cx="25" cy="70" r="2" fill="#426656" />
                    <circle cx="50" cy="80" r="2" fill="#426656" />
                    <circle cx="75" cy="75" r="2" fill="#426656" />
                    <circle cx="100" cy="85" r="2" fill="#426656" />
                  </svg>

                  <div className="absolute -bottom-4 left-0 text-[8px] text-muted-foreground">Mon</div>
                  <div className="absolute -bottom-4 left-1/4 text-[8px] text-muted-foreground">Tue</div>
                  <div className="absolute -bottom-4 left-1/2 text-[8px] text-muted-foreground">Wed</div>
                  <div className="absolute -bottom-4 left-[75%] text-[8px] text-muted-foreground">Thu</div>
                  <div className="absolute -bottom-4 right-0 text-[8px] text-muted-foreground">Fri</div>
                </div>
              </div>

              {/* Social Activity - Native CSS Bars */}
              <div className="mt-6">
                <span className="text-xs font-semibold text-foreground uppercase mb-2 block">Social App Usage (Mins)</span>
                <div className="h-28 w-full border-b border-l border-border flex items-end justify-around pb-0 pt-4 relative">
                  <div className="absolute -left-4 bottom-0 text-[8px] text-muted-foreground">0</div>
                  <div className="absolute -left-4 top-0 text-[8px] text-muted-foreground">Max</div>
                  
                  <div className="flex flex-col items-center justify-end h-full w-1/4">
                    <div className="w-full bg-primary/70 rounded-t-sm" style={{height: '5%'}}></div>
                    <div className="text-[8px] text-muted-foreground mt-1">WhatsApp</div>
                  </div>
                  <div className="flex flex-col items-center justify-end h-full w-1/4">
                    <div className="w-full bg-primary/70 rounded-t-sm" style={{height: '2%'}}></div>
                    <div className="text-[8px] text-muted-foreground mt-1">Calls</div>
                  </div>
                  <div className="flex flex-col items-center justify-end h-full w-1/4">
                    <div className="w-full bg-primary/70 rounded-t-sm" style={{height: '15%'}}></div>
                    <div className="text-[8px] text-muted-foreground mt-1">Instagram</div>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* New SIH Parameters Card filling the empty space */}
          <Card className="mt-2 border-border shadow-sm bg-card flex-1">
            <CardHeader className="pb-3 border-b border-border bg-sidebar rounded-t-lg">
              <CardTitle className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-2 font-bold">
                Active Edge-AI Parameters
                <Badge variant="outline" className="ml-auto text-[10px] bg-primary/10 text-primary border-primary/20">
                  SIH COMPLIANT
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div>
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">Emotion AI & Sentiment Analysis</span>
                <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-full animate-pulse opacity-80"></div>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">Real-time NLP feature extraction (TensorFlow Lite)</div>
              </div>

              <div>
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">Predictive Risk Modelling</span>
                <div className="w-full bg-secondary/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%]"></div>
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">Dynamic Distress Scoring & Trend Extrapolation</div>
              </div>

              <div>
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-1">Multilingual Conversational AI</span>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px]">English</Badge>
                  <Badge variant="outline" className="text-[10px]">Hindi</Badge>
                  <Badge variant="outline" className="text-[10px]">Regional (20+)</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider block mb-2">Priority Use-Case Calibration</span>
                <ul className="text-[10px] text-muted-foreground space-y-1 list-disc pl-3">
                  <li>Victims of rape and gang rape.</li>
                  <li>Victims of murder, grievous hurt, arson.</li>
                  <li>Witnesses facing intimidation.</li>
                  <li>SC/ST PoA Act 1989 Beneficiaries.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: Chat & Backend Analysis */}
        <div className="w-full md:w-2/3 flex flex-col h-full min-h-[80vh]">
          
          {/* Sentinel Signal (Attention State) Header */}
          <section className="flex flex-col gap-1 text-left mb-4">
            <h2 className="text-2xl font-bold font-heading text-foreground">Something has changed.</h2>
            <p className="text-[15px] font-sans text-muted-foreground max-w-2xl">
              Your recent pattern is different from your usual range. The Edge-AI has detected a deviation.
            </p>
          </section>

          {/* Sentinel Signal Graph with Botanical Motif */}
          <section className="relative w-full h-48 rounded-xl overflow-hidden bg-card border border-border shadow-sm flex items-center justify-center mb-4">
            <div className="absolute inset-0 border border-border opacity-50 rounded-xl pointer-events-none"></div>
            
            {/* Botanical Motif Accent */}
            <img 
              alt="Botanical motif accent" 
              className="absolute bottom-0 left-4 h-32 w-auto opacity-20 mix-blend-multiply pointer-events-none grayscale" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBtT9kWzsoHHI_tR3YB8jZ9J5ENqkhLG0lejoznv2NbFvWov2WvZtNWbsqty_1h9NfoophW3CGoMvftbdWp9665UafcDdXDVrlSpycY_1PHSze3aDMpQwneydJqnrE1Gy1nDifpbKpOsKvOfXU5s6YUAPht7M75aCbHOmPJt0G25lOHq4tqPEk0AP1cyagiHaier_EBmThX_87nSYaoleuyT64ebfVNZvuQOeMo7jx5znWW9bhHOOsl"
            />
            
            {/* SVG Visualization representing the Sentinel Signal */}
            <svg className="w-full h-full relative z-10" height="100%" preserveAspectRatio="none" viewBox="0 0 1000 300" width="100%">
              {/* Baseline */}
              <path d="M 0 150 Q 250 150 500 150 T 1000 150" fill="none" stroke="#dadad8" strokeDasharray="8 8" strokeWidth="2"></path>
              {/* Gradient Area under current flow */}
              <path d="M 0 150 C 200 140 300 100 400 60 C 500 20 600 280 700 240 C 800 200 900 160 1000 150 L 1000 300 L 0 300 Z" fill="url(#attentionGradient)"></path>
              {/* Current Flow Deviation */}
              <path className="animate-pulse" d="M 0 150 C 200 140 300 100 400 60 C 500 20 600 280 700 240 C 800 200 900 160 1000 150" fill="none" stroke="#b453e5" strokeLinecap="round" strokeWidth="4"></path>
              <defs>
                <linearGradient id="attentionGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#b453e5" stopOpacity="0.15"></stop>
                  <stop offset="100%" stopColor="#b453e5" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>
            </svg>
            
            {/* Indicator Chip */}
            <div className="absolute top-4 right-4 bg-[#f6d6ff] text-[#6b218f] font-sans text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 z-20 border border-[#e9b3ff]/50 shadow-sm">
              <span>Deviation Detected: Phase {currentTier}</span>
            </div>
          </section>

          <Card className="h-[400px] sm:h-[450px] flex flex-col overflow-hidden shadow-md border-border bg-card shrink-0">
            <CardHeader className="bg-sidebar border-b border-border py-3">
              <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider flex justify-between items-center">
                <span>Check-in Interface & Analytics</span>
                <span className="text-xs font-normal">Case: 001 (Synthetic)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-background">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end pl-12' : 'items-start pr-12'}`}>
                  <span className={`text-[10px] text-muted-foreground mb-1 px-2`}>{m.role === 'user' ? 'You' : m.role === 'system' ? 'Sentinel' : 'Analysis Engine'} • Just now</span>
                  <div className={`w-fit max-w-full rounded-2xl px-4 py-3 shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-[#d7e3da] text-[#5a655e] rounded-tr-sm' 
                      : m.role === 'system'
                        ? 'bg-sidebar border border-border text-foreground rounded-tl-sm'
                        : 'bg-background border border-[#e9b3ff]/50 text-foreground w-full rounded-sm relative'
                  }`}>
                    <p className="text-[15px] font-sans leading-relaxed">{m.content}</p>
                    
                    {/* Scorer specific internal telemetry */}
                    {m.role === 'scorer' && m.risk_band && (
                      <div className="mt-3 pt-3 border-t border-[#e9b3ff]/30 space-y-3">
                        
                        <div className="flex items-center gap-2 bg-[#f6d6ff] text-[#6b218f] rounded-full px-3 py-1 border border-[#e9b3ff]/50 w-fit">
                          <span className="text-[12px] font-bold tracking-wide">
                             Signal Detected: {m.risk_band} Risk
                          </span>
                        </div>
                        
                        {m.mindguard_class && (
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground uppercase font-semibold">Guardrail Classification</span>
                            <span className="text-[12px] font-bold text-[#6b218f]">{m.mindguard_class}</span>
                          </div>
                        )}

                        {m.factors && (
                          <div>
                            <span className="text-[11px] font-semibold text-foreground">Extracted Factors:</span>
                            <ul className="list-disc pl-5 mt-1 text-[13px] text-muted-foreground space-y-1">
                              {m.factors.map((f: string, j: number) => <li key={j}>{f}</li>)}
                            </ul>
                          </div>
                        )}
                        
                        {m.prevention_methods && m.prevention_methods.length > 0 && (
                          <div className="bg-card p-3 rounded-lg border border-border mt-3 shadow-sm">
                            <div>
                              <span className="text-[11px] font-semibold text-primary uppercase">Safe Generation:</span>
                              <p className="mt-1 text-[13px] text-muted-foreground italic">&quot;{m.guidance}&quot;</p>
                            </div>
                            <div className="mt-2 pt-2 border-t border-border">
                              <span className="text-[11px] font-semibold text-foreground uppercase">Suggested Remedies:</span>
                              <ul className="list-disc pl-5 mt-1 text-[13px] text-muted-foreground space-y-1">
                                {m.prevention_methods.map((pm: string, j: number) => <li key={j}>{pm}</li>)}
                              </ul>
                            </div>
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            const speechText = m.guidance ? `Guidance: ${m.guidance}. ${m.prevention_methods ? 'Here are some suggestions: ' + m.prevention_methods.join('. ') : ''}` : m.content;
                            playAudio(speechText)
                          }} className="w-full justify-center border-[#e9b3ff] hover:bg-[#f6d6ff] text-[#6b218f]">
                            🔊 Play Audio Remedies
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm italic p-4 bg-sidebar rounded-lg w-fit animate-pulse border border-border shadow-sm">
                  <div className="w-2 h-2 bg-primary/50 rounded-full"></div>
                  <div className="w-2 h-2 bg-primary/50 rounded-full delay-75"></div>
                  <div className="w-2 h-2 bg-primary/50 rounded-full delay-150"></div>
                  Analyzing distress factors...
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="p-3 border-t border-border bg-sidebar flex gap-2 rounded-b-lg">
              <input 
                type="text"
                placeholder="Type your check-in here..."
                className="flex-1 p-3 rounded-md border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                    sendCheckIn(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <Button 
                className="h-auto bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input.value.trim() !== '') {
                    sendCheckIn(input.value)
                    input.value = ''
                  }
                }}
                disabled={loading}
              >
                Send
              </Button>
            </div>
          </Card>

          {/* New Emotion Avatar filling the empty space */}
          <EmotionAvatar tier={currentTier} />
          
        </div>
      </div>
    </div>
  )
}
