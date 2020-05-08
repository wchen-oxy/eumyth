const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
   
  },
  password: {
    type: String,
    required:  true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    minlength: 1
  },
  lastName: {
    type: String,
    required: true,
    minlength: 1
  },

}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;