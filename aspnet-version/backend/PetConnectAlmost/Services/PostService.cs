using Microsoft.EntityFrameworkCore;
using PetConnectAlmost.DAO;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;

namespace PetConnectAlmost.Services
{
    public class PostService : IPostService
    {
        private readonly IPostDao postDao;
        private readonly INotificationService _notificationService;
        private readonly IUserService _userService;

        public PostService(IPostDao postDao, INotificationService notificationService, IUserService userService)
        {
            this.postDao = postDao;
            this._notificationService = notificationService;
            this._userService = userService;
        }

        public async Task<object> CreatePostAsync(long userId, CreatePostDto dto)
        {
            try
            {
                var post = new Post
                {
                    UserId = userId,
                    Title = dto.Title,
                    Description = dto.Description,
                    ImageUrl = dto.ImageUrl,
                    Visibility = dto.Visibility,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                long? postId = await postDao.CreatePostAsync(post);
                if (postId == null)
                {
                    return new ErrorResponse
                    {
                        Message = "Failed to create post - User not found",
                        Error = "InvalidUser",
                        StatusCode = 400
                    };
                }
                var createdPost = await postDao.GetPostByIdAsync(postId.Value);
                if (createdPost == null)
                    return new ErrorResponse { Message = "Failed to create post", Error = "CreationFailed", StatusCode = 500 };

                return MapToDto(createdPost);
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> GetPostAsync(long postId)
        {
            try
            {
                var post = await postDao.GetPostByIdAsync(postId);
                if (post == null)
                    return new ErrorResponse { Message = "Post not found", Error = "NotFound", StatusCode = 404 };

                return MapToDto(post);
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> GetFeedAsync(long userId)
        {
            try
            {
                var posts = await postDao.GetFeedAsync(userId);
                if(posts == null)
                    return new ErrorResponse
                    {
                        Message = "Invalid UserId",
                        Error = "InvalidReference",
                        StatusCode = 400
                    };
                var dtos = posts.Select(MapToDto).ToList();
                return dtos;
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> GetUserPostsAsync(long userId)
        {
            try
            {
                var posts = await postDao.GetPostsByUserIdAsync(userId);
                if (posts == null)
                    return new ErrorResponse
                    {
                        Message = "Invalid UserId",
                        Error = "InvalidReference",
                        StatusCode = 400
                    };
                var dtos = posts.Select(MapToDto).ToList();
                return dtos;
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> UpdatePostAsync(long postId, long userId, UpdatePostDto dto)
        {
            try
            {
                var post = await postDao.GetPostByIdAsync(postId);
                if (post == null)
                    return new ErrorResponse { Message = "Post not found", Error = "NotFound", StatusCode = 404 };

                if (post.UserId != userId)
                    return new ErrorResponse { Message = "Unauthorized to update this post", Error = "Unauthorized", StatusCode = 403 };

                if (!string.IsNullOrEmpty(dto.Title)) post.Title = dto.Title;
                if (!string.IsNullOrEmpty(dto.Description)) post.Description = dto.Description;
                if (dto.Visibility != null) post.Visibility = dto.Visibility;

                post.UpdatedAt = DateTime.UtcNow;
                await postDao.UpdatePostAsync(post);

                var updatedPost = await postDao.GetPostByIdAsync(postId);
                return MapToDto(updatedPost!);
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> DeletePostAsync(long postId, long userId)
        {
            try
            {
                var post = await postDao.GetPostByIdAsync(postId);
                if (post == null || post.UserId != userId)
                    return new ErrorResponse { Message = "Post not found or unauthorized", Error = "Unauthorized", StatusCode = 403 };

                await postDao.DeletePostAsync(postId);
                return new { message = "Post deleted successfully" };
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> ToggleLikeAsync(long userId, long postId)
        {
            try
            {
                var result = await postDao.LikePostAsync(userId, postId);
                if (result == null)
                {
                    return new ErrorResponse
                    {
                        Message = "Invalid PostId or User session – cannot like",
                        Error = "InvalidReference",
                        StatusCode = 400  
                    };
                }

                var action = result.Value ? "liked" : "unliked";

                // Trigger Notification if Liked
                if (result.Value)
                {
                    var post = await postDao.GetPostByIdAsync(postId);
                    if (post != null && post.UserId != userId)
                    {
                        var liker = await _userService.GetUserEntityByIdAsync(userId);
                        string likerName = liker?.FullName ?? "Someone";

                        await _notificationService.CreateNotificationAsync(
                            post.UserId,
                            "LIKE",
                            $"[NEW] {likerName} liked your post: {post.Title}",
                            postId
                        );
                    }
                }

                return new { message = $"Post {action}", liked = result.Value };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] ToggleLikeAsync: {ex.Message}");
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> IsPostLikedByUserAsync(long postId, long userId)
        {
            try
            {
                bool? isLiked = await postDao.IsLikedByUserAsync(userId, postId);
                if (isLiked == null)
                {
                    return new ErrorResponse
                    {
                        Message = "Invalid UserId or PostId",
                        Error = "InvalidReference",
                        StatusCode = 400
                    };
                }
                return new { isLiked };   // { "isLiked": true } or { "isLiked": false }
            }
            catch (Exception ex)
            {
                return new ErrorResponse
                {
                    Message = "Internal server error",
                    Error = "ServerError",
                    StatusCode = 500,
                    Details = ex.Message
                };
            }
        }

        public async Task<object> CreateCommentAsync(long postId, long userId, CreateCommentDto dto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dto.Content))
                    return new ErrorResponse { Message = "Comment content required", Error = "ValidationError", StatusCode = 400 };

                var comment = new Comment
                {
                    PostId = postId,
                    UserId = userId,
                    Content = dto.Content,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                long? commentId = await postDao.CreateCommentAsync(comment);
                if (commentId == null)
                    return new ErrorResponse { Message = "Cannot create comment: Invalid PostId", Error = "NotFound", StatusCode = 404 };

                var createdComment = await postDao.GetCommentByIdAsync(commentId);
                if (createdComment == null)
                    return new ErrorResponse { Message = "Failed to create comment", Error = "CreationFailed", StatusCode = 500 };

                // Trigger Notification 
                var post = await postDao.GetPostByIdAsync(postId);
                if (post != null && post.UserId != userId)
                {
                    await _notificationService.CreateNotificationAsync(
                        post.UserId,
                        "COMMENT",
                        $"{createdComment.User.FullName} commented on your post: \"{dto.Content.Substring(0, Math.Min(dto.Content.Length, 20))}...\"",
                        postId
                    );
                }

                return MapToCommentDto(createdComment);
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> UpdateCommentAsync(long commentId, long userId, UpdateCommentDto dto)
        {
            try
            {
                var comment = await postDao.GetCommentByIdAsync(commentId);
                if (comment == null)
                    return new ErrorResponse { Message = "Comment not found", Error = "NotFound", StatusCode = 404 };

                if (comment.UserId != userId)
                    return new ErrorResponse { Message = "Unauthorized to update this comment", Error = "Unauthorized", StatusCode = 403 };

                comment.Content = dto.Content;
                comment.UpdatedAt = DateTime.UtcNow;
                await postDao.UpdateCommentAsync(comment);

                var updatedComment = await postDao.GetCommentByIdAsync(commentId);
                return MapToCommentDto(updatedComment!);
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        public async Task<object> DeleteCommentAsync(long commentId, long userId)
        {
            try
            {
                var comment = await postDao.GetCommentByIdAsync(commentId);
                if (comment == null || comment.UserId != userId)
                    return new ErrorResponse { Message = "Comment not found or unauthorized", Error = "Unauthorized", StatusCode = 403 };

                await postDao.DeleteCommentAsync(commentId);
                return new { message = "Comment deleted successfully" };
            }
            catch (Exception ex)
            {
                return new ErrorResponse { Message = "Internal server error", Error = "ServerError", StatusCode = 500, Details = ex.Message };
            }
        }

        // Helpers
        private PostDto MapToDto(Post post)
        {
            return new PostDto
            {
                PostId = post.Id,
                UserId = post.UserId,
                UserFullName = post.User.FullName ?? string.Empty,
                UserProfileImageUrl = post.User.ImageUrl,
                Title = post.Title,
                Description = post.Description,
                ImageUrl = post.ImageUrl,
                Visibility = post.Visibility,
                CreatedAt = post.CreatedAt,
                UpdatedAt = post.UpdatedAt,
                LikesCount = post.Likes.Count,
                Comments = post.Comments.Select(MapToCommentDto).ToList()
            };
        }

        private CommentDto MapToCommentDto(Comment comment)
        {
            return new CommentDto
            {
                CommentId = comment.Id,
                UserId = comment.UserId,
                UserFullName = comment.User.FullName ?? string.Empty,
                UserProfileImageUrl = comment.User.ImageUrl,
                Content = comment.Content,
                CreatedAt = comment.CreatedAt,
                UpdatedAt = comment.UpdatedAt
            };
        }

        
    }
}
