package com.smartcrop.controller;

import com.smartcrop.dto.CropRecommendationRequest;
import com.smartcrop.dto.CropRecommendationResponse;
import com.smartcrop.service.CropRecommendationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "*")
public class RecommendationController {

    private final CropRecommendationService recommendationService;

    public RecommendationController(CropRecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @PostMapping("/crop")
    public ResponseEntity<List<CropRecommendationResponse>> getRecommendations(
            @Valid @RequestBody CropRecommendationRequest request) {
        List<CropRecommendationResponse> recommendations = recommendationService.recommendCrops(request);
        return ResponseEntity.ok(recommendations);
    }
}
