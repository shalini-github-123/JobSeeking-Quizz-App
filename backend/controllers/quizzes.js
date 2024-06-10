// controllers/quizzes.js
const Quiz = require('../models/Quiz');

const createQuiz = async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ recruiter: req.user._id });
    res.status(200).json(quizzes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// Get a quiz by ID
const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a quiz by ID
const updateQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizzes,
  getQuizById,
  updateQuizById,
};
