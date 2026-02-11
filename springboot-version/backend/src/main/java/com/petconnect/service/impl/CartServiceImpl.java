package com.petconnect.service.impl;

import com.petconnect.dto.CartDto;
import com.petconnect.dto.CartItemDto;
import com.petconnect.entity.CartItem;
import com.petconnect.entity.Product;
import com.petconnect.entity.User;
import com.petconnect.repository.CartRepository;
import com.petconnect.repository.ProductRepository;
import com.petconnect.repository.UserRepository;
import com.petconnect.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public CartDto getCartItems(Long userId) {
        List<CartItem> items = cartRepository.findByUserId(userId);
        return mapToCartDto(items);
    }

    @Override
    @Transactional
    public CartDto addToCart(Long userId, Long productId, int quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.isAvailable() || product.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        CartItem cartItem = cartRepository.findByUserAndProduct(user, product)
                .map(item -> {
                    item.setQuantity(item.getQuantity() + quantity);
                    return item;
                })
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setUser(user);
                    newItem.setProduct(product);
                    newItem.setQuantity(quantity);
                    return newItem;
                });

        cartRepository.save(cartItem);
        return getCartItems(userId);
    }

    @Override
    @Transactional
    public CartDto removeFromCart(Long userId, Long cartItemId) {
        cartRepository.deleteById(cartItemId);
        return getCartItems(userId);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }

    @Override
    public CartDto mapToCartDto(List<CartItem> items) {
        List<CartItemDto> itemDtos = items.stream()
                .map(this::mapToCartItemDto)
                .collect(Collectors.toList());
        return CartDto.builder().items(itemDtos).build();
    }

    @Override
    public CartItemDto mapToCartItemDto(CartItem item) {
        return CartItemDto.builder()
                .cartItemId(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .price(item.getProduct().getPrice())
                .imageUrl(item.getProduct().getImageUrl())
                .quantity(item.getQuantity())
                .build();
    }
}
