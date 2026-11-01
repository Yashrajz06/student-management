const express = require('express');
const mongoose = require('mongoose');
const Student = require('../models/Student');

const router = express.Router();

function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid student ID' });
  }
  next();
}

function studentPayload(body) {
  return {
    name: body.name,
    email: body.email,
    course: body.course,
    year: body.year === '' || body.year == null ? undefined : Number(body.year)
  };
}


// CREATE: POST /api/students
router.post('/', async (req, res, next) => {
  try {
    const student = await Student.create(studentPayload(req.body));
    res.status(201).json({ success: true, message: 'Student created successfully', data: student });
  } catch (error) { next(error); }
});

// READ ALL: GET /api/students
router.get('/', async (req, res, next) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (error) { next(error); }
});

// READ ONE: GET /api/students/:id
router.get('/:id', validateId, async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, data: student });
  } catch (error) { next(error); }
});

// UPDATE: PUT /api/students/:id
router.put('/:id', validateId, async (req, res, next) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: studentPayload(req.body) },
      { new: true, runValidators: true, context: 'query' }
    );
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student updated successfully', data: student });
  } catch (error) { next(error); }
});

// DELETE: DELETE /api/students/:id
router.delete('/:id', validateId, async (req, res, next) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, message: 'Student deleted successfully', data: student });
  } catch (error) { next(error); }
});

module.exports = router;
