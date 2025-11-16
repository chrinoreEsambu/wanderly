package org.example.formation1.Services;

import org.example.formation1.Models.VoyageModel;
import org.example.formation1.Repositories.VoyageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VoyageService {
@Autowired
    private VoyageRepository voyageRepository;

public VoyageModel createVoyage(VoyageModel voyage) {
    return voyageRepository.save(voyage);
}

public List<VoyageModel> getAllVoyages() {
    return voyageRepository.findAll();
}
public VoyageModel getVoyageById(Long id) {
    return voyageRepository.findById(id).orElse(null);
}
public VoyageModel updateVoyage(VoyageModel voyage) {
    return voyageRepository.save(voyage);
}
public void deleteVoyageById(Long id) {
    voyageRepository.deleteById(id);
}
}
