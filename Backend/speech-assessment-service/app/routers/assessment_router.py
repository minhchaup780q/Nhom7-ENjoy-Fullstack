import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.schemas.assessment import AssessmentResponse
from app.services.speech_service import SpeechService

router = APIRouter(prefix="/api/v1/speech", tags=["Speech Assessment"])

@router.post("/assess", response_model=AssessmentResponse)
async def assess_speech(
    audio: UploadFile = File(...),
    target_sentence: str = Form(...)
):
    if not audio:
        raise HTTPException(status_code=400, detail="Audio file is required.")
    if not target_sentence or not target_sentence.strip():
        raise HTTPException(status_code=400, detail="Target sentence is required.")

    # Đọc bytes từ file audio upload
    audio_bytes = await audio.read()
    
    # Lấy định dạng đuôi file
    filename = audio.filename or "recording.webm"
    _, ext = os.path.splitext(filename)
    if not ext:
        ext = ".webm"

    try:
        result = SpeechService.evaluate_pronunciation(
            audio_bytes=audio_bytes,
            target_sentence=target_sentence.strip(),
            file_extension=ext
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Speech assessment failed: {str(e)}")
