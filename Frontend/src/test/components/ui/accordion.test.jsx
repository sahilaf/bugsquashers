import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../../../components/ui/accordion';

vi.mock('../../../lib/utils', () => ({
  cn: vi.fn((...inputs) => inputs.filter(Boolean).flat().join(' ')),
}));


describe('Accordion Component', () => {

  const getContentPanelFromTrigger = (trigger) => {
     const contentId = trigger.getAttribute('aria-controls');
     if (!contentId) {
         throw new Error(`Trigger button "${trigger.textContent}" is missing the aria-controls attribute.`);
     }
     const contentElement = document.getElementById(contentId);
     if (!contentElement) {
         throw new Error(`Content element with ID "${contentId}" not found in the document.`);
     }
     return contentElement;
  };


  test('renders with all items initially collapsed by default', () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1 Trigger</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2 Trigger</AccordionTrigger>
          <AccordionContent>Item 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: /Item 1 Trigger/i });
    const trigger2 = screen.getByRole('button', { name: /Item 2 Trigger/i });

    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(trigger2).toHaveAttribute('aria-expanded', 'false');

    const content1Panel = getContentPanelFromTrigger(trigger1);
    const content2Panel = getContentPanelFromTrigger(trigger2);

    expect(content1Panel).toHaveAttribute('data-state', 'closed');
    expect(content2Panel).toHaveAttribute('data-state', 'closed');

    expect(screen.queryByText('Item 1 Content')).toBeNull();
    expect(screen.queryByText('Item 2 Content')).toBeNull();
  });


  test('expands content when a trigger is clicked', async () => {
    render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1 Trigger</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button', { name: /Item 1 Trigger/i });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Item 1 Content')).toBeNull();

    await fireEvent.click(trigger);

    const contentPanel = getContentPanelFromTrigger(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(contentPanel).toHaveAttribute('data-state', 'open');

    expect(screen.getByText('Item 1 Content')).toBeInTheDocument();
  });

  test('collapses content when an expanded trigger is clicked again', async () => {
    render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1 Trigger</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole('button', { name: /Item 1 Trigger/i });
    const contentPanel = getContentPanelFromTrigger(trigger);


    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(contentPanel).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('Item 1 Content')).toBeInTheDocument();


    await fireEvent.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(contentPanel).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByText('Item 1 Content')).toBeNull();
  });

  test('collapses previously expanded item when another trigger is clicked in single type', async () => {
    render(
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1 Trigger</AccordionTrigger>
          <AccordionContent>Item 1 Content</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item 2 Trigger</AccordionTrigger>
          <AccordionContent>Item 2 Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger1 = screen.getByRole('button', { name: /Item 1 Trigger/i });
    const content1Panel = getContentPanelFromTrigger(trigger1);
    const trigger2 = screen.getByRole('button', { name: /Item 2 Trigger/i });


    expect(trigger1).toHaveAttribute('aria-expanded', 'true');
    expect(content1Panel).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('Item 1 Content')).toBeInTheDocument();

    expect(trigger2).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('Item 2 Content')).toBeNull();


    await fireEvent.click(trigger2);

    const content2Panel = getContentPanelFromTrigger(trigger2);


    expect(trigger1).toHaveAttribute('aria-expanded', 'false');
    expect(content1Panel).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByText('Item 1 Content')).toBeNull();


    expect(trigger2).toHaveAttribute('aria-expanded', 'true');
    expect(content2Panel).toHaveAttribute('data-state', 'open');
    expect(screen.getByText('Item 2 Content')).toBeInTheDocument();
  });

  test('does not collapse other items when another trigger is clicked in multiple type', async () => {
     render(
       <Accordion type="multiple" defaultValue={["item-1"]}>
         <AccordionItem value="item-1">
           <AccordionTrigger>Item 1 Trigger</AccordionTrigger>
           <AccordionContent>Item 1 Content</AccordionContent>
         </AccordionItem>
         <AccordionItem value="item-2">
           <AccordionTrigger>Item 2 Trigger</AccordionTrigger>
           <AccordionContent>Item 2 Content</AccordionContent>
         </AccordionItem>
       </Accordion>
     );

     const trigger1 = screen.getByRole('button', { name: /Item 1 Trigger/i });
     const content1Panel = getContentPanelFromTrigger(trigger1);
     const trigger2 = screen.getByRole('button', { name: /Item 2 Trigger/i });


     expect(trigger1).toHaveAttribute('aria-expanded', 'true');
     expect(content1Panel).toHaveAttribute('data-state', 'open');
     expect(screen.getByText('Item 1 Content')).toBeInTheDocument();


     expect(trigger2).toHaveAttribute('aria-expanded', 'false');
     expect(screen.queryByText('Item 2 Content')).toBeNull();


     await fireEvent.click(trigger2);

    const content2Panel = getContentPanelFromTrigger(trigger2);


     expect(trigger1).toHaveAttribute('aria-expanded', 'true');
     expect(content1Panel).toHaveAttribute('data-state', 'open');
     expect(screen.getByText('Item 1 Content')).toBeInTheDocument();

     expect(trigger2).toHaveAttribute('aria-expanded', 'true');
     expect(content2Panel).toHaveAttribute('data-state', 'open');
     expect(screen.getByText('Item 2 Content')).toBeInTheDocument();
   });


  test('applies correct accessibility attributes', async () => {
      render(
           <Accordion type="single" collapsible>
             <AccordionItem value="item-1">
               <AccordionTrigger>Item 1 Trigger</AccordionTrigger>
               <AccordionContent>Item 1 Content</AccordionContent>
             </AccordionItem>
           </Accordion>
         );

      const trigger = screen.getByRole('button', { name: /Item 1 Trigger/i });

      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute('id');
      expect(trigger).toHaveAttribute('aria-expanded', 'false');


      await fireEvent.click(trigger);

      const contentPanel = getContentPanelFromTrigger(trigger);

      expect(trigger).toHaveAttribute('aria-expanded', 'true');
      expect(trigger).toHaveAttribute('aria-controls', contentPanel.getAttribute('id'));

      expect(contentPanel).toBeInTheDocument();
      expect(contentPanel).toHaveAttribute('role', 'region');
      expect(contentPanel).toHaveAttribute('id');
      expect(contentPanel).toHaveAttribute('aria-labelledby', trigger.getAttribute('id'));
      expect(contentPanel).toHaveAttribute('data-state', 'open');

      expect(screen.getByText('Item 1 Content')).toBeInTheDocument();

      await fireEvent.click(trigger);
      expect(trigger).toHaveAttribute('aria-expanded', 'false');
      expect(contentPanel).toHaveAttribute('data-state', 'closed');
      expect(screen.queryByText('Item 1 Content')).toBeNull();
  });

});