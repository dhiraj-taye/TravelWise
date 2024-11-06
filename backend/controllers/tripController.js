// backend/controllers/tripController.js
const axios = require('axios');
const { ChatGPT } = require('@openai/chatgpt');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const chatGPTKey = process.env.OPENAI_API_KEY;

const chatGPT = new ChatGPT({
  apiKey: chatGPTKey,
});

// Generate trip plan based on input
const planTrip = async (req, res) => {
  const { country, city, days } = req.body;

  // Validate input
  if (!country || !city || !days) {
    return res.status(400).json({ error: 'Country, city, and number of days are required' });
  }

  try {
    // Call ChatGPT to generate trip plan
    const prompt = `Plan a trip to ${city}, ${country} for ${days} days.`;
    const response = await chatGPT.complete({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    // Example: Use Google Maps API to fetch places in the city
    const placeResponse = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(city)}&key=${GOOGLE_MAPS_API_KEY}`
    );

    const tripPlan = {
      prompt,
      plan: response.data.choices[0].message.content,
      places: placeResponse.data.results.slice(0, 5).map(place => place.name),
    };

    res.json(tripPlan);
  } catch (error) {
    console.error('Error generating trip plan:', error);
    res.status(500).json({ error: 'Error generating trip plan' });
  }
};

module.exports = {
  planTrip,
};
