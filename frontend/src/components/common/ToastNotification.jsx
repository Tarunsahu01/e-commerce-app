import React from 'react';

/**
 * ToastNotification: Single toast card used by the ToastProvider.
 *
 * Props:
 * - message: string
 * - type: 'info' | 'success' | 'warning' | 'error'
 * - onClose: () => void
 */
export function ToastNotification({ message, type = 'info', onClose }) {
  const colorClasses = {
    info: 'bg-gray-900/90',
    success: 'bg-emerald-700/90',
    warning: 'bg-amber-700/90',
    error: 'bg-red-700/90',
  };

  const bgClass = colorClasses[type] ?? colorClasses.info;

  return (
    <div
      className={`toast-slide-in-left ${bgClass} text-white shadow-lg rounded-xl px-5 py-4 flex items-start gap-3 w-80 max-w-sm`}
      role="status"
    >
      <div className="flex-1 text-[0.95rem] leading-relaxed">
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-xs text-white/70 hover:text-white focus:outline-none"
          aria-label="Close notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}

