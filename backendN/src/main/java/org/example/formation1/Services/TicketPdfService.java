package org.example.formation1.Services;

import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Image;
import com.itextpdf.io.image.ImageDataFactory;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

public class TicketPdfService {
    public byte[] generateTicketPdf(Map<String, String> infos, String qrContent) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Titre
        document.add(new Paragraph("Ticket de réservation").setBold().setFontSize(18));
        document.add(new Paragraph("\n"));

        // Infos du voyage
        for (Map.Entry<String, String> entry : infos.entrySet()) {
            document.add(new Paragraph(entry.getKey() + ": " + entry.getValue()));
        }
        document.add(new Paragraph("\n"));

        // Générer le QR code
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 200, 200);
            ByteArrayOutputStream qrBaos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", qrBaos);
            Image qrImage = new Image(ImageDataFactory.create(qrBaos.toByteArray()));
            document.add(qrImage);
        } catch (Exception e) {
            document.add(new Paragraph("QR code non disponible"));
        }

        document.close();
        return baos.toByteArray();
    }
}
