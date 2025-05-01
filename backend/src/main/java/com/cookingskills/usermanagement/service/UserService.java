
package com.cookingskills.usermanagement.service;

import com.cookingskills.usermanagement.model.User;
import com.cookingskills.usermanagement.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    public User findByUsername(String username) {
        logger.info("Finding user by username: {}", username);
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.orElse(null);
    }

    public User findByEmail(String email) {
        logger.info("Finding user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        logger.info("Creating user: {}", user.getUsername());
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new IllegalArgumentException("Username is required");
        }
        if (user.getEmail() == null || user.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        return userRepository.save(user);
    }

    public User getUserById(String id) {
        logger.info("Fetching user with id: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + id));
    }

    public List<User> getAllUsers() {
        logger.info("Fetching all users");
        return userRepository.findAll();
    }

    public List<User> getFollowers(String id) {
        logger.info("Fetching followers for user id: {}", id);
        User user = getUserById(id);
        List<String> followerIds = (List<String>) user.getFollowers();
        List<User> followers = new ArrayList<>();
        if (followerIds != null) {
            for (String followerId : followerIds) {
                try {
                    User follower = getUserById(followerId);
                    followers.add(follower);
                } catch (IllegalArgumentException e) {
                    logger.warn("Follower with id {} not found", followerId);
                }
            }
        }
        return followers;
    }

    public List<User> getFollowing(String id) {
        logger.info("Fetching following for user id: {}", id);
        User user = getUserById(id);
        List<String> followingIds = (List<String>) user.getFollowing();
        List<User> following = new ArrayList<>();
        if (followingIds != null) {
            for (String followingId : followingIds) {
                try {
                    User followed = getUserById(followingId);
                    following.add(followed);
                } catch (IllegalArgumentException e) {
                    logger.warn("Followed user with id {} not found", followingId);
                }
            }
        }
        return following;
    }

    public User updateUser(String id, User updatedUser) {
        logger.info("Updating user with id: {}", id);
        User user = getUserById(id);
        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setBio(updatedUser.getBio());
        user.setProfilePicture(updatedUser.getProfilePicture());
        user.setFollowing(updatedUser.getFollowing());
        user.setFollowers(updatedUser.getFollowers());
        return userRepository.save(user);
    }

    public void deleteUser(String id) {
        logger.info("Deleting user with id: {}", id);
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    public User followUser(String followerId, String followingId) {
        logger.info("User {} following user {}", followerId, followingId);
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("User cannot follow themselves");
        }
        User follower = getUserById(followerId);
        User following = getUserById(followingId);
        
        List<String> followingList = follower.getFollowing();
        if (followingList == null) {
            followingList = new ArrayList<>();
        }
        if (!followingList.contains(followingId)) {
            followingList.add(followingId);
            follower.setFollowing(followingList);
        }
        
        List<String> followerList = following.getFollowers();
        if (followerList == null) {
            followerList = new ArrayList<>();
        }
        if (!followerList.contains(followerId)) {
            followerList.add(followerId);
            following.setFollowers(followerList);
        }
        
        userRepository.save(following);
        return userRepository.save(follower);
    }

    public User unfollowUser(String followerId, String followingId) {
        logger.info("User {} unfollowing user {}", followerId, followingId);
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("User cannot unfollow themselves");
        }
        User follower = getUserById(followerId);
        User following = getUserById(followingId);
        
        List<String> followingList = follower.getFollowing();
        if (followingList != null && followingList.contains(followingId)) {
            followingList.remove(followingId);
            follower.setFollowing(followingList);
        }
        
        List<String> followerList = following.getFollowers();
        if (followerList != null && followerList.contains(followerId)) {
            followerList.remove(followerId);
            following.setFollowers(followerList);
        }
        
        userRepository.save(following);
        return userRepository.save(follower);
    }
}