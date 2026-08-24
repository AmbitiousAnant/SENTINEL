"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const API_BASE = "http://127.0.0.1:8000/api"

type Case = {
  id: string
  district: string
  risk_band: string
}

type AggregatedData = {
  name: string // district name
  highRisk: number
  mediumRisk: number
  lowRisk: number
  total: number
}

export default function StateDashboard() {
  const [data, setData] = useState<AggregatedData[]>([])

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/cases`)
      .then(r => r.json())
      .then(d => {
        const grouped = d.cases.reduce((acc: any, c: Case) => {
          if (!acc[c.district]) {
            acc[c.district] = { name: c.district, highRisk: 0, mediumRisk: 0, lowRisk: 0, total: 0 }
          }
          acc[c.district].total++
          if (c.risk_band === 'High') acc[c.district].highRisk++
          else if (c.risk_band === 'Medium') acc[c.district].mediumRisk++
          else acc[c.district].lowRisk++
          return acc
        }, {})
        
        setData(Object.values(grouped))
      })
      .catch(e => console.error(e))
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">State Authority Dashboard</h1>
        <p className="font-sans text-lg text-muted-foreground">Aggregated risk reporting across all districts.</p>
      </div>
      
      <Card className="bg-card border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="font-heading text-xl">District Rollup</CardTitle>
            <Badge variant="outline" className="text-xs uppercase bg-primary/10 text-primary border-primary/20">
              Uttar Pradesh
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-heading">District</TableHead>
                <TableHead className="font-heading text-right">Total Monitored</TableHead>
                <TableHead className="font-heading text-right">High Risk</TableHead>
                <TableHead className="font-heading text-right">Medium Risk</TableHead>
                <TableHead className="font-heading text-right">Low Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.name} className="border-border/50 hover:bg-accent/20">
                  <TableCell className="font-medium text-foreground">{row.name}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.total}</TableCell>
                  <TableCell className="text-right">
                    {row.highRisk > 0 ? (
                      <span className="text-destructive font-bold">{row.highRisk}</span>
                    ) : <span className="text-muted-foreground">0</span>}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.mediumRisk}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{row.lowRisk}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
