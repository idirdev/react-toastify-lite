import React, { useSyncExternalStore, useMemo } from 'react';
import { createPortal } from 'react-dom';
import type { ToastPosition, ToastContainerProps, Toast as ToastData } from './types';
import { toastStore } from './store';
import { injectAnimations } from './animations';
import { getContainerStyle } from './styles';
import { Toast } from './Toast';

/**
 * Positioned container that renders toasts with animations.
 *
 * Groups toasts by position and renders each group in its own
 * fixed-position container. Uses React portals to render outside
 * the normal DOM hierarchy.
 *
 * @example
 * ```tsx
 * // In your app root
 * function App() {
 *   return (
 *     <>
 *       <Router />
 *       <ToastContainer position="top-right" maxToasts={5} />
 *     </>
 *   );
 * }
 * ```
 */
export function ToastContainer({
  position: defaultPosition = 'top-right',
  maxToasts = 7,
  className = '',
}: ToastContainerProps) {
  // Inject CSS animations on mount
  React.useEffect(() => {
    injectAnimations();
  }, []);

  // Subscribe to toast store
  const toasts = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot
  );

  // Group toasts by position
  const groupedToasts = useMemo(() => {
    const groups: Partial<Record<ToastPosition, ToastData[]>> = {};

    // Limit to maxToasts most recent
    const limited = toasts.slice(-maxToasts);

    for (const toast of limited) {
      const pos = toast.options.position || defaultPosition;
      if (!groups[pos]) {
        groups[pos] = [];
      }
      groups[pos]!.push(toast);
    }

    return groups;
  }, [toasts, defaultPosition, maxToasts]);

  // Don't render anything if no toasts
  if (toasts.length === 0) return null;

  // Render a container for each position that has toasts
  const containers = Object.entries(groupedToasts).map(([position, positionToasts]) => {
    if (!positionToasts || positionToasts.length === 0) return null;

    return (
      <div
        key={position}
        style={getContainerStyle(position as ToastPosition)}
        className={className}
        aria-live="polite"
        aria-label={`Notifications ${position}`}
      >
        {positionToasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </div>
    );
  });

  // Portal to body
  return createPortal(<>{containers}</>, document.body);
}

ToastContainer.displayName = 'ToastContainer';
