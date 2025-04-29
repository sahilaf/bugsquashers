import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatisticsDashboard from "../../../../../pages/dashboard/components/Farmer/StatisticsDashboard";

// Mock orders data
const mockOrders = [
  { price: "100", crop: "Wheat", date: "2025-04-01" },
  { price: "250", crop: "Wheat", date: "2025-03-15" },
  { price: "0",   crop: "Corn",  date: "2025-02-20" },
];

describe("StatisticsDashboard", () => {
  beforeEach(() => {
    // Freeze the date so month labels are predictable
    vi.setSystemTime(new Date("2025-04-30"));

    // Stub fetch to resolve with our mockOrders
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve(mockOrders),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading indicator initially", () => {
    render(<StatisticsDashboard />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders all dashboard sections and month labels after fetch", async () => {
    render(<StatisticsDashboard />);

    // wait for "Loading..." to go away
    await waitFor(() => {
      expect(screen.queryByText(/loading.../i)).toBeNull();
    });

    // 1. Section headers
    expect(screen.getByText(/Monthly Sales/i)).toBeInTheDocument();
    expect(screen.getByText(/Crop Distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Demographics/i)).toBeInTheDocument();

    // 2. Month labels for the last 3 months (Apr, Mar, Feb)
    ["Apr", "Mar", "Feb"].forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });

    // 3. Crops in distribution
    expect(screen.getByText("Wheat")).toBeInTheDocument();
    expect(screen.getByText("Corn")).toBeInTheDocument();
  });
});
