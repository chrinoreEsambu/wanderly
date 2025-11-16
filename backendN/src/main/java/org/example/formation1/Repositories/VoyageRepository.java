package org.example.formation1.Repositories;

import org.example.formation1.Models.VoyageModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface VoyageRepository extends JpaRepository<VoyageModel, Long> {
}
