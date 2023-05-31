import React, { useState, useEffect } from "react";

import "./App.css";

function SearchBar({ location, setLocation, fetchWeather }) {
  return (
    <div className="weather_search">
      <label htmlFor="location-input"></label>
      <input
        className="mInput"
        type="text"
        id="location-input"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <button className="mButton" onClick={fetchWeather}>Search</button>
    </div>
  );
}

function CurrentWeather({ weatherData }) {
  return (
    <div className="content-1">
      <h2>{weatherData.current.location.name}</h2>
      <h1>{weatherData.current.current.temp_c}°C</h1>
      <h3>{weatherData.current.current.condition.text}</h3>
      <h4>
        {weatherData.forecast.forecast.forecastday[0].day.maxtemp_c}°C{" "}
        {weatherData.forecast.forecast.forecastday[0].day.mintemp_c}°C
      </h4>
    </div>
  );
}

function HourlyWeather({ weatherData }) {
  const handleScroll = (event) => {
    const scrollElement = event.target;
    const scrollDistance = 600;
  
    if (scrollElement) {
      scrollElement.scrollLeft += event.deltaX * scrollDistance;
    }
  };
  

  const attachEventListeners = () => {
    const scrollElement = document.querySelector(".content-scroll");
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    }
  };
  
  

  useEffect(() => {
    attachEventListeners();
  
    return () => {
      const scrollElement = document.querySelector(".content-scroll");
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  

  return (
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
  );
}


function DailyWeather({ weatherData }) {
  return (
    <div className="weather_daily">
      <ul>
        {weatherData.forecast.forecast.forecastday.map((day) => (
          <li key={day.date}>
            <div className="day">
              {new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(
                new Date(day.date)
              )}
            </div>
            <div className="info">
              <h1>{day.day.condition.text}</h1>
              <h2>
                {day.day.mintemp_c}°C - {day.day.maxtemp_c}°C
              </h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}



function App() {
  var [location, setLocation] = useState("");
  var [weatherData, setWeatherData] = useState(null);

  const WEATHER_API_CONFIG = {
    apiKey: "5a9d2c05e78649dba29133051232905",
    apiUrl: "http://api.weatherapi.com/v1/",
  };

  const fetchWeather = async () => {
    if (location.trim() === "") {
      alert("Please enter a location");
      location = "auto:ip";
    }

    const { apiKey, apiUrl } = WEATHER_API_CONFIG;
    const currentApiCall = `${apiUrl}current.json?key=${apiKey}&q=${location}&aqi=no`;
    const forecastApiCall = `${apiUrl}forecast.json?key=${apiKey}&q=${location}&days=10&aqi=no&alerts=no`;

    try { const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentApiCall),
      fetch(forecastApiCall),
    ]);

    const [currentData, forecastData] = await Promise.all([
      currentResponse.json(),
      forecastResponse.json(),
    ]);

    setWeatherData({ current: currentData, forecast: forecastData });
  } catch (error) {
    console.log("Error fetching weather data:", error);
  }
};

return (
  <div className="content-container">
    <SearchBar
      location={location}
      setLocation={setLocation}
      fetchWeather={fetchWeather}
    />

    {weatherData && (
      <div>
        <CurrentWeather weatherData={weatherData} />
        <HourlyWeather weatherData={weatherData} />
        <DailyWeather weatherData={weatherData} />
      </div>
    )}
  </div>
);
}

export default App;

