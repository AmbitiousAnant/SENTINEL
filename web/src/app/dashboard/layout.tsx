"use client"
import React from 'react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground font-sans antialiased min-h-screen flex flex-col md:flex-row">
      {/* TopAppBar (Mobile & Desktop Header Area) */}
      <header className="fixed top-0 right-0 w-full md:w-[calc(100%-280px)] z-40 bg-background/80 backdrop-blur-md shadow-sm dark:shadow-none flex justify-between items-center h-16 px-5 md:px-10">
        <div className="flex items-center gap-4">
          <span className="font-heading text-2xl font-bold text-primary md:hidden">Sentinel</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-muted-foreground hover:bg-accent/20 rounded-full transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm">
            AD
          </div>
        </div>
      </header>
      
      {/* SideNavBar (Desktop) */}
      <nav className="fixed left-0 top-0 h-full w-[280px] hidden md:flex flex-col border-r border-border bg-sidebar z-50">
        <div className="flex flex-col h-full py-10">
          {/* Brand */}
          <div className="px-6 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-primary-foreground font-heading font-bold text-lg">S</div>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight text-primary">SENTINEL</h1>
              <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Quiet Intelligence</p>
            </div>
          </div>
          {/* Tabs */}
          <ul className="flex-1 space-y-1 mt-4">
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent/30 transition-colors border-l-4 border-transparent" href="/dashboard/national">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                <span>National View</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent/30 transition-colors border-l-4 border-transparent" href="/dashboard/state">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                <span>State View</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent/30 transition-colors border-l-4 border-transparent" href="/dashboard/district">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                <span>District View</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent/30 transition-colors border-l-4 border-transparent" href="/dashboard/counsellor?case=case_002">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>Counsellor View</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent/30 transition-colors border-l-4 border-transparent" href="/dashboard/authority">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Authority Log</span>
              </a>
            </li>
            <li className="mt-8">
              <a className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:bg-accent/30 transition-colors border-l-4 border-transparent" href="/dashboard/security">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span>Security & Compliance</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-[280px] pt-24 px-5 md:px-10 pb-24 md:pb-8 w-full max-w-[1440px] mx-auto">
        {children}
      </main>
    </div>
  )
}
