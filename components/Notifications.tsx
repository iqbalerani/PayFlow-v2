import React, { useEffect } from 'react';
import { useUIStore } from '../src/store/uiStore';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useUIStore();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 animate-in slide-in-from-right duration-300 ${
            notification.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : notification.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : notification.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex-shrink-0 text-xl">
            {notification.type === 'success' && <i className="fa-solid fa-circle-check"></i>}
            {notification.type === 'error' && <i className="fa-solid fa-circle-xmark"></i>}
            {notification.type === 'warning' && <i className="fa-solid fa-triangle-exclamation"></i>}
            {notification.type === 'info' && <i className="fa-solid fa-circle-info"></i>}
          </div>
          <div className="flex-1 text-sm font-medium">{notification.message}</div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
