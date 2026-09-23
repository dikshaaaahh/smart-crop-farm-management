package com.smartcrop.controller;

import com.smartcrop.dto.IrrigationGuidanceRequest;
import com.smartcrop.dto.IrrigationGuidanceResponse;
import com.smartcrop.service.IrrigationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/irrigation")
@CrossOrigin(origins = "*")
public class IrrigationController {

    private final IrrigationService irrigationService;

    public IrrigationController(IrrigationService irrigationService) {
        this.irrigationService = irrigationService;
    }

    @PostMapping("/guidance")
    public ResponseEntity<IrrigationGuidanceResponse> getGuidance(
            @Valid @RequestBody IrrigationGuidanceRequest request) {
        IrrigationGuidanceResponse response = irrigationService.getIrrigationGuidance(request);
        return ResponseEntity.ok(response);
    }
}
