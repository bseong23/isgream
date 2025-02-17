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
import org.springframework.core.env.Environment;

import java.io.FileNotFoundException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    private final Environment environment;
    private Firestore firestore;

    public FirebaseConfig(Environment environment) {
        this.environment = environment;
    }

    @PostConstruct
    public void init() {
        try {
            InputStream serviceAccount = getClass().getClassLoader()
                    .getResourceAsStream("firebase/serviceAccountKey.json");

            if (serviceAccount == null) {
                throw new FileNotFoundException("Firebase serviceAccountKey.json 파일을 찾을 수 없습니다.");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

//            String firebaseConfig = environment.getProperty("FIREBASE_CONFIG");
//            if (firebaseConfig == null || firebaseConfig.isEmpty()) {
//                throw new IllegalStateException("FIREBASE_CONFIG 환경변수가 설정되지 않았습니다.");
//            }
//
//            FirebaseOptions options = FirebaseOptions.builder()
//                    .setCredentials(GoogleCredentials.fromStream(
//                            new ByteArrayInputStream(firebaseConfig.getBytes(StandardCharsets.UTF_8))
//                    ))
//                    .build();

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
