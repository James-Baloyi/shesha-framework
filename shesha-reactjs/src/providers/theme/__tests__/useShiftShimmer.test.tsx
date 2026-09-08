import { render } from '@testing-library/react';
import { SHIMMER_CLASS, useShiftShimmer } from '../useShiftShimmer';

const LEFT = 1;
const RIGHT = 2;
const Host = (): null => {
  useShiftShimmer();
  return null;
};
const shift = (type: 'keydown' | 'keyup', location: number, repeat = false): void => {
  window.dispatchEvent(new KeyboardEvent(type, { key: 'Shift', location, repeat }));
};
const tapOtherShift = (): void => {
  shift('keydown', RIGHT);
  shift('keyup', RIGHT);
};

describe('useShiftShimmer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '<button class="ant-btn">a</button><button class="ant-btn">b</button>';
  });
  afterEach(() => {
    vi.useRealTimers();
    document.body.className = '';
    document.body.innerHTML = '';
  });

  it('shimmers when one Shift is held and the other is tapped twice', () => {
    render(<Host />);
    shift('keydown', LEFT);
    tapOtherShift();
    expect(document.body.classList.contains(SHIMMER_CLASS)).toBe(false);
    tapOtherShift();
    expect(document.body.classList.contains(SHIMMER_CLASS)).toBe(true);
  });

  it('staggers the buttons and cleans everything up when the run ends', () => {
    render(<Host />);
    shift('keydown', LEFT);
    tapOtherShift();
    tapOtherShift();
    const [first, second] = Array.from(document.querySelectorAll<HTMLElement>('.ant-btn'));
    expect(first?.style.getPropertyValue('--sha-shimmer-delay')).toBe('0ms');
    expect(second?.style.getPropertyValue('--sha-shimmer-delay')).toBe('45ms');
    vi.advanceTimersByTime(2100);
    expect(document.body.classList.contains(SHIMMER_CLASS)).toBe(false);
    expect(second?.style.getPropertyValue('--sha-shimmer-delay')).toBe('');
  });

  it('ignores two taps of the same Shift with nothing held, and key repeats', () => {
    render(<Host />);
    shift('keydown', LEFT);
    shift('keyup', LEFT);
    shift('keydown', LEFT);
    shift('keyup', LEFT);
    expect(document.body.classList.contains(SHIMMER_CLASS)).toBe(false);
    shift('keydown', LEFT);
    shift('keydown', RIGHT, true);
    shift('keydown', RIGHT, true);
    expect(document.body.classList.contains(SHIMMER_CLASS)).toBe(false);
  });

  it('forgets taps that are too far apart', () => {
    render(<Host />);
    shift('keydown', LEFT);
    tapOtherShift();
    vi.advanceTimersByTime(700);
    tapOtherShift();
    expect(document.body.classList.contains(SHIMMER_CLASS)).toBe(false);
  });

  it('removes its listeners and class on unmount', () => {
    const { unmount } = render(<Host />);
    shift('keydown', LEFT);
    tapOtherShift();
    tapOtherShift();
    unmount();
    expect(document.body.classList.contains(SHIMMER_CLASS)).toBe(false);
    shift('keydown', LEFT);
    tapOtherShift();
    tapOtherShift();
    expect(document.body.classList.contains(SHIMMER_CLASS)).toBe(false);
  });
});
