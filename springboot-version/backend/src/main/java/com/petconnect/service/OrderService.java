package com.petconnect.service;

import com.petconnect.dto.OrderDto;
import com.petconnect.dto.OrderItemDto;
import com.petconnect.entity.Order;
import com.petconnect.entity.OrderItem;
import java.util.List;

public interface OrderService {
    OrderDto checkout(Long userId, String transactionId);

    List<OrderDto> getUserOrders(Long userId);

    List<OrderDto> getAllOrders();

    OrderDto getOrderDetails(Long orderId, Long userId);

    OrderDto mapToOrderDto(Order order);

    OrderItemDto mapToOrderItemDto(OrderItem item);
}
