const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must contain at least 2 characters'],
    maxlength: [80, 'Name cannot exceed 80 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    maxlength: [120, 'Email cannot exceed 120 characters'],
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
    unique: true
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true,
    minlength: [2, 'Course must contain at least 2 characters'],
    maxlength: [100, 'Course cannot exceed 100 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1, 'Year must be between 1 and 6'],
    max: [6, 'Year must be between 1 and 6'],
    validate: { validator: Number.isInteger, message: 'Year must be a whole number' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
