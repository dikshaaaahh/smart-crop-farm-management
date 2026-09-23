package com.smartcrop.util;

import com.smartcrop.entity.*;
import com.smartcrop.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final CropRepository cropRepository;
    private final FarmRepository farmRepository;
    private final CropActivityRepository activityRepository;
    private final FarmExpenseRepository expenseRepository;

    public DataInitializer(CropRepository cropRepository,
                           FarmRepository farmRepository,
                           CropActivityRepository activityRepository,
                           FarmExpenseRepository expenseRepository) {
        this.cropRepository = cropRepository;
        this.farmRepository = farmRepository;
        this.activityRepository = activityRepository;
        this.expenseRepository = expenseRepository;
    }

    @Override
    public void run(String... args) {
        seedCrops();
        seedFarms();
        seedActivities();
        seedExpenses();
        log.info("Smart Crop Decision & Farm Management System initialized with sample data successfully.");
    }

    private void seedCrops() {
        if (cropRepository.count() > 0) {
            return;
        }

        List<Crop> crops = Arrays.asList(
                new Crop("Wheat (Gehun)", "Triticum aestivum", "Cereal", "RABI",
                        "LOAMY,ALLUVIAL,CLAY", WaterAvailability.MODERATE,
                        15.0, 25.0, 110, 135, 18.0, 2300.0, 15000.0,
                        "Major staple grain grown during winter season. Prefers well-drained loamy to clay soils and cool weather during vegetative stage.",
                        "120:60:40",
                        "Apply DAP and Potash as basal dose; Urea in two splits at crown root initiation and tillering.",
                        "Requires 4-6 critical irrigations: CRI (21 DAS), Tillering (40 DAS), Flowering (65 DAS), and Dough stage (85 DAS)."),

                new Crop("Rice / Paddy (Dhan)", "Oryza sativa", "Cereal", "KHARIF",
                        "CLAY,ALLUVIAL,SILT", WaterAvailability.VERY_HIGH,
                        22.0, 35.0, 120, 150, 25.0, 2200.0, 21000.0,
                        "Dominant monsoon crop requiring submerged/high-moisture clayey soils with strong water holding capacity.",
                        "100:50:50",
                        "Apply full P and K + 1/3 N at transplanting; top-dress remaining N at active tillering and panicle initiation.",
                        "Keep 2-5 cm standing water until 10 days before harvest. Drainage at physiological maturity enhances grain firmness."),

                new Crop("Maize / Corn (Makka)", "Zea mays", "Cereal", "KHARIF,RABI",
                        "LOAMY,ALLUVIAL,SANDY", WaterAvailability.MODERATE,
                        18.0, 32.0, 95, 115, 22.0, 2050.0, 14000.0,
                        "Versatile cereal crop with high yield potential. Highly sensitive to water-logging; requires well-drained loamy soils.",
                        "120:60:40",
                        "Apply 1/3 N + full P2O5 and K2O at planting; side-dress remaining N at knee-high and tasseling stages.",
                        "Irrigate at critical stages: Knee-high (30 DAS), Tasseling (50 DAS), and Silking/Grain formation (70 DAS)."),

                new Crop("Cotton (Kapas)", "Gossypium hirsutum", "Cash Crop", "KHARIF",
                        "BLACK,ALLUVIAL", WaterAvailability.MODERATE,
                        21.0, 36.0, 150, 180, 10.0, 7100.0, 22500.0,
                        "High-value fiber crop known as 'white gold'. Thrives in deep black cotton soils with good aeration.",
                        "100:50:50",
                        "Apply 20% N + full P & K basal; split remaining N at square formation and peak boll development.",
                        "Critical watering during squaring and boll bursting; avoid irrigation close to boll opening to preserve lint luster."),

                new Crop("Sugarcane (Ganna)", "Saccharum officinarum", "Cash Crop", "ALL_SEASON",
                        "LOAMY,ALLUVIAL,BLACK", WaterAvailability.VERY_HIGH,
                        20.0, 38.0, 300, 360, 350.0, 350.0, 48000.0,
                        "Long duration commercial crop demanding rich soils and high, steady water supply throughout its 10-12 month cycle.",
                        "250:100:120",
                        "Apply 25% N + all P at planting; apply remaining N in 3 split doses up to 120 days after planting.",
                        "Requires frequent irrigations every 8-10 days in summer and 15-20 days in winter. Trash mulching saves up to 30% water."),

                new Crop("Chickpea / Bengal Gram (Chana)", "Cicer arietinum", "Pulse", "RABI",
                        "SANDY,LOAMY,BLACK", WaterAvailability.LOW,
                        10.0, 26.0, 90, 115, 8.5, 5450.0, 11000.0,
                        "Key protein-rich pulse crop that fixes atmospheric nitrogen. Highly drought tolerant, requires little water.",
                        "20:50:20",
                        "Apply single basal dose of DAP and Potash. Treat seeds with Rhizobium culture prior to sowing.",
                        "Requires only 1-2 light irrigations at pre-flowering and pod development. Excess watering leads to vegetative growth and pod drop."),

                new Crop("Mustard / Rapeseed (Sarson)", "Brassica juncea", "Oilseed", "RABI",
                        "LOAMY,SANDY,ALLUVIAL", WaterAvailability.LOW,
                        10.0, 25.0, 105, 125, 8.0, 5650.0, 10500.0,
                        "Leading edible oilseed crop of winter. Requires cool dry weather and well-drained soils.",
                        "80:40:40",
                        "Half N + full P, K, and 20 kg Sulphur at sowing; remaining N at first irrigation (30 DAS).",
                        "2 irrigations are optimal: Rosette stage (28-32 DAS) and siliquae/pod formation stage (55-60 DAS)."),

                new Crop("Soybean", "Glycine max", "Oilseed", "KHARIF",
                        "BLACK,LOAMY", WaterAvailability.MODERATE,
                        20.0, 32.0, 95, 110, 10.0, 4600.0, 13500.0,
                        "Dual-purpose oilseed and legume. Fits well in crop rotation cycles and enriches soil nitrogen.",
                        "30:60:40",
                        "Basal application of full N, P, K + Sulphur (20 kg/acre). Seed inoculation with Rhizobium japonicum.",
                        "Irrigate if dry spell exceeds 15 days during flowering and pod-filling stages."),

                new Crop("Pearl Millet / Bajra", "Pennisetum glaucum", "Cereal", "KHARIF,ZAID",
                        "SANDY,LOAMY,RED", WaterAvailability.LOW,
                        25.0, 40.0, 75, 90, 12.0, 2500.0, 9000.0,
                        "Climate-smart nutritious millet. Thrives in sandy soils and arid/semi-arid rainfall conditions.",
                        "60:30:30",
                        "Apply half N and all P and K at sowing; remaining N at tillering stage.",
                        "Highly drought hardy; 1-2 supplemental irrigations only needed if monsoon fails during earhead emergence."),

                new Crop("Tomato", "Solanum lycopersicum", "Vegetable", "ALL_SEASON",
                        "LOAMY,SANDY,RED", WaterAvailability.MODERATE,
                        18.0, 30.0, 90, 120, 140.0, 1700.0, 35000.0,
                        "Popular horticultural crop offering fast cash returns. Best suited to well-drained sandy loam rich in organic matter.",
                        "150:100:100",
                        "Basal 1/3 N + full P + half K; remaining in equal weekly fertigations or 2-3 top dressings.",
                        "Drip irrigation recommended. Avoid wetting foliage to prevent fungal blight diseases."),

                new Crop("Potato (Aloo)", "Solanum tuberosum", "Vegetable", "RABI",
                        "SANDY,LOAMY,ALLUVIAL", WaterAvailability.MODERATE,
                        12.0, 24.0, 85, 110, 100.0, 1350.0, 38000.0,
                        "High-yielding underground tuber crop. Requires loose, porous sandy loam soil for unhindered tuber expansion.",
                        "150:80:100",
                        "Apply half N and full P & K at planting along with earthing-up; remaining N at 30 DAS.",
                        "Frequent light irrigations every 7-10 days; withhold water 10 days before digging to cure tuber skin."),

                new Crop("Groundnut / Peanut", "Arachis hypogaea", "Oilseed", "KHARIF,ZAID",
                        "SANDY,RED,LOAMY", WaterAvailability.LOW,
                        22.0, 33.0, 105, 125, 9.5, 6300.0, 14500.0,
                        "Leguminous oilseed with underground pods. Thrives in light sandy and red soils where pegs can penetrate easily.",
                        "25:50:40",
                        "Apply full N, P, K + Gypsum (200 kg/acre at 40-45 DAS) for pod filling and calcium uptake.",
                        "Irrigate at pegging and pod formation stages. Avoid water-logging.")
        );

        cropRepository.saveAll(crops);
        log.info("Seeded {} agronomic crops.", crops.size());
    }

    private void seedFarms() {
        if (farmRepository.count() > 0) {
            return;
        }

        Farm f1 = new Farm("Green Valley Farm", "Rajesh Sharma", "Nashik, Maharashtra",
                4.5, SoilType.BLACK, IrrigationSource.BOREWELL, WaterAvailability.MODERATE,
                "Wheat (Gehun), Tomato", "Fertile black soil plot with underground pipeline connection.");

        Farm f2 = new Farm("Sunrise Organic Acres", "Sita Devi", "Karnal, Haryana",
                6.0, SoilType.LOAMY, IrrigationSource.CANAL, WaterAvailability.HIGH,
                "Rice / Paddy (Dhan), Mustard / Rapeseed (Sarson)", "Prime alluvial loamy soil with seasonal canal access.");

        farmRepository.saveAll(Arrays.asList(f1, f2));
        log.info("Seeded 2 demo farms.");
    }

    private void seedActivities() {
        if (activityRepository.count() > 0) {
            return;
        }

        List<CropActivity> activities = Arrays.asList(
                new CropActivity(1L, "Green Valley Farm", "Wheat (Gehun)", "Land Preparation & Deep Ploughing",
                        ActivityCategory.LAND_PREPARATION, LocalDate.now().minusDays(20),
                        ActivityStatus.COMPLETED, 2500.0, "Disc ploughing and rotavator leveling before sowing."),

                new CropActivity(1L, "Green Valley Farm", "Wheat (Gehun)", "Basal Fertilizer Application & Sowing",
                        ActivityCategory.SOWING, LocalDate.now().minusDays(15),
                        ActivityStatus.COMPLETED, 3800.0, "Line sowing with seed-cum-fertilizer drill (DAP + MOP)."),

                new CropActivity(1L, "Green Valley Farm", "Wheat (Gehun)", "First Crown Root Irrigation (CRI)",
                        ActivityCategory.IRRIGATION, LocalDate.now().plusDays(2),
                        ActivityStatus.PLANNED, 800.0, "Critical first irrigation at 21 days after sowing."),

                new CropActivity(2L, "Sunrise Organic Acres", "Rice / Paddy (Dhan)", "Puddle Field Preparation",
                        ActivityCategory.LAND_PREPARATION, LocalDate.now().minusDays(40),
                        ActivityStatus.COMPLETED, 4200.0, "Tractor puddling with cage wheels for water retention."),

                new CropActivity(2L, "Sunrise Organic Acres", "Rice / Paddy (Dhan)", "Top Dressing Urea & Weed Control",
                        ActivityCategory.FERTILIZATION, LocalDate.now().minusDays(5),
                        ActivityStatus.COMPLETED, 2100.0, "Broadcasted 45 kg Neem coated urea after weeding."),

                new CropActivity(2L, "Sunrise Organic Acres", "Rice / Paddy (Dhan)", "Scheduled Harvesting & Threshing",
                        ActivityCategory.HARVESTING, LocalDate.now().plusDays(14),
                        ActivityStatus.PLANNED, 6500.0, "Combine harvester booking for mature crop.")
        );

        activityRepository.saveAll(activities);
        log.info("Seeded demo crop activities.");
    }

    private void seedExpenses() {
        if (expenseRepository.count() > 0) {
            return;
        }

        List<FarmExpense> expenses = Arrays.asList(
                new FarmExpense(1L, "Green Valley Farm", "Wheat (Gehun)", ExpenseCategory.SEEDS,
                        2800.0, LocalDate.now().minusDays(16), "Online/UPI", "Certified HD-2967 wheat seeds (40 kg/acre)."),

                new FarmExpense(1L, "Green Valley Farm", "Wheat (Gehun)", ExpenseCategory.FERTILIZERS,
                        4600.0, LocalDate.now().minusDays(15), "Cash", "DAP 2 bags + MOP 1 bag for basal application."),

                new FarmExpense(1L, "Green Valley Farm", "Wheat (Gehun)", ExpenseCategory.MACHINERY,
                        3200.0, LocalDate.now().minusDays(18), "Cash", "Tractor rental with rotavator for 4 hours."),

                new FarmExpense(2L, "Sunrise Organic Acres", "Rice / Paddy (Dhan)", ExpenseCategory.LABOUR,
                        5500.0, LocalDate.now().minusDays(35), "Cash", "Transplanting labour team (6 workers for 2 days)."),

                new FarmExpense(2L, "Sunrise Organic Acres", "Rice / Paddy (Dhan)", ExpenseCategory.FERTILIZERS,
                        3100.0, LocalDate.now().minusDays(6), "Online/UPI", "Neem coated urea bags from cooperative society."),

                new FarmExpense(2L, "Sunrise Organic Acres", "Rice / Paddy (Dhan)", ExpenseCategory.PESTICIDES,
                        1900.0, LocalDate.now().minusDays(10), "Cash", "Bio-fungicide spray against leaf blast prevention.")
        );

        expenseRepository.saveAll(expenses);
        log.info("Seeded demo farm expenses.");
    }
}
