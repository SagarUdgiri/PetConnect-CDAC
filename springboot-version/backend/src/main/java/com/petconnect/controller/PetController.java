package com.petconnect.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petconnect.dto.PetCreateDto;
import com.petconnect.security.UserDetailsImpl;
import com.petconnect.service.PetService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/Pet")
@RequiredArgsConstructor
public class PetController {
    private final PetService petService;

    @GetMapping
    public ResponseEntity<?> getAllPets() {
        return ResponseEntity.ok(petService.getAllPets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPetById(@PathVariable @Positive(message = "Pet Id must be a positive number") Long id) {
        return ResponseEntity.ok(petService.getPetById(id));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid PetCreateDto petDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(petService.registerPet(petDto, userDetails.getId()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getPetsByUser(@PathVariable @Positive(message = "User Id must be a positive number") Long userId) {
        return ResponseEntity.ok(petService.getPetsByUserId(userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePet(@PathVariable @Positive(message = "Pet Id must be a positive number") Long id, @RequestBody @Valid PetCreateDto petDto) {
        return ResponseEntity.ok(petService.updatePet(id, petDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePet(@PathVariable @Positive(message = "Pet Id must be a positive number") Long id) {
        try {
            petService.deletePet(id);
            return ResponseEntity.ok(Map.of("message", "Pet deleted successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message", "Failed to delete pet: " + e.getMessage()));
        }
    }
}
