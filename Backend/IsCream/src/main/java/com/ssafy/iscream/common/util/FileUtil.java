package com.ssafy.iscream.common.util;

import com.ssafy.iscream.s3.exception.S3Exception.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static com.ssafy.iscream.common.exception.ErrorCode.*;

public class FileUtil {

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("jpg", "png", "jpeg", "gif", "pdf");

    // ✅ 기존 파일 랜덤 이름 생성 (파일 확장자 포함)
    public static String createFileName(MultipartFile file) {
        String extension = validateExtension(file.getOriginalFilename());
        return generateRandomFileName(extension);
    }

    // ✅ PDF 파일 랜덤 이름 생성 (고정 확장자)
    public static String createPdfFileName() {
        return generateRandomFileName("pdf");
    }

    // ✅ 랜덤 파일 이름 생성 로직
    private static String generateRandomFileName(String extension) {
        return UUID.randomUUID() + "_" + System.currentTimeMillis() + "." + extension;
    }

    // 파일 확장자 체크 메서드
    public static String validateExtension(String fileName) {
        if (fileName == null || fileName.isEmpty()) {
            throw new S3UploadException(INVALID_FILE_REQUEST);
        }

        String extension = getFileExtension(fileName);

        if (!ALLOWED_EXTENSIONS.contains(extension.toLowerCase())) {
            throw new S3UploadException(UNSUPPORTED_EXTENSION);
        }

        return extension;
    }

    // 파일 확장자 추출 메서드
    private static String getFileExtension(String originalFilename) {
        if (originalFilename == null || !originalFilename.contains(".")) {
            return ""; // 확장자가 없으면 빈 문자열 반환
        }

        return originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
    }

}
