package com.smartcrop.service;

import com.smartcrop.entity.ActivityStatus;
import com.smartcrop.entity.CropActivity;
import com.smartcrop.entity.Farm;
import com.smartcrop.exception.ResourceNotFoundException;
import com.smartcrop.repository.CropActivityRepository;
import com.smartcrop.repository.FarmRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    private final CropActivityRepository activityRepository;
    private final FarmRepository farmRepository;

    public ActivityService(CropActivityRepository activityRepository, FarmRepository farmRepository) {
        this.activityRepository = activityRepository;
        this.farmRepository = farmRepository;
    }

    public List<CropActivity> getAllActivities() {
        return activityRepository.findAllByOrderByActivityDateDesc();
    }

    public List<CropActivity> getActivitiesByFarm(Long farmId) {
        return activityRepository.findByFarmIdOrderByActivityDateDesc(farmId);
    }

    public List<CropActivity> getActivitiesByCrop(String cropName) {
        return activityRepository.findByCropNameIgnoreCaseOrderByActivityDateDesc(cropName);
    }

    public List<CropActivity> getActivitiesByStatus(ActivityStatus status) {
        return activityRepository.findByStatusOrderByActivityDateAsc(status);
    }

    public CropActivity getActivityById(Long id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
    }

    public CropActivity createActivity(CropActivity activity) {
        if (activity.getFarmId() != null && (activity.getFarmName() == null || activity.getFarmName().isEmpty())) {
            farmRepository.findById(activity.getFarmId())
                    .map(Farm::getName)
                    .ifPresent(activity::setFarmName);
        }
        return activityRepository.save(activity);
    }

    public CropActivity updateActivity(Long id, CropActivity details) {
        CropActivity activity = getActivityById(id);
        activity.setFarmId(details.getFarmId());
        activity.setFarmName(details.getFarmName());
        activity.setCropName(details.getCropName());
        activity.setActivityName(details.getActivityName());
        activity.setCategory(details.getCategory());
        activity.setActivityDate(details.getActivityDate());
        activity.setStatus(details.getStatus());
        activity.setCost(details.getCost());
        activity.setDescription(details.getDescription());
        return activityRepository.save(activity);
    }

    public CropActivity updateStatus(Long id, ActivityStatus status) {
        CropActivity activity = getActivityById(id);
        activity.setStatus(status);
        return activityRepository.save(activity);
    }

    public void deleteActivity(Long id) {
        CropActivity activity = getActivityById(id);
        activityRepository.delete(activity);
    }
}
