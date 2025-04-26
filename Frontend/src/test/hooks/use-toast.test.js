import React from 'react';
import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Reload module each test to reset memory state
const loadToastModule = () => {
  vi.resetModules();
  return require('../../../src/hooks/use-toast');
};

describe('useToast hook and toast', () => {
  let useToast;
  let toast;

  beforeEach(() => {
    vi.useFakeTimers();
    const mod = loadToastModule();
    useToast = mod.useToast;
    toast = mod.toast;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initially has no toasts', () => {
    let hook;
    function Test() {
      hook = useToast();
      return null;
    }

    act(() => {
      render(React.createElement(Test));
    });

    expect(hook.toasts).toEqual([]);
  });

  it('adds a new toast and respects TOAST_LIMIT', () => {
    let hook;
    let t1;
    let t2;

    function Test() {
      hook = useToast();
      return null;
    }

    // Mount and subscribe
    act(() => {
      render(React.createElement(Test));
    });

    // Add first toast
    act(() => {
      t1 = hook.toast({ title: 'First' });
    });
    expect(hook.toasts).toHaveLength(1);
    expect(hook.toasts[0].open).toBe(true);

    // Add second toast, but limit is 1
    act(() => {
      t2 = hook.toast({ title: 'Second' });
    });
    expect(hook.toasts).toHaveLength(1);
    expect(hook.toasts[0].id).toBe(t2.id);
  });

  it('updates an existing toast', () => {
    let hook;
    let toastHandle;

    function Test() {
      hook = useToast();
      return null;
    }

    act(() => {
      render(React.createElement(Test));
    });

    act(() => {
      toastHandle = hook.toast({ title: 'Original' });
    });

    act(() => {
      toastHandle.update({ title: 'Updated' });
    });

    expect(hook.toasts[0].title).toBe('Updated');
  });

  it('dismisses a toast and removes after delay', () => {
    let hook;
    let toastHandle;

    function Test() {
      hook = useToast();
      return null;
    }

    act(() => {
      render(React.createElement(Test));
    });

    act(() => {
      toastHandle = hook.toast({ title: 'ToDismiss' });
    });

    act(() => {
      toastHandle.dismiss();
    });
    expect(hook.toasts[0].open).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000000);
    });
    expect(hook.toasts).toHaveLength(0);
  });

  it('dismisses all toasts when no id provided', () => {
    let hook;

    function Test() {
      hook = useToast();
      return null;
    }

    act(() => {
      render(React.createElement(Test));
    });

    act(() => {
      hook.toast({ title: 'One' });
      hook.toast({ title: 'Two' });
    });
    expect(hook.toasts).toHaveLength(1);

    act(() => {
      hook.dismiss();
    });
    expect(hook.toasts[0].open).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1000000);
    });
    expect(hook.toasts).toHaveLength(0);
  });
});
