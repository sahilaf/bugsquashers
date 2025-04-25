import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogOverlay,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from '../../../components/ui/dialog';

describe('Dialog Component', () => {
  it('renders trigger and does not render content by default', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription>Test description</DialogDescription>
        </DialogContent>
      </Dialog>
    );

    expect(screen.getByText(/open dialog/i)).toBeInTheDocument();
    expect(screen.queryByText(/test title/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/test description/i)).not.toBeInTheDocument();
  });

  it('opens the dialog when trigger is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription>Test description</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    userEvent.click(screen.getByText(/open dialog/i));

    expect(await screen.findByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/test title/i)).toBeInTheDocument();
    expect(screen.getByText(/test description/i)).toBeInTheDocument();
  });

  it('closes the dialog when close button is clicked', async () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Test Title</DialogTitle>
          <DialogDescription>Test description</DialogDescription>
          <DialogClose>Close</DialogClose>
        </DialogContent>
      </Dialog>
    );

    userEvent.click(screen.getByText(/open dialog/i));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();

    const closeButtons = screen.getAllByRole('button', { name: /close/i });
    userEvent.click(closeButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText(/test title/i)).not.toBeInTheDocument();
    });
  });
});
