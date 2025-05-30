package com.cookingskills.usermanagement.repository;

import com.cookingskills.usermanagement.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    User findByEmail(String email);
    Optional<User> findByUsername(String username);
}