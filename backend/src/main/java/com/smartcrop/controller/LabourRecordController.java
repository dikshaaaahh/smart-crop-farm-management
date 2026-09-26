package com.smartcrop.controller;

import com.smartcrop.entity.LabourRecord;
import com.smartcrop.service.LabourRecordService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/labour-records")
@CrossOrigin(origins = "http://localhost:5173")
public class LabourRecordController {

    private final LabourRecordService labourRecordService;

    public LabourRecordController(LabourRecordService labourRecordService) {
        this.labourRecordService = labourRecordService;
    }

    @GetMapping
    public ResponseEntity<List<LabourRecord>> getAllRecords() {
        return ResponseEntity.ok(labourRecordService.getAllRecords());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LabourRecord> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(labourRecordService.getRecordById(id));
    }

    @PostMapping
    public ResponseEntity<LabourRecord> createRecord(
            @Valid @RequestBody LabourRecord record) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(labourRecordService.createRecord(record));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LabourRecord> updateRecord(
            @PathVariable Long id,
            @Valid @RequestBody LabourRecord updatedRecord) {
        return ResponseEntity.ok(
                labourRecordService.updateRecord(id, updatedRecord)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long id) {
        labourRecordService.deleteRecord(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<LabourRecord>> searchByName(
            @RequestParam String name) {
        return ResponseEntity.ok(
                labourRecordService.searchByName(name)
        );
    }

    @GetMapping("/date")
    public ResponseEntity<List<LabourRecord>> searchByDate(
            @RequestParam LocalDate date) {
        return ResponseEntity.ok(
                labourRecordService.searchByDate(date)
        );
    }
}