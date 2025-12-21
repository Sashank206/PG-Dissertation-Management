import { useNotification } from '../../context/NotificationContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const NotificationToast = () => {
    const { notification, hideNotification } = useNotification();

    if (!notification) return null;

    const icons = {
        success: <CheckCircle className="h-6 w-6 text-green-500" />,
        error: <AlertCircle className="h-6 w-6 text-red-500" />,
        info: <Info className="h-6 w-6 text-blue-500" />,
        warning: <AlertCircle className="h-6 w-6 text-yellow-500" />
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
        warning: 'bg-yellow-50 border-yellow-200'
    };

    return (
        <div className="fixed top-5 right-5 z-50 animate-bounce transition-all duration-300">
            <div className={`flex items-start p-4 rounded-lg border shadow-lg ${bgColors[notification.type] || 'bg-white'}`}>
                <div className="flex-shrink-0 mr-3">
                    {icons[notification.type]}
                </div>
                <div className="mr-8">
                    <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                </div>
                <div className="ml-auto pl-3">
                    <div className="-mx-1.5 -my-1.5">
                        <button
                            onClick={hideNotification}
                            className="inline-flex rounded-md p-1.5 text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationToast;
