import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Radix Collapsible primitives for predictable behavior
vi.mock("@radix-ui/react-collapsible", () => {
  const React = require("react");
  return {
    __esModule: true,
    Root: React.forwardRef(({ open, onOpenChange, children, className, ...props }, ref) => {
      // Inject open and onOpenChange into children
      const enhancedChildren = React.Children.map(children, child =>
        React.isValidElement(child)
          ? React.cloneElement(child, { open, onOpenChange })
          : child
      );
      return (
        <div ref={ref} className={className} data-testid="collapsible-root" {...props}>
          {enhancedChildren}
        </div>
      );
    }),
    CollapsibleTrigger: React.forwardRef(({ children, open, onOpenChange, ...props }, ref) => (
      <button
        ref={ref}
        data-testid="collapsible-trigger"
        onClick={() => onOpenChange(!open)}
        {...props}
      >
        {children}
      </button>
    )),
    CollapsibleContent: React.forwardRef(({ children, open, ...props }, ref) =>
      open ? (
        <div ref={ref} data-testid="collapsible-content" {...props}>
          {children}
        </div>
      ) : null
    ),
  };
});

// Now import the wrapped components
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../../../src/components/ui/collapsible";

describe("<Collapsible> component", () => {
  it("toggles content visibility when trigger is clicked", () => {
    const Controlled = () => {
      const [open, setOpen] = React.useState(false);
      return (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Hidden Content</CollapsibleContent>
        </Collapsible>
      );
    };

    render(<Controlled />);
    // Initially content is hidden
    expect(screen.queryByTestId("collapsible-content")).toBeNull();
    // Click trigger
    fireEvent.click(screen.getByTestId("collapsible-trigger"));
    // Content should now be visible
    expect(screen.getByTestId("collapsible-content")).toHaveTextContent("Hidden Content");
    // Click again to hide
    fireEvent.click(screen.getByTestId("collapsible-trigger"));
    expect(screen.queryByTestId("collapsible-content")).toBeNull();
  });

  it("passes className and other props to root element", () => {
    render(
      <Collapsible open={false} onOpenChange={() => {}} className="extra-root" id="my-collapsible">
        <CollapsibleTrigger>Trigger</CollapsibleTrigger>
        <CollapsibleContent>Content</CollapsibleContent>
      </Collapsible>
    );
    const root = screen.getByTestId("collapsible-root");
    expect(root).toHaveClass("extra-root");
    expect(root).toHaveAttribute("id", "my-collapsible");
  });
});
