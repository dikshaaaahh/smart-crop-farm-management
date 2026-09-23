package com.smartcrop.dto;

import java.util.ArrayList;
import java.util.List;

public class FertilizerGuidanceResponse {

    private String cropName;
    private String soilType;
    private String growthStage;
    private Double landAreaAcres;
    private String recommendedNpk; // e.g. "120:60:40 kg/ha"

    // Commercial fertilizer dosages for this area
    private Double ureaKg;
    private Double ureaBags50kg;
    private Double dapKg;
    private Double dapBags50kg;
    private Double mopKg;
    private Double mopBags50kg;

    private String micronutrientsAdvice;
    private List<StageSchedule> applicationSchedule = new ArrayList<>();
    private List<String> organicAlternatives = new ArrayList<>();
    private List<String> safetyAndBestPractices = new ArrayList<>();

    public static class StageSchedule {
        private String stage;
        private String fertilizer;
        private String dosage;
        private String applicationMethod;

        public StageSchedule() {}

        public StageSchedule(String stage, String fertilizer, String dosage, String applicationMethod) {
            this.stage = stage;
            this.fertilizer = fertilizer;
            this.dosage = dosage;
            this.applicationMethod = applicationMethod;
        }

        public String getStage() {
            return stage;
        }

        public void setStage(String stage) {
            this.stage = stage;
        }

        public String getFertilizer() {
            return fertilizer;
        }

        public void setFertilizer(String fertilizer) {
            this.fertilizer = fertilizer;
        }

        public String getDosage() {
            return dosage;
        }

        public void setDosage(String dosage) {
            this.dosage = dosage;
        }

        public String getApplicationMethod() {
            return applicationMethod;
        }

        public void setApplicationMethod(String applicationMethod) {
            this.applicationMethod = applicationMethod;
        }
    }

    public FertilizerGuidanceResponse() {}

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

    public String getGrowthStage() {
        return growthStage;
    }

    public void setGrowthStage(String growthStage) {
        this.growthStage = growthStage;
    }

    public Double getLandAreaAcres() {
        return landAreaAcres;
    }

    public void setLandAreaAcres(Double landAreaAcres) {
        this.landAreaAcres = landAreaAcres;
    }

    public String getRecommendedNpk() {
        return recommendedNpk;
    }

    public void setRecommendedNpk(String recommendedNpk) {
        this.recommendedNpk = recommendedNpk;
    }

    public Double getUreaKg() {
        return ureaKg;
    }

    public void setUreaKg(Double ureaKg) {
        this.ureaKg = ureaKg;
    }

    public Double getUreaBags50kg() {
        return ureaBags50kg;
    }

    public void setUreaBags50kg(Double ureaBags50kg) {
        this.ureaBags50kg = ureaBags50kg;
    }

    public Double getDapKg() {
        return dapKg;
    }

    public void setDapKg(Double dapKg) {
        this.dapKg = dapKg;
    }

    public Double getDapBags50kg() {
        return dapBags50kg;
    }

    public void setDapBags50kg(Double dapBags50kg) {
        this.dapBags50kg = dapBags50kg;
    }

    public Double getMopKg() {
        return mopKg;
    }

    public void setMopKg(Double mopKg) {
        this.mopKg = mopKg;
    }

    public Double getMopBags50kg() {
        return mopBags50kg;
    }

    public void setMopBags50kg(Double mopBags50kg) {
        this.mopBags50kg = mopBags50kg;
    }

    public String getMicronutrientsAdvice() {
        return micronutrientsAdvice;
    }

    public void setMicronutrientsAdvice(String micronutrientsAdvice) {
        this.micronutrientsAdvice = micronutrientsAdvice;
    }

    public List<StageSchedule> getApplicationSchedule() {
        return applicationSchedule;
    }

    public void setApplicationSchedule(List<StageSchedule> applicationSchedule) {
        this.applicationSchedule = applicationSchedule;
    }

    public List<String> getOrganicAlternatives() {
        return organicAlternatives;
    }

    public void setOrganicAlternatives(List<String> organicAlternatives) {
        this.organicAlternatives = organicAlternatives;
    }

    public List<String> getSafetyAndBestPractices() {
        return safetyAndBestPractices;
    }

    public void setSafetyAndBestPractices(List<String> safetyAndBestPractices) {
        this.safetyAndBestPractices = safetyAndBestPractices;
    }
}
