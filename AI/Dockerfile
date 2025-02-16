# Python 3.10.11 기반 이미지 사용
FROM python:3.11-bookworm

# 필수 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender1 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# 의존성 파일 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 애플리케이션 코드 복사
COPY . .

ENV PORT=8000
ENV WORKERS=4 
ENV LOG_LEVEL=info

# 포트 개방 (FastAPI 기본 포트)
EXPOSE $PORT

# Gunicorn + Uvicorn으로 FastAPI 실행 (멀티 프로세스 지원)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--loop", "uvloop", "--http", "httptools", "--timeout-keep-alive", "30"]


