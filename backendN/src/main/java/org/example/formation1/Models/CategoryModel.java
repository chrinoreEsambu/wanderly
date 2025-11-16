package org.example.formation1.Models;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class CategoryModel {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CategoryModel() {}

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<VoyageModel> voyageModelList;

    @JsonIgnore

    public List<VoyageModel> getVoyageModelList() {
        return voyageModelList;
    }

    public void setVoyageModelList(List<VoyageModel> voyageModelList) {
        this.voyageModelList = voyageModelList;
    }
}