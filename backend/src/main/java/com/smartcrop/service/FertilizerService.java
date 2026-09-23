package com.smartcrop.service;

import com.smartcrop.dto.FertilizerGuidanceRequest;
import com.smartcrop.dto.FertilizerGuidanceResponse;
import com.smartcrop.entity.Crop;
import com.smartcrop.entity.SoilType;
import com.smartcrop.repository.CropRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FertilizerService {

    private final CropRepository cropRepository;

    public FertilizerService(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    public FertilizerGuidanceResponse getFertilizerGuidance(FertilizerGuidanceRequest request) {
        double area = (request.getLandAreaAcres() != null && request.getLandAreaAcres() > 0)
                ? request.getLandAreaAcres() : 1.0;

        Optional<Crop> cropOpt = cropRepository.findByNameIgnoreCase(request.getCropName());
        String npkStr = cropOpt.map(Crop::getNpkRatio).orElse("100:50:40");

        String[] npkParts = npkStr.split(":");
        double nReqPerHa = npkParts.length > 0 ? Double.parseDouble(npkParts[0].trim()) : 100;
        double pReqPerHa = npkParts.length > 1 ? Double.parseDouble(npkParts[1].trim()) : 50;
        double kReqPerHa = npkParts.length > 2 ? Double.parseDouble(npkParts[2].trim()) : 40;

        // 1 Hectare = 2.471 Acres. So Requirement per Acre:
        double nPerAcre = nReqPerHa / 2.471;
        double pPerAcre = pReqPerHa / 2.471;
        double kPerAcre = kReqPerHa / 2.471;

        // Soil adjustment factors
        SoilType soil = request.getSoilType();
        if (soil == SoilType.SANDY) {
            // Sandy soil leaches nitrogen quickly
            nPerAcre *= 1.15;
        } else if (soil == SoilType.BLACK) {
            // Black soil has good potash, might need slight phosphorus boost
            pPerAcre *= 1.10;
        } else if (soil == SoilType.RED) {
            // Red soil is often slightly deficient in phosphorus and nitrogen
            pPerAcre *= 1.15;
            nPerAcre *= 1.10;
        }

        // Commercial fertilizer calculations:
        // DAP (18-46-0): provides P2O5 and some N
        double dapKgPerAcre = (pPerAcre / 0.46);
        double nSuppliedByDap = dapKgPerAcre * 0.18;

        // Remaining N supplied by Urea (46% N)
        double remainingN = Math.max(0, nPerAcre - nSuppliedByDap);
        double ureaKgPerAcre = (remainingN / 0.46);

        // K supplied by MOP (Muriate of Potash - 60% K2O)
        double mopKgPerAcre = (kPerAcre / 0.60);

        // Scale by farm land area
        double totalUreaKg = Math.round(ureaKgPerAcre * area * 10.0) / 10.0;
        double totalDapKg = Math.round(dapKgPerAcre * area * 10.0) / 10.0;
        double totalMopKg = Math.round(mopKgPerAcre * area * 10.0) / 10.0;

        double ureaBags = Math.round((totalUreaKg / 50.0) * 10.0) / 10.0;
        double dapBags = Math.round((totalDapKg / 50.0) * 10.0) / 10.0;
        double mopBags = Math.round((totalMopKg / 50.0) * 10.0) / 10.0;

        FertilizerGuidanceResponse response = new FertilizerGuidanceResponse();
        response.setCropName(request.getCropName());
        response.setSoilType(request.getSoilType().getDisplayName());
        response.setGrowthStage(request.getGrowthStage());
        response.setLandAreaAcres(area);
        response.setRecommendedNpk(String.format("N:P:K = %.0f:%.0f:%.0f kg/ha (Adjusted: %.1f:%.1f:%.1f kg/acre)",
                nReqPerHa, pReqPerHa, kReqPerHa, nPerAcre, pPerAcre, kPerAcre));

        response.setUreaKg(totalUreaKg);
        response.setUreaBags50kg(ureaBags);
        response.setDapKg(totalDapKg);
        response.setDapBags50kg(dapBags);
        response.setMopKg(totalMopKg);
        response.setMopBags50kg(mopBags);

        // Application Schedule
        List<FertilizerGuidanceResponse.StageSchedule> schedule = new ArrayList<>();
        schedule.add(new FertilizerGuidanceResponse.StageSchedule(
                "Basal (At Sowing / Final Tillage)",
                "Full DAP + Full MOP + 1/3rd Urea",
                String.format("%.1f kg DAP, %.1f kg MOP, %.1f kg Urea", totalDapKg, totalMopKg, totalUreaKg * 0.33),
                "Incorporate into soil at 5-7 cm depth before seed placement."));

        schedule.add(new FertilizerGuidanceResponse.StageSchedule(
                "Vegetative / Tillering (25-35 DAS)",
                "1/3rd Urea + Micronutrient foliar",
                String.format("%.1f kg Urea", totalUreaKg * 0.33),
                "Top-dress after irrigation or when soil is moist. Avoid waterlogged standing water."));

        schedule.add(new FertilizerGuidanceResponse.StageSchedule(
                "Flowering / Panicle Initiation (50-65 DAS)",
                "Final 1/3rd Urea",
                String.format("%.1f kg Urea", totalUreaKg * 0.34),
                "Apply uniformly during early morning or late afternoon followed by light irrigation."));

        response.setApplicationSchedule(schedule);

        // Micronutrients
        if (soil == SoilType.SANDY || soil == SoilType.BLACK) {
            response.setMicronutrientsAdvice(String.format("Zinc deficiency is common in %s soil. Apply 10 kg Zinc Sulphate (ZnSO4 21%%) per acre as basal dose or spray 0.5%% ZnSO4 + 0.25%% lime during vegetative stage.", soil.getDisplayName()));
        } else {
            response.setMicronutrientsAdvice("Apply 5 kg Zinc Sulphate and 2 kg Boron per acre during land preparation to boost kernel/grain formation.");
        }

        // Organic Alternatives
        List<String> organics = new ArrayList<>();
        organics.add(String.format("Well-decomposed Farmyard Manure (FYM): Apply %.1f tonnes (approx 4-5 tonnes/acre) 2-3 weeks before sowing.", area * 4.5));
        organics.add(String.format("Vermicompost: Apply %.1f quintals (approx 8-10 quintals/acre) in the seed furrow for intense microbial activity.", area * 8.0));
        organics.add("Biofertilizers: Seed treatment with Azotobacter / Rhizobium (200g/10kg seed) and PSB (Phosphate Solubilizing Bacteria).");
        organics.add("Neem Cake: Apply 100 kg/acre to naturally inhibit nitrogen leaching and repel soil nematodes.");
        response.setOrganicAlternatives(organics);

        // Safety & Best Practices
        List<String> tips = new ArrayList<>();
        tips.add("Always apply chemical fertilizers when soil is moist; never apply on bone-dry soil.");
        tips.add("Do not mix DAP and lime or Zinc Sulphate directly together as phosphorus becomes fixed.");
        if (soil == SoilType.SANDY) {
            tips.add("In sandy soils, split urea into 3-4 micro-doses instead of 2 to avoid nitrogen leaching into groundwater.");
        }
        tips.add("Wear protective gloves and mask when broadcasting chemical fertilizers.");
        response.setSafetyAndBestPractices(tips);

        return response;
    }
}
