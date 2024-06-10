const express = require('express');
const router = express.Router();
const { createQuiz, getQuizzes, getQuizById, updateQuizById } = require('../controllers/quizzes');
const requireAuth = require('../middleware/requireAuth');

router.post('/', requireAuth(['Recruiter']), createQuiz);
router.get('/', requireAuth(['Recruiter']), getQuizzes);
router.get('/:id', requireAuth(['Recruiter']), getQuizById); // New route for fetching a specific quiz
router.put('/:id', requireAuth(['Recruiter']), updateQuizById); // New route for updating a specific quiz

module.exports = router;
