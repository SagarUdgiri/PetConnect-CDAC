package com.petconnect.controller;

import com.petconnect.security.UserDetailsImpl;
import com.petconnect.service.CartService;

import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Validated
@RestController
@RequestMapping("/api/Cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @GetMapping("/my-cart")
    public ResponseEntity<?> getMyCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(cartService.getCartItems(userDetails.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
    		@AuthenticationPrincipal UserDetailsImpl userDetails,
    		@RequestParam @Positive(message = "Product ID must be positive") Long productId,
            @RequestParam @Positive(message = "Quantity must be at least 1") Integer quantity) {
    	return ResponseEntity.ok(cartService.addToCart(userDetails.getId(), productId, quantity));
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable @Positive(message = "Cart item ID must be positive") Long cartItemId) {
        return ResponseEntity.ok(cartService.removeFromCart(userDetails.getId(), cartItemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.ok().build();
    }
}
