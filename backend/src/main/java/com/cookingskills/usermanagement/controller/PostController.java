
package com.cookingskills.usermanagement.controller;

import com.cookingskills.usermanagement.model.Post;
import com.cookingskills.usermanagement.service.PostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    @Autowired
    private PostService postService;


    //POST request to create a new post
    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody Post post) {
        try {
            logger.info("Received create post request: {}", post);
            if (post.getUserId() == null || post.getUserId().trim().isEmpty()) {
                logger.error("User ID is required");
                return ResponseEntity.badRequest().body(new ErrorResponse("User ID is required"));
            }
            Post createdPost = postService.createPost(post);
            logger.info("Post created successfully: {}", createdPost);
            return ResponseEntity.ok(createdPost);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating post: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error creating post", e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to create post: " + e.getMessage()));
        }
    }

    //GET request to get all posts by user ID
    @GetMapping
    public ResponseEntity<?> getPostsByUserId(@RequestParam String userId) {
        try {
            logger.info("Fetching posts for userId: {}", userId);
            if (userId == null || userId.trim().isEmpty()) {
                logger.error("User ID is required");
                return ResponseEntity.badRequest().body(new ErrorResponse("User ID is required"));
            }
            List<Post> posts = postService.getPostsByUserId(userId);
            logger.info("Fetched {} posts for userId: {}", posts.size(), userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            logger.error("Error fetching posts for userId: {}", e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch posts: " + e.getMessage()));
        }
    }

    //GET request to get all posts
    @GetMapping("/all")
    public ResponseEntity<?> getAllPosts(@RequestHeader(value = "Origin", required = false) String origin) {
        try {
            logger.info("Received GET /api/posts/all request from origin: {}", origin);
            List<Post> posts = postService.getAllPosts();
            logger.info("Retrieved {} posts from PostService", posts.size());
            for (Post post : posts) {
                logger.debug("Post ID: {}, UserID: {}, Username: {}, Title: {}, CreatedAt: {}",
                        post.getId(), post.getUserId(), post.getUsername(), post.getTitle(), post.getCreatedAt());
            }
            logger.info("Returning {} posts", posts.size());
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            logger.error("Error fetching all posts", e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch posts: " + e.getMessage()));
        }
    }

    //GET request to get a post by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable String id) {
        try {
            logger.info("Fetching post with id: {}", id);
            Post post = postService.getPostById(id);
            return ResponseEntity.ok(post);
        } catch (IllegalArgumentException e) {
            logger.error("Post not found with id: {}", id);
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching post with id: {}", e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to fetch post: " + e.getMessage()));
        }
    }

    //PUT request to update a post
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable String id, @RequestBody Post post) {
        try {
            logger.info("Updating post with id: {}, data: {}", id, post);
            Post updatedPost = postService.updatePost(id, post);
            logger.info("Post updated successfully: {}", updatedPost);
            return ResponseEntity.ok(updatedPost);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating post: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error updating post", e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to update post: " + e.getMessage()));
        }
    }

    //DELETE request to delete a post
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        try {
            logger.info("Deleting post with id: {}", id);
            postService.deletePost(id);
            logger.info("Post deleted successfully: {}", id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            logger.error("Post not found with id: {}", id);
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting post with id: {}", e);
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to delete post: " + e.getMessage()));
        }
    }

    //Error response class
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
