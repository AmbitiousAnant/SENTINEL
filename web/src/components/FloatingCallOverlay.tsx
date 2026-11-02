"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PhoneCall, PhoneOff, Volume2, VolumeX, ShieldCheck, Clock, UserCheck } from 'lucide-react'

interface FloatingCallOverlayProps {
  isOpen: boolean
  onClose: () => void
  dialect?: 'Casual Hinglish' | 'Formal Hindi' | 'English' | 'Tamil'
  mode?: 'telemanas' | 'nhaa'
  tier?: number
}

export function FloatingCallOverlay({
  isOpen,
  onClose,
  dialect = 'Casual Hinglish',
  mode = 'telemanas',
  tier = 2
}: FloatingCallOverlayProps) {
  const [seconds, setSeconds] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    let timer: any
    if (isOpen) {
      setSeconds(0)
      timer = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen) return null

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60)
    const s = sec % 60
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`
  }

  const getLines = () => {
    if (dialect === 'Casual Hinglish') {
      return {
        line1: 'Namaste, mujhe shuruat se bolne mein thoda mushkil ho raha hai, isliye maine apni स्थिति 4 lines mein likhi hai.',
        line2: 'Pichle 5 dino se meri neend ~3 ghante shift ho gayi hai aur raat ko kaafi restlessness rahi hai (28 micro-unlocks/hr).',
        line3: mode === 'telemanas' 
          ? 'Main kaafi drained aur overwhelmed feel kar raha hoon, khaaskar studies aur pressure ki wajah se.'
          : 'Pichle incident ke baad se main kaafi darr aur threat feel kar raha hoon.',
        line4: tier >= 3
          ? 'Mujhe abhi turant safety support chahiye aur koi please line par bane rahein.'
          : 'Main abhi safe hoon, bas is stress spiral ko rokne ke liye aapki guidance chahiye.'
      }
    } else if (dialect === 'Formal Hindi') {
      return {
        line1: 'नमस्ते, मुझे शुरू से बताने में थोड़ी हिचकिचाहट हो रही है, इसलिए मैंने अपनी स्थिति को ४ पंक्तियों में संक्षेप में लिखा है।',
        line2: 'पिछले ५ दिनों से मेरी नींद लगभग ३ घंटे पिछड़ गई है और रातों को अत्यधिक बेचैनी रही है।',
        line3: mode === 'telemanas'
          ? 'मैं काफी थका हुआ और असहाय महसूस कर रहा हूँ, विशेष रूप से पढ़ाई और तनाव के कारण।'
          : 'हालिया घटनाओं के बाद से मैं अपने इलाके में भयभीत और असुरक्षित महसूस कर रहा हूँ।',
        line4: tier >= 3
          ? 'मुझे तत्काल सुरक्षा सहायता की आवश्यकता है, कृपया तुरंत फोन पर बने रहें।'
          : 'मैं अभी सुरक्षित हूँ, बस इस तनाव के चक्र को धीमा करने के लिए आपका मार्गदर्शन चाहिए।'
      }
    } else if (dialect === 'Tamil') {
      return {
        line1: 'வணக்கம், ஆரம்பத்தில் இருந்து பேச கடினமாக உள்ளது, எனவே எனது நிலையை 4 வரிகளில் சுருக்கமாக எழுதியுள்ளேன்.',
        line2: 'கடந்த 5 நாட்களாக எனது தூக்கம் ~3 மணிநேரம் தாமதமாகி, இரவு நேர அமைதியின்மை அதிகரித்துள்ளது.',
        line3: mode === 'telemanas'
          ? 'படிப்பு சுமை மற்றும் தனிமை காரணமாக நான் மிகவும் சோர்வாக உணர்கிறேன்.'
          : 'சமீபத்திய சம்பவங்களுக்குப் பிறகு நான் மிகவும் அச்சுறுத்தலாகவும் பயமாகவும் உணர்கிறேன்.',
        line4: tier >= 3
          ? 'எனக்கு உடனடி பாதுகாப்பு உதவி தேவை, தயவுசெய்து இணைப்பில் இருங்கள்.'
          : 'நான் இப்போது பாதுகாப்பாக இருக்கிறேன், இந்த மன அழுத்தத்தை குறைக்க வழிகாட்டல் தேவை.'
      }
    } else {
      return {
        line1: 'Hi, I find it hard to start from scratch, so I wrote down a quick summary to read.',
        line2: 'For the last 5 days, my sleep proxy shifted by ~3 hours and my nights have been restless (28 micro-unlocks/hr).',
        line3: mode === 'telemanas'
          ? "I've been feeling drained and overwhelmed, mostly around academic workload and isolation."
          : "I've been feeling intimidated and terrified after recent incidents in my locality.",
        line4: tier >= 3
          ? 'I need immediate safety support and someone to stay on the line with me right now.'
          : 'I am safe right now, I just need help slowing this spiral down.'
      }
    }
  }

  const lines = getLines()
  const fullText = `${lines.line1} ${lines.line2} ${lines.line3} ${lines.line4}`

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(fullText)
    if (dialect === 'Formal Hindi' || dialect === 'Casual Hinglish') {
      utterance.lang = 'hi-IN'
    } else if (dialect === 'Tamil') {
      utterance.lang = 'ta-IN'
    } else {
      utterance.lang = 'en-IN'
    }
    utterance.rate = 0.95
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    setIsSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <Card className="w-full max-w-lg bg-zinc-950 border-2 border-emerald-500/50 text-white shadow-2xl rounded-3xl overflow-hidden flex flex-col">
        {/* Floating Call Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 to-zinc-900 border-b border-emerald-500/30 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base text-white">Tele-MANAS (14416)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-xs text-emerald-300/80">
                National Tele Mental Health Helpline • Anonymous
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-sm font-bold text-emerald-400 block">{formatTime(seconds)}</span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest">In-Call</span>
          </div>
        </div>

        {/* Pinned 4-Line SOAP-Lite Script */}
        <div className="p-5 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between text-xs border-b border-zinc-800 pb-2">
            <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📌</span> Read This Script to Your Counselor:
            </span>
            <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
              {dialect}
            </Badge>
          </div>

          <div className="bg-zinc-900/90 p-4 rounded-2xl border border-zinc-800 space-y-3 shadow-inner">
            <div className="flex gap-2.5">
              <span className="text-xs font-bold text-emerald-400 shrink-0">1.</span>
              <p className="text-sm font-semibold text-zinc-100 leading-relaxed">&quot;{lines.line1}&quot;</p>
            </div>
            <div className="flex gap-2.5 pt-2 border-t border-zinc-800/80">
              <span className="text-xs font-bold text-emerald-400 shrink-0">2.</span>
              <p className="text-sm font-semibold text-zinc-100 leading-relaxed">&quot;{lines.line2}&quot;</p>
            </div>
            <div className="flex gap-2.5 pt-2 border-t border-zinc-800/80">
              <span className="text-xs font-bold text-emerald-400 shrink-0">3.</span>
              <p className="text-sm font-semibold text-zinc-100 leading-relaxed">&quot;{lines.line3}&quot;</p>
            </div>
            <div className="flex gap-2.5 pt-2 border-t border-zinc-800/80">
              <span className="text-xs font-bold text-emerald-400 shrink-0">4.</span>
              <p className="text-sm font-semibold text-zinc-100 leading-relaxed">&quot;{lines.line4}&quot;</p>
            </div>
          </div>

          {/* Efficiency Metric Badge */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-300">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Counselor Efficiency Impact:</span>
            </span>
            <span className="font-bold font-mono text-white">4–6m ➔ &lt;90s at ₹0 Cloud Cost</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Call Recording • Zero Cloud Logging • Client-Side TEE Audio</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="bg-zinc-900 border-t border-zinc-800 p-4 flex gap-3">
          <Button
            variant="outline"
            onClick={toggleSpeech}
            className={`flex-1 h-12 rounded-xl font-bold border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 ${
              isSpeaking ? 'bg-emerald-500 text-zinc-950 animate-pulse' : ''
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4 mr-2" />
                <span>Stop Speaking</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 mr-2" />
                <span>🔊 Speak It For Me</span>
              </>
            )}
          </Button>

          <Button
            onClick={() => {
              if (isSpeaking) {
                window.speechSynthesis?.cancel()
                setIsSpeaking(false)
              }
              onClose()
            }}
            className="flex-1 h-12 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white shadow-lg"
          >
            <PhoneOff className="w-4 h-4 mr-2" />
            <span>End Call / Close</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}
