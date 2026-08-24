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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">District Dashboard</h1>
          <Badge variant="outline" className="text-sm">Kanpur Zone</Badge>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <CardTitle>Abstracted Cases Overview</CardTitle>
              <Badge variant="outline" className="text-xs uppercase bg-indigo-50 text-indigo-700 border-indigo-200">
                Priority Sorted
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Name (Abstracted)</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Current Score (0-100)</TableHead>
                  <TableHead>Risk Band</TableHead>
                  <TableHead>Trend (Smoothed)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.id}</TableCell>
                    <TableCell>{c.name}</TableCell>
                    <TableCell>{c.district}</TableCell>
                    <TableCell>
                      {c.current_score.toFixed(1)}
                      <span className="text-xs text-gray-500 ml-1">+/- 4.2</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={c.risk_band === 'High' ? 'destructive' : c.risk_band === 'Medium' ? 'default' : 'secondary'}>
                        {c.risk_band}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Sparkline data={c.history_scores} />
                    </TableCell>
                    <TableCell className="text-right">
                      <a href={`/dashboard/counsellor?case=${c.id}`} className="text-blue-600 hover:underline text-sm">
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
    </div>
  )
}
