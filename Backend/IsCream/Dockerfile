# Gradle 빌드 기반 설정
FROM openjdk:17-jdk-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 소스 코드 복사
COPY . .

# .env 파일 복사
COPY .env .env

# Docker 환경변수 설정 (이전 RUN export 방식 대신 ENV 사용)
ENV $(grep -v '^#' .env | xargs)

# Gradle 빌드 실행
RUN ./gradlew clean build -x test --no-daemon

# 애플리케이션 실행 환경
FROM openjdk:17-jdk-alpine

# JAR 파일 복사 및 실행
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
