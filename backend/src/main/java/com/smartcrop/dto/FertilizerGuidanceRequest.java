package com.smartcrop.dto;

import com.smartcrop.entity.SoilType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class FertilizerGuidanceRequest {

    @NotBlank(message = "Crop name is required")
    private String cropName;

    @NotNull(message = "Soil type is required")
    private SoilType soilType;

    @DecimalMin(value = "0.1", message = "Land area must be at least 0.1 acres")
    private Double landAreaAcres = 1.0;

    private String growthStage = "Basal / Sowing"; // Basal, Vegetative, Flowering, Maturity

    private Boolean organicPreference = false;

    public FertilizerGuidanceRequest() {}

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public SoilType getSoilType() {
        return soilType;
    }

    public void setSoilType(SoilType soilType) {
        this.soilType = soilType;
    }

    public Double getLandAreaAcres() {
        return landAreaAcres;
    }

    public void setLandAreaAcres(Double landAreaAcres) {
        this.landAreaAcres = landAreaAcres;
    }

    public String getGrowthStage() {
        return growthStage;
    }

    public void setGrowthStage(String growthStage) {
        this.growthStage = growthStage;
    }

    public Boolean getOrganicPreference() {
        return organicPreference;
    }

    public void setOrganicPreference(Boolean organicPreference) {
        this.organicPreference = organicPreference;
    }
}
