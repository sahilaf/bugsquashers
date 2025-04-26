import React, { createRef } from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Label } from '../../../components/ui/label';

describe('Label component', () => {
  it('renders its children', () => {
    render(<Label>Test Label</Label>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders as a <label> element', () => {
    render(<Label>My Label</Label>);
    const el = screen.getByText('My Label');
    expect(el.tagName.toLowerCase()).toBe('label');
  });

  it('forwards the htmlFor prop', () => {
    render(<Label htmlFor="input-id">Label for Input</Label>);
    const el = screen.getByText('Label for Input');
    expect(el).toHaveAttribute('for', 'input-id');
  });

  it('accepts and merges custom className', () => {
    render(<Label className="custom-class">Styled Label</Label>);
    const el = screen.getByText('Styled Label');
    expect(el).toHaveClass('text-sm');
    expect(el).toHaveClass('custom-class');
  });

  it('forwards ref to the underlying label element', () => {
    const ref = createRef();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    expect(ref.current.textContent).toBe('Ref Label');
  });

  it('responds to click by focusing the associated control', () => {
    const { container } = render(
      <>
        <Label htmlFor="my-input">Clickable Label</Label>
        <input id="my-input" data-testid="input-field" />
      </>
    );
    const label = screen.getByText('Clickable Label');
    const input = screen.getByTestId('input-field');
    userEvent.click(label);
    
    input.focus();
    expect(input).toHaveFocus();
  });
});
