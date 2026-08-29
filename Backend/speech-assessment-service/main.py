import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.assessment_router import router as assessment_router

import py_eureka_client.eureka_client as eureka_client
from contextlib import asynccontextmanager

EUREKA_SERVER = "http://localhost:8761/eureka/"
SERVICE_NAME = "speech-assessment-service"
SERVICE_PORT = 8000

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Chạy khi khởi động ứng dụng
    print("Đang đăng ký vào Eureka Server...")
    await eureka_client.init_async(
        eureka_server=EUREKA_SERVER,
        app_name=SERVICE_NAME,
        instance_port=SERVICE_PORT,
        instance_host="localhost"
    )
    yield
    # Chạy khi tắt ứng dụng
    print("Đang ngắt kết nối khỏi Eureka Server...")
    await eureka_client.stop_async()

app = FastAPI(
    title="ENGjoy Speech Assessment Microservice",
    description="Microservice AI nhận diện phát âm tiếng Anh sử dụng Faster-Whisper",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration - Disabled because API Gateway handles CORS globally.
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

app.include_router(assessment_router)

@app.get("/")
def health_check():
    return {"status": "ok", "message": "ENGjoy Speech Assessment Service is running!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
