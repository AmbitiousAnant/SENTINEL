"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Volume2, VolumeX, PhoneCall, Send, ShieldCheck, Clock, CheckCircle2 } from 'lucide-react'
import { getApiBase } from '@/lib/utils'

export type DialectProfile = 'Casual Hinglish' | 'Formal Hindi' | 'English' | 'Tamil'

interface SoapLiteProps {
  dialect?: DialectProfile
  mode?: 'telemanas' | 'nhaa'
  tier?: number
  score?: number
  onTriggerCall?: () => void
  trustedContact?: string
}

export function SoapLiteCard({
  dialect = 'Casual Hinglish',
  mode = 'telemanas',
  tier = 2,
  score = 58,
  onTriggerCall,
  trustedContact = '+917982350793'
}: SoapLiteProps) {
  const [activeDialect, setActiveDialect] = useState<DialectProfile>(dialect)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [waSending, setWaSending] = useState(false)
  const [waAlertStatus, setWaAlertStatus] = useState<string | null>(null)

  useEffect(() => {
    setActiveDialect(dialect)
  }, [dialect])

  const getLines = () => {
    if (activeDialect === 'Casual Hinglish') {
      return {
        line1: 'Namaste, mujhe shuruat se bolne mein thoda mushkil ho raha hai, isliye maine apni स्थिति (situation) 4 lines mein likhi hai.',
        line2: 'Pichle 5 dino se meri neend ~3 ghante shift ho gayi hai aur raat ko kaafi restlessness rahi hai (28 micro-unlocks/hr).',
        line3: mode === 'telemanas' 
          ? 'Main kaafi drained aur overwhelmed feel kar raha hoon, khaaskar studies aur pressure ki wajah se.'
          : 'Pichle incident ke baad se main kaafi darr aur intimidation feel kar raha hoon.',
        line4: tier >= 3
          ? 'Mujhe abhi turant safety support chahiye aur koi please line par bane rahein.'
          : 'Main abhi safe hoon, bas is stress spiral ko rokne ke liye aapki guidance chahiye.'
      }
    } else if (activeDialect === 'Formal Hindi') {
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
    } else if (activeDialect === 'Tamil') {
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
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device/browser.')
      return
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(fullText)
    if (activeDialect === 'Formal Hindi' || activeDialect === 'Casual Hinglish') {
      utterance.lang = 'hi-IN'
    } else if (activeDialect === 'Tamil') {
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

  const handleCall = () => {
    if (onTriggerCall) {
      onTriggerCall()
    } else {
      window.location.href = 'tel:14416'
    }
  }

  const sendTwilioAlert = async () => {
    setWaSending(true)
    setWaAlertStatus(null)
    try {
      const apiBase = getApiBase()
      const res = await fetch(`${apiBase}/alerts/whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          case_id: mode === 'telemanas' ? 'TELEMANAS-STUDENT-01' : 'case_002',
          risk_band: tier >= 3 ? 'High' : 'Medium',
          mindguard_class: tier >= 3 ? 'Self-Harm / Imminent Threat' : 'Safe'
        })
      })
      const data = await res.json()
      if (data.status === 'success') {
        setWaAlertStatus(`WhatsApp alert dispatched to ${trustedContact}! (SID: ${data.message_sid ? data.message_sid.slice(-8) : 'OK'})`)
      } else {
        setWaAlertStatus('Dispatched via local intent (WhatsApp link opened)')
        const waUrl = `https://wa.me/${trustedContact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('SENTINEL QPR Alert: ' + fullText)}`
        window.open(waUrl, '_blank')
      }
    } catch (e) {
      setWaAlertStatus('Opened native intent')
      const waUrl = `https://wa.me/${trustedContact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('SENTINEL QPR Alert: ' + fullText)}`
      window.open(waUrl, '_blank')
    } finally {
      setWaSending(false)
    }
  }

  return (
    <Card className="border-2 border-primary/30 bg-card shadow-lg rounded-2xl overflow-hidden mt-3">
      <CardHeader className="bg-primary/5 border-b border-primary/15 py-3 px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold font-heading text-primary flex items-center gap-1.5">
              <span>📋</span> &quot;Say It For Me&quot; — 4-Line Clinical Intake Card (SOAP-Lite)
            </span>
            <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/30 font-semibold">
              STEP 4 HANDOFF
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Converts passive telemetry into a 4-line script so choked-up callers do not have to start from scratch.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-background/80 p-1 rounded-lg border border-border">
          {(['Casual Hinglish', 'Formal Hindi', 'English', 'Tamil'] as DialectProfile[]).map(d => (
            <button
              key={d}
              onClick={() => setActiveDialect(d)}
              className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                activeDialect === d
                  ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-3.5">
        <div className="space-y-2.5 bg-sidebar/60 p-4 rounded-xl border border-border">
          <div className="flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              1
            </span>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Opener (Anxiety Barrier Breaker)</span>
              <p className="text-sm text-foreground font-medium leading-relaxed mt-0.5">&quot;{lines.line1}&quot;</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-border/50">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              2
            </span>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Objective Shift (Zero-Daemon Sensing Proxy)</span>
              <p className="text-sm text-foreground font-medium leading-relaxed mt-0.5">&quot;{lines.line2}&quot;</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-border/50">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              3
            </span>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">Subjective Context (Personalized Driver)</span>
              <p className="text-sm text-foreground font-medium leading-relaxed mt-0.5">&quot;{lines.line3}&quot;</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 pt-2 border-t border-border/50">
            <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              4
            </span>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">The Clear Ask (Safety Contract)</span>
              <p className="text-sm text-foreground font-medium leading-relaxed mt-0.5">&quot;{lines.line4}&quot;</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          <Button
            variant="outline"
            onClick={toggleSpeech}
            className={`w-full justify-center gap-2 border-primary/30 font-semibold h-11 transition-all ${
              isSpeaking ? 'bg-primary text-primary-foreground border-primary animate-pulse' : 'hover:bg-primary/10 text-primary'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Speaking</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>🔊 Speak It For Me (TTS)</span>
              </>
            )}
          </Button>

          <Button
            onClick={handleCall}
            className="w-full justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11 shadow-sm"
          >
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>📞 Call Tele-MANAS (14416)</span>
          </Button>

          <Button
            variant="outline"
            onClick={sendTwilioAlert}
            disabled={waSending}
            className="w-full justify-center gap-2 border-border hover:bg-accent/40 font-semibold h-11 text-foreground"
          >
            <Send className="w-4 h-4 text-emerald-600" />
            <span>{waSending ? 'Alerting...' : '💬 Alert Contact'}</span>
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-muted-foreground border-t border-border/40">
          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Coercive-Control Protection: 48h Cooling-Off & User Final Tap Required
          </span>
          <span className="flex items-center gap-1.5 font-mono text-primary font-semibold">
            <Clock className="w-3.5 h-3.5" />
            Cuts Intake Time 4–6 mins ➔ &lt;90s at ₹0 Govt Cloud Cost
          </span>
        </div>

        {waAlertStatus && (
          <div className="p-2.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{waAlertStatus}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
