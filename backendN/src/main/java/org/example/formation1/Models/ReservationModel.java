package org.example.formation1.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;


import java.time.LocalDate;

@Entity
@Table(name = "reservation_model")
public class ReservationModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private LocalDate date;
    private Integer nombrePersonnes;

    private Boolean paid = false;
    private Boolean confirm = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;

    @ManyToOne
    @JoinColumn(name = "voyage_id")
    private VoyageModel voyage;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private CategoryModel category;


    public UserModel getUser() {
        return user;
    }

    public void setUser(UserModel client) {
        this.user = client;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Boolean getPaid() {
        return paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public Boolean getConfirm() {
        return confirm;
    }

    public void setConfirm(Boolean confirm) {
        this.confirm = confirm;
    }

    public VoyageModel getVoyage() {
        return voyage;
    }

    public void setVoyage(VoyageModel voyage) {
        this.voyage = voyage;
    }

    public CategoryModel getCategory() {
        return category;
    }

    public void setCategory(CategoryModel category) {
        this.category = category;
    }

    public Integer getNombrePersonnes() {
        return nombrePersonnes;
    }

    public void setNombrePersonnes(Integer nombrePersonnes) {
        this.nombrePersonnes = nombrePersonnes;
    }

    public ReservationModel(LocalDate date, Boolean paid) {
        this.date = date;
        this.paid = paid;
    }

    public ReservationModel() {}
}