package com.petconnect.service.impl;

import java.io.IOException;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.content.Media;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.MimeType;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import com.petconnect.dto.AIProductViewDto;
import com.petconnect.dto.PetDietRequestDto;
import com.petconnect.repository.ProductRepository;
import com.petconnect.service.AIService;

@Service
@Transactional
public class AIServiceImpl implements AIService {

    private ChatClient chatClient;
    private final ProductRepository productRepository;

    public AIServiceImpl(ChatClient.Builder builder, ProductRepository productRepository) {
        this.chatClient = builder.build();
        this.productRepository = productRepository;
    }

    @Override
    public String getPetAdvice(MultipartFile image) throws IOException {

        String prompt = """
                You are a veterinary assistant AI.

                Analyze the pet image and return ONLY valid JSON with this exact structure:

                {
                  "animal_type": "",
                  "visible_condition": "",
                  "possible_health_observations": [],
                  "urgency_level": "low | medium | high",
                  "care_advice": [],
                  "disclaimer": ""
                }

                Rules:
                - No disease diagnosis
                - Base answers only on visible features
                - No markdown
                - No extra text
                """;

        MimeType mimeType = MimeTypeUtils.parseMimeType(image.getContentType());

        Media imageMedia = Media.builder()
                .mimeType(mimeType)
                .data(new ByteArrayResource(image.getBytes()))
                .build();

        return chatClient.prompt()
                .user(user -> user
                        .text(prompt)
                        .media(imageMedia))
                .call()
                .content();
    }

    @Override
    public String getDiet(PetDietRequestDto dietRequestDto) {

        String prompt = """
                	You are a veterinary nutrition assistant AI for pets in INDIA.

                	IMPORTANT GUIDELINES:
                	- This is PET nutrition, NOT human diet advice
                	- Commercial pet food should be the primary diet
                	- Home ingredients are only occasional supplements
                	- DO NOT suggest beef or beef products
                	- Avoid pork
                	- Use pet-safe ingredients commonly available in India
                	- Never suggest spices, salt, sugar, or cooked human meals

                	Pet details:
                	- Type: %s
                	- Breed: %s
                	- Age (years): %d
                	- Weight (kg): %.1f
                	- Activity level: %s
                	- Goal: %s

                	Return ONLY valid JSON in the following structure:

                	{
                            "daily_calorie_estimate": "",
                            "diet_plan": {
                              "protein_sources": [],
                              "carbohydrates": [],
                              "fats": [],
                              "supplements": []
                            },
                            "feeding_schedule": "",
                            "water_intake_advice": "",
                            "care_tips": [],
                            "disclaimer": ""
                          }

                	Rules:
                	- No medical diagnosis
                	- No human meal plans
                	- No treatment claims
                	- Use general nutritional guidelines only
                	- Recommended products MUST match provided product list
                	- No markdown
                	- No extra text
                """.formatted(
                dietRequestDto.getPetType(),
                dietRequestDto.getBreed() == null ? "Unknown" : dietRequestDto.getBreed(),
                dietRequestDto.getAgeYears(),
                dietRequestDto.getWeightKg(),
                dietRequestDto.getActivityLevel(),
                dietRequestDto.getGoal());

        return chatClient.prompt()
                .user(prompt)
                .call().content();
    }

    @Override
    public String getDietandProduct(PetDietRequestDto dietRequestDto) {

        List<AIProductViewDto> products = productRepository.findByIsAvailableTrue()
                .stream()
                .map(p -> {
                    AIProductViewDto v = new AIProductViewDto();
                    v.setId(p.getId());
                    v.setName(p.getName());
                    v.setDescription(p.getDescription());
                    v.setPrice(p.getPrice());
                    v.setQuantity(p.getQuantity());
                    v.setImageUrl(p.getImageUrl());
                    v.setCategory(p.getCategory().getName());
                    return v;
                })
                .toList();

        String prompt = """
                	You are a veterinary nutrition assistant AI for pets in INDIA.

                	IMPORTANT GUIDELINES:
                	- This is PET nutrition, NOT human diet advice
                	- Commercial pet food should be the primary diet
                	- Home ingredients are only occasional supplements
                	- DO NOT suggest beef or beef products
                	- Avoid pork
                	- Use pet-safe ingredients commonly available in India
                	- Never suggest spices, salt, sugar, or cooked human meals
                	- Recommend ONLY from the provided product list
                	- Never invent products

                	Pet details:
                	- Type: %s
                	- Breed: %s
                	- Age (years): %d
                	- Weight (kg): %.1f
                	- Activity level: %s

                	Available products (JSON):
                	%s

                	Return ONLY valid JSON in this structure:
                	{
                	  "diet_summary": "",
                	  "recommended_products": [
                	    {
                	      "product_id": "",
                	      "product_name": "",
                	      "reason": ""
                	    }
                	  ],
                	  "feeding_guidelines": "",
                	  "care_tips": [],
                	  "disclaimer": ""
                	}

                	Rules:
                	- No medical diagnosis
                	- No human meal plans
                	- No treatment claims
                	- Use general nutritional guidelines only
                	- Recommended products MUST match provided product list
                	- No markdown
                	- No extra text
                """.formatted(
                dietRequestDto.getPetType(),
                dietRequestDto.getBreed() == null ? "Unknown" : dietRequestDto.getBreed(),
                dietRequestDto.getAgeYears(),
                dietRequestDto.getWeightKg(),
                dietRequestDto.getActivityLevel(),
                products.toString());

        return chatClient.prompt()
                .user(prompt)
                .call().content();
    }

}
