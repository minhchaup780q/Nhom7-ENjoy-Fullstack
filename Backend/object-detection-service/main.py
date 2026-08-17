import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.detection_router import router as detection_router

app = FastAPI(
    title="ENGjoy Object Detection Microservice",
    description="Microservice AI nhận diện đồ dùng học tập sử dụng YOLOv8",
    version="1.0.0"
)

# CORS configuration for Frontend to connect successfully
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routing
app.include_router(detection_router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ENGjoy Object Detection Service is running!"}

if __name__ == "__main__":
    # Runs on port 8002 to avoid conflicts
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
