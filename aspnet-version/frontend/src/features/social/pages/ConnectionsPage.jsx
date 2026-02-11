import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { FaUserFriends } from 'react-icons/fa';
import followService from '../../../services/followService';
import { useAuth } from '../../auth/AuthContext';
import { toast } from 'react-hot-toast';

const ConnectionsPage = () => {
  const { user } = useAuth();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchConnections();
    }
  }, [user?.id]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await followService.getConnections();
      setConnections(response);
    } catch (err) {
      console.error('Error fetching connections:', err);
      setError(`Failed to load connections`);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (targetId) => {
    try {
      await followService.unfollowUser(targetId);
      toast.success('Unfriended successfully');
      setConnections(prev => prev.filter(c => (c.userId || c.id) !== targetId));
    } catch (err) {
      console.error('Error unfollowing:', err);
      toast.error('Failed to unfriend');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-slate-500">Loading connections...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <FaUserFriends size={32} className="text-primary-pet" />
        <h2 className="mb-0 fw-800 text-slate-900">My Connections</h2>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {connections.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5" style={{ borderRadius: '24px' }}>
          <Card.Body>
            <FaUserFriends size={64} className="text-slate-300 mb-3" />
            <h5 className="text-slate-600 fw-700">No connections yet</h5>
            <p className="text-slate-400 small">Start connecting with other pet owners!</p>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {connections.map((connection) => (
            <Col key={connection.userId} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="border-0 shadow-sm h-100 hover-shadow transition-smooth" style={{ borderRadius: '16px' }}>
                <Card.Body className="text-center p-4">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-800 mb-3 shadow-sm border border-slate-100" 
                    style={{ 
                      width: '80px', 
                      height: '80px', 
                      fontSize: '1.5rem', 
                      backgroundColor: '#0d6efd',
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {connection.imageUrl || connection.ImageUrl || connection.userProfileImageUrl ? (
                      <img 
                        src={connection.imageUrl || connection.ImageUrl || connection.userProfileImageUrl} 
                        className="w-100 h-100 position-absolute top-0 start-0" 
                        style={{ objectFit: 'cover' }} 
                        alt={connection.fullName || connection.FullName} 
                      />
                    ) : (
                      (connection.fullName || connection.FullName || 'User').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                    )}
                  </div>
                  <h6 className="fw-800 text-slate-900 mb-1">{connection.fullName || connection.FullName}</h6>
                  <p className="text-slate-400 small mb-3">@{connection.userName || connection.username || connection.UserName}</p>
                  {connection.bio ? (<p className="text-slate-400 fw-700 small mb-4">{connection.bio}</p>) : null}
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="rounded-pill px-3 fw-700"
                    onClick={() => handleUnfollow(connection.userId || connection.id)}
                  >
                    Unfriend
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ConnectionsPage;
