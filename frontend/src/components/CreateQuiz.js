import React, { useState, useEffect } from 'react';
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import "./CreateQuiz.css"

const CreateQuiz = () => {
  const [quizData, setQuizData] = useState({
    recruiter: null,
    name: '',
    deadline: '',
    duration: '',
    questions: [{ question: '', options: ['', ''], correctOptionIndex: [] }] // Default to two options and empty correctOptionIndex array
  });
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { id } = useParams(); // Get quiz ID from URL

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/quizzes/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setQuizData(data);
      } else {
        console.error('Failed to fetch quiz data:', data);
      }
    } catch (error) {
      console.error('Error fetching quiz:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuizData({ ...quizData, [name]: value,recruiter: user._id });
    // setQuizData({...quizData, recruiter: user._id});
  };

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    const updatedQuestions = quizData.questions.map((q, qIndex) =>
      qIndex === index ? { ...q, [name]: value } : q
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const { value } = event.target;
    const updatedQuestions = quizData.questions.map((q, questionIndex) =>
      qIndex === questionIndex
        ? {
            ...q,
            options: q.options.map((option, optIndex) =>
              optIndex === oIndex ? value : option
            )
          }
        : q
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleCorrectOptionChange = (qIndex, oIndex, event) => {
    const { checked } = event.target;
    const updatedQuestions = quizData.questions.map((q, questionIndex) => {
      if (questionIndex === qIndex) {
        const updatedcorrectOptionIndex = checked
          ? [...q.correctOptionIndex, oIndex]
          : q.correctOptionIndex.filter((optIndex) => optIndex !== oIndex);
        return { ...q, correctOptionIndex: updatedcorrectOptionIndex };
      }
      return q;
    });
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [...quizData.questions, { question: '', options: ['', ''], correctOptionIndex: [] }] // Default to two options and empty correctOptionIndex array
    });
  };

  const addOption = (index) => {
    const updatedQuestions = quizData.questions.map((q, qIndex) =>
      qIndex === index ? { ...q, options: [...q.options, ''] } : q
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const deleteOption = (qIndex, oIndex) => {
    const updatedQuestions = quizData.questions.map((q, questionIndex) =>
      qIndex === questionIndex
        ? {
            ...q,
            options: q.options.filter((_, optIndex) => optIndex !== oIndex),
            correctOptionIndex: q.correctOptionIndex.filter((optIndex) => optIndex !== oIndex)
          }
        : q
    );
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const deleteQuestion = (qIndex) => {
    const updatedQuestions = quizData.questions.filter((_, index) => index !== qIndex);
    setQuizData({ ...quizData, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    console.log('Submitting quiz data:', quizData); // Log quizData to inspect its structure
    try {
      const method = id ? "PUT" : "POST";
      const url = id ? `http://localhost:4000/api/quizzes/${id}` : "http://localhost:4000/api/quizzes";
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(quizData),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Response data:', data); // Log the response data for detailed error info
        throw new Error(`Failed to ${id ? "update" : "create"} quiz`);
      }
  
      if (id) {
        // If updating quiz, navigate back to select quiz part
        navigate("/post-job");
      } else {
        navigate("/home");
      }
  
      console.log(`Quiz ${id ? "updated" : "created"}:`, data);
    } catch (error) {
      console.error(`Error ${id ? "updating" : "creating"} quiz:`, error.message);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" className='large-input' value={quizData.name} onChange={handleChange} placeholder="Quiz Name" />
      <input type="datetime-local" name="deadline" className='large-input' value={quizData.deadline} onChange={handleChange} placeholder="Deadline" />
      <input type="text" name="duration" className='large-input' value={quizData.duration} onChange={handleChange} placeholder="Duration" />
      
      {quizData.questions.map((q, qIndex) => (
        <div key={qIndex}>
          <input
            type="text"
            name="question"
            className='large-input' 
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e)}
            placeholder="Question"
          />
          {q.options.map((option, oIndex) => (
            <div key={oIndex} className='option-container'>
              <input
                type="text"
                className='options-input'
                value={option}
                onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                placeholder={`Option ${oIndex + 1}`}
              />
              <input
                type="checkbox"
                checked={q.correctOptionIndex.includes(oIndex)}
                onChange={(e) => handleCorrectOptionChange(qIndex, oIndex, e)}
              /> 
              <button type="button" className='delete-button' onClick={() => deleteOption(qIndex, oIndex)}>Delete Option</button>
            </div>
          ))}
          <div className='button-container'>
          <button type="button" onClick={() => addOption(qIndex)}>Add Option</button>
          <button type="button" onClick={() => deleteQuestion(qIndex)}>Delete Question</button>
          <button type="button" onClick={addQuestion}>Add Question</button>
          </div>
          
        </div>
      ))}
      
      <button type="submit" className='create-quiz-button'>{id ? "Update Quiz" : "Create Quiz"}</button>
    </form>
  );
};

export default CreateQuiz;
