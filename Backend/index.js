import express from "express";
import cors from "cors";
import env from "dotenv";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 5000;
env.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const API_KEY = process.env.API_KEY;
const WEATHER_URL = process.env.WEATHER_URL;
const GEO_URL = process.env.GEO_URL;

app.post("/api/weather", async (req, res) => {
  const { city } = req.body;

  if (!city) {
    return res
      .status(400)
      .json({ error: "Please, type a city name." });
  }

  try {
    
    const geocodeResponse = await axios.get(GEO_URL, {
      params: {
        q: city,
        appid: API_KEY
      },
    });

    if (geocodeResponse.data.length === 0) {
      return res.status(404).json({ error: "City not found." });
    }
    console.log("Geocode API Response:", geocodeResponse.data);

  const { lat, lon } = geocodeResponse.data[0];

    
    const weatherResponse = await axios.get(WEATHER_URL, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: "metric",
        lang: "pt-br"
      },
    });

    res.json(weatherResponse.data); 
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error searching for weather", details: error.message });
  }
});

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server rodando em: http://localhost:${PORT}`);
});
