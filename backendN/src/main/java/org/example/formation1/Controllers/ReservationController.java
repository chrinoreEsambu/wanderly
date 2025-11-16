package org.example.formation1.Controllers;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.formation1.Models.ReservationModel;
import org.example.formation1.Models.UserModel;
import org.example.formation1.Repositories.ReservationRepository;
import org.example.formation1.Repositories.UserRepository;
import org.example.formation1.Services.ReservationService;
import org.example.formation1.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/reservation")
@CrossOrigin("*")
public class ReservationController {

    @Autowired
    ReservationService reservationService;

    @Autowired
    UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    JavaMailSender mailSender;

    @Autowired
    private org.example.formation1.Services.VoyageService voyageService;

    @Autowired
    private org.example.formation1.Services.CategoryService categoryService;

    // ✅ Création de réservation + envoi email
    @PostMapping("/create/{userId}/{voyageId}/{categoryId}")
    public ReservationModel create(@ModelAttribute ReservationModel reservation, 
                                   @PathVariable Long userId,
                                   @PathVariable Long voyageId,
                                   @PathVariable Long categoryId)
            throws MessagingException, UnsupportedEncodingException {

        UserModel user = userService.getUserById(userId);
        reservation.setUser(user);
        reservation.setVoyage(voyageService.getVoyageById(voyageId));
        reservation.setCategory(categoryService.getOneCategory(categoryId));
        
        // Si paid et confirm ne sont pas définis, les mettre à false par défaut
        if (reservation.getPaid() == null) {
            reservation.setPaid(false);
        }
        if (reservation.getConfirm() == null) {
            reservation.setConfirm(false);
        }

        ReservationModel createdReservation = reservationRepository.save(reservation);

        // --- Envoi d'email avec lien de confirmation
        String from = "admin@gmail.com";
        String to = user.getEmail();
        String subject = "Success: Reservation Created";
        String content = "Your reservation has been successfully created.";
        String encodedEmail = URLEncoder.encode(to, StandardCharsets.UTF_8.toString());

        String htmlContent = "<html><body>" +
                content + "<br/>" +
                "<a href=\"http://localhost:8083/reservation/confirm?email=" + encodedEmail + "\">Click here to confirm</a>" +
                "</body></html>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);

        return createdReservation;
    }

    // ✅ Création de réservation MANUELLE par l'admin (sans envoi d'email)
    @PostMapping("/create-manual/{userId}/{voyageId}/{categoryId}")
    public ReservationModel createManual(@ModelAttribute ReservationModel reservation,
                                         @PathVariable Long userId,
                                         @PathVariable Long voyageId,
                                         @PathVariable Long categoryId) {

        UserModel user = userService.getUserById(userId);
        reservation.setUser(user);
        reservation.setVoyage(voyageService.getVoyageById(voyageId));
        reservation.setCategory(categoryService.getOneCategory(categoryId));

        // Si paid et confirm ne sont pas définis, les mettre à false par défaut
        if (reservation.getPaid() == null) {
            reservation.setPaid(false);
        }
        if (reservation.getConfirm() == null) {
            reservation.setConfirm(false);
        }

        // Sauvegarder sans envoyer d'email
        return reservationRepository.save(reservation);
    }

    // ✅ Lors du clic sur le lien => paid + confirm = true
    @GetMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestParam String email) {
        UserModel user = userRepository.findFirstByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("Utilisateur introuvable.");
        }

        ReservationModel reservation = reservationRepository.findFirstByUser(user);
        if (reservation == null) {
            return ResponseEntity.badRequest().body("Réservation introuvable.");
        }

        reservation.setPaid(true);
        reservation.setConfirm(true);
        reservationRepository.save(reservation);

        return ResponseEntity.ok("✅ Votre réservation est confirmée.");
    }

    @GetMapping("/list")
    public List<ReservationModel> getlist() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/user/{userId}")
    public List<ReservationModel> getReservationsByUser(@PathVariable Long userId) {
        UserModel user = userService.getUserById(userId);
        return reservationRepository.findByUser(user);
    }

    @GetMapping("/getOne/{id}")
    public ReservationModel getOne(@PathVariable Long id) {
        return reservationService.getOneReservation(id);
    }

    @PutMapping("/update/{id}/{userId}")
    public ReservationModel update(@ModelAttribute ReservationModel reservationModel, @PathVariable Long id, @PathVariable Long userId) {
        reservationModel.setId(id);
        UserModel user = userService.getUserById(userId);
        reservationModel.setUser(user);
        ReservationModel old = reservationService.getOneReservation(id);

        if (reservationModel.getDate() == null) {
            reservationModel.setDate(old.getDate());
        }

        if (reservationModel.getPaid() == null) {
            reservationModel.setPaid(old.getPaid());
        }

        if (reservationModel.getConfirm() == null) {
            reservationModel.setConfirm(old.getConfirm());
        }

        if (reservationModel.getNombrePersonnes() == null) {
            reservationModel.setNombrePersonnes(old.getNombrePersonnes());
        }

        if (reservationModel.getVoyage() == null) {
            reservationModel.setVoyage(old.getVoyage());
        }

        if (reservationModel.getCategory() == null) {
            reservationModel.setCategory(old.getCategory());
        }

        return reservationService.updateReservation(reservationModel);
    }

    // ✅ Route pour confirmer une réservation (passer de "en attente" à "confirmé")
    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmReservation(@PathVariable Long id) {
        ReservationModel reservation = reservationService.getOneReservation(id);
        if (reservation == null) {
            return ResponseEntity.badRequest().body("Réservation introuvable.");
        }

        reservation.setConfirm(true);
        reservationService.updateReservation(reservation);

        return ResponseEntity.ok(reservation);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        reservationService.DeleteReservation(id);
        return "Delete success";
    }
}
