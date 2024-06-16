import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate,} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateJob from './components/CreateJob';
import AddRecruiter from './components/AddRecruiter';
import NotFound from './pages/NotFound';
import VerticalNavbar from './components/VerticalNavbar';
import PostJob from './components/PostJob';
import CreateQuiz from './components/CreateQuiz';
import JobListPage from './components/JobListPage';
import AppliedJobsPage from './components/AppliedJobsPage';
import SelectedJobsPage from './components/SelectedJobsPage';
import NotAppliedJobsPage from './components/NotAppliedJobsPage'; // Import new component
import { useAuthContext } from './hooks/useAuthContext';
import PostedJobsPage from './components/PostedJobPage';
import JobDetailsPage from './components/JobDetailsPage';

const App = () => {
  const { user } = useAuthContext();
  // const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   const storedUser = JSON.parse(localStorage.getItem('user'));
  //   if (storedUser && !user) {
  //     navigate('/home');
  //   }
  // }, [navigate, user]);

  const hideNavbarRoutes = ['/add-recruiter', '/login', '/signup', '/post-job', '/create-quiz'];

  return (
    <div>
      <BrowserRouter>
        {/* {!hideNavbarRoutes.includes(location.pathname) && <VerticalNavbar />} */}
        <Routes>
          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
          {/* <Route path="/jobs" element={<JobListPage />} /> */}
          <Route path="/jobs" element={user && user.role === "Recruiter" ? <PostedJobsPage /> : <JobListPage />} />
          <Route path="/jobs/not-applied" element={<NotAppliedJobsPage />} />
          <Route path="/jobs/applied" element={<AppliedJobsPage />} />
          <Route path="/jobs/selected" element={<SelectedJobsPage />} />
          <Route path="/jobs/posted" element={<PostedJobsPage />} />
          <Route path="/jobs/posted/:jobId" element={<JobDetailsPage />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/home" />} />
          <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/home" />} />
          <Route path="/add-recruiter" element={user && user.role === "Admin" ? <AddRecruiter /> : <Navigate to="/login" />} />
          <Route path="/post-job" element={user && user.role === "Recruiter" ? <PostJob /> : <Navigate to="/login" />} />
          <Route path="/create-quiz" element={user && user.role === "Recruiter" ? <CreateQuiz /> : <Navigate to="/login" />} />
          <Route path="/edit-quiz/:id" element={user && user.role === "Recruiter" ? <CreateQuiz /> : <Navigate to="/login" />} />
          <Route path="*" element={user ? <NotFound /> : <Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
