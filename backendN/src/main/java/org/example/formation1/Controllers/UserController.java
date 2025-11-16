package org.example.formation1.Controllers;

import org.example.formation1.Models.RefreshTokenmodel;
import org.example.formation1.Models.UserModel;
import org.example.formation1.Repositories.UserRepository;
import org.example.formation1.Services.StorageService;
import org.example.formation1.Services.UserService;
import org.example.formation1.payload.JwtResponse;
import org.example.formation1.payload.LoginRequest;
import org.example.formation1.payload.MessageResponse;
import org.example.formation1.security.jwt.JwtUtils;
import org.example.formation1.security.services.RefreshTokenService;
import org.example.formation1.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    StorageService storageService;
    @Autowired
    UserRepository userRepo;
    @Autowired
    JavaMailSender mailSender;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    RefreshTokenService refreshTokenService;


   @PostMapping("/create")
    public UserModel create(UserModel user, @RequestParam(value = "file", required = false) MultipartFile file) {
        System.out.println("=== CRÉATION DE COMPTE ===");
        System.out.println("Username: " + user.getUsername());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Role: " + user.getRole());
        
        String namephoto = null;
        if (file != null && !file.isEmpty()) {
            namephoto = storageService.store(file);
            System.out.println("✓ Photo uploadée: " + namephoto);
        }
        
        user.setPhoto(namephoto);
        user.setPassword(encoder.encode(user.getPassword()));
        user.setConfirm(true); // Confirmation automatique
        
        UserModel createdUser = userRepo.save(user);
        System.out.println("✓ Utilisateur créé avec ID: " + createdUser.getId());
        
        return createdUser;
    }

    @GetMapping("/list")
    public List<UserModel> getList() {
        return userService.getAllUsers();
    }

    @GetMapping("/getOne/{id}")
    public UserModel getOne(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update/{id}")
    public UserModel update(
            UserModel user,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @PathVariable Long id
    ) {
        user.setId(id);
        UserModel old = userService.getUserById(id);

        if (file == null || file.isEmpty()) {
            user.setPhoto(old.getPhoto());
        } else {
            String namephoto = storageService.store(file);
            user.setPhoto(namephoto);
        }

        if (user.getFirstName() == null) user.setFirstName(old.getFirstName());
        if (user.getLastName() == null) user.setLastName(old.getLastName());
        if (user.getEmail() == null) user.setEmail(old.getEmail());
        if (user.getPassword() == null) user.setPassword(old.getPassword());
        if (user.getPhone() == null) user.setPhone(old.getPhone());
        if (user.getUsername() == null) user.setUsername(old.getUsername());
        if (user.getRole() == null) user.setRole(old.getRole());
        if (user.getConfirm() == null) user.setConfirm(old.getConfirm());

        return userService.updateUser(user);
    }


    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return "Delete success";
    }

    @GetMapping("/signout")
    public ResponseEntity<?> logoutUser(){
        System.out.println("=== DÉCONNEXION ===");
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            
            if (authentication == null || authentication.getPrincipal() == null) {
                System.out.println("❌ Pas d'authentification trouvée");
                return ResponseEntity.status(401).body(new MessageResponse("Non authentifié"));
            }
            
            Object principal = authentication.getPrincipal();
            System.out.println("✓ Type du principal: " + principal.getClass().getName());
            
            Long userId;
            if (principal instanceof UserDetailsImpl) {
                userId = ((UserDetailsImpl) principal).getId();
            } else {
                System.out.println("❌ Principal n'est pas UserDetailsImpl: " + principal);
                return ResponseEntity.status(401).body(new MessageResponse("Session invalide"));
            }
            
            System.out.println("✓ User ID récupéré: " + userId);
            
            int deletedCount = refreshTokenService.deleteByUserId(userId);
            System.out.println("✅ Refresh tokens supprimés: " + deletedCount);
            
            return ResponseEntity.ok(new MessageResponse("log out successful"));
        } catch (Exception e) {
            System.out.println("❌ ERREUR déconnexion: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(new MessageResponse("Erreur lors de la déconnexion"));
        }
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(
            @RequestParam("username") String username,
            @RequestParam("password") String password){
        System.out.println("=== TENTATIVE DE CONNEXION ===");
        System.out.println("Username reçu: " + username);
        System.out.println("Password reçu: " + password);
        
        try {
            // Vérifier si l'utilisateur existe
            Optional<UserModel> userOpt = userRepo.findByUsername(username);
            if (!userOpt.isPresent()) {
                System.out.println("❌ Utilisateur introuvable: " + username);
                return ResponseEntity.badRequest().body(new MessageResponse("Utilisateur introuvable"));
            }
            
            UserModel user = userOpt.get();
            System.out.println("✓ Utilisateur trouvé: " + user.getUsername());
            System.out.println("✓ Email: " + user.getEmail());
            System.out.println("✓ Role: " + user.getRole());
            System.out.println("✓ Confirm: " + user.getConfirm());
            
            // Authentification Spring Security
            Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(username, password));
            System.out.println("✓ Authentification réussie");
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            
            // Génération des tokens
            String jwt = jwtUtils.generateJwtToken(userDetails);
            System.out.println("✓ JWT généré: " + jwt.substring(0, 20) + "...");
            
            RefreshTokenmodel refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
            System.out.println("✓ Refresh token créé");
            
            return ResponseEntity.ok(
                    new JwtResponse(jwt,
                            "bearer",
                            refreshToken.getToken(),
                            userDetails.getId(),
                            userDetails.getUsername(),
                            userDetails.getEmail(),
                            user.getRole()
                    )
            );
        } catch (Exception e) {
            System.out.println("❌ ERREUR: " + e.getClass().getSimpleName() + " - " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Erreur: " + e.getMessage()));
        }
    }
    @GetMapping("/confirm")
    public ResponseEntity<?> confirm (@RequestParam String email){
        UserModel user =userRepo.findFirstByEmail(email);
        user.setConfirm(true);
        userRepo.save(user);
        return ResponseEntity.ok("is confim");
    }
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.loadFile(filename);
        // Retourner l'image inline (affichage direct) au lieu de attachment (téléchargement)
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/*")
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
}
