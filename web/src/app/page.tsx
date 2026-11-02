"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, PhoneCall, Activity, Scale, Eye, Flame, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Home() {
  const [govMode, setGovMode] = useState<'telemanas' | 'nhaa'>('telemanas')

  return (
    <div className="min-h-screen bg-[#f1f5f2] dark:bg-zinc-950 flex flex-col items-center justify-start p-4 md:p-8 relative overflow-hidden">
      {/* Botanical Background (Atmospheric Design) */}
      <img alt="" aria-hidden="true" className="fixed -bottom-48 -right-24 w-[800px] max-w-none opacity-[0.12] z-0 pointer-events-none grayscale" src="https://lh3.googleusercontent.com/aida/AEtjO1XiCYoEezvi1vQeVwLJLMJh385gEORaqFKsIbP49hinIKA9gkD-iPOcnW36ZDF4oPANl7_pHKLr0EqYVyO2p0jDJe11lJmgldVnR-U4nZeIRXLBf41b39bIaHYY16NocivtwEX-0CEadApwAFgf6wU0arYDLwym8Gej-2iYUR37XqMFLUjbm0reK6pck2wTNp0KDMtbsA2wNPwAN7oHhjGfqsliNzX2RyLC9J8scsZIrAMdhmNVEhHlU7Q" />
      <div className="fixed inset-0 z-[1] pointer-events-none bg-teal-500/5 mix-blend-multiply" />
      <div className="fixed inset-0 bg-background/60 z-[1] pointer-events-none" />

      <div className="max-w-6xl w-full space-y-6 relative z-10 my-auto py-8">
        
        {/* UPGRADE 7: Mandatory 5-Step AI Value Chain Banner */}
        <div className="w-full bg-zinc-950 text-white rounded-2xl p-4 border border-zinc-800 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
                BUILD FOR BHARAT 2026 · PS 1 & PS 3 ARCHITECTURE
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 w-full lg:w-auto text-[11px]">
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2">
                <span className="text-emerald-400 font-bold block">1. Problem</span>
                <span className="text-zinc-300">40%+ Hide Distress · 14416 Reactive</span>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2">
                <span className="text-emerald-400 font-bold block">2. Local Data</span>
                <span className="text-zinc-300">ACTION_USER_PRESENT Logs (Zero-Daemon)</span>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2">
                <span className="text-emerald-400 font-bold block">3. Edge AI</span>
                <span className="text-zinc-300">&lt;5ms Crisis Router + 4-bit Gemma 4</span>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2">
                <span className="text-emerald-400 font-bold block">4. Output</span>
                <span className="text-zinc-300">Editable 4-Line SOAP-Lite Card</span>
              </div>
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-lg p-2 bg-emerald-950/40 border-emerald-500/40">
                <span className="text-emerald-300 font-bold block">5. Citizen Impact</span>
                <span className="text-emerald-100">1-Tap 14416 Handoff @ ₹0 Cloud Cost</span>
              </div>
            </div>
          </div>
        </div>

        {/* Portal Hero */}
        <div className="text-center space-y-3 pt-2">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 font-bold">
              ZERO-EGRESS VERIFIED · BUILD FOR BHARAT
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary font-heading">
            SENTINEL
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-sans max-w-3xl mx-auto leading-relaxed">
            Zero-Daemon Offline Mental Health & Statutory Crisis Triage Platform.
            Preserving Citizen Privacy via <span className="font-bold text-foreground">ARM TrustZone Hardware Enclaves</span>, <span className="font-bold text-foreground">Negation-Aware Crisis Routing (&lt;5ms)</span>, and <span className="font-bold text-foreground">Say It For Me (SOAP-Lite)</span> Helpline Handoffs.
          </p>
        </div>

        {/* UPGRADE 1: Segmented GovTech Mode Switcher */}
        <div className="flex justify-center">
          <div className="bg-card border border-border p-1.5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-2 max-w-xl w-full">
            <button
              onClick={() => setGovMode('telemanas')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                govMode === 'telemanas'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>🎓</span> Tele-MANAS (14416) Youth & Student
            </button>
            <button
              onClick={() => setGovMode('nhaa')}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                govMode === 'nhaa'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>⚖️</span> NHAA (14566) Statutory PoA Protection
            </button>
          </div>
        </div>

        {/* Verified Stats Row */}
        <div className="bg-sidebar/80 border border-border p-3.5 rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-xs">
          <div>
            <span className="text-lg font-bold font-mono text-emerald-600 dark:text-emerald-400 block">47,75,644+ Calls</span>
            <span className="text-muted-foreground">Tele-MANAS National Helpline Scale</span>
          </div>
          <div>
            <span className="text-lg font-bold font-mono text-primary block">40%+ Hide Distress</span>
            <span className="text-muted-foreground">Only 9.2% Seek Help (2026 Mpower Survey)</span>
          </div>
          <div>
            <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400 block">₹0 Cloud Liability</span>
            <span className="text-muted-foreground">100% Zero-Egress On-Device AI</span>
          </div>
        </div>
        
        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          
          {/* Card 1: Check-in Simulator */}
          <Card className="border-2 border-primary/30 hover:border-primary transition-all hover:shadow-lg rounded-2xl bg-card flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <Badge className="bg-primary text-primary-foreground text-[10px]">CENTERPIECE</Badge>
                <Activity className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-lg font-heading">Citizen Check-in & Triage</CardTitle>
              <CardDescription className="text-xs">
                Day-0 Calibration, Zero-Daemon Sensing, BiAffect Keystrokes, &lt;5ms Crisis Router, & SOAP-Lite Card.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/check-in">
                <Button className="w-full font-bold flex items-center justify-center gap-2">
                  <span>Launch Check-in Experience</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Card 2: Counsellor Alert View */}
          <Card className="hover:shadow-lg transition-all rounded-2xl bg-card flex flex-col justify-between border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="text-[10px]">XAI DIAGNOSTICS</Badge>
                <Eye className="w-4 h-4 text-indigo-600" />
              </div>
              <CardTitle className="text-lg font-heading">Counsellor Review Alert</CardTitle>
              <CardDescription className="text-xs">
                Human-in-the-loop review with SHAP factor weights, Trend Projections, and 1-Tap Twilio WhatsApp dispatch.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/dashboard/counsellor?case=case_002">
                <Button className="w-full" variant="secondary">View Case-002 Review</Button>
              </Link>
            </CardContent>
          </Card>
          
          {/* Card 3: Verifiable Security & Crypto-Shredding */}
          <Card className="border-2 border-emerald-500/30 hover:border-emerald-500 hover:shadow-lg transition-all rounded-2xl bg-card flex flex-col justify-between">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between mb-1">
                <Badge className="bg-emerald-600 text-white text-[10px]">UNBREAKABLE</Badge>
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              <CardTitle className="text-lg font-heading">Security & Crypto-Shredding</CardTitle>
              <CardDescription className="text-xs">
                Verifiable 0-byte kernel ledger & live &lt;15ms hardware key destruction demonstration.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/dashboard/security">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Test Crypto-Shredding Live
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 4: District Dashboard */}
          <Card className="hover:shadow-lg transition-all rounded-2xl bg-card flex flex-col justify-between border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">District Command Center</CardTitle>
              <CardDescription className="text-xs">
                Regional case triage, risk clusters, and jurisdictional coordination.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/dashboard/district">
                <Button className="w-full text-xs" variant="outline">Open District View</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Card 5: State & National View */}
          <Card className="hover:shadow-lg transition-all rounded-2xl bg-card flex flex-col justify-between border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">State & National Analytics</CardTitle>
              <CardDescription className="text-xs">
                Macro-level cluster heatmaps, relief disbarment, and cross-state trend extrapolation.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex gap-2">
                <Link href="/dashboard/state" className="flex-1">
                  <Button className="w-full text-xs" variant="outline">State</Button>
                </Link>
                <Link href="/dashboard/national" className="flex-1">
                  <Button className="w-full text-xs" variant="outline">National</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Card 6: Statutory Authority Log */}
          <Card className="hover:shadow-lg transition-all rounded-2xl bg-card flex flex-col justify-between border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-heading">Authority Statutory Log</CardTitle>
              <CardDescription className="text-xs">
                Rule 12(4) Relief tracking, FIR & Charge Sheet verification, and judicial compliance logs.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Link href="/dashboard/authority">
                <Button className="w-full text-xs" variant="outline">View Authority Portal</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
