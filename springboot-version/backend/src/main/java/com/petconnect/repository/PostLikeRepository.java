package com.petconnect.repository;

import com.petconnect.entity.Post;
import com.petconnect.entity.PostLike;
import com.petconnect.entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostAndUser(Post post, User user);
    
    Optional<PostLike> findByPostAndUser(Post post, User user);

    int countByPost(Post post);
}
