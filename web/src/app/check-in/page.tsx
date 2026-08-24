"use client"
import { useState, useRef, useEffect } from 'react'
import { Loader2, Phone } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const API_BASE = "http://127.0.0.1:8000/api"

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
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8">
      <div className="max-w-6xl w-full mx-auto flex flex-col md:flex-row gap-6">
        
        {/* LEFT PANEL: Simulation Controls & Fake Input */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h1 className="text-2xl font-bold mb-2">Sentinel Simulator</h1>
          <p className="text-sm text-gray-600 mb-4">
            Select a synthetic check-in scenario below to trigger the Sentinel analysis pipeline.
          </p>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Simulation Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start border-teal-200 hover:bg-teal-50 text-teal-900 whitespace-normal text-left h-auto py-2"
                onClick={() => sendCheckIn("I'm doing okay today. Slept a bit better. Just trying to stay busy with work.")}
                disabled={loading}
              >
                Phase 1: &quot;I&apos;m doing okay today. Slept a bit better...&quot;
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-purple-200 hover:bg-purple-50 text-purple-900 whitespace-normal text-left h-auto py-2"
                onClick={() => sendCheckIn("I've been feeling very anxious lately. My sleep is disrupted and I feel exhausted.")}
                disabled={loading}
              >
                Phase 2: &quot;I&apos;ve been feeling very anxious lately...&quot;
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-purple-200 hover:bg-purple-50 text-purple-900 whitespace-normal text-left h-auto py-2"
                onClick={() => sendCheckIn("The police came to ask questions today. I feel like they are angry with me. I am scared.")}
                disabled={loading}
              >
                Phase 2: &quot;The police came to ask questions today...&quot;
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-indigo-200 hover:bg-indigo-50 text-indigo-900 whitespace-normal text-left h-auto py-2"
                onClick={() => sendCheckIn("They walked past my house again. I am terrified. I can't take this anymore, I just want it all to end tonight.")}
                disabled={loading}
              >
                Phase 3: &quot;They walked past my house again. I am terrified...&quot;
              </Button>
            </CardContent>
          </Card>

          {/* Telemetry Dashboard (Static Roadmap) */}
          <Card className="mt-4 border-indigo-100 shadow-sm bg-gray-50/50">
            <CardHeader className="pb-2 bg-gray-100/50 border-b">
              <CardTitle className="text-sm text-gray-500 uppercase tracking-wider flex items-center gap-2">
                Simulated Telemetry (Not Active)
                <Badge variant="outline" className="ml-auto text-[10px] bg-white text-gray-400 border-gray-200">
                  ROADMAP
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="text-xs text-gray-500 italic mb-2 border-l-2 border-indigo-200 pl-2">
                Roadmap — signal set informed by MindGuard (Ji et al. 2024) and BiAffect (Cao et al.), pending wearable/app-level integration.
              </div>
              
              <div className="opacity-50 pointer-events-none">
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Avg Resting Heart Rate</span>
                    <span className="text-lg font-bold text-gray-400">-- BPM</span>
                  </div>
                  <div className="text-[10px] text-gray-400">Requires Watch/Band Sync</div>
                </div>

                <div className="h-16 mt-4 border-t pt-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase block">Circadian Cycle (Sleep Hrs)</span>
                  <div className="w-full h-full bg-gray-100 rounded mt-1 flex items-center justify-center text-xs text-gray-400">
                    [Chart Placeholder]
                  </div>
                </div>

                <div className="h-16 mt-4 border-t pt-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase block">Social App Usage (Mins)</span>
                  <div className="w-full h-full bg-gray-100 rounded mt-1 flex items-center justify-center text-xs text-gray-400">
                    [Chart Placeholder]
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fake Text Input */}
          <Card className="mt-auto border-dashed">
            <CardContent className="p-4">
              <p className="text-xs text-gray-500 mb-2 uppercase font-semibold">User Interface Preview</p>
              <div className="flex gap-2 opacity-60 pointer-events-none">
                <input 
                  type="text" 
                  disabled 
                  placeholder="Type your check-in here..." 
                  className="flex-1 border rounded-md px-3 py-2 text-sm bg-white"
                />
                <Button disabled size="sm">Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT PANEL: Chat & Backend Analysis */}
        <div className="w-full md:w-2/3 flex flex-col h-[80vh]">
          
          {/* Tier Banner */}
          <div className={`mb-4 p-4 rounded-lg border shadow-sm transition-colors ${
            currentTier === 3 ? 'bg-indigo-50 border-indigo-200 text-indigo-900' :
            currentTier === 2 ? 'bg-purple-50 border-purple-200 text-purple-900' :
            'bg-teal-50 border-teal-200 text-teal-900'
          }`}>
            <div className="flex justify-between items-center">
              <div className="font-bold text-lg">Active Support Phase: {currentTier}</div>
              <Badge variant="outline" className={`bg-white ${
                currentTier === 3 ? 'text-indigo-700 border-indigo-300' : 
                currentTier === 2 ? 'text-purple-700 border-purple-300' : 
                'text-teal-700 border-teal-300'
              }`}>
                {currentTier === 3 ? "PHASE 3 (INTENSIVE)" : currentTier === 2 ? "PHASE 2 (ELEVATED)" : "PHASE 1 (STABLE)"}
              </Badge>
            </div>
            <div className="text-sm mt-2">
              {currentTier === 3 && "Connecting you with immediate professional support (Tele MANAS)."}
              {currentTier === 2 && "We recommend speaking with a counsellor. Tele MANAS is available."}
              {currentTier === 1 && "Guided resilience and on-device support exercises."}
            </div>
          </div>

          <Card className="flex-1 flex flex-col overflow-hidden shadow-md border-gray-200">
            <CardHeader className="bg-gray-100 border-b py-3">
              <CardTitle className="text-sm text-gray-600 uppercase tracking-wider flex justify-between items-center">
                <span>Check-in Interface & Analytics</span>
                <span className="text-xs font-normal">Case: 001 (Synthetic)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 shadow-sm ${
                    msg.role === 'user' ? 'bg-blue-600 text-white' : 
                    msg.role === 'system' ? 'bg-white text-gray-900 border' : 
                    'bg-white border-l-4 border-slate-400 text-gray-800'
                  }`}>
                    <div className="flex-1">
                      <p className={msg.role === 'scorer' ? 'font-semibold mb-2' : ''}>{msg.content}</p>
                      {msg.mindguard_class && (
                        <div className="mt-2 flex justify-end">
                          <Badge variant={msg.mindguard_class === 'Safe' ? 'secondary' : 'destructive'} className="text-[10px]">
                            MindGuard: {msg.mindguard_class}
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {msg.role === 'system' && (
                      <Button size="icon" variant="ghost" className="h-6 w-6 mt-1 text-slate-600 hover:text-slate-700 hover:bg-slate-100" onClick={() => {
                        const speechText = msg.guidance ? `Guidance: ${msg.guidance}. ${msg.prevention_methods ? 'Here are some suggestions: ' + msg.prevention_methods.join('. ') : ''}` : msg.content;
                        playAudio(speechText)
                      }} title="Play Audio">
                        🔊
                      </Button>
                    )}
                    
                    {msg.role === 'scorer' && (
                      <div className="mt-3 space-y-3 text-sm border-t border-gray-100 pt-3">
                        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-2 rounded">
                          <div>
                            <span className="text-xs text-gray-500 block uppercase">Risk Band</span>
                            <Badge variant={msg.risk_band === 'High' ? 'destructive' : msg.risk_band === 'Medium' ? 'default' : 'secondary'} className="mt-1">
                              {msg.risk_band}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500 block uppercase">Calibrated Score</span>
                            <span className="font-mono mt-1 block">
                              {Math.max(0, (msg.score || 50) - 4).toFixed(0)} - {Math.min(100, (msg.score || 50) + 4).toFixed(0)} <span className="text-xs text-gray-400">(90% conf)</span>
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="font-semibold text-gray-700">Key Factors:</span>
                          <ul className="list-disc pl-5 mt-1 text-gray-600">
                            {msg.factors?.map((f: string, j: number) => <li key={j}>{f}</li>)}
                          </ul>
                        </div>
                        {msg.guidance && (
                          <div>
                            <span className="font-semibold text-gray-700">Guidance:</span>
                            <p className="mt-1 text-gray-600">{msg.guidance}</p>
                          </div>
                        )}
                        {msg.prevention_methods && msg.prevention_methods.length > 0 && (
                          <div>
                            <span className="font-semibold text-gray-700">Suggested Remedies:</span>
                            <ul className="list-disc pl-5 mt-1 text-gray-600">
                              {msg.prevention_methods.map((pm: string, j: number) => <li key={j}>{pm}</li>)}
                            </ul>
                          </div>
                        )}
                        <div className="pt-2">
                          <Button variant="outline" size="sm" onClick={() => {
                            const speechText = msg.guidance ? `Guidance: ${msg.guidance}. ${msg.prevention_methods ? 'Here are some suggestions: ' + msg.prevention_methods.join('. ') : ''}` : msg.content;
                            playAudio(speechText)
                          }} className="w-full justify-center">
                            🔊 Play Audio Remedies
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-gray-500 text-sm italic p-4 bg-gray-100 rounded-lg max-w-[50%] animate-pulse">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full delay-75"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full delay-150"></div>
                  Analyzing distress factors...
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
