import React from 'react';
import { render } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useFormField } from '../../../src/hooks/use-form-field';
import { FormFieldContext, FormItemContext } from '../../../src/components/ui/form-context';
import { useFormContext } from 'react-hook-form';

// Mock react-hook-form's useFormContext
vi.mock('react-hook-form', () => ({ useFormContext: vi.fn() }));
const mockUseFormContext = useFormContext;

describe('useFormField hook', () => {
  const mockGetFieldState = vi.fn();
  const mockFormState = { touched: {}, dirty: {} };

  beforeEach(() => {
    mockUseFormContext.mockImplementation(() => ({
      getFieldState: mockGetFieldState,
      formState: mockFormState,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('throws if used outside of FormFieldContext', () => {
    const TestComponent = () => { useFormField(); return null; };

    // Explicitly provide FormFieldContext with null to trigger the throw
    const wrapper = ({ children }) =>
      React.createElement(
        FormFieldContext.Provider,
        { value: null },
        React.createElement(
          FormItemContext.Provider,
          { value: { id: 'item-1' } },
          children
        )
      );

    expect(() =>
      render(
        React.createElement(TestComponent),
        { wrapper }
      )
    ).toThrowError('useFormField must be used within a <FormField>');
  });

  it('returns correct ids and field state when contexts exist', () => {
    const fieldContextValue = { name: 'username' };
    const itemContextValue  = { id: 'field-1' };
    const fakeState         = { invalid: false, isTouched: true, error: undefined };

    mockGetFieldState.mockReturnValue(fakeState);

    let result;
    const TestComponent = () => { result = useFormField(); return null; };

    const wrapper = ({ children }) =>
      React.createElement(
        FormFieldContext.Provider,
        { value: fieldContextValue },
        React.createElement(
          FormItemContext.Provider,
          { value: itemContextValue },
          children
        )
      );

    render(
      React.createElement(TestComponent),
      { wrapper }
    );

    expect(mockGetFieldState).toHaveBeenCalledWith('username', mockFormState);
    expect(result).toEqual({
      id: 'field-1',
      name: 'username',
      formItemId: 'field-1-form-item',
      formDescriptionId: 'field-1-form-item-description',
      formMessageId: 'field-1-form-item-message',
      ...fakeState,
    });
  });
});
