// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const tripRoutes = require('./routes/tripRoutes');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const MONGO = process.env.MONGODB_URI

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGO, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  // useCreateIndex: true,
})
.then(() => {
  console.log('MongoDB connected');
})
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
  process.exit(1);
});

// Routes
app.use('/api/trip', tripRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
