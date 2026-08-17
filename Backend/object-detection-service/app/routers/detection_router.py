from fastapi import APIRouter, UploadFile, File, HTTPException
from app.schemas.detection import DetectionResponse
from app.services.detection_service import DetectionService

router = APIRouter(prefix="/api/v1/object", tags=["Object Detection"])

@router.post("/detect", response_model=DetectionResponse)
async def detect_object(
    image: UploadFile = File(...)
):
    if not image:
        raise HTTPException(status_code=400, detail="Image file is required.")
        
    try:
        # Read file contents as bytes
        image_bytes = await image.read()
        
        # Run detection service
        detections = DetectionService.detect_objects(image_bytes)
        return {"detections": detections}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Object detection failed: {str(e)}")
