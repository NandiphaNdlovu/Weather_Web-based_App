const express = require("express");
const path = require("path");

const app = express();
const port = 3000; // Choose an available port number

app.use(express.static(path.join(__dirname, "views")));


app.get("/weather", async (req, res) => {
  const apiKey = "5a9d2c05e78649dba29133051232905";
  const location = req.query.location;
  const fetch = await import("node-fetch");
  const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}&aqi=no`;

  try {
    const response = await fetch.default(apiUrl);
    const responseBody = await response.text();

    let jsonData;
    try {
      jsonData = JSON.parse(responseBody);
    } catch (parseError) {
      console.log("Error parsing JSON response:", parseError);
      console.log("Response Body:", responseBody);
      res.status(500).json({ error: "Failed to parse weather data" });
      return;
    }

    res.json(jsonData);
  } catch (error) {
    console.log("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "weather.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
