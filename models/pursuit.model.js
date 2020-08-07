const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pursuitSchema = new Schema({
  name: {
    type: String,
    required: false,
    trim: true

  },

  private: {
    type: Boolean,
    required: true,
  },

  experience_level: {
    type: String,
    required: false,
    trim: true
  },

  total_min: {
    type: Number,
    required: false,
  },
  num_posts: {
    type: Number,
    required: false
  },

  num_milestones: {
    type: Number,
    required: false
  }

}, {
  timestamps: true,
});

const pursuitModel = mongoose.model('pursuit', pursuitSchema);

module.exports = {
  Schema: pursuitSchema,
  Model: pursuitModel
};