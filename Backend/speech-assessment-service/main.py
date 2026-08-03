import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.assessment_router import router as assessment_router

app = FastAPI(
    title="ENGjoy Speech Assessment Microservice",
    description="Microservice AI nhận diện phát âm tiếng Anh sử dụng Faster-Whisper",
    version="1.0.0"
)

# Cấu hình CORS để Web Frontend gửi request thành công
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(assessment_router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ENGjoy Speech Assessment Service is running!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
