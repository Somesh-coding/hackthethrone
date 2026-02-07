package com.govscheme.portal.controller;

import com.govscheme.portal.model.Scheme;
import com.govscheme.portal.service.SchemeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schemes")
@CrossOrigin(origins = "*")
public class SchemeController {
    
    @Autowired
    private SchemeService schemeService;
    
    @GetMapping("/public/all")
    public ResponseEntity<List<Scheme>> getAllSchemes() {
        return ResponseEntity.ok(schemeService.getAllActiveSchemes());
    }
    
    @GetMapping("/public/{id}")
    public ResponseEntity<Scheme> getSchemeById(@PathVariable String id) {
        return ResponseEntity.ok(schemeService.getSchemeById(id));
    }
    
    @GetMapping("/eligible/{userId}")
    public ResponseEntity<List<Scheme>> getEligibleSchemes(@PathVariable String userId) {
        return ResponseEntity.ok(schemeService.getEligibleSchemes(userId));
    }
    
    @GetMapping("/public/category/{category}")
    public ResponseEntity<List<Scheme>> getSchemesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(schemeService.getSchemesByCategory(category));
    }
    
    @GetMapping("/public/search")
    public ResponseEntity<List<Scheme>> searchSchemes(@RequestParam String query) {
        return ResponseEntity.ok(schemeService.searchSchemes(query));
    }
    
    @PostMapping("/admin/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createScheme(@RequestBody Scheme scheme) {
        try {
            Scheme createdScheme = schemeService.createScheme(scheme);
            return ResponseEntity.ok(createdScheme);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/admin/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateScheme(@PathVariable String id, @RequestBody Scheme scheme) {
        try {
            Scheme updatedScheme = schemeService.updateScheme(id, scheme);
            return ResponseEntity.ok(updatedScheme);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/admin/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteScheme(@PathVariable String id) {
        try {
            schemeService.deleteScheme(id);
            return ResponseEntity.ok(Map.of("message", "Scheme deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
