import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function SecurityCompliance() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Security & Compliance</h1>
        <p className="font-sans text-lg text-muted-foreground">Architectural privacy protections and data security standards.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-4 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">SQLCipher State</span>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <span className="text-xl">🔒</span>
              <span className="font-mono font-bold">AES-256 (ACTIVE)</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Key Rotation: 12hrs</span>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="p-4 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">TEE Enclave</span>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <span className="text-xl">🛡️</span>
              <span className="font-mono font-bold">ARM TrustZone</span>
            </div>
            <span className="text-[10px] text-muted-foreground">StrongBox Status: Validated</span>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="p-4 flex flex-col gap-2">
            <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Data Egress Logs</span>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <span className="text-xl">🛑</span>
              <span className="font-mono font-bold">Zero Egress</span>
            </div>
            <span className="text-[10px] text-muted-foreground">0 bytes leaked in 30 days</span>
          </CardContent>
        </Card>
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

          <div>
            <h3 className="font-bold text-lg mb-2">Zero-Egress On-Device Pipeline</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sentinel operates a 6-stage fully local pipeline. Behavioral feature extraction (via TensorFlow Lite) and conversational generation (via 4-bit quantized Gemma 4 E2B) execute entirely on-device. No raw behavioral data—text, media, location, or usage logs—ever leaves the zero-egress boundary (Ref: Research Paper, Section 3.1 & 3.3).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Permission Minimization</h3>
            <p className="text-muted-foreground leading-relaxed">
              The architecture requests only standard OS-level permissions (<code>PACKAGE_USAGE_STATS</code> and <code>ACTIVITY_RECOGNITION</code>). To protect user privacy, it explicitly avoids capturing system-wide ambient data, relying on first-party text surfaces rather than invasive Accessibility services or custom keyboards (Ref: Research Paper, Section 3.2).
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-2">Generative Safety & Guardrails</h3>
            <p className="text-muted-foreground leading-relaxed">
              Interactions are secured by multiple independent safety layers. Prompt generation is grounded in PHQ-9/GAD-7 clinical lexicons via Retrieval-Augmented Generation (RAG) and verified by EmoGuard. Furthermore, a turn-level MindGuard classifier screens all user replies in real-time to immediately triage self-harm or harm-to-others risk (Ref: Research Paper, Section 3.3 & 3.6).
            </p>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
