import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Badge } from "../../../../src/components/ui/badge";

describe("Badge component", () => {
  it("renders default variant with base and default styles", () => {
    render(<Badge data-testid="badge">Default</Badge>);
    const badge = screen.getByTestId("badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Default");
    // Base classes
    expect(badge).toHaveClass("inline-flex");
    expect(badge).toHaveClass("rounded-md");
    expect(badge).toHaveClass("border");
    expect(badge).toHaveClass("px-2.5");
    expect(badge).toHaveClass("py-0.5");
    expect(badge).toHaveClass("text-xs");
    expect(badge).toHaveClass("font-semibold");
    // Default variant classes
    expect(badge).toHaveClass("border-transparent");
    expect(badge).toHaveClass("bg-primary");
    expect(badge).toHaveClass("text-primary-foreground");
    expect(badge).toHaveClass("shadow");
  });

  it("applies secondary variant styles", () => {
    render(
      <Badge variant="secondary" data-testid="secondary-badge">
        Secondary
      </Badge>
    );
    const badge = screen.getByTestId("secondary-badge");
    expect(badge).toHaveClass("bg-secondary");
    expect(badge).toHaveClass("text-secondary-foreground");
    expect(badge).toHaveClass("border-transparent");
  });

  it("applies destructive variant styles", () => {
    render(
      <Badge variant="destructive" data-testid="destructive-badge">
        Destructive
      </Badge>
    );
    const badge = screen.getByTestId("destructive-badge");
    expect(badge).toHaveClass("bg-destructive");
    expect(badge).toHaveClass("text-destructive-foreground");
    expect(badge).toHaveClass("border-transparent");
    expect(badge).toHaveClass("shadow");
  });

  it("applies outline variant styles", () => {
    render(
      <Badge variant="outline" data-testid="outline-badge">
        Outline
      </Badge>
    );
    const badge = screen.getByTestId("outline-badge");
    // Outline variant only sets text color, relies on base border
    expect(badge).toHaveClass("text-foreground");
    expect(badge).toHaveClass("border");
  });

  it("honors additional className prop", () => {
    render(
      <Badge className="custom-class" data-testid="custom-badge">
        Custom
      </Badge>
    );
    const badge = screen.getByTestId("custom-badge");
    expect(badge).toHaveClass("custom-class");
  });
});
