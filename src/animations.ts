/**
 * CSS keyframe animations for toast enter/exit transitions.
 *
 * Animations are injected once into the document head to avoid
 * duplicating style elements on every toast mount.
 */

const STYLE_ID = 'react-toastify-lite-animations';

const animationCSS = `
@keyframes rtl-slideInRight {
  from {
    transform: translateX(110%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes rtl-slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(110%);
    opacity: 0;
  }
}

@keyframes rtl-slideInLeft {
  from {
    transform: translateX(-110%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes rtl-slideOutLeft {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-110%);
    opacity: 0;
  }
}

@keyframes rtl-slideInDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes rtl-slideOutUp {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
}

@keyframes rtl-slideInUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes rtl-slideOutDown {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}

@keyframes rtl-progressShrink {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
`;

/**
 * Inject animation styles into the document head (idempotent).
 */
export function injectAnimations(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = animationCSS;
  document.head.appendChild(style);
}

export type ToastAnimationDirection = 'right' | 'left' | 'top' | 'bottom';

/**
 * Get the enter animation name based on slide direction.
 */
export function getEnterAnimation(direction: ToastAnimationDirection): string {
  switch (direction) {
    case 'right':
      return 'rtl-slideInRight';
    case 'left':
      return 'rtl-slideInLeft';
    case 'top':
      return 'rtl-slideInDown';
    case 'bottom':
      return 'rtl-slideInUp';
  }
}

/**
 * Get the exit animation name based on slide direction.
 */
export function getExitAnimation(direction: ToastAnimationDirection): string {
  switch (direction) {
    case 'right':
      return 'rtl-slideOutRight';
    case 'left':
      return 'rtl-slideOutLeft';
    case 'top':
      return 'rtl-slideOutUp';
    case 'bottom':
      return 'rtl-slideOutDown';
  }
}

/**
 * Determine animation direction from toast position.
 */
export function getAnimationDirection(
  position: string
): ToastAnimationDirection {
  if (position.includes('right')) return 'right';
  if (position.includes('left')) return 'left';
  if (position.startsWith('top')) return 'top';
  return 'bottom';
}
