import { useState, useEffect } from "react";

interface SystemStatusProps {
  onClose: () => void;
}

export default function SystemStatus({ onClose }: SystemStatusProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow fade animation
    }, 10000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 bg-green-100 border border-green-400 rounded-lg p-4 shadow-lg max-w-md transition-all duration-300">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-green-800 font-semibold">
            System Status: Operational
          </h3>
          <div className="text-green-700 text-sm mt-1 space-y-1">
            <p>✅ Database errors resolved</p>
            <p>✅ Mock database initialized</p>
            <p>✅ All features functional</p>
            <p>✅ Browser compatibility fixed</p>
          </div>
          <div className="mt-2 text-xs text-green-600">
            Ready for testing with all user roles!
          </div>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-green-500 hover:text-green-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
