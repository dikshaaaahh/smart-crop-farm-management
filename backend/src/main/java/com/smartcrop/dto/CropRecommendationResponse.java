package com.smartcrop.dto;

import java.util.ArrayList;
import java.util.List;

public class CropRecommendationResponse {

    private Long cropId;
    private String cropName;
    private String scientificName;
    private String category;
    private int suitabilityScore; // 0 to 100
    private String matchGrade; // Highly Recommended, Recommended, Moderately Suitable, Risky
    private String waterRequirement;
    private String suitableSeasons;
    private String suitableSoils;
    private String durationDays;

    // Explainable reasons list
    private List<String> reasons = new ArrayList<>();
    // Specific risk warnings (water deficit, season mismatch)
    private List<String> warnings = new ArrayList<>();

    // Economic projections for the specified land area
    private Double estimatedYieldQuintals;
    private Double estimatedGrossRevenue;
    private Double estimatedCultivationCost;
    private Double estimatedNetProfit;
    private Double profitMarginPercent;

    private List<String> keyPractices = new ArrayList<>();

    public CropRecommendationResponse() {}

    public Long getCropId() {
        return cropId;
    }

    public void setCropId(Long cropId) {
        this.cropId = cropId;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getScientificName() {
        return scientificName;
    }

    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getSuitabilityScore() {
        return suitabilityScore;
    }

    public void setSuitabilityScore(int suitabilityScore) {
        this.suitabilityScore = suitabilityScore;
    }

    public String getMatchGrade() {
        return matchGrade;
    }

    public void setMatchGrade(String matchGrade) {
        this.matchGrade = matchGrade;
    }

    public String getWaterRequirement() {
        return waterRequirement;
    }

    public void setWaterRequirement(String waterRequirement) {
        this.waterRequirement = waterRequirement;
    }

    public String getSuitableSeasons() {
        return suitableSeasons;
    }

    public void setSuitableSeasons(String suitableSeasons) {
        this.suitableSeasons = suitableSeasons;
    }

    public String getSuitableSoils() {
        return suitableSoils;
    }

    public void setSuitableSoils(String suitableSoils) {
        this.suitableSoils = suitableSoils;
    }

    public String getDurationDays() {
        return durationDays;
    }

    public void setDurationDays(String durationDays) {
        this.durationDays = durationDays;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    public Double getEstimatedYieldQuintals() {
        return estimatedYieldQuintals;
    }

    public void setEstimatedYieldQuintals(Double estimatedYieldQuintals) {
        this.estimatedYieldQuintals = estimatedYieldQuintals;
    }

    public Double getEstimatedGrossRevenue() {
        return estimatedGrossRevenue;
    }

    public void setEstimatedGrossRevenue(Double estimatedGrossRevenue) {
        this.estimatedGrossRevenue = estimatedGrossRevenue;
    }

    public Double getEstimatedCultivationCost() {
        return estimatedCultivationCost;
    }

    public void setEstimatedCultivationCost(Double estimatedCultivationCost) {
        this.estimatedCultivationCost = estimatedCultivationCost;
    }

    public Double getEstimatedNetProfit() {
        return estimatedNetProfit;
    }

    public void setEstimatedNetProfit(Double estimatedNetProfit) {
        this.estimatedNetProfit = estimatedNetProfit;
    }

    public Double getProfitMarginPercent() {
        return profitMarginPercent;
    }

    public void setProfitMarginPercent(Double profitMarginPercent) {
        this.profitMarginPercent = profitMarginPercent;
    }

    public List<String> getKeyPractices() {
        return keyPractices;
    }

    public void setKeyPractices(List<String> keyPractices) {
        this.keyPractices = keyPractices;
    }
}
