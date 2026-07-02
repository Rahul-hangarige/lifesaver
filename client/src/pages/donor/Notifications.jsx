import { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';

const DonorNotifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emergency': return '🚨';
      case 'appointment': return '📅';
      case 'certificate': return '📜';
      case 'request': return '🩸';
      default: return '📢';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
        <button onClick={markAllAsRead} className="btn-secondary text-sm">
          Mark All as Read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'unread' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Unread ({notifications.filter(n => !n.isRead).length})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            filter === 'read' ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          Read
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="card text-center py-12">
          <FaBell className="text-gray-400 text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No notifications</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`card ${!notification.isRead ? 'border-l-4 border-primary-600' : ''}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-4 flex-1">
                  <span className="text-2xl">{getTypeIcon(notification.type)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {!notification.isRead && (
                        <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-gray-600">{notification.message}</p>
                    <p className="text-gray-400 text-sm mt-2">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!notification.isRead && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-primary-600 hover:text-primary-800"
                    title="Mark as read"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>

              {notification.actionRequired && notification.actionLink && (
                <button className="btn-primary w-full mt-4 text-sm">
                  Take Action
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonorNotifications;
