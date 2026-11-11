import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from twilio.rest import Client
from dotenv import dotenv_values

env_vars = dotenv_values(os.path.join(os.path.dirname(__file__), '../../.env'))

router = APIRouter()

TWILIO_ACCOUNT_SID = env_vars.get("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = env_vars.get("TWILIO_AUTH_TOKEN")
TWILIO_FROM = env_vars.get("TWILIO_WHATSAPP_NUMBER") # e.g. 'whatsapp:+14155238886'
SUPPORT_CONTACT = env_vars.get("SUPPORT_CONTACT_NUMBER") # e.g. 'whatsapp:+919876543210'

class AlertRequest(BaseModel):
    case_id: str
    risk_band: str
    mindguard_class: str = "Safe"

@router.post("/whatsapp")
def send_whatsapp_alert(req: AlertRequest):
    if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, SUPPORT_CONTACT]):
        return {"status": "error", "message": "Twilio credentials missing in .env"}

    # Ensure "whatsapp:" prefix
    from_number = TWILIO_FROM if TWILIO_FROM.startswith("whatsapp:") else f"whatsapp:{TWILIO_FROM}"
    to_number = SUPPORT_CONTACT if SUPPORT_CONTACT.startswith("whatsapp:") else f"whatsapp:{SUPPORT_CONTACT}"

    try:
        client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
        
        if req.mindguard_class == "Self-Harm":
            message_body = f"""🚨 *SENTINEL CRITICAL ALERT* 🚨

*Subject:* {req.case_id.upper()} (Abstracted)
*Risk Level:* {req.risk_band.upper()} ({req.mindguard_class})

*Context & Situation:*
The system detected imminent expressions of hopelessness and suicidal ideation. The subject indicated severe fear regarding their physical surroundings and expressed a desire to end things.

*Recommended Action:*
- IMMEDIATE ESCALATION: Dispatch emergency welfare check or direct connect to Tele MANAS (14416).
- Physical security protocols initiated (staying in locked, secure room)."""
        else:
            message_body = f"""⚠️ *SENTINEL SAFETY ALERT* ⚠️

*Subject:* {req.case_id.upper()} (Abstracted)
*Risk Level:* {req.risk_band.upper()} ({req.mindguard_class})

*Context & Situation:*
The system detected elevated distress, disrupted sleep, and fear regarding authority figures/community interactions. No active self-harm ideation detected.

*Recommended Action:*
- Monitor and provide reassurance.
- Suggest grounding exercises (4-7-8 breathing)."""

        message = client.messages.create(
            from_=from_number,
            body=message_body,
            to=to_number
        )
        return {"status": "success", "message_sid": message.sid}
    except Exception as e:
        print(f"Twilio error: {e}")
        return {"status": "error", "message": str(e)}
