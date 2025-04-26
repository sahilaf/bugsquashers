import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Button } from "../../../../src/components/ui/button";

describe("Button component", () => {
  it("renders default button with base, default variant, and default size classes", () => {
    render(<Button data-testid="btn">Click me</Button>);
    const btn = screen.getByTestId("btn");
    expect(btn).toBeInTheDocument();
    expect(btn.tagName).toBe("BUTTON");
    expect(btn).toHaveTextContent("Click me");
    // Base classes
    expect(btn).toHaveClass("inline-flex");
    expect(btn).toHaveClass("items-center");
    expect(btn).toHaveClass("gap-2");
    expect(btn).toHaveClass("rounded-full");
    expect(btn).toHaveClass("text-sm");
    // Default variant classes include shadow-md
    expect(btn).toHaveClass("bg-primary");
    expect(btn).toHaveClass("text-primary-foreground");
    expect(btn).toHaveClass("shadow-md");
    // Default size classes
    expect(btn).toHaveClass("h-9");
    expect(btn).toHaveClass("px-4");
    expect(btn).toHaveClass("py-2");
  });

  it("applies destructive variant and lg size classes", () => {
    render(
      <Button variant="destructive" size="lg" data-testid="btn2">
        Delete
      </Button>
    );
    const btn = screen.getByTestId("btn2");
    expect(btn).toHaveClass("bg-destructive");
    expect(btn).toHaveClass("text-destructive-foreground");
    // destructive variant also includes shadow-md
    expect(btn).toHaveClass("shadow-md");
    expect(btn).toHaveClass("h-10");
    expect(btn).toHaveClass("px-8");
  });

  it("applies outline variant and sm size classes", () => {
    render(
      <Button variant="outline" size="sm" data-testid="btn3">
        Outline
      </Button>
    );
    const btn = screen.getByTestId("btn3");
    expect(btn).toHaveClass("text-muted-foreground");
    expect(btn).toHaveClass("border");
    expect(btn).toHaveClass("h-8");
    expect(btn).toHaveClass("px-3");
    expect(btn).toHaveClass("text-xs");
  });

  it("honors additional className prop", () => {
    render(
      <Button className="custom-class" data-testid="custom-btn">
        Custom
      </Button>
    );
    const btn = screen.getByTestId("custom-btn");
    expect(btn).toHaveClass("custom-class");
  });

  it("renders asChild, passing classes onto the child element with ghost variant classes", () => {
    render(
      <Button asChild variant="ghost" data-testid="btn4">
        <a href="/home" data-testid="link">Home</a>
      </Button>
    );
    const link = screen.getByTestId("link");
    expect(link.tagName).toBe("A");
    // It should have inherited base classes and ghost variant hover states
    expect(link).toHaveClass("inline-flex");
    expect(link).toHaveClass("hover:bg-accent");
    expect(link).toHaveClass("hover:text-accent-foreground");
    // and default size classes
    expect(link).toHaveClass("h-9");
    expect(link).toHaveClass("px-4");
    expect(link).toHaveClass("py-2");
  });
});
