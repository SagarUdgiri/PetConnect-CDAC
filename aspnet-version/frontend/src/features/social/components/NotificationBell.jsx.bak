import React, { useState, useEffect } from 'react';
import { Nav, Badge, Dropdown, Button } from 'react-bootstrap';
import { FaBell, FaHeart, FaComment, FaUserPlus, FaUserFriends, FaPaw, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import notificationService from '../../../services/notificationService';
import followService from '../../../services/followService';
import { useAuth } from '../../auth/AuthContext';

const NotificationBell = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
            // Poll for notifications every 5 seconds for real-time updates
            const interval = setInterval(fetchNotifications, 5000);
            return () => clearInterval(interval);
        }
    }, [user?.id]);

    const fetchNotifications = async () => {
        try {
            console.log("Fetching notifications for user:", user.id);
            const data = await notificationService.getNotifications(user.id);
            console.log("Received notifications:", data);
            const notificationsArray = Array.isArray(data) ? data : [];
            setNotifications(notificationsArray);
            
            // Handle both 'isRead' and 'read' property names for resilience
            const unread = notificationsArray.filter(n => {
                const isReadValue = n.read !== undefined ? n.read : n.isRead;
                return !isReadValue;
            });
            setUnreadCount(unread.length);
        } catch (error) {
            console.error("Error fetching notifications", error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead(user.id);
            fetchNotifications();
        } catch (error) {
            console.error("Error marking all read", error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error("Error marking notification read", error);
        }
    };

    const handleAcceptRequest = async (e, followerId, notificationId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await followService.acceptRequest(followerId);
            await notificationService.markAsRead(notificationId);
            fetchNotifications();
        } catch (error) {
            console.error("Error accepting request", error);
        }
    };

    return (
        <Dropdown align="end">
            <Dropdown.Toggle as="div" className="position-relative cursor-pointer p-2 text-slate-500 hover-bg-slate-50 rounded-circle transition-smooth d-flex align-items-center justify-content-center" style={{ width: '38px', height: '38px' }}>
                <FaBell size={18} />
                {unreadCount > 0 && (
                    <Badge 
                        pill 
                        bg="danger" 
                        className="position-absolute top-0 end-0 mt-1 me-1 border border-2 border-white"
                        style={{ fontSize: '0.6rem', padding: '0.35em 0.5em' }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                )}
            </Dropdown.Toggle>

            <Dropdown.Menu className="border-0 shadow-lg py-0 mt-2" style={{ width: '320px', borderRadius: '16px', overflow: 'hidden' }}>
                <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                    <h6 className="mb-0 fw-800 text-slate-900">Notifications</h6>
                    {unreadCount > 0 && (
                        <button 
                            className="btn btn-link p-0 small fw-700 text-primary-pet text-decoration-none" 
                            style={{ fontSize: '0.75rem' }}
                            onClick={handleMarkAllRead}
                        >
                            Mark all read
                        </button>
                    )}
                </div>
                <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 small fw-600">
                            No notifications yet
                        </div>
                    ) : (
                        notifications.map((n) => {
                            // Determine link based on notification type
                            let targetLink = "/notifications";
                            if (n.type === 'LIKE' || n.type === 'COMMENT') {
                                targetLink = `/feed?search=${n.relatedPostId}`;
                            } else if (n.type === 'CONNECTION_REQUEST' || n.type === 'CONNECTION_ACCEPTED') {
                                targetLink = `/profile/${n.senderId}`;
                            } else if (n.type === 'URGENT' || n.type === 'MATCH_FOUND') {
                                targetLink = `/lost-found?search=${n.relatedPostId}`;
                            }

                            const isReadValue = n.read !== undefined ? n.read : n.isRead;

                            return (
                                <Dropdown.Item 
                                    key={n.id} 
                                    as={Link} 
                                    to={targetLink || "/notifications"}
                                    className={`p-3 border-bottom d-flex align-items-start gap-3 transition-smooth ${!isReadValue ? 'bg-slate-50' : 'bg-white'}`}
                                    onClick={() => !isReadValue && handleMarkAsRead(n.id)}
                                >
                                    <div className={`rounded-circle p-2 fs-6 
                                        ${n.type === 'LIKE' ? 'bg-danger bg-opacity-10 text-danger' : 
                                          n.type === 'CONNECTION_REQUEST' ? 'bg-warning bg-opacity-10 text-warning' :
                                          n.type === 'CONNECTION_ACCEPTED' ? 'bg-success bg-opacity-10 text-success' :
                                          n.type === 'URGENT' ? 'bg-danger bg-opacity-10 text-danger' :
                                          n.type === 'MATCH_FOUND' ? 'bg-info bg-opacity-10 text-info' :
                                          'bg-primary bg-opacity-10 text-primary'}`}>
                                        {n.type === 'LIKE' ? <FaHeart size={14} /> : 
                                         n.type === 'CONNECTION_REQUEST' ? <FaUserPlus size={14} /> :
                                         n.type === 'CONNECTION_ACCEPTED' ? <FaUserFriends size={14} /> :
                                         n.type === 'URGENT' ? <FaPaw size={14} /> :
                                         n.type === 'MATCH_FOUND' ? <FaCheck size={14} /> :
                                         <FaComment size={14} />}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className={`small fw-700 text-wrap ${!isReadValue ? 'text-slate-900' : 'text-slate-500'}`}>
                                            {n.message}
                                        </div>
                                        <div className="text-slate-400 mb-2" style={{ fontSize: '0.7rem' }}>
                                            {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {n.type === 'CONNECTION_REQUEST' && !isReadValue && (
                                            <div className="d-flex gap-2">
                                                <Button 
                                                    size="sm" 
                                                    className="btn-primary-pet py-1 px-3 fw-700" 
                                                    style={{ fontSize: '0.7rem', borderRadius: '8px' }}
                                                    onClick={(e) => handleAcceptRequest(e, n.senderId, n.id)}
                                                >
                                                    Accept
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    {!isReadValue && <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px', flexShrink: 0, marginTop: '6px' }}></div>}
                                </Dropdown.Item>
                            );
                        })
                    )}
                </div>
                <div className="p-2 bg-slate-50 text-center">
                    <Link to="/notifications" className="small fw-800 text-slate-600 text-decoration-none hover-text-primary transition-smooth">View all notifications</Link>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default NotificationBell;
