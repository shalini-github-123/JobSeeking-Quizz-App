// components/JobListPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import { useNavigate } from 'react-router-dom';
import JobListNavbar from './JobListNavbar';
import { useAuthContext } from "../hooks/useAuthContext";
const JobListPage = ({ jobType }) => {
  const [jobs, setJobs] = useState([]);
  const navigate = useNavigate();
  const { user } = useAuthContext();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/jobs', {
        headers: { Authorization: `Bearer ${user.token}` }
      }); // Endpoint to fetch all jobs
      // Filter jobs where current user's appliedJobs array does not include job._id
      const filteredJobs = response.data.filter(job => (!job.applicants.includes(user._id) || job.applicants.includes(user._id)));
      setJobs(filteredJobs);
    } catch (error) {
      console.error('Error fetching not applied jobs:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='job-list-page'>
      <JobListNavbar />
      <h1 className='heading'>Jobs</h1>
      {jobs.map(job => (
        <JobCard key={job._id} job={job} />
      ))}
    </div>
  );
};

export default JobListPage;
