package org.example.formation1.Controllers;



import org.example.formation1.Models.CategoryModel;
import org.example.formation1.Services.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/category")
//securité
@CrossOrigin("*")
public class CategoryController {
    @Autowired
    CategoryService categoryService;

//écrire ds la base
    @PostMapping("/create")
    public CategoryModel create(CategoryModel categoryModel) {
        return categoryService.createCategory(categoryModel);
    }

//récuperer de la base
    @GetMapping("/list")
    public List<CategoryModel> getlist(){
        return categoryService.getAllCategories();

    }

    @GetMapping("/getOne/{id}")
    public CategoryModel getOne(@PathVariable Long id){
        return categoryService.getOneCategory(id);
    }

    //modifier ds la base
    @PutMapping("/update/{id}")
    public CategoryModel update(CategoryModel categoryModel, @PathVariable Long id) {
        categoryModel.setId(id);//savegarde id
        CategoryModel old=categoryService.getOneCategory(id);

        if(categoryModel.getName()==null || categoryModel.getName().isEmpty()){
            categoryModel.setName(old.getName());
        }

        if(categoryModel.getDescription()==null || categoryModel.getDescription().isEmpty()){
            categoryModel.setDescription(old.getDescription());
        }
        return categoryService.updateCategory(categoryModel);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return "Delete success";
    }
}