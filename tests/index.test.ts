import { describe, it, expect, beforeEach } from 'vitest';
import { toastStore, generateId } from '../src/store';
import type { Toast } from '../src/types';

// Reset the store before each test
function clearStore() {
  toastStore.removeAll();
}

function createToast(overrides: Partial<Toast> = {}): Toast {
  return {
    id: generateId(),
    type: 'info',
    message: 'Test message',
    options: {
      duration: 5000,
      position: 'top-right',
      showProgress: true,
    },
    createdAt: Date.now(),
    ...overrides,
  };
}

describe('toastStore', () => {
  beforeEach(() => {
    clearStore();
  });

  it('should start with no toasts', () => {
    expect(toastStore.toasts).toHaveLength(0);
  });

  it('should add a toast', () => {
    const toast = createToast();
    toastStore.add(toast);
    expect(toastStore.toasts).toHaveLength(1);
    expect(toastStore.toasts[0].id).toBe(toast.id);
    expect(toastStore.toasts[0].message).toBe('Test message');
  });

  it('should add multiple toasts', () => {
    toastStore.add(createToast({ type: 'success', message: 'Success!' }));
    toastStore.add(createToast({ type: 'error', message: 'Error!' }));
    toastStore.add(createToast({ type: 'warning', message: 'Warning!' }));
    expect(toastStore.toasts).toHaveLength(3);
  });

  it('should remove a toast by ID', () => {
    const t1 = createToast({ message: 'First' });
    const t2 = createToast({ message: 'Second' });
    toastStore.add(t1);
    toastStore.add(t2);

    toastStore.remove(t1.id);
    expect(toastStore.toasts).toHaveLength(1);
    expect(toastStore.toasts[0].id).toBe(t2.id);
  });

  it('should do nothing when removing a non-existent ID', () => {
    toastStore.add(createToast());
    toastStore.remove('non-existent-id');
    expect(toastStore.toasts).toHaveLength(1);
  });

  it('should remove all toasts', () => {
    toastStore.add(createToast());
    toastStore.add(createToast());
    toastStore.add(createToast());
    expect(toastStore.toasts).toHaveLength(3);

    toastStore.removeAll();
    expect(toastStore.toasts).toHaveLength(0);
  });

  it('should update an existing toast', () => {
    const toast = createToast({ type: 'info', message: 'Loading...' });
    toastStore.add(toast);

    toastStore.update(toast.id, {
      type: 'success',
      message: 'Done!',
    });

    expect(toastStore.toasts).toHaveLength(1);
    expect(toastStore.toasts[0].type).toBe('success');
    expect(toastStore.toasts[0].message).toBe('Done!');
  });

  it('should not affect other toasts when updating one', () => {
    const t1 = createToast({ message: 'First' });
    const t2 = createToast({ message: 'Second' });
    toastStore.add(t1);
    toastStore.add(t2);

    toastStore.update(t1.id, { message: 'Updated First' });
    expect(toastStore.toasts[0].message).toBe('Updated First');
    expect(toastStore.toasts[1].message).toBe('Second');
  });

  it('should update promise state on a toast', () => {
    const toast = createToast({ promiseState: 'pending' });
    toastStore.add(toast);

    toastStore.update(toast.id, { promiseState: 'resolved' });
    expect(toastStore.toasts[0].promiseState).toBe('resolved');
  });

  it('should notify subscribers on add', () => {
    let notified = false;
    const unsub = toastStore.subscribe(() => {
      notified = true;
    });

    toastStore.add(createToast());
    expect(notified).toBe(true);
    unsub();
  });

  it('should notify subscribers on remove', () => {
    const toast = createToast();
    toastStore.add(toast);

    let notified = false;
    const unsub = toastStore.subscribe(() => {
      notified = true;
    });

    toastStore.remove(toast.id);
    expect(notified).toBe(true);
    unsub();
  });

  it('should notify subscribers on removeAll', () => {
    toastStore.add(createToast());

    let notified = false;
    const unsub = toastStore.subscribe(() => {
      notified = true;
    });

    toastStore.removeAll();
    expect(notified).toBe(true);
    unsub();
  });

  it('should notify subscribers on update', () => {
    const toast = createToast();
    toastStore.add(toast);

    let notified = false;
    const unsub = toastStore.subscribe(() => {
      notified = true;
    });

    toastStore.update(toast.id, { message: 'Updated' });
    expect(notified).toBe(true);
    unsub();
  });

  it('should stop notifying after unsubscribe', () => {
    let callCount = 0;
    const unsub = toastStore.subscribe(() => {
      callCount++;
    });

    toastStore.add(createToast());
    expect(callCount).toBe(1);

    unsub();
    toastStore.add(createToast());
    expect(callCount).toBe(1);
  });

  it('should support multiple subscribers', () => {
    let count1 = 0;
    let count2 = 0;
    const unsub1 = toastStore.subscribe(() => { count1++; });
    const unsub2 = toastStore.subscribe(() => { count2++; });

    toastStore.add(createToast());
    expect(count1).toBe(1);
    expect(count2).toBe(1);

    unsub1();
    unsub2();
  });

  it('should return a snapshot via getSnapshot', () => {
    toastStore.add(createToast({ message: 'snap1' }));
    toastStore.add(createToast({ message: 'snap2' }));

    const snapshot = toastStore.getSnapshot();
    expect(snapshot).toHaveLength(2);
    expect(snapshot[0].message).toBe('snap1');
    expect(snapshot[1].message).toBe('snap2');
  });

  it('should fire onDismiss callback when removing a toast', () => {
    let dismissedId: string | null = null;
    const toast = createToast({
      options: {
        duration: 5000,
        position: 'top-right',
        showProgress: true,
        onDismiss: (id) => { dismissedId = id; },
      },
    });
    toastStore.add(toast);
    toastStore.remove(toast.id);
    expect(dismissedId).toBe(toast.id);
  });

  it('should fire onDismiss for all toasts on removeAll', () => {
    const dismissed: string[] = [];
    const t1 = createToast({
      options: {
        duration: 5000,
        position: 'top-right',
        showProgress: true,
        onDismiss: (id) => { dismissed.push(id); },
      },
    });
    const t2 = createToast({
      options: {
        duration: 5000,
        position: 'top-right',
        showProgress: true,
        onDismiss: (id) => { dismissed.push(id); },
      },
    });
    toastStore.add(t1);
    toastStore.add(t2);
    toastStore.removeAll();
    expect(dismissed).toContain(t1.id);
    expect(dismissed).toContain(t2.id);
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    const id3 = generateId();
    expect(id1).not.toBe(id2);
    expect(id2).not.toBe(id3);
    expect(id1).not.toBe(id3);
  });

  it('should return a string starting with "toast-"', () => {
    const id = generateId();
    expect(id).toMatch(/^toast-/);
  });

  it('should contain a timestamp', () => {
    const id = generateId();
    const parts = id.split('-');
    // Format: toast-<timestamp>-<counter>
    expect(parts.length).toBeGreaterThanOrEqual(3);
    const ts = parseInt(parts[1]);
    expect(ts).toBeGreaterThan(0);
  });
});

describe('Toast types', () => {
  it('should support all toast types', () => {
    const types = ['success', 'error', 'warning', 'info', 'default'] as const;
    for (const type of types) {
      const toast = createToast({ type });
      toastStore.add(toast);
      const found = toastStore.toasts.find((t) => t.id === toast.id);
      expect(found?.type).toBe(type);
    }
    clearStore();
  });

  it('should support all toast positions', () => {
    const positions = [
      'top-right', 'top-left', 'top-center',
      'bottom-right', 'bottom-left', 'bottom-center',
    ] as const;
    for (const position of positions) {
      const toast = createToast({
        options: { duration: 5000, position, showProgress: true },
      });
      toastStore.add(toast);
    }
    expect(toastStore.toasts).toHaveLength(6);
    clearStore();
  });

  it('should support duration: false for persistent toasts', () => {
    const toast = createToast({
      options: { duration: false as any, position: 'top-right', showProgress: false },
    });
    toastStore.add(toast);
    expect(toastStore.toasts[0].options.duration).toBe(false);
    clearStore();
  });
});
