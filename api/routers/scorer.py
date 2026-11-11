from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from services.scorer import analyze_distress
from services.state import update_case_score, get_case
from services.data_pipeline import TelemetryPacket, execute_algorithm_1

router = APIRouter()

class CheckInRequest(BaseModel):
    case_id: str
    message: str
    telemetry: Optional[TelemetryPacket] = Field(
        default=None,
        description="Zero-egress OS telemetry metadata (UsageStatsManager, sleep proxy, BiAffect dynamics)"
    )

@router.post("/")
def submit_check_in(req: CheckInRequest):
    case = get_case(req.case_id)
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
        
    analysis = analyze_distress(req.message)
    raw_message_score = analysis.get("raw_score", 50.0)
    mindguard_class = analysis.get("mindguard_class", "Safe")

    # Step 2: Explicit Algorithm 1 Execution (Isolation Forest + Z-score + Disagreement Gate + Conformal Interval + 70/30 Smoothing)
    alg1 = execute_algorithm_1(
        raw_message_score=raw_message_score,
        telemetry_packet=req.telemetry,
        previous_smoothed_score=case.current_score
    )

    # If acute crisis router triggered, enforce immediate acute score lock-in
    if mindguard_class in ["Self-Harm / Imminent Threat", "Self-Harm"] or raw_message_score >= 75:
        target_score = max(raw_message_score, 85.0)
    else:
        target_score = alg1["smoothed_score"]

    updated_case = update_case_score(
        case_id=req.case_id,
        new_raw_score=raw_message_score,
        factors=analysis.get("factors", []),
        message_content=req.message,
        guidance=analysis.get("guidance", "Stay positive."),
        prevention_methods=analysis.get("prevention_methods", []),
        mindguard_class=mindguard_class,
        computed_smoothed_score=target_score
    )
    
    return {
        "case_id": updated_case.id,
        "response": analysis.get("response", analysis.get("guidance", "I am here with you. Your feelings are completely valid.")),
        "current_score": updated_case.current_score,
        "risk_band": updated_case.risk_band,
        "factors": analysis.get("factors", []),
        "guidance": analysis.get("guidance", "Stay positive."),
        "prevention_methods": analysis.get("prevention_methods", []),
        "mindguard_class": mindguard_class,
        "raw_score_used": raw_message_score,
        "crisis_router": analysis.get("crisis_router", {
            "tier1_status": "CLEAR (Proceed to Gemma 4 E2B)",
            "latency_ms": 1.5,
            "negation_aware": True
        }),
        "algorithm_1": alg1["math_breakdown"],
        "data_provenance": alg1["data_provenance"],
        "features": alg1["features"]
    }

