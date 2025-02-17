package com.ssafy.iscream.noti.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    private Firestore firestore;

    @PostConstruct
    public void init() {
        try {
//            InputStream serviceAccount = getClass().getClassLoader()
//                    .getResourceAsStream("/firebase/serviceAccountKey.json");
            FileInputStream serviceAccount = new FileInputStream("./src/main/resources/firebase/serviceAccountKey.json");

            if (serviceAccount == null) {
                throw new FileNotFoundException("Firebase serviceAccountKey.json 파일을 찾을 수 없습니다.");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            this.firestore = FirestoreClient.getFirestore();

        } catch (Exception e){
            log.error(e.getMessage());
        }
    }

    @Bean
    public Firestore getFirestore() {
        return firestore;
    }
}


//package com.ssafy.iscream.noti.config;
//
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.cloud.firestore.Firestore;
//import com.google.firebase.FirebaseApp;
//import com.google.firebase.FirebaseOptions;
//import com.google.firebase.cloud.FirestoreClient;
//import jakarta.annotation.PostConstruct;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.env.Environment;
//import java.io.ByteArrayInputStream;
//import java.nio.charset.StandardCharsets;
//import java.util.Base64;
//
//@Configuration
//@Slf4j
//public class FirebaseConfig {
//
//    private final Environment environment;
//    private Firestore firestore;
//
//    public FirebaseConfig(Environment environment) {
//        this.environment = environment;
//    }
//
//    @PostConstruct
//    public void init() {
//        try {
//            // application.properties에서 Base64 인코딩된 환경 변수 불러오기
//            String firebaseConfigBase64 = environment.getProperty("firebase.config.base64");
//
//            if (firebaseConfigBase64 == null || firebaseConfigBase64.isEmpty()) {
//                throw new IllegalStateException("firebase.config.base64 환경 변수가 설정되지 않았습니다.");
//            }
//
//            // Base64 디코딩 (줄바꿈 및 공백 제거)
//            byte[] decodedBytes = Base64.getDecoder().decode(firebaseConfigBase64.replaceAll("\\s", ""));
//            String firebaseConfigJson = new String(decodedBytes, StandardCharsets.UTF_8);
//
//            // JSON 문자열을 InputStream으로 변환
//            ByteArrayInputStream serviceAccount = new ByteArrayInputStream(firebaseConfigJson.getBytes(StandardCharsets.UTF_8));
//
//            // Firebase 옵션 설정
//            FirebaseOptions options = FirebaseOptions.builder()
//                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                    .build();
//
//            if (FirebaseApp.getApps().isEmpty()) {
//                FirebaseApp.initializeApp(options);
//            }
//
//            this.firestore = FirestoreClient.getFirestore();
//            log.info("Firebase 초기화 성공");
//
//        } catch (Exception e) {
//            log.error("Firebase 초기화 중 오류 발생", e);
//        }
//    }
//
//    @Bean
//    public Firestore getFirestore() {
//        return firestore;
//    }
//}
//
