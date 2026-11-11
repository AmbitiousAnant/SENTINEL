import os
import requests
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from dotenv import dotenv_values

env_vars = dotenv_values(os.path.join(os.path.dirname(__file__), '../../.env'))

router = APIRouter()
RIME_API_KEY = env_vars.get("RIME_API_KEY")

class VoiceRequest(BaseModel):
    text: str
    language: str = "hi" # 'hi' or 'en'

@router.post("/tts")
def generate_voice(req: VoiceRequest):
    if not RIME_API_KEY:
        raise HTTPException(status_code=500, detail="RIME_API_KEY missing in .env")

    # Assuming user wants Mist v3 with a Hindi-capable voice.
    # We will use "mist" model. 
    # Using a standard Rime Mist v3 speaker
    speaker = "marsh"

    headers = {
        "Authorization": f"Bearer {RIME_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "text": req.text,
        "speaker": speaker,
        "modelId": "mistv2"
    }

    try:
        res = requests.post("https://users.rime.ai/v1/rime-tts", json=payload, headers=headers)
        if res.status_code == 200:
            # The frontend expects {"audioContent": "base64..."}
            content_type = res.headers.get("Content-Type", "")
            if "application/json" in content_type:
                return res.json()
            else:
                import base64
                encoded = base64.b64encode(res.content).decode("utf-8")
                return {"audioContent": encoded}
        else:
            raise HTTPException(status_code=res.status_code, detail=res.text)
    except Exception as e:
        print(f"Rime API Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
