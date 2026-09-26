package com.smartcrop.service;

import com.smartcrop.entity.LabourRecord;
import com.smartcrop.repository.LabourRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LabourRecordService {

    private final LabourRecordRepository labourRecordRepository;

    public LabourRecordService(LabourRecordRepository labourRecordRepository) {
        this.labourRecordRepository = labourRecordRepository;
    }

    public List<LabourRecord> getAllRecords() {
        return labourRecordRepository.findAll();
    }

    public LabourRecord getRecordById(Long id) {
        return labourRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Labour record not found"));
    }

    public LabourRecord createRecord(LabourRecord record) {
        return labourRecordRepository.save(record);
    }

    public LabourRecord updateRecord(Long id, LabourRecord updatedRecord) {
        LabourRecord existingRecord = getRecordById(id);

        existingRecord.setLabourerName(updatedRecord.getLabourerName());
        existingRecord.setWorkDate(updatedRecord.getWorkDate());
        existingRecord.setWorkDescription(updatedRecord.getWorkDescription());
        existingRecord.setAmount(updatedRecord.getAmount());
        existingRecord.setNotes(updatedRecord.getNotes());

        return labourRecordRepository.save(existingRecord);
    }

    public void deleteRecord(Long id) {
        LabourRecord record = getRecordById(id);
        labourRecordRepository.delete(record);
    }

    public List<LabourRecord> searchByName(String name) {
        return labourRecordRepository.findByLabourerNameContainingIgnoreCase(name);
    }

    public List<LabourRecord> searchByDate(LocalDate date) {
        return labourRecordRepository.findByWorkDate(date);
    }
}