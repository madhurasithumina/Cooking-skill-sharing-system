import React, { useState, useEffect } from 'react';
import { followUser, unfollowUser, getFollowing } from '../services/api';
import './FollowButton.css';

const FollowButton = ({ currentUserId, targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        const following = await getFollowing(currentUserId);
        setIsFollowing(following.includes(targetUserId));
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };
    if (currentUserId !== targetUserId) checkFollowing();
  }, [currentUserId, targetUserId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(currentUserId, targetUserId);
        setIsFollowing(false);
      } else {
        await followUser(currentUserId, targetUserId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  if (currentUserId === targetUserId) return null; // Hide button for own profile

  return (
    <button className={`follow-btn ${isFollowing ? 'unfollow' : 'follow'}`} onClick={handleFollow}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
};

export default FollowButton;