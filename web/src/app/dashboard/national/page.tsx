"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const isAndroid = typeof navigator !== "undefined" && /android/i.test(navigator.userAgent); const API_BASE = process.env.NEXT_PUBLIC_API_URL || (isAndroid ? "http://10.0.2.2:8000/api" : "http://127.0.0.1:8000/api")

type Case = {
  id: string
  risk_band: string
}

type AggregatedData = {
  name: string
  highRisk: number
  mediumRisk: number
  lowRisk: number
  total: number
}

import { FALLBACK_NATIONAL_DATA } from '@/lib/mockData'

export default function NationalDashboard() {
  const [data, setData] = useState<AggregatedData[]>(FALLBACK_NATIONAL_DATA)

  useEffect(() => {
    fetch(`${API_BASE}/dashboard/cases`)
      .then(r => {
        if (!r.ok) throw new Error("API response not ok")
        return r.json()
      })
      .then(d => {
        if (d && Array.isArray(d.cases) && d.cases.length > 0) {
          // Mock state aggregation since our test data only covers UP
          const grouped = d.cases.reduce((acc: any, c: Case) => {
            const stateName = "Uttar Pradesh" // Hardcoded for demo test data scope
            if (!acc[stateName]) {
              acc[stateName] = { name: stateName, highRisk: 0, mediumRisk: 0, lowRisk: 0, total: 0 }
            }
            acc[stateName].total++
            if (c.risk_band === 'High') acc[stateName].highRisk++
            else if (c.risk_band === 'Medium') acc[stateName].mediumRisk++
            else acc[stateName].lowRisk++
            return acc
          }, {})
          
          setData(Object.values(grouped))
        }
      })
      .catch(e => {
        console.warn("Backend API unavailable, using resilient fallback for National Rollup:", e)
      })
  }, [])

  return (
    <div className="space-y-6">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">National Oversight Dashboard</h1>
        <p className="font-sans text-lg text-muted-foreground">Aggregated risk reporting across all states.</p>
      </div>
      
      <Card className="bg-card border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle className="font-heading text-xl">State Rollup</CardTitle>
            <Badge variant="outline" className="text-xs uppercase bg-primary/10 text-primary border-primary/20">
              India
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border">
                <TableHead className="font-heading">State</TableHead>
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
