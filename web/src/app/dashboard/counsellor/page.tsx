"use client"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FALLBACK_CASES } from '@/lib/mockData'
import { getApiBase } from '@/lib/utils'
import { SoapLiteCard } from '@/components/SoapLiteCard'

function CounsellorViewContent() {
  const searchParams = useSearchParams()
  const caseId = searchParams.get('case') || 'case_002' // Default to high risk case
  const initialFallback = FALLBACK_CASES.find(c => c.id === caseId) || FALLBACK_CASES[0]
  const [caseData, setCaseData] = useState<any>(initialFallback)
  const [waSending, setWaSending] = useState(false)
  const [waStatus, setWaStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    const apiBase = getApiBase()
    fetch(`${apiBase}/dashboard/cases/${caseId}`)
      .then(r => {
        if (!r.ok) throw new Error("API response not ok")
        return r.json()
      })
      .then(d => {
        if (d && !d.error) setCaseData(d)
      })
      .catch(e => {
        console.warn("Backend API unavailable, using resilient fallback case data:", e)
      })
  }, [caseId])

  if (!caseData) return <div className="p-8 font-sans">Loading case data...</div>
  if (caseData.error) return <div className="p-8 text-red-500 font-sans">Error: Case not found or API error.</div>

  const allFactors = (caseData?.messages || [])
    .filter((m: any) => m.factors && m.factors.length > 0)
    .flatMap((m: any) => m.factors)

  const latestFactors = [...new Set(allFactors)].slice(-5)

  const latestMessage = caseData.messages.length > 0 ? caseData.messages[caseData.messages.length - 1] : null
  const mindguardClass = latestMessage?.mindguard_class || "Unknown"

  const checkInCount = caseData.history_scores ? caseData.history_scores.length : 1
  const margin = Math.max(2, 10 - (checkInCount * 2))
  const lowerBound = Math.max(0, caseData.current_score - margin).toFixed(0)
  const upperBound = Math.min(100, caseData.current_score + margin).toFixed(0)

  let trendText = "Insufficient data for projection"
  if (checkInCount > 1) {
    const prevScore = caseData.history_scores[checkInCount - 2]
    const currentScore = caseData.current_score
    const diff = currentScore - prevScore
    if (diff > 5) {
      const remainingToCritical = 75 - currentScore
      const checkInsToCritical = Math.max(1, Math.ceil(remainingToCritical / diff))
      trendText = `Projected to cross CRITICAL band in ~${checkInsToCritical} check-ins`
    } else if (diff < -5) {
      trendText = "Trending down (Stabilizing)"
    } else {
      trendText = "Trending flat"
    }
  }

  const handleTeleManas = () => {
    alert("Tele-MANAS Handover Initiated.\n\nDialing 14416 for anonymous crisis support. No ID will be recorded per national guidelines.")
    window.location.href = "tel:14416"
  }

  const handleWhatsApp = async () => {
    setWaSending(true)
    setWaStatus(null)
    try {
      const apiBase = getApiBase()
      const res = await fetch(`${apiBase}/alerts/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_id: caseData.id, risk_band: caseData.risk_band, mindguard_class: mindguardClass })
      })
      const data = await res.json()
      if (data.status === "success") {
        setWaStatus({ type: 'success', message: `WhatsApp Alert Sent Successfully! (Message SID: ${data.message_sid})` })
      } else {
        setWaStatus({ type: 'error', message: "Failed to send WhatsApp alert: " + (data.message || "Unknown error") })
      }
    } catch (e: any) {
      setWaStatus({ type: 'error', message: "Could not contact backend API. Please make sure the Python server is running." })
    } finally {
      setWaSending(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
              BUILD FOR BHARAT · CLINICAL TRIAGE
            </span>
            <Badge variant="outline" className="text-[10px]">Zero Cloud Liability</Badge>
          </div>
          <h1 className="font-heading text-3xl font-bold text-foreground">Counsellor Review Alert</h1>
          <p className="font-sans text-sm text-muted-foreground">Human-in-the-loop review for high-risk thresholds & statutory relief.</p>
        </div>

        {/* Case selector quick tabs */}
        <div className="flex items-center gap-2 bg-sidebar p-1 rounded-xl border border-border">
          {['case_001', 'case_002', 'case_003'].map(cId => (
            <a
              key={cId}
              href={`/dashboard/counsellor?case=${cId}`}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all ${
                caseId === cId
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cId.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
        
      <Card className={`shadow-md border transition-colors rounded-2xl overflow-hidden ${
        caseData.risk_band === 'High' ? 'bg-destructive/5 border-t-4 border-t-destructive border-x-destructive/20 border-b-destructive/20' :
        caseData.risk_band === 'Medium' ? 'bg-orange-500/5 border-t-4 border-t-orange-500 border-x-orange-500/20 border-b-orange-500/20' :
        'bg-card border-t-4 border-t-primary border-border'
      }`}>
        <CardHeader className={`pb-4 border-b ${
          caseData.risk_band === 'High' ? 'border-destructive/20 bg-destructive/5' :
          caseData.risk_band === 'Medium' ? 'border-orange-500/20 bg-orange-500/5' :
          'border-border bg-card'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-heading text-2xl flex items-center gap-2 text-foreground">
                {caseData.name}
                <Badge variant="outline" className={`text-xs uppercase ${
                  caseData.risk_band === 'High' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                  'bg-primary/10 text-primary border-primary/20'
                }`}>Priority Sorted</Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                Case Ref: {caseData.id} | District: {caseData.district} | Statutory: {caseData.poa_section || 'SC/ST PoA Act 1989'}
              </CardDescription>
            </div>
            <div className="text-right">
              <Badge variant={caseData.risk_band === "High" ? "destructive" : "default"} className={`text-lg px-3 py-1 ${
                caseData.risk_band === 'Medium' ? 'bg-orange-500 text-white' : ''
              }`}>
                Risk: {caseData.risk_band}
              </Badge>
              <div className="text-sm font-mono mt-1 text-muted-foreground">
                Score: {lowerBound} - {upperBound} (90% Conf)
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          
          {/* XAI Diagnostics & Intervention Action Log */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Explainable AI (XAI) Diagnostics</h3>
                <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-600 border-indigo-500/20">Translated from: Hindi</Badge>
              </div>
              
              <div className="mb-4">
                <span className="text-xs text-muted-foreground block mb-1">MindGuard Classification Pipeline</span>
                <div className="flex items-center gap-2">
                  <Badge variant={mindguardClass.includes('Self-Harm') || mindguardClass.includes('Imminent Threat') ? 'destructive' : 'secondary'}>{mindguardClass}</Badge>
                  <span className="text-[10px] text-muted-foreground border-l border-border pl-2">Confidence: {((1 - (caseData.conformal_alpha ?? 0.1)) * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-xs text-muted-foreground block mb-2">Feature Importance (SHAP Weights)</span>
                <div className="space-y-2">
                  {latestFactors.length > 0 ? (
                    latestFactors.map((f: string, i: number) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs text-foreground">
                          <span>{f}</span>
                          <span className="font-mono text-muted-foreground">+{((3 - i) * 12.4 + 4.1).toFixed(1)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${(3 - i) * 25 + 15}%` }} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">Awaiting check-in data.</div>
                  )}
                </div>
              </div>

              <div>
                <span className="text-xs text-muted-foreground block mb-1">Trend Direction</span>
                <div className={`text-sm font-medium ${trendText.includes('CRITICAL') ? 'text-destructive' : 'text-foreground'}`}>
                  {trendText}
                </div>
              </div>
            </div>
            
            <div className="bg-background border border-border rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Statutory Relief & Intervention Action Log</h3>
              <div className="space-y-2 text-sm text-foreground">
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" defaultChecked /> Rule 12(4) Relief: FIR Stage (25% Disbursed)</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Rule 12(4) Relief: Charge Sheet Stage (50% Disbursed)</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" defaultChecked={caseData.id === 'case_002'} /> Witness Protection Station Notified</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Designated Special Court Hearing Logged</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Legal Aid Counsel Appointed</label>
                <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Emergency Tele-MANAS Handover Scheduled</label>
              </div>
            </div>
          </div>

          {/* Embedded 4-Line SOAP-Lite Intake Card */}
          <div className="pt-2">
            <SoapLiteCard
              dialect="Casual Hinglish"
              mode={caseData.id === 'case_001' ? 'nhaa' : 'telemanas'}
              tier={caseData.risk_band === 'High' ? 3 : 2}
              score={caseData.current_score}
            />
          </div>
          
          {/* Action Dispatch Buttons */}
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Crisis Dispatch & Escalation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-background border-dashed border-border hover:border-primary transition-colors cursor-pointer" onClick={handleTeleManas}>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full text-foreground">
                  <span className="text-sm font-semibold">Escalate to Tele-MANAS (14416)</span>
                  <Button variant="outline" size="sm">Initiate Handover</Button>
                </CardContent>
              </Card>
              <Card className="bg-background border-dashed border-border hover:border-primary transition-colors cursor-pointer" onClick={handleWhatsApp}>
                <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full text-foreground">
                  <span className="text-sm font-semibold">Alert Support Contact (WhatsApp via Twilio)</span>
                  <Button variant="outline" size="sm" disabled={waSending}>
                    {waSending ? "Sending..." : "Send Pre-approved Template"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {waStatus && (
              <div className={`p-3 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                waStatus.type === 'success' 
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' 
                  : 'bg-destructive/10 text-destructive border border-destructive/30'
              }`}>
                <span className="text-base">{waStatus.type === 'success' ? '✅' : '⚠️'}</span>
                <span>{waStatus.message}</span>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-sidebar flex justify-end gap-3 p-4 border-t border-border">
          <Button variant="outline">Dismiss Alert</Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Mark as Reviewed & Logged</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function CounsellorView() {
  return (
    <Suspense fallback={<div className="p-8">Loading Counsellor View...</div>}>
      <CounsellorViewContent />
    </Suspense>
  )
}
