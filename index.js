const express = require('express');
const mongoose = require('mongoose');
const { resolve } = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3010;

// Middleware for static files and JSON parsing
app.use(express.static('static'));
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Database connection error:', err));

// MenuItem Schema
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  description: String,
  price: { type: Number, required: [true, 'Price is required'], min: 0 }
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// API Routes

// Home Route
app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// POST /menu - Create a new menu item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    if (!name || price == null) {
      return res.status(400).json({ message: 'Name and price are required.' });
    }

    const newMenuItem = new MenuItem({ name, description, price });
    await newMenuItem.save();

    res.status(201).json({ message: 'Menu item created successfully.', menuItem: newMenuItem });
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu item.', error: error.message });
  }
});

// GET /menu - Fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items.', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});