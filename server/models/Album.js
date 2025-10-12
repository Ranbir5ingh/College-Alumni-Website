// models/Album.js
const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  category: {
    type: String,
    enum: ['convocation', 'reunion', 'events', 'campus_life', 'sports', 'cultural', 'academic', 'other'],
    default: 'other',
    index: true,
  },
  coverImage: {
    type: String,
    default: null,
  },
  photoCount: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true,
  },
  year: {
    type: Number,
    default: () => new Date().getFullYear(),
    index: true,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  metadata: {
    viewCount: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

albumSchema.index({ category: 1, year: 1, isPublished: 1 });
albumSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Album', albumSchema);

