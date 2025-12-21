import { useState, useEffect, useRef } from 'react';
import notificationService from '../../services/notificationService';
import { Bell, Check } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import clsx from 'clsx';
import { Link } from 'react-router-dom';

const NotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef(null);

    // Initial fetch
    useEffect(() => {
        fetchNotifications();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await notificationService.getNotifications();
            // Backend returns array directly or via .data depending on Axios config/interceptor
            const data = Array.isArray(res) ? res : res.data || [];
            const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNotifications(sorted);
            setUnreadCount(sorted.filter(n => !n.isRead).length);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read");
        }
    };

    const toggleDropdown = () => {
        if (!isOpen) {
            fetchNotifications(); // Refresh on open
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="text-gray-500 hover:text-gray-700 relative focus:outline-none"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                        <button onClick={fetchNotifications} className="text-xs text-indigo-600 hover:text-indigo-500">Refresh</button>
                    </div>

                    {loading ? (
                        <div className="p-4 text-center text-gray-500 text-sm">Loading...</div>
                    ) : notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">No notifications</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map(notif => (
                                <div key={notif._id} className={clsx("px-4 py-3 hover:bg-gray-50 transition-colors", !notif.isRead && "bg-blue-50")}>
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm text-gray-800">{notif.message}</p>
                                        {!notif.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(notif._id)}
                                                className="text-gray-400 hover:text-indigo-600 ml-2"
                                                title="Mark as read"
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString()}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
