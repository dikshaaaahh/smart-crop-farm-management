package com.smartcrop.service;

import com.smartcrop.dto.CropRecommendationRequest;
import com.smartcrop.dto.CropRecommendationResponse;
import com.smartcrop.entity.*;
import com.smartcrop.repository.CropRepository;
import com.smartcrop.repository.FarmRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CropRecommendationService {

    private final CropRepository cropRepository;
    private final FarmRepository farmRepository;

    public CropRecommendationService(CropRepository cropRepository, FarmRepository farmRepository) {
        this.cropRepository = cropRepository;
        this.farmRepository = farmRepository;
    }

    public List<CropRecommendationResponse> recommendCrops(CropRecommendationRequest request) {
        // If farmId is supplied, auto-fill farm parameters if missing
        if (request.getFarmId() != null) {
            farmRepository.findById(request.getFarmId()).ifPresent(farm -> {
                if (request.getSoilType() == null) request.setSoilType(farm.getSoilType());
                if (request.getWaterAvailability() == null) request.setWaterAvailability(farm.getWaterAvailability());
                if (request.getIrrigationSource() == null) request.setIrrigationSource(farm.getIrrigationSource());
                if (request.getLandAreaAcres() == null || request.getLandAreaAcres() <= 0) {
                    request.setLandAreaAcres(farm.getTotalAreaAcres());
                }
            });
        }

        double area = (request.getLandAreaAcres() != null && request.getLandAreaAcres() > 0)
                ? request.getLandAreaAcres() : 1.0;

        List<Crop> allCrops = cropRepository.findAll();
        List<CropRecommendationResponse> responseList = new ArrayList<>();

        for (Crop crop : allCrops) {
            CropRecommendationResponse res = evaluateCrop(crop, request, area);
            responseList.add(res);
        }

        // Sort descending by suitability score
        return responseList.stream()
                .sorted(Comparator.comparingInt(CropRecommendationResponse::getSuitabilityScore).reversed())
                .collect(Collectors.toList());
    }

    private CropRecommendationResponse evaluateCrop(Crop crop, CropRecommendationRequest req, double area) {
        CropRecommendationResponse res = new CropRecommendationResponse();
        res.setCropId(crop.getId());
        res.setCropName(crop.getName());
        res.setScientificName(crop.getScientificName());
        res.setCategory(crop.getCategory());
        res.setWaterRequirement(crop.getWaterRequirement().getDisplayName());
        res.setSuitableSeasons(crop.getSuitableSeasons());
        res.setSuitableSoils(crop.getSuitableSoils());
        res.setDurationDays(crop.getDurationDaysMin() + " - " + crop.getDurationDaysMax() + " days");

        int score = 0;
        List<String> reasons = new ArrayList<>();
        List<String> warnings = new ArrayList<>();

        // 1. Soil Match Evaluation (Max 35 points)
        String soils = crop.getSuitableSoils().toUpperCase();
        String userSoil = req.getSoilType().name();
        if (soils.contains(userSoil)) {
            score += 35;
            reasons.add(String.format("Soil Compatibility: %s provides the optimal drainage, pH balance, and nutrient retention for %s root growth.",
                    req.getSoilType().getDisplayName(), crop.getName()));
        } else if ((userSoil.equals("LOAMY") || userSoil.equals("ALLUVIAL")) && (soils.contains("LOAMY") || soils.contains("ALLUVIAL"))) {
            score += 25;
            reasons.add(String.format("Soil Adaptability: %s is versatile and supports %s with good organic soil preparation.",
                    req.getSoilType().getDisplayName(), crop.getName()));
        } else {
            score += 10;
            warnings.add(String.format("Soil Texture Advisory: %s is not the primary ideal soil for %s. Yield may decrease unless amended with organic manure and proper drainage.",
                    req.getSoilType().getDisplayName(), crop.getName()));
        }

        // 2. Season Match Evaluation (Max 35 points)
        String seasons = crop.getSuitableSeasons().toUpperCase();
        String userSeason = req.getSeason().name();
        if (seasons.contains(userSeason) || seasons.contains("ALL_SEASON")) {
            score += 35;
            reasons.add(String.format("Seasonal Alignment: %s climate matches the required temperature and photoperiod for %s.",
                    req.getSeason().getDisplayName(), crop.getName()));
        } else {
            score += 5;
            warnings.add(String.format("Season Risk: %s is traditionally not a %s crop. Extreme temperatures or off-season rains could impact flowering and yield.",
                    crop.getName(), req.getSeason().getDisplayName()));
        }

        // 3. Water & Irrigation Evaluation (Max 30 points)
        WaterAvailability farmWater = req.getWaterAvailability();
        WaterAvailability cropWater = crop.getWaterRequirement();

        if (cropWater == WaterAvailability.VERY_HIGH || cropWater == WaterAvailability.HIGH) {
            if (farmWater == WaterAvailability.HIGH) {
                score += 30;
                reasons.add(String.format("Water Security: Ample irrigation matches the high evapotranspiration demand of %s.", crop.getName()));
            } else if (farmWater == WaterAvailability.MODERATE) {
                score += 18;
                reasons.add(String.format("Water Feasibility: Moderate water supply can support %s with disciplined scheduling and mulching.", crop.getName()));
                warnings.add(String.format("Irrigation Alert: Ensure continuous water during critical flowering and grain-filling stages to prevent yield loss."));
            } else {
                score -= 20; // Heavy penalty
                warnings.add(String.format("Critical Water Deficit: %s requires high water, but farm availability is %s. High risk of crop failure without assured supplementary water.",
                        crop.getName(), farmWater.getDisplayName()));
            }
        } else if (cropWater == WaterAvailability.MODERATE) {
            if (farmWater == WaterAvailability.HIGH || farmWater == WaterAvailability.MODERATE) {
                score += 30;
                reasons.add(String.format("Water Balance: Available irrigation comfortably satisfies the moderate moisture requirements of %s.", crop.getName()));
            } else {
                score += 15;
                warnings.add("Moderate Water Alert: Monitor dry spells; supplemental irrigation during flowering is advisable.");
            }
        } else { // Crop is LOW / Drought tolerant
            score += 30;
            if (farmWater == WaterAvailability.LOW || farmWater == WaterAvailability.RAINFED_ONLY) {
                score += 5; // Bonus for resilience
                reasons.add(String.format("Drought Resilience: %s is a hardy crop that thrives in low water conditions, making it an excellent risk-mitigating choice.", crop.getName()));
            } else {
                reasons.add(String.format("Water Efficiency: %s has low water requirements, saving water and pumping costs.", crop.getName()));
            }
        }

        // 4. Budget & Cost Advisory
        if ("LOW".equalsIgnoreCase(req.getBudgetLevel()) && crop.getCostOfCultivationPerAcre() > 18000) {
            score -= 10;
            warnings.add(String.format("Input Cost Advisory: Estimated cultivation cost is ₹%.0f/acre. Requires careful budgeting for seeds and fertilizers.",
                    crop.getCostOfCultivationPerAcre()));
        }

        // Clamp score between 10 and 98
        score = Math.max(10, Math.min(score, 98));
        res.setSuitabilityScore(score);

        // Assign match grade
        if (score >= 80) {
            res.setMatchGrade("Highly Recommended");
        } else if (score >= 65) {
            res.setMatchGrade("Recommended");
        } else if (score >= 50) {
            res.setMatchGrade("Moderately Suitable");
        } else {
            res.setMatchGrade("Risky / Low Suitability");
        }

        // 5. Economic projections
        double totalYield = Math.round(crop.getAvgYieldPerAcreQuintals() * area * 10.0) / 10.0;
        double grossRevenue = Math.round(totalYield * crop.getMarketPricePerQuintal());
        double totalCost = Math.round(crop.getCostOfCultivationPerAcre() * area);
        double netProfit = grossRevenue - totalCost;
        double profitMargin = totalCost > 0 ? Math.round((netProfit / totalCost) * 1000.0) / 10.0 : 0.0;

        res.setEstimatedYieldQuintals(totalYield);
        res.setEstimatedGrossRevenue(grossRevenue);
        res.setEstimatedCultivationCost(totalCost);
        res.setEstimatedNetProfit(netProfit);
        res.setProfitMarginPercent(profitMargin);

        // Actionable agronomic tips
        List<String> practices = new ArrayList<>();
        practices.add("Apply recommended basal fertilizers during final field preparation.");
        practices.add("Follow certified seed spacing for optimal plant population.");
        if (crop.getWaterRequirement() == WaterAvailability.HIGH || crop.getWaterRequirement() == WaterAvailability.VERY_HIGH) {
            practices.add("Install moisture conservation mulching or alternate-furrow irrigation.");
        }
        res.setKeyPractices(practices);
        res.setReasons(reasons);
        res.setWarnings(warnings);

        return res;
    }
}
