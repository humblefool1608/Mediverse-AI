import React, { useEffect, useState } from 'react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      if(!token) return;
      const res = await fetch('http://localhost:5000/notifications', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if(res.ok){
        setNotifications(data);
      }
    };
    fetchNotifications();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map((n, i) => (
            <li key={i}>
              {n.message} <br />
              <small>{new Date(n.sent_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '30px auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    listStyleType: 'none',
  }
};
