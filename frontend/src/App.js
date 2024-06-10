import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateJob from './components/CreateJob';
import AddRecruiter from './components/AddRecruiter';
import { useAuthContext } from './hooks/useAuthContext';
import NotFound from './pages/NotFound';
import VerticalNavbar from './components/VerticalNavbar';
import PostJob from './components/PostJob';
import CreateQuiz from './components/CreateQuiz';
import JobListPage from './components/JobListPage';

const App = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation(); 

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && !user) {
      // Log the user in automatically if there's a stored session
      // This is a simplified example, you might need to verify the token with the server
      navigate('/home');
    }
  }, [navigate, user]);

  // Define routes where the navbar should be hidden
  const hideNavbarRoutes = ['/add-recruiter','/login','/signup','/post-job','/create-quiz'];

  return (
    <div>
      {/* Conditionally render VerticalNavbar based on the current route */}
      {/* {!hideNavbarRoutes.includes(location.pathname) && <VerticalNavbar />} */}
      <Routes>
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/jobs" element={user ? <JobListPage   /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />
        <Route path="/add-recruiter" element={user && user.role === "Admin" ? <AddRecruiter /> : <Navigate to="/login" />} />
        <Route path="/post-job" element={user && user.role === "Recruiter" ? <PostJob /> : <Navigate to="/login" />} />
        <Route path="/create-quiz" element={user && user.role === "Recruiter" ? <CreateQuiz /> : <Navigate to="/login" />} />
        <Route path="/edit-quiz/:id" element={user && user.role === "Recruiter" ? <CreateQuiz /> : <Navigate to="/login" />} />
        <Route path="*" element={user ? <NotFound /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
