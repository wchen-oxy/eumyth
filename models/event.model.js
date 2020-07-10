const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  subtitle: {
    type: String,
    trim: true
  },

  type: {
    type: String,
    required: true,
  },

  cover: {
    type: mongoose.Types.ObjectId,
    required: false,
  },
  
  postDataRef: {
    type: mongoose.Types.ObjectId,
    required: false
  },
  durationHour: {
    type: Number,
    required: false
  },
  durationMin: {
    type: Number,
    required: false
  },
}, {
  timestamps: true,
});

const eventModel = mongoose.model('Event', eventSchema);

module.exports = {
  Schema: eventSchema,
  Model: eventModel
};