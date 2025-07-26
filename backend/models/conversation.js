const mongoose = require('mongoose');

// Message schema (for both user and AI messages)
const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Conversation schema
const conversationSchema = new mongoose.Schema({
  user_id: { type: String, required: true },         // could be email or random ID
  conversation_id: { type: String, required: true }, // e.g. UUID or timestamp
  messages: [messageSchema]
});

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;