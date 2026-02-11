package com.petconnect.service;

import com.petconnect.dto.UserDto;
import java.util.List;

public interface FollowService {
        String followUser(Long followerId, Long followingId);

        String acceptRequest(Long followerId, Long followingId);

        List<UserDto> getSuggestions(Long userId, Integer limit);

        String unfollowUser(Long followerId, Long followingId);

        String cancelRequest(Long followerId, Long followingId);

        List<UserDto> getFollowers(Long userId);

        List<UserDto> getFollowing(Long userId);

        String getFollowStatus(Long followerId, Long followingId);

        List<UserDto> getConnections(Long userId);

        List<UserDto> getPendingRequests(Long userId);

        List<UserDto> searchUsers(String query, Long currentUserId);
}
