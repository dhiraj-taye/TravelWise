// backend/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const tripRoutes = require('./routes/tripRoutes');


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
const connectDB = async () => {

  mongoose.connection.on("connected", () => console.log("Database Connected"));
  
  await mongoose.connect(`${process.env.MONGODB_URL}`);
};


// Middleware
app.use(express.json());
app.use(cors());
connectDB();


// Routes
app.use("/api/trip", tripRoutes);

app.get("/", (req, res) => {
  res.send("API working");
});

app.listen(PORT, () => console.log("server started", PORT));