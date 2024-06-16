// components/PostedJobsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from "../hooks/useAuthContext";
import JobCard from './JobCard';
import { useNavigate } from 'react-router-dom';

const PostedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  const fetchPostedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/jobs/posted-jobs', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching posted jobs:', error.response ? error.response.data : error.message);
    }
  };

  const handleJobDoubleClick = (jobId) => {
    navigate(`/jobs/posted/${jobId}`);
  };

  return (
    <div className='job-list-page'>
      <h1 className='heading'>Jobs Posted</h1>
      {jobs.map(job => (
        <div key={job._id} onDoubleClick={() => handleJobDoubleClick(job._id)}>
          <JobCard job={job} />
        </div>
      ))}
    </div>
  );
};

export default PostedJobsPage;
