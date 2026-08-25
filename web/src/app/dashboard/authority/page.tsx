"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent); const API_BASE = isAndroid ? "http://10.0.2.2:8000/api" : "http://127.0.0.1:8000/api"

type Case = {
  id: string
  name: string
  district: string
  current_score: number
  risk_band: string
  last_alert_time?: string
}

export default function AuthorityLog() {
  const [alerts, setAlerts] = useState<Case[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/cases`)
      .then(r => r.json())
      .then(d => {
        // Filter only High Risk cases as "Alerts" sent to authorities
        const highRisk = d.cases
          .filter((c: Case) => c.risk_band === 'High')
          .sort((a: Case, b: Case) => b.current_score - a.current_score)
        setAlerts(highRisk)
      })
      .catch(e => console.error(e))
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Authority Notification Log</h1>
        <p className="font-sans text-lg text-muted-foreground">Automated dispatches sent to District & State Level Officials.</p>
      </div>
      
      <Card className="bg-card border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="font-heading text-xl">Critical Dispatches</CardTitle>
            <Badge variant="outline" className="text-xs uppercase bg-destructive/10 text-destructive border-destructive/20">
              High Priority
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-heading">Dispatch ID</TableHead>
                <TableHead className="font-heading">Case Ref</TableHead>
                <TableHead className="font-heading">Jurisdiction (District)</TableHead>
                <TableHead className="font-heading">Severity Score</TableHead>
                <TableHead className="font-heading">Escalation Status</TableHead>
                <TableHead className="text-right font-heading">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No critical alerts dispatched recently.
                  </TableCell>
                </TableRow>
              )}
              {alerts.map((c, i) => (
                <TableRow key={c.id} className="border-border/50 hover:bg-accent/20">
                  <TableCell className="font-medium text-foreground">DISP-{new Date().getFullYear()}-{1000 + i}</TableCell>
                  <TableCell className="text-muted-foreground">{c.id} (Abstracted: {c.name})</TableCell>
                  <TableCell className="text-muted-foreground">{c.district}</TableCell>
                  <TableCell>
                    <span className="text-destructive font-bold">{c.current_score.toFixed(1)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                      Notified Officials
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <button className="text-primary hover:underline text-sm font-semibold">
                      Acknowledge
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
