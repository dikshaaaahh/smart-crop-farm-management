package com.smartcrop.dto;

import com.smartcrop.entity.IrrigationSource;
import com.smartcrop.entity.Season;
import com.smartcrop.entity.SoilType;
import com.smartcrop.entity.WaterAvailability;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class CropRecommendationRequest {

    private Long farmId;

    @NotNull(message = "Soil type is required")
    private SoilType soilType;

    @NotNull(message = "Season is required")
    private Season season;

    @NotNull(message = "Land area is required")
    @DecimalMin(value = "0.1", message = "Land area must be at least 0.1 acres")
    private Double landAreaAcres = 1.0;

    private IrrigationSource irrigationSource = IrrigationSource.BOREWELL;

    @NotNull(message = "Water availability is required")
    private WaterAvailability waterAvailability = WaterAvailability.MODERATE;

    private String budgetLevel = "MODERATE"; // LOW, MODERATE, HIGH
    private String previousCrop;

    public CropRecommendationRequest() {}

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public SoilType getSoilType() {
        return soilType;
    }

    public void setSoilType(SoilType soilType) {
        this.soilType = soilType;
    }

    public Season getSeason() {
        return season;
    }

    public void setSeason(Season season) {
        this.season = season;
    }

    public Double getLandAreaAcres() {
        return landAreaAcres;
    }

    public void setLandAreaAcres(Double landAreaAcres) {
        this.landAreaAcres = landAreaAcres;
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

    public String getBudgetLevel() {
        return budgetLevel;
    }

    public void setBudgetLevel(String budgetLevel) {
        this.budgetLevel = budgetLevel;
    }

    public String getPreviousCrop() {
        return previousCrop;
    }

    public void setPreviousCrop(String previousCrop) {
        this.previousCrop = previousCrop;
    }
}
