# 📝 SENTINEL V4: Master Prompt Repository & Clinical Guardrails
> **Complete Chronicle of System Prompts, Clinical Templates & Development Prompts**  
> *From Inception Commit 0 (`c6e1aec`) to Latest Commit 31 (`0a9cbd1`)*

---

## 📌 Table of Contents
1. [Genesis & Inception Prompts (Commit 0 — `prompt.txt`)](#1-genesis--inception-prompts-commit-0--prompttxt)
2. [Clinical Distillation & MindGuard Prompts (`gemma_mindguard.py`)](#2-clinical-distillation--mindguard-prompts-gemma_mindguardpy)
3. ['Say It For Me' 4-Line SOAP-Lite Synthesizer Prompts (`soap_synthesizer.py`)](#3-say-it-for-me-4-line-soap-lite-synthesizer-prompts-soap_synthesizerpy)
4. [Statutory & Legal Compliance Prompts (SC/ST PoA Rule 12(4) & DPDPA)](#4-statutory--legal-compliance-prompts-scst-poa-rule-124--dpdpa)
5. [Development & Hackathon Iteration Prompts (Commits 1 to 31)](#5-development--hackathon-iteration-prompts-commits-1-to-31)
   - [Prompt 1: 4-Step Offline Architecture & UI/UX Audit](#prompt-1-4-step-offline-architecture--uiux-audit-commit-12-ff5f204)
   - [Prompt 2: The Academic Data Provenance Pipeline](#prompt-2-the-academic-data-provenance-pipeline-commit-16-6841277)
   - [Prompt 3: The 4-Minute Professional Pitch Video Script](#prompt-3-the-4-minute-professional-pitch-video-script)
   - [Prompt 4: The 80% Python Language Share & Pure ML Engine Overhaul](#prompt-4-the-80-python-language-share--pure-ml-engine-overhaul-commit-23-ecdc94d)
   - [Prompt 5: The "Fix HTML Dominance" & GitHub Linguist Configuration](#prompt-5-the-fix-html-dominance--github-linguist-configuration-commits-28-31)
6. [Operational Guidelines for Prompting Sentinel AI](#6-operational-guidelines-for-prompting-sentinel-ai)

---

## 1. Genesis & Inception Prompts (Commit 0 — `prompt.txt`)

In Commit 0 (`c6e1aec`), the project began with a comprehensive prompt transcript exploring the viability of translating the user's Sentinel V1–V4 academic research papers into a competitive hackathon software platform:

### 1.1 The Original Academic Evaluation Prompt
```prompt
evaluate this research paper , do its fact check literature check and everything , is it can be formed in real word scenarios ? can it be published ?, is it a good work? suggest changes if needed , do all u can do .
```

### 1.2 The ProMind-LLM & Sword Health MindGuard Integration Prompt
```prompt
CAN I USE MINDGUARD FOR MY RESEARCH BY USING I MEAN INTEGRATE THAT SYSTEM IN MY SYSTEM?
I can convert the data gathered from different parameters in such a descriptive way so that it can be ingested by sword healths mind guard and can be used to set a parameter for output and a parameter for RAG as it is only and majorly based on conversations. can i do this , is this inline with research?
```

### 1.3 The SIH & Build for Bharat Hackathon Statement Prompt
```prompt
this is a different competition this is SIH 2026 and i have to qualify the internal round for this and my sentinel is inline with my progress , i have told u what problem says and i cant add every feature but i can make dashboards for authorities and do the upper upper front end work and the major functionality:

AI-based Dynamic Mental Health Monitoring and Distress Prediction System that continuously monitors and predicts psychological distress among victims and complainants registered through NHAA (14566), the Integrated Portal, chatbot, mobile application, IVRS, or other approved communication channels throughout the investigation, trial, rehabilitation, and compensation process.

- Conduct periodic interactions with victims through chatbot, IVRS calls, SMS, mobile applications, web portal, or helpline follow-up mechanisms.
- Analyse voice, text, behavioural responses, and engagement patterns using NLP, Sentiment Analysis, and Emotion AI.
- Generate a Dynamic Distress Score and longitudinal trend analysis.
- Predict escalation of psychological distress before a crisis situation emerges.
- Trigger alerts to counsellors, district authorities, and designated officials when predefined risk thresholds are crossed.
- Recommend appropriate interventions such as counselling, medical treatment, witness protection, relocation support, financial assistance, legal aid, or rehabilitation measures.
- Provide dashboards at district, State, and national levels for monitoring vulnerable victims and high-risk cases.
- Ensure explainable AI, privacy protection, data security, and compliance with applicable legal and ethical standards.

Beneficiaries receiving relief, compensation, rehabilitation, and protection under the provisions of the Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989.

also add impo features from my sentinel-research paper that added value to research paper like telemanas and in the feature of adding number of friend a message is being delivered to a friend ,also make this feature using twilio api that message is being directed through whatsapp.
also add voice feature using rime. make it the best.
```

---

## 2. Clinical Distillation & MindGuard Prompts (`gemma_mindguard.py`)

Located in [`models/gemma_mindguard.py`](models/gemma_mindguard.py), this prompt runs on edge hardware using constrained decoding to enforce strict JSON structure:

### 2.1 The System Prompt for Clinical Extraction
```text
You are Gemma MindGuard, an offline edge clinical intelligence assistant supporting India's Tele-MANAS (14416) helpline and National Statutory Relief authorities.
Your role is to analyze citizen check-in text, passive behavioral telemetry, and typing dynamics to produce structured, objective clinical diagnostic indicators.

CLINICAL SAFETY MANDATES:
1. You NEVER diagnose clinical disorders. You extract objective symptom indicators mapped to standard clinical psychometrics (PHQ-9 and GAD-7).
2. You must cleanly recognize and respect SAFE NEGATIONS (e.g. "I am feeling overwhelmed with exams, but I do NOT want to die"). Never flag safe negations as acute self-harm crises.
3. You must flag acute self-harm language immediately for Tier 3 escalation.
4. You must extract statutory distress triggers under the SC/ST (Prevention of Atrocities) Act 1989 (intimidation, social boycott, institutional harassment) to alert District Authorities.
5. You must output ONLY a valid, single JSON object adhering strictly to the schema provided. Do NOT output markdown formatting, preamble, or conversational commentary.
```

### 2.2 Constrained JSON Schema Prompt
```json
{
  "crisis_level": "CLEAR | BORDERLINE | ELEVATED | ACUTE",
  "negation_detected": true,
  "phq9_indicators": [
    "Item 1: Anhedonia",
    "Item 3: Sleep disruption",
    "Item 4: Fatigue / Low energy",
    "Item 8: Psychomotor retardation / hesitation"
  ],
  "gad7_indicators": [
    "Item 1: Excessive worrying",
    "Item 4: Trouble relaxing"
  ],
  "statutory_relief_flag": false,
  "statutory_relief_reason": null,
  "recommended_tier": 1,
  "clinical_summary": "Short clinical rationale under 30 words"
}
```

---

## 3. 'Say It For Me' 4-Line SOAP-Lite Synthesizer Prompts (`soap_synthesizer.py`)

Located in [`models/soap_synthesizer.py`](models/soap_synthesizer.py), this engine translates complex multi-modal telemetry and user messages into an instantly scannable 4-line S-O-A-P handover card for helpline counsellors across 4 Indian dialects:

### 3.1 Casual Hinglish Prompt Template
```python
# Casual Hinglish Synthesizer
Subjective = "Exam aur workload ki wajah se kaafi overwhelmed aur exhausted feel ho raha hai."
Objective = f"Sleep pattern ~{drift_hours:.1f} hrs drift hua hai; nocturnal micro-unlocks elevated ({primary_factors})."
Assessment = f"Sentinel Score {score:.0f}/100 — {risk_tier_label}."
Plan = "14416 counsellor se connect karke calm grounding support aur study pacing lena."

# Live TTS Voice Script (for Floating Call Overlay)
SpeechTTS = f"Hello counsellor, main bohot overwhelmed feel kar raha hoon. Mera sleep pattern {drift_hours:.1f} ghante drift hua hai. Sentinel distress score {score:.0f} hai. Please mujhe calm down hone mein help karein."
```

### 3.2 Shuddh Hindi (Formal) Prompt Template
```python
# Formal Hindi Synthesizer
Subjective = "अत्यधिक मानसिक तनाव, अनिद्रा और निरंतर थकान का अनुभव हो रहा है।"
Objective = f"निद्रा चक्र में {drift_hours:.1f} घंटे का विचलन; रात्रि में स्क्रीन का अत्यधिक उपयोग ({primary_factors})।"
Assessment = f"सेंटिनल संकट सूचकांक {score:.0f}/100 — {risk_tier_label}।"
Plan = "टेली-मानस (14416) परामर्शदाता से तुरंत मार्गदर्शन और भावनात्मक स्थिरता प्राप्त करना।"

SpeechTTS = f"नमस्ते परामर्शदाता, मैं पिछले कुछ दिनों से अत्यधिक तनाव में हूँ। मेरा स्लीप साइकिल {drift_hours:.1f} घंटे बिगड़ गया है। सेंटिनल डिस्ट्रेस स्कोर {score:.0f} है। कृपया मेरी सहायता करें।"
```

### 3.3 Academic English Prompt Template
```python
# Academic English Synthesizer
Subjective = "Citizen reports acute cognitive exhaustion and severe academic/workload anxiety."
Objective = f"Circadian disruption with {drift_hours:.1f}h diurnal sleep drift and elevated nocturnal micro-unlocks ({primary_factors})."
Assessment = f"Sentinel Index {score:.0f}/100 — {risk_tier_label}."
Plan = "Direct Tele-MANAS (14416) intake, grounding protocol, and longitudinal workload pacing."

SpeechTTS = f"Hello counsellor, I am experiencing severe stress and burnout. My sleep drift is {drift_hours:.1f} hours, and my Sentinel distress index is {score:.0f}. I would appreciate clinical grounding guidance."
```

### 3.4 Tamil Dialect Prompt Template
```python
# Tamil Dialect Synthesizer
Subjective = "வேலை மற்றும் தேர்வு காரணமாக அதிக மன உளைச்சல் மற்றும் தூக்கமின்மை ஏற்படுகிறது."
Objective = f"தூக்க அட்டவணை {drift_hours:.1f} மணி நேரம் மாறியுள்ளது; இரவு நேர மொபைல் பயன்பாடு அதிகரித்துள்ளது ({primary_factors})."
Assessment = f"சென்டினல் மன அழுத்த மதிப்பீடு {score:.0f}/100 — {risk_tier_label}."
Plan = "14416 மனநல ஆலோசகருடன் தொடர்பு கொண்டு வழிகாட்டுதல் மற்றும் அமைதி பயிற்சிகளைப் பெறுதல்."

SpeechTTS = f"வணக்கம் ஆலோசகர், எனக்கு மன அழுத்தம் அதிகமாக உள்ளது. எனது தூக்கம் {drift_hours:.1f} மணி நேரம் பாதிக்கப்பட்டுள்ளது. எனது சென்டினல் மதிப்பெண் {score:.0f}. தயவுசெய்து எனக்கு உதவுங்கள்."
```

---

## 4. Statutory & Legal Compliance Prompts (SC/ST PoA Rule 12(4) & DPDPA)

### 4.1 SC/ST (Prevention of Atrocities) Act 1989 Mandatory Relief Prompt
```text
Evaluate user check-in narrative for statutory atrocity triggers:
- Social Boycott / Excommunication
- Denial of Access to Public Resources / Water / Roads
- Physical Intimidation / Coercion / Threat to Life
- Caste-based Slurs / Public Humiliation
- Sexual Assault / Arson / Grievous Hurt

IF DETECTED:
1. Mark statutory_relief_flag = TRUE.
2. Formulate immediate PoA Rule 12(4) statutory recommendation:
   "Victim eligible for immediate statutory 25% interim relief under PoA Rule 12(4) within 7 days. Recommend urgent transmission to District Magistrate (DM) and Sub-Divisional Magistrate (SDM) for witness protection and compensation escrow."
```

### 4.2 DPDPA 2023 §12 Right to Erasure (Hardware Crypto-Shredding)
```text
CRITICAL PRIVACY DIRECTIVE:
Under India's Digital Personal Data Protection Act (DPDPA 2023 §12):
When the citizen triggers "Erase My Data" / Crypto-Shredder:
- Execute ZERO-RECOVERY hardware-backed key destruction in Android Keystore.
- Do NOT perform soft deletion or database row flagging.
- Immediately overwrite local RAM buffers with cryptographically random noise.
- Confirm eradication with a zero-knowledge confirmation token: "DPDPA-2023-ERASED-AES256GCM".
```

---

## 5. Development & Hackathon Iteration Prompts (Commits 1 to 31)

### Prompt 1: 4-Step Offline Architecture & UI/UX Audit (Commit 12 — `ff5f204`)
```prompt
You are working inside our "SENTINEL" full-stack repository (web/ Next.js + Capacitor 8 Android app and api/ Python FastAPI backend) at the "Build for Bharat 2026" Hackathon (Track 1: Software — PS 1: Reimagine Government Digital Services UX & PS 3: AI for Citizen Impact).

Your mission is to upgrade our existing prototype (web/ and api/) to integrate our final 4-Step Offline Triage Architecture ("Day-0 Rhythm Calibration -> Zero-Daemon Passive Sensing & False-Alarm Budget -> <5ms Deterministic Crisis Router + Constrained Gemma 4 E2B -> 'Say It For Me' 4-Line SOAP-Lite Intake Card with Floating Call Overlay & Live TTS") alongside our Sentinel V4 research paper math and existing Command Center dashboards, without breaking any existing routes, Twilio WhatsApp alerts, or the Capacitor Android build.

STEP 1: WORKSPACE AUDIT & CRITICAL BUG FIXES (DO THIS FIRST)
Inspect api/ and web/. Fix any route breakages, styling inconsistencies, or unhandled errors.

STEP 2: EMBED SENTINEL V4 RESEARCH PAPER & ZERO-DAEMON SENSING ARCHITECTURE
1. Day-0 Rhythm Calibration (30 seconds): Add quick baseline anchors (Standard Collegiate, STEM Night-Owl, Shift Worker, Early Morning).
2. Zero-Daemon Passive Sensing & False-Alarm Budget: Passive OS telemetry (diurnal sleep drift, nocturnal screen micro-unlocks, typing kinematics).
3. <5ms Deterministic Crisis Router & Gemma 4 E2B: Regex-based crisis routing + local LLM fallback for safe negations.
4. "Say It For Me" 4-Line SOAP-Lite Intake Card: Floating in-call overlay with TTS and 1-tap dialer for Tele-MANAS (14416).
```

### Prompt 2: The Academic Data Provenance Pipeline (Commit 16 — `6841277`)
```prompt
You are working inside our "SENTINEL" full-stack repository. We are competing live at "Build for Bharat 2026" (PS 3: AI for Citizen Impact).

The judges gave critical feedback:
1. "Implementation is too weak / mock-heavy."
2. "Data issues: Where does user data come from? Is it Kaggle, synthetic, or metadata? How is it validated?"

Your mission is to upgrade our backend (api/) and frontend (web/) to make the data pipeline and implementation bulletproof, academic-grade, and fully demonstrable on stage without any weak mocks.

STEP 1: IMPLEMENT THE "ACADEMIC & OS TELEMETRY DATA PIPELINE" (api/services/data_pipeline.py)
Create or update backend service module api/services/data_pipeline.py:
1. The Dartmouth StudentLife & Synthetic Calibration Dataset Loader: Normalized statistical distributions derived from Dartmouth StudentLife study (n=48) and 24 clinical case archetypes.
2. OS Telemetry Feature Ingestion & Normalization: Zero-daemon passive feature vector computation.
3. Sentinel V4 Algorithm 1 — Deterministic Sensor Fusion & Split-Conformal Prediction:
   - Isolation Forest Anomaly Score (s_IF).
   - Rolling Baseline Z-score (s_z).
   - Sensor Disagreement Gate.
   - 70/30 Diurnal Smoothing.
   - Split-Conformal 90% Prediction Range [y - 7.5, y + 7.5].

STEP 2: AUDIT & EXPLAINABILITY COMPONENT (DataProvenanceInspector.tsx)
Build an interactive UI component allowing judges to inspect data origins, feature standardizations, and mathematical proofs in real-time.
```

### Prompt 3: The 4-Minute Professional Pitch Video Script
```prompt
i have to make a video for this project so give me a 4min script explaining every feature and professional
```
*(Resulted in the comprehensive, timestamped 4-minute demonstration script covering The Bharat Problem, Day-0 Calibration, Passive Zero-Daemon Telemetry, Negation Routing, Algorithm 1 Math, and the 90-second Tele-MANAS SOAP-Lite handover).*

### Prompt 4: The 80% Python Language Share & Pure ML Engine Overhaul (Commit 23 — `ecdc94d`)
```prompt
add python code that does the actual working of models so that python language share goes to 80% and add a github readme file that tells the reader how to run this program in their systems
```

### Prompt 5: The "Fix HTML Dominance" & GitHub Linguist Configuration (Commits 28–31)
```prompt
the thing is that major of my code is just html and script a judge will not evaluate as Ai project are build on python so fix this issue
```
*(Resulted in comprehensive `.gitattributes` vendoring of all UI wireframes, standalone `app.py` on port 7860, 4 Jupyter research notebooks, and simulated Linguist Python share of **99.1%**).*

---

## 6. Operational Guidelines for Prompting Sentinel AI

When interacting with or querying the Sentinel AI Engine:

1. **Test Safe Negations Directly:**
   - Input: `"I am stressed about exams, but I don't want to die."`
   - Expected Output: `is_acute = False`, `negation_detected = True`, `tier1_status = "CLEAR"`, `latency < 0.1ms`.
2. **Test Multi-Dialect Crisis Handover:**
   - Input: `"sab khatam karna hai tonight, cannot take it anymore"`
   - Expected Output: `is_acute = True`, `tier1_status = "ACUTE RISK LOCKED"`, `route = "CRISIS_HOTLINE"`.
3. **Verify Conformal Prediction Intervals:**
   - For any distress score $y \in [0, 100]$, verify that the interval is reported as $[y - 7.50, y + 7.50]$ with an empirical coverage guarantee of $\ge 90.0\%$.
4. **Zero Cloud Telemetry Directive:**
   - Never pass raw sensor streams or keystrokes to external LLM APIs. Only anonymized, aggregated Z-scores may be passed to local edge models.
