package com.petconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PetDto {
    private Long id;
    private String name;
    private String breed;
    private String type;
    private int age;
    private String imageUrl;
    private Long userId;
    private String ownerName;
}
