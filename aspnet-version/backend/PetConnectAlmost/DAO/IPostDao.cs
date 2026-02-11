using PetConnectAlmost.Models;

namespace PetConnectAlmost.DAO
{
    public interface IPostDao
    {
        Task<Post?> GetPostByIdAsync(long postId);
        Task<List<Post>> GetPostsByUserIdAsync(long userId);
        Task<List<Post>> GetFeedAsync(long userId);  
        Task<long?> CreatePostAsync(Post post);
        Task UpdatePostAsync(Post post);
        Task DeletePostAsync(long postId);
        Task<bool?> LikePostAsync(long userId, long postId);  
        Task<int> GetLikeCountAsync(long postId);
        Task<bool?> IsLikedByUserAsync(long userId, long postId);
        Task<Comment?> GetCommentByIdAsync(long? commentId);
        Task<List<Comment>> GetCommentsByPostIdAsync(long postId);
        Task<long?> CreateCommentAsync(Comment comment);
        Task UpdateCommentAsync(Comment comment);
        Task DeleteCommentAsync(long commentId);
    }
}
