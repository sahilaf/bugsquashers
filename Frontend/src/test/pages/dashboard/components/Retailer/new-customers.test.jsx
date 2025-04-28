/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// 1) Mock the TrendingUp icon
vi.mock('lucide-react', () => ({
  TrendingUp: (props) => <svg data-testid="TrendingUp-icon" {...props} />
}))

// 2) Mock Recharts primitives used by NewCustomersChart
vi.mock('recharts', () => ({
  BarChart: ({ children }) => <div data-testid="BarChart">{children}</div>,
  Bar: () => <div data-testid="Bar" />,
  XAxis: ({ dataKey }) => <div data-testid="XAxis">{dataKey}</div>,
  YAxis: ({ dataKey }) => <div data-testid="YAxis">{dataKey}</div>,
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

// 4) Import the component under test (match the actual filename exactly)
import { NewCustomersChart } from '../../../../../pages/dashboard/components/Retailer/new-customers'

describe('NewCustomersChart', () => {
  it('renders header title and description', () => {
    render(<NewCustomersChart />)
    expect(screen.getByText('New Customers')).toBeInTheDocument()
    expect(
      screen.getByText('Growth over the last 6 months')
    ).toBeInTheDocument()
  })

  it('renders ChartContainer with correct config', () => {
    render(<NewCustomersChart />)
    const container = screen.getByTestId('ChartContainer')
    const cfg = JSON.parse(container.getAttribute('data-config'))
    expect(cfg).toEqual({
      customers:   { label: 'New Customers' },
      jan:         { label: 'January',   color: 'hsl(var(--chart-1))' },
      feb:         { label: 'February',  color: 'hsl(var(--chart-2))' },
      mar:         { label: 'March',     color: 'hsl(var(--chart-3))' },
      apr:         { label: 'April',     color: 'hsl(var(--chart-4))' },
      may:         { label: 'May',       color: 'hsl(var(--chart-5))' },
      jun:         { label: 'June',      color: 'hsl(var(--chart-6))' },
    })
  })

  it('renders all Recharts primitives inside the container', () => {
    render(<NewCustomersChart />)
    expect(screen.getByTestId('BarChart')).toBeInTheDocument()
    expect(screen.getByTestId('YAxis')).toHaveTextContent('month')
    expect(screen.getByTestId('XAxis')).toHaveTextContent('customers')
    expect(screen.getByTestId('Bar')).toBeInTheDocument()
  })

  it('renders ChartTooltip and ChartTooltipContent with hideLabel', () => {
    render(<NewCustomersChart />)
    const tooltipWrapper = screen.getByTestId('ChartTooltip')
    expect(tooltipWrapper).toBeInTheDocument()
    expect(
      screen.getByTestId('ChartTooltipContent')
    ).toHaveTextContent('true')
  })

  it('renders footer text and TrendingUp icon', () => {
    render(<NewCustomersChart />)
    expect(
      screen.getByText(/New customer growth up by 8\.9% this month/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Showing new customer registrations for the last 6 months/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('TrendingUp-icon')).toBeInTheDocument()
  })
})
