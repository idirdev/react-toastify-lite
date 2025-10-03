import type { CSSProperties } from 'react';
import type { ToastType, ToastPosition } from './types';

/**
 * CSS-in-JS styles for toasts.
 * No external CSS file needed -- all styles are inline or injected.
 */

// ─── Color Palettes ──────────────────────────────────────
interface ToastColors {
  bg: string;
  border: string;
  text: string;
  icon: string;
  progress: string;
}

const colorMap: Record<ToastType, ToastColors> = {
  success: {
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#166534',
    icon: '#22c55e',
    progress: '#22c55e',
  },
  error: {
    bg: '#fef2f2',
    border: '#fecaca',
    text: '#991b1b',
    icon: '#ef4444',
    progress: '#ef4444',
  },
  warning: {
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#92400e',
    icon: '#f59e0b',
    progress: '#f59e0b',
  },
  info: {
    bg: '#eff6ff',
    border: '#bfdbfe',
    text: '#1e40af',
    icon: '#3b82f6',
    progress: '#3b82f6',
  },
  default: {
    bg: '#ffffff',
    border: '#e5e7eb',
    text: '#1f2937',
    icon: '#6b7280',
    progress: '#6b7280',
  },
};

export function getToastColors(type: ToastType): ToastColors {
  return colorMap[type];
}

// ─── Container Positioning ───────────────────────────────
const positionStyles: Record<ToastPosition, CSSProperties> = {
  'top-right': {
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
  'top-left': {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'flex-start',
    pointerEvents: 'none',
  },
  'top-center': {
    position: 'fixed',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  'bottom-right': {
    position: 'fixed',
    bottom: 16,
    right: 16,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: 8,
    alignItems: 'flex-end',
    pointerEvents: 'none',
  },
  'bottom-left': {
    position: 'fixed',
    bottom: 16,
    left: 16,
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: 8,
    alignItems: 'flex-start',
    pointerEvents: 'none',
  },
  'bottom-center': {
    position: 'fixed',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column-reverse',
    gap: 8,
    alignItems: 'center',
    pointerEvents: 'none',
  },
};

export function getContainerStyle(position: ToastPosition): CSSProperties {
  return positionStyles[position];
}

// ─── Toast Card ──────────────────────────────────────────
export function getToastStyle(type: ToastType): CSSProperties {
  const colors = colorMap[type];
  return {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    minWidth: 320,
    maxWidth: 420,
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.05)',
    color: colors.text,
    fontSize: 14,
    lineHeight: '1.5',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    pointerEvents: 'auto' as const,
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };
}

// ─── Progress Bar ────────────────────────────────────────
export function getProgressStyle(type: ToastType, duration: number): CSSProperties {
  const colors = colorMap[type];
  return {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: 3,
    backgroundColor: colors.progress,
    opacity: 0.5,
    animation: `rtl-progressShrink ${duration}ms linear forwards`,
    borderRadius: '0 0 12px 12px',
  };
}

// ─── Close Button ────────────────────────────────────────
export const closeButtonStyle: CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 4,
  borderRadius: 6,
  color: 'inherit',
  opacity: 0.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.15s',
  lineHeight: 1,
  fontSize: 16,
};

// ─── Icon ────────────────────────────────────────────────
export function getIconStyle(type: ToastType): CSSProperties {
  const colors = colorMap[type];
  return {
    flexShrink: 0,
    width: 20,
    height: 20,
    marginTop: 1,
    color: colors.icon,
  };
}
