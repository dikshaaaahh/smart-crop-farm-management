package com.smartcrop.controller;

import com.smartcrop.entity.Crop;
import com.smartcrop.exception.ResourceNotFoundException;
import com.smartcrop.repository.CropRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@CrossOrigin(origins = "*")
public class CropController {

    private final CropRepository cropRepository;

    public CropController(CropRepository cropRepository) {
        this.cropRepository = cropRepository;
    }

    @GetMapping
    public ResponseEntity<List<Crop>> getAllCrops() {
        return ResponseEntity.ok(cropRepository.findAllByOrderByNameAsc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Crop> getCropById(@PathVariable Long id) {
        Crop crop = cropRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with id: " + id));
        return ResponseEntity.ok(crop);
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<Crop> getCropByName(@PathVariable String name) {
        Crop crop = cropRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new ResourceNotFoundException("Crop not found with name: " + name));
        return ResponseEntity.ok(crop);
    }
}
