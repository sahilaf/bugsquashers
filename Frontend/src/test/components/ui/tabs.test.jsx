import React, { createRef } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../../../components/ui/tabs'

describe('Tabs components', () => {
  it('renders TabsList with default and custom className, and forwards ref', () => {
    const ref = createRef()
    render(
      <Tabs defaultValue="tab1">
        <TabsList ref={ref} className="custom-list">
          <TabsTrigger value="tab1" style={{ display: 'none' }} />
        </TabsList>
        <TabsContent value="tab1">Placeholder</TabsContent>
      </Tabs>
    )
    const list = ref.current
    expect(list).toBeInTheDocument()
    expect(list).toHaveClass('inline-flex', 'h-9', 'bg-muted', 'custom-list')
  })

  it('renders TabsTrigger with default and custom className, and forwards ref', () => {
    const ref = createRef()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger ref={ref} className="custom-trigger" value="tab1">
            Trigger
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Placeholder</TabsContent>
      </Tabs>
    )
    const trigger = ref.current
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveClass('inline-flex', 'whitespace-nowrap', 'custom-trigger')
  })

  it('renders TabsContent with default and custom className, and forwards ref', () => {
    const ref = createRef()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" style={{ display: 'none' }} />
        </TabsList>
        <TabsContent ref={ref} className="custom-content" value="tab1">
          Content
        </TabsContent>
      </Tabs>
    )
    const content = ref.current
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('mt-2', 'custom-content')
  })

  it('renders correct panel based on controlled value prop', () => {
    const { rerender } = render(
      <Tabs value="tab1" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">First Content</TabsContent>
        <TabsContent value="tab2">Second Content</TabsContent>
      </Tabs>
    )

    let panels = screen.getAllByRole('tabpanel', { hidden: true })
    expect(panels[0]).toBeVisible()
    expect(panels[1]).not.toBeVisible()

    rerender(
      <Tabs value="tab2" onValueChange={() => {}}>
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">First Content</TabsContent>
        <TabsContent value="tab2">Second Content</TabsContent>
      </Tabs>
    )

    panels = screen.getAllByRole('tabpanel', { hidden: true })
    expect(panels[1]).toBeVisible()
    expect(panels[0]).not.toBeVisible()
  })

  it('calls onClick handler when TabsTrigger is clicked', () => {
    const handleClick = vi.fn()
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" onClick={handleClick}>
            Clickable
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content</TabsContent>
      </Tabs>
    )
    fireEvent.click(screen.getByText('Clickable'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
