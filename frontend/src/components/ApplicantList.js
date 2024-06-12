import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApplicantList = ({ jobId }) => {
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const response = await axios.get(`https://jobseeking-quizz-app.onrender.com/api/applications?jobId=${jobId}`);
        setApplicants(response.data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
    };

    fetchApplicants();
  }, [jobId]);

  return (
    <div>
      <h2>Applicants</h2>
      <ul>
        {applicants.map(applicant => (
          <li key={applicant._id}>
            {applicant.applicant.username} - Quiz Result: {applicant.quizResult}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ApplicantList;
