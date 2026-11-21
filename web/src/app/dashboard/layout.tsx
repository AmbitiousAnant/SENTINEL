"use client"
import React from 'react'
import { TopNav } from '@/components/TopNav'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="bg-[#F6F4EE] dark:bg-zinc-950 text-[#0F2E27] dark:text-zinc-100 font-sans antialiased min-h-screen flex flex-col transition-colors">
      <TopNav currentPath={pathname} />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>

      <footer className="border-t border-[#E2E8E4] dark:border-zinc-800 py-4 text-center text-xs text-[#5B6A64] dark:text-zinc-500">
        <p>SENTINEL V4 · Tele-MANAS (14416) Command Center · Zero Cloud Liability</p>
      </footer>
    </div>
  )
}
