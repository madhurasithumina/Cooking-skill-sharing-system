
package com.cookingskills.usermanagement.service;

import com.cookingskills.usermanagement.model.Post;
import com.cookingskills.usermanagement.model.User;
import com.cookingskills.usermanagement.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private static final Logger logger = LoggerFactory.getLogger(PostService.class);

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    public Post createPost(Post post) {
        logger.info("Creating post: {}", post);
        if (post.getUserId() == null || post.getUserId().trim().isEmpty()) {
            logger.error("User ID is required");
            throw new IllegalArgumentException("User ID is required");
        }
        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            logger.error("Title is required");
            throw new IllegalArgumentException("Title is required");
        }
        if (post.getDescription() == null || post.getDescription().trim().isEmpty()) {
            logger.error("Description is required");
            throw new IllegalArgumentException("Description is required");
        }
        try {
            User user = userService.getUserById(post.getUserId());
            post.setUsername(user.getUsername());
            post.setCreatedAt(LocalDateTime.now());
            Post savedPost = postRepository.save(post);
            logger.info("Post created successfully: {}", savedPost);
            return savedPost;
        } catch (IllegalArgumentException e) {
            logger.error("Invalid user ID: {}", post.getUserId());
            throw new IllegalArgumentException("User not found for ID: " + post.getUserId());
        } catch (Exception e) {
            logger.error("Error saving post to MongoDB", e);
            throw new RuntimeException("Failed to save post: " + e.getMessage());
        }
    }

    public List<Post> getPostsByUserId(String userId) {
        logger.info("Fetching posts for userId: {}", userId);
        if (userId == null || userId.trim().isEmpty()) {
            logger.error("User ID is required");
            throw new IllegalArgumentException("User ID is required");
        }
        try {
            List<Post> posts = postRepository.findByUserId(userId);
            return posts != null ? posts : new ArrayList<>();
        } catch (Exception e) {
            logger.error("Error fetching posts for userId: {}", userId, e);
            throw new RuntimeException("Failed to fetch posts: " + e.getMessage());
        }
    }

    public List<Post> getAllPosts() {
        logger.info("Fetching all posts");
        try {
            List<Post> posts = postRepository.findAll();
            return posts != null ? posts : new ArrayList<>();
        } catch (Exception e) {
            logger.error("Error fetching all posts", e);
            throw new RuntimeException("Failed to fetch all posts: " + e.getMessage());
        }
    }

    public Post getPostById(String id) {
        logger.info("Fetching post with id: {}", id);
        if (id == null || id.trim().isEmpty()) {
            logger.error("Post ID is required");
            throw new IllegalArgumentException("Post ID is required");
        }
        try {
            Optional<Post> post = postRepository.findById(id);
            if (!post.isPresent()) {
                logger.error("Post not found with id: {}", id);
                throw new IllegalArgumentException("Post not found with ID: " + id);
            }
            return post.get();
        } catch (Exception e) {
            logger.error("Error fetching post with id: {}", id, e);
            throw new RuntimeException("Failed to fetch post: " + e.getMessage());
        }
    }

    public Post updatePost(String id, Post updatedPost) {
        logger.info("Updating post with id: {}, data: {}", id, updatedPost);
        if (id == null || id.trim().isEmpty()) {
            logger.error("Post ID is required");
            throw new IllegalArgumentException("Post ID is required");
        }
        try {
            Optional<Post> existingPost = postRepository.findById(id);
            if (!existingPost.isPresent()) {
                logger.error("Post not found with id: {}", id);
                throw new IllegalArgumentException("Post not found with ID: " + id);
            }
            if (updatedPost.getTitle() == null || updatedPost.getTitle().trim().isEmpty()) {
                logger.error("Title is required");
                throw new IllegalArgumentException("Title is required");
            }
            if (updatedPost.getDescription() == null || updatedPost.getDescription().trim().isEmpty()) {
                logger.error("Description is required");
                throw new IllegalArgumentException("Description is required");
            }
            Post post = existingPost.get();
            post.setTitle(updatedPost.getTitle().trim());
            post.setDescription(updatedPost.getDescription().trim());
            post.setImage(updatedPost.getImage());
            Post savedPost = postRepository.save(post);
            logger.info("Post updated successfully: {}", savedPost);
            return savedPost;
        } catch (Exception e) {
            logger.error("Error updating post with id: {}", id, e);
            throw new RuntimeException("Failed to update post: " + e.getMessage());
        }
    }

    public void deletePost(String id) {
        logger.info("Deleting post with id: {}", id);
        if (id == null || id.trim().isEmpty()) {
            logger.error("Post ID is required");
            throw new IllegalArgumentException("Post ID is required");
        }
        try {
            if (!postRepository.existsById(id)) {
                logger.error("Post not found with id: {}", id);
                throw new IllegalArgumentException("Post not found with ID: " + id);
            }
            postRepository.deleteById(id);
            logger.info("Post deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting post with id: {}", id, e);
            throw new RuntimeException("Failed to delete post: " + e.getMessage());
        }
    }
}
