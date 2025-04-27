import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../../../../src/components/ui/card";

describe("Card component family", () => {
  it("renders Card container with default classes and children", () => {
    render(
      <Card data-testid="card-container">Hello Card</Card>
    );
    const card = screen.getByTestId("card-container");
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent("Hello Card");
    // Default classes
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("bg-card");
    expect(card).toHaveClass("text-card-foreground");
    expect(card).toHaveClass("shadow");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("");
  });

  it("renders CardHeader with correct classes and custom className", () => {
    render(
      <CardHeader className="extra-header" data-testid="card-header">
        Header Content
      </CardHeader>
    );
    const header = screen.getByTestId("card-header");
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Header Content");
    expect(header).toHaveClass("flex");
    expect(header).toHaveClass("flex-col");
    expect(header).toHaveClass("space-y-1.5");
    expect(header).toHaveClass("p-6");
    expect(header).toHaveClass("extra-header");
  });

  it("renders CardTitle as <h3> with default and custom behavior", () => {
    // With children
    render(
      <CardTitle className="title-class" data-testid="card-title">
        Title Text
      </CardTitle>
    );
    const title = screen.getByTestId("card-title");
    expect(title.tagName).toBe("H3");
    expect(title).toHaveTextContent("Title Text");
    expect(title).toHaveClass("font-semibold");
    expect(title).toHaveClass("leading-none");
    expect(title).toHaveClass("tracking-tight");
    expect(title).toHaveClass("title-class");

    // Without children: should render a span for accessible empty content
    render(
      <CardTitle data-testid="card-title-empty" />
    );
    const emptyTitle = screen.getByTestId("card-title-empty");
    expect(emptyTitle).toContainHTML("<span aria-hidden=\"true\"> </span>");
  });

  it("renders CardDescription with correct classes and text", () => {
    render(
      <CardDescription className="desc-class" data-testid="card-desc">
        Description here
      </CardDescription>
    );
    const desc = screen.getByTestId("card-desc");
    expect(desc).toBeInTheDocument();
    expect(desc).toHaveTextContent("Description here");
    expect(desc).toHaveClass("text-sm");
    expect(desc).toHaveClass("text-muted-foreground");
    expect(desc).toHaveClass("desc-class");
  });

  it("renders CardContent and CardFooter with proper classes", () => {
    render(
      <>
        <CardContent className="content-class" data-testid="card-content">
          Content Section
        </CardContent>
        <CardFooter className="footer-class" data-testid="card-footer">
          Footer Section
        </CardFooter>
      </>
    );
    const content = screen.getByTestId("card-content");
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("Content Section");
    expect(content).toHaveClass("p-6");
    expect(content).toHaveClass("pt-0");
    expect(content).toHaveClass("content-class");

    const footer = screen.getByTestId("card-footer");
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent("Footer Section");
    expect(footer).toHaveClass("flex");
    expect(footer).toHaveClass("items-center");
    expect(footer).toHaveClass("p-6");
    expect(footer).toHaveClass("pt-0");
    expect(footer).toHaveClass("footer-class");
  });
});
