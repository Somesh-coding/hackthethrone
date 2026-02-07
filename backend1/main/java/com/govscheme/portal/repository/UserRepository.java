package com.govscheme.portal.repository;

import com.govscheme.portal.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    
    Optional<User> findByEmailOtp(String otp);
    
    Boolean existsByEmail(String email);
}
