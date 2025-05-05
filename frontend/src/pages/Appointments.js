import React, { useEffect, useState } from 'react';

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [department, setDepartment] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchAppointments = async () => {
      if(!token) return;
      const res = await fetch('http://localhost:5000/appointments', {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if(res.ok){
        setAppointments(data);
      }
    };
    fetchAppointments();
  }, [token]);

  const handleBook = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ doctor_name: doctorName, department, scheduled_at: scheduledAt })
      });
      const data = await res.json();
      if(res.ok){
        setMessage('Appointment booked!');
        setDoctorName('');
        setDepartment('');
        setScheduledAt('');
        setAppointments(prev => [...prev, {
          id: data.appointment_id,
          doctor_name: doctorName,
          department,
          scheduled_at: scheduledAt,
          status: 'pending'
        }]);
      } else {
        setMessage(data.error || 'Booking failed');
      }
    } catch {
      setMessage('Network error');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Appointments</h2>
      <form onSubmit={handleBook} style={styles.form}>
        <input value={doctorName} onChange={e => setDoctorName(e.target.value)} placeholder="Doctor Name" style={styles.input} required/>
        <input value={department} onChange={e => setDepartment(e.target.value)} placeholder="Department" style={styles.input} required/>
        <input type="datetime-local" value={scheduledAt} onChange={e => setScheduledAt(e.target.value)} style={styles.input} required/>
        <button type="submit" style={styles.button}>Book Appointment</button>
      </form>
      {message && <p>{message}</p>}
      <h3>Your Appointments</h3>
      <ul>
        {appointments.map(a => (
          <li key={a.id}>
            Dr. {a.doctor_name} - {a.department} — {new Date(a.scheduled_at).toLocaleString()} [Status: {a.status}]
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '30px auto',
    padding: 20,
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    marginBottom: 20,
  },
  input: {
    display: 'block',
    padding: 8,
    marginBottom: 10,
    width: '100%',
    maxWidth: 300
  },
  button: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  }
};
