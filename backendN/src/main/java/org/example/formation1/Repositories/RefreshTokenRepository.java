package org.example.formation1.Repositories;

import org.example.formation1.Models.RefreshTokenmodel;
import org.example.formation1.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshTokenmodel, Long> {

    Optional<RefreshTokenmodel> findByToken(String token);
    @Modifying
    int deleteByUser(UserModel user);
}
