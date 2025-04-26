import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useIsMobile } from '../../../src/hooks/use-mobile';

// Stub matchMedia event listeners
let listeners;

beforeEach(() => {
  listeners = {};
  // Mock window.matchMedia
  global.window.matchMedia = vi.fn().mockImplementation(query => ({
    matches: undefined,
    media: query,
    addEventListener: (event, cb) => { listeners[event] = cb; },
    removeEventListener: (event, cb) => { if (listeners[event] === cb) delete listeners[event]; },
  }));
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('useIsMobile hook', () => {
  it('returns true when innerWidth is below breakpoint', () => {
    global.window.innerWidth = 500;
    let result;
    function TestComp() {
      result = useIsMobile();
      return null;
    }

    act(() => {
      render(React.createElement(TestComp));
    });

    expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 767px)');
    expect(result).toBe(true);
  });

  it('returns false when innerWidth is above breakpoint', () => {
    global.window.innerWidth = 800;
    let result;
    function TestComp() {
      result = useIsMobile();
      return null;
    }

    act(() => {
      render(React.createElement(TestComp));
    });

    expect(result).toBe(false);
  });

  it('updates when viewport crosses breakpoint on mql change event', () => {
    // Start mobile
    global.window.innerWidth = 500;
    let result;
    function TestComp() {
      result = useIsMobile();
      return null;
    }
    const { unmount } = render(React.createElement(TestComp));

    // Initial state
    expect(result).toBe(true);

    // Change to desktop and trigger listener
    global.window.innerWidth = 900;
    act(() => {
      listeners.change();
    });
    expect(result).toBe(false);

    // Clean up
    act(() => { unmount(); });
    // After unmount, listener removed
    expect(listeners.change).toBeUndefined();
  });
});
