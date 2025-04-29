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
    // Freeze date so component logic is stable
    vi.setSystemTime(new Date("2025-04-30"));

    // Stub fetch to return our mockOrders
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve(mockOrders),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading indicator initially", () => {
    render(<StatisticsDashboard />);
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });

  it("renders all dashboard sections, three sales bars, and crop names after fetch", async () => {
    render(<StatisticsDashboard />);

    // 1️⃣ Wait for loading to disappear
    await waitFor(() => {
      expect(screen.queryByText(/loading\.\.\./i)).toBeNull();
    });

    // 2️⃣ Check section headers
    expect(screen.getByText(/Monthly Sales/i)).toBeInTheDocument();
    expect(screen.getByText(/Crop Distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Customer Demographics/i)).toBeInTheDocument();

    // 3️⃣ There should be exactly 3 dollar‐amounts (the 3 monthly bars)
    // loosened to match anywhere in the text
    const amounts = screen.getAllByText(/\$\d+/);
    expect(amounts).toHaveLength(3);

    // 4️⃣ Crop names in distribution
    expect(screen.getByText("Wheat")).toBeInTheDocument();
    expect(screen.getByText("Corn")).toBeInTheDocument();
  });
});
