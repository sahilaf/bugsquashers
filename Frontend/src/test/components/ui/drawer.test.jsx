import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '../../../components/ui/drawer';

describe('Drawer Component', () => {
  it('renders trigger and hides content by default', () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test Title</DrawerTitle>
            <DrawerDescription>Test Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    // Trigger visible, content hidden
    expect(screen.getByText(/open drawer/i)).toBeInTheDocument();
    expect(screen.queryByText(/test title/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/test description/i)).not.toBeInTheDocument();
  });

  it('opens the drawer when trigger is clicked', async () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test Title</DrawerTitle>
            <DrawerDescription>Test Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    userEvent.click(screen.getByText(/open drawer/i));

    // Content should now appear
    expect(await screen.findByText(/test title/i)).toBeInTheDocument();
    expect(screen.getByText(/test description/i)).toBeInTheDocument();
  });

  it('closes the drawer when close button is clicked', async () => {
    render(
      <Drawer>
        <DrawerTrigger>Open Drawer</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Test Title</DrawerTitle>
            <DrawerDescription>Test Description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>Close</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    // Open
    userEvent.click(screen.getByText(/open drawer/i));
    expect(await screen.findByText(/test title/i)).toBeInTheDocument();

    // Close
    userEvent.click(screen.getByText(/close/i));
    await waitFor(() => {
      expect(screen.queryByText(/test title/i)).not.toBeInTheDocument();
    });
  });
});
