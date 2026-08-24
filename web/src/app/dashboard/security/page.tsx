import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function SecurityCompliance() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Security & Compliance</h1>
        <p className="font-sans text-lg text-muted-foreground">Architectural privacy protections and data security standards.</p>
      </div>

      <Card className="bg-card border border-border/50 rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-primary">Data Protection Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-foreground">
          
          <div>
            <h3 className="font-bold text-lg mb-2">Encryption at Rest</h3>
            <p className="text-muted-foreground leading-relaxed">
              All on-device synthetic conversation records and abstracted PII are secured using <strong>SQLCipher</strong> with <strong>AES-256 encryption</strong>. The master database keys are never transmitted over the network and are bound exclusively to the device's secure enclave (Ref: Research Paper, Section 3.4).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Hardware-Backed Key Storage</h3>
            <p className="text-muted-foreground leading-relaxed">
              Encryption keys are generated and stored inside the <strong>Android Keystore System</strong> utilizing a dedicated <strong>StrongBox</strong> secure element where available. This guarantees protection against key extraction even on compromised or rooted devices (Ref: Research Paper, Section 5.1).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Zero-Knowledge Design Principle</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Sentinel backend processes alerts strictly on non-reversible abstracted tokens. The routing layer has zero knowledge of the actual underlying conversational content. Complete decryption only occurs locally on authorized devices belonging to designated authorities or counselors (Ref: Research Paper, Section 5.1).
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
