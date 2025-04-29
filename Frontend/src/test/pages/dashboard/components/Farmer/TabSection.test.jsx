import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TabSection from "../../../../../pages/dashboard/components/Farmer/TabSection";

// Mock each child dashboard under src/pages/dashboard/components/Farmer
vi.mock(
  "../../../../../pages/dashboard/components/Farmer/OrdersDashboard",
  () => ({
    default: () => <div>Mock OrdersDashboard</div>,
  })
);
vi.mock(
  "../../../../../pages/dashboard/components/Farmer/CropsDashboard",
  () => ({
    default: ({ crops }) => (
      <div>Mock CropsDashboard (received {crops.length} crops)</div>
    ),
  })
);
vi.mock(
  "../../../../../pages/dashboard/components/Farmer/ReviewsDashboard",
  () => ({
    default: () => <div>Mock ReviewsDashboard</div>,
  })
);
vi.mock(
  "../../../../../pages/dashboard/components/Farmer/StatisticsDashboard",
  () => ({
    default: () => <div>Mock StatisticsDashboard</div>,
  })
);

describe("TabSection (Farmer)", () => {
  it("renders OrdersDashboard by default", () => {
    render(<TabSection />);
    expect(screen.getByText("Mock OrdersDashboard")).toBeInTheDocument();
  });

  it("switches to CropsDashboard when Crops tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TabSection />);

    await user.click(screen.getByRole("tab", { name: /Crops/i }));
    expect(
      screen.getByText("Mock CropsDashboard (received 0 crops)")
    ).toBeInTheDocument();
  });

  it("switches to ReviewsDashboard when Reviews tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TabSection />);

    await user.click(screen.getByRole("tab", { name: /Reviews/i }));
    expect(screen.getByText("Mock ReviewsDashboard")).toBeInTheDocument();
  });

  it("switches to StatisticsDashboard when Statistics tab is clicked", async () => {
    const user = userEvent.setup();
    render(<TabSection />);

    await user.click(screen.getByRole("tab", { name: /Statistics/i }));
    expect(screen.getByText("Mock StatisticsDashboard")).toBeInTheDocument();
  });

  it("allows toggling back to OrdersDashboard", async () => {
    const user = userEvent.setup();
    render(<TabSection />);

    // Navigate away first
    await user.click(screen.getByRole("tab", { name: /Statistics/i }));
    expect(screen.getByText("Mock StatisticsDashboard")).toBeInTheDocument();

    // Then back to Orders
    await user.click(screen.getByRole("tab", { name: /Orders/i }));
    expect(screen.getByText("Mock OrdersDashboard")).toBeInTheDocument();
  });
});
