package com.govscheme.portal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "schemes")
public class Scheme {
    @Id
    private String id;
    
    private String name;
    
    private String description;
    
    private String shortDescription;
    
    private String department;
    
    private String ministry;
    
    private String officialWebsite;
    
    private String category; // Education, Health, Agriculture, Social Welfare, etc.
    
    private List<String> benefits;
    
    // Eligibility criteria
    private Integer minAge;
    
    private Integer maxAge;
    
    private List<String> eligibleStates; // Empty list means all states
    
    private List<String> eligibleGenders; // Male, Female, Other, All
    
    private Double maxIncome; // Annual income limit (null means no limit)
    
    private List<String> eligibleCategories; // SC, ST, OBC, General, All
    
    private List<String> eligibleOccupations; // Farmer, Student, etc. (empty means all)
    
    private String applicationProcess;
    
    private List<String> requiredDocuments;
    
    private LocalDate applicationDeadline;
    
    private Boolean isActive = true;
    
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    private String imageUrl;
    
    private String pdfUrl;
}
