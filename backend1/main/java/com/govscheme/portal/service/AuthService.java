package com.govscheme.portal.service;

import com.govscheme.portal.dto.AuthRequest;
import com.govscheme.portal.dto.AuthResponse;
import com.govscheme.portal.dto.RegisterRequest;
import com.govscheme.portal.model.User;
import com.govscheme.portal.repository.UserRepository;
import com.govscheme.portal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private EmailService emailService;
    
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAge(request.getAge());
        user.setState(request.getState());
        user.setDistrict(request.getDistrict());
        user.setOccupation(request.getOccupation());
        user.setAnnualIncome(request.getAnnualIncome());
        user.setCategory(request.getCategory());
        user.setGender(request.getGender());
        
        // Set default role
        Set<String> roles = new HashSet<>();
        roles.add("USER");
        user.setRoles(roles);
        
        user.setIsEmailVerified(false);
        user.setIsFirstLogin(true);
        user.setIsActive(true);
        
        userRepository.save(user);
        
        return new AuthResponse(
                null,
                user.getId(),
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                user.getRoles().iterator().next(),
                false,
                "Registration successful! Please login to verify your email with OTP."
        );
    }
    
    public AuthResponse login(AuthRequest request) {
        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        
        // Check password manually
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }
        
        // Check if user is active
        if (!user.getIsActive()) {
            throw new RuntimeException("Account is deactivated");
        }
        
        // If first login or not verified, send OTP
        if (user.getIsFirstLogin() || !user.getIsEmailVerified()) {
            String otp = generateOTP();
            user.setEmailOtp(otp);
            user.setEmailOtpExpiry(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);
            
            try {
                emailService.sendOtpEmail(user.getEmail(), otp, user.getFirstName());
            } catch (Exception e) {
                // Log error but continue - OTP is saved in DB
                System.err.println("Failed to send OTP email: " + e.getMessage());
            }
            
            return new AuthResponse(
                    null,
                    user.getId(),
                    user.getEmail(),
                    user.getFirstName() + " " + user.getLastName(),
                    user.getRoles().iterator().next(),
                    false,
                    "OTP sent to your email. Please verify to continue."
            );
        }
        
        // Normal login for verified users
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        String role = user.getRoles().iterator().next();
        String jwt = jwtUtil.generateToken(userDetails, user.getId(), role);
        
        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                role,
                true,
                "Login successful"
        );
    }
    
    public AuthResponse verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getEmailOtp() == null || !user.getEmailOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }
        
        if (user.getEmailOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP has expired");
        }
        
        user.setIsEmailVerified(true);
        user.setIsFirstLogin(false);
        user.setEmailOtp(null);
        user.setEmailOtpExpiry(null);
        userRepository.save(user);
        
        // Send welcome email (non-blocking)
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getFirstName());
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
        
        // Generate JWT for auto-login
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String role = user.getRoles().iterator().next();
        String jwt = jwtUtil.generateToken(userDetails, user.getId(), role);
        
        return new AuthResponse(
                jwt,
                user.getId(),
                user.getEmail(),
                user.getFirstName() + " " + user.getLastName(),
                role,
                true,
                "Email verified successfully!"
        );
    }
    
    public void resendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getIsEmailVerified()) {
            throw new RuntimeException("Email already verified");
        }
        
        String otp = generateOTP();
        user.setEmailOtp(otp);
        user.setEmailOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        
        emailService.sendOtpEmail(user.getEmail(), otp, user.getFirstName());
    }
    
    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
