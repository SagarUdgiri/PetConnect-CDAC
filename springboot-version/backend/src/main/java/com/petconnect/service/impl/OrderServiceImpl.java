package com.petconnect.service.impl;

import com.petconnect.dto.OrderDto;
import com.petconnect.dto.OrderItemDto;
import com.petconnect.entity.*;
import com.petconnect.repository.*;
import com.petconnect.service.CartService;
import com.petconnect.service.OrderService;
import com.petconnect.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderServiceImpl implements OrderService {
    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartService cartService;
    private final ProductService productService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrderDto checkout(Long userId, String transactionId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<CartItem> cartItems = cartRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setTransactionId(transactionId);
        order.setStatus(
                transactionId != null && !transactionId.isEmpty() ? Order.OrderStatus.PAID : Order.OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(item.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());

            order.getOrderItems().add(orderItem);

            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(itemTotal);

            // Reduce stock
            productService.updateStock(product.getId(), -item.getQuantity());
        }

        order.setTotalPrice(total);
        Order savedOrder = orderRepository.save(order);

        // Clear cart after checkout
        cartService.clearCart(userId);

        return mapToOrderDto(savedOrder);
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToOrderDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderDto getOrderDetails(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to view this order");
        }
        return mapToOrderDto(order);
    }

    @Override
    public OrderDto mapToOrderDto(Order order) {
        List<OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(this::mapToOrderItemDto)
                .collect(Collectors.toList());

        return OrderDto.builder()
                .orderId(order.getId())
                .totalPrice(order.getTotalPrice())
                .orderStatus(order.getStatus() != null ? order.getStatus().name() : "PENDING")
                .transactionId(order.getTransactionId())
                .createdAt(order.getCreatedAt())
                .itemsCount(order.getOrderItems().size())
                .username(order.getUser().getFullName() != null ? order.getUser().getFullName()
                        : order.getUser().getUsername())
                .userEmail(order.getUser().getEmail())
                .items(itemDtos)
                .build();
    }

    @Override
    public OrderItemDto mapToOrderItemDto(OrderItem item) {
        return OrderItemDto.builder()
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .imageUrl(item.getProduct().getImageUrl())
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .build();
    }
}
