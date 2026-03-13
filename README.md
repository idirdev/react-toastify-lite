> **Archived** — Kept for reference. Not part of the current portfolio.

# React Toastify Lite

[![npm version](https://img.shields.io/npm/v/@idirdev/react-toastify-lite.svg)](https://www.npmjs.com/package/@idirdev/react-toastify-lite)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-green.svg)]()

Lightweight toast notification system for React. Zero dependencies, CSS-in-JS (no external stylesheets), full TypeScript support.

## Features

- Success, error, warning, info toast types
- Promise-based toasts (loading -> success/error)
- Auto-dismiss with progress bar
- Pause timer on hover
- 6 position options (top/bottom + left/center/right)
- Slide animations per position
- Dismiss individual or all toasts
- Works outside React components (imperative API)
- Fully typed with TypeScript
- No CSS imports needed

## Installation

```bash
npm install @idirdev/react-toastify-lite
```

## Quick Start

### 1. Add the Provider

```tsx
import { ToastProvider } from '@idirdev/react-toastify-lite';

function App() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <YourApp />
    </ToastProvider>
  );
}
```

### 2. Use the Hook

```tsx
import { useToast } from '@idirdev/react-toastify-lite';

function SaveButton() {
  const toast = useToast();

  return (
    <button onClick={() => toast.success('Changes saved!')}>
      Save
    </button>
  );
}
```

### 3. Or Use the Imperative API

```tsx
import { toast } from '@idirdev/react-toastify-lite';

// Works anywhere -- no React context needed
toast.success('Hello!');
toast.error('Something went wrong');
toast.warning('Be careful');
toast.info('FYI');
```

## Usage Examples

### Basic Toasts

```tsx
const toast = useToast();

toast.success('Profile updated');
toast.error('Failed to save');
toast.warning('Unsaved changes');
toast.info('New version available');
```

### With Options

```tsx
toast.success('Saved!', {
  duration: 3000,
  position: 'bottom-right',
  showProgress: true,
});
```

### Promise Toast

```tsx
toast.promise(
  fetch('/api/save', { method: 'POST', body: data }),
  {
    loading: 'Saving...',
    success: 'Data saved successfully!',
    error: 'Failed to save data.',
  }
);
```

### Dynamic Promise Messages

```tsx
toast.promise(fetchUser(id), {
  loading: 'Loading user...',
  success: (user) => `Welcome, ${user.name}!`,
  error: (err) => `Error: ${err.message}`,
});
```

### Dismiss Toasts

```tsx
const id = toast.success('Hello');
toast.dismiss(id);    // Dismiss one
toast.dismissAll();   // Dismiss all
```

### Custom Icon

```tsx
toast.info('Custom!', {
  icon: <span>🚀</span>,
});
```

## API Reference

### ToastProvider Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `ToastPosition` | `'top-right'` | Default toast position |
| `maxToasts` | `number` | `7` | Max visible toasts |
| `className` | `string` | - | Container CSS class |

### ToastOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number \| false` | `5000` | Auto-dismiss time (ms). `false` to disable |
| `position` | `ToastPosition` | `'top-right'` | Override per-toast position |
| `showProgress` | `boolean` | `true` | Show countdown progress bar |
| `icon` | `ReactNode` | auto | Custom icon element |
| `className` | `string` | - | Additional CSS class |
| `onDismiss` | `(id) => void` | - | Callback on dismiss |
| `render` | `(toast) => ReactNode` | - | Custom render function |

### Toast Positions

`'top-right'` | `'top-left'` | `'top-center'` | `'bottom-right'` | `'bottom-left'` | `'bottom-center'`

## License

MIT

---

## 🇫🇷 Documentation en français

### Description
**React Toastify Lite** est une bibliothèque légère de notifications toast pour React. Elle permet d'afficher des messages de succès, d'erreur, d'avertissement ou d'information de manière non intrusive, avec des animations fluides et une API simple.

### Installation
```bash
npm install @idirdev/react-toastify-lite
```

### Utilisation
```tsx
import { toast } from "@idirdev/react-toastify-lite";
toast.success("Opération réussie !");
toast.error("Une erreur est survenue.");
```
