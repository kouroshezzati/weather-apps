import "./App.css";
import WeatherForecastComponent from "./components/weather/Weather";

function App() {
  return (
    <>
      <h1>Weather</h1>
      <div className="card">
        <WeatherForecastComponent />
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
