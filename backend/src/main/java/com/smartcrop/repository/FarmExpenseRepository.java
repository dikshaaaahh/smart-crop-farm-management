package com.smartcrop.repository;

import com.smartcrop.entity.ExpenseCategory;
import com.smartcrop.entity.FarmExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FarmExpenseRepository extends JpaRepository<FarmExpense, Long> {
    List<FarmExpense> findAllByOrderByExpenseDateDesc();
    List<FarmExpense> findByFarmIdOrderByExpenseDateDesc(Long farmId);
    List<FarmExpense> findByCategoryOrderByExpenseDateDesc(ExpenseCategory category);
    List<FarmExpense> findTop5ByOrderByExpenseDateDesc();

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM FarmExpense e")
    Double getTotalExpenseAmount();

    @Query("SELECT e.category, SUM(e.amount) FROM FarmExpense e GROUP BY e.category")
    List<Object[]> getExpenseSumByCategory();
}
