import { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'default';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'top-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center';

export interface ToastOptions {
  /** Duration in ms before auto-dismiss. Set to 0 or false to disable. Default: 5000 */
  duration?: number | false;
  /** Position on screen. Default: 'top-right' */
  position?: ToastPosition;
  /** Custom icon to display */
  icon?: ReactNode;
  /** Whether to show the progress bar. Default: true */
  showProgress?: boolean;
  /** Additional CSS class name */
  className?: string;
  /** Callback when toast is dismissed */
  onDismiss?: (id: string) => void;
  /** Custom render function */
  render?: (toast: Toast) => ReactNode;
}

export interface Toast {
  id: string;
  type: ToastType;
  message: ReactNode;
  options: Required<Pick<ToastOptions, 'duration' | 'position' | 'showProgress'>> & ToastOptions;
  createdAt: number;
  /** For promise toasts: current state */
  promiseState?: 'pending' | 'resolved' | 'rejected';
}

export interface ToastStore {
  toasts: Toast[];
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => Toast[];
  add: (toast: Toast) => void;
  remove: (id: string) => void;
  removeAll: () => void;
  update: (id: string, updates: Partial<Toast>) => void;
}

export interface PromiseToastMessages<T> {
  loading: ReactNode;
  success: ReactNode | ((data: T) => ReactNode);
  error: ReactNode | ((err: unknown) => ReactNode);
}

export interface ToastContainerProps {
  /** Default position for all toasts */
  position?: ToastPosition;
  /** Maximum number of visible toasts */
  maxToasts?: number;
  /** Custom container class */
  className?: string;
}
