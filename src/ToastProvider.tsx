import React, { createContext, useContext } from 'react';
import type { ToastPosition, ToastContainerProps } from './types';
import { ToastContainer } from './ToastContainer';

/**
 * Toast context for configuration.
 * The actual toast functions are available via the useToast hook
 * which works independently of this context (using the global store).
 */
interface ToastContextValue {
  defaultPosition: ToastPosition;
}

const ToastContext = createContext<ToastContextValue>({
  defaultPosition: 'top-right',
});

export function useToastContext(): ToastContextValue {
  return useContext(ToastContext);
}

interface ToastProviderProps extends ToastContainerProps {
  children: React.ReactNode;
}

/**
 * ToastProvider - Context provider that manages toast state and renders the container.
 *
 * Wrap your app root with this provider to enable toast notifications.
 * The provider renders the ToastContainer as a portal, so toasts appear
 * above all other content regardless of DOM nesting.
 *
 * @example
 * ```tsx
 * import { ToastProvider } from '@idirdev/react-toastify-lite';
 *
 * function App() {
 *   return (
 *     <ToastProvider position="top-right" maxToasts={5}>
 *       <YourApp />
 *     </ToastProvider>
 *   );
 * }
 * ```
 *
 * Then in any component:
 * ```tsx
 * import { useToast } from '@idirdev/react-toastify-lite';
 *
 * function MyComponent() {
 *   const toast = useToast();
 *
 *   return (
 *     <button onClick={() => toast.success('Saved!')}>
 *       Save
 *     </button>
 *   );
 * }
 * ```
 */
export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 7,
  className,
}: ToastProviderProps) {
  return (
    <ToastContext.Provider value={{ defaultPosition: position }}>
      {children}
      <ToastContainer
        position={position}
        maxToasts={maxToasts}
        className={className}
      />
    </ToastContext.Provider>
  );
}

ToastProvider.displayName = 'ToastProvider';
