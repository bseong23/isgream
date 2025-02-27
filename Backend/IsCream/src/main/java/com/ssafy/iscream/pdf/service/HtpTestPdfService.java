package com.ssafy.iscream.pdf.service;

import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.Rectangle;
import com.itextpdf.kernel.pdf.*;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.kernel.pdf.extgstate.PdfExtGState;
import com.itextpdf.kernel.pdf.xobject.PdfImageXObject;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.layout.borders.SolidBorder;
import com.itextpdf.layout.properties.VerticalAlignment;
import com.ssafy.iscream.children.domain.Child;
import com.ssafy.iscream.htpTest.domain.HtpTest;
import com.ssafy.iscream.s3.service.S3Service;
import com.ssafy.iscream.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class HtpTestPdfService {

    private final S3Service s3Service;

    private static final DeviceRgb HEADER_COLOR = new DeviceRgb(33, 37, 41);
    private static final DeviceRgb SECTION_COLOR = new DeviceRgb(52, 152, 219);
    private static final DeviceRgb TEXT_COLOR = new DeviceRgb(44, 62, 80);
    private static final DeviceRgb TABLE_BG_COLOR = new DeviceRgb(230, 230, 230);
    private static final DeviceRgb BORDER_COLOR = new DeviceRgb(180, 180, 180);

    public String generatePdf(User user, Child child, String text, HtpTest htpTest) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try (PdfWriter writer = new PdfWriter(outputStream);
             PdfDocument pdfDocument = new PdfDocument(writer);
             Document document = new Document(pdfDocument)) {

            PdfFont font = PdfFontFactory.createFont("static/NanumGothic.ttf", PdfEncodings.IDENTITY_H);
            document.setFont(font);
            pdfDocument.addNewPage();

            document.add(getTitle("HTP 검사 보고서"));
            document.add(new Paragraph("검사 날짜: " + htpTest.getTestDate().toString())
                    .setFontSize(12)
                    .setFontColor(TEXT_COLOR)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .setMarginTop(3).setMarginBottom(3));
            document.add(getSectionTitle("부모 정보"));
            document.add(getStyledTable(new String[][]{
                    {"이름", user.getUsername()},
                    {"이메일", user.getEmail()},
                    {"전화번호", user.getPhone() != null ? user.getPhone() : "010-0000-0000"},
                    {"관계", user.getRelation() != null ? user.getRelation().toString() : "미입력"},
                    {"닉네임", user.getNickname() != null ? user.getNickname() : "미입력"}
            }));

            document.add(getSectionTitle("자녀 정보"));
            document.add(getStyledTable(new String[][]{
                    {"닉네임", child.getNickname()},
                    {"생년월일", child.getBirthDate().toString()},
                    {"성별", child.getGender().toString()}
            }));

            document.add(getSectionTitle("HTP 검사 그림"));
            document.add(getImageGrid(htpTest));
            text = text.replace("\"", "");
            String[] analysisParts = text.split("----");
            if (analysisParts.length < 4) {
                throw new IllegalArgumentException("텍스트는 4개 부분으로 나누어야 합니다.");
            }

            document.add(getSectionTitle("집 그림 검사 분석"));
            document.add(getAnalysisTable("\n"+analysisParts[0]));

            document.add(getSectionTitle("나무 그림 검사 분석"));
            document.add(getAnalysisTable(analysisParts[1]));

            document.add(getSectionTitle("남자사람 그림 검사 분석"));
            document.add(getAnalysisTable(analysisParts[2]));

            document.add(getSectionTitle("여자사람 그림 검사 분석"));
            document.add(getAnalysisTable(analysisParts[3]));

            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return s3Service.uploadPdfFile(outputStream.toByteArray());
    }
    private void addBackgroundImage(PdfDocument pdfDocument, String imagePath) {
        try {
            for (int i = 1; i <= pdfDocument.getNumberOfPages(); i++) {
                PdfPage page = pdfDocument.getPage(i);
                PdfCanvas canvas = new PdfCanvas(page);
                PdfExtGState gState = new PdfExtGState().setFillOpacity(0.2f); // 투명도 설정

                PdfImageXObject imageXObject = new PdfImageXObject(ImageDataFactory.create(imagePath));
                Rectangle pageSize = page.getPageSize();

                canvas.saveState()
                        .setExtGState(gState) // 투명도 적용
                        .addXObject(imageXObject, 0, 0) // 전체 페이지 크기에 맞춰 배경 적용
                        .restoreState();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
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
    private static Table getImageGrid(HtpTest htpTest) {
        Table imageTable = new Table(UnitValue.createPercentArray(2)).useAllAvailableWidth().setTextAlignment(TextAlignment.CENTER);
        imageTable.addCell(getCenteredImageCell("집 그림", htpTest.getHouseDrawingUrl()));
        imageTable.addCell(getCenteredImageCell("나무 그림", htpTest.getTreeDrawingUrl()));
        imageTable.addCell(getCenteredImageCell("남자사람 그림", htpTest.getMaleDrawingUrl()));
        imageTable.addCell(getCenteredImageCell("여자사람 그림", htpTest.getFemaleDrawingUrl()));
        return imageTable;
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


    private static Table getAnalysisTable(String text) {
        Table table = new Table(UnitValue.createPercentArray(1)).useAllAvailableWidth();
        table.addCell(new Cell().add(new Paragraph(text.replace("\\n", "\n")))
                .setFontSize(12)
                .setFontColor(TEXT_COLOR)
                .setBorder(new SolidBorder(BORDER_COLOR, 1)));
        return table;
    }
}
