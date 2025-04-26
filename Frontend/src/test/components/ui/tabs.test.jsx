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
      <TabsList ref={ref} className="custom-list">
        {/* Items are tested in Tabs integration below */}
      </TabsList>
    )
    const list = ref.current
    expect(list).toBeInTheDocument()
    expect(list).toHaveClass('inline-flex', 'h-9', 'bg-muted', 'custom-list')
  })

  it('renders TabsTrigger with default and custom className, and forwards ref', () => {
    const ref = createRef()
    render(
      <TabsTrigger ref={ref} className="custom-trigger" value="tab1">
        Trigger
      </TabsTrigger>
    )
    const trigger = ref.current
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute('data-state')
    expect(trigger).toHaveClass('inline-flex', 'whitespace-nowrap', 'custom-trigger')
  })

  it('renders TabsContent with default and custom className, and forwards ref', () => {
    const ref = createRef()
    render(
      <TabsContent ref={ref} className="custom-content" value="tab1">
        Content
      </TabsContent>
    )
    const content = ref.current
    expect(content).toBeInTheDocument()
    expect(content).toHaveClass('mt-2', 'custom-content')
  })

  it('integrates Tabs, switching content when triggers are clicked', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">First Content</TabsContent>
        <TabsContent value="tab2">Second Content</TabsContent>
      </Tabs>
    )

    // Initially, first content is shown and second is hidden
    expect(screen.getByText('First Content')).toBeVisible()
    expect(screen.queryByText('Second Content')).not.toBeVisible()

    // Click second trigger
    fireEvent.click(screen.getByText('Tab 2'))
    expect(screen.getByText('Second Content')).toBeVisible()
    expect(screen.queryByText('First Content')).not.toBeVisible()
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
