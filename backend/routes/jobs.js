const express = require('express');
const router = express.Router();
const { createJob, getJobs, applyForJob, startQuiz, getAppliedJobs,getSelectedJobs,upload, getJobDetails, downloadResume, PostedJobs} = require('../controllers/jobs');
const { createQuiz, viewQuizResults} = require('../controllers/quizzes')
const requireAuth = require('../middleware/requireAuth');
const multer = require('multer');



router.get('/applied', requireAuth(['JobSeeker']), getAppliedJobs);
router.get('/selected', requireAuth(['JobSeeker']), getSelectedJobs);
// router.get('/not-applied', requireAuth(['JobSeeker']), getNotAppliedJobs);
router.get('/', getJobs);
router.get('/posted-jobs',requireAuth(['Recruiter']), PostedJobs);
// Routes for applying for jobs
router.post('/apply', requireAuth(['JobSeeker']), upload.single('resume'), applyForJob);
// Routes for job operations
router.post('/', requireAuth(['Recruiter']), createJob);



router.get('/:jobId',requireAuth(['Recruiter']), getJobDetails);

// Routes for managing quizzes
router.post('/:jobId/quiz', requireAuth(['Recruiter']), createQuiz);
router.get('/:jobId/quiz/results', requireAuth(['Recruiter']), viewQuizResults);

// Route for starting a quiz
router.get('/:jobId/quiz/start', requireAuth(['JobSeeker']), startQuiz);

// Route for downloading resume
router.get('/:jobId/resume/:applicantId', requireAuth(['Recruiter']), downloadResume);





module.exports = router;
