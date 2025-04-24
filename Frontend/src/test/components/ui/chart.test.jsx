import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Recharts primitives
vi.mock("recharts", () => ({
  __esModule: true,
  ResponsiveContainer: ({ children }) => <div data-testid="responsive">{children}</div>,
  Tooltip: () => null,
  Legend: () => null,
}));

import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent,
  ChartStyle,
} from "../../../../src/components/ui/chart";

const sampleConfig = {
  series1: { label: "Series One", color: "#abc" },
  series2: { theme: { light: "#000", dark: "#fff" } },
};

const payloadSingle = [
  { dataKey: "series1", value: 123, name: "series1", payload: {} },
];
const payloadMultiple = [
  { dataKey: "series1", value: 1, color: "#123" },
  { dataKey: "series2", value: 2, color: "#456" },
];

describe("ChartContainer & ChartStyle", () => {
  it("renders style tag when config has colors/themes", () => {
    render(
      <ChartContainer id="mychart" config={sampleConfig}>
        <div>Child</div>
      </ChartContainer>
    );
    const style = document.querySelector("style");
    expect(style).toBeInTheDocument();
    expect(style.innerHTML).toContain("--color-series1: #abc;");
    expect(style.innerHTML).toContain("--color-series2: #000;");
  });

  it("does not render style tag when config is empty", () => {
    render(
      <ChartContainer id="empty" config={{}}>
        <div>Empty</div>
      </ChartContainer>
    );
    expect(document.querySelector("style")).toBeNull();
  });

  it("provides context to children and renders inside ResponsiveContainer", () => {
    render(
      <ChartContainer id="ctx" config={sampleConfig}>
        <span data-testid="inner">Inner</span>
      </ChartContainer>
    );

    expect(screen.getByTestId("responsive")).toBeInTheDocument();
    expect(screen.getByTestId("inner")).toBeInTheDocument();
  });
});

describe("ChartTooltipContent", () => {
  it("throws when used outside ChartContainer context", () => {
    expect(() =>
      render(<ChartTooltipContent active payload={payloadSingle} />)
    ).toThrow("useChart must be used within a <ChartContainer />");
  });

  it("returns null when inactive or payload empty", () => {
    render(
      <ChartContainer id="ctx2" config={sampleConfig}>
        <ChartTooltipContent active={false} payload={[]} />
      </ChartContainer>
    );
    expect(screen.queryByText("Series One")).toBeNull();
    expect(screen.queryByText("123")).toBeNull();
  });

  it("renders tooltip content with label and value when active", () => {
    render(
      <ChartContainer id="ctx3" config={sampleConfig}>
        <ChartTooltipContent active payload={payloadSingle} />
      </ChartContainer>
    );
    // Should display two instances of the label (heading and item)
    const labels = screen.getAllByText("Series One");
    expect(labels).toHaveLength(2);
    // Should display formatted value once
    expect(screen.getByText("123")).toBeInTheDocument();
  });
});

describe("ChartLegendContent", () => {
  it("returns null when no payload", () => {
    render(
      <ChartContainer id="ctx4" config={sampleConfig}>
        <ChartLegendContent payload={[]} />
      </ChartContainer>
    );
    expect(screen.queryByText(/Series/)).toBeNull();
  });

  it("renders legend items for payload", () => {
    render(
      <ChartContainer id="ctx5" config={sampleConfig}>
        <ChartLegendContent payload={payloadMultiple} />
      </ChartContainer>
    );
    // Should render one labeled item
    expect(screen.getByText("Series One")).toBeInTheDocument();
    // Should render two color indicator blocks
    const blocks = document.querySelectorAll('div[style*="background-color"]');
    expect(blocks).toHaveLength(2);
  });
});
