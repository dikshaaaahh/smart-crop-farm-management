package com.smartcrop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "crop_activities")
public class CropActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "farm_id")
    private Long farmId;

    @Column(name = "farm_name")
    private String farmName;

    @NotBlank(message = "Crop name is required")
    @Column(name = "crop_name", nullable = false)
    private String cropName;

    @NotBlank(message = "Activity title is required")
    @Column(name = "activity_name", nullable = false)
    private String activityName;

    @NotNull(message = "Activity category is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityCategory category;

    @NotNull(message = "Activity date is required")
    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    @NotNull(message = "Activity status is required")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityStatus status;

    @Column(name = "cost")
    private Double cost;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public CropActivity() {
        this.createdAt = LocalDateTime.now();
        this.status = ActivityStatus.PLANNED;
    }

    public CropActivity(Long farmId, String farmName, String cropName, String activityName,
                        ActivityCategory category, LocalDate activityDate, ActivityStatus status,
                        Double cost, String description) {
        this.farmId = farmId;
        this.farmName = farmName;
        this.cropName = cropName;
        this.activityName = activityName;
        this.category = category;
        this.activityDate = activityDate;
        this.status = status != null ? status : ActivityStatus.PLANNED;
        this.cost = cost != null ? cost : 0.0;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = ActivityStatus.PLANNED;
        }
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public String getFarmName() {
        return farmName;
    }

    public void setFarmName(String farmName) {
        this.farmName = farmName;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getActivityName() {
        return activityName;
    }

    public void setActivityName(String activityName) {
        this.activityName = activityName;
    }

    public ActivityCategory getCategory() {
        return category;
    }

    public void setCategory(ActivityCategory category) {
        this.category = category;
    }

    public LocalDate getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(LocalDate activityDate) {
        this.activityDate = activityDate;
    }

    public ActivityStatus getStatus() {
        return status;
    }

    public void setStatus(ActivityStatus status) {
        this.status = status;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
