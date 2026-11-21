"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { Activity, ShieldCheck, UserCheck, Menu, X, Sparkles } from 'lucide-react'

interface TopNavProps {
  currentPath?: string
}

export function TopNav({ currentPath = '/check-in' }: TopNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    {
      label: 'Live Check-In',
      href: '/check-in',
      badge: 'DEMO',
      icon: Activity,
      description: 'Primary Edge Triage'
    },
    {
      label: 'Counsellor Handover',
      href: '/dashboard/counsellor',
      badge: 'XAI',
      icon: UserCheck,
      description: 'Tele-MANAS & Escalation'
    },
    {
      label: 'Privacy & Benchmarks',
      href: '/dashboard/security',
      badge: '0-EGRESS',
      icon: ShieldCheck,
      description: 'Crypto-Shredder & Proof'
    }
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F6F4EE]/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-[#E2E8E4] dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Engine Status */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#0F2E27] dark:bg-emerald-500 text-white dark:text-zinc-950 font-heading font-extrabold text-base flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg tracking-tight text-[#0F2E27] dark:text-white leading-none">
                SENTINEL
              </span>
              <span className="text-[10px] font-mono text-[#5B6A64] dark:text-zinc-400 font-semibold tracking-wider uppercase mt-0.5">
                Tele-MANAS 14416
              </span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-[#E2E8E4] dark:border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-400">
              Edge Engine Ready
            </span>
          </div>
        </div>

        {/* 3 Primary Navigation Items */}
        <nav className="hidden md:flex items-center gap-1 bg-white/70 dark:bg-zinc-900/80 p-1 rounded-xl border border-[#E2E8E4] dark:border-zinc-800 shadow-xs">
          {navItems.map((item) => {
            const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0F2E27] text-white shadow-xs dark:bg-emerald-500 dark:text-zinc-950'
                    : 'text-[#5B6A64] dark:text-zinc-400 hover:text-[#0F2E27] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300 dark:text-zinc-950' : 'text-[#5B6A64] dark:text-zinc-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold uppercase ${
                    isActive 
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-950' 
                      : 'bg-[#E2E8E4] text-[#5B6A64] dark:bg-zinc-800 dark:text-zinc-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right CTA / Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/check-in"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-[#0F2E27] text-white hover:bg-[#1A453B] dark:bg-emerald-500 dark:text-zinc-950 dark:hover:bg-emerald-400 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 dark:text-zinc-950" />
            <span>Judge Live Demo</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#0F2E27] dark:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8E4] dark:border-zinc-800 bg-[#F6F4EE] dark:bg-zinc-950 px-4 pt-3 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E2E8E4] dark:border-zinc-800 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-emerald-800 dark:text-emerald-400">Edge Engine Ready (Netlify Offline Standalone)</span>
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.href || (item.href !== '/' && currentPath.startsWith(item.href))
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-[#0F2E27] text-white dark:bg-emerald-500 dark:text-zinc-950'
                      : 'text-[#5B6A64] dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-bold">
                    {item.badge}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
  )
}
