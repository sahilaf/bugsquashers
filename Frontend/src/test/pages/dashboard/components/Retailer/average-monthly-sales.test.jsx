/**
 * @vitest-environment jsdom
 */
import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// 1) Mock the lucide-react icon
vi.mock('lucide-react', () => ({
  TrendingUp: (props) => <svg data-testid="TrendingUp-icon" {...props} />,
}))

// 2) Mock recharts (no Legend needed)
vi.mock('recharts', () => ({
  BarChart: ({ children }) => <div data-testid="BarChart">{children}</div>,
  CartesianGrid: () => <div data-testid="CartesianGrid" />,
  XAxis: ({ dataKey }) => <div data-testid="XAxis">{dataKey}</div>,
  Tooltip: () => <div data-testid="Tooltip" />,
  Bar: ({ children }) => <div data-testid="Bar">{children}</div>,
  LabelList: () => <div data-testid="LabelList" />,
}))

// 3) Mock our UI chart wrappers
vi.mock('../../../../../components/ui/chart', () => ({
  __esModule: true,
  ChartContainer: ({ config, children }) => (
    <div data-testid="ChartContainer" data-config={JSON.stringify(config)}>
      {children}
    </div>
  ),
  ChartTooltipContent: () => <div data-testid="ChartTooltipContent" />,
}))

// 4) Import the component under test
import { AvgMonthlySales } from '../../../../../pages/dashboard/components/Retailer/average-monthly-sales'

describe('AvgMonthlySales', () => {
  it('renders all main chart elements', () => {
    render(<AvgMonthlySales />)
    expect(screen.getByTestId('ChartContainer')).toBeInTheDocument()
    expect(screen.getByTestId('BarChart')).toBeInTheDocument()
    expect(screen.getByTestId('CartesianGrid')).toBeInTheDocument()
    expect(screen.getByTestId('XAxis')).toHaveTextContent('month')
    expect(screen.getByTestId('Tooltip')).toBeInTheDocument()
    expect(screen.getByTestId('Bar')).toBeInTheDocument()
    expect(screen.getByTestId('LabelList')).toBeInTheDocument()
  })

  it('displays the header title and description', () => {
    render(<AvgMonthlySales />)
    expect(screen.getByText('Average Monthly Sales')).toBeInTheDocument()
    expect(screen.getByText('January - June 2024')).toBeInTheDocument()
  })

  it('passes the correct config into ChartContainer', () => {
    render(<AvgMonthlySales />)
    const container = screen.getByTestId('ChartContainer')
    const cfg = JSON.parse(container.getAttribute('data-config'))
    expect(cfg).toEqual({ colors: { sales: '#31A04A' } })
  })

  it('renders the footer text and icon', () => {
    render(<AvgMonthlySales />)
    expect(
      screen.getByText(/Sales up by 7\.5% this month/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Showing average monthly sales for the last 6 months/i
      )
    ).toBeInTheDocument()
    expect(screen.getByTestId('TrendingUp-icon')).toBeInTheDocument()
  })
})
