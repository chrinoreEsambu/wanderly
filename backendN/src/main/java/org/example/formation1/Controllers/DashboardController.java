package org.example.formation1.Controllers;

import org.example.formation1.Models.ReservationModel;
import org.example.formation1.Repositories.ReservationRepository;
import org.example.formation1.Repositories.UserRepository;
import org.example.formation1.Repositories.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private VoyageRepository voyageRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Compter les réservations
        long totalReservations = reservationRepository.count();
        
        // Compter les voyages actifs
        long totalVoyages = voyageRepository.count();
        
        // Compter les clients (users avec role CLIENT)
        long totalClients = userRepository.countByRole("CLIENT");
        
        // Calculer le revenu total (nombre de réservations payées)
        List<ReservationModel> allReservations = reservationRepository.findAll();
        double totalRevenue = allReservations.stream()
            .filter(r -> r.getPaid() != null && r.getPaid())
            .count() * 1000.0; // Estimation: 1000 DT par réservation
        
        stats.put("totalReservations", totalReservations);
        stats.put("totalVoyages", totalVoyages);
        stats.put("totalClients", totalClients);
        stats.put("totalRevenue", totalRevenue);
        
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/recent-reservations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRecentReservations() {
        // Récupérer les 10 dernières réservations
        List<ReservationModel> recentReservations = reservationRepository
            .findAll()
            .stream()
            .sorted((r1, r2) -> Long.compare(r2.getId(), r1.getId())) // Tri par ID décroissant
            .limit(10)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(recentReservations);
    }

    @GetMapping("/pending-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getPendingReservationsCount() {
        // Compter les réservations non confirmées (confirm = false ou null)
        long pendingCount = reservationRepository.findAll()
            .stream()
            .filter(r -> r.getConfirm() == null || !r.getConfirm())
            .count();
        
        Map<String, Long> response = new HashMap<>();
        response.put("count", pendingCount);
        
        return ResponseEntity.ok(response);
    }
}
