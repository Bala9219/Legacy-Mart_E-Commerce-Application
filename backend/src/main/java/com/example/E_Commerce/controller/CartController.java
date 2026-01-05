package com.example.E_Commerce.controller;

import com.example.E_Commerce.model.Cart;
import com.example.E_Commerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{userId}")
    public Cart getCart(@PathVariable Long userId){
        return cartService.getCart(userId);
    }

    @PostMapping("/add/{userId}/{productId}")
    public Cart addToCart(@PathVariable Long userId, @PathVariable Long productId){
        return cartService.addToCart(userId, productId);
    }

    @PutMapping("/increase/{userId}/{cartItemId}")
    public Cart increase(@PathVariable Long userId, @PathVariable Long cartItemId){
        return cartService.increaseQuantity(userId, cartItemId);
    }

    @PutMapping("/decrease/{userId}/{cartItemId}")
    public Cart decrease(@PathVariable Long userId, @PathVariable Long cartItemId){
        return cartService.decreaseQuantity(userId, cartItemId);
    }

    @DeleteMapping("/remove/{userId}/{cartItemId}")
    public Cart removeItem(@PathVariable Long userId, @PathVariable Long cartItemId){
        return cartService.removeItem(userId, cartItemId);
    }
}
