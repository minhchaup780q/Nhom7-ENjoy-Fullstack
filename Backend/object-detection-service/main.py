import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.detection_router import router as detection_router

# --- 1. Thêm các thư viện cần thiết cho Eureka ---
import py_eureka_client.eureka_client as eureka_client
from contextlib import asynccontextmanager

# --- 2. Cấu hình Eureka ---
EUREKA_SERVER = "http://localhost:8761/eureka/"
SERVICE_NAME = "detection-service" # Đặt tên này để Gateway nhận diện (ví dụ: /detection-service/...)
SERVICE_PORT = 8002                # Cùng port với cấu hình uvicorn ở dưới cùng

# --- 3. Tạo Lifespan để xử lý việc đăng ký / ngắt kết nối Eureka ---
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Chạy khi khởi động ứng dụng
    print("Đang đăng ký vào Eureka Server...")
    await eureka_client.init_async(
        eureka_server=EUREKA_SERVER,
        app_name=SERVICE_NAME,
        instance_port=SERVICE_PORT
    )
    yield
    # Chạy khi tắt ứng dụng
    print("Đang ngắt kết nối khỏi Eureka Server...")
    await eureka_client.stop_async()

# --- 4. Gắn lifespan vào khởi tạo FastAPI ---
app = FastAPI(
    title="ENGjoy Object Detection Microservice",
    description="Microservice AI nhận diện đồ dùng học tập sử dụng YOLOv8",
    version="1.0.0",
    lifespan=lifespan # Thêm dòng này
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