package com.smartcrop.service;

import com.smartcrop.dto.DashboardStatsDto;
import com.smartcrop.entity.ActivityStatus;
import com.smartcrop.entity.Farm;
import com.smartcrop.repository.CropActivityRepository;
import com.smartcrop.repository.CropRepository;
import com.smartcrop.repository.FarmExpenseRepository;
import com.smartcrop.repository.FarmRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final FarmRepository farmRepository;
    private final CropRepository cropRepository;
    private final CropActivityRepository activityRepository;
    private final FarmExpenseRepository expenseRepository;
    private final ExpenseService expenseService;

    public DashboardService(FarmRepository farmRepository,
                            CropRepository cropRepository,
                            CropActivityRepository activityRepository,
                            FarmExpenseRepository expenseRepository,
                            ExpenseService expenseService) {
        this.farmRepository = farmRepository;
        this.cropRepository = cropRepository;
        this.activityRepository = activityRepository;
        this.expenseRepository = expenseRepository;
        this.expenseService = expenseService;
    }

    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        List<Farm> farms = farmRepository.findAll();
        stats.setTotalFarms(farms.size());

        double totalArea = farms.stream()
                .mapToDouble(Farm::getTotalAreaAcres)
                .sum();
        stats.setTotalFarmAreaAcres(Math.round(totalArea * 10.0) / 10.0);

        // Collect unique active crops across farms
        Set<String> activeCropNames = new HashSet<>();
        for (Farm f : farms) {
            if (f.getActiveCrops() != null && !f.getActiveCrops().trim().isEmpty()) {
                String[] parts = f.getActiveCrops().split(",");
                for (String p : parts) {
                    if (!p.trim().isEmpty()) {
                        activeCropNames.add(p.trim());
                    }
                }
            }
        }
        stats.setActiveCrops(new ArrayList<>(activeCropNames));

        stats.setTotalActivities(activityRepository.count());
        stats.setPendingActivities(activityRepository.countByStatus(ActivityStatus.PLANNED)
                + activityRepository.countByStatus(ActivityStatus.IN_PROGRESS));
        stats.setCompletedActivities(activityRepository.countByStatus(ActivityStatus.COMPLETED));

        // Expenses
        Map<String, Object> expenseSummary = expenseService.getExpenseSummary();
        stats.setTotalExpenses((Double) expenseSummary.get("totalExpenses"));
        stats.setTopExpenseCategory((String) expenseSummary.get("topCategory"));

        @SuppressWarnings("unchecked")
        Map<String, Double> breakdown = (Map<String, Double>) expenseSummary.get("categoryBreakdown");
        stats.setExpensesByCategory(breakdown);

        // Recent items
        stats.setUpcomingActivities(activityRepository.findTop5ByOrderByActivityDateDesc());
        stats.setRecentExpenses(expenseRepository.findTop5ByOrderByExpenseDateDesc());

        return stats;
    }
}
