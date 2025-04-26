// Polyfill ResizeObserver for JSDOM
if (typeof ResizeObserver === 'undefined') {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  }
  
  import React from 'react'
  import { render, screen } from '@testing-library/react'
  import userEvent from '@testing-library/user-event'
  import '@testing-library/jest-dom'
  import {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
  } from '../../../components/ui/navigation-menu'
  
  describe('NavigationMenu components', () => {
    it('renders NavigationMenu with children and default class', () => {
      render(
        <NavigationMenu data-testid="nav-root">
          <div>Menu Content</div>
        </NavigationMenu>
      )
  
      const root = screen.getByTestId('nav-root')
      expect(root).toBeInTheDocument()
      expect(root).toHaveTextContent('Menu Content')
    })
  
    it('renders NavigationMenuTrigger and Content within an Item', async () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger data-testid="nav-trigger">Trigger</NavigationMenuTrigger>
              <NavigationMenuContent data-testid="nav-content">Content Body</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
  
      // Trigger
      const trigger = screen.getByTestId('nav-trigger')
      expect(trigger).toBeInTheDocument()
      expect(trigger).toHaveTextContent('Trigger')
      expect(trigger.querySelector('svg')).toBeInTheDocument()
  
      // Open the menu to render content
      await userEvent.click(trigger)
  
      // Content should appear
      const content = await screen.findByTestId('nav-content')
      expect(content).toBeInTheDocument()
      expect(content).toHaveTextContent('Content Body')
    })
  
    it('renders NavigationMenuList and applies custom className', () => {
      render(
        <NavigationMenu>
          <NavigationMenuList className="custom-list" data-testid="nav-list" />
        </NavigationMenu>
      )
  
      const list = screen.getByTestId('nav-list')
      expect(list).toBeInTheDocument()
      expect(list).toHaveClass('custom-list')
    })
  
    it('renders NavigationMenuIndicator automatically', () => {
      const { container } = render(<NavigationMenu />)
  
      // Indicator wrapper uses class 'absolute left-0 top-full'
      const indicator = container.querySelector('.absolute.left-0.top-full')
      expect(indicator).toBeInTheDocument()
    })
  
    it('renders NavigationMenuViewport when opened', async () => {
      render(
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger data-testid="nav-trigger">Open</NavigationMenuTrigger>
              <NavigationMenuContent>Ignore</NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      )
  
      // Open to mount viewport
      await userEvent.click(screen.getByTestId('nav-trigger'))
  
      // Now the viewport wrapper and inner viewport should render
      const wrapper = document.querySelector('.absolute.left-0.top-full.flex.justify-center')
      expect(wrapper).toBeInTheDocument()
      const viewport = wrapper.querySelector('.origin-top-center')
      expect(viewport).toBeInTheDocument()
    })
  })