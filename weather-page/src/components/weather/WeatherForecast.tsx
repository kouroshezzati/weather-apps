import { ForecastItem } from "./types";
import styles from "./styles.module.css";

const WeatherForecasts = ({ list }: { list: ForecastItem[] }) => {
  return (
    <div className={styles.forecasts}>
      {list.map((forecast: ForecastItem) => (
        <div key={forecast.dt}>
          <img
            src={`https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`}
            alt={forecast.weather[0].description}
          />
          <h2>{new Date(forecast.dt * 1000).toLocaleString()}</h2>
          <p>
            Temperature: {forecast.main.temp}°C (Feels like:{" "}
            {forecast.main.feels_like}°C)
          </p>
          <p>Weather: {forecast.weather[0].description}</p>
          <p>Humidity: {forecast.main.humidity}%</p>
          <p>Wind Speed: {forecast.wind.speed} m/s</p>
          <p>Cloudiness: {forecast.clouds.all}%</p>
          <p>Visibility: {forecast.visibility} meters</p>
        </div>
      ))}
    </div>
  );
};

export default WeatherForecasts;
