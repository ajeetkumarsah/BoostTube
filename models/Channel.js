const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  username: {
    type: String
  },
  image: {
    type: String
  },
  name: {
    type: String,
    required: [true, 'Please add a channel name'],
  },
  url: {
    type: String,
    required: [true, 'Please add a channel URL'],
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Channel', ChannelSchema);
