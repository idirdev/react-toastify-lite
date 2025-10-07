import { useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ToastType, ToastOptions, Toast, PromiseToastMessages } from '../types';
import { toastStore, generateId } from '../store';

const DEFAULT_DURATION = 5000;
const DEFAULT_POSITION = 'top-right' as const;

/**
 * Create a toast object with defaults applied.
 */
function createToast(
  type: ToastType,
  message: ReactNode,
  options: ToastOptions = {}
): Toast {
  return {
    id: generateId(),
    type,
    message,
    options: {
      duration: options.duration ?? DEFAULT_DURATION,
      position: options.position ?? DEFAULT_POSITION,
      showProgress: options.showProgress ?? true,
      ...options,
    },
    createdAt: Date.now(),
  };
}

/**
 * Imperative toast API.
 * These functions can be called from anywhere -- they don't require React context.
 */
function success(message: ReactNode, options?: ToastOptions): string {
  const toast = createToast('success', message, options);
  toastStore.add(toast);
  return toast.id;
}

function error(message: ReactNode, options?: ToastOptions): string {
  const toast = createToast('error', message, options);
  toastStore.add(toast);
  return toast.id;
}

function warning(message: ReactNode, options?: ToastOptions): string {
  const toast = createToast('warning', message, options);
  toastStore.add(toast);
  return toast.id;
}

function info(message: ReactNode, options?: ToastOptions): string {
  const toast = createToast('info', message, options);
  toastStore.add(toast);
  return toast.id;
}

function show(message: ReactNode, options?: ToastOptions): string {
  const toast = createToast('default', message, options);
  toastStore.add(toast);
  return toast.id;
}

function dismiss(id: string): void {
  toastStore.remove(id);
}

function dismissAll(): void {
  toastStore.removeAll();
}

/**
 * Promise toast - shows loading state, then success or error.
 *
 * @example
 * ```tsx
 * toast.promise(saveData(), {
 *   loading: 'Saving...',
 *   success: 'Data saved!',
 *   error: 'Failed to save.',
 * });
 * ```
 */
async function promise<T>(
  promiseOrFn: Promise<T> | (() => Promise<T>),
  messages: PromiseToastMessages<T>,
  options?: ToastOptions
): Promise<T> {
  const id = generateId();
  const resolvedPromise = typeof promiseOrFn === 'function' ? promiseOrFn() : promiseOrFn;

  // Create loading toast
  const loadingToast: Toast = {
    id,
    type: 'default',
    message: messages.loading,
    options: {
      duration: false as unknown as number, // Don't auto-dismiss while loading
      position: options?.position ?? DEFAULT_POSITION,
      showProgress: false,
      ...options,
    },
    createdAt: Date.now(),
    promiseState: 'pending',
  };

  toastStore.add(loadingToast);

  try {
    const result = await resolvedPromise;

    // Update to success
    const successMessage =
      typeof messages.success === 'function' ? messages.success(result) : messages.success;

    toastStore.update(id, {
      type: 'success',
      message: successMessage,
      promiseState: 'resolved',
      options: {
        ...loadingToast.options,
        duration: options?.duration ?? DEFAULT_DURATION,
        showProgress: options?.showProgress ?? true,
      },
    });

    // Schedule auto-dismiss
    const dismissDuration = options?.duration ?? DEFAULT_DURATION;
    if (dismissDuration) {
      setTimeout(() => toastStore.remove(id), dismissDuration);
    }

    return result;
  } catch (err) {
    // Update to error
    const errorMessage =
      typeof messages.error === 'function' ? messages.error(err) : messages.error;

    toastStore.update(id, {
      type: 'error',
      message: errorMessage,
      promiseState: 'rejected',
      options: {
        ...loadingToast.options,
        duration: options?.duration ?? DEFAULT_DURATION,
        showProgress: options?.showProgress ?? true,
      },
    });

    // Schedule auto-dismiss
    const dismissDuration = options?.duration ?? DEFAULT_DURATION;
    if (dismissDuration) {
      setTimeout(() => toastStore.remove(id), dismissDuration);
    }

    throw err;
  }
}

/**
 * Static toast API -- works without React context.
 */
export const toast = {
  success,
  error,
  warning,
  info,
  show,
  promise,
  dismiss,
  dismissAll,
};

/**
 * useToast - React hook returning toast functions.
 *
 * Returns the same API as the static `toast` object but wrapped
 * in stable callbacks for React usage patterns.
 *
 * @example
 * ```tsx
 * function SaveButton() {
 *   const toast = useToast();
 *
 *   const handleSave = async () => {
 *     try {
 *       await saveData();
 *       toast.success('Saved successfully!');
 *     } catch {
 *       toast.error('Failed to save.');
 *     }
 *   };
 *
 *   return <button onClick={handleSave}>Save</button>;
 * }
 * ```
 */
export function useToast() {
  const toastSuccess = useCallback(
    (message: ReactNode, options?: ToastOptions) => success(message, options),
    []
  );

  const toastError = useCallback(
    (message: ReactNode, options?: ToastOptions) => error(message, options),
    []
  );

  const toastWarning = useCallback(
    (message: ReactNode, options?: ToastOptions) => warning(message, options),
    []
  );

  const toastInfo = useCallback(
    (message: ReactNode, options?: ToastOptions) => info(message, options),
    []
  );

  const toastShow = useCallback(
    (message: ReactNode, options?: ToastOptions) => show(message, options),
    []
  );

  const toastPromise = useCallback(
    <T,>(
      promiseOrFn: Promise<T> | (() => Promise<T>),
      messages: PromiseToastMessages<T>,
      options?: ToastOptions
    ) => promise(promiseOrFn, messages, options),
    []
  );

  const toastDismiss = useCallback((id: string) => dismiss(id), []);
  const toastDismissAll = useCallback(() => dismissAll(), []);

  return {
    success: toastSuccess,
    error: toastError,
    warning: toastWarning,
    info: toastInfo,
    show: toastShow,
    promise: toastPromise,
    dismiss: toastDismiss,
    dismissAll: toastDismissAll,
  };
}
