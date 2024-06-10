// routes/jobs.js
const express = require('express');
const router = express.Router();
const { createJob, getJobs, createQuiz, viewQuizResults } = require('../controllers/jobs');
const requireAuth = require('../middleware/requireAuth')

// Routes for job operations
router.post('/', requireAuth(['Recruiter']),  createJob);
router.get('/', getJobs);

// Routes for managing applications
// router.get('/:jobId/applications',  viewApplications);

// Routes for managing quizzes
router.post('/:jobId/quiz', requireAuth(['Recruiter']), createQuiz);
router.get('/:jobId/quiz/results', requireAuth(['Recruiter']),  viewQuizResults);

module.exports = router;
