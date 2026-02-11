import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import followService from '../../../services/followService';
import { FaPlus, FaCheck, FaUserMinus, FaTimes, FaUserFriends } from 'react-icons/fa';
import toast from 'react-hot-toast';

const FollowButton = ({ userId, onToggle }) => {
  const [status, setStatus] = useState('none'); // none, pending, accepted
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkFollowStatus();
  }, [userId]);

  const checkFollowStatus = async () => {
    try {
      const statusValue = await followService.isFollowing(userId); 
      // API returns "PENDING", "ACCEPTED", or "NONE"
      setStatus(statusValue.toLowerCase()); 
      console.log('Follow status for user', userId, ':', statusValue);
    } catch (err) {
      console.error("Error checking follow status", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (e) => {
    e.stopPropagation();
    console.log('🔵 FollowButton clicked! userId:', userId, 'current status:', status);
    
    try {
      setLoading(true);
      if (status === 'accepted') {
        console.log('🔴 Removing connection...');
        await followService.unfollowUser(userId);
        toast.success('Connection removed');
        await checkFollowStatus();
      } else if (status === 'none') {
        console.log('🟢 Sending connection request...');
        const result = await followService.followUser(userId);
        console.log('✅ Follow request result:', result);
        toast.success('Connection request sent');
        // Refresh status to get accurate state (might be auto-accepted)
        await checkFollowStatus();
      } else if (status === 'incoming') {
        console.log('🟢 Accepting connection request...');
        await followService.acceptRequest(userId);
        toast.success('Connection request accepted!');
        await checkFollowStatus();
      } else if (status === 'pending') {
        console.log('🟡 Cancelling connection request...');
        await followService.cancelRequest(userId);
        setStatus('none');
        toast.success('Request cancelled');
        // Refresh status to ensure UI is in sync
        await checkFollowStatus();
      }
      if (onToggle) onToggle(status);
    } catch (err) {
      console.error("❌ Error toggling follow", err);
      toast.error('Error: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading && status === 'none') return null;

  return (
    <Button 
      variant="link"
      className="p-0 border-0 shadow-none d-flex align-items-center justify-content-center text-primary-pet transition-none"
      onClick={handleToggle}
      disabled={loading}
      style={{ 
        width: '32px', 
        height: '32px', 
        fontSize: '1.2rem',
        color: status === 'pending' ? '#fbbf24' : status === 'accepted' ? '#dc3545' : status === 'incoming' ? '#198754' : 'var(--brand-primary)',
        opacity: 1,
        transition: 'none',
        cursor: loading ? 'not-allowed' : 'pointer'
      }}
      title={
        status === 'accepted' ? 'Remove Connection' : 
        status === 'pending' ? 'Cancel Request' : 
        status === 'incoming' ? 'Accept Connection Request' : 
        'Send Connection Request'
      }
    >
      {status === 'pending' ? <FaTimes size={16} /> : 
       status === 'accepted' ? <FaUserMinus size={16} /> : 
       status === 'incoming' ? <FaUserFriends size={16} /> : 
       <FaPlus />}
    </Button>
  );
};

export default FollowButton;
