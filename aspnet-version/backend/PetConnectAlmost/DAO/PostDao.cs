using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.Data;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public class PostDao : IPostDao
    {
        private readonly ApplicationDbContext dbcontext;

        public PostDao(ApplicationDbContext context)
        {
            dbcontext = context;
        }

        public async Task<Post?> GetPostByIdAsync(long postId)
        {
            return await dbcontext.Posts
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<List<Post>> GetPostsByUserIdAsync(long userId)
        {
            return await dbcontext.Posts
                .Where(p => p.UserId == userId)
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Post>> GetFeedAsync(long userId)
        {
            bool userExists = await dbcontext.Users.AnyAsync(u => u.Id == userId);
            if (!userExists)
                throw new Exception("User not found");

            var query =
                from p in dbcontext.Posts
                where
                    p.UserId == userId
                    || p.Visibility == "PUBLIC"
                    || (
                        p.Visibility == "CONNECTIONS"
                        && dbcontext.Follows.Any(f =>
                            f.Status == "ACCEPTED"
                            && (
                                (f.FollowerId == userId && f.FollowingId == p.UserId)
                                || (f.FollowingId == userId && f.FollowerId == p.UserId)
                            )
                        )
                    )
                orderby p.CreatedAt descending
                select p;

            return await query
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments)
                    .ThenInclude(c => c.User)
                .Distinct()
                .Take(20)
                .ToListAsync();
        }

        public async Task<long?> CreatePostAsync(Post post)
        {
            bool userExists = await dbcontext.Users.AnyAsync(u => u.Id == post.UserId);
            if (!userExists)
            {
                return null;  
            }
            dbcontext.Posts.Add(post);
            await dbcontext.SaveChangesAsync();
            return post.Id;
        }

        public async Task UpdatePostAsync(Post post)
        {
            dbcontext.Posts.Update(post);
            await dbcontext.SaveChangesAsync();
        }

        public async Task DeletePostAsync(long postId)
        {
            var post = await dbcontext.Posts.FindAsync(postId);
            if (post != null)
            {
                dbcontext.Posts.Remove(post);
                await dbcontext.SaveChangesAsync();
            }
        }

        public async Task<bool?> LikePostAsync(long userId, long postId)
        {
            bool userExists = await dbcontext.Users.AnyAsync(u => u.Id == userId);
            bool postExists = await dbcontext.Posts.AnyAsync(p => p.Id == postId);

            if (!userExists || !postExists)
            {
                return null;  
            }

            var existingLike = await dbcontext.PostLikes.FirstOrDefaultAsync(pl => pl.UserId == userId && pl.PostId == postId);
            if (existingLike != null)
            {
                dbcontext.PostLikes.Remove(existingLike);
                await dbcontext.SaveChangesAsync();
                return false;  // Unliked
            }
            else
            {
                var like = new PostLike { UserId = userId, PostId = postId };
                dbcontext.PostLikes.Add(like);
                await dbcontext.SaveChangesAsync();
                return true;  // Liked
            }
        }

        public async Task<int> GetLikeCountAsync(long postId)
        {
            return await dbcontext.PostLikes.CountAsync(pl => pl.PostId == postId);
        }

        public async Task<bool?> IsLikedByUserAsync(long userId, long postId)
        {
            bool userExists = await dbcontext.Users.AnyAsync(u => u.Id == userId);
            bool postExists = await dbcontext.Posts.AnyAsync(p => p.Id == postId);

            if (!userExists || !postExists)
            {
                return null;
            }
            return await dbcontext.PostLikes.AnyAsync(pl => pl.UserId == userId && pl.PostId == postId);
        }

        public async Task<Comment?> GetCommentByIdAsync(long? commentId)
        {
            return await dbcontext.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c => c.Id == commentId);
        }

        public async Task<List<Comment>> GetCommentsByPostIdAsync(long postId)
        {
            return await dbcontext.Comments
                .Where(c => c.PostId == postId)
                .Include(c => c.User)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<long?> CreateCommentAsync(Comment comment)
        {
            bool userExists = await dbcontext.Users.AnyAsync(u => u.Id == comment.UserId);
            if (!userExists)
                return null;

            var post = await dbcontext.Posts.FindAsync(comment.PostId);
            if (post == null)
                return null;

            dbcontext.Comments.Add(comment);
            await dbcontext.SaveChangesAsync();
            return comment.Id;
        }

        public async Task UpdateCommentAsync(Comment comment)
        {
            dbcontext.Comments.Update(comment);
            await dbcontext.SaveChangesAsync();
        }

        public async Task DeleteCommentAsync(long commentId)
        {
            var comment = await dbcontext.Comments.FindAsync(commentId);
            if (comment != null)
            {
                dbcontext.Comments.Remove(comment);
                await dbcontext.SaveChangesAsync();
            }
        }
    }
}
