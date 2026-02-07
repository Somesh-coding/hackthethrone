package com.govscheme.portal.service;

import com.govscheme.portal.model.Scheme;
import com.govscheme.portal.model.User;
import com.govscheme.portal.repository.SchemeRepository;
import com.govscheme.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemeService {
    
    @Autowired
    private SchemeRepository schemeRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    public List<Scheme> getAllActiveSchemes() {
        return schemeRepository.findByIsActiveTrue();
    }
    
    public Scheme getSchemeById(String id) {
        return schemeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Scheme not found"));
    }
    
    public List<Scheme> getEligibleSchemes(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Scheme> allSchemes = schemeRepository.findByIsActiveTrue();
        
        return allSchemes.stream()
                .filter(scheme -> isUserEligible(user, scheme))
                .collect(Collectors.toList());
    }
    
    private boolean isUserEligible(User user, Scheme scheme) {
        // Check age eligibility
        if (scheme.getMinAge() != null && user.getAge() < scheme.getMinAge()) {
            return false;
        }
        if (scheme.getMaxAge() != null && user.getAge() > scheme.getMaxAge()) {
            return false;
        }
        
        // Check state eligibility
        if (scheme.getEligibleStates() != null && !scheme.getEligibleStates().isEmpty()) {
            if (!scheme.getEligibleStates().contains(user.getState()) && 
                !scheme.getEligibleStates().contains("All")) {
                return false;
            }
        }
        
        // Check gender eligibility
        if (scheme.getEligibleGenders() != null && !scheme.getEligibleGenders().isEmpty()) {
            if (!scheme.getEligibleGenders().contains(user.getGender()) && 
                !scheme.getEligibleGenders().contains("All")) {
                return false;
            }
        }
        
        // Check income eligibility
        if (scheme.getMaxIncome() != null && user.getAnnualIncome() != null) {
            if (user.getAnnualIncome() > scheme.getMaxIncome()) {
                return false;
            }
        }
        
        // Check category eligibility
        if (scheme.getEligibleCategories() != null && !scheme.getEligibleCategories().isEmpty()) {
            if (!scheme.getEligibleCategories().contains(user.getCategory()) && 
                !scheme.getEligibleCategories().contains("All")) {
                return false;
            }
        }
        
        // Check occupation eligibility
        if (scheme.getEligibleOccupations() != null && !scheme.getEligibleOccupations().isEmpty()) {
            if (!scheme.getEligibleOccupations().contains(user.getOccupation()) && 
                !scheme.getEligibleOccupations().contains("All")) {
                return false;
            }
        }
        
        return true;
    }
    
    public Scheme createScheme(Scheme scheme) {
        scheme.setCreatedAt(LocalDateTime.now());
        scheme.setUpdatedAt(LocalDateTime.now());
        Scheme savedScheme = schemeRepository.save(scheme);
        
        // Notify all eligible users about new scheme
        notifyEligibleUsers(savedScheme);
        
        return savedScheme;
    }
    
    public Scheme updateScheme(String id, Scheme scheme) {
        Scheme existingScheme = getSchemeById(id);
        
        scheme.setId(existingScheme.getId());
        scheme.setCreatedAt(existingScheme.getCreatedAt());
        scheme.setUpdatedAt(LocalDateTime.now());
        
        return schemeRepository.save(scheme);
    }
    
    public void deleteScheme(String id) {
        Scheme scheme = getSchemeById(id);
        scheme.setIsActive(false);
        scheme.setUpdatedAt(LocalDateTime.now());
        schemeRepository.save(scheme);
    }
    
    private void notifyEligibleUsers(Scheme scheme) {
        List<User> allUsers = userRepository.findAll();
        
        allUsers.stream()
                .filter(user -> user.getIsEmailVerified() && user.getIsActive())
                .filter(user -> isUserEligible(user, scheme))
                .forEach(user -> {
                    try {
                        emailService.sendNewSchemeNotification(
                                user.getEmail(),
                                user.getFirstName(),
                                scheme
                        );
                    } catch (Exception e) {
                        // Log error but continue with other users
                        System.err.println("Failed to send email to: " + user.getEmail());
                    }
                });
    }
    
    public List<Scheme> getSchemesByCategory(String category) {
        return schemeRepository.findByCategory(category);
    }
    
    public List<Scheme> searchSchemes(String query) {
        return schemeRepository.findByIsActiveTrue().stream()
                .filter(scheme -> 
                    scheme.getName().toLowerCase().contains(query.toLowerCase()) ||
                    scheme.getDescription().toLowerCase().contains(query.toLowerCase()) ||
                    scheme.getCategory().toLowerCase().contains(query.toLowerCase())
                )
                .collect(Collectors.toList());
    }
}
