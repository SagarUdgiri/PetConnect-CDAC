package com.petconnect.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long orderId;
    private BigDecimal totalPrice;
    private String orderStatus;
    private String transactionId;
    private LocalDateTime createdAt;
    private int itemsCount;
    private String username;
    private String userEmail;
    private List<OrderItemDto> items;
}
