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

// 2) Mock recharts primitives, rendering Tooltip’s content so ChartTooltipContent mounts
vi.mock('recharts', () => ({
  AreaChart: ({ children }) => <div data-testid="AreaChart">{children}</div>,
  CartesianGrid: () => <div data-testid="CartesianGrid" />,
  XAxis: ({ dataKey }) => <div data-testid="XAxis">{dataKey}</div>,
  Tooltip: ({ content }) => <div data-testid="Tooltip">{content}</div>,
  Area: () => <div data-testid="Area" />,
  Legend: () => <div data-testid="Legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="ResponsiveContainer">{children}</div>,
}))

// 3) Mock your ChartContainer & ChartTooltipContent using the actual import path
vi.mock('../../../../../components/ui/chart', () => ({
  __esModule: true,
  ChartContainer: ({ config, children }) => (
    <div data-testid="ChartContainer" data-config={JSON.stringify(config)}>
      {children}
    </div>
  ),
  ChartTooltipContent: ({ indicator }) => (
    <div data-testid="ChartTooltipContent">{indicator}</div>
  ),
}))

// 4) Import the component under test
import { DailySalesChart } from '../../../../../pages/dashboard/components/Retailer/DailySalesChart'

describe('DailySalesChart', () => {
  it('renders header title and description', () => {
    render(<DailySalesChart />)
    expect(screen.getByText('Daily Sales')).toBeInTheDocument()
    expect(
      screen.getByText('Tracking daily sales for the last 10 days')
    ).toBeInTheDocument()
  })

  it('renders ChartContainer with correct config', () => {
    render(<DailySalesChart />)
    const container = screen.getByTestId('ChartContainer')
    const cfg = JSON.parse(container.getAttribute('data-config'))
    expect(cfg).toEqual({
      sales: {
        label: 'Daily Sales',
        color: 'hsl(var(--primary))',
      },
    })
  })

  it('renders all main recharts components', () => {
    render(<DailySalesChart />)
    expect(screen.getByTestId('AreaChart')).toBeInTheDocument()
    expect(screen.getByTestId('CartesianGrid')).toBeInTheDocument()
    expect(screen.getByTestId('XAxis')).toHaveTextContent('day')
    expect(screen.getByTestId('Tooltip')).toBeInTheDocument()
    expect(screen.getByTestId('Area')).toBeInTheDocument()
  })

  it('passes indicator="line" to ChartTooltipContent', () => {
    render(<DailySalesChart />)
    expect(screen.getByTestId('ChartTooltipContent')).toHaveTextContent('line')
  })

  it('renders footer text and TrendingUp icon', () => {
    render(<DailySalesChart />)
    expect(
      screen.getByText(/Trending up by 8\.7% this week/i)
    ).toBeInTheDocument()
    expect(screen.getByText(/March 1 - March 10, 2024/i)).toBeInTheDocument()
    expect(screen.getByTestId('TrendingUp-icon')).toBeInTheDocument()
  })
})
