import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard'; // Assume JobCard component is defined
import "./JobListPage.css"

const JobListPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('https://jobseeking-quizz-app.onrender.com/api/jobs'); // Endpoint to fetch jobs
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='job-list-page'>
      <h1 className='heading'>Jobs</h1>
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobListPage;
