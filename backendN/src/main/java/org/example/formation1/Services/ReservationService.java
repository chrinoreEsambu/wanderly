package org.example.formation1.Services;

import org.example.formation1.Models.ReservationModel;
import org.example.formation1.Repositories.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    public ReservationModel createReservation(ReservationModel reservationModel) {
        return reservationRepository.save(reservationModel);
    }
    public ReservationModel updateReservation(ReservationModel reservationModel) {
        return reservationRepository.save(reservationModel);
    }
    public ReservationModel getOneReservation(Long id) {
        return reservationRepository.findById(id).orElse(null);

    }
    public List<ReservationModel> getAllReservations() {
        return reservationRepository.findAll();
    }
    public void DeleteReservation(Long id) {
        reservationRepository.deleteById(id);
    }

}
