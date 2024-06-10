// models/Question.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctOptionIndex: [{ type: Number, required: true }]
});

module.exports = mongoose.model('Question', QuestionSchema);
