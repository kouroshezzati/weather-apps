import "./style.css";
import { setup } from "./setup.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="card">
    <button id="loader" type="button">Load the weather app</button>
  </div>
  <p class="read-the-docs">
    <div id="weather-app-container"></div>
  </p>
  <p>
    <div id="cityInfoContainer"></div>
    <div id="forecastContainer"></div>
  </p>
`;

setup(document.querySelector<HTMLButtonElement>("#loader")!);
window.addEventListener(
  "message",
  (event) => {
    if (event.origin !== "http://localhost:5173") {
      return;
    }
    console.log(event.data);
    const cityContainer = document.getElementById("cityInfoContainer")!;
    const { city } = event.data;
    cityContainer.innerHTML = `
      <h1>Weather Forecast for ${city.name}, ${city.country}</h1>
      <p>Population: ${city.population}</p>
      <p>Coordinates: ${city.coord.lat}, ${city.coord.lon}</p>
      <p>Timezone: ${city.timezone}</p>
    `;
    displayWeather(event.data.list);
  },
  false
);

function displayWeather(data: any) {
  const container = document.getElementById("forecastContainer")!;
  container.innerHTML = '';
  data.forEach((item: any) => {
    const forecastDiv = document.createElement("div");
    forecastDiv.classList.add("forecast-item");

    // Convert Unix timestamp to readable date
    const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    forecastDiv.innerHTML = `
          <h3>${date}</h3>
          <img class="icon" src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
          <p><strong>Temperature:</strong> ${item.main.temp} °C (Feels like: ${item.main.feels_like} °C)</p>
          <p><strong>Weather:</strong> ${item.weather[0].main} - ${item.weather[0].description}</p>
          <p><strong>Wind:</strong> ${item.wind.speed} m/s, ${item.wind.deg}°</p>
          <p><strong>Humidity:</strong> ${item.main.humidity}%</p>
          <p><strong>Pressure:</strong> ${item.main.pressure} hPa</p>
          <p><strong>Cloudiness:</strong> ${item.clouds.all}%</p>
      `;

    container.appendChild(forecastDiv);
  });
}
