const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.OPENWEATHERMAP_API_KEY;
const apiEndpoint = process.env.OPENWEATHERMAP_ENDPOINT;

if (!apiKey || !apiEndpoint) {
  console.error('API key or endpoint not found in environment variables.');
  process.exit(1);
}

// Define a route for the API endpoint
app.get('/weather', async (req, res) => {
  const { lat, lon, time } = req.query;

  if (!lat || !lon || !time) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Make request to OpenWeatherMap API
    const response = await axios.get(`${apiEndpoint}?lat=${lat}&lon=${lon}&dt=${time}&appid=${apiKey}`);

    // Extract relevant information from the response
    const weatherData = response.data;
    const weather = {
      temperature: weatherData.main.temp,
      description: weatherData.weather[0].description,
    };

    // Send the weather data as JSON response
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather data:', error.response.data);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
