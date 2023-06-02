import React, { useState, useEffect, useRef } from "react";

import "./App.css";

function SearchBar({ location, setLocation, fetchWeather }) {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      fetchWeather();
    }
  };

  return (
    <div className="weather_search">
      <label htmlFor="location-input"></label>
      <input
        className="mInput"
        type="text"
        id="location-input"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="mButton" onClick={fetchWeather}>Search</button>
      
    </div>
  );
}

function changeBackgroundImage(weatherCondition) {
  // Get a collection of elements with the specified class name
  var elements = document.getElementsByClassName('content-container');

  // Check if any elements with the class name exist
  if (elements.length === 0) {
    console.error("No elements found with class name 'myElement'.");
    return;
  }

  // Iterate over the elements and change the background image accordingly
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    if (weatherCondition === 'Sunny') {
      element.style.backgroundImage = "url('https://media.giphy.com/media/0Styincf6K2tvfjb5Q/giphy.gif')";
    } else if (weatherCondition === 'Partly cloudy') {
      element.style.backgroundImage = "url('https://media.giphy.com/media/0Styincf6K2tvfjb5Q/giphy.gif')";
    } else if (weatherCondition === 'cloudy') {
      element.style.backgroundImage = "url('path/to/cloudy-image.jpg')";
    }
    // Add more conditions for other weather conditions as needed
  }
}


function CurrentWeather({ weatherData }) {
  return (
    <div className="content-1">
      <h2>{weatherData.current.location.name}</h2>
      <h1>{Math.round(weatherData.current.current.temp_c)}°C</h1>
      <h3>{changeBackgroundImage(weatherData.current.current.condition.text)}</h3>
      <h4>
      { Math.round(weatherData.forecast.forecast.forecastday[0].day.mintemp_c)}°C{" - "}
      { Math.round(weatherData.forecast.forecast.forecastday[0].day.maxtemp_c)}°C
      </h4>
    </div>
  );
}

function HourlyWeather({ weatherData }) {
  const scrollContainerRef = useRef(null);
  const currentHour = new Date().getHours();

  const handleScroll = (event) => {
    const scrollContainer = scrollContainerRef.current;
    const scrollDistance = 200;

    if (scrollContainer && scrollContainer.matches(":hover")) {
      event.preventDefault();
      scrollContainer.scrollLeft += event.deltaX * scrollDistance;
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      scrollContainer.onwheel = handleScroll;
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.onwheel = null;
      }
    };
  }, []);

  return (
    <div className="weather_hourly">
      {/* This renders hourly data for a given day */}
      <div className="content-scroll" ref={scrollContainerRef}>
        {weatherData.forecast.forecast.forecastday[0].hour.map((hour, index) => {
          const hourIndex = (currentHour + index) % 24;
          const formattedHour = hourIndex.toString().padStart(2, "0") + ":00";

          return (
            <div className="content-2" key={hour.time}>
              <h2>{formattedHour}</h2>
              <img className="weather-icon" src={hour.condition.icon} alt="" />
              <h4>{Math.round(hour.temp_c)}°</h4>
            </div>
            
          );
        })}
      </div>
    </div>
  );
}

function getTempColor(minTemp, maxTemp) {
  if (maxTemp >= 35) {
    return "gradient-red";
  } else if (maxTemp >= 30) {
    return "gradient-orange";
  } else if (maxTemp >= 25) {
    return "gradient-yellow";
  } else if (maxTemp >= 20) {
    return "gradient-green";
  } else {
    return "gradient-lightblue";
  }
}


function DailyWeather({ weatherData }) {
  return (
    <div className="weather_daily">
      <ul>
        {weatherData.forecast.forecast.forecastday.map((day) => (
          <li key={day.date} className="weather_daily_card">
            <div className="day">
              {new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
                new Date(day.date)
              )}
            </div>
            <div className="info">
              <h3>{day.day.condition.text}</h3>
              <img src={getConditionIcon(day.day.condition.text)} alt="{day.day.condition.icon}" />
            </div>
            <div className="temp">
              <h2>{Math.round(day.day.mintemp_c)}°C</h2>
              <div className={`temp-bar ${getTempColor(day.day.mintemp_c, day.day.maxtemp_c)}`}></div>
              <h2>{Math.round(day.day.maxtemp_c)}°C</h2>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getConditionIcon(txt){
  switch(txt){
    case "Sunny":
      return "/images-x/sun.gif";
    case "Patchy rain possible":
      return "/images-x/rain.gif";
    case "Cloudy":
      return "/images-x/rain-cloud.gif";
    case "Partly cloudy":
      return "/images-x/partly-cloudy-day.gif";
    case "Overcast":
      return "/images-x/rain-cloud.gif";
    case "Moderate rain":
      return "/images-x/rainfall.gif";
    case "Heavy rain":
      return "/images-x/heavy-rain.gif";
    case "Moderate or heavy snow showers":
      return "/images-x/snow-storm.gif";
    case "Moderate or heavy sleet":
      return "/images-x/sleet.png";
    case "Light snow":
      return "/images-x/light-snow.gif";
    case "Fog":
      return "/images-x/fog.gif";
    case "Light freezing rain":
      return "/images-x/hail.png";
    default:
      return "";}
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
      location = "auto:ip";
    }

    const { apiKey, apiUrl } = WEATHER_API_CONFIG;
    const currentApiCall = `${apiUrl}current.json?key=${apiKey}&q=${location}&aqi=no`;
    const forecastApiCall = `${apiUrl}forecast.json?key=${apiKey}&q=${location}&days=10&aqi=no&alerts=no`;

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
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

  useEffect(() => {
    fetchWeather();
  }, []);

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

