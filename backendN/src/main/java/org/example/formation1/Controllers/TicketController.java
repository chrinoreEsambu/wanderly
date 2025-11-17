package org.example.formation1.Controllers;

import org.example.formation1.Services.TicketPdfService;
import org.example.formation1.Models.ReservationModel;
import org.example.formation1.Repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
public class TicketController {
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private TicketPdfService ticketPdfService;

    @GetMapping("/{id}/ticket")
    public ResponseEntity<byte[]> getTicket(@PathVariable Long id) throws IOException {
        ReservationModel reservation = reservationRepository.findById(id).orElse(null);
        if (reservation == null || reservation.getConfirm() == null || !reservation.getConfirm()) {
            return ResponseEntity.notFound().build();
        }
        // Préparer les infos à afficher sur le ticket
        Map<String, String> infos = new HashMap<>();
        String nomVoyageur = "";
        if (reservation.getUser() != null) {
            nomVoyageur = (reservation.getUser().getFirstName() != null ? reservation.getUser().getFirstName() : "") + " " + (reservation.getUser().getLastName() != null ? reservation.getUser().getLastName() : "");
        }
        infos.put("Nom du voyageur", nomVoyageur.trim());
        infos.put("Voyage", reservation.getVoyage() != null ? reservation.getVoyage().getName() : "");
        infos.put("Date", reservation.getVoyage() != null ? reservation.getVoyage().getDate() : "");
        infos.put("Réservation ID", reservation.getId() != null ? reservation.getId().toString() : "");
        // QR code : contenu unique (ex : reservationId + nom)
        String qrContent = "RES-" + reservation.getId() + "-" + nomVoyageur.trim();
        byte[] pdfBytes = ticketPdfService.generateTicketPdf(infos, qrContent);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=ticket-" + reservation.getId() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }
}
