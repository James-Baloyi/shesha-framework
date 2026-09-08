import { useEffect } from 'react';

export const SHIMMER_CLASS = 'sha-shimmer';
const TAP_WINDOW_MS = 600;
const RUN_MS = 2000;
const STAGGER_MS = 45;
const MAX_STAGGER_MS = 600;

/** Hold one Shift, tap the other Shift twice: every button on the page shimmers and dances for ~2s. */
export const useShiftShimmer = (): void => {
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;

    const held = new Set<number>(); // `KeyboardEvent.location` of the Shift keys currently down
    let taps: number[] = [];
    let timer: ReturnType<typeof setTimeout> | undefined;

    const run = (): void => {
      if (timer) return;
      const buttons = Array.from(document.querySelectorAll<HTMLElement>('.ant-btn'));
      // ripple outwards in DOM order so the page dances as a wave rather than all at once
      buttons.forEach((b, i) => b.style.setProperty('--sha-shimmer-delay', `${Math.min(i * STAGGER_MS, MAX_STAGGER_MS)}ms`));
      document.body.classList.add(SHIMMER_CLASS);
      timer = setTimeout(() => {
        document.body.classList.remove(SHIMMER_CLASS);
        buttons.forEach((b) => b.style.removeProperty('--sha-shimmer-delay'));
        timer = undefined;
      }, RUN_MS + Math.min(buttons.length * STAGGER_MS, MAX_STAGGER_MS));
    };

    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== 'Shift' || e.repeat) return;
      const otherHeld = Array.from(held).some((loc) => loc !== e.location);
      held.add(e.location);
      if (!otherHeld) {
        taps = [];
        return;
      }
      const now = Date.now();
      taps = [...taps.filter((t) => now - t < TAP_WINDOW_MS), now];
      if (taps.length >= 2) {
        taps = [];
        run();
      }
    };

    const onKeyUp = (e: KeyboardEvent): void => {
      if (e.key !== 'Shift') return;
      held.delete(e.location);
      if (held.size === 0) taps = [];
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      if (timer) clearTimeout(timer);
      document.body.classList.remove(SHIMMER_CLASS);
    };
  }, []);
};
