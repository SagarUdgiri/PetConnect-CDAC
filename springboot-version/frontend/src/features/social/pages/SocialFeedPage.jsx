import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner, Alert, Button, Card, Modal } from 'react-bootstrap';
import { /*useLocation,*/ Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import postService from '../../../services/postService';
import authService from '../../../services/authService';
import petService from '../../../services/petService';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import UserSuggestions from '../components/UserSuggestions';
import { FaPlus, FaNewspaper, FaUserEdit, FaPaw, FaRobot } from 'react-icons/fa';
import toast from 'react-hot-toast';

const SocialFeedPage = () => {
  const { user } = useAuth();
  // const location = useLocation();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [showPetRestriction, setShowPetRestriction] = useState(false);
  const [hasPets, setHasPets] = useState(false);
  // const searchParams = new URLSearchParams(location.search);
  // const searchQuery = searchParams.get('search');

  const [profile, setProfile] = useState(user);

  useEffect(() => {
    fetchFeed();
    if (user?.id || user?.userId) {
      // Handle both id and userId case
      const uid = user.id || user.userId;
      console.log("🚀 Starting Profile Fetch for ID:", uid);
      fetchUserProfile(uid);
      checkUserPets(uid);
    }
  }, [user]);

  const checkUserPets = async (userId) => {
    try {
      const pets = await petService.getPetsByUserId(userId);
      if (pets && pets.length > 0) {
        setHasPets(true);
      } else {
        setHasPets(false);
      }
    } catch (e) {
      console.error("Error checking pets:", e);
    }
  };

  const fetchUserProfile = async (id) => {
    try {
      const data = await authService.getUserById(id);
      console.log("✅ Profile Fetched:", data);
      setProfile({ ...user, ...data });
    } catch (e) {
      console.error("❌ Failed to fetch profile:", e);
    }
  }

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const data = await postService.getFeed(user.id);

      let filteredPosts = data || [];
      // if (searchQuery) {
      //   const query = searchQuery.toLowerCase();
      //   filteredPosts = filteredPosts.filter(p =>
      //     p.postId?.toString() === query ||
      //     p.title?.toLowerCase().includes(query) ||
      //     p.description?.toLowerCase().includes(query) ||
      //     p.userFullName?.toLowerCase().includes(query)
      //   );
      // }

      setPosts(filteredPosts);
      setError(null);
    } catch (err) {
      console.error("Error fetching feed", err);
      setError("Unable to load the feed. Check your connection.");
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
          This post will be removed from the feed.
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
    ), { duration: 5000, position: 'top-center', style: { borderRadius: '16px', background: '#fff', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' } });
  };

  const confirmDeletePost = async (postId) => {
    try {
      await postService.deletePost(postId, user.id);
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
          <Link to="/feed" className="text-decoration-none">
            <div
              className={`d-flex align-items-center gap-3 p-2 rounded-4 transition-smooth
                ${!window.location.pathname.includes('my-posts')
                  ? 'bg-primary bg-opacity-10 text-primary'
                  : 'bg-transparent text-slate-500 hover-bg-slate-50'
                }`}
            >
              <FaNewspaper
                size={16}
                className={
                  !window.location.pathname.includes('my-posts')
                    ? 'text-primary'
                    : 'text-slate-400'
                }
              />
              <span className="fw-800 small">Feed</span>
            </div>
          </Link>

          {/* My Posts */}
          <Link to="/my-posts" className="text-decoration-none">
            <div
              className={`d-flex align-items-center gap-3 p-2 rounded-4 transition-smooth
                ${window.location.pathname.includes('my-posts')
                  ? 'bg-primary bg-opacity-10 text-primary'
                  : 'bg-transparent text-slate-500 hover-bg-slate-50'
                }`}
            >
              <FaUserEdit
                size={16}
                className={
                  window.location.pathname.includes('my-posts')
                    ? 'text-primary'
                    : 'text-slate-400'
                }
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

        {/* Central Feed */}
        <Col lg={6}>
          {/* Header & Search Summary */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-900 m-0 text-slate-900">
              {/* {searchQuery ? `Results for "${searchQuery}"` : */'Community Feed'}
            </h2>
            <Button
              className="btn-primary-pet px-4 py-2 d-flex align-items-center gap-2 rounded-pill fw-800 border-0 shadow-sm"
              onClick={() => hasPets ? setShowModal(true) : setShowPetRestriction(true)}
            >
              <FaPlus size={12} /> Post
            </Button>
          </div>

          {/* Feed Content */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3 text-slate-400 fw-700">Assembling your timeline...</p>
            </div>
          ) : error ? (
            <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>
          ) : posts.length === 0 ? (
            <div className="text-center py-5 px-4 bg-white rounded-4 shadow-sm border border-slate-50">
              <div className="mb-4 text-slate-200" style={{ fontSize: '4rem' }}><FaNewspaper /></div>
              <h4 className="fw-800 text-slate-400">No posts yet</h4>
              <p className="text-slate-400 small mb-3">Share your first story to get the ball rolling!</p>
              <Button variant="outline-primary" className="rounded-pill fw-800 px-4" onClick={() => hasPets ? setShowModal(true) : setShowPetRestriction(true)}>Share Your First Story</Button>
            </div>
          ) : (
            posts.map(post => (
              <PostCard key={post.postId} post={post} onDelete={handleDeletePost} onEdit={handleEditPost} />
            ))
          )}
        </Col>

        {/* Right Sidebar - Suggestions/Trends */}
        <Col lg={3} className="d-none d-lg-block">
          <div className="sticky-top" style={{ top: '100px' }}>
            <UserSuggestions />

            <Card className="border-0 shadow-sm p-4 mb-4 text-center overflow-hidden position-relative" style={{ borderRadius: '24px', background: 'white' }}>
              <div className="position-absolute top-0 start-0 w-100 p-1 bg-primary bg-opacity-10"></div>
              <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center shadow-sm text-primary fw-900 fs-4" style={{ width: '60px', height: '60px' }}>
                <FaRobot />
              </div>
              <h6 className="fw-800 text-slate-900 mb-1">AI Pet Advisor</h6>
              <div className="badge rounded-pill bg-primary bg-opacity-10 text-primary small fw-800 mb-2" style={{ fontSize: '0.6rem' }}>NEW FEATURE</div>
              <p className="text-slate-500 small mb-3">Instant health insights and precision nutrition plans.</p>
              <Link to="/my-pets?tab=ai" className="btn btn-primary rounded-pill fw-700 w-100 btn-sm border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}>
                Try AI Advisor
              </Link>
            </Card>
          </div>
        </Col>
      </Row>

      <CreatePostModal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingPost(null);
        }}
        onSuccess={fetchFeed}
        editData={editingPost}
      />

      {/* Pet Restriction Modal */}
      <Modal show={showPetRestriction} onHide={() => setShowPetRestriction(false)} centered>
        <Modal.Header closeButton className="border-0" />
        <Modal.Body className="text-center px-5 pb-5 pt-0">
          <div className="mb-4 text-primary-pet" style={{ fontSize: '3rem' }}>
            <FaPaw />
          </div>
          <h4 className="fw-800 mb-3 text-slate-900">Create a Pet Profile First!</h4>
          <p className="text-slate-500 mb-4 px-3">
            To share posts with our community, you need to register at least one pet. Let everyone meet your furry friend!
          </p>
          <div className="d-grid gap-3">
            <Button
              className="btn-primary-pet rounded-pill fw-800 py-2 border-0 shadow-sm"
              onClick={() => navigate('/pets/register')}
            >
              Create Pet Profile
            </Button>
            <Button
              variant="light"
              className="rounded-pill text-slate-500 fw-700 bg-slate-100 border-0"
              onClick={() => setShowPetRestriction(false)}
            >
              Maybe Later
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <style>{`
        .shadow-premium {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08) !important;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%);
        }
        .nav-item-premium {
          transition: all 0.3s ease;
        }
        .nav-item-premium:hover {
          background-color: rgba(79, 70, 229, 0.05);
          transform: translateX(5px);
        }
        .nav-item-premium.active {
          background-color: rgba(79, 70, 229, 0.08);
          border: 1px solid rgba(79, 70, 229, 0.1);
        }
        .transition-smooth {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .grayscale { filter: grayscale(1); }
        .hover-grayscale-0:hover { filter: grayscale(0); }
      `}</style>
    </Container>
  );
};

export default SocialFeedPage;
