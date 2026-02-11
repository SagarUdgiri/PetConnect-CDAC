import React, { useState, useEffect } from 'react';
import { Container, Card, ListGroup, Button, Spinner, Alert } from 'react-bootstrap';
import { useAuth } from '../../auth/AuthContext';
import notificationService from '../../../services/notificationService';
import { FaUserPlus,FaPaw,FaUserFriends,FaBell, FaCheckDouble, FaCheck, FaRegClock, FaHeart, FaComment } from 'react-icons/fa';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications(user.id);
      setNotifications(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications", err);
      const message = err.response?.data?.message || err.response?.data || err.message;
      setError(`Failed to load notifications: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead(user.id);
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to mark all as read");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n.notificationId === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const getNotificationTitle = (type, message = '') => {
  const msg = message.toLowerCase();

  switch (type) {
    case 'LIKE':
      if (msg.includes('comment')) return 'Like on your comment';
      if (msg.includes('post')) return 'Like on your post';
      return 'New Like';

    case 'COMMENT':
      if (msg.includes('reply')) return 'Reply to your comment';
      if (msg.includes('post')) return 'Comment on your post';
      return 'New Comment';

    case 'CONNECTION_REQUEST':
      return 'Connection Request';

    case 'CONNECTION_ACCEPTED':
      return 'Connection Accepted';

    case 'FOLLOW':
      return 'New Follower';

    case 'URGENT':
      return 'Urgent Alert';

    case 'MATCH_FOUND':
      return 'Match Found';

    case 'SYSTEM':
      return 'System Notification';

    default:
      return 'New Notification';
  }
};


  const getNotificationVisual = (type, message = '') => {
    const msg = message.toLowerCase();

    // more specific inference FIRST
    if (type === 'COMMENT' && msg.includes('reply')) {
      return {
        icon: <FaComment size={14} />,
        className: 'bg-primary bg-opacity-10 text-primary',
      };
    }

    switch (type) {
      case 'LIKE':
        return {
          icon: <FaHeart size={14} />,
          className: 'bg-danger bg-opacity-10 text-danger',
        };

      case 'COMMENT':
        return {
          icon: <FaComment size={14} />,
          className: 'bg-primary bg-opacity-10 text-primary',
        };

      case 'CONNECTION_REQUEST':
        return {
          icon: <FaUserPlus size={14} />,
          className: 'bg-warning bg-opacity-10 text-warning',
        };

      case 'CONNECTION_ACCEPTED':
        return {
          icon: <FaUserFriends size={14} />,
          className: 'bg-success bg-opacity-10 text-success',
        };

      case 'URGENT':
        return {
          icon: <FaPaw size={14} />,
          className: 'bg-danger bg-opacity-10 text-danger',
        };

      case 'MATCH_FOUND':
        return {
          icon: <FaCheck size={14} />,
          className: 'bg-info bg-opacity-10 text-info',
        };

      default:
        return {
          icon: <FaComment size={14} />,
          className: 'bg-secondary bg-opacity-10 text-secondary',
        };
    }
  };

  return (
    <Container className="py-5" style={{ maxWidth: '800px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-900 text-slate-900 m-0 d-flex align-items-center gap-3">
          <FaBell className="text-primary-pet" /> Notifications
        </h2>
        {notifications.length > 0 && (
          <Button 
            variant="outline-primary" 
            className="rounded-pill fw-800 d-flex align-items-center gap-2 border-2"
            onClick={handleMarkAllRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            <FaCheckDouble size={14} /> Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-slate-400 fw-700">Fetching your alerts...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="rounded-4 border-0 shadow-sm">{error}</Alert>
      ) : notifications.length === 0 ? (
        <Card className="border-0 shadow-sm text-center py-5 rounded-4 bg-white">
          <div className="display-4 text-slate-100 mb-3 text-center d-flex justify-content-center">
            <FaBell />
          </div>
          <h4 className="fw-800 text-slate-400">All caught up!</h4>
          <p className="text-slate-400 small fw-600 mb-0">No new notifications for you right now.</p>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden bg-white">
          <ListGroup variant="flush">
            {notifications.map((n) => (
              <ListGroup.Item 
                key={n.notificationId} 
                className={`p-4 border-bottom transition-smooth d-flex align-items-start gap-4 ${!n.isRead ? 'bg-slate-50 border-start border-4 border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => !n.isRead && handleMarkRead(n.notificationId)}
              >
                {(() => {
                  const { icon, className } = getNotificationVisual(n.type, n.message);
                  return (
                    <div className={`rounded-circle p-3 fs-5 ${className}`}>
                      {icon}
                    </div>
                  );
                })()}
                <div className="flex-grow-1">
                  <div className={`fw-800 mb-1 ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                    {getNotificationTitle(n.type, n.message)}
                  </div>
                  <p className={`mb-2 ${!n.isRead ? 'text-slate-700 fw-600' : 'text-slate-500 small'}`}>
                    {n.message}
                  </p>
                  <div className="d-flex align-items-center gap-2 text-slate-400 small fw-700">
                    <FaRegClock size={12} />
                    {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {!n.isRead && (
                  <div className="rounded-circle bg-primary mt-2" style={{ width: '10px', height: '10px' }}></div>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
    </Container>
  );
};

export default NotificationsPage;
