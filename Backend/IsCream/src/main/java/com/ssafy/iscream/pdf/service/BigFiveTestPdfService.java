package com.ssafy.iscream.pdf.service;


import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.extgstate.PdfExtGState;
import com.itextpdf.kernel.pdf.xobject.PdfImageXObject;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.ssafy.iscream.bigFiveTest.domain.BigFiveTest;
import com.ssafy.iscream.bigFiveTest.repository.BigFiveTestRepository;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.s3.service.S3Service;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class BigFiveTestPdfService {
    private final S3Service s3Service;
    private final BigFiveTestRepository bigFiveTestRepository;

    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(33, 37, 41);
    private static final DeviceRgb SECTION_COLOR = new DeviceRgb(52, 152, 219);
    private static final DeviceRgb TEXT_COLOR = new DeviceRgb(44, 62, 80);
    private static final DeviceRgb TABLE_BG_COLOR = new DeviceRgb(230, 230, 230);
    private static final DeviceRgb BORDER_COLOR = new DeviceRgb(180, 180, 180);

    public String generatePdf(User user, Child child, BigFiveTest bigFiveTest) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdfDocument = new PdfDocument(writer);
             Document document = new Document(pdfDocument)) {

            PdfFont font = PdfFontFactory.createFont("static/NanumGothic.ttf", PdfEncodings.IDENTITY_H);
            document.setFont(font);
            pdfDocument.addNewPage();

            document.add(getTitle("Big Five 성격 검사 보고서"));
            document.add(new Paragraph("검사 날짜: " + bigFiveTest.getTestDate().toString())
                    .setFontSize(12)
                    .setFontColor(TEXT_COLOR)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(3).setMarginBottom(3));
            // ✅ 부모 정보
            document.add(getSectionTitle("부모 정보"));
            document.add(getStyledTable(new String[][]{
                    {"이름", user.getUsername()},
                    {"이메일", user.getEmail()},
                    {"전화번호", user.getPhone() != null ? user.getPhone() : "010-0000-0000"},
                    {"자녀와의 관계", user.getRelation() != null ? user.getRelation().toString() : "미입력"},
                    {"닉네임", user.getNickname() != null ? user.getNickname() : "미입력"}
            }));

            // ✅ 자녀 정보
            document.add(getSectionTitle("자녀 정보"));
            document.add(getStyledTable(new String[][]{
                    {"닉네임", child.getNickname()},
                    {"생년월일", child.getBirthDate().toString()},
                    {"성별", child.getGender().toString()}
            }));

            // ✅ Big Five 검사 결과
            document.add(getSectionTitle("Big Five 성격 검사 결과"));
            document.add(getStyledTable(new String[][]{
                    {"성실성 (Conscientiousness)", bigFiveTest.getConscientiousness().toString()},
                    {"친화성 (Agreeableness)", bigFiveTest.getAgreeableness().toString()},
                    {"정서적 안정성 (Emotional Stability)", bigFiveTest.getEmotionalStability().toString()},
                    {"외향성 (Extraversion)", bigFiveTest.getExtraversion().toString()},
                    {"개방성 (Openness)", bigFiveTest.getOpenness().toString()}
            }));

            // ✅ 검사 해석 (설명 칸 추가)
            document.add(getSectionTitle("검사 결과 해석"));
            document.add(getBigFiveAnalysis(bigFiveTest));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return s3Service.uploadPdfFile(outputStream.toByteArray());
    }
    private static Paragraph getBigFiveAnalysis(BigFiveTest bigFiveTest) {

        return new Paragraph(bigFiveTest.getAnalysis())
                .setFontSize(12)
                .setFontColor(TEXT_COLOR)
                .setBorder(new SolidBorder(BORDER_COLOR, 1))
                .setPadding(10)
                .setMarginTop(10);
    }

    private static Paragraph getTitle(String title) {
        return new Paragraph(title)
                .setFontSize(22).setBold()
                .setFontColor(DeviceRgb.WHITE)
                .setBackgroundColor(HEADER_COLOR)
                .setTextAlignment(TextAlignment.CENTER)
                .setPadding(10).setMarginBottom(20);
    }

    private static Paragraph getSectionTitle(String title) {
        return new Paragraph(title)
                .setFontSize(16).setBold()
                .setFontColor(DeviceRgb.WHITE)
                .setBackgroundColor(SECTION_COLOR)
                .setPadding(8).setMarginTop(10);
    }


    private static Table getStyledTable(String[][] data) {
        Table table = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth();
        for (String[] row : data) {
            for (String cellData : row) {
                table.addCell(new Cell()
                        .add(new Paragraph(cellData)
                                .setFontSize(12)
                                .setFontColor(TEXT_COLOR)
                                .setTextAlignment(TextAlignment.CENTER)
                                .setVerticalAlignment(VerticalAlignment.MIDDLE))
                        .setPadding(3)
                        .setBackgroundColor(TABLE_BG_COLOR)
                        .setBorder(new SolidBorder(BORDER_COLOR, 3)));
            }
        }
        return table;
    }


    private static Cell getCenteredImageCell(String title, String imageUrl) {
        Cell cell = new Cell().setPadding(15).setBorder(new SolidBorder(BORDER_COLOR, 1))
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE);

        Paragraph titleParagraph = new Paragraph(title)
                .setBold()
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setVerticalAlignment(VerticalAlignment.MIDDLE)
                .setMarginBottom(10);

        cell.add(titleParagraph);

        if (imageUrl != null && !imageUrl.isEmpty()) {
            try {
                Image image = new Image(ImageDataFactory.create(imageUrl));
                image.scaleToFit(150, 150);
                image.setHorizontalAlignment(HorizontalAlignment.CENTER);
                cell.add(image);
            } catch (Exception e) {
                cell.add(new Paragraph("이미지를 불러올 수 없습니다.")
                        .setFontSize(10)
                        .setTextAlignment(TextAlignment.CENTER)
                        .setVerticalAlignment(VerticalAlignment.MIDDLE));
            }
        } else {
            cell.add(new Paragraph("이미지 없음")
                    .setFontSize(10)
                    .setTextAlignment(TextAlignment.CENTER)
                    .setVerticalAlignment(VerticalAlignment.MIDDLE));
        }
        return cell;
    }

}
