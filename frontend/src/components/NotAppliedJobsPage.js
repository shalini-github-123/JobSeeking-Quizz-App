// components/NotAppliedJobsPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import { useAuthContext } from "../hooks/useAuthContext";

const NotAppliedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuthContext();
  const userId = user._id;

  useEffect(() => {
    fetchNotAppliedJobs();
  }, []);

  const fetchNotAppliedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/jobs', {
        headers: { Authorization: `Bearer ${user.token}` }
      }); // Endpoint to fetch all jobs
      // Filter jobs where current user's appliedJobs array does not include job._id
      const filteredJobs = response.data.filter(job => !job.applicants.includes(userId));
      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching not applied jobs:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='job-list-page'>
      <h1 className='heading'>Jobs Not Applied</h1>
      {jobs.map(job => (
        <JobCard showDetailsButton={true} key={job._id} job={job} />
      ))}
    </div>
  );
};

export default NotAppliedJobsPage;
