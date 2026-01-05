package com.example.E_Commerce.controller;

import com.example.E_Commerce.dto.PlaceOrderRequest;
import com.example.E_Commerce.model.Order;
import com.example.E_Commerce.model.OrderStatus;
import com.example.E_Commerce.model.OrderStatusHistory;
import com.example.E_Commerce.repository.OrderStatusHistoryRepository;
import com.example.E_Commerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;
    private final OrderStatusHistoryRepository historyRepository;

    @PostMapping("/place")
    public Order placeOrder(@RequestBody PlaceOrderRequest request) {
        return orderService.placeOrder(
                request.userId(),
                request.addressId()
        );
    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId){
        return orderService.getOrdersByUser(userId);
    }

    @GetMapping("/{orderId}")
    public Order getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId);
    }

    @PutMapping("/{orderId}/status")
    public Order updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status){
        return orderService.updateStatus(orderId, status);
    }

    @GetMapping("/admin")
    public List<Order> getAllOrders(){
        return orderService.getAllOrders();
    }

    @GetMapping("/{orderId}/history")
    public List<OrderStatusHistory> getOrderHistory(@PathVariable Long orderId) {
        return historyRepository.findByOrderIdOrderByChangedAtAsc(orderId);
    }

}
