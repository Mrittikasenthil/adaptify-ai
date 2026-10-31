import os
import httpx
from typing import Optional
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from config import WISPR_FLOW_API_KEY, WISPR_FLOW_API_URL

router = APIRouter(prefix="/api/wispr", tags=["Wispr Flow Integration"])

class WisprConfigRequest(BaseModel):
    api_key: str

class WisprTranscribeRequest(BaseModel):
    audio_base64: Optional[str] = None
    language: Optional[str] = "en"

# Session-level key override if user provides one in UI
RUNTIME_WISPR_KEY = WISPR_FLOW_API_KEY

@router.get("/status")
def get_wispr_status():
    """
    Returns the real, truthful status of Wispr Flow integration.
    Adheres strictly to project requirements: Never falsely claims direct API
    integration if key is not active.
    """
    has_api_key = bool(RUNTIME_WISPR_KEY)
    
    return {
        "is_configured": has_api_key,
        "engine_mode": "wispr_flow_cloud" if has_api_key else "web_speech_fallback",
        "active_engine_name": "Wispr Flow Cloud API" if has_api_key else "Web Speech API (Browser Speech Fallback)",
        "api_endpoint": WISPR_FLOW_API_URL if has_api_key else None,
        "dictation_workflow_supported": True,
        "instructions": (
            "Wispr Flow runs as a high-performance system dictation app on your computer. "
            "Click into any input field or text area on ADAPTIFY AI, trigger your Wispr Flow shortcut, "
            "and speak naturally. Your words will flow instantly into the field!"
        ),
        "tts_supported": True,
        "tts_languages": ["en-US", "ta-IN", "tanglish"]
    }

@router.post("/configure")
def configure_wispr_key(req: WisprConfigRequest):
    """Allows student/tester to dynamically configure their Wispr Flow API key."""
    global RUNTIME_WISPR_KEY
    RUNTIME_WISPR_KEY = req.api_key.strip()
    return {
        "status": "success",
        "is_configured": bool(RUNTIME_WISPR_KEY),
        "active_engine_name": "Wispr Flow Cloud API" if RUNTIME_WISPR_KEY else "Web Speech API (Browser Speech Fallback)"
    }

@router.post("/transcribe")
async def transcribe_audio(req: WisprTranscribeRequest):
    """
    Proxies audio directly to official Wispr Flow API if API key is present.
    If no key is configured, cleanly alerts client to use browser speech recognition.
    """
    if not RUNTIME_WISPR_KEY:
        return {
            "success": False,
            "engine": "web_speech_fallback",
            "message": "Wispr Flow API Key not set. Please use the built-in Browser Speech Recognition or system dictation."
        }
        
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            headers = {
                "Authorization": f"Bearer {RUNTIME_WISPR_KEY}",
                "Content-Type": "application/json"
            }
            payload = {
                "audio": req.audio_base64,
                "language": req.language
            }
            resp = await client.post(WISPR_FLOW_API_URL, json=payload, headers=headers)
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "success": True,
                    "engine": "wispr_flow_cloud",
                    "transcription": data.get("text", "")
                }
            else:
                return {
                    "success": False,
                    "engine": "wispr_flow_cloud",
                    "error": f"Wispr Flow API returned status {resp.status_code}: {resp.text}"
                }
    except Exception as e:
        return {
            "success": False,
            "engine": "wispr_flow_cloud",
            "error": str(e),
            "fallback_available": True
        }
