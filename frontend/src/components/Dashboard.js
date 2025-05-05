import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      {role === 'admin' ? (
        <p>Welcome, Admin!</p>
      ) : (
        <p>Welcome, User!</p>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
