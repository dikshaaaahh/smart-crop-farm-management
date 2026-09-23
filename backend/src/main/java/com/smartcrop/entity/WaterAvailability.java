package com.smartcrop.entity;

public enum WaterAvailability {
    VERY_HIGH("Very High / Submerged (Water Intensive)"),
    HIGH("High / Ample (Year-round)"),
    MODERATE("Moderate (Seasonal / Sufficient)"),
    LOW("Low / Scarce"),
    RAINFED_ONLY("Rainfed Only (Monsoon Dependent)");

    private final String displayName;

    WaterAvailability(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static WaterAvailability fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return MODERATE;
        }
        for (WaterAvailability w : WaterAvailability.values()) {
            if (w.name().equalsIgnoreCase(text.trim()) || w.displayName.equalsIgnoreCase(text.trim())) {
                return b(w);
            }
        }
        return MODERATE;
    }

    private static WaterAvailability b(WaterAvailability w) {
        return w;
    }
}
