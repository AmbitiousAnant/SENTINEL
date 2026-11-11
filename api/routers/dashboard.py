from fastapi import APIRouter
from services.state import get_all_cases, get_case

router = APIRouter()

@router.get("/cases")
def list_cases():
    cases = get_all_cases()
    return {"cases": cases}

@router.get("/cases/{case_id}")
def get_case_details(case_id: str):
    case = get_case(case_id)
    if not case:
        return {"error": "not found"}
    return case
