import React from 'react';
import { render, cleanup, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Orb from '../../components/Orb';

// Mock ogl classes
vi.mock('ogl', () => ({
  Renderer: vi.fn().mockImplementation(() => ({
    gl: {
      canvas: document.createElement('canvas'),
      clearColor: vi.fn(),
      getExtension: vi.fn(() => ({ loseContext: vi.fn() })),
    },
    setSize: vi.fn(),
    render: vi.fn(),
  })),
  Program: vi.fn().mockImplementation((gl, opts) => ({
    uniforms: opts.uniforms,
  })),
  Mesh: vi.fn(),
  Triangle: vi.fn(),
  Vec3: vi.fn().mockImplementation((x, y, z) => ({ set: vi.fn() })),
}));

describe('Orb component', () => {
  let rafCallback;

  beforeEach(() => {
    // Capture RAF callback without immediate recursion
    rafCallback = null;
    vi.stubGlobal('requestAnimationFrame', vi.fn((cb) => {
      rafCallback = cb;
      return 1;
    }));
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    // Mock devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('mounts, appends canvas, handles events, invokes update, and cleans up', () => {
    const { container, unmount } = render(
      <Orb hue={180} hoverIntensity={0.3} rotateOnHover={true} forceHoverState={false} />
    );

    // Canvas appended
    const canvas = container.querySelector('canvas');
    expect(canvas).toBeTruthy();

    // RAF should be initialized
    expect(requestAnimationFrame).toHaveBeenCalled();

    // Manually trigger one update cycle
    act(() => {
      rafCallback && rafCallback(1000);
    });

    // Trigger events
    fireEvent(window, new Event('resize'));
    fireEvent.mouseMove(container.firstChild, { clientX: 10, clientY: 10 });
    fireEvent.mouseLeave(container.firstChild);

    // Unmount triggers cleanup
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
    expect(container.querySelector('canvas')).toBeNull();
  });

  it('honors rotateOnHover=false and forceHoverState=true branches', () => {
    const { container, unmount } = render(
      <Orb hue={100} hoverIntensity={0.1} rotateOnHover={false} forceHoverState={true} />
    );

    // RAF should be initialized
    expect(requestAnimationFrame).toHaveBeenCalled();

    // Manually trigger update to exercise forceHoverState and rotateOnHover false
    act(() => {
      rafCallback && rafCallback(500);
    });

    // Cleanup
    unmount();
    expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
  });
});
