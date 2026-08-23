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

  const latestFactors = [...new Set(allFactors)] // Dedup

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
        body: JSON.stringify({ case_id: caseData.id, risk_band: caseData.risk_band })
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Counsellor Review Alert</h1>
          <p className="text-gray-600 mt-2">Human-in-the-loop review for high-risk thresholds.</p>
        </div>
        
        <Card className="border-l-4 border-l-red-500 shadow-md">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{caseData.name}</CardTitle>
                <CardDescription>Case Ref: {caseData.id} | District: {caseData.district}</CardDescription>
              </div>
              <Badge variant="destructive" className="text-sm px-3 py-1">
                Risk: {caseData.risk_band} ({caseData.current_score.toFixed(1)})
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-md">
              <h3 className="font-semibold text-orange-900 mb-2">Automated Structured Summary (No Raw Transcripts)</h3>
              <p className="text-sm text-orange-800 mb-4">
                The SENTINEL system has identified a concerning trend over the last 3 check-ins. The following factors were extracted from the victim's responses:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-orange-900">
                {latestFactors.length > 0 ? (
                  latestFactors.map((f: string, i: number) => <li key={i}>{f}</li>)
                ) : (
                  <li>High risk baseline established, waiting for recent check-in analysis.</li>
                )}
              </ul>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Recommended Actions (P1 Features Enabled)</h3>
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
                      {waSending ? "Sending..." : "Send Pre-approved Template"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-100 flex justify-end gap-3">
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
