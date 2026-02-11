package com.petconnect.repository;

import com.petconnect.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
	List<Product> findByCategory_Id(Long categoryId);

    List<Product> findByCategory_NameIgnoreCase(String name);
    List<Product> findByIsAvailableTrue();
    boolean existsByCategory_Id(Long categoryId);
}
