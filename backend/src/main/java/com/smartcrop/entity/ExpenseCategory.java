package com.smartcrop.entity;

public enum ExpenseCategory {
    SEEDS("Seeds & Seedlings"),
    FERTILIZERS("Fertilizers & Nutrients"),
    PESTICIDES("Pesticides & Crop Protection"),
    IRRIGATION("Irrigation & Fuel/Electricity"),
    LABOUR("Labour Wages"),
    MACHINERY("Machinery & Tractor Rental"),
    TRANSPORT("Transport & Logistics"),
    OTHER("Miscellaneous & Tools");

    private final String displayName;

    ExpenseCategory(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static ExpenseCategory fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return OTHER;
        }
        for (ExpenseCategory c : ExpenseCategory.values()) {
            if (c.name().equalsIgnoreCase(text.trim()) || c.displayName.equalsIgnoreCase(text.trim())) {
                return c;
            }
        }
        return OTHER;
    }
}
