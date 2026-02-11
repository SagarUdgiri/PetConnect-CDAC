package com.petconnect.repository;

import com.petconnect.entity.Post;
import com.petconnect.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUser(User user);
    
    @Query(""" 
    		Select Distinct p From Post p Where
    			p.user =:user
    			Or
    			p.visibility = 'PUBLIC'
    			Or (
    				p.visibility = 'CONNECTIONS'
    				And Exists (
    					Select 1 From Follow f 
    					Where f.status = 'ACCEPTED'
    					And (
    						(f.follower=:user And f.following=p.user)
    						Or
    						(f.following=:user And f.follower=p.user)
    					)
    				)
    			)
    		Order By p.createdAt Desc
    			
    		""")
    List<Post> findFeedWithConnections(User user);
}
