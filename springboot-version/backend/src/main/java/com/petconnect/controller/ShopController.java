package com.petconnect.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.petconnect.dto.ProductCreateUpdateDto;
import com.petconnect.entity.Category;
import com.petconnect.repository.CategoryRepository;
import com.petconnect.service.ProductService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import lombok.RequiredArgsConstructor;

@Validated
@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {
    private final ProductService productService;
    private final CategoryRepository categoryRepository;

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping("/categories")
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", "Category name is required"));
        }
        if (categoryRepository.findByNameIgnoreCase(category.getName().trim()).isPresent()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Category already exists"));
        }
        category.setName(category.getName().trim());
        return ResponseEntity.ok(categoryRepository.save(category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {

        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Category not found"));
        }

        if (productService.existsByCategory_Id(id)) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Category is in use by products"));
        }

        categoryRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
    }
    
    @PutMapping("/categories/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @RequestBody Category category) {

        Category existing = categoryRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Category not found"));

        String newName = category.getName().trim();

        if (categoryRepository.findByNameIgnoreCase(newName).isPresent()) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Category name already exists"));
        }

        existing.setName(newName);
        return ResponseEntity.ok(categoryRepository.save(existing));
    }

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<?> getProductById(@PathVariable @Positive(message = "Product Id must be a positive number") Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody @Valid ProductCreateUpdateDto productDto) {
            return ResponseEntity.ok(productService.createProduct(productDto));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable @Positive(message = "Product Id must be a positive number") Long id, @RequestBody @Valid ProductCreateUpdateDto productDto) {
            return ResponseEntity.ok(productService.updateProduct(id, productDto));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable @Positive(message = "Product Id must be a positive number") Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Product deleted successfully"));
    }
}
