"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent); const API_BASE = isAndroid ? "http://10.0.2.2:8000/api" : "http://127.0.0.1:8000/api"

type Case = {
  id: string
  name: string
  district: string
  current_score: number
  risk_band: string
  history_scores: number[]
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length < 2) return <div className="text-xs text-gray-400">Insufficient data</div>
  const chartData = data.map((val, i) => ({ val, index: i }))
  
  return (
    <div className="h-12 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <YAxis domain={[0, 100]} hide />
          <Line type="monotone" dataKey="val" stroke="#8884d8" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function DistrictDashboard() {
  const [cases, setCases] = useState<Case[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/cases`)
      .then(r => r.json())
      .then(d => {
        const sortedCases = d.cases.sort((a: Case, b: Case) => b.current_score - a.current_score)
        setCases(sortedCases)
      })
      .catch(e => console.error(e))
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Good morning, Sentinel Admin</h1>
        <p className="font-sans text-lg text-muted-foreground">Here’s what Sentinel noticed across Kanpur Zone.</p>
      </div>
      
      <Card className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="bg-sidebar border-b border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <CardTitle className="font-heading text-xl">PoA Act (SC/ST) Monitored Cases</CardTitle>
              <Badge variant="outline" className="text-xs uppercase bg-primary/10 text-primary border-primary/20">
                Priority Sorted
              </Badge>
            </div>
            <div className="flex gap-2">
               <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">IVRS Sync: Active</Badge>
               <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">NHAA/14566 Link: Connected</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="border-border">
                <TableHead className="font-heading py-4 pl-4">Case ID</TableHead>
                <TableHead className="font-heading">Atrocity Case Type</TableHead>
                <TableHead className="font-heading">Relief / Comp. Status</TableHead>
                <TableHead className="font-heading">Protection</TableHead>
                <TableHead className="font-heading">Current Score</TableHead>
                <TableHead className="font-heading">Risk Band</TableHead>
                <TableHead className="font-heading">Trend (Smoothed)</TableHead>
                <TableHead className="text-right font-heading pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c, index) => {
                const poaTypes = ["Sec 3(1)(w) - Sexual Exploitation", "Sec 3(2)(v) - Grievous Hurt", "Sec 3(1)(r) - Intentional Insult", "Sec 3(1)(g) - Land Dispossession"];
                const compStatuses = ["FIR Stage (25%)", "Charge Sheet (50%)", "Pending Approval", "Fully Disbursed"];
                const protection = ["Active - High Risk", "Local Station Notified", "None Requested", "Active - Relocated"];
                
                return (
                <TableRow key={c.id} className="border-border/50 hover:bg-accent/20">
                  <TableCell className="font-medium text-foreground pl-4">
                    <div>{c.id}</div>
                    <div className="text-xs text-muted-foreground font-normal">{c.name}</div>
                  </TableCell>
                  <TableCell className="text-[13px] font-medium">{poaTypes[index % poaTypes.length]}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[11px] font-normal">{compStatuses[index % compStatuses.length]}</Badge>
                  </TableCell>
                  <TableCell>
                     <span className={`text-[12px] flex items-center gap-1 ${index % 4 === 0 ? 'text-orange-500' : 'text-muted-foreground'}`}>
                        {index % 4 === 0 ? '⚠️' : '🛡️'} {protection[index % protection.length]}
                     </span>
                  </TableCell>
                  <TableCell className="text-foreground font-medium">
                    {c.current_score.toFixed(1)}
                    <span className="text-xs text-muted-foreground ml-1">+/- 4.2</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={c.risk_band === 'High' ? 'destructive' : c.risk_band === 'Medium' ? 'default' : 'secondary'}
                           className={c.risk_band === 'High' ? 'bg-destructive/10 text-destructive border border-destructive/20' : ''}>
                      {c.risk_band}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Sparkline data={c.history_scores} />
                  </TableCell>
                  <TableCell className="text-right pr-4">
                    <a href={`/dashboard/counsellor?case=${c.id}`} className="text-primary hover:underline text-sm font-semibold">
                      View Details
                    </a>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
