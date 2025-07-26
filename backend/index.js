const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/chatbotDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Mongoose Schemas (Milestone 3)
const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  conversation_id: { type: String, required: true },
  messages: [messageSchema]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Dummy Data Loading (Milestone 2)
const products = require('./ecommerce-dataset/products.json');
const orders = require('./ecommerce-dataset/orders.json');



// Milestone 2: Product-related endpoints
app.get('/top-products', (req, res) => {
  const sorted = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  res.json(sorted);
});

app.get('/order-status/:id', (req, res) => {
  const order = orders.find(o => o.id == req.params.id);
  res.json(order || { error: 'Order not found' });
});

app.get('/stock/:name', (req, res) => {
  const product = products.find(p => p.name.toLowerCase().includes(req.params.name.toLowerCase()));
  res.json(product ? { name: product.name, stock: product.stock } : { error: 'Product not found' });
});

// Milestone 3: Chat API with MongoDB
app.post('/api/chat', async (req, res) => {
  const { message, conversation_id, user_id } = req.body;

  try {
    // Save user message
    await Conversation.findOneAndUpdate(
      { conversation_id, user_id },
      { $push: { messages: { sender: 'user', text: message } } },
      { new: true, upsert: true }
    );

    const aiReply = `You said: ${message}`;


    // Save AI message
    await Conversation.findOneAndUpdate(
      { conversation_id, user_id },
      { $push: { messages: { sender: 'ai', text: aiReply } } }
    );

    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
