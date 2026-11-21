"use client"
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Volume2, VolumeX, PhoneCall, Send, ShieldCheck, CheckCircle2, Edit3, RotateCcw } from 'lucide-react'
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
  const [isEditing, setIsEditing] = useState(false)

  const getDefaultLines = (d: DialectProfile) => {
    if (d === 'Casual Hinglish') {
      return {
        line1: 'Namaste, mujhe shuruat se bolne mein thoda mushkil ho raha hai, isliye maine apni स्थिति 4 lines mein likhi hai.',
        line2: 'Pichle 5 dino se meri neend ~3 ghante shift ho gayi hai aur raat ko kaafi restlessness rahi hai (28 micro-unlocks/hr).',
        line3: 'Main kaafi drained aur overwhelmed feel kar raha hoon, khaaskar studies aur exam pressure ki wajah se.',
        line4: tier >= 3
          ? 'Mujhe abhi turant safety support chahiye aur koi please line par bane rahein.'
          : 'Main abhi safe hoon, bas is stress spiral ko rokne ke liye aapki guidance chahiye.'
      }
    } else if (d === 'Formal Hindi') {
      return {
        line1: 'नमस्ते, मुझे शुरू से बताने में थोड़ी हिचकिचाहट हो रही है, इसलिए मैंने अपनी स्थिति को ४ पंक्तियों में संक्षेप में लिखा है।',
        line2: 'पिछले ५ दिनों से मेरी नींद लगभग ३ घंटे पिछड़ गई है और रातों को अत्यधिक बेचैनी रही है (२८ अनलॉक्स/घंटा)।',
        line3: 'मैं काफी थका हुआ और असहाय महसूस कर रहा हूँ, विशेष रूप से पढ़ाई और परीक्षा के तनाव के कारण।',
        line4: tier >= 3
          ? 'मुझे तत्काल सुरक्षा सहायता की आवश्यकता है, कृपया तुरंत फोन पर बने रहें।'
          : 'मैं अभी सुरक्षित हूँ, बस इस तनाव के चक्र को धीमा करने के लिए आपका मार्गदर्शन चाहिए।'
      }
    } else if (d === 'Tamil') {
      return {
        line1: 'வணக்கம், ஆரம்பத்தில் இருந்து பேச கடினமாக உள்ளது, எனவே எனது நிலையை 4 வரிகளில் சுருக்கமாக எழுதியுள்ளேன்.',
        line2: 'கடந்த 5 நாட்களாக எனது தூக்கம் ~3 மணிநேரம் தாமதமாகி, இரவு நேர அமைதியின்மை அதிகரித்துள்ளது.',
        line3: 'படிப்பு சுமை மற்றும் தனிமை காரணமாக நான் மிகவும் சோர்வாக உணர்கிறேன்.',
        line4: tier >= 3
          ? 'எனக்கு உடனடி பாதுகாப்பு உதவி தேவை, தயவுசெய்து இணைப்பில் இருங்கள்.'
          : 'நான் இப்போது பாதுகாப்பாக இருக்கிறேன், இந்த மன அழுத்தத்தை குறைக்க வழிகாட்டல் தேவை.'
      }
    } else {
      return {
        line1: 'Hi, I find it hard to start from scratch, so I wrote down a quick 4-line summary to read.',
        line2: 'For the last 5 days, my sleep proxy shifted by ~3 hours and my nights have been restless (28 micro-unlocks/hr).',
        line3: "I've been feeling drained and overwhelmed, mostly around academic workload and upcoming exams.",
        line4: tier >= 3
          ? 'I need immediate safety support and someone to stay on the line with me right now.'
          : 'I am safe right now, I just need help slowing this spiral down.'
      }
    }
  }

  const [lines, setLines] = useState(getDefaultLines(activeDialect))

  useEffect(() => {
    setActiveDialect(dialect)
    setLines(getDefaultLines(dialect))
  }, [dialect, tier])

  const handleDialectChange = (newDialect: DialectProfile) => {
    setActiveDialect(newDialect)
    setLines(getDefaultLines(newDialect))
  }

  const handleResetLines = () => {
    setLines(getDefaultLines(activeDialect))
    setIsEditing(false)
  }

  const fullText = `${lines.line1} ${lines.line2} ${lines.line3} ${lines.line4}`

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.')
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
    const waUrl = `https://wa.me/${trustedContact.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('SENTINEL QPR Alert: ' + fullText)}`
    
    try {
      const apiBase = getApiBase()
      if (apiBase) {
        const res = await fetch(`${apiBase}/alerts/whatsapp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            case_id: 'TELEMANAS-STUDENT-01',
            risk_band: tier >= 3 ? 'High' : 'Medium',
            mindguard_class: tier >= 3 ? 'Self-Harm / Imminent Threat' : 'Safe'
          })
        })
        const data = await res.json()
        if (data.status === 'success') {
          setWaAlertStatus(`WhatsApp alert dispatched to ${trustedContact}! (SID: ${data.message_sid ? data.message_sid.slice(-8) : 'OK'})`)
          return
        }
      }
      // Fallback directly to native WhatsApp intent
      window.open(waUrl, '_blank')
      setWaAlertStatus(`Opened native WhatsApp link for ${trustedContact}`)
    } catch {
      window.open(waUrl, '_blank')
      setWaAlertStatus(`Opened native WhatsApp link for ${trustedContact}`)
    } finally {
      setWaSending(false)
    }
  }

  return (
    <Card className="border border-[#E2E8E4] bg-white shadow-sm rounded-2xl overflow-hidden mt-4">
      <CardHeader className="bg-[#FAF9F5] border-b border-[#E2E8E4] py-3 px-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#0F2E27] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0D9488]" />
              &quot;Say It For Me&quot; — 4-Line Clinical Intake Card (SOAP-Lite)
            </h3>
            <Badge variant="outline" className="text-[10px] bg-white text-[#0F2E27] border-[#E2E8E4] font-semibold">
              STEP 4 HANDOFF
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Converts passive telemetry into a 4-line script so anxious callers don&apos;t have to start from scratch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Dialect Selector */}
          <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-[#E2E8E4]">
            {(['English', 'Casual Hinglish', 'Formal Hindi', 'Tamil'] as DialectProfile[]).map(d => (
              <button
                key={d}
                onClick={() => handleDialectChange(d)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-all ${
                  activeDialect === d
                    ? 'bg-[#0F2E27] text-white font-semibold shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {d === 'Casual Hinglish' ? 'Hinglish' : d === 'Formal Hindi' ? 'Hindi' : d}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            title="Toggle Edit Lines"
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              isEditing ? 'bg-[#0F2E27] text-white border-[#0F2E27]' : 'bg-white text-muted-foreground border-[#E2E8E4] hover:text-[#0F2E27]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium hidden sm:inline">{isEditing ? 'Done' : 'Edit'}</span>
          </button>

          {isEditing && (
            <button
              onClick={handleResetLines}
              title="Reset to Default"
              className="p-1.5 rounded-lg border border-[#E2E8E4] bg-white text-muted-foreground hover:text-foreground text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-4">
        {/* 4 SOAP Lines */}
        <div className="space-y-3 bg-[#FBFBFA] p-4 rounded-xl border border-[#E2E8E4]">
          {/* S - Subjective / Opener */}
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-md bg-[#0D9488]/10 text-[#0D9488] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
              S
            </span>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Subjective · Anxiety Barrier Breaker
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={lines.line1}
                  onChange={(e) => setLines({ ...lines, line1: e.target.value })}
                  className="w-full text-xs p-1.5 mt-1 rounded border border-[#E2E8E4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                />
              ) : (
                <p className="text-xs text-[#0F2E27] font-medium leading-relaxed mt-0.5">
                  &quot;{lines.line1}&quot;
                </p>
              )}
            </div>
          </div>

          {/* O - Objective Shift */}
          <div className="flex items-start gap-3 pt-2.5 border-t border-[#E2E8E4]/60">
            <span className="w-6 h-6 rounded-md bg-[#0D9488]/10 text-[#0D9488] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
              O
            </span>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Objective · Zero-Daemon Sensing Shift
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={lines.line2}
                  onChange={(e) => setLines({ ...lines, line2: e.target.value })}
                  className="w-full text-xs p-1.5 mt-1 rounded border border-[#E2E8E4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                />
              ) : (
                <p className="text-xs text-[#0F2E27] font-medium leading-relaxed mt-0.5">
                  &quot;{lines.line2}&quot;
                </p>
              )}
            </div>
          </div>

          {/* A - Assessment / Context */}
          <div className="flex items-start gap-3 pt-2.5 border-t border-[#E2E8E4]/60">
            <span className="w-6 h-6 rounded-md bg-[#0D9488]/10 text-[#0D9488] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
              A
            </span>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Assessment · Emotional Driver & Score ({score}/100)
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={lines.line3}
                  onChange={(e) => setLines({ ...lines, line3: e.target.value })}
                  className="w-full text-xs p-1.5 mt-1 rounded border border-[#E2E8E4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                />
              ) : (
                <p className="text-xs text-[#0F2E27] font-medium leading-relaxed mt-0.5">
                  &quot;{lines.line3}&quot;
                </p>
              )}
            </div>
          </div>

          {/* P - Plan / The Clear Ask */}
          <div className="flex items-start gap-3 pt-2.5 border-t border-[#E2E8E4]/60">
            <span className="w-6 h-6 rounded-md bg-[#0D9488]/10 text-[#0D9488] text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 font-mono">
              P
            </span>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block">
                Plan · The Clear Ask & Safety Protocol
              </span>
              {isEditing ? (
                <input
                  type="text"
                  value={lines.line4}
                  onChange={(e) => setLines({ ...lines, line4: e.target.value })}
                  className="w-full text-xs p-1.5 mt-1 rounded border border-[#E2E8E4] bg-white focus:outline-none focus:ring-1 focus:ring-[#0D9488]"
                />
              ) : (
                <p className="text-xs text-[#0F2E27] font-medium leading-relaxed mt-0.5">
                  &quot;{lines.line4}&quot;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 3 Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Action 1: Speak It For Me */}
          <Button
            variant="outline"
            onClick={toggleSpeech}
            className={`w-full justify-center gap-2 border-[#E2E8E4] font-medium text-xs h-10 transition-all ${
              isSpeaking
                ? 'bg-[#0F2E27] text-white border-[#0F2E27] animate-pulse'
                : 'bg-white hover:bg-[#FAF9F5] text-[#0F2E27]'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Stop Speaking</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-[#0D9488]" />
                <span>🔊 Speak It For Me</span>
              </>
            )}
          </Button>

          {/* Action 2: Call Tele-MANAS */}
          <Button
            onClick={handleCall}
            className="w-full justify-center gap-2 bg-[#0F2E27] hover:bg-[#1A453B] text-white font-semibold text-xs h-10 shadow-xs"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>📞 Call Tele-MANAS (14416)</span>
          </Button>

          {/* Action 3: Alert Trusted Contact */}
          <Button
            variant="outline"
            onClick={sendTwilioAlert}
            disabled={waSending}
            className="w-full justify-center gap-2 border-[#E2E8E4] bg-white hover:bg-[#FAF9F5] text-[#0F2E27] font-medium text-xs h-10"
          >
            <Send className="w-4 h-4 text-[#0D9488]" />
            <span>{waSending ? 'Alerting...' : '💬 Alert Support Contact'}</span>
          </Button>
        </div>

        {/* Bottom microcopy */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] text-muted-foreground border-t border-[#E2E8E4]">
          <span className="flex items-center gap-1.5 text-[#0F2E27]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0D9488]" />
            Zero-Egress: Never shared without your explicit tap
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            Reduces Tele-MANAS intake from 5 mins ➔ &lt;90s
          </span>
        </div>

        {waAlertStatus && (
          <div className="p-2.5 rounded-lg text-xs font-medium bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{waAlertStatus}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
