import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signin } from '../api';

const Signin = () => {
  const [form, setForm] = useState({ user: '', password: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await signin(form);
    if (res.role) {
      localStorage.setItem('role', res.role);
      navigate('/dashboard');
    } else {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="user" onChange={handleChange} placeholder="Username" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <button type="submit">Sign In</button>
    </form>
  );
};

export default Signin;
