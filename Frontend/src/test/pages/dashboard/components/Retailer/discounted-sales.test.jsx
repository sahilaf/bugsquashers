/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// 1) Mock the TrendingUp icon
vi.mock('lucide-react', () => ({
  TrendingUp: (props) => <svg data-testid="TrendingUp-icon" {...props} />,
}))

// 2) Mock Recharts primitives (only those the component uses)
vi.mock('recharts', () => ({
  AreaChart: ({ children }) => <div data-testid="AreaChart">{children}</div>,
  CartesianGrid: () => <div data-testid="CartesianGrid" />,
  XAxis: ({ dataKey }) => <div data-testid="XAxis">{dataKey}</div>,
  Area: () => <div data-testid="Area" />,
}))

// 3) Mock our chart UI wrappers
vi.mock('../../../../../components/ui/chart', () => ({
  __esModule: true,
  ChartContainer: ({ config, children }) => (
    <div
      data-testid="ChartContainer"
      data-config={JSON.stringify(config)}
    >
      {children}
    </div>
  ),
  ChartTooltip: ({ content }) => (
    <div data-testid="ChartTooltip">{content}</div>
  ),
  ChartTooltipContent: ({ indicator, hideLabel }) => (
    <div data-testid="ChartTooltipContent">
      {indicator}-{String(hideLabel)}
    </div>
  ),
}))

// 4) Import the component under test
import { DiscountedSalesChart } from '../../../../../pages/dashboard/components/Retailer/discounted-sales'

describe('DiscountedSalesChart', () => {
  it('renders header title and description', () => {
    render(<DiscountedSalesChart />)
    expect(
      screen.getByText('Discounted Product Sales')
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Tracking sales of discounted products over the last 6 months'
      )
    ).toBeInTheDocument()
  })

  it('renders ChartContainer with correct config', () => {
    render(<DiscountedSalesChart />)
    const container = screen.getByTestId('ChartContainer')
    const cfg = JSON.parse(container.getAttribute('data-config'))
    expect(cfg).toEqual({
      discountedSales: {
        label: 'Discounted Sales',
        color: 'hsl(var(--chart-1))',
      },
    })
  })

  it('renders all Recharts primitives', () => {
    render(<DiscountedSalesChart />)
    expect(screen.getByTestId('AreaChart')).toBeInTheDocument()
    expect(screen.getByTestId('CartesianGrid')).toBeInTheDocument()
    expect(screen.getByTestId('XAxis')).toHaveTextContent('month')
    expect(screen.getByTestId('Area')).toBeInTheDocument()
  })

  it('renders ChartTooltip with correct content', () => {
    render(<DiscountedSalesChart />)
    // ChartTooltip wraps the content prop
    const tooltip = screen.getByTestId('ChartTooltip')
    expect(tooltip).toBeInTheDocument()

    // Inside it, ChartTooltipContent should show "dot-true"
    const inner = screen.getByTestId('ChartTooltipContent')
    expect(inner).toHaveTextContent('dot-true')
  })

  it('renders footer text and TrendingUp icon', () => {
    render(<DiscountedSalesChart />)
    expect(
      screen.getByText(/Discounted sales up by 12\.5% this month/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/January - June 2024/i)).toBeInTheDocument()
    expect(screen.getByTestId('TrendingUp-icon')).toBeInTheDocument()
  })
})
