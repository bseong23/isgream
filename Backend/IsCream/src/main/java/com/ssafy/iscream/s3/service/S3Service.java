package com.ssafy.iscream.s3.service;

import com.ssafy.iscream.common.util.FileUtil;
import com.ssafy.iscream.s3.exception.S3Exception.S3UploadException;
import io.awspring.cloud.s3.S3Exception;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.exception.SdkClientException;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static com.ssafy.iscream.common.exception.ErrorCode.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3Service {

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${s3.upload.file.url}")
    private String baseUrl;

    @Value("${s3.upload.folder.image}")
    private String imageDir; // 이미지 저장 폴더

    @Value("${s3.upload.folder.result}")
    private String resultDir; // 검사 결과 pdf 저장 폴더

    private final S3Client s3Client;

    // TODO: pdf 파일 업로드
    public String uploadPdfFile() throws IOException {
        String fileKey = resultDir + "생성된 파일 이름";

        return "";
    }

    // ✅ 랜덤 파일명으로 PDF 업로드 (타임스탬프 제거)
    public String uploadPdfFile(byte[] pdfBytes) {
        // ✅ 랜덤한 파일명 생성 (UUID 기반)
        String randomFileName = FileUtil.createPdfFileName(); // ex) "7d9a8f2b-4c6d-4d0e-9e2f_1707660582000.pdf"

        // ✅ 최종 S3 업로드 키 설정
        String fileKey = resultDir + randomFileName;

        try {
            // ✅ S3에 업로드
            s3Client.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucket)
                            .key(fileKey)
                            .contentType("application/pdf")
                            .build(),
                    RequestBody.fromBytes(pdfBytes)
            );
        } catch (Exception e) {
            throw new S3UploadException(FILE_UPLOAD_FAILED);
        }

        return baseUrl + fileKey; // 업로드된 S3 파일 URL 반환
    }
    // 단일 파일 업로드
    public String uploadImage(MultipartFile multipartFile) {
        String fileKey = imageDir + FileUtil.createFileName(multipartFile);

        File tempFile = null;

        try {
            // 임시 파일 생성
            tempFile = File.createTempFile("upload-", ".tmp");
            multipartFile.transferTo(tempFile);
            // S3에 업로드
            s3Client.putObject(
                    PutObjectRequest.builder().bucket(bucket).key(fileKey).build(),
                    RequestBody.fromFile(tempFile)
            );
        } catch (IOException | SdkClientException e) {
            throw new S3UploadException(FILE_UPLOAD_FAILED);
        } finally {
            // 임시 파일 삭제
            if (tempFile != null) {
                tempFile.delete();
            }
        }

        return baseUrl + fileKey; // 만들어진 url 반환
    }

    // 여러 파일 업로드
    public List<String> uploadImage(List<MultipartFile> files) {
        List<String> result = new ArrayList<>();

        for (MultipartFile file : files) {
            result.add(uploadImage(file));
        }

        return result;
    }

    // 파일 삭제
    public void deleteFile(String fileUrl) {
        if (fileUrl == null) {
            return;
        }

        try {
            String fileKey = extractFileKeyFromUrl(fileUrl);

            if (fileExists(fileKey)) {
                s3Client.deleteObject(DeleteObjectRequest.builder().bucket(bucket).key(fileKey).build());
                log.info("파일이 성공적으로 삭제되었습니다: {}", fileKey);
            } else {
                throw new S3UploadException(FILE_DOES_NOT_EXIST);
            }
        } catch (SdkClientException e) {
            log.error("AWS SDK client error : {}", e.getMessage());
            throw new S3UploadException(INVALID_FILE_REQUEST);
        } catch (S3Exception e) {
            log.error("File delete fail error : {}", e.getMessage());
            throw new S3UploadException(FILE_DELETE_IS_FAILED);
        }
    }

    public void deleteFile(List<String> fileUrls) {
        if (fileUrls == null || fileUrls.isEmpty()) {
            return;
        }

        try {
            List<ObjectIdentifier> keysToDelete = fileUrls.stream()
                    .map(this::extractFileKeyFromUrl)
                    .filter(this::fileExists)
                    .map(key -> ObjectIdentifier.builder().key(key).build())
                    .toList();

            if (!keysToDelete.isEmpty()) {
                DeleteObjectsRequest deleteRequest = DeleteObjectsRequest.builder()
                        .bucket(bucket)
                        .delete(Delete.builder().objects(keysToDelete).build())
                        .build();

                s3Client.deleteObjects(deleteRequest);
                log.info("파일들이 성공적으로 삭제되었습니다: {}", keysToDelete);
            } else {
                throw new S3UploadException(FILE_DOES_NOT_EXIST);
            }
        } catch (SdkClientException e) {
            log.error("AWS SDK client error : {}", e.getMessage());
            throw new S3UploadException(INVALID_FILE_REQUEST);
        } catch (S3Exception e) {
            log.error("파일 삭제 실패: {}", e.getMessage());
            throw new S3UploadException(FILE_DELETE_IS_FAILED);
        }
    }


//    public void deleteFile(List<String> fileUrls) {
//        for (String fileUrl : fileUrls) {
//            deleteFile(fileUrl);
//        }
//    }

    // 파일 존재 여부 확인
    public boolean fileExists(String fileKey) {
        try {
            s3Client.headObject(HeadObjectRequest.builder().bucket(bucket).key(fileKey).build());
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        }
    }


    // URL에서 fileKey 추출
    private String extractFileKeyFromUrl(String fileUrl) {
        return fileUrl.replace(baseUrl, "");
    }

}
