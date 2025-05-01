package com.cookingskills.usermanagement.controller;

import com.cookingskills.usermanagement.model.Like;
import com.cookingskills.usermanagement.service.LikeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    private static final Logger logger = LoggerFactory.getLogger(LikeController.class);

    @Autowired
    private LikeService likeService;

    @PostMapping("/user/{userId}/post/{postId}")
    public ResponseEntity<?> createLike(@PathVariable String userId, @PathVariable String postId) {
        try {
            logger.info("User {} liking post {}", userId, postId);
            Like like = likeService.createLike(userId, postId);
            return ResponseEntity.ok(like);
        } catch (IllegalArgumentException e) {
            logger.warn("Error creating like: {}", e.getMessage());
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error creating like for user {} on post {}", userId, postId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to create like: " + e.getMessage()));
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getLikesByPostId(@PathVariable String postId) {
        try {
            logger.info("Fetching likes for post {}", postId);
            List<Like> likes = likeService.getLikesByPostId(postId);
            return ResponseEntity.ok(likes);
        } catch (IllegalArgumentException e) {
            logger.warn("Error fetching likes: {}", e.getMessage());
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error fetching likes for post {}", postId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to fetch likes: " + e.getMessage()));
        }
    }

    @DeleteMapping("/user/{userId}/post/{postId}")
    public ResponseEntity<?> deleteLike(@PathVariable String userId, @PathVariable String postId) {
        try {
            logger.info("User {} unliking post {}", userId, postId);
            likeService.deleteLike(userId, postId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            logger.warn("Error deleting like: {}", e.getMessage());
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error deleting like for user {} on post {}", userId, postId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to delete like: " + e.getMessage()));
        }
    }

    static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}