import React, { useState, useEffect } from 'react';
import { Card, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import followService from '../../../services/followService';
import FollowButton from './FollowButton';

const UserSuggestions = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const data = await followService.getSuggestions(5);
      setSuggestions(data || []);
    } catch (err) {
      console.error("Error fetching suggestions", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-3"><Spinner animation="border" size="sm" variant="primary" /></div>;
  if (suggestions.length === 0) return (
    <Card className="border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '24px' }}>
         <h6 className="fw-800 text-slate-900 mb-2">Connect with Pet Parents</h6>
         <p className="text-muted small">No suggestions available right now.</p>
    </Card>
  );

  return (
    <Card className="border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '24px' }}>
      <h6 className="fw-800 text-slate-900 mb-4">Connect with Pet Parents</h6>
      <div className="d-flex flex-column gap-3">
        {suggestions.map(user => (
          <div key={user.id} className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div 
                className="bg-slate-100 rounded-circle overflow-hidden shadow-sm d-flex align-items-center justify-content-center text-primary fw-800" 
                style={{ width: '40px', height: '40px', flexShrink: 0, fontSize: '0.8rem' }}
              >
                {user.imageUrl || user.ImageUrl ? (
                  <img src={user.imageUrl || user.imageURL || user.ImageUrl} className="w-100 h-100" style={{ objectFit: 'cover' }} alt="" />
                ) : (
                  (user.fullName || user.username || 'U').substring(0, 1).toUpperCase()
                )}
              </div>
              <div className="overflow-hidden">
                <div className="fw-800 text-slate-900 small text-truncate" style={{ maxWidth: '100px' }}>{user.fullName || user.username}</div>
                <div className="text-slate-400 fw-600 truncate-small" style={{ fontSize: '0.7rem' }}>@{user.username}</div>
              </div>
            </div>
            <FollowButton userId={user.id} onToggle={() => {}} />
          </div>
        ))}
      </div>
      <Link to="/discover" className="text-primary-pet small fw-800 text-decoration-none mt-4 d-inline-block">View More</Link>
    </Card>
  );
};

export default UserSuggestions;
