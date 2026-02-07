package com.govscheme.portal.repository;

import com.govscheme.portal.model.Scheme;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeRepository extends MongoRepository<Scheme, String> {
    List<Scheme> findByIsActiveTrue();
    
    List<Scheme> findByCategory(String category);
    
    List<Scheme> findByDepartment(String department);
}
