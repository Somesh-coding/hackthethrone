package com.govscheme.portal.controller;

import com.govscheme.portal.model.User;
import com.govscheme.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Remove sensitive data
            user.setPassword(null);
            user.setEmailOtp(null);
            user.setEmailOtpExpiry(null);

            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User userUpdate) {
        try {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update allowed fields
            if (userUpdate.getFirstName() != null) user.setFirstName(userUpdate.getFirstName());
            if (userUpdate.getLastName() != null) user.setLastName(userUpdate.getLastName());
            if (userUpdate.getPhoneNumber() != null) user.setPhoneNumber(userUpdate.getPhoneNumber());
            if (userUpdate.getAge() != null) user.setAge(userUpdate.getAge());
            if (userUpdate.getState() != null) user.setState(userUpdate.getState());
            if (userUpdate.getDistrict() != null) user.setDistrict(userUpdate.getDistrict());
            if (userUpdate.getOccupation() != null) user.setOccupation(userUpdate.getOccupation());
            if (userUpdate.getAnnualIncome() != null) user.setAnnualIncome(userUpdate.getAnnualIncome());
            if (userUpdate.getCategory() != null) user.setCategory(userUpdate.getCategory());
            if (userUpdate.getGender() != null) user.setGender(userUpdate.getGender());

            User updatedUser = userRepository.save(user);
            updatedUser.setPassword(null);

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
