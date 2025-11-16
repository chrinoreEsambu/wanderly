package org.example.formation1.Models;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class VoyageModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String date ;
    private String photo;

    // URL publique Supabase (non stockée en base, calculée à la volée)
    @Transient
    private String photoUrl;

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public String getPhotoUrl() {
        if (photo != null && !photo.isEmpty()) {
            return "https://nrewphbqaqgjibhakjsy.supabase.co/storage/v1/object/public/voyage-images/" + photo;
        }
        return null;
    }

    @ManyToOne
    @JoinColumn(name="categoryId")
    private CategoryModel category;

    public CategoryModel getCategory() {
        return category;
    }

    public void setCategory(CategoryModel category) {
        this.category = category;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public VoyageModel(String name, String date) {
        this.name = name;
        this.date = date;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }
    public VoyageModel() {

    }
}