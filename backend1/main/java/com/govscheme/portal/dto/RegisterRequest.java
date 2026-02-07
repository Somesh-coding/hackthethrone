package com.govscheme.portal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
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
    private String category;
    private String gender;
}
