package com.ssafy.iscream.pdf.service;

import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.ssafy.iscream.s3.service.S3Service;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final S3Service s3Service;

    public String generatePdf(User user, String text) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdfDocument = new PdfDocument(writer);
             Document document = new Document(pdfDocument)) {

            // ✅ 한글 폰트 설정
            InputStream fontStream = getClass().getClassLoader().getResourceAsStream("static/NanumGothic.ttf");
            PdfFont font = PdfFontFactory.createFont(fontStream.readAllBytes(), "Identity-H");
            document.setFont(font);

            // ✅ 제목 추가
            Paragraph title = new Paragraph("< HTP 검사 보고서 >")
                    .setFontSize(18)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20);
            document.add(title);

            // ✅ 사용자 정보 테이블 추가
            document.add(getSectionTitle("기본 정보"));
            Table userTable = new Table(UnitValue.createPercentArray(new float[]{3, 3, 3}))
                    .useAllAvailableWidth()
                    .setMarginBottom(10);

            userTable.addCell(getCell("이름: " + user.getUsername(), TextAlignment.LEFT));
            userTable.addCell(getCell("나이: " + (user.getBirthDate() != null ? user.getBirthDate().toString() : ""), TextAlignment.LEFT));
            userTable.addCell(getCell("성별: " + user.getStatus(), TextAlignment.LEFT));
            userTable.addCell(getCell("이메일: " + user.getEmail(), TextAlignment.LEFT, 3));
            userTable.addCell(getCell("전화번호: " + user.getPhone(), TextAlignment.LEFT, 3));
            userTable.addCell(getCell("닉네임: " + user.getNickname(), TextAlignment.LEFT));
            userTable.addCell(getCell("직업: " + "심리학과 대학생", TextAlignment.LEFT, 2));
            document.add(userTable);

            // ✅ HTP 검사 목적
            document.add(getSectionTitle("검사의 목적"));
            document.add(new Paragraph("HTP 검사를 통해 자신의 심리나 생활에 대해서 알고자 함")
                    .setFontSize(12).setMarginBottom(10));

            // ✅ 가족 배경과 개인력
            document.add(getSectionTitle("가족배경과 개인력"));
            document.add(new Paragraph("어릴 때 가족을 바쁘셔서 같이 활동한 일이 별로 없다고 하며, 활동적이고 외향적이다. 대학을 다니면서 자취생활을 하고 있다.")
                    .setFontSize(12).setMarginBottom(10));

            // ✅ 검사 시 행동관찰
            document.add(getSectionTitle("검사의 행동관찰"));
            document.add(new Paragraph("검사의 내용을 듣고 호기심 있는 태도로 응하며 신중하게 함, 인물화(여) 그림을 그릴 때 못 그렸다고 말을 자주함.")
                    .setFontSize(12).setMarginBottom(10));

            // ✅ 요약 및 검사자의 견해
            document.add(getSectionTitle("요약 및 검사자의 견해"));
            document.add(new Paragraph(text)
                    .setFontSize(12).setMarginBottom(10));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        // ✅ 생성된 PDF를 S3에 업로드 후 URL 반환
        return s3Service.uploadPdfFile(outputStream.toByteArray());
    }

    // 📌 표의 셀을 생성하는 메서드
    private static Cell getCell(String text, TextAlignment alignment) {
        return new Cell().add(new Paragraph(text))
                .setTextAlignment(alignment)
                .setPadding(5)
                .setBorder(null);
    }

    private static Cell getCell(String text, TextAlignment alignment, int colspan) {
        return new Cell(1, colspan).add(new Paragraph(text))
                .setTextAlignment(alignment)
                .setPadding(5)
                .setBorder(null);
    }

    // 📌 섹션 제목을 생성하는 메서드
    private static Paragraph getSectionTitle(String title) {
        return new Paragraph(title)
                .setBold()
                .setFontSize(14)
                .setBackgroundColor(ColorConstants.LIGHT_GRAY)
                .setPadding(5)
                .setMarginTop(10);
    }
}
