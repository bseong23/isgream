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
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.patTest.domain.PatTest;
import com.ssafy.iscream.s3.service.S3Service;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class PatTestPdfService {
    private final S3Service s3Service;

    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(33, 37, 41);
    private static final DeviceRgb SECTION_COLOR = new DeviceRgb(52, 152, 219);
    private static final DeviceRgb TEXT_COLOR = new DeviceRgb(44, 62, 80);
    private static final DeviceRgb TABLE_BG_COLOR = new DeviceRgb(230, 230, 230);
    private static final DeviceRgb BORDER_COLOR = new DeviceRgb(180, 180, 180);

    public String generatePdf(User user, PatTest patTest) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdfDocument = new PdfDocument(writer);
             Document document = new Document(pdfDocument)) {

            PdfFont font = PdfFontFactory.createFont("static/NanumGothic.ttf", PdfEncodings.IDENTITY_H);
            document.setFont(font);
            pdfDocument.addNewPage();

            document.add(getTitle("PAT 검사 보고서"));

            // ✅ 부모 정보 (변경 없음)
            document.add(getSectionTitle("부모 정보"));
            document.add(getStyledTable(new String[][]{
                    {"이름", user.getUsername()},
                    {"이메일", user.getEmail()},
                    {"전화번호", user.getPhone() != null ? user.getPhone() : "010-0000-0000"},
                    {"자녀와의 관계", user.getRelation() != null ? user.getRelation().toString() : "미입력"},
                    {"닉네임", user.getNickname() != null ? user.getNickname() : "미입력"}
            }));

            // ✅ 자녀 정보 (A, B, C 점수 및 최종 유형 추가)
            document.add(getSectionTitle("부모 PAT 검사 결과"));
            document.add(getStyledTable(new String[][]{
                    {"A 유형 점수", patTest.getAScore().toString()},
                    {"B 유형 점수", patTest.getBScore().toString()},
                    {"C 유형 점수", patTest.getCScore().toString()},
                    {"최종 선정된 유형", patTest.getResult().getDescription()} // Enum 설명 가져오기
            }));

            // ✅ 검사 결과 설명 (A, B, C에 따라 자동 변경)
            document.add(getSectionTitle("검사 결과 설명"));
            document.add(getAnalysisParagraph(patTest.getResult()));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return s3Service.uploadPdfFile(outputStream.toByteArray());
    }

    private static Paragraph getAnalysisParagraph(PatTest.ResultType resultType) {
        String explanation = switch (resultType) {
            case A -> """
                    A형 (허용형/익애적 양육태도):
                    - 부모가 자녀를 감싸주고 사랑을 강조하는 양육 방식입니다.
                    - 자녀의 의견을 존중하고 강압적인 통제를 최소화합니다.
                    - 감정적으로 개방적이며 따뜻한 분위기를 조성합니다.
                    - 하지만 지나친 허용은 자녀의 자율성과 책임감 부족을 초래할 수 있습니다.
                    """;
            case B -> """
                    B형 (권위주의적 양육태도):
                    - 엄격한 규율과 높은 기대치를 강조하는 양육 방식입니다.
                    - 부모의 권위를 강조하며 자녀에게 복종과 규칙 준수를 요구합니다.
                    - 벌과 보상을 통해 행동을 통제하는 경향이 있습니다.
                    - 규율을 강조하지만, 과도하면 자녀가 위축되거나 반항적인 성향을 보일 수 있습니다.
                    """;
            case C -> """
                    C형 (민주적/균형잡힌 양육태도):
                    - 부모와 자녀가 상호 존중하는 균형 잡힌 양육 방식입니다.
                    - 자녀의 자율성을 보장하면서도 적절한 규율을 제공합니다.
                    - 논리적인 설명과 대화를 통해 자녀를 지도합니다.
                    - 자녀가 독립성과 책임감을 기를 수 있는 환경을 조성합니다.
                    """;
        };

        return new Paragraph(explanation)
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
