package com.cookingskills.usermanagement.service;

import com.cookingskills.usermanagement.model.Like;
import com.cookingskills.usermanagement.repository.LikeRepository;
import com.cookingskills.usermanagement.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    private static final Logger logger = LoggerFactory.getLogger(LikeService.class);

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    public Like createLike(String userId, String postId) {
        logger.info("Creating like for user {} on post {}", userId, postId);
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }
        Optional<Like> existingLike = likeRepository.findByUserIdAndPostId(userId, postId);
        if (existingLike.isPresent()) {
            throw new IllegalArgumentException("User already liked this post");
        }
        Like like = new Like(userId, postId, LocalDateTime.now());
        return likeRepository.save(like);
    }

    public List<Like> getLikesByPostId(String postId) {
        logger.info("Fetching likes for post {}", postId);
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }
        return likeRepository.findByPostId(postId);
    }

    public void deleteLike(String userId, String postId) {
        logger.info("Deleting like for user {} on post {}", userId, postId);
        Optional<Like> like = likeRepository.findByUserIdAndPostId(userId, postId);
        if (like.isEmpty()) {
            throw new IllegalArgumentException("Like not found for user and post");
        }
        likeRepository.delete(like.get());
    }
}