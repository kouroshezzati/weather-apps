// @ts-nocheck
import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WeatherForecastComponent from "./Weather";
import { useLocation } from "../../hooks/useLocation";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useLocation hook
vi.mock("../../hooks/useLocation", () => ({
  useLocation: vi.fn(),
}));

describe("WeatherForecastComponent", () => {
  const mockLocation = { lat: 51.5074, lon: -0.1278 };
  const mockWeatherData = {
    city: {
      name: "London",
      country: "GB",
      population: 1000000,
      coord: { lat: 51.5074, lon: -0.1278 },
      timezone: 3600,
    },
    list: [
      {
        dt: 1724857200,
        main: { temp: 14.05 },
        wind: {
          speed: 3.02,
          deg: 212,
          gust: 2.09,
        },
        clouds: {
          all: 3,
        },
        weather: [{ main: "Clouds", description: "broken clouds" }],
      },
      {
        dt: 1724878800,
        main: { temp: 14.91 },
        wind: {
          speed: 3.02,
          deg: 212,
          gust: 2.09,
        },
        clouds: {
          all: 3,
        },
        weather: [{ main: "Clear", description: "clear sky" }],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading state initially", () => {
    (useLocation as jest.Mock).mockReturnValue([null, {}]);
    render(<WeatherForecastComponent />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders location error when useLocation hook returns an error", () => {
    (useLocation as jest.Mock).mockReturnValue([
      "Location permission denied",
      null,
    ]);
    render(<WeatherForecastComponent />);
    expect(
      screen.getByText(/location error: location permission denied/i)
    ).toBeInTheDocument();
  });

  it("renders error message when API call fails", async () => {
    (useLocation as jest.Mock).mockReturnValue([null, mockLocation]);
    mockedAxios.get.mockRejectedValue(new Error("API Error"));

    render(<WeatherForecastComponent />);
    await waitFor(() =>
      expect(
        screen.getByText(/error in fetching forecasts/i)
      ).toBeInTheDocument()
    );
  });

  it("renders weather forecast data when API call is successful", async () => {
    (useLocation as jest.Mock).mockReturnValue([null, mockLocation]);
    mockedAxios.get.mockResolvedValue({ data: mockWeatherData });

    render(<WeatherForecastComponent />);
    await waitFor(() =>
      expect(
        screen.getByText(/weather forecast for london, gb/i)
      ).toBeInTheDocument()
    );
    expect(screen.getByText(/population: 1000000/i)).toBeInTheDocument();
    expect(
      screen.getByText(/coordinates: 51.5074, -0.1278/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/timezone: 3600/i)).toBeInTheDocument();
  });
});
