"use client"
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">SENTINEL Platform</h1>
          <p className="text-lg text-gray-600">AI-based dynamic mental health monitoring for atrocity victims (SC/ST PoA Act)</p>
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
