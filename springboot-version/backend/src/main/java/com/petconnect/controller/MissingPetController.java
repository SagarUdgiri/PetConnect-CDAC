package com.petconnect.controller;

import com.petconnect.dto.ContactRequest;
import com.petconnect.dto.ContactResponse;
import com.petconnect.dto.MissingPetRequest;
import com.petconnect.dto.MissingPetResponse;
import com.petconnect.security.UserDetailsImpl;
import com.petconnect.service.MissingPetService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/missing-pets")
@RequiredArgsConstructor
public class MissingPetController {
    private final MissingPetService missingPetService;

    @GetMapping("/my-reports")
    public ResponseEntity<List<MissingPetResponse>> getMyReports(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        return ResponseEntity.ok(
                missingPetService.getReportsByUser(userDetails.getId())
        );
    }
    
    @PostMapping("/{userId}")
    public ResponseEntity<MissingPetResponse> createReport(
            @PathVariable @Positive(message = "User Id must be a positive number") Long userId,
            @RequestBody @Valid MissingPetRequest request) {
        return ResponseEntity.ok(missingPetService.createReport(userId, request));
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<?> deleteReport(
            @PathVariable @Positive(message = "Report Id must be positive") Long reportId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        missingPetService.deleteReport(reportId, userDetails.getId());
        return ResponseEntity.ok(Map.of("message", "Report deleted successfully"));
    }
    
    @GetMapping("/nearby/{userId}")
    public ResponseEntity<List<MissingPetResponse>> getNearbyReports(
            @PathVariable @Positive(message = "User Id must be a positive number") Long userId,
            @RequestParam(defaultValue = "10.0") @Positive(message = "Radius must be positive") Double radius) {
        return ResponseEntity.ok(missingPetService.getNearbyReports(userId, radius));
    }

    @PostMapping("/{reportId}/contact")
    public ResponseEntity<?> contactReporter(
            @PathVariable @Positive(message = "Report Id must be positive") Long reportId,
            @RequestBody @Valid ContactRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(Map.of("message",
                missingPetService.contactReporter(reportId, userDetails.getId(), request.getMessage())));
    }

    @GetMapping("/{reportId}/contacts")
    public ResponseEntity<List<ContactResponse>> getContacts(
            @PathVariable @Positive(message = "Report Id must be positive") Long reportId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(missingPetService.getContactsForReport(reportId, userDetails.getId()));
    }
}
