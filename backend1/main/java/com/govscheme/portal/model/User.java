package com.govscheme.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;
    
    private String firstName;
    
    private String lastName;
    
    private String phoneNumber;
    
    private Integer age;
    
    private String state;
    
    private String district;
    
    private String occupation;
    
    private Double annualIncome;
    
    private String category; // SC, ST, OBC, General
    
    private String gender;
    
    private Boolean isEmailVerified = false;
    
    private String emailOtp;
    
    private LocalDateTime emailOtpExpiry;
    
    private Boolean isFirstLogin = true;
    
    private Set<String> roles = new HashSet<>();
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    private Boolean isActive = true;
}
