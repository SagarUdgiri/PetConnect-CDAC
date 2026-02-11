package com.petconnect.dto;

import java.math.BigDecimal;
import lombok.Data;

@Data
public class AIProductViewDto {
	private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private int quantity;
    private String category;
    private String imageUrl;
}
