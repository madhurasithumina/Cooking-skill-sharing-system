package com.cookingskills.usermanagement.controller;

import com.cookingskills.usermanagement.model.Comment;
import com.cookingskills.usermanagement.service.CommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private static final Logger logger = LoggerFactory.getLogger(CommentController.class);

    @Autowired
    private CommentService commentService;

    @PostMapping("/user/{userId}/post/{postId}")
    public ResponseEntity<?> createComment(@PathVariable String userId, @PathVariable String postId, @RequestBody CommentRequest request) {
        try {
            logger.info("User {} commenting on post {}", userId, postId);
            Comment comment = commentService.createComment(userId, postId, request.getContent());
            return ResponseEntity.ok(comment);
        } catch (IllegalArgumentException e) {
            logger.warn("Error creating comment: {}", e.getMessage());
            return ResponseEntity.status(400).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error creating comment for user {} on post {}", userId, postId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to create comment: " + e.getMessage()));
        }
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentsByPostId(@PathVariable String postId) {
        try {
            logger.info("Fetching comments for post {}", postId);
            List<Comment> comments = commentService.getCommentsByPostId(postId);
            return ResponseEntity.ok(comments);
        } catch (IllegalArgumentException e) {
            logger.warn("Error fetching comments: {}", e.getMessage());
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error fetching comments for post {}", postId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to fetch comments: " + e.getMessage()));
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable String commentId, @RequestBody CommentRequest request) {
        try {
            logger.info("Updating comment {}", commentId);
            Comment comment = commentService.updateComment(commentId, request.getContent());
            return ResponseEntity.ok(comment);
        } catch (IllegalArgumentException e) {
            logger.warn("Error updating comment: {}", e.getMessage());
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error updating comment {}", commentId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to update comment: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId) {
        try {
            logger.info("Deleting comment {}", commentId);
            commentService.deleteComment(commentId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            logger.warn("Error deleting comment: {}", e.getMessage());
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error deleting comment {}", commentId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to delete comment: " + e.getMessage()));
        }
    }

    static class CommentRequest {
        private String content;

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
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