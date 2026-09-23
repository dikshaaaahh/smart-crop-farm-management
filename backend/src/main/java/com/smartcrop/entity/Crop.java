package com.smartcrop.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crops")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(name = "scientific_name")
    private String scientificName;

    @Column(nullable = false)
    private String category; // Cereal, Pulse, Oilseed, Cash Crop, Vegetable

    @Column(name = "suitable_seasons", nullable = false)
    private String suitableSeasons; // e.g. "KHARIF,RABI" or "RABI"

    @Column(name = "suitable_soils", nullable = false)
    private String suitableSoils; // e.g. "LOAMY,CLAY,ALLUVIAL"

    @Enumerated(EnumType.STRING)
    @Column(name = "water_requirement", nullable = false)
    private WaterAvailability waterRequirement; // HIGH, MODERATE, LOW, RAINFED_ONLY

    @Column(name = "optimal_min_temp")
    private Double optimalMinTemp;

    @Column(name = "optimal_max_temp")
    private Double optimalMaxTemp;

    @Column(name = "duration_days_min")
    private Integer durationDaysMin;

    @Column(name = "duration_days_max")
    private Integer durationDaysMax;

    @Column(name = "avg_yield_per_acre_quintals")
    private Double avgYieldPerAcreQuintals;

    @Column(name = "market_price_per_quintal")
    private Double marketPricePerQuintal;

    @Column(name = "cost_of_cultivation_per_acre")
    private Double costOfCultivationPerAcre;

    @Column(name = "description", length = 2000)
    private String description;

    @Column(name = "npk_ratio")
    private String npkRatio; // e.g. "120:60:40"

    @Column(name = "standard_fertilizer_note", length = 1500)
    private String standardFertilizerNote;

    @Column(name = "irrigation_guidance_note", length = 1500)
    private String irrigationGuidanceNote;

    public Crop() {
    }

    public Crop(String name, String scientificName, String category, String suitableSeasons,
                String suitableSoils, WaterAvailability waterRequirement,
                Double optimalMinTemp, Double optimalMaxTemp, Integer durationDaysMin,
                Integer durationDaysMax, Double avgYieldPerAcreQuintals, Double marketPricePerQuintal,
                Double costOfCultivationPerAcre, String description, String npkRatio,
                String standardFertilizerNote, String irrigationGuidanceNote) {
        this.name = name;
        this.scientificName = scientificName;
        this.category = category;
        this.suitableSeasons = suitableSeasons;
        this.suitableSoils = suitableSoils;
        this.waterRequirement = waterRequirement;
        this.optimalMinTemp = optimalMinTemp;
        this.optimalMaxTemp = optimalMaxTemp;
        this.durationDaysMin = durationDaysMin;
        this.durationDaysMax = durationDaysMax;
        this.avgYieldPerAcreQuintals = avgYieldPerAcreQuintals;
        this.marketPricePerQuintal = marketPricePerQuintal;
        this.costOfCultivationPerAcre = costOfCultivationPerAcre;
        this.description = description;
        this.npkRatio = npkRatio;
        this.standardFertilizerNote = standardFertilizerNote;
        this.irrigationGuidanceNote = irrigationGuidanceNote;
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

    public WaterAvailability getWaterRequirement() {
        return waterRequirement;
    }

    public void setWaterRequirement(WaterAvailability waterRequirement) {
        this.waterRequirement = waterRequirement;
    }

    public Double getOptimalMinTemp() {
        return optimalMinTemp;
    }

    public void setOptimalMinTemp(Double optimalMinTemp) {
        this.optimalMinTemp = optimalMinTemp;
    }

    public Double getOptimalMaxTemp() {
        return optimalMaxTemp;
    }

    public void setOptimalMaxTemp(Double optimalMaxTemp) {
        this.optimalMaxTemp = optimalMaxTemp;
    }

    public Integer getDurationDaysMin() {
        return durationDaysMin;
    }

    public void setDurationDaysMin(Integer durationDaysMin) {
        this.durationDaysMin = durationDaysMin;
    }

    public Integer getDurationDaysMax() {
        return durationDaysMax;
    }

    public void setDurationDaysMax(Integer durationDaysMax) {
        this.durationDaysMax = durationDaysMax;
    }

    public Double getAvgYieldPerAcreQuintals() {
        return avgYieldPerAcreQuintals;
    }

    public void setAvgYieldPerAcreQuintals(Double avgYieldPerAcreQuintals) {
        this.avgYieldPerAcreQuintals = avgYieldPerAcreQuintals;
    }

    public Double getMarketPricePerQuintal() {
        return marketPricePerQuintal;
    }

    public void setMarketPricePerQuintal(Double marketPricePerQuintal) {
        this.marketPricePerQuintal = marketPricePerQuintal;
    }

    public Double getCostOfCultivationPerAcre() {
        return costOfCultivationPerAcre;
    }

    public void setCostOfCultivationPerAcre(Double costOfCultivationPerAcre) {
        this.costOfCultivationPerAcre = costOfCultivationPerAcre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getNpkRatio() {
        return npkRatio;
    }

    public void setNpkRatio(String npkRatio) {
        this.npkRatio = npkRatio;
    }

    public String getStandardFertilizerNote() {
        return standardFertilizerNote;
    }

    public void setStandardFertilizerNote(String standardFertilizerNote) {
        this.standardFertilizerNote = standardFertilizerNote;
    }

    public String getIrrigationGuidanceNote() {
        return irrigationGuidanceNote;
    }

    public void setIrrigationGuidanceNote(String irrigationGuidanceNote) {
        this.irrigationGuidanceNote = irrigationGuidanceNote;
    }
}
