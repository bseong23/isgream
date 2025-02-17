# Gradle 빌드 기반 설정
FROM eclipse-temurin:17-jdk-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# 소스 코드 복사 및 빌드
COPY . .
RUN ./gradlew clean build -x test --no-daemon

# 애플리케이션 실행 환경
FROM eclipse-temurin:17-jdk-alpine

# JAR 파일 복사 및 실행
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
CMD ["java", "-Xms256m", "-Xmx1024m", "-jar", "app.jar"]
