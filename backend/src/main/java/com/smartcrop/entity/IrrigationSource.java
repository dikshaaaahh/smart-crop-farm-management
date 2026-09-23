package com.smartcrop.entity;

public enum IrrigationSource {
    BOREWELL("Borewell / Tube Well"),
    CANAL("Canal Irrigation"),
    DRIP("Drip Irrigation System"),
    SPRINKLER("Sprinkler System"),
    RIVER_OR_POND("River / Farm Pond"),
    RAINFED("Rainfed Only");

    private final String displayName;

    IrrigationSource(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static IrrigationSource fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return BOREWELL;
        }
        for (IrrigationSource s : IrrigationSource.values()) {
            if (s.name().equalsIgnoreCase(text.trim()) || s.displayName.equalsIgnoreCase(text.trim())) {
                return s;
            }
        }
        return BOREWELL;
    }
}
