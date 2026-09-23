package com.smartcrop.dto;

import com.smartcrop.entity.IrrigationSource;
import com.smartcrop.entity.Season;
import com.smartcrop.entity.SoilType;
import com.smartcrop.entity.WaterAvailability;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class IrrigationGuidanceRequest {

    @NotBlank(message = "Crop name is required")
    private String cropName;

    @NotNull(message = "Soil type is required")
    private SoilType soilType;

    @NotNull(message = "Season is required")
    private Season season;

    private IrrigationSource irrigationSource = IrrigationSource.BOREWELL;
    private WaterAvailability waterAvailability = WaterAvailability.MODERATE;

    @DecimalMin(value = "0.1", message = "Land area must be at least 0.1 acres")
    private Double landAreaAcres = 1.0;

    public IrrigationGuidanceRequest() {}

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

    public Season getSeason() {
        return season;
    }

    public void setSeason(Season season) {
        this.season = season;
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

    public Double getLandAreaAcres() {
        return landAreaAcres;
    }

    public void setLandAreaAcres(Double landAreaAcres) {
        this.landAreaAcres = landAreaAcres;
    }
}
