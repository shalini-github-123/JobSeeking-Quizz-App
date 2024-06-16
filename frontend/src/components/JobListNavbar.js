import React from 'react';
import { Link } from 'react-router-dom';
import './JobListNavbar.css'; // Import the CSS file

const JobListNavbar = () => {
  return (
    <nav className="job-list-navbar">
      <ul>
        <li>
          <Link to="/jobs/not-applied" className="nav-link" activeClassName="active">
            Not Applied
          </Link>
        </li>
        <li>
          <Link to="/jobs/applied" className="nav-link" activeClassName="active">
            Applied
          </Link>
        </li>
        <li>
          <Link to="/jobs/selected" className="nav-link" activeClassName="active">
            Selected
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default JobListNavbar;
