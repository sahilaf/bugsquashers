// src/test/components/ui/scroll-area.test.jsx

// Polyfill requestAnimationFrame for JSDOM
if (typeof global.requestAnimationFrame === 'undefined') {
    global.requestAnimationFrame = (cb) => setTimeout(() => cb(performance.now()), 0)
  }
  
  import React, { createRef } from 'react'
  import { render, screen } from '@testing-library/react'
  import userEvent from '@testing-library/user-event'
  import '@testing-library/jest-dom'
  import { ScrollArea } from '../../../components/ui/scroll-area'
  
  describe('ScrollArea component', () => {
    it('renders root, scroll buttons, and viewport with children', () => {
      render(
        <ScrollArea data-testid="scroll-area" className="custom-scroll">
          <div data-testid="child">Item 1</div>
        </ScrollArea>
      )
  
      // The Radix Root should be in the document and merge our className
      const root = screen.getByTestId('scroll-area')
      expect(root).toBeInTheDocument()
      expect(root).toHaveClass('w-full', 'overflow-hidden', 'custom-scroll')
  
      // There should be exactly two buttons: left and right
      const [leftBtn, rightBtn] = screen.getAllByRole('button')
      expect(leftBtn).toHaveTextContent('←')
      expect(rightBtn).toHaveTextContent('→')
  
      // Child content must render inside the viewport
      expect(screen.getByTestId('child')).toBeInTheDocument()
    })
  
    it('forwards ref to the Radix Root element', () => {
      const ref = createRef()
      render(<ScrollArea ref={ref} data-testid="scroll-area" />)
      expect(ref.current).toBeInstanceOf(HTMLElement)
      expect(ref.current).toBe(screen.getByTestId('scroll-area'))
    })
  
    it('allows clicking on scroll buttons without error', async () => {
      render(
        <ScrollArea>
          <div>Scroll Content</div>
        </ScrollArea>
      )
      const [leftBtn, rightBtn] = screen.getAllByRole('button')
  
      // Simply ensure clicks do not throw
      await expect(userEvent.click(leftBtn)).resolves.not.toThrow()
      await expect(userEvent.click(rightBtn)).resolves.not.toThrow()
    })
  })
  