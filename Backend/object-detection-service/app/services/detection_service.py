import os
import cv2
import numpy as np
from typing import List, Dict, Any
from ultralytics import YOLO

class DetectionService:
    _model = None

    @classmethod
    def get_model(cls) -> YOLO:
        if cls._model is None:
            # Construct path to best.pt relative to this file's location to ensure robustness
            model_path = os.path.abspath(
                os.path.join(os.path.dirname(__file__), "..", "..", "object", "best.pt")
            )
            if not os.path.exists(model_path):
                raise FileNotFoundError(f"YOLO model file not found at: {model_path}")
            cls._model = YOLO(model_path)
        return cls._model

    @classmethod
    def detect_objects(cls, image_bytes: bytes) -> List[Dict[str, Any]]:
        # Convert uploaded image bytes into a numpy array for OpenCV
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            raise ValueError("Failed to decode image. Format might be invalid or file is corrupted.")

        # Load model and predict
        model = cls.get_model()
        results = model(img, conf=0.45)
        
        # Get image dimensions to compute normalized coordinates
        img_h, img_w = img.shape[:2]
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                conf = float(box.conf[0])
                cls_id = int(box.cls[0])
                cls_name = model.names[cls_id]
                
                # Calculate normalized bounding box [x_min, y_min, width, height] (0 to 1)
                x_norm = max(0.0, min(1.0, x1 / img_w))
                y_norm = max(0.0, min(1.0, y1 / img_h))
                w_norm = max(0.0, min(1.0, (x2 - x1) / img_w))
                h_norm = max(0.0, min(1.0, (y2 - y1) / img_h))
                
                detections.append({
                    "box": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
                    "confidence": round(conf, 4),
                    "class_id": cls_id,
                    "class_name": cls_name,
                    "bbox": [round(x_norm, 4), round(y_norm, 4), round(w_norm, 4), round(h_norm, 4)]
                })
        return detections
