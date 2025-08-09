import { useState, useRef, useEffect } from "react";

interface MovableFloatingButtonProps {
  onQuickAction: (
    action: "emergency" | "doctor" | "medicine" | "vitals",
  ) => void;
}

export default function MovableFloatingButton({
  onQuickAction,
}: MovableFloatingButtonProps) {
  const [position, setPosition] = useState({
    x: 20,
    y: window.innerHeight - 200,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      // Keep button within screen bounds on resize
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 80),
        y: Math.min(prev.y, window.innerHeight - 80),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setIsDragging(true);
    setShowActions(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Keep within screen bounds
    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (!isDragging) {
      setShowActions(!showActions);
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!buttonRef.current) return;

    const touch = e.touches[0];
    const rect = buttonRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
    setIsDragging(true);
    setShowActions(false);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const newX = touch.clientX - dragOffset.x;
    const newY = touch.clientY - dragOffset.y;

    const maxX = window.innerWidth - 80;
    const maxY = window.innerHeight - 80;

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, dragOffset]);

  return (
    <>
      {/* Movable Floating Button */}
      <div
        ref={buttonRef}
        className={`fixed z-40 select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: isDragging ? "none" : "all 0.3s ease",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handleClick}
      >
        {/* Main FAB */}
        <div className={`relative group ${isDragging ? "scale-110" : ""}`}>
          <button
            className={`w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 ${
              showActions ? "scale-110" : "hover:scale-110"
            } active:scale-95 flex items-center justify-center`}
          >
            <span
              className={`text-white text-2xl transition-transform duration-300 ${
                showActions ? "rotate-45" : "group-hover:rotate-12"
              }`}
            >
              {showActions ? "✕" : "🩺"}
            </span>
          </button>

          {/* Drag Indicator */}
          {isDragging && (
            <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>
          )}

          {/* Quick Actions */}
          {showActions && !isDragging && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 space-y-3 animate-in slide-in-from-bottom-4 duration-300">
              {[
                {
                  icon: "🚑",
                  label: "Emergency",
                  gradient: "from-red-500 to-pink-500",
                  onClick: () => onQuickAction("emergency"),
                  delay: "0ms",
                },
                {
                  icon: "📞",
                  label: "Call Doctor",
                  gradient: "from-blue-500 to-cyan-500",
                  onClick: () => onQuickAction("doctor"),
                  delay: "50ms",
                },
                {
                  icon: "💊",
                  label: "Medicine",
                  gradient: "from-purple-500 to-indigo-500",
                  onClick: () => onQuickAction("medicine"),
                  delay: "100ms",
                },
                {
                  icon: "📊",
                  label: "Vitals",
                  gradient: "from-orange-500 to-yellow-500",
                  onClick: () => onQuickAction("vitals"),
                  delay: "150ms",
                },
              ].map((action) => (
                <div
                  key={action.label}
                  className="flex items-center space-x-3 transform transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: action.delay,
                    transform: "translateY(0)",
                    opacity: 1,
                  }}
                >
                  <span className="text-xs font-medium text-gray-700 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md whitespace-nowrap border border-white/30">
                    {action.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                      setShowActions(false);
                    }}
                    className={`w-12 h-12 bg-gradient-to-r ${action.gradient} rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center`}
                  >
                    <span className="text-white text-lg">{action.icon}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Position Indicator */}
        {isDragging && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            {Math.round(position.x)}, {Math.round(position.y)}
          </div>
        )}
      </div>

      {/* Backdrop for closing actions */}
      {showActions && !isDragging && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => setShowActions(false)}
        />
      )}
    </>
  );
}
