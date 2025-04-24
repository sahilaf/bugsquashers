import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Radix Checkbox primitives
vi.mock("@radix-ui/react-checkbox", () => ({
  __esModule: true,
  Root: React.forwardRef(({ className, checked, disabled, onCheckedChange, children, ...props }, ref) => (
    <div
      ref={ref}
      role="checkbox"
      aria-checked={checked ? "true" : "false"}
      aria-disabled={disabled ? "true" : "false"}
      className={className}
      onClick={() => !disabled && onCheckedChange && onCheckedChange(!checked)}
      {...props}
    >
      {children}
    </div>
  )),
  Indicator: React.forwardRef(({ className, ...props }, ref) => (
    <span ref={ref} className={className} {...props} data-testid="checkbox-indicator" />
  )),
}));

import { Checkbox } from "../../../../src/components/ui/checkbox";

describe("Checkbox component", () => {
  it("renders unchecked by default", () => {
    render(<Checkbox data-testid="cb" checked={false} onCheckedChange={() => {}} />);
    const cb = screen.getByTestId("cb");
    expect(cb).toBeInTheDocument();
    expect(cb).toHaveAttribute("role", "checkbox");
    expect(cb).toHaveAttribute("aria-checked", "false");
    // Indicator should always be present
    expect(screen.getByTestId("checkbox-indicator")).toBeInTheDocument();
  });

  it("renders checked when prop checked=true", () => {
    render(<Checkbox data-testid="cb2" checked={true} onCheckedChange={() => {}} />);
    const cb = screen.getByTestId("cb2");
    expect(cb).toHaveAttribute("aria-checked", "true");
  });

  it("calls onCheckedChange with toggled value on click", () => {
    const onChange = vi.fn();
    render(<Checkbox data-testid="cb3" checked={false} onCheckedChange={onChange} />);
    const cb = screen.getByTestId("cb3");
    fireEvent.click(cb);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("does not call onCheckedChange when disabled", () => {
    const onChange = vi.fn();
    render(<Checkbox data-testid="cb4" checked={false} onCheckedChange={onChange} disabled />);
    const cb = screen.getByTestId("cb4");
    expect(cb).toHaveAttribute("aria-disabled", "true");
    fireEvent.click(cb);
    expect(onChange).not.toHaveBeenCalled();
  });
});
