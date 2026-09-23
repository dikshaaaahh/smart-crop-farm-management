package com.smartcrop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "farms")
public class Farm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Farm name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Farmer / Owner name is required")
    @Column(name = "owner_name", nullable = false)
    private String ownerName;

    @Column(name = "location")
    private String location;

    @NotNull(message = "Total land area is required")
    @DecimalMin(value = "0.1", message = "Land area must be greater than 0.1 acres")
    @Column(name = "total_area_acres", nullable = false)
    private Double totalAreaAcres;

    @NotNull(message = "Soil type is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "soil_type", nullable = false)
    private SoilType soilType;

    @NotNull(message = "Irrigation source is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "irrigation_source", nullable = false)
    private IrrigationSource irrigationSource;

    @NotNull(message = "Water availability level is required")
    @Enumerated(EnumType.STRING)
    @Column(name = "water_availability", nullable = false)
    private WaterAvailability waterAvailability;

    @Column(name = "active_crops")
    private String activeCrops;

    @Column(name = "notes", length = 1000)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Farm() {
        this.createdAt = LocalDateTime.now();
    }

    public Farm(String name, String ownerName, String location, Double totalAreaAcres,
                SoilType soilType, IrrigationSource irrigationSource,
                WaterAvailability waterAvailability, String activeCrops, String notes) {
        this.name = name;
        this.ownerName = ownerName;
        this.location = location;
        this.totalAreaAcres = totalAreaAcres;
        this.soilType = soilType;
        this.irrigationSource = irrigationSource;
        this.waterAvailability = waterAvailability;
        this.activeCrops = activeCrops;
        this.notes = notes;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getTotalAreaAcres() {
        return totalAreaAcres;
    }

    public void setTotalAreaAcres(Double totalAreaAcres) {
        this.totalAreaAcres = totalAreaAcres;
    }

    public SoilType getSoilType() {
        return soilType;
    }

    public void setSoilType(SoilType soilType) {
        this.soilType = soilType;
    }

    public IrrigationSource getIrrigationSource() {
        return irrigationSource;
    }

    public void setIrrigationSource(IrrigationSource irrigationSource) {
        this.irrigationSource = irrigationSource;
    }

    public WaterAvailability getWaterAvailability() {
        return waterAvailability;
    }

    public void setWaterAvailability(WaterAvailability waterAvailability) {
        this.waterAvailability = waterAvailability;
    }

    public String getActiveCrops() {
        return activeCrops;
    }

    public void setActiveCrops(String activeCrops) {
        this.activeCrops = activeCrops;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
