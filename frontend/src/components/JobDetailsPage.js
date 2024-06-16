import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";
import "./JobDetailsPage.css";

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const { user } = useAuthContext();

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setJob(response.data.job);
      setApplicants(response.data.applicants);
    } catch (error) {
      console.error('Error fetching job details:', error.response ? error.response.data : error.message);
    }
  };

  const downloadResume = async (applicantId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/jobs/${jobId}/resume/${applicantId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: 'blob' // Ensure response type is blob to handle file download
      });
  
      // Check if response is a JSON error object
      if (response.data instanceof Blob) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `resume_${applicantId}.pdf`); // Adjust filename as needed
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      } else {
        console.error('Unexpected response:', response.data);
        // Handle unexpected responses (e.g., server returning error JSON instead of blob)
        // Display an appropriate error message to the user
      }
    } catch (error) {
      console.error('Error downloading resume:', error.message);
      // Handle network errors or other exceptions
      // Display an appropriate error message to the user
    }
  };
  

  return (
    <div className="job-details-page">
      {job ? (
        <>
          <h1>{job.role}</h1>
          <p><strong>Office:</strong> {job.officeName}</p>
          <p><strong>Location:</strong> {job.location}</p>
          <p><strong>Salary:</strong> {job.salary}</p>
          <p><strong>Mode of Work:</strong> {job.modeOfWork}</p>
          <p><strong>Minimum Duration:</strong> {job.minimumDuration} months</p>
          <h2>Applicants</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Resume</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(applicant => (
                <tr key={applicant._id}>
                  <td>{applicant.name}</td>
                  <td>{applicant.email}</td>
                  <td>
                    <button onClick={() => downloadResume(applicant._id)}>Download Resume</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <p>Loading job details...</p>
      )}
    </div>
  );
};

export default JobDetailsPage;
