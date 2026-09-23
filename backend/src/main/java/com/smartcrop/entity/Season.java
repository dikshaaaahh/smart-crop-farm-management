package com.smartcrop.entity;

public enum Season {
    KHARIF("Kharif (Monsoon / Autumn)"),
    RABI("Rabi (Winter / Spring)"),
    ZAID("Zaid (Summer)"),
    ALL_SEASON("All Season / Perennial");

    private final String displayName;

    Season(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static Season fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return KHARIF;
        }
        for (Season s : Season.values()) {
            if (s.name().equalsIgnoreCase(text.trim()) || s.displayName.equalsIgnoreCase(text.trim())) {
                return s;
            }
        }
        return KHARIF;
    }
}
