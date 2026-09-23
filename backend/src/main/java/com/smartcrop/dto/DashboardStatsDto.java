package com.smartcrop.dto;

import com.smartcrop.entity.CropActivity;
import com.smartcrop.entity.FarmExpense;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {

    private long totalFarms;
    private Double totalFarmAreaAcres;
    private long totalActivities;
    private long pendingActivities;
    private long completedActivities;
    private Double totalExpenses;
    private String topExpenseCategory;
    private Map<String, Double> expensesByCategory = new HashMap<>();
    private List<CropActivity> upcomingActivities = new ArrayList<>();
    private List<FarmExpense> recentExpenses = new ArrayList<>();
    private List<String> activeCrops = new ArrayList<>();

    public DashboardStatsDto() {}

    public long getTotalFarms() {
        return totalFarms;
    }

    public void setTotalFarms(long totalFarms) {
        this.totalFarms = totalFarms;
    }

    public Double getTotalFarmAreaAcres() {
        return totalFarmAreaAcres;
    }

    public void setTotalFarmAreaAcres(Double totalFarmAreaAcres) {
        this.totalFarmAreaAcres = totalFarmAreaAcres;
    }

    public long getTotalActivities() {
        return totalActivities;
    }

    public void setTotalActivities(long totalActivities) {
        this.totalActivities = totalActivities;
    }

    public long getPendingActivities() {
        return pendingActivities;
    }

    public void setPendingActivities(long pendingActivities) {
        this.pendingActivities = pendingActivities;
    }

    public long getCompletedActivities() {
        return completedActivities;
    }

    public void setCompletedActivities(long completedActivities) {
        this.completedActivities = completedActivities;
    }

    public Double getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(Double totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public String getTopExpenseCategory() {
        return topExpenseCategory;
    }

    public void setTopExpenseCategory(String topExpenseCategory) {
        this.topExpenseCategory = topExpenseCategory;
    }

    public Map<String, Double> getExpensesByCategory() {
        return expensesByCategory;
    }

    public void setExpensesByCategory(Map<String, Double> expensesByCategory) {
        this.expensesByCategory = expensesByCategory;
    }

    public List<CropActivity> getUpcomingActivities() {
        return upcomingActivities;
    }

    public void setUpcomingActivities(List<CropActivity> upcomingActivities) {
        this.upcomingActivities = upcomingActivities;
    }

    public List<FarmExpense> getRecentExpenses() {
        return recentExpenses;
    }

    public void setRecentExpenses(List<FarmExpense> recentExpenses) {
        this.recentExpenses = recentExpenses;
    }

    public List<String> getActiveCrops() {
        return activeCrops;
    }

    public void setActiveCrops(List<String> activeCrops) {
        this.activeCrops = activeCrops;
    }
}
