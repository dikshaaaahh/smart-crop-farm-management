package com.smartcrop.dto;

import java.util.ArrayList;
import java.util.List;

public class IrrigationGuidanceResponse {

    private String cropName;
    private String soilType;
    private String season;
    private String waterRequirementCategory; // Low, Moderate, High, Very High
    private String totalWaterMm;
    private String recommendedIntervalDays;
    private String bestIrrigationMethod;
    private String waterStressWarning;
    private List<String> criticalGrowthStages = new ArrayList<>();
    private List<String> conservationTips = new ArrayList<>();
    private List<String> soilSpecificGuidance = new ArrayList<>();

    public IrrigationGuidanceResponse() {}

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getSoilType() {
        return soilType;
    }

    public void setSoilType(String soilType) {
        this.soilType = soilType;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public String getWaterRequirementCategory() {
        return waterRequirementCategory;
    }

    public void setWaterRequirementCategory(String waterRequirementCategory) {
        this.waterRequirementCategory = waterRequirementCategory;
    }

    public String getTotalWaterMm() {
        return totalWaterMm;
    }

    public void setTotalWaterMm(String totalWaterMm) {
        this.totalWaterMm = totalWaterMm;
    }

    public String getRecommendedIntervalDays() {
        return recommendedIntervalDays;
    }

    public void setRecommendedIntervalDays(String recommendedIntervalDays) {
        this.recommendedIntervalDays = recommendedIntervalDays;
    }

    public String getBestIrrigationMethod() {
        return bestIrrigationMethod;
    }

    public void setBestIrrigationMethod(String bestIrrigationMethod) {
        this.bestIrrigationMethod = bestIrrigationMethod;
    }

    public String getWaterStressWarning() {
        return waterStressWarning;
    }

    public void setWaterStressWarning(String waterStressWarning) {
        this.waterStressWarning = waterStressWarning;
    }

    public List<String> getCriticalGrowthStages() {
        return criticalGrowthStages;
    }

    public void setCriticalGrowthStages(List<String> criticalGrowthStages) {
        this.criticalGrowthStages = criticalGrowthStages;
    }

    public List<String> getConservationTips() {
        return conservationTips;
    }

    public void setConservationTips(List<String> conservationTips) {
        this.conservationTips = conservationTips;
    }

    public List<String> getSoilSpecificGuidance() {
        return soilSpecificGuidance;
    }

    public void setSoilSpecificGuidance(List<String> soilSpecificGuidance) {
        this.soilSpecificGuidance = soilSpecificGuidance;
    }
}
