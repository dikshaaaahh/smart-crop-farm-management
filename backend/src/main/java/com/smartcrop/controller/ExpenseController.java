package com.smartcrop.controller;

import com.smartcrop.entity.ExpenseCategory;
import com.smartcrop.entity.FarmExpense;
import com.smartcrop.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public ResponseEntity<List<FarmExpense>> getAllExpenses(
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) ExpenseCategory category) {

        if (farmId != null) {
            return ResponseEntity.ok(expenseService.getExpensesByFarm(farmId));
        } else if (category != null) {
            return ResponseEntity.ok(expenseService.getExpensesByCategory(category));
        }
        return ResponseEntity.ok(expenseService.getAllExpenses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FarmExpense> getExpenseById(@PathVariable Long id) {
        return ResponseEntity.ok(expenseService.getExpenseById(id));
    }

    @PostMapping
    public ResponseEntity<FarmExpense> createExpense(@Valid @RequestBody FarmExpense expense) {
        FarmExpense saved = expenseService.createExpense(expense);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FarmExpense> updateExpense(@PathVariable Long id, @Valid @RequestBody FarmExpense expense) {
        return ResponseEntity.ok(expenseService.updateExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(expenseService.getExpenseSummary());
    }
}
