// controllers/jobs.js
const Job = require('../models/Job');
const Quiz = require('../models/Quiz');
// const Application = require('../models/Application');

const createJob = async (req, res) => {
  try {
    // Create a new job
    const job = new Job({
      recruiter: req.user._id, // Assuming req.user contains the authenticated recruiter's information
      ...req.body // Assuming req.body contains job details
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    // Retrieve all jobs
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const viewApplications = async (req, res) => {
//   try {
//     // Retrieve applications for a specific job
//     const applications = await Application.find({ job: req.params.jobId }).populate('applicant');
//     res.status(200).json(applications);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const createQuiz = async (req, res) => {
  try {
    // Create a new quiz for the job
    const quiz = new Quiz(req.body);
    await quiz.save();

    // Associate the quiz with the job
    const job = await Job.findById(req.params.jobId);
    job.quiz = quiz._id;
    await job.save();

    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const viewQuizResults = async (req, res) => {
  try {
    // Retrieve quiz results for the job
    const job = await Job.findById(req.params.jobId).populate('quiz');
    if (!job.quiz) {
      return res.status(404).json({ error: 'Quiz not found for this job' });
    }
    res.status(200).json(job.quiz.results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = {createJob, getJobs, createQuiz, viewQuizResults};