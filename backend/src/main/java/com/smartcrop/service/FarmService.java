package com.smartcrop.service;

import com.smartcrop.entity.Farm;
import com.smartcrop.exception.ResourceNotFoundException;
import com.smartcrop.repository.FarmRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FarmService {

    private final FarmRepository farmRepository;

    public FarmService(FarmRepository farmRepository) {
        this.farmRepository = farmRepository;
    }

    public List<Farm> getAllFarms() {
        return farmRepository.findAllByOrderByCreatedAtDesc();
    }

    public Farm getFarmById(Long id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farm not found with id: " + id));
    }

    public Farm createFarm(Farm farm) {
        return farmRepository.save(farm);
    }

    public Farm updateFarm(Long id, Farm farmDetails) {
        Farm farm = getFarmById(id);
        farm.setName(farmDetails.getName());
        farm.setOwnerName(farmDetails.getOwnerName());
        farm.setLocation(farmDetails.getLocation());
        farm.setTotalAreaAcres(farmDetails.getTotalAreaAcres());
        farm.setSoilType(farmDetails.getSoilType());
        farm.setIrrigationSource(farmDetails.getIrrigationSource());
        farm.setWaterAvailability(farmDetails.getWaterAvailability());
        farm.setActiveCrops(farmDetails.getActiveCrops());
        farm.setNotes(farmDetails.getNotes());
        return farmRepository.save(farm);
    }

    public void deleteFarm(Long id) {
        Farm farm = getFarmById(id);
        farmRepository.delete(farm);
    }
}
