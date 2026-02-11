package com.petconnect.controller;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.petconnect.dto.PetDietRequestDto;
import com.petconnect.service.AIService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AIController {
	
	private final AIService aiService;

	@PostMapping(value="/ai/advice",consumes = "multipart/form-data")
	public ResponseEntity<?> getAIAdvice(@RequestPart("image") @NotNull MultipartFile image) throws IOException{
		
		if (image.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }

        if (!image.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }
		
		return ResponseEntity.ok(aiService.getPetAdvice(image));
	}
	
//	@PostMapping("/ai/diet")
//	public ResponseEntity<?> getAIDietResponse(@RequestBody PetDietRequestDto dietRequestDto){
//		String res=aiService.getDiet(dietRequestDto);
//		return ResponseEntity.ok(res);
//	}
	
	@PostMapping("/ai/diet-product")
	public ResponseEntity<?> getAIDietAndProductResponse(@RequestBody @Valid PetDietRequestDto dietRequestDto){
		return ResponseEntity.ok(aiService.getDietandProduct(dietRequestDto));
	}
}
