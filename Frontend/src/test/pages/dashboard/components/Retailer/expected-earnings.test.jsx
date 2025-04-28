
/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// 1) Mock TrendingUp from lucide-react
vi.mock('lucide-react', () => ({
  TrendingUp: (props) => <svg data-testid="TrendingUp-icon" {...props} />
}))

// 2) Mock Recharts primitives used in ExpectedEarnings.jsx
vi.mock('recharts', () => ({
  PieChart: ({ children }) => <div data-testid="PieChart">{children}</div>,
  Pie: ({ children }) => <div data-testid="Pie">{children}</div>,
  Label: ({ content }) => {
    // simulate calling the renderLabelContent function with viewBox & totalBuyers
    const rendered = content({ viewBox: { cx: 100, cy: 100 }, totalBuyers: 1125 })
    return <div data-testid="Label">{rendered}</div>
  }
}))

// 3) Mock our chart UI wrappers
vi.mock('../../../../../components/ui/chart', () => ({
  __esModule: true,
  ChartContainer: ({ config, children }) => (
    <div data-testid="ChartContainer" data-config={JSON.stringify(config)}>
      {children}
    </div>
  ),
  ChartTooltip: ({ content }) => (
    <div data-testid="ChartTooltip">{content}</div>
  ),
  ChartTooltipContent: ({ hideLabel }) => (
    <div data-testid="ChartTooltipContent">{String(hideLabel)}</div>
  )
}))

// 4) Import the component under test
import { ExpectedEarnings } from '../../../../../pages/dashboard/components/Retailer/expected-earnings'

describe('ExpectedEarnings', () => {
  it('renders header with title and description', () => {
    render(<ExpectedEarnings />)
    expect(
      screen.getByText('Expected Earnings - Buyers Distribution')
    ).toBeInTheDocument()
    expect(screen.getByText('January - June 2024')).toBeInTheDocument()
  })

  it('renders ChartContainer with correct config', () => {
    render(<ExpectedEarnings />)
    const container = screen.getByTestId('ChartContainer')
    const cfg = JSON.parse(container.getAttribute('data-config'))
    expect(cfg).toEqual({
      buyers: { label: 'Buyers' },
      productA: { label: 'Product A', color: 'hsl(var(--chart-1))' },
      productB: { label: 'Product B', color: 'hsl(var(--chart-2))' },
      productC: { label: 'Product C', color: 'hsl(var(--chart-3))' },
      productD: { label: 'Product D', color: 'hsl(var(--chart-4))' },
      other:   { label: 'Other',     color: 'hsl(var(--chart-5))' }
    })
  })

  it('renders PieChart, Pie, and Label with total buyers', () => {
    render(<ExpectedEarnings />)
    expect(screen.getByTestId('PieChart')).toBeInTheDocument()
    expect(screen.getByTestId('Pie')).toBeInTheDocument()
    // Label content should include formatted total "1,125" and the word "Buyers"
    const label = screen.getByTestId('Label')
    expect(label).toHaveTextContent('1,125')
    expect(label).toHaveTextContent('Buyers')
  })

  it('renders ChartTooltip and ChartTooltipContent', () => {
    render(<ExpectedEarnings />)
    // ChartTooltip wraps the ChartTooltipContent
    const tooltipWrapper = screen.getByTestId('ChartTooltip')
    expect(tooltipWrapper).toBeInTheDocument()
    // Inside, hideLabel was true
    expect(screen.getByTestId('ChartTooltipContent')).toHaveTextContent('true')
  })

  it('renders footer text and TrendingUp icon', () => {
    render(<ExpectedEarnings />)
    expect(
      screen.getByText(/Trending up by 7\.5% this month/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Showing expected earnings and buyers for the last 6 months/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('TrendingUp-icon')).toBeInTheDocument()
  })
})
