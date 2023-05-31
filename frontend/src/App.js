import React, { useState } from "react";
import "./App.css";

function App() {
  const [location, setLocation] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = () => {
    if (location.trim() === "") {
      alert("Please enter a location");
      return "auto:ip";
    }
  
    const apiKey = "5a9d2c05e78649dba29133051232905";
    const apiUrl = `http://api.weatherapi.com/v1/`;
  
    const currentApiCall = apiUrl + `current.json?key=${apiKey}&q=${location}&aqi=no`;
    const forecastApiCall = apiUrl + `forecast.json?key=${apiKey}&q=${location}&days=10&aqi=no&alerts=no`;
  
    Promise.all([fetch(currentApiCall), fetch(forecastApiCall)])
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then(([currentData, forecastData]) =>
        setWeatherData({ current: currentData, forecast: forecastData })
      )
      .catch((error) => {
        console.log("Error fetching weather data:", error);
      });
  };
  

  return (
    <div className="content-container">

      {/* Search Bar, move to seperate nav bar */}
      <div className="weather_search">
        <label htmlFor="location-input"></label>
        <input
          type="text"
          id="location-input"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
        <button onClick={fetchWeather}>Get Weather</button>
      </div>

      {weatherData && (
        <div>
          <div className="content-1">
            <h2>{weatherData.current.location.name}</h2>
            <h1>{weatherData.current.current.temp_c}°C</h1>
            <h3>{weatherData.current.current.condition.text}</h3>
            <h4>
              {weatherData.forecast.forecast.forecastday[0].day.maxtemp_c}°C {weatherData.forecast.forecast.forecastday[0].day.mintemp_c}°C
            </h4>
          </div>
        {/* Render 10-day weather summary here */}
        {/* Get the current weather data block */}
          <div className="weather_hourly">
            <div className="content-2">
              <h2>{weatherData.current.location.localtime.substring(11, 16)}</h2>
              <img
                className="weather-icon"
                src={weatherData.current.current.condition.icon}
                alt="uhhhhh"
              />
              <h4>{weatherData.current.current.temp_c}°</h4>
            </div>

            {weatherData && (
              <div className="weather_hourly">
                {/* This renders hourly data for a given day */}
                <div className="content-scroll">
                {weatherData.forecast.forecast.forecastday[0].hour.map((hour) => (
                  <div className="content-2" key={hour.time}>
                    <h2>{hour.time.substring(11, 16)}</h2>
                    <img
                      className="weather-icon"
                      src={hour.condition.icon}
                      alt=""
                    />
                    <h4>{hour.temp_c}°</h4>
                  </div>
                ))}
                </div>
              </div>
            )}

            {/* Render additional hourly weather data here */}
          </div>

          <div className="weather_day">
            <div className="content-3">
              <h2>Location</h2>
              <h1>Temp °</h1>
              <h3>Conditions</h3>
              <h4>high° low°</h4>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
