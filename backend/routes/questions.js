// routes/questions.js
const express = require('express');
const router = express.Router();
const { createQuestion } = require('../controllers/questions');

// POST request to create a new question
router.post('/', createQuestion);

module.exports = router;
