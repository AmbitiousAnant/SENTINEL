"use client"
import React from 'react'
import Link from 'next/link'
import { TopNav } from '@/components/TopNav'
import { ArrowRight, ShieldCheck, Activity, PhoneCall, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F6F4EE] dark:bg-zinc-950 text-[#0F2E27] dark:text-zinc-100 flex flex-col font-sans transition-colors">
      <TopNav currentPath="/" />

      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 sm:py-16 max-w-5xl mx-auto w-full">
        
        {/* Hero Section */}
        <div className="w-full text-center space-y-6">
          
          {/* Subtle GovTech Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2E27]/5 dark:bg-emerald-500/10 border border-[#0F2E27]/10 dark:border-emerald-500/20 text-[#0F2E27] dark:text-emerald-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Build for Bharat 2026 · PS 1 & PS 3 GovTech Architecture</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading max-w-4xl mx-auto leading-[1.15]">
            Bringing Tele-MANAS (14416) to the user—<span className="text-[#0D9488] dark:text-emerald-400">before a silent spiral becomes a crisis.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#5B6A64] dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Zero-daemon passive rhythm monitoring and sub-millisecond crisis triage operating 100% on-device. Zero background battery drain. Zero cloud surveillance liability.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/check-in"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F2E27] dark:bg-emerald-500 text-white dark:text-zinc-950 font-bold text-sm hover:bg-[#1A453B] dark:hover:bg-emerald-400 transition-all shadow-md group"
            >
              <Sparkles className="w-4 h-4 text-emerald-300 dark:text-zinc-950" />
              <span>Start Live Demo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/dashboard/security"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white dark:bg-zinc-900 text-[#0F2E27] dark:text-white border border-[#E2E8E4] dark:border-zinc-800 font-semibold text-sm hover:bg-[#F6F4EE] dark:hover:bg-zinc-800 transition-colors shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Inspect Privacy & Benchmarks</span>
            </Link>
          </div>

          {/* 3 Compact Stat Callouts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto">
            <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-2xl border border-[#E2E8E4] dark:border-zinc-800 shadow-xs text-center">
              <span className="text-2xl font-mono font-extrabold text-[#0F2E27] dark:text-white block">
                4.77M+
              </span>
              <span className="text-xs font-semibold text-[#5B6A64] dark:text-zinc-400 block mt-0.5">
                Reactive Calls Handled
              </span>
              <span className="text-[10px] text-muted-foreground block mt-1">
                Tele-MANAS national scale
              </span>
            </div>

            <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-2xl border border-[#E2E8E4] dark:border-zinc-800 shadow-xs text-center">
              <span className="text-2xl font-mono font-extrabold text-[#D97706] block">
                63%
              </span>
              <span className="text-xs font-semibold text-[#5B6A64] dark:text-zinc-400 block mt-0.5">
                Youth Non-Disclosure
              </span>
              <span className="text-[10px] text-muted-foreground block mt-1">
                Stigma prevents early help
              </span>
            </div>

            <div className="bg-white dark:bg-zinc-900/90 p-4 rounded-2xl border border-[#E2E8E4] dark:border-zinc-800 shadow-xs text-center">
              <span className="text-2xl font-mono font-extrabold text-[#0D9488] dark:text-emerald-400 block">
                0.05 ms
              </span>
              <span className="text-xs font-semibold text-[#5B6A64] dark:text-zinc-400 block mt-0.5">
                Crisis Router Latency
              </span>
              <span className="text-[10px] text-muted-foreground block mt-1">
                100% Negation accuracy
              </span>
            </div>
          </div>

          {/* 3 Fast Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-left max-w-4xl mx-auto">
            <Link
              href="/check-in"
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-[#E2E8E4] dark:border-zinc-800 hover:border-[#0F2E27] dark:hover:border-emerald-500 transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">PRIMARY DEMO</span>
                <Activity className="w-4 h-4 text-[#0D9488]" />
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0F2E27] dark:text-white group-hover:text-[#0D9488] transition-colors">
                Live Check-In Experience →
              </h3>
              <p className="text-xs text-[#5B6A64] dark:text-zinc-400 mt-1 leading-relaxed">
                Emotion Avatar, 90% Conformal signal graph, live BiAffect keystrokes, and 4-line SOAP-Lite synthesis.
              </p>
            </Link>

            <Link
              href="/dashboard/counsellor"
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-[#E2E8E4] dark:border-zinc-800 hover:border-[#0F2E27] dark:hover:border-emerald-500 transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-700 dark:text-blue-400">CLINICAL XAI</span>
                <PhoneCall className="w-4 h-4 text-blue-600" />
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0F2E27] dark:text-white group-hover:text-[#0D9488] transition-colors">
                Counsellor Handover →
              </h3>
              <p className="text-xs text-[#5B6A64] dark:text-zinc-400 mt-1 leading-relaxed">
                Horizontal SHAP feature attribution, longitudinal trend projection, and 1-tap Tele-MANAS/WhatsApp handoff.
              </p>
            </Link>

            <Link
              href="/dashboard/security"
              className="p-4 rounded-2xl bg-white dark:bg-zinc-900/60 border border-[#E2E8E4] dark:border-zinc-800 hover:border-[#0F2E27] dark:hover:border-emerald-500 transition-all shadow-xs group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-400">DPDP ACT §12</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <h3 className="font-heading font-bold text-sm text-[#0F2E27] dark:text-white group-hover:text-[#0D9488] transition-colors">
                Privacy & Benchmarks →
              </h3>
              <p className="text-xs text-[#5B6A64] dark:text-zinc-400 mt-1 leading-relaxed">
                Dual-source provenance, Dartmouth StudentLife (n=48) ground truth, and &lt;15ms hardware crypto-shredding.
              </p>
            </Link>
          </div>

        </div>
      </main>

      {/* Clean hairline footer */}
      <footer className="border-t border-[#E2E8E4] dark:border-zinc-800 py-4 text-center text-xs text-[#5B6A64] dark:text-zinc-500">
        <p>SENTINEL V4 · Built for Bharat 2026 · Ministry of Health & Family Welfare (Tele-MANAS) Alignment</p>
      </footer>
    </div>
  )
}
