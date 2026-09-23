package com.smartcrop.service;

import com.smartcrop.dto.IrrigationGuidanceRequest;
import com.smartcrop.dto.IrrigationGuidanceResponse;
import com.smartcrop.entity.*;
import com.smartcrop.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class IrrigationService {

    private final CropRepository cropRepository;

    public IrrigationService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public IrrigationGuidanceResponse getIrrigationGuidance(IrrigationGuidanceRequest request) {
        Optional<Crop> cropOpt = cropRepository.findByNameIgnoreCase(request.getCropName());

        WaterAvailability waterReq = cropOpt.map(Crop::getWaterRequirement).orElse(WaterAvailability.MODERATE);

        IrrigationGuidanceResponse res = new IrrigationGuidanceResponse();
        res.setCropName(request.getCropName());
        res.setSoilType(request.getSoilType().getDisplayName());
        res.setSeason(request.getSeason().getDisplayName());
        res.setWaterRequirementCategory(waterReq.getDisplayName());

        // Baseline water requirements in mm
        int baseMm;
        switch (waterReq) {
            case VERY_HIGH:
                baseMm = 1250;
                break;
            case HIGH:
                baseMm = 800;
                break;
            case LOW:
                baseMm = 350;
                break;
            case MODERATE:
            default:
                baseMm = 550;
                break;
        }

        // Season adjustment
        if (request.getSeason() == Season.ZAID) {
            baseMm = (int) (baseMm * 1.25); // Summer has high evapotranspiration
        } else if (request.getSeason() == Season.RABI) {
            baseMm = (int) (baseMm * 0.90); // Winter has lower evaporation
        }
        res.setTotalWaterMm(baseMm + " mm (~" + (baseMm * 10) + " m³/ha)");

        // Interval calculation based on Soil and Season
        int minDays = 7;
        int maxDays = 10;

        // Soil effect
        if (request.getSoilType() == SoilType.SANDY) {
            minDays -= 3;
            maxDays -= 3;
        } else if (request.getSoilType() == SoilType.CLAY || request.getSoilType() == SoilType.BLACK) {
            minDays += 2;
            maxDays += 3;
        }

        // Season effect
        if (request.getSeason() == Season.ZAID) {
            minDays = Math.max(3, minDays - 2);
            maxDays = Math.max(5, maxDays - 2);
        } else if (request.getSeason() == Season.RABI) {
            minDays += 2;
            maxDays += 2;
        }

        res.setRecommendedIntervalDays(String.format("Every %d to %d days", Math.max(2, minDays), Math.max(4, maxDays)));

        // Recommended method
        if (request.getIrrigationSource() == IrrigationSource.DRIP) {
            res.setBestIrrigationMethod("Drip Irrigation (Highly efficient: 90% water use efficiency, delivers directly to the root zone with zero runoff)");
        } else if (request.getIrrigationSource() == IrrigationSource.SPRINKLER) {
            res.setBestIrrigationMethod("Sprinkler Irrigation (Ideal for undulating land, saves 30-40% water compared to flood irrigation)");
        } else {
            if (waterReq == WaterAvailability.LOW || waterReq == WaterAvailability.MODERATE) {
                res.setBestIrrigationMethod("Furrow or Alternate Furrow Irrigation (Saves ~30% water over standard flood irrigation)");
            } else {
                res.setBestIrrigationMethod("Check Basin / Controlled Border Irrigation with leveled field");
            }
        }

        // Water stress warning
        if ((waterReq == WaterAvailability.HIGH || waterReq == WaterAvailability.VERY_HIGH) &&
                (request.getWaterAvailability() == WaterAvailability.LOW || request.getWaterAvailability() == WaterAvailability.RAINFED_ONLY)) {
            res.setWaterStressWarning(String.format("Critical Water Alert: %s has a high water requirement (%s), while your farm water availability is low/rainfed. High risk of moisture stress during flowering. Arrange supplementary tank/tanker irrigation or construct a farm pond.",
                    request.getCropName(), waterReq.getDisplayName()));
        } else {
            res.setWaterStressWarning("Water Balance Normal: Available irrigation is adequate for normal vegetative and reproductive cycles.");
        }

        // Critical growth stages
        List<String> criticalStages = new ArrayList<>();
        criticalStages.add("1. Germination & Crown Root / Seedling Establishment (Water deficit here stunts root development)");
        criticalStages.add("2. Tillering / Branching stage (Crucial for active vegetative biomass)");
        criticalStages.add("3. Flowering / Anthesis / Panicle Emergence (Most critical: drought here causes flower drop and barren ears)");
        criticalStages.add("4. Grain / Fruit filling stage (Moisture needed for kernel plumping and weight)");
        res.setCriticalGrowthStages(criticalStages);

        // Conservation tips
        List<String> tips = new ArrayList<>();
        tips.add("Apply organic mulch (straw, dry leaves) to cut soil surface evaporation by up to 35%.");
        tips.add("Irrigate during early morning or evening hours to minimize evaporation losses from wind and sunlight.");
        tips.add("Avoid standing water logging; good drainage is essential to prevent root rot diseases.");
        tips.add("Consider installing soil moisture sensors or tensiometers to irrigate only when root zone moisture drops below 50%.");
        res.setConservationTips(tips);

        // Soil specific guidance
        List<String> soilTips = new ArrayList<>();
        if (request.getSoilType() == SoilType.SANDY) {
            soilTips.add("Sandy soils have low water holding capacity and high percolation. Use frequent, light irrigations rather than heavy flood watering.");
        } else if (request.getSoilType() == SoilType.BLACK || request.getSoilType() == SoilType.CLAY) {
            soilTips.add("Black/Clay soils have very high moisture retention but crack when dried. Irrigate before deep soil cracking occurs to prevent root shearing.");
        } else {
            soilTips.add("Loamy/Alluvial soil retains moisture evenly. Maintain consistent moisture without causing saturation.");
        }
        res.setSoilSpecificGuidance(soilTips);

        return res;
    }
}
