import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaArrowRight, FaTrash, FaEdit } from 'react-icons/fa';
import { useAuth } from '../../auth/AuthContext';
import postService from '../../../services/postService';
import FollowButton from './FollowButton';
import toast from 'react-hot-toast';

const PostCard = ({ post: initialPost, onDelete, onEdit }) => {
  const { user } = useAuth();
  const [post, setPost] = useState(initialPost);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    setPost(initialPost);
    checkIfLiked();
  }, [initialPost]);

  const checkIfLiked = async () => {
    try {
      if (!user?.id) return;
      const result = await postService.isLiked(initialPost.postId);
      setIsLiked(result.isLiked);
    } catch (error) {
       console.error("Error checking like status", error);
    }
  };

  const handleLike = async () => {
    if (isLiking || !user?.id) return;
    try {
      setIsLiking(true);
      await postService.toggleLike({ postId: post.postId, userId: user.id });
      setIsLiked(!isLiked);
      setPost(prev => ({
        ...prev,
        likesCount: isLiked ? prev.likesCount - 1 : prev.likesCount + 1
      }));
    } catch (error) {
      toast.error("Failed to update like");
    } finally {
      setIsLiking(false);
    }
  };

  const handleToggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
  };

  const fetchComments = async () => {
    try {
      const data = await postService.getComments(post.postId);
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments", error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user?.id) return;
    try {
      setIsCommenting(true);
      await postService.addComment(post.postId, { userId: user.id, content: newComment });
      setNewComment('');
      fetchComments();
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: '24px', position: 'relative' }}>
      <Card.Body className="p-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-800 me-3 shadow-sm border border-slate-100" style={{ 
              width: '42px', 
              height: '42px', 
              fontSize: '0.9rem', 
              backgroundColor: '#0d6efd',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {post.userProfileImageUrl || post.UserProfileImageUrl || post.userImageUrl || post.UserImageUrl ? (
                <img 
                  src={post.userProfileImageUrl || post.UserProfileImageUrl || post.userImageUrl || post.UserImageUrl} 
                  className="w-100 h-100 position-absolute top-0 start-0" 
                  style={{ objectFit: 'cover' }} 
                  alt="" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                  }} 
                />
              ) : null}
              <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ display: (post.userProfileImageUrl || post.UserProfileImageUrl || post.userImageUrl || post.UserImageUrl) ? 'none' : 'flex' }}>
                {post.userFullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
              </div>
            </div>
            <div>
              <div className="fw-800 text-slate-900" style={{ fontSize: '1rem' }}>{post.userFullName}</div>
              <div className="text-slate-400 small fw-600">{new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
          
          {/* Connect Button - Right of Username */}
          {post.userId !== user?.id && (
            <div className="ms-auto">
              <FollowButton userId={post.userId} />
            </div>
          )}
          
          {post.userId === user?.id && (
            <div className="ms-auto d-flex gap-2">
              <Button 
                variant="link" 
                onClick={() => onEdit(post)} 
                className="text-slate-300 p-0 hover-text-primary transition-smooth shadow-none border-0"
              >
                <FaEdit size={14} />
              </Button>
              <Button 
                variant="link" 
                onClick={() => onDelete(post.postId)} 
                className="text-slate-300 p-0 hover-text-danger transition-smooth shadow-none border-0"
              >
                <FaTrash size={14} />
              </Button>
            </div>
          )}
        </div>

        {post.imageUrl && (
          <div 
            className="rounded-4 overflow-hidden mb-3 border border-slate-100 shadow-sm bg-slate-50 d-flex align-items-center justify-content-center" 
            style={{ 
              maxHeight: '500px',
              backgroundColor: '#f8fafc'
            }}
          >
            {post.imageUrl.match(/\.(mp4|webm|mov|mkv)$/i) ? (
               <video 
                 src={post.imageUrl} 
                 controls 
                 className="w-100" 
                 style={{ 
                   maxHeight: '500px',
                   display: 'block'
                 }} 
               />
            ) : (
               <img 
                 src={post.imageUrl} 
                 alt={post.title} 
                 className="w-100" 
                 style={{ 
                   objectFit: 'contain', 
                   maxHeight: '500px',
                   display: 'block'
                 }} 
                 onError={(e) => {
                   console.warn("Image failed to load:", post.imageUrl);
                   e.target.style.display = 'none';
                   e.target.parentElement.style.display = 'none';
                 }}
               />
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-1 text-start mt-2">
          <h5 className="fw-900 text-slate-900 mb-2">{post.title}</h5>
          <p className="text-slate-600 fw-500 mb-2" style={{ lineHeight: '1.6' }}>{post.description}</p>
        </div>

        {/* Actions */}
        <div className="d-flex align-items-center justify-content-between pt-3 border-top border-slate-50">
          <div className="d-flex gap-4">
            <button 
              onClick={handleLike} 
              className={`d-flex align-items-center gap-2 border-0 bg-transparent fw-800 p-0 transition-smooth ${isLiked ? 'text-danger' : 'text-slate-400'}`}
              style={{ cursor: 'pointer' }}
              disabled={isLiking}
            >
              {isLiked ? <FaHeart size={18} /> : <FaRegHeart size={18} />}
              <span>{post.likesCount}</span>
            </button>
            <button 
              onClick={handleToggleComments}
              className="d-flex align-items-center gap-2 border-0 bg-transparent text-slate-400 fw-800 p-0 hover-text-primary transition-smooth"
              style={{ cursor: 'pointer' }}
            >
              <FaComment size={18} />
              <span>{comments.length || ''}</span>
            </button>
          </div>
          <Badge bg="slate-100" className="text-slate-400 fw-800 px-3 py-2 rounded-pill" style={{ backgroundColor: '#f8fafc', fontSize: '0.7rem' }}>
            {post.visibility}
          </Badge>
        </div>

        {/* Comment Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-top border-slate-50 animate-fadeIn">
            <div className="comment-list mb-4">
              {comments.length === 0 ? (
                <div className="text-center text-slate-400 small py-2">No comments yet. Be the first!</div>
              ) : (
                comments.map((comment, idx) => (
                  <div key={idx} className="d-flex mb-3 align-items-start text-start">
                    <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-800 me-2 shadow-sm border border-slate-100" style={{ 
                      width: '36px', 
                      height: '36px', 
                      fontSize: '0.8rem', 
                      flexShrink: 0, 
                      backgroundColor: '#0d6efd', 
                      overflow: 'hidden',
                      position: 'relative'
                    }}>
                      {comment.userProfileImageUrl || comment.UserProfileImageUrl || comment.userImageUrl || comment.UserImageUrl ? (
                        <img 
                          src={comment.userProfileImageUrl || comment.UserProfileImageUrl || comment.userImageUrl || comment.UserImageUrl} 
                          className="w-100 h-100 position-absolute top-0 start-0" 
                          style={{ objectFit: 'cover' }} 
                          alt="" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                          }} 
                        />
                      ) : null}
                      <div className="w-100 h-100 d-flex align-items-center justify-content-center" style={{ display: (comment.userProfileImageUrl || comment.UserProfileImageUrl || comment.userImageUrl || comment.UserImageUrl) ? 'none' : 'flex' }}>
                        {comment.userFullName?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2 px-3 rounded-4 flex-grow-1" style={{ backgroundColor: '#f8fafc', maxWidth: '85%' }}>
                      <div className="fw-800 text-slate-900 small mb-1">{comment.userFullName}</div>
                      <div className="text-slate-600 small fw-500" style={{ lineHeight: '1.4' }}>{comment.content}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Form onSubmit={handleAddComment}>
              <InputGroup className="bg-white border rounded-pill px-3 py-1 shadow-sm">
                <Form.Control 
                  placeholder="Write a comment..." 
                  className="border-0 shadow-none small fw-500"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isCommenting}
                />
                <Button 
                  type="submit" 
                  variant="link" 
                  className="p-0 text-primary d-flex align-items-center justify-content-center btn-icon"
                  disabled={isCommenting || !newComment.trim()}
                >
                  {isCommenting ? <Spinner animation="border" size="sm" /> : <FaArrowRight size={14} />}
                </Button>
              </InputGroup>
            </Form>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default PostCard;
