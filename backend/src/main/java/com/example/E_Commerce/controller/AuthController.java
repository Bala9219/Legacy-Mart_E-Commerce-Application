package com.example.E_Commerce.controller;

import com.example.E_Commerce.dto.LoginRequest;
import com.example.E_Commerce.dto.LoginResponse;
import com.example.E_Commerce.dto.RegisterRequest;
import com.example.E_Commerce.model.User;
import com.example.E_Commerce.repository.UserRepository;
import com.example.E_Commerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request){
        if(userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("E-Mail already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        userRepository.save(user);

        return "User registered successfully";
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request){
        User dbUser = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid Credentials"));

        if(!passwordEncoder.matches(request.getPassword(), dbUser.getPassword())){
            throw new RuntimeException("Invalid Credentials");
        }

        return new LoginResponse(
                dbUser.getId(),
                dbUser.getEmail(),
                dbUser.getRole()
        );
    }

    @PostMapping("/jwt-login")
    public ResponseEntity<?> loginJwt(@RequestBody LoginRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtService.generateToken(
                user.getId(),
                user.getRole(),
                user.getEmail()
        );

        return ResponseEntity.ok(Map.of(
                "userId", user.getId(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "token", token
        ));
    }
}
