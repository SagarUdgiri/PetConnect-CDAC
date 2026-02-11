package com.petconnect.repository;

import com.petconnect.entity.CartItem;
import com.petconnect.entity.Product;
import com.petconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);

    Optional<CartItem> findByUserAndProduct(User user, Product product);

    void deleteByUserId(Long userId);
}
