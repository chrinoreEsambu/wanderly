package org.example.formation1.Repositories;



import org.example.formation1.Models.CategoryModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoryRepository extends JpaRepository<CategoryModel, Long> {
}
