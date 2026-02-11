package com.petconnect.service;

import com.petconnect.dto.CartDto;
import com.petconnect.dto.CartItemDto;
import com.petconnect.entity.CartItem;
import java.util.List;

public interface CartService {
    CartDto getCartItems(Long userId);

    CartDto addToCart(Long userId, Long productId, int quantity);

    CartDto removeFromCart(Long userId, Long cartItemId);

    void clearCart(Long userId);

    CartDto mapToCartDto(List<CartItem> items);

    CartItemDto mapToCartItemDto(CartItem item);
}
