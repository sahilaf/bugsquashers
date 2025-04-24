import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "../../../../src/components/ui/alert";

describe("Alert", () => {
  it("renders with default styling, role, and children", () => {
    render(
      <Alert data-testid="alert">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>This is a default alert.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    // children
    expect(screen.getByText("Heads up!")).toBeInTheDocument();
    expect(screen.getByText("This is a default alert.")).toBeInTheDocument();
    // default variant classes
    expect(alert).toHaveClass("rounded-lg");
    expect(alert).toHaveClass("bg-background");
    expect(alert).toHaveClass("text-foreground");
  });

  it("applies the destructive variant classes", () => {
    render(
      <Alert variant="destructive" data-testid="alert-d">
        Destructive
      </Alert>
    );
    const destructive = screen.getByTestId("alert-d");
    expect(destructive).toHaveClass("border-destructive/50");
    expect(destructive).toHaveClass("text-destructive");
  });

  it("honors an extra className prop", () => {
    render(
      <Alert className="my-custom" data-testid="alert-custom">
        Custom
      </Alert>
    );
    expect(screen.getByTestId("alert-custom")).toHaveClass("my-custom");
  });
});

describe("AlertTitle and AlertDescription", () => {
  it("AlertTitle renders as an <h5> with proper classes", () => {
    render(<AlertTitle data-testid="title">Title Text</AlertTitle>);
    const title = screen.getByTestId("title");
    expect(title.tagName).toBe("H5");
    expect(title).toHaveClass("font-medium");
    expect(title).toHaveTextContent("Title Text");
  });

  it("AlertDescription renders a <div> with proper classes", () => {
    render(
      <AlertDescription data-testid="desc">
        <p>Paragraph text</p>
      </AlertDescription>
    );
    const desc = screen.getByTestId("desc");
    expect(desc.tagName).toBe("DIV");
    // ensure p inside has relaxed leading
    const p = screen.getByText("Paragraph text");
    expect(p).toBeInTheDocument();
  });
});
