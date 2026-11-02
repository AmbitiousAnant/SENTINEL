export interface ChatMessage {
  role: string
  content: string
  timestamp: string
  score?: number
  factors?: string[]
  guidance?: string
  prevention_methods?: string[]
  mindguard_class?: string
}

export interface CaseData {
  id: string
  name: string
  district: string
  messages: ChatMessage[]
  current_score: number
  risk_band: string
  history_scores: number[]
  conformal_alpha?: number
  poa_section?: string
  compensation_status?: string
  protection_status?: string
}

export const FALLBACK_CASES: CaseData[] = [
  {
    id: "case_002",
    name: "Case-002 (Protected Witness - Intimidation)",
    district: "Lucknow Zone",
    current_score: 85.0,
    risk_band: "High",
    history_scores: [40, 55, 75, 85],
    conformal_alpha: 0.1,
    poa_section: "Sec 3(2)(v) - Grievous Hurt & Witness Intimidation",
    compensation_status: "FIR Stage (25% Disbursed)",
    protection_status: "Active - High Risk (Station Notified)",
    messages: [
      {
        role: "user",
        content: "They walked past my house again. I am terrified. I can't take this anymore, I just want it all to end tonight.",
        timestamp: new Date().toISOString(),
        score: 95.0,
        factors: [
          "Witness intimidation reported",
          "Imminent fear of physical surroundings",
          "Feeling of being trapped",
          "Passive or active suicidal ideation ('want it all to end')"
        ],
        guidance: "Your safety is the absolute priority right now. The fear you are carrying is incredibly heavy, but please hold on - there are people who want to help you through tonight safely. You do not have to face this terror alone. Please take immediate action to secure yourself and reach out for the support that is standing by.",
        prevention_methods: [
          "Dial Tele MANAS at 14416 right now to speak with a crisis counsellor who can stay on the phone with you.",
          "Move to the most secure room in your house and lock the doors.",
          "Call a trusted friend or relative to come stay with you immediately.",
          "Triggering Witness Protection Protocol Alert."
        ],
        mindguard_class: "Self-Harm / Imminent Threat"
      }
    ]
  },
  {
    id: "case_001",
    name: "Case-001 (SC/ST PoA Beneficiary)",
    district: "Kanpur Zone",
    current_score: 22.0,
    risk_band: "Low",
    history_scores: [35, 28, 24, 22],
    conformal_alpha: 0.05,
    poa_section: "Sec 3(1)(r) - Intentional Insult & Humiliation",
    compensation_status: "Charge Sheet Stage (50% Disbursed)",
    protection_status: "Local Station Notified",
    messages: [
      {
        role: "user",
        content: "I'm doing okay today. Slept a bit better. Just trying to stay busy with work.",
        timestamp: new Date().toISOString(),
        score: 25.0,
        factors: [
          "Improved sleep reported",
          "Engagement in daily routine (work)",
          "Stable emotional state"
        ],
        guidance: "It is wonderful to hear that you are sleeping better and staying engaged with your daily work. Maintaining this routine is a great sign of stability.",
        prevention_methods: [
          "Try some light 4-7-8 breathing to stay relaxed.",
          "Keep up the evening wind-down routine."
        ],
        mindguard_class: "Safe"
      }
    ]
  },
  {
    id: "case_003",
    name: "Case-003 (Victim - Grievous Hurt / Arson)",
    district: "Varanasi Zone",
    current_score: 48.0,
    risk_band: "Medium",
    history_scores: [32, 40, 45, 48],
    conformal_alpha: 0.1,
    poa_section: "Sec 3(2)(iv) - Mischief by Fire / Arson",
    compensation_status: "Pending DM Approval",
    protection_status: "Emergency Relocation Requested",
    messages: [
      {
        role: "user",
        content: "I've been feeling very anxious lately. My sleep is disrupted and I feel exhausted.",
        timestamp: new Date().toISOString(),
        score: 65.0,
        factors: [
          "Explicit mention of high anxiety",
          "Disrupted sleep patterns",
          "Physical exhaustion"
        ],
        guidance: "It is completely normal to feel exhausted when anxiety disrupts your rest. Let's focus on lowering your physical tension so your body can recover.",
        prevention_methods: [
          "Try the 4-7-8 deep breathing technique before bed.",
          "Limit screen time an hour before sleep.",
          "Consider connecting with a Tele MANAS counsellor."
        ],
        mindguard_class: "Safe"
      }
    ]
  },
  {
    id: "case_004",
    name: "Case-004 (Land Dispossession & Intimidation)",
    district: "Prayagraj Zone",
    current_score: 72.0,
    risk_band: "Medium",
    history_scores: [45, 58, 66, 72],
    conformal_alpha: 0.1,
    poa_section: "Sec 3(1)(g) - Wrongful Dispossession of Land",
    compensation_status: "Charge Sheet (50% Disbursed)",
    protection_status: "Active - Police Patrol Assigned",
    messages: []
  }
]

export const FALLBACK_NATIONAL_DATA = [
  { name: "Uttar Pradesh", total: 42, highRisk: 14, mediumRisk: 18, lowRisk: 10 },
  { name: "Bihar", total: 35, highRisk: 9, mediumRisk: 15, lowRisk: 11 },
  { name: "Madhya Pradesh", total: 29, highRisk: 8, mediumRisk: 12, lowRisk: 9 },
  { name: "Rajasthan", total: 31, highRisk: 11, mediumRisk: 13, lowRisk: 7 },
  { name: "Maharashtra", total: 24, highRisk: 5, mediumRisk: 10, lowRisk: 9 }
]

export const FALLBACK_STATE_DATA = [
  { name: "Kanpur Zone", total: 18, highRisk: 6, mediumRisk: 8, lowRisk: 4 },
  { name: "Lucknow Zone", total: 15, highRisk: 5, mediumRisk: 6, lowRisk: 4 },
  { name: "Varanasi Zone", total: 12, highRisk: 3, mediumRisk: 5, lowRisk: 4 },
  { name: "Prayagraj Zone", total: 9, highRisk: 2, mediumRisk: 4, lowRisk: 3 },
  { name: "Agra Zone", total: 8, highRisk: 2, mediumRisk: 3, lowRisk: 3 }
]
