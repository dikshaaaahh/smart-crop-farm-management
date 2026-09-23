package com.smartcrop.entity;

public enum ActivityCategory {
    LAND_PREPARATION("Land Preparation & Tillage"),
    SOWING("Sowing & Planting"),
    IRRIGATION("Irrigation"),
    FERTILIZATION("Fertilizer Application"),
    WEEDING("Weeding & Intercultural"),
    PEST_CONTROL("Pest & Disease Control"),
    HARVESTING("Harvesting"),
    POST_HARVEST("Post-Harvest Processing");

    private final String displayName;

    ActivityCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ActivityCategory fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return SOWING;
        }
        for (ActivityCategory c : ActivityCategory.values()) {
            if (c.name().equalsIgnoreCase(text.trim()) || c.displayName.equalsIgnoreCase(text.trim())) {
                return c;
            }
        }
        return SOWING;
    }
}
