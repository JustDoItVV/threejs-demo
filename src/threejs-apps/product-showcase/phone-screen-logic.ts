import {
    Camera, Globe, Home, Mail, Map, MessageSquare, Music, Phone, Settings
} from 'lucide-react';

export interface App {
  id: string;
  name: string;
  icon: typeof Camera;
  color: string;
}

export const apps: App[][] = [
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

export interface PhoneScreenState {
  currentPage: number;
  openApp: string | null;
}

export const SCREEN_WIDTH = 400;
export const SCREEN_HEIGHT = 750;
export const STATUS_BAR_HEIGHT = 48;
export const HOME_INDICATOR_HEIGHT = 80;
export const GRID_COLS = 3;
export const ICON_SIZE = 64;
export const ICON_SPACING = 24;
