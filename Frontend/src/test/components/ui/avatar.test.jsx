import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Radix Avatar primitives to bypass context requirements
vi.mock("@radix-ui/react-avatar", () => ({
  __esModule: true,
  Root: React.forwardRef(({ className, children, ...props }, ref) => (
    <span ref={ref} className={className} {...props}>
      {children}
    </span>
  )),
  Image: React.forwardRef(({ className, ...props }, ref) => (
    <img ref={ref} className={className} {...props} />
  )),
  Fallback: React.forwardRef(({ className, children, ...props }, ref) => (
    <span ref={ref} className={className} {...props}>
      {children}
    </span>
  )),
}));

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../../../../src/components/ui/avatar";

describe("Avatar component family", () => {
  it("renders Avatar container with AvatarFallback child", () => {
    render(
      <Avatar data-testid="avatar-container">
        <AvatarFallback data-testid="avatar-fallback">AB</AvatarFallback>
      </Avatar>
    );

    const container = screen.getByTestId("avatar-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("relative");
    expect(container).toHaveClass("rounded-full");

    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent("AB");
    expect(fallback).toHaveClass("items-center");
  });

  it("renders AvatarImage inside Avatar with correct src, alt, and classes", () => {
    render(
      <Avatar data-testid="avatar-with-image">
        <AvatarImage
          data-testid="avatar-image"
          src="/test-image.png"
          alt="Test image"
        />
      </Avatar>
    );

    const img = screen.getByTestId("avatar-image");
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "/test-image.png");
    expect(img).toHaveAttribute("alt", "Test image");
    expect(img).toHaveClass("h-full");
    expect(img).toHaveClass("w-full");
  });

  it("honors additional className prop on all Avatar components", () => {
    render(
      <Avatar className="extra-avatar" data-testid="avatar-extra">
        <AvatarImage
          className="extra-image"
          data-testid="image-extra"
          src="/img.png"
          alt="Extra"
        />
        <AvatarFallback
          className="extra-fallback"
          data-testid="fallback-extra"
        >
          EF
        </AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId("avatar-extra")).toHaveClass("extra-avatar");
    expect(screen.getByTestId("image-extra")).toHaveClass("extra-image");
    expect(screen.getByTestId("fallback-extra")).toHaveClass("extra-fallback");
  });
});
