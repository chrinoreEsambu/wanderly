package org.example.formation1.security.services;
import org.example.formation1.Models.RefreshTokenmodel;
import org.example.formation1.Repositories.RefreshTokenRepository;
import org.example.formation1.Repositories.ReservationRepository;
import org.example.formation1.Repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.example.formation1.Repositories.RefreshTokenRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
  @Value("${app.jwtRefreshExpirationMs}")
  private Long refreshTokenDurationMs;

  @Autowired
  private RefreshTokenRepository refreshTokenRepository;

  @Autowired
  private UserRepository userRepository;

  public Optional<RefreshTokenmodel> findByToken(String token) {
    return refreshTokenRepository.findByToken(token);
  }

  public RefreshTokenmodel createRefreshToken(Long userId) {
    // Supprimer l'ancien refresh token s'il existe (OneToOne relation)
    deleteByUserId(userId);
    
    RefreshTokenmodel refreshToken = new RefreshTokenmodel();

    refreshToken.setUser(userRepository.findById(userId).get());
    refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
    refreshToken.setToken(UUID.randomUUID().toString());

    refreshToken = refreshTokenRepository.save(refreshToken);
    System.out.println("✅ Nouveau refresh token créé pour user ID: " + userId);
    return refreshToken;
  }

  public RefreshTokenmodel verifyExpiration(RefreshTokenmodel token) {
    if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
      refreshTokenRepository.delete(token);
     // throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
      throw new RuntimeException("failed");
    }

    return token;
  }

  @Transactional
  public int deleteByUserId(Long userId) {
    return refreshTokenRepository.deleteByUser(userRepository.findById(userId).get());
  }
}
