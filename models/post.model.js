const mongoose = require('mongoose');
const PostFeedback = require("./post.feedback.model");
const Schema = mongoose.Schema;

const postSchema = new Schema({

  title: {
    type: String,
    required: false,
    trim: true
  },

  author_id: {
    type: mongoose.Types.ObjectId,
    required: true
  },

  date: {
    type: Date
  },

  description: {
    type: String,
    required: false,
    trim: true
  },

  post_privacy_type: {
    type: Boolean,
    required: false,
  },

  username: {
    type: String,
    required: false,
  },

  display_photo_url: {
    type: String,
    required: false,
  },

  cover_photo_url: {
    type: String,
    required: false,
  },
  
  pursuit_category: {
    type: String,
    required: false,
    trim: true
  },

  post_format: {
    type: String,
    required: true,
  },

  is_milestone: {
    type: Boolean,
    required: false,
  },

  is_paginated: {
    type: Boolean,
    required: false
  },
  
  text_data: {
    type: String,
    required: false
  },

  paginated_text_data: {
    type: [String],
    required: false
  },

  image_data: {
    array: [String],
    required:  false,
  },
  
  min_duration: {
    type: Number,
    required: false
  },

  feedback: {
    type: PostFeedback.Schema
  }

}, {
  timestamps: true,
});

const postModel = mongoose.model('post', postSchema);

module.exports = {
  Schema: postSchema,
  Model: postModel
};