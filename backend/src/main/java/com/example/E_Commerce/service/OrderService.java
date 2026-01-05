package com.example.E_Commerce.service;

import com.example.E_Commerce.model.*;
import com.example.E_Commerce.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Or;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;

    @Transactional
    public Order placeOrder(Long userId, Long addressId){
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException(("Cart not found")));

        if(cart.getItems().isEmpty()){
            throw new RuntimeException("Cart is empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getId().equals(userId)) {
            throw new RuntimeException("Address does not belong to user");
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setDeliveryAddress(address);
        order.setStatus(OrderStatus.PLACED);
        order.setCreatedAt(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for(CartItem cartItem : cart.getItems()){
            Product product = cartItem.getProduct();

            if(cartItem.getQuantity() > product.getStockQuantity()){
                throw new RuntimeException("Insufficient stock for " + product.getName());
            }

            product.setStockQuantity(
                    product.getStockQuantity() - cartItem.getQuantity()
            );
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(product.getPrice());

            total += product.getPrice() * cartItem.getQuantity();
            orderItems.add(orderItem);
        }
        order.setTotalAmount(total);
        order.setItems(orderItems);

        cart.getItems().clear();
        cartRepository.save(cart);

        Order savedOrder = orderRepository.save(order);

        OrderStatusHistory historyPlaced = new OrderStatusHistory();
        historyPlaced.setOrder(savedOrder);
        historyPlaced.setStatus(OrderStatus.PLACED);
        historyPlaced.setChangedAt(LocalDateTime.now());
        historyRepository.save(historyPlaced);

        savedOrder.setStatus(OrderStatus.PAYMENT_PENDING);
        orderRepository.save(savedOrder);

        OrderStatusHistory historyPending = new OrderStatusHistory();
        historyPending.setOrder(savedOrder);
        historyPending.setStatus(OrderStatus.PAYMENT_PENDING);
        historyPending.setChangedAt(LocalDateTime.now());
         historyRepository.save(historyPending);

        return savedOrder;
    }

    public List<Order> getOrdersByUser(Long userId){
        return orderRepository.findByUserId(userId);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus currentStatus = order.getStatus();

        if(currentStatus == newStatus){
            return order;
        }

        if (currentStatus == OrderStatus.PLACED && newStatus == OrderStatus.PAYMENT_PENDING) {
            order.setStatus(newStatus);
        } else if ((currentStatus == OrderStatus.PAYMENT_PENDING || currentStatus == OrderStatus.PAYMENT_FAILED)
                && newStatus == OrderStatus.PAID) {
            order.setStatus(newStatus);
        } else if (currentStatus == OrderStatus.PAID && newStatus == OrderStatus.SHIPPED) {
            order.setStatus(newStatus);
        } else if (currentStatus == OrderStatus.SHIPPED && newStatus == OrderStatus.DELIVERED) {
            order.setStatus(newStatus);
        } else if ((currentStatus == OrderStatus.PLACED || currentStatus == OrderStatus.PAYMENT_PENDING
                || currentStatus == OrderStatus.PAID || currentStatus == OrderStatus.SHIPPED)
                && newStatus == OrderStatus.CANCELLED) {
            order.setStatus(newStatus);
        } else if (currentStatus == OrderStatus.PAYMENT_PENDING && newStatus == OrderStatus.PAYMENT_FAILED) {
            order.setStatus(newStatus);
        }
        else {
            throw new RuntimeException(
                    "Invalid order status transition: " + currentStatus + " → " + newStatus);
        }

        Order savedOrder = orderRepository.save(order);

        OrderStatusHistory history = new OrderStatusHistory();
        history.setOrder(savedOrder);
        history.setStatus(newStatus);
        history.setChangedAt(LocalDateTime.now());
        historyRepository.save(history);

        return savedOrder;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }
}
