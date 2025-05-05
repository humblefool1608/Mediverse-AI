import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if(!token) return;
      const res = await fetch('http://localhost:5000/dashboard', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if(res.ok){
        setMessage(data.message);
      } else {
        setMessage('Error loading dashboard');
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div style={styles.container}>
      <h2>Dashboard</h2>
      <p>{message}</p>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '30px auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif'
  }
};
