package com.smartcrop.repository;

import com.smartcrop.entity.ActivityStatus;
import com.smartcrop.entity.CropActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CropActivityRepository extends JpaRepository<CropActivity, Long> {
    List<CropActivity> findAllByOrderByActivityDateDesc();
    List<CropActivity> findByFarmIdOrderByActivityDateDesc(Long farmId);
    List<CropActivity> findByCropNameIgnoreCaseOrderByActivityDateDesc(String cropName);
    List<CropActivity> findByStatusOrderByActivityDateAsc(ActivityStatus status);
    List<CropActivity> findTop5ByOrderByActivityDateDesc();
    long countByStatus(ActivityStatus status);
    List<CropActivity> findByActivityDateBetweenOrderByActivityDateAsc(LocalDate start, LocalDate end);
}
