import React from 'react';
import "./JobCard.css"

const JobCard = ({ job }) => {
  return (
    <div className="job-card">
      <h2>{job.role}</h2>
      <p><strong>Salary:</strong> {job.salary}</p>
      <p><strong>Office:</strong> {job.officeName}</p>
      <p><strong>Location:</strong> {job.location}</p>
      {/* Add more job details as needed */}
      <div className="details">
        <p>{job.modeOfWork}</p>
        <button className="apply-btn">Apply</button>
      </div>
    </div>
  );
};

export default JobCard;
