
package com.cookingskills.usermanagement.controller;

import com.cookingskills.usermanagement.model.User;
import com.cookingskills.usermanagement.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            logger.info("Login attempt for email: {}", loginRequest.getEmail());
            User user = userService.findByEmail(loginRequest.getEmail());
            if (user == null) {
                logger.warn("User not found for email: {}", loginRequest.getEmail());
                return ResponseEntity.status(404).body(new ErrorResponse("User not found"));
            }
            logger.info("Login successful for email: {}", loginRequest.getEmail());
            return ResponseEntity.ok(new LoginResponse(user.getId(), user.getUsername()));
        } catch (Exception e) {
            logger.error("Error during login for email: {}", loginRequest.getEmail(), e);
            return ResponseEntity.status(500).body(new ErrorResponse("Login failed: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            logger.info("Creating user with username: {}", user.getUsername());
            User createdUser = userService.createUser(user);
            logger.info("User created successfully: {}", createdUser.getUsername());
            return ResponseEntity.ok(new CreateUserResponse(createdUser.getId(), createdUser.getUsername()));
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating user: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error creating user", e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to create user: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            logger.info("Fetching user with id: {}", id);
            User user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            logger.warn("User not found with id: {}", id);
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching user with id: {}", id, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to fetch user: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            logger.info("Fetching all users");
            List<User> users = userService.getAllUsers();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching all users", e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to fetch users: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/followers")
    public ResponseEntity<?> getFollowers(@PathVariable String id) {
        try {
            logger.info("Fetching followers for user id: {}", id);
            List<User> followers = userService.getFollowers(id);
            return ResponseEntity.ok(followers);
        } catch (IllegalArgumentException e) {
            logger.warn("User not found with id: {}", id);
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching followers for user id: {}", id, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to fetch followers: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}/following")
    public ResponseEntity<?> getFollowing(@PathVariable String id) {
        try {
            logger.info("Fetching following for user id: {}", id);
            List<User> following = userService.getFollowing(id);
            return ResponseEntity.ok(following);
        } catch (IllegalArgumentException e) {
            logger.warn("User not found with id: {}", id);
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error fetching following for user id: {}", id, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to fetch following: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        try {
            logger.info("Updating user with id: {}", id);
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            logger.warn("User not found with id: {}", id);
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating user with id: {}", id, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to update user: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        try {
            logger.info("Deleting user with id: {}", id);
            userService.deleteUser(id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            logger.warn("User not found with id: {}", id);
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting user with id: {}", id, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to delete user: " + e.getMessage()));
        }
    }

    @PostMapping("/{followerId}/follow/{followingId}")
    public ResponseEntity<?> followUser(@PathVariable String followerId, @PathVariable String followingId) {
        try {
            logger.info("User {} attempting to follow user {}", followerId, followingId);
            User updatedUser = userService.followUser(followerId, followingId);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            logger.warn("Follow error: {}", e.getMessage());
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error during follow for user {} to {}", followerId, followingId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to follow user: " + e.getMessage()));
        }
    }

    @PostMapping("/{followerId}/unfollow/{followingId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String followerId, @PathVariable String followingId) {
        try {
            logger.info("User {} attempting to unfollow user {}", followerId, followingId);
            User updatedUser = userService.unfollowUser(followerId, followingId);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            logger.warn("Unfollow error: {}", e.getMessage());
            return ResponseEntity.status(404).body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            logger.error("Error during unfollow for user {} from {}", followerId, followingId, e);
            return ResponseEntity.status(500).body(new ErrorResponse("Failed to unfollow user: " + e.getMessage()));
        }
    }

    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    static class LoginResponse {
        private String userId;
        private String username;

        public LoginResponse(String userId, String username) {
            this.userId = userId;
            this.username = username;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }
    }

    static class CreateUserResponse {
        private String userId;
        private String username;

        public CreateUserResponse(String userId, String username) {
            this.userId = userId;
            this.username = username;
        }

        public String getUserId() {
            return userId;
        }

        public void setUserId(String userId) {
            this.userId = userId;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
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