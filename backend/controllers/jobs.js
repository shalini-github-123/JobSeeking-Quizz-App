const Job = require('../models/Job');
const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Application = require('../models/Application');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });



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


const applyForJob = async (req, res) => {
  const { userId, jobId } = req.body;

  try {
    // Check if req.file is defined
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
      
    }
    console.log(req.file);
    const resume = req.file.path;
    console.log('Resume path:', resume);
    

    const user = await User.findById(userId);
    const job = await Job.findById(jobId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (user.appliedJobs.includes(jobId)) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create application with resume path
    const application = new Application({
      applicant: userId,
      job: jobId,
      resume: resume // Ensure 'resume' field is correctly set
    });

    await application.save();

    user.appliedJobs.push(jobId);
    job.applicants.push(userId);
    await user.save();
    await job.save();

    return res.status(200).json({ message: 'Job application successful' });
  } catch (error) {
    console.error('Error applying for job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};



const startQuiz = async (req, res) => {
  const { jobId } = req.params;
  try {
    const job = await Job.findById(jobId).populate('quiz');
    if (!job.quiz) {
      return res.status(404).json({ error: 'No quiz found for this job' });
    }
    res.status(200).json(job.quiz);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

const PostedJobs = async (req, res) => {
  const recruiterId = req.user._id; // Assuming authenticated recruiter's ID is available in req.user
  
  try {
    // Retrieve jobs posted by the recruiter
    const jobs = await Job.find({ recruiter: recruiterId });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch jobs applied by user
const getAppliedJobs = async (req, res) => {
  const userId = req.user._id; // Assuming authenticated user ID is available in req.user
  console.log(req.user);

  try {
    const user = await User.findById(userId).populate('appliedJobs').exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const appliedJobs = user.appliedJobs;
    console.log(appliedJobs);
    res.status(200).json(appliedJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch jobs selected for user
const getSelectedJobs = async (req, res) => {
  const userId = req.user._id; // Assuming authenticated user ID is available in req.user

  try {
    const user = await User.findById(userId).populate('selectedJobs').exec();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const selectedJobs = user.selectedJobs;
    res.status(200).json(selectedJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobDetails = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId).populate('applicants');
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const applicants = await User.find({ _id: { $in: job.applicants } });
    res.status(200).json({ job, applicants });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadResume = async (req, res) => {
  const { jobId, applicantId } = req.params;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const application = await Application.findOne({ job: jobId, applicant: applicantId });
    if (!application) {
      return res.status(404).json({ error: 'Application not found for this job and applicant' });
    }

    // Check if the authenticated recruiter has access to download resume
    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Construct the path to the resume file
    const resumePath = path.join(__dirname, `../uploads/${application.resume}`);

    // Check if the resume file exists
    if (!fs.existsSync(resumePath)) {
      return res.status(404).json({ error: 'Resume file not found' });
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${application.resume}`);
    res.setHeader('Content-Type', 'application/pdf'); // Adjust content type based on your file type

    // Stream the file to the client
    const fileStream = fs.createReadStream(resumePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


module.exports = {
  createJob,
  getJobs,
  applyForJob,
  startQuiz,
  getAppliedJobs,
  getSelectedJobs,
  upload,
  getJobDetails,
  downloadResume,
  PostedJobs // Ensure upload middleware is still exported
};
