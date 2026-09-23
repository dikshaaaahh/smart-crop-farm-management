package com.smartcrop.entity;

public enum SoilType {
    ALLUVIAL("Alluvial Soil"),
    BLACK("Black / Regur Soil"),
    RED("Red & Yellow Soil"),
    CLAY("Clayey Soil"),
    SANDY("Sandy Soil"),
    LOAMY("Loamy Soil"),
    SILT("Silt Soil"),
    LATERITE("Laterite Soil");

    private final String displayName;

    SoilType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static SoilType fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return LOAMY;
        }
        for (SoilType b : SoilType.values()) {
            if (b.name().equalsIgnoreCase(text.trim()) || b.displayName.equalsIgnoreCase(text.trim())) {
                return b;
            }
        }
        return LOAMY;
    }
}
