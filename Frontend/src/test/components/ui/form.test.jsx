import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider } from 'react-hook-form';

import { FormFieldContext, FormItemContext } from '../../../components/ui/form-context';
import {
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '../../../components/ui/form';

// Wrapper to inject react-hook-form context
const TestForm = ({ children }) => {
  const methods = useForm();
  return <FormProvider {...methods}>{children}</FormProvider>;
};

describe('Form Components', () => {
  const itemId = 'item123';
  const formItemId = `${itemId}-form-item`;
  const descId = `${itemId}-form-item-description`;
  const msgId = `${itemId}-form-item-message`;

  it('FormLabel renders with correct htmlFor', () => {
    render(
      <TestForm>
        <FormFieldContext.Provider value={{ name: 'field' }}>
          <FormItemContext.Provider value={{ id: itemId }}>
            <FormLabel>Label Text</FormLabel>
          </FormItemContext.Provider>
        </FormFieldContext.Provider>
      </TestForm>
    );
    const label = screen.getByText('Label Text');
    expect(label).toHaveAttribute('for', formItemId);
  });

  it('FormControl sets id and aria attributes correctly', () => {
    render(
      <TestForm>
        <FormFieldContext.Provider value={{ name: 'field' }}>
          <FormItemContext.Provider value={{ id: itemId }}>
            <FormControl>
              <input data-testid="input" />
            </FormControl>
          </FormItemContext.Provider>
        </FormFieldContext.Provider>
      </TestForm>
    );
    const input = screen.getByTestId('input');
    expect(input).toHaveAttribute('id', formItemId);
    expect(input).toHaveAttribute('aria-describedby', descId);
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('FormDescription displays description with correct id', () => {
    render(
      <TestForm>
        <FormFieldContext.Provider value={{ name: 'field' }}>
          <FormItemContext.Provider value={{ id: itemId }}>
            <FormDescription>Description here</FormDescription>
          </FormItemContext.Provider>
        </FormFieldContext.Provider>
      </TestForm>
    );
    const desc = screen.getByText('Description here');
    expect(desc).toHaveAttribute('id', descId);
  });

  it('FormMessage shows children and correct id when no error', () => {
    render(
      <TestForm>
        <FormFieldContext.Provider value={{ name: 'field' }}>
          <FormItemContext.Provider value={{ id: itemId }}>
            <FormMessage>Message text</FormMessage>
          </FormItemContext.Provider>
        </FormFieldContext.Provider>
      </TestForm>
    );
    const msg = screen.getByText('Message text');
    expect(msg).toHaveAttribute('id', msgId);
  });
});
