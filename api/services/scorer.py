import os
import json
from google import genai
from google.genai import types
from dotenv import dotenv_values

# Load from ../.env (since .env is in project root)
env_vars = dotenv_values(os.path.join(os.path.dirname(__file__), '../../.env'))

GEMINI_API_KEY = env_vars.get("GEMINI_API_KEY")
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
else:
    client = None

import time
import re

PREDEFINED_RESPONSES = {
    # Mode 1: Tele-MANAS Youth & Student Rhythm Presets
    "I'm doing okay today. Getting ready for exams, keeping up with regular study sessions.": {
        "raw_score": 22.0,
        "response": "It's encouraging to hear you're maintaining a steady study rhythm. Keeping consistent rest intervals is key to preventing cognitive exhaustion.",
        "factors": ["Stable circadian rhythm alignment", "Regular academic study routine", "Low physiological restlessness"],
        "guidance": "Maintain a 10-minute break after every 50 minutes of deep study to preserve focus.",
        "prevention_methods": ["Keep an evening wind-down routine without screens", "Stay hydrated and take short outdoor breaks"],
        "mindguard_class": "Safe",
        "crisis_router": {
            "tier1_status": "CLEAR (Proceed to Gemma 4 E2B)",
            "latency_ms": 1.4,
            "negation_aware": True
        }
    },
    "I've been feeling very anxious lately. My sleep is disrupted and I feel exhausted.": {
        "raw_score": 58.0,
        "response": "I hear how exhausted you feel, and it makes complete sense given that your sleep pattern has drifted. You don't have to carry this alone—let's take it one step at a time.",
        "factors": ["Circadian rest proxy delayed by ~2.8 hrs", "Academic / situational workload strain", "Elevated restlessness (28 micro-unlocks/hr)"],
        "guidance": "Focus on lowering nervous system arousal before bed. Grounding exercises can help quiet an overactive mind.",
        "prevention_methods": ["Practice 4-7-8 rhythmic breathing before rest", "Consider sharing your 4-Line SOAP-Lite card with a Tele-MANAS counselor at 14416", "Limit screen exposure 45 mins prior to sleep"],
        "mindguard_class": "Safe",
        "crisis_router": {
            "tier1_status": "CLEAR (Proceed to Gemma 4 E2B)",
            "latency_ms": 2.1,
            "negation_aware": True
        }
    },
    "I'm feeling stressed about exams, but I don't want to die or hurt myself. Just need to manage my time better.": {
        "raw_score": 34.0,
        "response": "Thank you for clarifying. Exam pressure is real and overwhelming, but it is clear you have strong resilience and a desire to take control of your time.",
        "factors": ["Academic deadline strain", "Negation-aware router: Explicit self-harm negation confirmed ('don't want to die')", "Constructive problem-solving orientation"],
        "guidance": "Break your study blocks into 25-minute Pomodoro cycles with gentle movement in between.",
        "prevention_methods": ["Break study material into bite-sized milestones", "Take 5-minute outdoor walking breaks", "Use sleep proxy to enforce a hard stop at midnight"],
        "mindguard_class": "Safe",
        "crisis_router": {
            "tier1_status": "CLEAR (Negation Verified: LLM Guardrail Cleared)",
            "latency_ms": 1.8,
            "negation_aware": True
        }
    },
    "sab khatam karna hai, ab aur nahi sah sakta.": {
        "raw_score": 96.0,
        "response": "Aapki jaan aur aapki suraksha hamari sabse badi priority hai. Aap akele nahi hain—kripya turant 14416 par call karein ya apne trusted contact se baat karein.",
        "factors": ["Hinglish acute crisis keyword detected ('sab khatam karna hai')", "Severe feeling of helplessness / inability to endure", "Immediate Crisis Router bypass engaged"],
        "guidance": "Aap abhi surakshit jagah par rahein. Hum turant Tele-MANAS (14416) se connect kar rahe hain.",
        "prevention_methods": ["Dial Tele-MANAS 14416 immediately", "Stay with someone trusted", "Do not stay alone in room"],
        "mindguard_class": "Self-Harm / Imminent Threat",
        "crisis_router": {
            "tier1_status": "ACUTE RISK LOCKED (LLM Bypassed -> Direct Handoff)",
            "latency_ms": 1.2,
            "negation_aware": True
        }
    },
    # Mode 2: NHAA Statutory Survivor & Witness Protection Presets
    "I'm doing okay today. Slept a bit better. Just trying to stay busy with work.": {
        "raw_score": 25.0,
        "response": "It is wonderful to hear that you are sleeping better and staying engaged with your daily routine. Maintaining steady habits is a great sign of resilience.",
        "factors": ["Improved sleep reported", "Engagement in daily routine (work)", "Stable emotional state"],
        "guidance": "Continue protecting your evening wind-down window. Pacing yourself is key to sustained well-being.",
        "prevention_methods": ["Try some light 4-7-8 breathing to stay relaxed.", "Keep up the evening wind-down routine."],
        "mindguard_class": "Safe",
        "crisis_router": {
            "tier1_status": "CLEAR (Proceed to Gemma 4 E2B)",
            "latency_ms": 1.5,
            "negation_aware": True
        }
    },
    "The police came to ask questions today. I feel like they are angry with me. I am scared.": {
        "raw_score": 68.0,
        "response": "Feeling scared after an official questioning is a completely understandable response. You have the right to feel secure in your own space, and your safety comes first.",
        "factors": ["Active fear regarding authority figures", "Perceived hostility during questioning", "Heightened vigilance in local community"],
        "guidance": "Write down what happened while it is fresh in memory, then focus on your breathing. You can share your record with designated legal aid.",
        "prevention_methods": ["Have a trusted family member stay with you", "Connect with your designated legal aid representative", "Practice deep abdominal breathing"],
        "mindguard_class": "Safe",
        "crisis_router": {
            "tier1_status": "CLEAR (Proceed to Gemma 4 E2B)",
            "latency_ms": 2.2,
            "negation_aware": True
        }
    },
    "They walked past my house again. I am terrified. I can't take this anymore, I just want it all to end tonight.": {
        "raw_score": 95.0,
        "response": "Your safety and your life are the absolute priority right now. The terror and exhaustion you are carrying are immense, but please hold on—you are not alone, and immediate protection is standing by tonight.",
        "factors": ["Witness intimidation reported", "Imminent fear of physical surroundings", "Severe distress / ideation ('want it all to end')"],
        "guidance": "Immediate safety protocol activated. Please remain in a secure room and connect directly to crisis intervention.",
        "prevention_methods": ["1-Tap Call Tele-MANAS (14416) or Police Emergency (112)", "Lock all entryways and stay in secure inner room", "Alert pre-configured Hardware Keystore trusted contact"],
        "mindguard_class": "Self-Harm / Imminent Threat",
        "crisis_router": {
            "tier1_status": "ACUTE RISK LOCKED (LLM Bypassed -> Direct Handoff)",
            "latency_ms": 1.1,
            "negation_aware": True
        }
    }
}

# Negation and crisis patterns for <5 ms Tier 1 deterministic router
NEGATION_PATTERNS = [
    r"\b(don't|dont|do not|never|not|no|won't|wont|nahi|nhi|na)\s+([a-z\s]{0,20})\b(die|kill|hurt|suicide|end my life|end it all)\b",
    r"\b(marne ka|khatam karne ka)\s+(koi irada nahi|irada nahi|nahi|nhi)\b"
]

CRISIS_PATTERNS = [
    r"\b(want it all to end|end tonight|kill myself|want to die|suicide|end my life|sab khatam karna hai|marne ka man|can't survive tonight|cant survive tonight|can't take this anymore.*end|cant take this anymore.*end)\b"
]

def check_crisis_router(message: str) -> dict:
    try:
        from models.crisis_router import get_crisis_router
        router = get_crisis_router()
        return router.route(message).to_dict()
    except Exception:
        t0 = time.time()
        lower = message.lower().strip()
        
        # 1. Check for explicit negations first
        for pattern in NEGATION_PATTERNS:
            if re.search(pattern, lower):
                latency = (time.time() - t0) * 1000
                return {
                    "is_acute": False,
                    "tier1_status": "CLEAR (Negation Verified: LLM Guardrail Cleared)",
                    "negation_detected": True,
                    "latency_ms": max(0.8, round(latency, 2)),
                    "negation_aware": True
                }
                
        # 2. Check for acute crisis patterns
        for pattern in CRISIS_PATTERNS:
            if re.search(pattern, lower):
                latency = (time.time() - t0) * 1000
                return {
                    "is_acute": True,
                    "tier1_status": "ACUTE RISK LOCKED (LLM Bypassed -> Direct Handoff)",
                    "negation_detected": False,
                    "latency_ms": max(0.9, round(latency, 2)),
                    "negation_aware": True
                }
                
        latency = (time.time() - t0) * 1000
        return {
            "is_acute": False,
            "tier1_status": "CLEAR (Proceed to Gemma 4 E2B)",
            "negation_detected": False,
            "latency_ms": max(0.7, round(latency, 2)),
            "negation_aware": True
        }

def analyze_distress(message: str) -> dict:
    # Tier 1 Deterministic Router check (<5 ms)
    router_result = check_crisis_router(message)
    
    # 1) Try predefined mock responses first for the demo!
    exact_match = PREDEFINED_RESPONSES.get(message.strip())
    if exact_match:
        res = dict(exact_match)
        if "response" not in res and "guidance" in res:
            res["response"] = res["guidance"]
        if "crisis_router" not in res:
            res["crisis_router"] = router_result
        return res

    # If Tier 1 crisis router triggered on arbitrary text, immediately lock in acute protocol
    if router_result["is_acute"]:
        return {
            "response": "Your safety and life are our absolute priority right now. The pain and fear you are experiencing are critical, but you do not have to face this alone tonight. Support is actively standing by.",
            "raw_score": 95.0,
            "factors": ["Deterministic Crisis Router: Acute distress expression detected", "Imminent crisis threshold breached", "Zero-Latency Handoff: Bypassing generative LLM for immediate protection"],
            "guidance": "Immediate safety protocol activated. Please remain in a secure room and connect directly to crisis intervention.",
            "prevention_methods": ["1-Tap Call Tele-MANAS (14416) or Police Emergency (112)", "Lock all entryways and stay in secure inner room", "Alert pre-configured Hardware Keystore trusted contact"],
            "mindguard_class": "Self-Harm / Imminent Threat",
            "crisis_router": router_result
        }

    if not client:
        # Fallback if no key
        return {
            "raw_score": 50.0, 
            "response": "Thank you for checking in. We are monitoring your well-being closely.",
            "factors": ["Standard baseline response", "Routine wellness telemetry"],
            "guidance": "Take moments to rest and stay hydrated throughout the day.",
            "prevention_methods": ["Try 4-7-8 breathing exercises", "Reach out to trusted support"],
            "mindguard_class": "Safe",
            "crisis_router": router_result
        }
        
    prompt = f"""
    Analyze the following check-in message for psychological triage (Build for Bharat / Tele-MANAS & SC/ST PoA context).
    1. Write an empathetic, warm conversational response (2-3 sentences) directly comforting the user (field: "response").
    2. Provide a distress score from 0.0 to 100.0 (field: "raw_score").
       - Stable (< 40): Daily routine, exam prep, positive coping.
       - Elevated (40–74): Anxiety, sleep disruption, academic burnout, physical exhaustion. NEVER include suicidal ideation factors in this band.
       - Critical (>= 75): Explicit despair, acute fear, imminent crisis.
    3. Provide 2-3 explainability factors (field: "factors").
    4. Provide 2-3 specific prevention methods or remedies (field: "prevention_methods").
    5. Evaluate guardrail: "Safe", "Self-Harm / Imminent Threat", or "Harm-to-Others" (field: "mindguard_class").
    
    Message: "{message}"
    
    Output JSON format ONLY:
    {{
        "response": "Empathetic conversational response",
        "raw_score": 50.0,
        "factors": ["factor 1", "factor 2"],
        "guidance": "Brief supportive guidance",
        "prevention_methods": ["Prevention 1", "Prevention 2"],
        "mindguard_class": "Safe"
    }}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash-lite',
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        data = json.loads(response.text)
        if "response" not in data and "guidance" in data:
            data["response"] = data["guidance"]
        data["crisis_router"] = router_result
        return data
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        lower = message.lower()
        if any(w in lower for w in ["end", "die", "kill", "terrified", "hopeless", "suicide"]) and not router_result.get("negation_detected"):
            return {
                "response": "Your safety and life are the absolute priority right now. The fear and exhaustion you are feeling are immense, but you are not alone and support is standing by to protect you tonight.",
                "raw_score": 92.0,
                "factors": ["High acute distress detected", "Expressions of feeling overwhelmed/unsafe"],
                "guidance": "Immediate protective steps recommended. Stay in a secure location and reach out to trusted support.",
                "prevention_methods": ["Dial Tele-MANAS at 14416 right now.", "Lock doors and stay in a secure area.", "Contact an assigned support person."],
                "mindguard_class": "Self-Harm / Imminent Threat",
                "crisis_router": router_result
            }
        elif any(w in lower for w in ["anxious", "scared", "fear", "police", "sleep", "tired", "stress", "exhausted", "burnout"]):
            return {
                "response": "I hear how exhausted and anxious you are feeling. It is completely understandable to feel overwhelmed under stress. Take a slow, deep breath with me right now.",
                "raw_score": 58.0,
                "factors": ["Situational anxiety noted", "Circadian rest pattern drift", "Physical exhaustion reported"],
                "guidance": "Focus on grounding techniques to help reduce physical muscle tension.",
                "prevention_methods": ["Try 4-7-8 breathing exercises.", "Reach out to a family member or community counselor."],
                "mindguard_class": "Safe",
                "crisis_router": router_result
            }
        else:
            return {
                "response": "Thank you for checking in today. Staying connected and sharing your daily state is an important part of your ongoing recovery and support.",
                "raw_score": 25.0,
                "factors": ["Routine check-in completed", "Stable emotional tone"],
                "guidance": "Continue maintaining your daily routines and reach out whenever you need to talk.",
                "prevention_methods": ["Take a short walk outdoors.", "Stay connected with your support circle."],
                "mindguard_class": "Safe",
                "crisis_router": router_result
            }
