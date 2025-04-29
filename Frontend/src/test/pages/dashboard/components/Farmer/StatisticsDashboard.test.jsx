import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatisticsDashboard from "../../../../../pages/dashboard/components/Farmer/StatisticsDashboard";

describe("StatisticsDashboard", () => {
  beforeEach(() => {
    // Freeze date so component logic is stable
    vi.setSystemTime(new Date("2025-04-30"));

    // Stub fetch so component can mount without errors
    vi.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve([]),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows loading indicator initially", () => {
    render(<StatisticsDashboard />);
    expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument();
  });
});
