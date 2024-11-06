const express = require("express");
const router = express.Router();
const axios = require("axios");
const dotenv = require('dotenv');

dotenv.config();

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;

router.post("/plan", async (req, res) => {
  const { country, city, days } = req.body;

  if (!country || !city || !days) {
    return res
      .status(400)
      .json({ error: "Country, city, and number of days are required" });
  }

  try {
    console.log("Received request:", req.body);
    const tripPlan = await generateTripPlan(country, city, days);
    res.json(tripPlan);
  } catch (error) {
    console.error("Error generating trip plan:", error.message);
    res.status(500).json({ error: "Error generating trip plan" });
  }
});

async function generateTripPlan(country, city, days) {
  const prompt = `Plan a trip to ${city}, ${country} for ${days} days.`;
  const gptResponse = await axios.post(
    "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B",
    { inputs: prompt },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
      },
    }
  );

  console.log("Hugging Face API response:", gptResponse.data);

  if (!gptResponse.data || gptResponse.data.length === 0) {
    throw new Error("Unexpected response from Hugging Face API");
  }

  const googleMapsResponseTourist = await axios.get(
    "https://maps.googleapis.com/maps/api/place/textsearch/json",
    {
      params: {
        query: `top tourist attractions in ${city}, ${country}`,
        key: GOOGLE_MAPS_API_KEY,
      },
    }
  );

  console.log("Google Maps API response (Tourist):", googleMapsResponseTourist.data);

  if (!googleMapsResponseTourist.data || !googleMapsResponseTourist.data.results || googleMapsResponseTourist.data.results.length === 0) {
    throw new Error("Unexpected response from Google Maps API for tourist attractions");
  }

  const location = googleMapsResponseTourist.data.results[0].geometry.location;
  const googleMapsResponseRestaurants = await axios.get(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: 5000,
        type: 'restaurant',
        key: GOOGLE_MAPS_API_KEY,
      },
    }
  );

  console.log("Google Maps API response (Restaurants):", googleMapsResponseRestaurants.data);

  if (!googleMapsResponseRestaurants.data || !googleMapsResponseRestaurants.data.results || googleMapsResponseRestaurants.data.results.length === 0) {
    throw new Error("Unexpected response from Google Maps API for restaurants");
  }

  const googleMapsResponseHotels = await axios.get(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
    {
      params: {
        location: `${location.lat},${location.lng}`,
        radius: 5000,
        type: 'lodging',
        key: GOOGLE_MAPS_API_KEY,
      },
    }
  );

  console.log("Google Maps API response (Hotels):", googleMapsResponseHotels.data);

  if (!googleMapsResponseHotels.data || !googleMapsResponseHotels.data.results || googleMapsResponseHotels.data.results.length === 0) {
    throw new Error("Unexpected response from Google Maps API for hotels");
  }

  const tripPlan = {
    prompt,
    plan: gptResponse.data[0].generated_text.trim(),
    touristPlaces: googleMapsResponseTourist.data.results.slice(0, 5).map((place) => ({
      name: place.name,
      image: place.photos && place.photos.length > 0 ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}` : null,
    })),
    restaurants: googleMapsResponseRestaurants.data.results.slice(0, 5).map((place) => ({
      name: place.name,
      image: place.photos && place.photos.length > 0 ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}` : null,
    })),
    hotels: googleMapsResponseHotels.data.results.slice(0, 5).map((place) => ({
      name: place.name,
      image: place.photos && place.photos.length > 0 ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_MAPS_API_KEY}` : null,
    })),
  };

  console.log("Generated trip plan:", tripPlan);

  return tripPlan;
}

module.exports = router;
