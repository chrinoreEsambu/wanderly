package org.example.formation1.Services;

import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.util.Random;

@Service
public class StorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service.key}")
    private String supabaseServiceKey;

    @Value("${supabase.bucket}")
    private String bucketName;

    private final OkHttpClient client = new OkHttpClient();

    /**
     * Upload un fichier vers Supabase Storage
     * @param file Le fichier MultipartFile à uploader
     * @return Le nom du fichier uploadé
     */
    public String store(MultipartFile file) {
        try {
            // Générer un nom de fichier unique
            String fileName = Integer.toString(new Random().nextInt(1000000000));
            String ext = file.getOriginalFilename().substring(file.getOriginalFilename().indexOf('.'));
            String name = file.getOriginalFilename().substring(0, file.getOriginalFilename().indexOf('.'));
            String uniqueFilename = name + fileName + ext;

            // Construire l'URL de l'API Supabase Storage
            String uploadUrl = String.format("%s/storage/v1/object/%s/%s", 
                supabaseUrl, bucketName, uniqueFilename);

            // Préparer le body de la requête
            RequestBody requestBody = RequestBody.create(
                file.getBytes(), 
                MediaType.parse(file.getContentType())
            );

            // Créer la requête POST avec authentification (utiliser service_role pour upload)
            Request request = new Request.Builder()
                .url(uploadUrl)
                .header("Authorization", "Bearer " + supabaseServiceKey)
                .header("apikey", supabaseServiceKey)
                .header("Content-Type", file.getContentType())
                .post(requestBody)
                .build();

            // Exécuter la requête
            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful()) {
                    System.err.println("❌ Erreur upload Supabase: " + response.code() + " - " + response.body().string());
                    throw new RuntimeException("Failed to upload to Supabase Storage");
                }
                System.out.println("✅ Fichier uploadé vers Supabase: " + uniqueFilename);
                return uniqueFilename;
            }

        } catch (Exception e) {
            System.err.println("❌ Erreur lors de l'upload: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("FAIL! Upload to Supabase failed: " + e.getMessage());
        }
    }

    /**
     * Récupère l'URL publique d'un fichier depuis Supabase Storage
     * @param filename Le nom du fichier
     * @return Une Resource pointant vers l'URL publique
     */
    public Resource loadFile(String filename) {
        try {
            // Construire l'URL publique du fichier
            String publicUrl = String.format("%s/storage/v1/object/public/%s/%s", 
                supabaseUrl, bucketName, filename);
            
            System.out.println("🔗 URL publique Supabase: " + publicUrl);
            
            Resource resource = new UrlResource(publicUrl);
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                System.err.println("❌ Fichier introuvable: " + filename);
                throw new RuntimeException("File not found in Supabase Storage: " + filename);
            }
        } catch (MalformedURLException e) {
            System.err.println("❌ URL malformée: " + e.getMessage());
            throw new RuntimeException("Invalid Supabase URL: " + e.getMessage());
        }
    }
}
