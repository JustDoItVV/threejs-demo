/* eslint-disable @next/next/no-img-element */
'use client';

import {
  Camera,
  Globe,
  Home,
  Mail,
  Map,
  MessageSquare,
  Music,
  Phone,
  Settings,
} from 'lucide-react';
import { useState } from 'react';

const pulseAnimation = `
@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}
`;

interface PhoneScreenProps {
  onScreenClick?: (x: number, y: number) => void;
  embedded?: boolean;
}

const apps = [
  [
    { id: 'camera', name: 'Camera', icon: Camera, color: '#6b7280' },
    { id: 'messages', name: 'Messages', icon: MessageSquare, color: '#22c55e' },
    { id: 'settings', name: 'Settings', icon: Settings, color: '#64748b' },
    { id: 'music', name: 'Music', icon: Music, color: '#ec4899' },
    { id: 'mail', name: 'Mail', icon: Mail, color: '#3b82f6' },
    { id: 'phone', name: 'Phone', icon: Phone, color: '#10b981' },
  ],
  [
    { id: 'maps', name: 'Maps', icon: Map, color: '#06b6d4' },
    { id: 'browser', name: 'Browser', icon: Globe, color: '#3b82f6' },
    { id: 'home', name: 'Home', icon: Home, color: '#f59e0b' },
    { id: 'camera2', name: 'Photos', icon: Camera, color: '#8b5cf6' },
    { id: 'music2', name: 'Podcasts', icon: Music, color: '#a855f7' },
    { id: 'mail2', name: 'Notes', icon: Mail, color: '#eab308' },
  ],
];

export function PhoneScreen({ embedded = false }: PhoneScreenProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    if (typeof window !== 'undefined' && window.disableOrbitControls) {
      window.disableOrbitControls();
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left
      setCurrentPage((prev) => Math.min(prev + 1, apps.length - 1));
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right
      setCurrentPage((prev) => Math.max(prev - 1, 0));
    }

    if (typeof window !== 'undefined' && window.enableOrbitControls) {
      window.enableOrbitControls();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart(e.clientX);
    if (typeof window !== 'undefined' && window.disableOrbitControls) {
      window.disableOrbitControls();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      setTouchEnd(e.clientX);
    }
  };

  const handleMouseUp = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentPage((prev) => Math.min(prev + 1, apps.length - 1));
    }

    if (touchStart - touchEnd < -75) {
      setCurrentPage((prev) => Math.max(prev - 1, 0));
    }
    setTouchStart(0);
    setTouchEnd(0);

    if (typeof window !== 'undefined' && window.enableOrbitControls) {
      window.enableOrbitControls();
    }
  };

  const handleAppClick = (appId: string) => {
    if (appId === 'camera') {
      setOpenApp('camera');
    }
  };

  const handleCloseApp = () => {
    setOpenApp(null);
  };

  const containerClass = embedded ? '' : 'absolute inset-0 flex items-center justify-center';
  const phoneWidth = embedded ? 400 : 320;
  const phoneHeight = embedded ? 800 : 650;

  if (openApp === 'camera') {
    return (
      <div className={containerClass}>
        <div
          className="relative bg-black rounded-[3rem] p-3 shadow-2xl"
          style={{ width: `${phoneWidth}px`, height: `${phoneHeight}px` }}
        >
          <div className="w-full h-full bg-linear-to-br from-slate-900 to-slate-800 rounded-[2.5rem] overflow-hidden relative">
            {/* App content - Camera */}
            <div className="w-full h-full flex flex-col">
              {/* Status bar */}
              <div className="h-12 flex items-center justify-between px-6 text-white text-xs">
                <span>9:41</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 border border-white rounded-sm" />
                  <div className="w-4 h-4 border border-white rounded-sm" />
                  <div className="w-4 h-4 border border-white rounded-sm" />
                </div>
              </div>

              {/* Camera viewfinder */}
              <div className="flex-1 relative overflow-hidden">
                <img
                  src="/models/iphone-14/wallpaper.png"
                  alt="Camera view"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Camera controls */}
              <div className="h-32 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-8">
                <button
                  onClick={handleCloseApp}
                  className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
                <div className="w-20 h-20 rounded-full border-4 border-white/80 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white" />
                </div>
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <style>{pulseAnimation}</style>
      <div
        className="relative bg-black rounded-[3rem] p-3 shadow-2xl select-none"
        style={{
          width: `${phoneWidth}px`,
          height: `${phoneHeight}px`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragStart={(e) => e.preventDefault()}
      >
        {/* Phone screen */}
        <div
          className="w-full h-full bg-linear-to-br from-blue-400 to-purple-600 rounded-[2.5rem] overflow-hidden relative select-none"
          style={{ userSelect: 'none', WebkitUserDrag: 'none' }}
        >
          {/* Status bar */}
          <div className="h-12 flex items-center justify-between px-6 text-white text-xs font-medium">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <span>100%</span>
              <div className="w-6 h-3 border border-white rounded-sm flex items-center px-0.5">
                <div className="w-full h-1.5 bg-white rounded-sm" />
              </div>
            </div>
          </div>

          {/* App grid with swipe animation */}
          <div
            className="px-8 py-4 transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentPage * 100}%)` }}
          >
            <div className="flex">
              {apps.map((page, pageIndex) => (
                <div
                  key={pageIndex}
                  className="min-w-full grid grid-cols-3 gap-6 px-4"
                  style={{ width: '100%' }}
                >
                  {page.map((app) => {
                    const Icon = app.icon;
                    const isCamera = app.id === 'camera';
                    return (
                      <button
                        key={app.id}
                        onClick={() => handleAppClick(app.id)}
                        className="flex flex-col items-center gap-2 group"
                      >
                        <div className="relative">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: app.color }}
                          >
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          {isCamera && (
                            <div
                              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                              style={{ animation: 'pulse-badge 2s ease-in-out infinite' }}
                            />
                          )}
                        </div>
                        <span className="text-white text-xs font-medium drop-shadow-lg">
                          {app.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Page indicators */}
          <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2">
            {apps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentPage ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-white/30 rounded-full" />
        </div>
      </div>
    </div>
  );
}
