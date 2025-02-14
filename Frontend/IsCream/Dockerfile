# Node.js 빌드 환경 설정
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Nginx 실행 환경 설정
FROM nginx:alpine

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/nginx.conf

# React 빌드 파일을 Nginx 디렉토리에 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 기본 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
