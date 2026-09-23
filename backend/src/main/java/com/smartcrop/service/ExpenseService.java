package com.smartcrop.service;

import com.smartcrop.entity.ExpenseCategory;
import com.smartcrop.entity.Farm;
import com.smartcrop.entity.FarmExpense;
import com.smartcrop.exception.ResourceNotFoundException;
import com.smartcrop.repository.FarmExpenseRepository;
import com.smartcrop.repository.FarmRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ExpenseService {

    private final FarmExpenseRepository expenseRepository;
    private final FarmRepository farmRepository;

    public ExpenseService(FarmExpenseRepository expenseRepository, FarmRepository farmRepository) {
        this.expenseRepository = expenseRepository;
        this.farmRepository = farmRepository;
    }

    public List<FarmExpense> getAllExpenses() {
        return expenseRepository.findAllByOrderByExpenseDateDesc();
    }

    public List<FarmExpense> getExpensesByFarm(Long farmId) {
        return expenseRepository.findByFarmIdOrderByExpenseDateDesc(farmId);
    }

    public List<FarmExpense> getExpensesByCategory(ExpenseCategory category) {
        return expenseRepository.findByCategoryOrderByExpenseDateDesc(category);
    }

    public FarmExpense getExpenseById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense record not found with id: " + id));
    }

    public FarmExpense createExpense(FarmExpense expense) {
        if (expense.getFarmId() != null && (expense.getFarmName() == null || expense.getFarmName().isEmpty())) {
            farmRepository.findById(expense.getFarmId())
                    .map(Farm::getName)
                    .ifPresent(expense::setFarmName);
        }
        return expenseRepository.save(expense);
    }

    public FarmExpense updateExpense(Long id, FarmExpense details) {
        FarmExpense expense = getExpenseById(id);
        expense.setFarmId(details.getFarmId());
        expense.setFarmName(details.getFarmName());
        expense.setCropName(details.getCropName());
        expense.setCategory(details.getCategory());
        expense.setAmount(details.getAmount());
        expense.setExpenseDate(details.getExpenseDate());
        expense.setPaymentMethod(details.getPaymentMethod());
        expense.setDescription(details.getDescription());
        return expenseRepository.save(expense);
    }

    public void deleteExpense(Long id) {
        FarmExpense expense = getExpenseById(id);
        expenseRepository.delete(expense);
    }

    public Map<String, Object> getExpenseSummary() {
        Double total = expenseRepository.getTotalExpenseAmount();
        List<Object[]> categorySums = expenseRepository.getExpenseSumByCategory();

        Map<String, Double> categoryMap = new HashMap<>();
        String topCategory = "None";
        double maxCatAmount = 0.0;

        for (Object[] row : categorySums) {
            ExpenseCategory cat = (ExpenseCategory) row[0];
            Double sum = (Double) row[1];
            categoryMap.put(cat.name(), sum != null ? sum : 0.0);
            if (sum != null && sum > maxCatAmount) {
                maxCatAmount = sum;
                topCategory = cat.getDisplayName();
            }
        }

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalExpenses", total != null ? total : 0.0);
        summary.put("topCategory", topCategory);
        summary.put("categoryBreakdown", categoryMap);
        return summary;
    }
}
