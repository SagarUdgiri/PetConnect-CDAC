package com.petconnect.service.impl;

import static com.petconnect.PetConnectApplication.mapList;
import com.petconnect.dto.UserDto;
import com.petconnect.entity.Follow;
import com.petconnect.entity.User;
import com.petconnect.repository.FollowRepository;
import com.petconnect.repository.UserRepository;
import com.petconnect.service.FollowService;
import com.petconnect.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
        private final FollowRepository followRepository;
        private final UserRepository userRepository;
        private final NotificationService notificationService;
        private final org.modelmapper.ModelMapper modelMapper;

        @Override
        @Transactional
        public String followUser(Long followerId, Long followingId) {
                if (followerId.equals(followingId)) {
                        throw new RuntimeException("You cannot follow yourself");
                }

                User follower = userRepository.findById(followerId)
                                .orElseThrow(() -> new RuntimeException("Follower not found"));
                User following = userRepository.findById(followingId)
                                .orElseThrow(() -> new RuntimeException("User to follow not found"));

                if (followRepository.existsByFollowerAndFollowing(follower, following)) {
                        throw new RuntimeException("Already a connection or request exists");
                }

                // If they already followed me, just accept it
                Optional<Follow> reciprocal = followRepository.findByFollowerAndFollowing(following, follower);
                if (reciprocal.isPresent()) {
                        Follow follow = reciprocal.get();
                        follow.setStatus("ACCEPTED");
                        followRepository.save(follow);

                        // Trigger Notification for the original requester
                        notificationService.createNotification(
                                        following.getId(),
                                        "CONNECTION_ACCEPTED",
                                        follower.getFullName() + " accepted your connection request.",
                                        null,
                                        follower.getId());

                        return "Connection accepted (reciprocal)";
                }

                Follow follow = new Follow();
                follow.setFollower(follower);
                follow.setFollowing(following);
                follow.setStatus("PENDING");
                followRepository.save(follow);

                // Trigger Notification
                notificationService.createNotification(
                                followingId,
                                "CONNECTION_REQUEST",
                                follower.getFullName() + " wants to connect with you.",
                                null,
                                followerId);

                return "Connection request sent to " + following.getFullName();
        }

        @Override
        @Transactional
        public String acceptRequest(Long followerId, Long followingId) {
                User follower = userRepository.findById(followerId)
                                .orElseThrow(() -> new RuntimeException("Follower not found"));
                User following = userRepository.findById(followingId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                                .orElseThrow(() -> new RuntimeException("Connection request not found"));

                follow.setStatus("ACCEPTED");
                followRepository.save(follow);

                // Trigger Notification
                notificationService.createNotification(
                                followerId,
                                "CONNECTION_ACCEPTED",
                                following.getFullName() + " accepted your connection request.",
                                null,
                                followingId);

                return "Connection request accepted";
        }

        @Override
        public List<UserDto> getSuggestions(Long userId, Integer limit) {
                // Simplified suggestion logic: users not being followed
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Get people I am already connected to or have sent a request to
                List<Long> followingIds = followRepository.findByFollower(user).stream()
                                .map(f -> f.getFollowing().getId())
                                .collect(Collectors.toList());

                // Also get people who followed me (to avoid suggesting people who are already
                // in my requests)
                List<Long> followerIds = followRepository.findByFollowing(user).stream()
                                .map(f -> f.getFollower().getId())
                                .collect(Collectors.toList());

                followingIds.add(userId);
                followingIds.addAll(followerIds);

                java.util.stream.Stream<User> suggestionsStream = userRepository.findAll().stream()
                				.filter(u -> !u.getRole().equals("ADMIN"))
                                .filter(u -> !followingIds.contains(u.getId()));

                if (limit != null && limit > 0) {
                        suggestionsStream = suggestionsStream.limit(limit);
                }

                List<User> suggestions = suggestionsStream.collect(Collectors.toList());

                return mapList(modelMapper, suggestions, UserDto.class);
        }

        @Override
        @Transactional
        public String unfollowUser(Long followerId, Long followingId) {
                User u1 = userRepository.findById(followerId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                User u2 = userRepository.findById(followingId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Follow follow = followRepository.findByFollowerAndFollowing(u1, u2)
                                .or(() -> followRepository.findByFollowerAndFollowing(u2, u1))
                                .orElseThrow(() -> new RuntimeException("No connection found between these users"));

                followRepository.delete(follow);
                return "Connection removed successfully";
        }

        @Override
        @Transactional
        public String cancelRequest(Long followerId, Long followingId) {
                User follower = userRepository.findById(followerId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                User following = userRepository.findById(followingId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Follow follow = followRepository.findByFollowerAndFollowing(follower, following)
                                .orElseThrow(() -> new RuntimeException("No pending request found"));

                if (!"PENDING".equals(follow.getStatus())) {
                        throw new RuntimeException("Can only cancel pending requests");
                }

                followRepository.delete(follow);
                return "Request cancelled successfully";
        }

        @Override
        public List<UserDto> getFollowers(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                List<User> followers = followRepository.findByFollowing(user).stream()
                                .map(Follow::getFollower)
                                .collect(Collectors.toList());
                return mapList(modelMapper, followers, UserDto.class);
        }

        @Override
        public List<UserDto> getFollowing(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                List<User> following = followRepository.findByFollower(user).stream()
                                .map(Follow::getFollowing)
                                .collect(Collectors.toList());
                return mapList(modelMapper, following, UserDto.class);
        }

        @Override
        public String getFollowStatus(Long followerId, Long followingId) {
                User me = userRepository.findById(followerId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                User other = userRepository.findById(followingId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // Check outgoing request
                Optional<Follow> outgoing = followRepository.findByFollowerAndFollowing(me, other);
                if (outgoing.isPresent()) {
                        return outgoing.get().getStatus(); // PENDING or ACCEPTED
                }

                // Check incoming request
                Optional<Follow> incoming = followRepository.findByFollowerAndFollowing(other, me);
                if (incoming.isPresent()) {
                        return incoming.get().getStatus().equals("PENDING") ? "INCOMING" : "ACCEPTED";
                }

                return "NONE";
        }

        @Override
        public List<UserDto> getConnections(Long userId) {
                System.out.println("🔍 Getting connections for userId: " + userId);
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                // People I follow (ACCEPTED)
                List<User> following = followRepository.findByFollower(user).stream()
                                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                                .map(Follow::getFollowing)
                                .collect(Collectors.toList());
                System.out.println("📤 Following (ACCEPTED): " + following.size());

                // People following me (ACCEPTED)
                List<User> followers = followRepository.findByFollowing(user).stream()
                                .filter(f -> "ACCEPTED".equals(f.getStatus()))
                                .map(Follow::getFollower)
                                .collect(Collectors.toList());
                System.out.println("📥 Followers (ACCEPTED): " + followers.size());

                // Merge and remove duplicates (if any)
                following.addAll(followers);
                List<User> distinctConnections = following.stream().distinct().collect(Collectors.toList());
                System.out.println("✅ Total connections: " + distinctConnections.size());

                return mapList(modelMapper, distinctConnections, UserDto.class);
        }

        @Override
        public List<UserDto> getPendingRequests(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                List<User> pending = followRepository.findByFollowing(user).stream()
                                .filter(f -> "PENDING".equals(f.getStatus()))
                                .map(Follow::getFollower)
                                .collect(Collectors.toList());
                return mapList(modelMapper, pending, UserDto.class);
        }

        @Override
        public List<UserDto> searchUsers(String query, Long currentUserId) {
                List<User> users = userRepository.searchUsers(query, currentUserId);
                return users.stream()
                		.filter(u -> !u.getRole().equals("ADMIN"))
                		.map(u -> {
                        UserDto dto = modelMapper.map(u, UserDto.class);
                        dto.setFollowStatus(getFollowStatus(currentUserId, u.getId()));
                        return dto;
                }).collect(Collectors.toList());
        }
}
