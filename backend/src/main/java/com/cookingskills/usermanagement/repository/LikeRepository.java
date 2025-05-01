package com.cookingskills.usermanagement.repository;

import com.cookingskills.usermanagement.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {
    List<Like> findByPostId(String postId);
    Optional<Like> findByUserIdAndPostId(String userId, String postId);
}