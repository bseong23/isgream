from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import yolo_service, chatbot_service
from dotenv import load_dotenv

load_dotenv()

# FastAPI 애플리케이션 생성
app = FastAPI(root_path="/ai")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (보안상 필요하면 특정 도메인만 허용)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 라우터 등록
app.include_router(yolo_service.router, prefix="/htp", tags=["AI Service"])
app.include_router(chatbot_service.router, prefix="/chatbot", tags=["AI Service"])

# 기본 GET API
@app.get("/")
async def read_root():
    return {"message": "A407 services!"}
