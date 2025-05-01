package com.cookingskills.usermanagement.service;

import com.cookingskills.usermanagement.model.Comment;
import com.cookingskills.usermanagement.repository.CommentRepository;
import com.cookingskills.usermanagement.repository.PostRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    public Comment createComment(String userId, String postId, String content) {
        logger.info("Creating comment for user {} on post {}", userId, postId);
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content is required");
        }
        Comment comment = new Comment(userId, postId, content, LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public List<Comment> getCommentsByPostId(String postId) {
        logger.info("Fetching comments for post {}", postId);
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("Post not found with ID: " + postId);
        }
        return commentRepository.findByPostId(postId);
    }

    public Comment updateComment(String commentId, String content) {
        logger.info("Updating comment {}", commentId);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with ID: " + commentId));
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment content is required");
        }
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(String commentId) {
        logger.info("Deleting comment {}", commentId);
        if (!commentRepository.existsById(commentId)) {
            throw new IllegalArgumentException("Comment not found with ID: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }
}