// models/Quiz.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctOptionIndex: { type: [Number], required: true }
});

const QuizSchema = new Schema({
  name: { type: String, required: true },
  deadline: { type: Date, required: true },
  duration: { type: Number, required: true },
  questions: { type: [QuestionSchema], required: true }
});

module.exports = mongoose.model('Quiz', QuizSchema);
