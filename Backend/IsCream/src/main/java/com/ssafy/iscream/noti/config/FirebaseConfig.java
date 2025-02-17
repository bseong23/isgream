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
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

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
            // application.properties에서 Base64 인코딩된 환경 변수 불러오기
            String firebaseConfigBase64 = "ew0KICAidHlwZSI6ICJzZXJ2aWNlX2FjY291bnQiLA0KICAicHJvamVjdF9pZCI6ICJzc2FmeS00NDkzMDciLA0KICAicHJpdmF0ZV9rZXlfaWQiOiAiMzU1OGU4NjYwOTMwY2E2Yzk1Njg2OTdkNTI2M2RlMjViZTUxNzA5OSIsDQogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2Z0lCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktnd2dnU2tBZ0VBQW9JQkFRQ1cyaVNlWVVUQ1hGS0tcblQ5c0JiT09QM1dMdllsZjVkNk93V1BJTS9Ga0JvcE54MWpTSVltb0YzTC93UkMyVTRQcXJ3Ky9GQnFtQWFrbUdcbk1yRWVFSXRIN1BBVVVGRlJDQzRDMll5R3NnaVRsUjNteU0rNy85Q1E3eGFVNDA0SkNyTU1uRnIyaGZVbHZHOEVcbnk2NHhPUjRUOURJcHVaUkQxSU5yTG9na0paZytFK0sxT1Z6am1ZcjFMMVFKZDZBUXBDNUNpTzg2aDNtRHowSGpcbjQ5QVRuN1JzYmpqK2d3bEY1Ti9zbDV5QWhFU1QyYTFQc0FVL2FkVlNqcFFabnFjdXV1NU11UkNJM1lnY2xxWkFcbmxYUEw1S2c4N1Z6MnBPTUxtbGhubUJFbVlWaDlwWUxaeU5lcXZVSVlOYkVPT2JuaHlQWXdVZEY4Z0NkbmpyWkVcbmNjclEzdFhwQWdNQkFBRUNnZ0VBQkl4ZlBrZEFnM3UxSVdaMisvd0VnSG4wV2JObFk2Z3Z6MGxmUXZUNDJndkVcbjFsSFhFNldqL0xsRE1FTmQvSGNzRjdHNHNRQWFiRHpJS3J1c2kzT0VQNDd0VGk5OXhDdXk5M01Id2Fmc2lrYWNcbnVEQ2wwczFMeEpMdzQxeFhKZjZrbDJTL2VWOWduTnFwbmtObDVTWUx1aDVLeE9kTGlTQUhObHdZenI0emNPdXNcbnRzUCt1MzVFMm92WEIrOEtPYUh1Qmh6NWM2RHRwbXBkdGswM2JkeEQxbkpvOWFIK0dxTWg2cVMxNDg5Sk4wMldcbjdVdXU5QkhyV2J0UEw3cFFTS0hOWENiLytOZEFnRUtsUEFHSzJSMmFBSWdKQnpTbmsxQ3daYU9IS0F0LzNnOFpcbjloTWN4ekNRenIwN3owK09rQXdha3VXU3JnRE01QVR2Z01oUlhZS3M0UUtCZ1FETFU0QU1waEtkK3hYaE5uaFlcbkRhSnBmMDlweVNsSDNNdWY5V0t3UFhTODQ0N01IZGwrVEhQcEtHeE42cEdJVWUwTE9xdURJZFErTnJONFZCditcbmlnOVUrTGR5NWdISDZKR2lrOTdqWDkvelhaT1BPVTZqSndZRi8zenN6dG9MT0loZHUvR3J3SVF2cUp0b0hpeGRcbk85M3dYK2NjVk01eVRJcHBMcUF2LytydUV3S0JnUUM5N3BabUVtS2EvaWZCR3NMalkrVEsrY1IxMFhMQnpWdzdcblBPVHFsR1RKbElBbVpQR2IvbmFYczhPWUd2cGdNb2hUK2J0b1BKQjdzRDF6ZWFmNEVUbloyaTJsOHNPOUtEWU5cbkxXUE1NT0lacGhVeVgxSkRBWkM3VGEvRWh0eE5FV3p5c200ZkxlOThQaHVDWTdKdVVaOEY4WkJWVnV0ZmZrYzJcbmxFbU5uN2Q3a3dLQmdCOTVlSXY4dFVzUlVDekJ3dFZXbnZxWHc1Skxtb0ZPVTVNYWFFR0I4ZTAvaUo1ZVRJbTVcbmlnUGd4d3Mwc1h5WnVna1A5dmJncUx0TXVuRjVDN0JXYk5NcGdUUmZHSTE2bWZqQnpUSURhR2FDNk5HMS9FOVRcblBpSjFqMEFWTVRtbGNhNlk1bXRBN1BWM3N6N2wxTlpGNnpCSG1ENFJmcmZBMDNnK3lIdEZzWGRUQW9HQkFJZjVcbnNyVDZ2cHRtRDRJQkxidHJ2ZFhQQU9hMGYycmVJZ1RLOEx3OFp2ZW1HQ1RrcWREYldYMzhGYkRreDVGdFBBcWFcbnhKKzRsRnZvN2VXcEdDYlI5ay9RRWxRM1BBbEZLNFU5bExBUDR4OG50dzhzRFJHcG9qdG1QOHI4SGVZUzdxUEdcbk9HNmNEVk11aDdWT3VPU2dETEJObzk1azd2ZWJ5Vkg2MGJuUnVhTi9Bb0dCQUtIelBVL1hNSlNmelBWSy9FM01cbkVydWNuNWFJTWZvc0ZrRVRhemZFNkxSQktyZlVGaGdSck9yNnRVbm5ZVWcvZ21YWHhCbjNTLzZqbkprSjhDUTRcbmZjVldKWkhhTXRZR0krZWREUzYzUVFnbklRak85cGtPZFZXQ2lCZzFCSlhQbVVNZ1d0ck1YaFJ1T2g3OGRtTURcblU1NGhqdXRVUXVIcjlEVm1ZRllWZExtaVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwNCiAgImNsaWVudF9lbWFpbCI6ICJmaXJlYmFzZS1hZG1pbnNkay1mYnN2Y0Bzc2FmeS00NDkzMDcuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLA0KICAiY2xpZW50X2lkIjogIjEwMTMyMzEzNjU4MDY0NzQyMDI5MSIsDQogICJhdXRoX3VyaSI6ICJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20vby9vYXV0aDIvYXV0aCIsDQogICJ0b2tlbl91cmkiOiAiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4iLA0KICAiYXV0aF9wcm92aWRlcl94NTA5X2NlcnRfdXJsIjogImh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsDQogICJjbGllbnRfeDUwOV9jZXJ0X3VybCI6ICJodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9yb2JvdC92MS9tZXRhZGF0YS94NTA5L2ZpcmViYXNlLWFkbWluc2RrLWZic3ZjJTQwc3NhZnktNDQ5MzA3LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwNCiAgInVuaXZlcnNlX2RvbWFpbiI6ICJnb29nbGVhcGlzLmNvbSINCn0NCg==";

            if (firebaseConfigBase64 == null || firebaseConfigBase64.isEmpty()) {
                throw new IllegalStateException("firebase.config.base64 환경 변수가 설정되지 않았습니다.");
            }

            // Base64 디코딩 (줄바꿈 및 공백 제거)
            byte[] decodedBytes = Base64.getDecoder().decode(firebaseConfigBase64.replaceAll("\\s", ""));
            String firebaseConfigJson = new String(decodedBytes, StandardCharsets.UTF_8);

            // JSON 문자열을 InputStream으로 변환
            ByteArrayInputStream serviceAccount = new ByteArrayInputStream(firebaseConfigJson.getBytes(StandardCharsets.UTF_8));

            // Firebase 옵션 설정
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }

            this.firestore = FirestoreClient.getFirestore();
            log.info("Firebase 초기화 성공");

        } catch (Exception e) {
            log.error("Firebase 초기화 중 오류 발생", e);
        }
    }

    @Bean
    public Firestore getFirestore() {
        return firestore;
    }
}

