package com.example.E_Commerce.service;

import com.example.E_Commerce.model.Cart;
import com.example.E_Commerce.model.CartItem;
import com.example.E_Commerce.model.Product;
import com.example.E_Commerce.repository.CartRepository;
import com.example.E_Commerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public Cart getCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart cart = Cart.builder().userId(userId).items(new HashSet<>()).build();
                    return cartRepository.save(cart);
                });
    }

    public Cart addToCart(Long userId, Long productId) {
        Cart cart = getCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        for (CartItem item : cart.getItems()) {
            if (item.getProduct().getId().equals(productId)) {
                if (item.getQuantity() < product.getStockQuantity()) {
                    item.setQuantity(item.getQuantity() + 1);
                    return cartRepository.save(cart);
                } else {
                    throw new RuntimeException("Cannot add more than available stock");
                }
            }
        }

        if (product.getStockQuantity() > 0) {
            CartItem item = CartItem.builder().cart(cart).product(product).quantity(1).build();
            cart.getItems().add(item);
            return cartRepository.save(cart);
        } else {
            throw new RuntimeException("Product is out of stock");
        }
    }

    public Cart increaseQuantity(Long userId, Long cartItemId) {
        Cart cart = getCart(userId);

        cart.getItems().forEach(item -> {
            if (item.getId().equals(cartItemId)) {
                if (item.getQuantity() < item.getProduct().getStockQuantity()) {
                    item.setQuantity(item.getQuantity() + 1);
                } else {
                    throw new RuntimeException("Cannot exceed available stock");
                }
            }
        });
        return cartRepository.save(cart);
    }

    public Cart decreaseQuantity(Long userId, Long cartItemId) {
        Cart cart = getCart(userId);

        cart.getItems().removeIf(item -> {
            if(item.getId().equals(cartItemId)){
                if(item.getQuantity() > 1){
                    item.setQuantity(item.getQuantity() - 1);
                    return false;
                }
                return true;
            }
            return false;
        });
        return cartRepository.save(cart);
    }

    public Cart removeItem(Long userId, Long cartItemId){
        Cart cart = getCart(userId);
        cart.getItems().removeIf(i -> i.getId().equals(cartItemId));
        return cartRepository.save(cart);
    }

}
