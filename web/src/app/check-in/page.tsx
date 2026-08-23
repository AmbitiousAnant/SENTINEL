"use client"
import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const API_BASE = "http://127.0.0.1:8000/api"

type ChatMessage = {
  role: 'system' | 'user' | 'scorer'
  content: string
  score?: number
  risk_band?: string
  factors?: string[]
  diagnosis?: string
  prevention_methods?: string[]
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

    try {
      const res = await fetch(`${API_BASE}/scorer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: "case_001", message: text })
      })
      const data = await res.json()
      
      setMessages(prev => [...prev, {
        role: 'scorer',
        content: `Distress Score Updated: ${data.current_score.toFixed(1)}/100`,
        score: data.current_score,
        risk_band: data.risk_band,
        factors: data.factors,
        diagnosis: data.diagnosis,
        prevention_methods: data.prevention_methods
      }])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4">
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Victim Check-in (Synthetic Case: case_001)</h1>
        
        <Card className="flex-1 flex flex-col mb-4 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user' ? 'bg-blue-600 text-white' : 
                  msg.role === 'system' ? 'bg-gray-100 text-gray-900 flex items-start gap-2' : 'bg-orange-50 border border-orange-200 text-gray-800'
                }`}>
                  <p className="flex-1">{msg.content}</p>
                  
                  {msg.role === 'system' && (
                    <Button size="icon" variant="ghost" className="h-6 w-6 mt-1 text-orange-600 hover:text-orange-700 hover:bg-orange-100" onClick={() => {
                  const speechText = msg.diagnosis ? `Based on your check-in: ${msg.diagnosis}. ${msg.prevention_methods ? 'Here are some suggestions: ' + msg.prevention_methods.join('. ') : ''}` : msg.content;
                  playAudio(speechText)
                }} title="Play Audio">
                      🔊
                    </Button>
                  )}
                  
                  {msg.role === 'scorer' && (
                    <div className="mt-3 space-y-2 text-sm border-t border-orange-200 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Risk Band:</span>
                        <Badge variant={msg.risk_band === 'High' ? 'destructive' : msg.risk_band === 'Medium' ? 'default' : 'secondary'}>
                          {msg.risk_band}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-semibold">Key Factors:</span>
                        <ul className="list-disc pl-4 mt-1 text-xs">
                          {msg.factors?.map((f: string, j: number) => <li key={j}>{f}</li>)}
                        </ul>
                      </div>
                      {msg.diagnosis && (
                        <div>
                          <span className="font-semibold">Diagnosis:</span>
                          <p className="text-xs mt-1">{msg.diagnosis}</p>
                        </div>
                      )}
                      {msg.prevention_methods && msg.prevention_methods.length > 0 && (
                        <div>
                          <span className="font-semibold">Prevention Methods:</span>
                          <ul className="list-disc pl-4 mt-1 text-xs">
                            {msg.prevention_methods.map((pm: string, j: number) => <li key={j}>{pm}</li>)}
                          </ul>
                        </div>
                      )}
                      <div className="pt-2">
                        <Button variant="outline" size="sm" onClick={() => {
                          const speechText = msg.diagnosis ? `Based on your check-in: ${msg.diagnosis}. ${msg.prevention_methods ? 'Here are some suggestions: ' + msg.prevention_methods.join('. ') : ''}` : msg.content;
                          playAudio(speechText)
                        }}>🔊 Play Audio Remedies</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && <div className="text-gray-500 text-sm italic">Analyzing distress factors...</div>}
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        <div className="grid gap-2">
          <div className="text-sm font-semibold text-gray-600 mb-1">Pre-scripted Responses:</div>
          {PRE_SCRIPTED_MESSAGES.map((msg, i) => (
            <Button 
              key={i} 
              variant="outline" 
              className="justify-start text-left h-auto py-3 whitespace-normal"
              onClick={() => sendCheckIn(msg)}
              disabled={loading}
            >
              {msg}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
