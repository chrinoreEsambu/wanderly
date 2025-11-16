package org.example.formation1.Repositories;

import org.example.formation1.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<UserModel, Long> {

    List<UserModel> findAllByRole (String role);
    long countByRole(String role);
    UserModel findFirstByEmail (String email);
    Optional<UserModel> findByUsername(String username);
    //Optional<UserModel> findByIdAndAdress(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    UserModel findByPasswordResetToken(String passwordResetToken);
}
