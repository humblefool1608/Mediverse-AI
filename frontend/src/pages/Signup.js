import React, { useState } from 'react';

export default function Signup({ onSignup }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ full_name: fullName, email, phone, password, role: 'patient' })
      });
      const data = await res.json();
      if(res.ok){
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'patient');
        onSignup('patient');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input type="text" placeholder="Full Name" value={fullName} 
          onChange={e => setFullName(e.target.value)} required style={styles.input}/>
        <input type="email" placeholder="Email" value={email} 
          onChange={e => setEmail(e.target.value)} required style={styles.input}/>
        <input type="tel" placeholder="Phone" value={phone} 
          onChange={e => setPhone(e.target.value)} style={styles.input}/>
        <input type="password" placeholder="Password" value={password} 
          onChange={e => setPassword(e.target.value)} required style={styles.input}/>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Sign Up</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: '30px auto',
    padding: 20,
    boxShadow: '0 0 10px #ccc',
    borderRadius: 8,
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: 10,
    marginBottom: 15,
    fontSize: 16
  },
  button: {
    padding: 10,
    backgroundColor: '#28a745',
    color: 'white',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginBottom: 10
  }
};
