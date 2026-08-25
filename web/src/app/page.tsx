"use client"
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f1f5f2] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Botanical Background (Atmospheric Design) */}
      <img alt="" aria-hidden="true" className="absolute -bottom-48 -right-24 w-[800px] max-w-none opacity-[0.15] z-0 pointer-events-none grayscale" src="https://lh3.googleusercontent.com/aida/AEtjO1XiCYoEezvi1vQeVwLJLMJh385gEORaqFKsIbP49hinIKA9gkD-iPOcnW36ZDF4oPANl7_pHKLr0EqYVyO2p0jDJe11lJmgldVnR-U4nZeIRXLBf41b39bIaHYY16NocivtwEX-0CEadApwAFgf6wU0arYDLwym8Gej-2iYUR37XqMFLUjbm0reK6pck2wTNp0KDMtbsA2wNPwAN7oHhjGfqsliNzX2RyLC9J8scsZIrAMdhmNVEhHlU7Q" />
      <div className="absolute inset-0 z-[1] pointer-events-none bg-teal-500/5 mix-blend-multiply"></div>
      <div className="absolute inset-0 bg-background/60 z-[1] pointer-events-none"></div>

      <div className="max-w-4xl w-full space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-primary font-heading">Sentinel</h1>
          <p className="text-lg text-muted-foreground font-sans max-w-2xl mx-auto">AI-based dynamic mental health monitoring for atrocity victims (SC/ST PoA Act)</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Victim Check-in</CardTitle>
              <CardDescription>Simulated victim interface</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/check-in">
                <Button className="w-full">Start Chat Demo</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>District Dashboard</CardTitle>
              <CardDescription>View all synthetic cases & trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/district">
                <Button className="w-full" variant="outline">View Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Counsellor View</CardTitle>
              <CardDescription>Threshold alerts requiring review</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/counsellor">
                <Button className="w-full" variant="secondary">View Alerts</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
