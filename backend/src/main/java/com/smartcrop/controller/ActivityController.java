package com.smartcrop.controller;

import com.smartcrop.entity.ActivityStatus;
import com.smartcrop.entity.CropActivity;
import com.smartcrop.service.ActivityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    public ResponseEntity<List<CropActivity>> getAllActivities(
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) String cropName,
            @RequestParam(required = false) ActivityStatus status) {

        if (farmId != null) {
            return ResponseEntity.ok(activityService.getActivitiesByFarm(farmId));
        } else if (cropName != null && !cropName.trim().isEmpty()) {
            return ResponseEntity.ok(activityService.getActivitiesByCrop(cropName));
        } else if (status != null) {
            return ResponseEntity.ok(activityService.getActivitiesByStatus(status));
        }
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CropActivity> getActivityById(@PathVariable Long id) {
        return ResponseEntity.ok(activityService.getActivityById(id));
    }

    @PostMapping
    public ResponseEntity<CropActivity> createActivity(@Valid @RequestBody CropActivity activity) {
        CropActivity saved = activityService.createActivity(activity);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CropActivity> updateActivity(@PathVariable Long id, @Valid @RequestBody CropActivity activity) {
        return ResponseEntity.ok(activityService.updateActivity(id, activity));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<CropActivity> updateStatus(@PathVariable Long id, @RequestParam ActivityStatus status) {
        return ResponseEntity.ok(activityService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}
