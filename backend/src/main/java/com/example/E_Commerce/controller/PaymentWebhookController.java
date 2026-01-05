package com.example.E_Commerce.controller;

import com.example.E_Commerce.model.OrderStatus;
import com.example.E_Commerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/webhook/stripe")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final OrderService orderService;

    @PostMapping("/payment-success/{orderId}")
    public void markPaymentSuccess(@PathVariable Long orderId) {
        orderService.updateStatus(orderId, OrderStatus.PAID);
    }

    @PostMapping("/payment-failed/{orderId}")
    public void markPaymentFailed(@PathVariable Long orderId) {
        orderService.updateStatus(orderId, OrderStatus.PAYMENT_FAILED);
    }
}
