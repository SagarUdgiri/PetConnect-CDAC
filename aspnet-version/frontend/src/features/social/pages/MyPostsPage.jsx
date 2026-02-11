import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button } from 'react-bootstrap';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import postService from '../../../services/postService';
import authService from '../../../services/authService';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import UserSuggestions from '../components/UserSuggestions';
import { FaNewspaper, FaUserEdit, FaRobot, FaPaw, FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const MyPostsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [profile, setProfile] = useState(user);
  const isMyPosts = location.pathname === '/my-posts';

  useEffect(() => {
    if (user?.id || user?.userId) {
      const uid = user.id || user.userId;
      fetchUserProfile(uid);
      fetchUserPosts();
    }
  }, [user]);

  const fetchUserProfile = async (id) => {
    try {
      const data = await authService.getUserById();
      setProfile({ ...user, ...data });
    } catch (e) {
      console.error("Failed to fetch profile:", e);
    }
  };

  const fetchUserPosts = async () => {
    try {
      setLoading(true);
      const data = await postService.getUserPosts();
      setPosts(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching user posts", err);
      setError("Unable to load your posts.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = (postId) => {
    toast((t) => (
      <div className="d-flex flex-column gap-2" style={{ minWidth: '250px' }}>
        <div className="d-flex align-items-center gap-2 text-dark font-weight-bold">
           <div className="rounded-circle bg-danger bg-opacity-10 p-2 text-danger">
             <i className="bi bi-trash-fill"></i>
           </div>
           <span className="fw-700">Delete this post?</span>
        </div>
        <div className="text-secondary small fw-500 ms-1 mb-1">
          This post will be permanently removed.
        </div>
        <div className="d-flex gap-2 justify-content-end mt-1">
          <Button 
            size="sm" 
            variant="light" 
            onClick={() => toast.dismiss(t.id)}
            className="border-0 bg-slate-100 text-slate-600 fw-600 rounded-pill px-3"
          >
            Cancel
          </Button>
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => {
              toast.dismiss(t.id);
              confirmDeletePost(postId);
            }}
            className="rounded-pill px-3 fw-600 shadow-sm"
          >
            Delete
          </Button>
        </div>
      </div>
    ), { duration: 5000, position: 'top-center' });
  };

  const confirmDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId);
      setPosts(posts.filter(p => p.postId !== postId));
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const Sidebar = () => (
    <div className="sticky-top" style={{ top: '100px' }}>
      <div className="text-center p-4">
        <div 
          className="mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center text-white fw-900 border border-4 border-white shadow-sm overflow-hidden" 
          style={{ width: '100px', height: '100px', background: '#f1f5f9' }}
        >
          {profile?.imageUrl || profile?.userProfileImageUrl ? (
            <img src={profile.imageUrl || profile.userProfileImageUrl} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="" />
          ) : (
            <span style={{ fontSize: '2rem', color: '#cbd5e1' }}>{profile?.fullName?.substring(0, 1).toUpperCase() || 'U'}</span>
          )}
        </div>
        <h4 className="fw-900 text-slate-900 mb-1">{profile?.fullName}</h4>
        <p className="text-slate-400 small fw-700 mb-4">@{profile?.username || profile?.userName}</p>
        {profile?.bio && (
          <div className="mb-4 text-center">
            <p className="text-slate-500 small fw-600 mb-0 italic">"{profile.bio}"</p>
          </div>
        )}
        
<div className="d-flex flex-column gap-1 mt-4 text-start">
  {/* Feed */}
  <Link to="/feed" className="text-decoration-none">
    <div
      className={`d-flex align-items-center gap-3 p-2 rounded-4 transition-smooth
        ${!isMyPosts
          ? 'bg-primary bg-opacity-10 text-primary'
          : 'bg-transparent text-slate-500 hover-bg-slate-50'
        }`}
    >
      <FaNewspaper
        size={16}
        className={!isMyPosts ? 'text-primary' : 'text-slate-400'}
      />
      <span className="fw-800 small">Feed</span>
    </div>
  </Link>

  {/* My Posts */}
  <Link to="/my-posts" className="text-decoration-none">
    <div
      className={`d-flex align-items-center gap-3 p-2 rounded-4 transition-smooth
        ${isMyPosts
          ? 'bg-primary bg-opacity-10 text-primary'
          : 'bg-transparent text-slate-500 hover-bg-slate-50'
        }`}
    >
      <FaUserEdit
        size={16}
        className={isMyPosts ? 'text-primary' : 'text-slate-400'}
      />
      <span className="fw-800 small">My Posts</span>
    </div>
  </Link>
</div>


      </div>
    </div>
  );

  return (
    <Container className="py-5" style={{ maxWidth: '1100px' }}>
      <Row className="g-5">
        <Col lg={3} className="d-none d-lg-block">
          <Sidebar />
        </Col>

        <Col lg={6}>
          <div className="d-flex align-items-center gap-3 mb-4">
            <Button variant="link" onClick={() => navigate('/feed')} className="p-0 text-slate-400 hover-text-primary transition-smooth shadow-none mb-1">
              <FaArrowLeft size={18} />
            </Button>
            <h2 className="fw-900 m-0 text-slate-900">My Posts</h2>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-slate-400 fw-700">Loading your memories...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>
          ) : posts.length === 0 ? (
            <div className="text-center py-5 px-4 bg-white rounded-4 shadow-sm border border-slate-50">
               <div className="mb-4 text-slate-200" style={{ fontSize: '4rem' }}><FaPaw /></div>
               <h4 className="fw-800 text-slate-400">No posts yet</h4>
               <p className="text-slate-400 small mb-3">Your stories will appear here. Share something new!</p>
               <Button variant="outline-primary" className="rounded-pill fw-800 px-4" onClick={() => navigate('/feed')}>Go to Feed</Button>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.postId} post={post} onDelete={handleDeletePost} onEdit={handleEditPost} />
            ))
          )}
        </Col>

        <Col lg={3} className="d-none d-lg-block">
          <div className="sticky-top" style={{ top: '100px' }}>
            <UserSuggestions />
          </div>
        </Col>
      </Row>

      <CreatePostModal 
        show={showModal} 
        onHide={() => {
          setShowModal(false);
          setEditingPost(null);
        }} 
        onSuccess={fetchUserPosts}
        editData={editingPost}
      />
      <style>{`
        .transition-smooth { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-bg-slate-50:hover { background-color: #f8fafc; }
      `}</style>
    </Container>
  );
};

export default MyPostsPage;
