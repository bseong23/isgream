package com.ssafy.iscream.noti.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import javax.annotation.PostConstruct;
import java.io.FileNotFoundException;
import java.io.InputStream;

//@Configuration
//public class FirebaseInitialization {
//
//    @PostConstruct
//    public void initialize() {
//        try {
//            ClassPathResource resource = new ClassPathResource("firebase/androidtest-firebase-adminsdk.json");
//            InputStream serviceAccount = resource.getInputStream();
//            System.out.println(serviceAccount);
//
//            FirebaseOptions options = FirebaseOptions.builder()
//                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                    .build();
//
//            FirebaseApp.initializeApp(options);
//            System.out.println("Fcm Setting Completed");
//        } catch (IOException e) {
//            throw new RuntimeException(e.getMessage());
//        }
//    }
//}

//@Configuration
//public class FirebaseInitialization {
//    @Bean
//    public Firestore init() {
//        try {
//
//            ClassPathResource classPathResource = new ClassPathResource("firebase/androidtest-firebase-adminsdk.json");
//            InputStream serviceAccount = classPathResource.getInputStream();
//            System.out.println(serviceAccount);
//
//            FirebaseOptions options = FirebaseOptions.builder()
//                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                    .build();
//
//            if (FirebaseApp.getApps().isEmpty()) {
//                FirebaseApp.initializeApp(options);
//            }
//
//            System.out.println("Fcm Setting Completed");
//            return FirestoreClient.getFirestore();
//        } catch (Exception e){
//            throw new RuntimeException("Firestore 초기화 실패: " + e.getMessage());
//        }
//    }
//}

@Configuration
@Slf4j
public class FirebaseConfig {

    private Firestore firestore;

    @PostConstruct
    public void init() {
        System.out.println("@PostConstruct 메소드 시작입니다!!!");
        try {

            ClassPathResource classPathResource = new ClassPathResource("firebase/serviceAccountKey.json");
            if (!classPathResource.exists()) {
                throw new RuntimeException("Firebase JSON 파일을 찾을 수 없습니다.");
            }

            InputStream serviceAccount = classPathResource.getInputStream();
            System.out.println("================================================");
            System.out.println(serviceAccount);
            System.out.println("================================================");


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
            System.out.println("@PostConstruct 메소드 종료입니다!!!");
        } catch (Exception e) {
            throw new RuntimeException("Firestore 초기화 실패: " + e.getMessage());
        }
    }

    @Bean
    public Firestore getFirestore() {
        System.out.println("@Bean 메소드입니다!!!");
        return firestore;
    }
}
