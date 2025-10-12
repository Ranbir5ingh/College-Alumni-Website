// models/GalleryPhoto.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
    index: true,
  },
  title: {
    type: String,
    default: '',
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
    unique: true,
  },
  thumbnail: {
    type: String,
    default: null,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  metadata: {
    width: Number,
    height: Number,
    size: Number,
    format: String,
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
  }],
  position: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

photoSchema.index({ album: 1, position: 1 });
photoSchema.index({ uploadedBy: 1, createdAt: -1 });

module.exports = mongoose.model('GalleryPhoto', photoSchema);