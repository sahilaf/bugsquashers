import React from 'react';
import { render, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Dynamically import the ES module to reset state between tests
async function loadToastModule() {
  vi.resetModules();
  return await import('../../../src/hooks/use-toast.js');
}

describe('useToast hook and toast', () => {
  let useToast;
  let toast;

  beforeEach(async () => {
    vi.useFakeTimers();
    const mod = await loadToastModule();
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
    let id1, id2;

    function Test() {
      hook = useToast();
      return null;
    }

    act(() => {
      render(React.createElement(Test));
    });

    act(() => {
      id1 = hook.toast({ title: 'First' }).id;
    });
    expect(hook.toasts).toHaveLength(1);
    expect(hook.toasts[0].open).toBe(true);

    act(() => {
      id2 = hook.toast({ title: 'Second' }).id;
    });
    expect(hook.toasts).toHaveLength(1);
    expect(hook.toasts[0].id).toBe(id2);
  });

  it('updates an existing toast', () => {
    let hook;
    let handle;

    function Test() {
      hook = useToast();
      return null;
    }

    act(() => {
      render(React.createElement(Test));
    });

    act(() => {
      handle = hook.toast({ title: 'Original' });
    });

    act(() => {
      handle.update({ title: 'Updated' });
    });

    expect(hook.toasts[0].title).toBe('Updated');
  });

  it('dismisses a toast and removes after delay', () => {
    let hook;
    let handle;

    function Test() {
      hook = useToast();
      return null;
    }

    act(() => {
      render(React.createElement(Test));
    });

    act(() => {
      handle = hook.toast({ title: 'ToDismiss' });
    });

    act(() => {
      handle.dismiss();
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
