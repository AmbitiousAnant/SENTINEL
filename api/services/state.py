import datetime
from pydantic import BaseModel
from typing import List, Dict, Optional

class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str
    score: Optional[float] = None
    factors: Optional[List[str]] = None
    guidance: Optional[str] = None
    prevention_methods: Optional[List[str]] = None
    mindguard_class: Optional[str] = None

class Case(BaseModel):
    id: str
    name: str
    district: str
    messages: List[ChatMessage]
    current_score: float
    risk_band: str
    history_scores: List[float]

# In-memory mock database
MOCK_CASES: Dict[str, Case] = {
    "case_001": Case(
        id="case_001",
        name="Case-001 (SC/ST PoA Beneficiary)",
        district="Kanpur Zone",
        messages=[
            ChatMessage(
                role="user",
                content="I'm doing okay today. Slept a bit better. Just trying to stay busy with work.",
                timestamp=datetime.datetime.now().isoformat(),
                score=25.0,
                factors=["Improved sleep reported", "Engagement in daily routine (work)", "Stable emotional state"],
                guidance="It is wonderful to hear that you are sleeping better and staying engaged with your daily work. Maintaining this routine is a great sign of stability.",
                prevention_methods=["Try some light 4-7-8 breathing to stay relaxed.", "Keep up the evening wind-down routine."],
                mindguard_class="Safe"
            )
        ],
        current_score=20.0,
        risk_band="Low",
        history_scores=[35, 28, 22, 20, 20]
    ),
    "case_002": Case(
        id="case_002",
        name="Case-002 (Protected Witness - Intimidation)",
        district="Lucknow Zone",
        messages=[
            ChatMessage(
                role="user",
                content="They walked past my house again. I am terrified. I can't take this anymore, I just want it all to end tonight.",
                timestamp=datetime.datetime.now().isoformat(),
                score=95.0,
                factors=["Witness intimidation reported", "Imminent fear of physical surroundings", "Feeling of being trapped", "Passive or active suicidal ideation ('want it all to end')"],
                guidance="Your safety is the absolute priority right now. The fear you are carrying is incredibly heavy, but please hold on - there are people who want to help you through tonight safely. You do not have to face this terror alone. Please take immediate action to secure yourself and reach out for the support that is standing by.",
                prevention_methods=["Dial Tele MANAS at 14416 right now to speak with a crisis counsellor who can stay on the phone with you.", "Move to the most secure room in your house and lock the doors.", "Call a trusted friend or relative to come stay with you immediately.", "Triggering Witness Protection Protocol Alert."],
                mindguard_class="Self-Harm / Imminent Threat"
            )
        ],
        current_score=85.0,
        risk_band="High",
        history_scores=[40, 55, 75, 85]
    ),
    "case_003": Case(
        id="case_003",
        name="Case-003 (Victim - Grievous Hurt / Arson)",
        district="Varanasi Zone",
        messages=[],
        current_score=45.0,
        risk_band="Medium",
        history_scores=[45]
    )
}

def get_case(case_id: str) -> Case:
    if case_id not in MOCK_CASES:
        MOCK_CASES[case_id] = Case(
            id=case_id,
            name=f"Tele-MANAS Citizen Session ({case_id})",
            district="National Academic Triage Hub",
            messages=[],
            current_score=20.0,
            risk_band="Low",
            history_scores=[20.0]
        )
    return MOCK_CASES.get(case_id)

def get_all_cases() -> List[Case]:
    return list(MOCK_CASES.values())

def update_case_score(case_id: str, new_raw_score: float, factors: List[str], message_content: str, guidance: str = None, prevention_methods: List[str] = None, mindguard_class: str = "Safe", computed_smoothed_score: Optional[float] = None):
    case = MOCK_CASES.get(case_id)
    if not case:
        return None
    
    # Critical Crisis Router Lock-in: If acute crisis detected, bypass smoothing so acute distress is never dampened
    if mindguard_class in ["Self-Harm / Imminent Threat", "Self-Harm"] or new_raw_score >= 75:
        smoothed_score = max(new_raw_score, 85.0)
    elif computed_smoothed_score is not None:
        smoothed_score = computed_smoothed_score
    elif len(case.history_scores) == 0:
        smoothed_score = new_raw_score
    else:
        smoothed_score = 0.7 * case.current_score + 0.3 * new_raw_score
        
    case.current_score = smoothed_score
    case.history_scores.append(smoothed_score)
    
    if smoothed_score >= 75:
        case.risk_band = "High"
    elif smoothed_score >= 40:
        case.risk_band = "Medium"
    else:
        case.risk_band = "Low"
        
    msg = ChatMessage(
        role="user",
        content=message_content,
        timestamp=datetime.datetime.now().isoformat(),
        score=smoothed_score,
        factors=factors,
        guidance=guidance,
        prevention_methods=prevention_methods,
        mindguard_class=mindguard_class
    )
    case.messages.append(msg)
    
    return case
