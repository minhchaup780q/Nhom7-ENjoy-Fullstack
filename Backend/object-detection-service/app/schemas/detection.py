from pydantic import BaseModel
from typing import List

class DetectionItem(BaseModel):
    box: List[float]  # [x1, y1, x2, y2] Bounding box coordinates
    confidence: float  # Confidence score (0.0 to 1.0)
    class_id: int      # Predicted class ID
    class_name: str    # Predicted class name (English, matching YOLO classes)

class DetectionResponse(BaseModel):
    detections: List[DetectionItem]
