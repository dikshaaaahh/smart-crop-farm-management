package com.smartcrop.controller;

import com.smartcrop.dto.FertilizerGuidanceRequest;
import com.smartcrop.dto.FertilizerGuidanceResponse;
import com.smartcrop.service.FertilizerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fertilizer")
@CrossOrigin(origins = "*")
public class FertilizerController {

    private final FertilizerService fertilizerService;

    public FertilizerController(FertilizerService fertilizerService) {
        this.fertilizerService = fertilizerService;
    }

    @PostMapping("/guidance")
    public ResponseEntity<FertilizerGuidanceResponse> getGuidance(
            @Valid @RequestBody FertilizerGuidanceRequest request) {
        FertilizerGuidanceResponse response = fertilizerService.getFertilizerGuidance(request);
        return ResponseEntity.ok(response);
    }
}
