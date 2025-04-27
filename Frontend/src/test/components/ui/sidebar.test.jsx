import React from 'react';
import {
  render,
  fireEvent,
  screen,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// 1) Mock useIsMobile BEFORE importing components that use it
vi.mock('../../../hooks/use-mobile', () => ({
  useIsMobile: vi.fn(),
}));
import { useIsMobile } from '../../../hooks/use-mobile';

// 2) Import all Sidebar UI components
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarInset,
  SidebarInput,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '../../../components/ui/sidebar';

// 3) Import hook + constants from sidebar-utils
import {
  useSidebar,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_KEYBOARD_SHORTCUT,
} from '../../../components/ui/sidebar-utils';

describe('Sidebar components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useIsMobile.mockReturnValue(false);
    document.cookie = '';
  });

  it('useSidebar outside provider throws', () => {
    // We don’t care about the message; just that it errors
    expect(() => useSidebar()).toThrow();
  });

  it('SidebarProvider defaultOpen toggles via Ctrl+B and writes cookie=false', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>
    );

    // No cookie until we toggle
    expect(document.cookie).toBe('');

    // Simulate Ctrl+B
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: SIDEBAR_KEYBOARD_SHORTCUT,
          ctrlKey: true,
        })
      );
    });

    // After toggle, cookie=false
    expect(document.cookie).toContain(
      `${SIDEBAR_COOKIE_NAME}=false`
    );
  });

  it('SidebarProvider toggles via Meta+B as well', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>
    );
    act(() => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: SIDEBAR_KEYBOARD_SHORTCUT,
          metaKey: true,
        })
      );
    });
    expect(document.cookie).toContain(
      `${SIDEBAR_COOKIE_NAME}=false`
    );
  });

  it('Controlled SidebarProvider respects open prop and calls onOpenChange', () => {
    const onOpenChange = vi.fn();
    render(
      <SidebarProvider open={false} onOpenChange={onOpenChange}>
        <SidebarTrigger />
      </SidebarProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it('Sidebar with collapsible="none" always renders children', () => {
    render(
      <SidebarProvider>
        <Sidebar collapsible="none">NoCollapse</Sidebar>
      </SidebarProvider>
    );
    expect(screen.getByText('NoCollapse')).toBeInTheDocument();
  });

  it('Mobile view uses Sheet component after clicking trigger', () => {
    useIsMobile.mockReturnValue(true);
    render(
      <SidebarProvider>
        <SidebarTrigger />
        <Sidebar>MobileContent</Sidebar>
      </SidebarProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(
      document.querySelector('[data-mobile="true"]')
    ).toBeInTheDocument();
    expect(screen.getByText('MobileContent')).toBeInTheDocument();
  });

  it('Desktop view renders container with correct data attributes', () => {
    render(
      <SidebarProvider>
        <Sidebar
          side="right"
          collapsible="offcanvas"
          variant="floating"
        >
          DesktopContent
        </Sidebar>
      </SidebarProvider>
    );
    const el = document.querySelector(
      '[data-state="expanded"][data-side="right"]'
    );
    expect(el).toBeInTheDocument();
  });

  it('SidebarTrigger toggles sidebar on click', () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(document.cookie).toContain(
      `${SIDEBAR_COOKIE_NAME}=false`
    );
  });

  it('SidebarRail toggles sidebar on click', () => {
    render(
      <SidebarProvider>
        <SidebarRail />
      </SidebarProvider>
    );
    fireEvent.click(
      document.querySelector('[data-sidebar="rail"]')
    );
    expect(document.cookie).toContain(
      `${SIDEBAR_COOKIE_NAME}=false`
    );
  });

  it('SidebarInset renders a <main> with children', () => {
    render(
      <SidebarProvider>
        <SidebarInset>InsetText</SidebarInset>
      </SidebarProvider>
    );
    const main = screen.getByText('InsetText');
    expect(main.tagName).toBe('MAIN');
  });

  it('SidebarInput renders an <input> with props', () => {
    render(
      <SidebarProvider>
        <SidebarInput placeholder="Type here" />
      </SidebarProvider>
    );
    expect(
      screen.getByPlaceholderText('Type here')
    ).toBeInTheDocument();
  });

  it('SidebarHeader and SidebarFooter render children', () => {
    render(
      <SidebarProvider>
        <SidebarHeader>HeaderContent</SidebarHeader>
        <SidebarFooter>FooterContent</SidebarFooter>
      </SidebarProvider>
    );
    expect(screen.getByText('HeaderContent')).toBeInTheDocument();
    expect(screen.getByText('FooterContent')).toBeInTheDocument();
  });

  it('Separator, Content, and Group components render with correct data attributes', () => {
    render(
      <SidebarProvider>
        <SidebarSeparator />
        <SidebarContent>MainContent</SidebarContent>
        <SidebarGroup>GroupContent</SidebarGroup>
      </SidebarProvider>
    );
    expect(
      document.querySelector('[data-sidebar="separator"]')
    ).toBeInTheDocument();
    expect(screen.getByText('MainContent')).toBeInTheDocument();
    expect(screen.getByText('GroupContent')).toBeInTheDocument();
  });

  it('SidebarGroupLabel displays correctly in default and asChild modes', () => {
    render(
      <SidebarProvider>
        <SidebarGroupLabel>LabelA</SidebarGroupLabel>
        <SidebarGroupLabel asChild>
          <span>LabelB</span>
        </SidebarGroupLabel>
      </SidebarProvider>
    );
    expect(screen.getByText('LabelA')).toBeInTheDocument();
    expect(screen.getByText('LabelB')).toBeInTheDocument();
  });

  it('SidebarGroupAction supports default, asChild, and showOnHover', () => {
    render(
      <SidebarProvider>
        <SidebarGroupAction>Act1</SidebarGroupAction>
        <SidebarGroupAction asChild>
          <button>Act2</button>
        </SidebarGroupAction>
        <SidebarGroupAction showOnHover>Act3</SidebarGroupAction>
      </SidebarProvider>
    );
    expect(screen.getByText('Act1')).toBeInTheDocument();
    expect(screen.getByText('Act2')).toBeInTheDocument();
    expect(screen.getByText('Act3')).toBeInTheDocument();
  });

  it('SidebarMenu and SidebarMenuItem render list structure', () => {
    render(
      <SidebarProvider>
        <SidebarMenu>
          <SidebarMenuItem>MenuItem</SidebarMenuItem>
        </SidebarMenu>
      </SidebarProvider>
    );
    expect(screen.getByText('MenuItem')).toBeInTheDocument();
  });

  it('SidebarMenuButton works with and without tooltip', () => {
    render(
      <SidebarProvider defaultOpen={false}>
        <SidebarMenuButton>Simple</SidebarMenuButton>
        <SidebarMenuButton tooltip="Hint">WithTip</SidebarMenuButton>
      </SidebarProvider>
    );
    expect(screen.getByText('Simple')).toBeInTheDocument();
    expect(screen.queryByText('Hint')).not.toBeInTheDocument();
  });

  it('SidebarMenuAction and SidebarMenuBadge render content', () => {
    render(
      <SidebarProvider>
        <SidebarMenuAction>MA</SidebarMenuAction>
        <SidebarMenuBadge>MB</SidebarMenuBadge>
      </SidebarProvider>
    );
    expect(screen.getByText('MA')).toBeInTheDocument();
    expect(screen.getByText('MB')).toBeInTheDocument();
  });

  it('SidebarMenuSkeleton shows text bar and optional icon', () => {
    render(
      <SidebarProvider>
        <SidebarMenuSkeleton />
        <SidebarMenuSkeleton showIcon />
      </SidebarProvider>
    );
    expect(
      document.querySelector('[data-sidebar="menu-skeleton-text"]')
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-sidebar="menu-skeleton-icon"]')
    ).toBeInTheDocument();
  });

  it('SidebarMenuSub, SubItem, and SubButton support size and active flags', () => {
    render(
      <SidebarProvider>
        <SidebarMenuSub>
          <SidebarMenuSubItem>SubIt</SidebarMenuSubItem>
          <SidebarMenuSubButton size="sm" isActive>
            SubBtn
          </SidebarMenuSubButton>
        </SidebarMenuSub>
      </SidebarProvider>
    );
    expect(screen.getByText('SubIt')).toBeInTheDocument();
    const btn = screen.getByText('SubBtn');
    expect(btn).toHaveAttribute('data-size', 'sm');
    expect(btn).toHaveAttribute('data-active', 'true');
  });
});
