import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import FarmerDashHeader from '../../../../../pages/dashboard/components/Farmer/FarmerDashHeader';

// Reset mocks before each test
beforeEach(() => {
  vi.restoreAllMocks();
  // Ensure URL.createObjectURL is defined for file preview tests
  if (typeof global.URL.createObjectURL !== 'function') {
    global.URL.createObjectURL = () => '';
  }
});

describe('FarmerDashHeader Component', () => {
  it('renders header with title, count, and date button', () => {
    render(<FarmerDashHeader />);
    expect(screen.getByText('Farmer Dashboard')).toBeInTheDocument();
    expect(screen.getByText('0 crops in inventory')).toBeInTheDocument();
    expect(screen.getByText('March 25, 2025')).toBeInTheDocument();
  });

  it('opens add-crop dialog on button click', () => {
    render(<FarmerDashHeader />);
    const openDialogBtn = screen.getByRole('button', { name: /Add New Crop/i });
    fireEvent.click(openDialogBtn);
    expect(screen.getByLabelText('Crop Name')).toBeInTheDocument();
  });

  it('shows validation error for missing required fields', async () => {
    render(<FarmerDashHeader />);
    // Open the dialog
    fireEvent.click(screen.getByRole('button', { name: /Add New Crop/i }));
    // Grab the form element and disable native validation
    const form = document.querySelector('form');
    expect(form).toBeInTheDocument();
    form.noValidate = true;
    // Dispatch a submit event so our React handler runs
    fireEvent.submit(form);
    // Now our error message should appear
    expect(
      await screen.findByText(
        /Please fill in all required fields \(Name, Category, Price, Stock\)/
      )
    ).toBeInTheDocument();
  });

  it('submits form successfully and updates crop count', async () => {
    const newCrop = {
      _id: '123',
      name: 'Test Crop',
      category: 'TestCat',
      price: '10',
      stock: '5',
      supplier: 'SupplierX',
      harvestDate: '2025-05-01',
      expirationDate: '2025-06-01',
      image: 'img.png',
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(newCrop) })
    );

    render(<FarmerDashHeader />);
    fireEvent.click(screen.getByRole('button', { name: /Add New Crop/i }));

    fireEvent.change(screen.getByLabelText('Crop Name'), {
      target: { value: newCrop.name },
    });
    fireEvent.change(screen.getByLabelText('Category'), {
      target: { value: newCrop.category },
    });
    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: newCrop.price },
    });
    fireEvent.change(screen.getByLabelText('Stock (kg)'), {
      target: { value: newCrop.stock },
    });
    fireEvent.change(screen.getByLabelText('Supplier'), {
      target: { value: newCrop.supplier },
    });
    fireEvent.change(screen.getByLabelText('Harvest Date'), {
      target: { value: newCrop.harvestDate },
    });
    fireEvent.change(screen.getByLabelText('Expiration Date'), {
      target: { value: newCrop.expirationDate },
    });

    fireEvent.click(screen.getByRole('button', { name: /Add Crop/i }));

    // After successful submission, the header text should update
    expect(
      await screen.findByText('1 crops in inventory')
    ).toBeInTheDocument();
  });

  it('previews uploaded image file', () => {
    // Mock createObjectURL
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    render(<FarmerDashHeader />);
    fireEvent.click(screen.getByRole('button', { name: /Add New Crop/i }));

    const fileInput = screen.getByLabelText('Product Image');
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(screen.getByAltText('Preview')).toHaveAttribute('src', 'blob:test');
  });
});
