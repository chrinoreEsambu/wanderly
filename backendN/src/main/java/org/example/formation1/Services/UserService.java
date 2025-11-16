package org.example.formation1.Services;


import jakarta.annotation.Nullable;
import org.example.formation1.Models.UserModel;
import org.example.formation1.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public UserModel createUser(UserModel user) {
        return userRepository.save(user);
    }
    public List<UserModel> getAllUsers() {
        return userRepository.findAll();
    }
    public UserModel getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    public UserModel updateUser(UserModel userModel) {
        return userRepository.save(userModel);
    }

    public void deleteUser(Long id) {
        UserModel user = userRepository.findById(id).orElse(null);
        if (user != null) {
            System.out.println("=== SUPPRESSION UTILISATEUR ===");
            System.out.println("User ID: " + id);
            System.out.println("Username: " + user.getUsername());
            
            // Supprimer d'abord les réservations liées
            if (user.getReservations() != null && !user.getReservations().isEmpty()) {
                System.out.println("🗑️ Suppression de " + user.getReservations().size() + " réservation(s) liée(s)");
                user.getReservations().clear();
                userRepository.save(user);
            }
            
            // Maintenant supprimer l'utilisateur
            userRepository.deleteById(id);
            System.out.println("✓ Utilisateur supprimé");
        }
    }
}
