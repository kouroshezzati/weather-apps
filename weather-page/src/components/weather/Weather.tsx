import { useState, useEffect } from "react";
import axios from "axios";
import { ForecastItem, WeatherForecastResponse } from "./types";
import { API_KEY } from "../../constants";
import WeatherForecast from "./WeatherForecast";
import { useLocation } from "../../hooks/useLocation";

const   WeatherForecastComponent: React.FC = () => {
  const [weatherData, setWeatherData] =
    useState<WeatherForecastResponse | null>(null);
  const [errorLoc, location] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location || !location.lat || !location.lon) return;
    (async () => {
      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/forecast`,
          {
            params: {
              lat: location.lat,
              lon: location.lon,
              units: "metric",
              appid: API_KEY,
            },
          }
        );
        const uniqueDates = new Set<number>();
        response.data.list = response.data.list
          .reduce((acc: ForecastItem[], item: ForecastItem) => {
            const date = new Date(item.dt * 1000).getDate();
            if (!uniqueDates.has(date)) {
              uniqueDates.add(date);
              acc.push(item);
            }
            return acc;
          }, [])
          .slice(0, 4);

        window.parent.postMessage(response.data, "*");
        setWeatherData(response.data);
      } catch (e) {
        console.log(e);
        setError("Error in fetching forecasts!");
      }
    })();
  }, [location]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (errorLoc) {
    return <div>Location Error: {errorLoc}</div>;
  }

  if (!weatherData) {
    return <p>Loading...</p>;
  }
  const { city } = weatherData;
  return (
    <div>
      <h1>
        Weather Forecast for {city.name}, {city.country}
      </h1>
      <p>Population: {city.population}</p>
      <p>
        Coordinates: {city.coord.lat}, {city.coord.lon}
      </p>
      <p>Timezone: {city.timezone}</p>
      <WeatherForecast list={weatherData.list} />
    </div>
  );
};
export default WeatherForecastComponent;
