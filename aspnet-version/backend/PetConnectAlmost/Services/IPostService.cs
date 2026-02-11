using PetConnectAlmost.DTOs;

namespace PetConnectAlmost.Services
{
    public interface IPostService
    {
        Task<object> CreatePostAsync(long userId, CreatePostDto dto);
        Task<object> GetPostAsync(long postId);
        Task<object> GetFeedAsync(long userId);

        Task<object> GetUserPostsAsync(long userId);
        Task<object> UpdatePostAsync(long postId, long userId, UpdatePostDto dto);
        Task<object> DeletePostAsync(long postId, long userId);
        Task<object> ToggleLikeAsync(long userId, long postId);
        Task<object> IsPostLikedByUserAsync(long postId, long userId);
        Task<object> CreateCommentAsync(long postId, long userId, CreateCommentDto dto);
        Task<object> UpdateCommentAsync(long commentId, long userId, UpdateCommentDto dto);
        Task<object> DeleteCommentAsync(long commentId, long userId);
    }
}
