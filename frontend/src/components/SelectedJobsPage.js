// components/SelectedJobsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import { useAuthContext } from '../hooks/useAuthContext';

const SelectedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    fetchSelectedJobs();
  }, []);

  const fetchSelectedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/jobs/selected', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching selected jobs:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='job-list-page'>
      <h1 className='heading'>Jobs Selected</h1>
      {jobs.map(({ job, application }) => (
        <JobCard key={job._id} job={job} showDetailsButton={false} applicationDetails={application} />
      ))}
    </div>
  );
};

export default SelectedJobsPage;
