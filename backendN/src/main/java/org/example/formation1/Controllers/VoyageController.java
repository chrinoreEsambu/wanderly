package org.example.formation1.Controllers;

import jakarta.websocket.server.PathParam;
import org.example.formation1.Models.CategoryModel;
import org.example.formation1.Models.VoyageModel;
import org.example.formation1.Services.CategoryService;
import org.example.formation1.Services.StorageService;
import org.example.formation1.Services.VoyageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/voyage")
@CrossOrigin("*")
public class VoyageController {

    @Autowired
    private VoyageService voyageService;
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private StorageService storageService;

    @PostMapping("/create/{idcategory}")
    public VoyageModel createVoyage(
            @ModelAttribute VoyageModel voyageModel,
            @RequestParam("file") MultipartFile file,
            @PathVariable Long idcategory
    ) {
        CategoryModel mycategory = categoryService.getOneCategory(idcategory);
        voyageModel.setCategory(mycategory);

        String namephoto = storageService.store(file);
        voyageModel.setPhoto(namephoto);

        return voyageService.createVoyage(voyageModel);
    }

    @GetMapping("/list")
    public List<VoyageModel> getList() {
        return voyageService.getAllVoyages();
    }

    @GetMapping("/getOne/{id}")
    public VoyageModel getOne(@PathVariable Long id) {
        return voyageService.getVoyageById(id);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<VoyageModel> update(
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "date", required = false) String date,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @PathVariable Long id
    ) {
        VoyageModel old = voyageService.getVoyageById(id);
        if (old == null) {
            return ResponseEntity.notFound().build(); // Retourne 404 si non trouvé
        }

        if (name != null) old.setName(name);
        if (date != null) old.setDate(date);
        if (file != null) {
            String namephoto = storageService.store(file);
            old.setPhoto(namephoto);
        }

        VoyageModel updated = voyageService.updateVoyage(old);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        voyageService.deleteVoyageById(id);
        return ResponseEntity.ok("Delete success");
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