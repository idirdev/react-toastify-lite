import React, { useEffect, useState, useCallback, useRef } from 'react';
import type { Toast as ToastType } from './types';
import { toastStore } from './store';
import { getAnimationDirection, getEnterAnimation, getExitAnimation } from './animations';
import { getToastStyle, getProgressStyle, closeButtonStyle, getIconStyle } from './styles';

interface ToastProps {
  toast: ToastType;
}

// ─── Default Icons (SVG) ─────────────────────────────────
const icons: Record<string, React.ReactNode> = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

// Loading spinner for promise toasts
const loadingIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <style>{`
      @keyframes rtl-spin { to { transform: rotate(360deg); } }
    `}</style>
  </svg>
);

const EXIT_DURATION = 300;

/**
 * Individual Toast component.
 *
 * Renders a toast notification with:
 * - Type-specific icon and colors
 * - Message content
 * - Auto-dismiss progress bar
 * - Close button
 * - Enter/exit slide animations
 * - Pause timer on hover
 */
export function Toast({ toast }: ToastProps) {
  const [exiting, setExiting] = useState(false);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const remainingRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const { id, type, message, options } = toast;
  const { duration, position, showProgress } = options;

  const isLoading = toast.promiseState === 'pending';
  const autoDismiss = duration && duration > 0 && !isLoading;

  // Dismiss with exit animation
  const dismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      toastStore.remove(id);
    }, EXIT_DURATION);
  }, [id]);

  // Auto-dismiss timer
  useEffect(() => {
    if (!autoDismiss) return;

    remainingRef.current = duration as number;
    startTimeRef.current = Date.now();

    timerRef.current = setTimeout(dismiss, duration as number);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [autoDismiss, duration, dismiss]);

  // Pause on hover
  const handleMouseEnter = useCallback(() => {
    if (!autoDismiss) return;
    setPaused(true);
    clearTimeout(timerRef.current);

    // Calculate remaining time
    const elapsed = Date.now() - startTimeRef.current;
    remainingRef.current = Math.max((duration as number) - elapsed, 0);

    // Pause the progress bar
    if (progressRef.current) {
      const computedStyle = getComputedStyle(progressRef.current);
      const currentWidth = computedStyle.width;
      progressRef.current.style.animationPlayState = 'paused';
      progressRef.current.style.width = currentWidth;
    }
  }, [autoDismiss, duration]);

  const handleMouseLeave = useCallback(() => {
    if (!autoDismiss) return;
    setPaused(false);
    startTimeRef.current = Date.now();

    // Resume the progress bar
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'running';
    }

    timerRef.current = setTimeout(dismiss, remainingRef.current);
  }, [autoDismiss, dismiss]);

  // Animation
  const direction = getAnimationDirection(position);
  const enterAnim = getEnterAnimation(direction);
  const exitAnim = getExitAnimation(direction);

  const animationStyle = exiting
    ? { animation: `${exitAnim} ${EXIT_DURATION}ms ease-in forwards` }
    : { animation: `${enterAnim} 300ms ease-out` };

  // Icon
  const displayIcon = isLoading
    ? loadingIcon
    : options.icon !== undefined
    ? options.icon
    : icons[type] || icons.default;

  const iconStyle = getIconStyle(type);
  const spinStyle = isLoading
    ? { ...iconStyle, animation: 'rtl-spin 1s linear infinite' }
    : iconStyle;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        ...getToastStyle(type),
        ...animationStyle,
        paddingRight: 36,
      }}
      className={options.className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Icon */}
      {displayIcon && (
        <span style={spinStyle} aria-hidden="true">
          {displayIcon}
        </span>
      )}

      {/* Message */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {options.render ? options.render(toast) : message}
      </div>

      {/* Close button */}
      <button
        type="button"
        onClick={dismiss}
        style={closeButtonStyle}
        aria-label="Close notification"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.opacity = '0.5';
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Progress bar */}
      {showProgress && autoDismiss && (
        <div
          ref={progressRef}
          style={getProgressStyle(type, duration as number)}
        />
      )}
    </div>
  );
}

Toast.displayName = 'Toast';
