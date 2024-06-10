// controllers/questions.js
const Question = require('../models/Question');

const createQuestion = async (req, res) => {
  try {
    const { text, options, correctOptionIndex } = req.body;
    const question = new Question({ text, options, correctOptionIndex });
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {createQuestion};