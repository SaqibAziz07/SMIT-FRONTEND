import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Trash2, MessageCircle, Award, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api.js";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(API_ENDPOINTS.NOTIFICATIONS, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/read`, {}, { {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_ENDPOINTS.NOTIFICATIONS}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_ENDPOINTS.NOTIFICATIONS}/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "message":
        return "bg-blue-50 border-blue-200";
      case "request_matched":
        return "bg-green-50 border-green-200";
      case "connection":
        return "bg-purple-50 border-purple-200";
      case "urgent_request":
        return "bg-red-50 border-red-200";
      case "request_solved":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "message":
        return "text-blue-500";
      case "request_matched":
        return "text-green-500";
      case "connection":
        return "text-purple-500";
      case "urgent_request":
        return "text-red-500";
      case "request_solved":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return MessageCircle;
      case "request_matched":
        return Award;
      case "connection":
        return MessageCircle;
      case "urgent_request":
        return AlertCircle;
      case "request_solved":
        return CheckCircle;
      default:
        return Bell;
    }
  };

  const localUnreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-[#1a2e2a] mb-2">Notifications</h1>
            <p className="text-gray-500">
              {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#115e59] text-white rounded-lg font-semibold hover:bg-[#0f514e] transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-[#14b8a6]/30 border-t-[#14b8a6] rounded-full animate-spin"></div>
        </div>
      ) : notifications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No notifications yet</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif, idx) => {
            const IconComponent = getNotificationIcon(notif.type);
            return (
              <motion.div
                key={notif._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`border rounded-2xl p-4 transition-all cursor-pointer ${
                  getNotificationColor(notif.type)
                } ${!notif.read ? 'border-l-4 border-l-[#115e59]' : ''}`}
                onClick={() => markAsRead(notif._id)}
              >
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-gray-200">
                      <IconComponent className={`w-5 h-5 ${getIconColor(notif.type)}`} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={`font-semibold text-[#1a2e2a] ${!notif.read ? 'font-bold' : ''}`}>
                          {notif.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">{notif.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatTime(new Date(notif.createdAt))}</p>
                      </div>

                      {/* Read indicator */}
                      {!notif.read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-[#115e59] rounded-full mt-1.5"></div>
                      )}
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                    className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
