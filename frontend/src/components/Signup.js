import React, { useState } from 'react';
import { signup } from '../api';

const Signup = () => {
  const [form, setForm] = useState({ user: '', name: '', email: '', password: '', mobile: '' });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await signup(form);
    alert(res.message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="user" onChange={handleChange} placeholder="Username" />
      <input name="name" onChange={handleChange} placeholder="Name" />
      <input name="email" onChange={handleChange} placeholder="Email" />
      <input name="mobile" onChange={handleChange} placeholder="Mobile" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
