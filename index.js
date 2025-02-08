// const express = require('express');
// const { resolve } = require('path');

// const app = express();
// const port = 3010;

// app.use(express.static('static'));

// app.get('/', (req, res) => {
//   res.sendFile(resolve(__dirname, 'pages/index.html'));
// });

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });
// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");

// dotenv.config();
// const app = express();
// app.use(express.json()); // Middleware to parse JSON

// const PORT = process.env.PORT || 3000;

// // Connect to MongoDB Atlas
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// // Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(cors()); // Enable CORS for frontend access

const PORT = process.env.PORT || 3000;

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 📌 Define MenuItem Schema
const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
});

const MenuItem = mongoose.model("MenuItem", MenuItemSchema);

// 📌 POST /menu - Add a new menu item
app.post("/menu", async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Validation: Name and Price are required
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required." });
    }

    const newItem = new MenuItem({ name, description, price });
    await newItem.save();
    res.status(201).json({ message: "Menu item added successfully!", item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 GET /menu - Fetch all menu items
app.get("/menu", async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Default Route
app.get("/", (req, res) => {
  res.send("🍽️ Welcome to the Restaurant API! 🚀");
});

// ✅ Start the Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

