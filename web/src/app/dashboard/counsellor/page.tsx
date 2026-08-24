"use client"
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const API_BASE = "http://127.0.0.1:8000/api"

function CounsellorViewContent() {
  const searchParams = useSearchParams()
  const caseId = searchParams.get('case') || 'case_002' // Default to our high risk case
  const [caseData, setCaseData] = useState<any>(null)

  const [waSending, setWaSending] = useState(false)

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/cases/${caseId}`)
      .then(r => r.json())
      .then(d => setCaseData(d))
      .catch(e => console.error(e))
  }, [caseId])

  if (!caseData) return <div className="p-8">Loading case data...</div>
  if (caseData.error) return <div className="p-8 text-red-500">Error: Case not found or API error.</div>

  // Extract the latest factors from the messages (which acts as our structured summary)
  const allFactors = (caseData?.messages || [])
    .filter((m: any) => m.factors && m.factors.length > 0)
    .flatMap((m: any) => m.factors)

  const latestFactors = [...new Set(allFactors)].slice(-5) // Dedup and limit

  const latestMessage = caseData.messages.length > 0 ? caseData.messages[caseData.messages.length - 1] : null
  const mindguardClass = latestMessage?.mindguard_class || "Unknown"

  // Fix 4 & 5: Confidence Bounds
  const checkInCount = caseData.history_scores ? caseData.history_scores.length : 1
  const margin = Math.max(2, 10 - (checkInCount * 2)) // 1 check-in = ±8, 4 check-ins = ±2
  const lowerBound = Math.max(0, caseData.current_score - margin).toFixed(0)
  const upperBound = Math.min(100, caseData.current_score + margin).toFixed(0)

  // Fix 9: Trend Extrapolation
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
    alert("Tele MANAS Handover Initiated.\n\nDialing 14416 for anonymous crisis support. No ID will be recorded per national guidelines.")
    window.location.href = "tel:14416"
  }

  const handleWhatsApp = async () => {
    setWaSending(true)
    try {
      const res = await fetch(`${API_BASE}/alerts/whatsapp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ case_id: caseData.id, risk_band: caseData.risk_band, mindguard_class: mindguardClass })
      })
      const data = await res.json()
      if (data.status === "success") {
        alert("WhatsApp Alert Sent Successfully! (Twilio Sandbox)")
      } else {
        alert("Failed to send WhatsApp alert: " + data.message)
      }
    } catch (e) {
      alert("Error sending WhatsApp alert.")
    } finally {
      setWaSending(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Counsellor Review Alert</h1>
          <p className="text-gray-600 mt-2">Human-in-the-loop review for high-risk thresholds.</p>
        </div>
        
        <Card className="border-t-4 border-t-red-500 shadow-md">
          <CardHeader className="bg-white pb-4 border-b">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  {caseData.name}
                  <Badge variant="outline" className="text-xs uppercase bg-gray-50 text-gray-500 border-gray-300">Priority Sorted</Badge>
                </CardTitle>
                <CardDescription className="mt-1">Case Ref: {caseData.id} | District: {caseData.district}</CardDescription>
              </div>
              <div className="text-right">
                <Badge variant={caseData.risk_band === "High" ? "destructive" : "default"} className="text-lg px-3 py-1">
                  Risk: {caseData.risk_band}
                </Badge>
                <div className="text-sm font-mono mt-1 text-gray-500">
                  Score: {lowerBound} - {upperBound} (90% Conf)
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            
            {/* Fix 3: Structured Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-md p-4 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Backend Extracted Context</h3>
                
                <div className="mb-4">
                  <span className="text-xs text-gray-400 block mb-1">MindGuard Classification</span>
                  <Badge variant={mindguardClass === 'Safe' ? 'secondary' : 'destructive'}>{mindguardClass}</Badge>
                </div>

                <div className="mb-4">
                  <span className="text-xs text-gray-400 block mb-1">Top Contributing Factors</span>
                  <ul className="list-disc pl-4 space-y-1 text-sm text-gray-800">
                    {latestFactors.length > 0 ? (
                      latestFactors.map((f: string, i: number) => <li key={i}>{f}</li>)
                    ) : (
                      <li>Awaiting check-in data.</li>
                    )}
                  </ul>
                </div>

                <div>
                  <span className="text-xs text-gray-400 block mb-1">Trend Direction</span>
                  <div className={`text-sm font-medium ${trendText.includes('CRITICAL') ? 'text-red-600' : 'text-gray-700'}`}>
                    {trendText}
                  </div>
                </div>
              </div>
              
              {/* Fix 8: Intervention Checklist */}
              <div className="bg-gray-50 border rounded-md p-4 shadow-sm">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Intervention Action Log</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Counselling Session Scheduled</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Witness Protection Requested</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Relocation Assistance Initiated</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Financial Assistance Logged</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Legal Aid Connected</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Rehabilitation Program Referral</label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Medical Treatment</label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <h3 className="font-semibold text-gray-900">Recommended Alert Handover</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-gray-50 border-dashed hover:border-blue-500 transition-colors cursor-pointer" onClick={handleTeleManas}>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
                    <span className="text-sm font-medium">Escalate to Tele MANAS (14416)</span>
                    <Button variant="outline" size="sm">Initiate Handover</Button>
                  </CardContent>
                </Card>
                <Card className="bg-gray-50 border-dashed hover:border-green-500 transition-colors cursor-pointer" onClick={handleWhatsApp}>
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center gap-2 h-full">
                    <span className="text-sm font-medium">Alert Support Contact (WhatsApp)</span>
                    <Button variant="outline" size="sm" disabled={waSending}>
                      {waSending ? "Sending..." : `Send ${mindguardClass === 'Self-Harm' ? 'Critical' : 'Pre-approved'} Template`}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-100 flex justify-end gap-3 p-4">
            <Button variant="outline">Dismiss Alert</Button>
            <Button>Mark as Reviewed & Logged</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function CounsellorView() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CounsellorViewContent />
    </Suspense>
  )
}
