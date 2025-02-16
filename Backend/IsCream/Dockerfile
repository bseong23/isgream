# Gradle 빌드 기반 설정
FROM openjdk:17-jdk-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 소스 코드 복사 및 빌드
COPY . .
RUN ./gradlew clean build --no-daemon

# 애플리케이션 실행 환경
FROM openjdk:17-jdk-alpine

# JAR 파일 복사 및 실행
COPY --from=build /app/build/libs/*.jar app.jar

# .env 파일 복사
COPY .env /app/.env

# 환경 변수 로드
RUN export $(cat /app/.env | xargs)

# 포트 설정
EXPOSE 8080

# 애플리케이션 실행
CMD ["sh", "-c", "export $(cat /app/.env | xargs) && java -jar app.jar"]