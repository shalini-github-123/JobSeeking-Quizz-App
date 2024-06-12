import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom";
import "./PostJob.css"

const PostJob = () => {
  const [jobData, setJobData] = useState({
    role: '', salary: '', officeName: '', location: '',
    modeOfWork: '', requirements: '', joiningDate: '', minimumDuration: '',
    includeQuiz: false, selectedQuizId: null, selectedQuizName: ''
  });
  const { user } = useAuthContext();
  const [quizzes, setQuizzes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (jobData.includeQuiz) {
      fetchQuizzes();
    }
  }, [jobData.includeQuiz]);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('https://jobseeking-quizz-app.onrender.com/api/quizzes', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error.response ? error.response.data : error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setJobData({ ...jobData, [name]: checked });
    } else {
      setJobData({ ...jobData, [name]: value });
    }
  };

  const handleQuizSelect = (quizId, quizName) => {
    setJobData({ ...jobData, selectedQuizId: quizId, selectedQuizName: quizName });
    setModalIsOpen(false);
  };

  const handleQuizEdit = (quizId) => {
    navigate(`/edit-quiz/${quizId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://jobseeking-quizz-app.onrender.com/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(jobData),
      });
      navigate("/home")

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      const data = await response.json();
      console.log('Job posted:', data);
    } catch (error) {
      console.error('Error posting job:', error.message);
    }
  };

  return (
    <div className='post-job-container'>
      <form onSubmit={handleSubmit}>
        <input type="text" name="role" value={jobData.role} onChange={handleChange} placeholder="Role" />
        <input type="text" name="salary" value={jobData.salary} onChange={handleChange} placeholder="Salary" />
        <input type="text" name="officeName" value={jobData.officeName} onChange={handleChange} placeholder="Office Name" />
        <input type="text" name="location" value={jobData.location} onChange={handleChange} placeholder="Location" />
        <input type="text" name="modeOfWork" value={jobData.modeOfWork} onChange={handleChange} placeholder="Mode of Work" />
        <input type="text" name="requirements" value={jobData.requirements} onChange={handleChange} placeholder="Requirements" />
        <input type="date" name="joiningDate" value={jobData.joiningDate} onChange={handleChange} placeholder="Joining Date" />
        <input type="text" name="minimumDuration" value={jobData.minimumDuration} onChange={handleChange} placeholder="Minimum Duration" />

        <label>
          <div className="single-line">
            <input
              type="checkbox"
              name="includeQuiz"
              checked={jobData.includeQuiz}
              onChange={handleChange}
            />
            <span>Include Quiz</span>
          </div>
        </label>
        <div className='quiz-detail-box'>
        {jobData.includeQuiz && (
          <>
            <button type="button" onClick={() => setModalIsOpen(true)}>Select Quiz</button>
            {jobData.selectedQuizName && <p>Selected Quiz: {jobData.selectedQuizName}</p>}
          </>
        )}
        </div>
        

        <button type="submit" className='post-job-button'>Post Job</button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Select Quiz"
      >
        <h2>Select a Quiz</h2>
        <ul>
          {quizzes.map(quiz => (
            <li key={quiz._id} className="quiz-item">
              <span>{quiz.name} (Deadline: {new Date(quiz.deadline).toLocaleString()})</span>
              <button onClick={() => handleQuizSelect(quiz._id, quiz.name)}>Select</button>
              <button onClick={() => handleQuizEdit(quiz._id)}>Edit</button>
            </li>
          ))}
        </ul>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
    </div>
  );
};

export default PostJob;
