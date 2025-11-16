package org.example.formation1.Services;


import org.example.formation1.Models.CategoryModel;
import org.example.formation1.Repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    //PUBLIC TYPErETOUR NOMfONCTION ( TYPE PARAM ...)

    public CategoryModel createCategory(CategoryModel category) {
        return categoryRepository.save(category);
    }


    public CategoryModel updateCategory(CategoryModel category) {
        return categoryRepository.save(category);
    }

    public CategoryModel  getOneCategory (Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public List<CategoryModel> getAllCategories() {
        return categoryRepository.findAll();
    }

    public void deleteCategory(Long id) {
        CategoryModel category = categoryRepository.findById(id).orElse(null);
        if (category != null) {
            System.out.println("=== SUPPRESSION CATÉGORIE ===");
            System.out.println("Category ID: " + id);
            System.out.println("Name: " + category.getName());
            
            // Supprimer d'abord les voyages liés
            if (category.getVoyageModelList() != null && !category.getVoyageModelList().isEmpty()) {
                System.out.println("🗑️ Suppression de " + category.getVoyageModelList().size() + " voyage(s) lié(s)");
                category.getVoyageModelList().clear();
                categoryRepository.save(category);
            }
            
            // Maintenant supprimer la catégorie
            categoryRepository.deleteById(id);
            System.out.println("✓ Catégorie supprimée");
        }
    }
}
