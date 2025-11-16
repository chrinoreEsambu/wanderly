package org.example.formation1.Services;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.*;

        import java.util.Random;

@Service
public class StorageService {

    private final Path rootLocation = Paths.get("upload");
// le local de enrejoistrelment de photo

    public String store(MultipartFile file) {
        try {
            System.out.println("**root location ****"+this.rootLocation);

            String fileName = Integer.toString(new Random().nextInt(1000000000));
            String ext = file.getOriginalFilename().substring(file.getOriginalFilename().indexOf('.'), file.getOriginalFilename().length());
            String name  = file.getOriginalFilename().substring(0, file.getOriginalFilename().indexOf('.'));
            String original = name + fileName + ext;
            System.out.println("**root location ****"+this.rootLocation.resolve(original));
            System.out.println("**file.getInputStream() ****"+file.getInputStream().toString());
            Files.copy(file.getInputStream(), this.rootLocation.resolve(original));
            //  Files.copy(file.getInputStream(), this.rootLocation.resolve(file.getOriginalFilename()));
            return original;


        } catch (Exception e) {
            throw new RuntimeException("FAIL!");
        }
    }

    public Resource loadFile(String filename) {
        try {
            Path file = rootLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("FAIL!");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("FAIL!");
        }
    }
}
