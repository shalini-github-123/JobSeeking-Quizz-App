import React, { useState } from 'react';
import axios from 'axios';

const QuizCreateForm = ({ jobId }) => {
  const [quizData, setQuizData] = useState({ title: '', deadline: '', questions: [] });
  const [question, setQuestion] = useState('');

  const handleChange = (e) => {
    setQuizData({ ...quizData, [e.target.name]: e.target.value });
  };

  const addQuestion = () => {
    setQuizData({ ...quizData, questions: [...quizData.questions, question] });
    setQuestion('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/quizzes', { ...quizData, job: jobId });
      console.log('Quiz created');
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Input fields for quizData and question */}
      <button type="button" onClick={addQuestion}>Add Question</button>
      <button type="submit">Create Quiz</button>
    </form>
  );
};

export default QuizCreateForm;
