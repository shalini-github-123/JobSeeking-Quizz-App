import React, { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from "../hooks/useAuthContext";
import "./JobCard.css";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job, showDetailsButton = false, applicationDetails = null }) => {
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  const navigate = useNavigate();

  const [showDetails, setShowDetails] = useState(false);
  const [resume, setResume] = useState(null);
  const { user } = useAuthContext();

  const handleApply = async () => {
    if (!resume) {
      alert('Please upload your resume');
      return;
    }
  
    const formData = new FormData();
    formData.append('userId', user._id); // Assuming user.id is available in your auth context
    formData.append('jobId', job._id);
    formData.append('resume', resume);
  
    console.log({
      userId: formData.get('userId'),
      jobId: formData.get('jobId'),
      resume: formData.get('resume')
    });
  
    try {
      const response = await axios.post('http://localhost:4000/api/jobs/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`, // Include the JWT token here
        },
      });
      alert('Job application successful');

      navigate("/jobs");
      // Optionally handle further logic after successful application
    } catch (error) {
      alert('Error applying for job: ' + error.message);
    }
  };
  
  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
  };

  return (
    <div className="job-card">
      <h2>{job.role}</h2>
      <p><strong>Office:</strong> {job.officeName}</p>
      <p><strong>Location:</strong> {job.location}</p>
      <p><strong>Salary:</strong> {job.salary}</p>
      <div className="details">
        <p><strong>Mode of Work:</strong> {job.modeOfWork}</p>
        <p><strong>Minimum Duration:</strong> {job.minimumDuration} months</p>
      </div>
      {showDetailsButton && (
        <button className="apply-btn" onClick={toggleDetails}>
          {showDetails ? 'Hide Details' : 'Show Details'}
        </button>
      )}
      {showDetails && (
        <div>
          <label htmlFor="resume-upload">Upload Resume:</label>
          <input type="file" id="resume-upload" onChange={handleResumeChange} />
          <button onClick={handleApply} className='apply-btn'>Apply Job</button>
        </div>
      )}
      {!showDetailsButton && (
        <div className="application-details">
          {applicationDetails ? (
            <>
              <p><strong>Resume:</strong> {applicationDetails.resume}</p>
              <p><strong>Applied At:</strong> {new Date(applicationDetails.appliedAt).toLocaleString()}</p>
            </>
          ) : (
            <p>No additional details available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default JobCard;
