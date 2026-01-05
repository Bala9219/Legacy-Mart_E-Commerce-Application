package com.example.E_Commerce.controller;

import com.example.E_Commerce.model.Address;
import com.example.E_Commerce.model.User;
import com.example.E_Commerce.repository.AddressRepository;
import com.example.E_Commerce.repository.UserRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AddressController {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;

    @GetMapping("/{userId}")
    public List<Address> getUserAddresses(@PathVariable Long userId){
        return addressRepository.findByUserId(userId);
    }

    @PostMapping("/{userId}")
    public Address addAddress(@PathVariable Long userId, @RequestBody Address address){
        User user = userRepository.findById(userId).orElseThrow();
        address.setUser(user);
        return addressRepository.save(address);
    }

    @DeleteMapping("/{addressId}")
    public void deleteAddress(@PathVariable Long addressId){
        addressRepository.deleteById(addressId);
    }
}
