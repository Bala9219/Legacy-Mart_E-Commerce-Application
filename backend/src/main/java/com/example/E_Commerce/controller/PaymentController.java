package com.example.E_Commerce.controller;

import com.example.E_Commerce.service.StripePaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final StripePaymentService stripePaymentService;

    @PostMapping("/create/{orderId}")
    public ResponseEntity<?> createPaymentIntent(@PathVariable Long orderId){
        try {
            Map<String, Object> response = stripePaymentService.createPaymentIntent(orderId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @PostMapping("/success")
    public ResponseEntity<?> markPaymentSuccess(@RequestParam String paymentIntentId){
        try {
            stripePaymentService.markPaymentSuccessful(paymentIntentId);
            return ResponseEntity.ok(Map.of("message", "Payment marked as successful"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );
        }
    }
}
