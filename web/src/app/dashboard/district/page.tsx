"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts'

const API_BASE = "http://127.0.0.1:8000/api"

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
      
      <Card className="bg-card border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="font-heading text-xl">Abstracted Cases Overview</CardTitle>
            <Badge variant="outline" className="text-xs uppercase bg-primary/10 text-primary border-primary/20">
              Priority Sorted
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-heading">Case ID</TableHead>
                <TableHead className="font-heading">Name (Abstracted)</TableHead>
                <TableHead className="font-heading">District</TableHead>
                <TableHead className="font-heading">Current Score (0-100)</TableHead>
                <TableHead className="font-heading">Risk Band</TableHead>
                <TableHead className="font-heading">Trend (Smoothed)</TableHead>
                <TableHead className="text-right font-heading">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id} className="border-border/50 hover:bg-accent/20">
                  <TableCell className="font-medium text-foreground">{c.id}</TableCell>
                  <TableCell className="text-muted-foreground">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground">{c.district}</TableCell>
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
                  <TableCell className="text-right">
                    <a href={`/dashboard/counsellor?case=${c.id}`} className="text-primary hover:underline text-sm font-semibold">
                      View Details
                    </a>
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
