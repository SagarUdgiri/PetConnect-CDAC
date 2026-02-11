import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import petService from '../../../services/petService';
import userService from '../../../services/userService';
import FollowButton from '../../social/components/FollowButton';
import { FaMapMarkerAlt, FaBullhorn, FaUserFriends, FaPaw, FaListUl, FaShieldAlt } from 'react-icons/fa';

const DashboardPage = () => {
  const { user } = useAuth();
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [loadingNearby, setLoadingNearby] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      if (user?.id) {
        try {
          const data = await petService.getPetsByUserId(user.id);
          setPets(data || []);
        } catch (error) {
          console.error("Dashboard: Error fetching pets", error);
        } finally {
          setLoadingPets(false);
        }
      }
    };
    fetchPets();

    const fetchNearby = async () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported");
        setLoadingNearby(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await userService.getNearbyUsers(latitude, longitude, 5000); // 5000km radius
          setNearbyUsers(data || []);
        } catch (error) {
          console.error("Dashboard: Error fetching nearby", error);
        } finally {
          setLoadingNearby(false);
        }
      }, (error) => {
        console.error("Geolocation error:", error);
        setLoadingNearby(false);
      });
    };
    if (user?.id) fetchNearby();
  }, [user?.id]);

  return (
    <Container className="py-5" style={{ maxWidth: '1250px' }}>
      <header className="mb-5 d-flex justify-content-between align-items-end">
        <div>
           <h1 className="display-4 fw-800 mb-1">Welcome, {user?.fullName || user?.username || 'Pet Lover'}!</h1>
           <p className="text-slate-500 fs-5 fw-500 mb-0">Here's what's happening in your pet care ecosystem today.</p>
        </div>
        <div className="d-none d-md-block">
        </div>
      </header>

      <Row className="g-4">
        {/* Active Modules */}
        <Col lg={8}>
          <div className="card-premium p-5 mb-5 border-0 shadow-2xl">
             <div className="mb-4">
               <h4 className="fw-800 m-0 text-slate-800">My Pet Hub</h4>
             </div>
              <Row className="g-4">
                {/* Pet Management Hub */}
                <Col md={6}>
                 <div className="p-5 rounded-4 border border-slate-100 h-100 transition-all hover-lift bg-white shadow-sm">
                   <div className="d-flex align-items-center gap-2 mb-4 text-indigo-600">
                     <FaPaw size={24} />
                     <div className="small fw-800 text-uppercase letter-spacing-2">Pet Portfolio</div>
                   </div>
                   
                   {loadingPets ? (
                     <Spinner animation="border" size="sm" variant="primary" />
                   ) : (
                     <>
                       <h3 className="fw-800 mb-3">{pets.length} Profiles</h3>
                       <p className="text-slate-500 fw-500 mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>Manage your registered companions and their health records.</p>
                       <div className="d-flex flex-column gap-3">
                         <Button onClick={() => window.location.hash = '#/my-pets'} className="btn-primary-pet w-100 py-3 small fw-800 shadow-sm">
                           Manage All
                         </Button>
                         <Button onClick={() => window.location.hash = '#/pets/register'} variant="outline-primary" className="w-100 py-3 small fw-800 border-2">
                           Add New Pet
                         </Button>
                       </div>
                     </>
                   )}
                 </div>
               </Col>

               {/* Social Network Hub */}
               <Col md={6}>
                  <div className="p-5 rounded-4 border border-slate-100 h-100 transition-all hover-lift bg-white shadow-sm">
                    <div className="d-flex align-items-center gap-2 mb-4 text-primary-pet">
                      <FaUserFriends size={24} />
                      <div className="small fw-800 text-uppercase letter-spacing-2">My Network</div>
                    </div>
                    <h3 className="fw-800 mb-3">Social Circle</h3>
                    <p className="text-slate-500 fw-500 mb-4" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>Connect with local pet parents and grow your community.</p>
                    <Link to="/connections" className="btn btn-primary-pet w-100 py-3 small fw-800 text-decoration-none d-flex align-items-center justify-content-center shadow-sm">
                      View Connections
                    </Link>
                  </div>
               </Col>
             </Row>
          </div>

          <div className="card-premium p-4 rounded-4 border-0 shadow-sm bg-white">
            <h5 className="fw-800 mb-4 text-slate-700">Nearby Pet Lovers</h5>
            {loadingNearby ? (
              <div className="text-center py-4"><Spinner size="sm" /></div>
            ) : nearbyUsers.length === 0 ? (
              <p className="text-muted small">No users found nearby.</p>
            ) : (
              <div className="d-flex gap-3 pb-2" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                {nearbyUsers.map(u => (
                  <div key={u.userId} className="card border-0 shadow-sm p-3 flex-shrink-0 text-center" style={{ width: '160px', borderRadius: '16px', background: '#f8fafc' }}>
                    <div className="rounded-circle mx-auto mb-2 overflow-hidden border border-2 border-white shadow-sm" style={{ width: '60px', height: '60px' }}>
                      <img src={u.profilePictureUrl || `https://ui-avatars.com/api/?name=${u.fullName}&background=random`} alt={u.fullName} className="w-100 h-100 object-fit-cover" />
                    </div>
                    <div className="fw-700 text-truncate small mb-0 text-dark">{u.fullName}</div>
                    <div className="text-muted col-10 mx-auto small mb-2 fw-600" style={{ fontSize: '0.7rem' }}>
                      <FaMapMarkerAlt className="me-1 text-danger" />{u.distance} km
                    </div>
                    <div className="d-flex justify-content-center">
                       <FollowButton userId={u.userId} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        {/* Intelligence Sidebar */}
        <Col lg={4}>
          <div className="card-premium mb-4 overflow-hidden border-0 shadow-xl">
             <div className="p-4 text-white" style={{ background: 'linear-gradient(135deg, var(--p-slate-800) 0%, var(--p-slate-900) 100%)' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                   <div className="small fw-800 opacity-60 letter-spacing-1 uppercase">Account Segment</div>
                   <div className="badge bg-amber-500 p-2" style={{ backgroundColor: 'var(--p-amber)' }}>{user?.role || 'USER'}</div>
                </div>
                <h3 className="fw-800 m-0">{user?.fullName || 'Active User'}</h3>
                <h3 className="small fw-600 opacity-60 mt-1 mb-0">{user?.email || 'user@example.com'}</h3>
             </div>
             <div className="p-5 bg-white">
                <div className="d-flex align-items-center mb-5">
                   <div className="bg-slate-100 rounded-circle d-flex align-items-center justify-content-center me-4 shadow-sm" style={{ width: '64px', height: '64px', backgroundColor: 'var(--p-slate-50)', border: '1px solid var(--p-slate-200)' }}>
                      <div className="fw-800 text-slate-400 fs-4">
                        {(user?.fullName?.substring(0, 2) || user?.username?.substring(0, 2) || 'US').toUpperCase()}
                      </div>
                   </div>
                   <div>
                      <div className="fw-800 text-slate-900 fs-5">{user?.username}</div>
                      <div className="small text-indigo-600 fw-800 mt-1" style={{ color: 'var(--brand-primary)' }}>ID: #{user?.id?.toString().padStart(4, '0')}</div>
                   </div>
                </div>
                <Button variant="outline-primary" className="w-100 border-2 fw-800 rounded-3 py-3 shadow-none transition-smooth" style={{ color: 'var(--brand-primary)', borderColor: 'var(--brand-primary)' }}>View Profile Details</Button>
             </div>
          </div>



          <div className="card-premium p-5 bg-white border-0 shadow-xl position-relative overflow-hidden">
             <div className="small fw-800 text-uppercase mb-4 opacity-40 letter-spacing-2">Care Advisory Tip</div>
             <p className="fw-600 text-slate-700 mb-0 lh-lg" style={{ fontSize: '1.1rem' }}>"Clinical research indicates that maintaining a stable dietary routine is the primary factor in long-term companion longevity."</p>
          </div>
        </Col>
      </Row>
      
      <style>{`
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -12px rgba(0,0,0,0.1);
        }
        .transition-smooth {
          transition: var(--transition-ultra);
        }
      `}</style>
    </Container>
  );
};

export default DashboardPage;
