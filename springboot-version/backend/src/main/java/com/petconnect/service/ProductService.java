package com.petconnect.service;

import com.petconnect.dto.ProductCreateUpdateDto;
import com.petconnect.dto.ProductDto;
import com.petconnect.entity.Product;
import java.util.List;

public interface ProductService {
    List<ProductDto> getAllProducts();

    List<ProductDto> getProductsByCategory(Long categoryId);

    ProductDto createProduct(ProductCreateUpdateDto productDto);

    ProductDto getProductById(Long id);

    ProductDto updateProduct(Long id, ProductCreateUpdateDto productDetails);

    void deleteProduct(Long id);

    Product updateStock(Long productId, int quantityChange);

    ProductDto mapToProductDto(Product product);
    
    boolean existsByCategory_Id(Long categoryId);
}
