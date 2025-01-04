const mongoose = require('mongoose');
const bcrypt = require('bcrypt');  // Import bcrypt

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password before saving to the database
userSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) return next(); // Only hash if the password is modified
    const saltRounds = 10; // Adjust salt rounds for security
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model('User', userSchema);