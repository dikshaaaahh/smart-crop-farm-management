package com.smartcrop.repository;

import com.smartcrop.entity.LabourRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LabourRecordRepository extends JpaRepository<LabourRecord, Long> {

    List<LabourRecord> findByLabourerNameContainingIgnoreCase(String labourerName);

    List<LabourRecord> findByWorkDate(LocalDate workDate);
}