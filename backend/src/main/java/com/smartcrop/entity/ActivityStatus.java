package com.smartcrop.entity;

public enum ActivityStatus {
    PLANNED("Planned"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled");

    private final String displayName;

    ActivityStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ActivityStatus fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return PLANNED;
        }
        for (ActivityStatus s : ActivityStatus.values()) {
            if (s.name().equalsIgnoreCase(text.trim()) || s.displayName.equalsIgnoreCase(text.trim())) {
                return s;
            }
        }
        return PLANNED;
    }
}
