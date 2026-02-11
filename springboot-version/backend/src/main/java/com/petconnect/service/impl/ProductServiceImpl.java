package com.petconnect.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.petconnect.dto.ProductCreateUpdateDto;
import com.petconnect.dto.ProductDto;
import com.petconnect.entity.Category;
import com.petconnect.entity.Product;
import com.petconnect.repository.CategoryRepository;
import com.petconnect.repository.ProductRepository;
import com.petconnect.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public boolean existsByCategory_Id(Long categoryId) {
    	return productRepository.existsByCategory_Id(categoryId);
    }
    
    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> getProductsByCategory(Long categoryId) {
    	return productRepository.findByCategory_Id(categoryId).stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDto createProduct(ProductCreateUpdateDto dto) {

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setImageUrl(dto.getImageUrl());
        product.setAvailable(dto.getQuantity() > 0);
        product.setCategory(category);

        return mapToProductDto(productRepository.save(product));
    }

    @Override
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToProductDto(product);
    }

    @Override
    public ProductDto updateProduct(Long id, ProductCreateUpdateDto dto) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setQuantity(dto.getQuantity());
        product.setImageUrl(dto.getImageUrl());
        product.setAvailable(dto.getQuantity() > 0);
        product.setCategory(category);

        return mapToProductDto(productRepository.save(product));
    }

    @Override
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    @Override
    public Product updateStock(Long productId, int quantityChange) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        product.setQuantity(product.getQuantity() + quantityChange);
        product.setAvailable(product.getQuantity() > 0);
        return productRepository.save(product);
    }

    @Override
    public ProductDto mapToProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .imageUrl(product.getImageUrl())
                .isAvailable(product.isAvailable())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getName())
                .build();
    }
}
