import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import './NotificationSection.css';

const NotificationSection = ({ userId, userType }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (userId && userType) {
      fetchNotifications();
      fetchUnreadCount();
    }
  }, [userId, userType]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications(userId, userType);
      if (response.success) {
        setNotifications(response.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount(userId, userType);
      if (response.success) {
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      if (response.success) {
        // Update the notification in the list
        setNotifications(prev => 
          prev.map(notification => 
            notification._id === notificationId 
              ? { ...notification, isRead: true }
              : notification
          )
        );
        // Update unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await notificationService.markAllAsRead(userId, userType);
      if (response.success) {
        // Mark all notifications as read
        setNotifications(prev => 
          prev.map(notification => ({ ...notification, isRead: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="notification-section">
        <div className="notification-header">
          <h3>Notifications</h3>
        </div>
        <div className="notification-loading">Loading notifications...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notification-section">
        <div className="notification-header">
          <h3>Notifications</h3>
        </div>
        <div className="notification-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="notification-section">
      <div className="notification-header" style={{flexDirection:'row'}}>
        <h3>
          Notifications 
          {unreadCount > 0 && (
            <span className="unread-badge">{unreadCount}</span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button 
            className="mark-all-read-btn"
            onClick={handleMarkAllAsRead}
          >
            Mark All as Read
          </button>
        )}
      </div>
      
      <div className="notification-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No notifications yet</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <span className="notification-date">
                  {formatDate(notification.createdAt)}
                </span>
              </div>
              {!notification.isRead && (
                <>
                <button 
                  className=""
                  onClick={() => handleMarkAsRead(notification._id)}
                  title="Mark as read"
                  style={{width:'75px', fontSize:'10px',cursor:'pointer',backgroundColor:'#07bc0c',color:'white',borderRadius:'5px'}}
                >
                  ✓ Mark as read
                </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationSection;