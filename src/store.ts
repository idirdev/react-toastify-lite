import type { Toast, ToastStore } from './types';

/**
 * Toast state management using a pub/sub pattern.
 *
 * This store is framework-agnostic internally - it manages an array of
 * Toast objects and notifies subscribers on any change. The React integration
 * layer (useToast hook, ToastProvider) subscribes to this store.
 *
 * This pattern avoids external state management dependencies and enables
 * calling toast functions from outside React components.
 */

type Listener = () => void;

let toasts: Toast[] = [];
let listeners: Set<Listener> = new Set();

function emitChange(): void {
  // Create a new array reference so React detects the change
  toasts = [...toasts];
  listeners.forEach((listener) => listener());
}

/**
 * Subscribe to toast state changes.
 * Returns an unsubscribe function.
 */
function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * Get the current snapshot of toasts.
 * Used by React.useSyncExternalStore.
 */
function getSnapshot(): Toast[] {
  return toasts;
}

/**
 * Add a new toast to the store.
 */
function add(toast: Toast): void {
  toasts = [...toasts, toast];
  emitChange();
}

/**
 * Remove a toast by ID.
 */
function remove(id: string): void {
  const toast = toasts.find((t) => t.id === id);
  toasts = toasts.filter((t) => t.id !== id);
  emitChange();

  // Fire onDismiss callback if present
  if (toast?.options.onDismiss) {
    toast.options.onDismiss(id);
  }
}

/**
 * Remove all toasts.
 */
function removeAll(): void {
  const dismissed = [...toasts];
  toasts = [];
  emitChange();

  // Fire all onDismiss callbacks
  dismissed.forEach((toast) => {
    if (toast.options.onDismiss) {
      toast.options.onDismiss(toast.id);
    }
  });
}

/**
 * Update an existing toast (e.g., for promise resolution).
 */
function update(id: string, updates: Partial<Toast>): void {
  toasts = toasts.map((t) => (t.id === id ? { ...t, ...updates } : t));
  emitChange();
}

/**
 * The global toast store singleton.
 */
export const toastStore: ToastStore = {
  get toasts() {
    return toasts;
  },
  subscribe,
  getSnapshot,
  add,
  remove,
  removeAll,
  update,
};

/**
 * Generate a unique toast ID.
 */
let counter = 0;
export function generateId(): string {
  counter += 1;
  return `toast-${Date.now()}-${counter}`;
}
