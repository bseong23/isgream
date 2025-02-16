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

import java.io.FileNotFoundException;
import java.io.InputStream;

@Configuration
@Slf4j
public class FirebaseConfig {

    private Firestore firestore;

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
