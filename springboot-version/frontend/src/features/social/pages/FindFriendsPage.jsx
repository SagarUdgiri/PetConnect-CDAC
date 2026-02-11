import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { FaUserPlus, FaUsers, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import followService from '../../../services/followService';
import FollowButton from '../components/FollowButton';

const FindFriendsPage = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      // Fetch suggestions without a limit to show all potential connections
      const data = await followService.getSuggestions();
      setPeople(data || []);
    } catch (err) {
      console.error("Error fetching people", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5 animate-fadeIn">
      <div className="d-flex align-items-center justify-content-between mb-5">
        <div>
          <Button 
            variant="link" 
            className="text-slate-400 p-0 mb-3 hover-text-primary transition-smooth text-decoration-none d-flex align-items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <FaArrowLeft size={14} />
            <span className="fw-700 small uppercase tracking-wider">Back</span>
          </Button>
          <h2 className="fw-900 text-slate-900 mb-2">Connect with Pet Parents</h2>
          <p className="text-slate-500 fw-600 mb-0">Discover and grow your pet's social circle</p>
        </div>
        <div className="bg-primary bg-opacity-10 p-3 rounded-4 d-none d-md-block">
          <FaUsers size={32} className="text-primary" />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="text-slate-400 mt-3 fw-600">Finding parents to connect with...</p>
        </div>
      ) : people.length === 0 ? (
        <Card className="border-0 shadow-sm text-center p-5 rounded-4">
          <div className="mb-4">
            <div className="bg-slate-50 rounded-circle d-inline-flex align-items-center justify-content-center shadow-inner" style={{ width: '80px', height: '80px' }}>
              <FaUserPlus size={32} className="text-slate-300" />
            </div>
          </div>
          <h4 className="fw-800 text-slate-900">All caught up!</h4>
          <p className="text-slate-500 mx-auto" style={{ maxWidth: '400px' }}>
            You've connected with everyone available. Check back later for new pet parents joining PetConnect.
          </p>
          <Button 
            variant="primary" 
            className="btn-primary-pet px-5 py-2 rounded-pill fw-800 mt-3"
            onClick={() => navigate('/feed')}
          >
            Back to Feed
          </Button>
        </Card>
      ) : (
        <Row className="g-4">
          {people.map(person => (
            <Col key={person.id} xs={12} sm={6} lg={4} xl={3}>
              <Card className="border-0 shadow-sm h-100 hover-lift transition-smooth" style={{ borderRadius: '24px' }}>
                <Card.Body className="p-4 text-center d-flex flex-column align-items-center">
                  <div 
                    className="rounded-circle overflow-hidden shadow-sm border border-4 border-white mb-3 d-flex align-items-center justify-content-center bg-slate-100 text-primary-pet fw-900" 
                    style={{ width: '90px', height: '90px', fontSize: '2rem' }}
                  >
                    {person.imageUrl ? (
                      <img src={person.imageUrl} className="w-100 h-100" style={{ objectFit: 'cover' }} alt={person.fullName} />
                    ) : (
                      person.fullName?.charAt(0).toUpperCase() || person.username?.charAt(0).toUpperCase() || 'U'
                    )}
                  </div>
                  
                  <h6 className="fw-800 text-slate-900 mb-1 text-truncate w-100">{person.fullName || person.username}</h6>
                  <p className="text-slate-400 fw-700 small mb-4">@{person.username}</p>
                  {person.bio ? (<p className="text-slate-400 fw-700 small mb-4">{person.bio}</p>) : null}
                  <div className="mt-auto w-100 px-3 d-flex justify-content-center">
                     <FollowButton 
                        userId={person.id} 
                        className="w-100 py-2 fw-800 rounded-pill btn-primary-pet text-center d-block"
                        onToggle={fetchPeople} // Refresh list on action if needed
                     />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <style>{`
        .hover-lift {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Container>
  );
};

export default FindFriendsPage;
