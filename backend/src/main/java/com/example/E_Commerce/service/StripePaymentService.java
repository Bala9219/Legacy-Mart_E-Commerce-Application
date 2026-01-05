package com.example.E_Commerce.service;

import com.example.E_Commerce.model.Order;
import com.example.E_Commerce.model.OrderStatus;
import com.example.E_Commerce.model.OrderStatusHistory;
import com.example.E_Commerce.repository.OrderRepository;
import com.example.E_Commerce.repository.OrderStatusHistoryRepository;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StripePaymentService {

    private final OrderRepository orderRepository;
    private final OrderStatusHistoryRepository historyRepository;

    public Map<String, Object> createPaymentIntent(Long orderId) throws Exception{
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        long amountInPaise = (long)(order.getTotalAmount() * 100);

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInPaise)
                .setCurrency("inr")
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .setDescription("Order #" + order.getId())
                .putMetadata("orderId", order.getId().toString())
                .putMetadata("userId", order.getUserId().toString())
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        order.setStatus(OrderStatus.PAYMENT_PENDING);
        orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(order);
        history.setStatus(OrderStatus.PAYMENT_PENDING);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        Map<String, Object> response = new HashMap<>();
        response.put("paymentIntentId", paymentIntent.getId());
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("amount", amountInPaise);
        response.put("currency", "INR");

        return response;
    }

    public void markPaymentSuccessful(String paymentIntentId) throws Exception{
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

        if (!"succeeded".equals(paymentIntent.getStatus())) {
            throw new RuntimeException("Payment not completed yet");
        }

        String orderId = paymentIntent.getMetadata().get("orderId");

        Order order = orderRepository.findById(Long.parseLong(orderId))
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(OrderStatus.PAID);
        Order savedOrder = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(savedOrder);
        history.setStatus(OrderStatus.PAID);
        history.setChangedAt(LocalDateTime.now());

        historyRepository.save(history);
    }
}
