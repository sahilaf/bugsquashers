import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import PurchaseHistory from '../../../../../pages/dashboard/components/Retailer/PurchaseHistory';

describe('<PurchaseHistory />', () => {
  beforeEach(() => {
    render(<PurchaseHistory />);
  });

  it('renders the card header title', () => {
    expect(screen.getByText('Purchase History')).toBeInTheDocument();
  });

  it('renders all table headers', () => {
    const headers = ['Product', 'Farmer', 'Date', 'Quantity', 'Price', 'Total', 'Status'];
    headers.forEach((text) => {
      // TableHead uses <th>, but testing-library will find by text
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('renders one row per demoData entry with correct formatted cells', () => {
    // The demoData has 4 entries
    const rows = screen.getAllByRole('row');
    // first row is header row, so 1 header + 4 data rows = 5 total
    expect(rows).toHaveLength(5);

    // Define the expected demo data
    const demoData = [
      {
        product: 'Organic Tomatoes',
        farmerName: 'Ravi Kumar',
        purchaseDate: '15 Mar 2024',
        quantityText: '150 kg',
        priceText: 'bdt 25.5/kg',
        totalText: 'bdt 3,825',
        status: 'Completed',
      },
      {
        product: 'Basmati Rice',
        farmerName: 'Priya Sharma',
        purchaseDate: '14 Mar 2024',
        quantityText: '200 kg',
        priceText: 'bdt 42.75/kg',
        totalText: 'bdt 8,550',
        status: 'Pending',
      },
      {
        product: 'Alphonso Mangoes',
        farmerName: 'Vijay Patil',
        purchaseDate: '13 Mar 2024',
        quantityText: '75 kg',
        priceText: 'bdt 120/kg',
        totalText: 'bdt 9,000',
        status: 'Completed',
      },
      {
        product: 'Fresh Spinach',
        farmerName: 'Anjali Mehta',
        purchaseDate: '12 Mar 2024',
        quantityText: '50 kg',
        priceText: 'bdt 18/kg',
        totalText: 'bdt 900',
        status: 'Completed',
      },
    ];

    // Skip the header row at index 0
    demoData.forEach((item, idx) => {
      const row = rows[idx + 1]; 
      const { getAllByRole, getByText } = within(row);
      // Cells:
      expect(getByText(item.product)).toBeInTheDocument();
      expect(getByText(item.farmerName)).toBeInTheDocument();
      expect(getByText(item.purchaseDate)).toBeInTheDocument();
      expect(getByText(item.quantityText)).toBeInTheDocument();
      expect(getByText(item.priceText)).toBeInTheDocument();
      expect(getByText(item.totalText)).toBeInTheDocument();
      expect(getByText(item.status)).toBeInTheDocument();
    });
  });

  it('renders the total purchases summary correctly', () => {
    // Sum of [3825,8550,9000,900] = 22275 -> "bdt 22,275"
    const totalLabel = screen.getByText('Total Purchases:');
    expect(totalLabel).toBeInTheDocument();
    const totalValue = screen.getByText('bdt 22,275');
    expect(totalValue).toBeInTheDocument();
  });
});
