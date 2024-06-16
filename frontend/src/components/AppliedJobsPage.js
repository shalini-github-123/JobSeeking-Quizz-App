import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobCard from './JobCard';
import { useAuthContext } from '../hooks/useAuthContext';

const AppliedJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const fetchAppliedJobs = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/jobs/applied', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log('Applied Jobs Data:', response.data); // Debug: Log the data
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching applied jobs:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='job-list-page'>
      <h1 className='heading'>Jobs Applied</h1>
      {jobs.map(job => (
        <JobCard key={job._id} job={job} showDetailsButton={false} />
      ))}
    </div>
  );
};

export default AppliedJobsPage;
