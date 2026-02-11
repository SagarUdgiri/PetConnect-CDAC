using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PetConnectAlmost.DTOs;
using PetConnectAlmost.Models;
using PetConnectAlmost.Services;

namespace PetConnectAlmost.Controllers
{
    [Authorize]
    [Route("api/Posts")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostService postService;

        public PostsController(IPostService postService)
        {
            this.postService = postService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePost([FromBody] CreatePostDto dto)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.CreatePostAsync(userId, dto);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return CreatedAtAction(nameof(GetPost), new { postId = ((PostDto)result).PostId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpGet("get/{postId}")]
        public async Task<IActionResult> GetPost(long postId)
        {
            try
            {
                var result = await postService.GetPostAsync(postId);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpGet("feed")]
        public async Task<IActionResult> GetFeed()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized(new { message = "User ID claim missing" });
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.GetFeedAsync(userId);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpGet("user")]
        public async Task<IActionResult> GetUserPosts()
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized(new { message = "User ID claim missing" });
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.GetUserPostsAsync(userId);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpPut("{postId}")]
        public async Task<IActionResult> UpdatePost(long postId, [FromBody] UpdatePostDto dto)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.UpdatePostAsync(postId, userId, dto);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpDelete("{postId}")]
        public async Task<IActionResult> DeletePost(long postId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.DeletePostAsync(postId, userId);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpPost("like")]
        public async Task<IActionResult> ToggleLike([FromBody] LikePostDto dto)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.ToggleLikeAsync(userId, dto.PostId);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpGet("{postId}/isliked")]
        public async Task<IActionResult> IsLiked(long postId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.IsPostLikedByUserAsync(postId, userId);

                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return Ok(result); // { "isLiked": true } or { "isLiked": false }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse
                {
                    Message = "Internal server error",
                    Error = "UnhandledException",
                    StatusCode = 500,
                    Details = ex.Message
                });
            }
        }

        [HttpPost("{postId}/addcomment")]
        public async Task<IActionResult> CreateComment(long postId, [FromBody] CreateCommentDto dto)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.CreateCommentAsync(postId, userId, dto);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return CreatedAtAction(nameof(GetComments), new { postId = postId }, result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpGet("{postId}/getcomments")]
        public async Task<IActionResult> GetComments(long postId)
        {
            try
            {
                var postResult = await postService.GetPostAsync(postId);
                if (postResult is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                var post = (PostDto)postResult;
                return Ok(post.Comments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpPut("comments/{commentId}")]
        public async Task<IActionResult> UpdateComment(long commentId, [FromBody] UpdateCommentDto dto)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.UpdateCommentAsync(commentId, userId, dto);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }

        [HttpDelete("comments/{commentId}")]
        public async Task<IActionResult> DeleteComment(long commentId)
        {
            var userIdClaim = User.FindFirst("sub") ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null) return Unauthorized();
            long userId = long.Parse(userIdClaim.Value);

            try
            {
                var result = await postService.DeleteCommentAsync(commentId, userId);
                if (result is ErrorResponse error)
                {
                    return StatusCode(error.StatusCode, error);
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ErrorResponse { Message = "Internal server error", Error = "UnhandledException", StatusCode = 500, Details = ex.Message });
            }
        }
    }
}
