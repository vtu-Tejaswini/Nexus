import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    adminSecret: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{maxWidth: '500px', marginTop: '5vh'}}>
      <div className="card">
        <h2 className="title" style={{fontSize: '2rem'}}>Register</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email ID" onChange={handleChange} required />
          <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
          <div style={{position: 'relative'}}>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', 
                background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0', 
                fontSize: '1.2rem', marginTop: '-0.5rem', boxShadow: 'none'
              }}
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
          
          <input type="text" name="department" placeholder="Department" onChange={handleChange} required />
          
          <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)'}}>
            Admin Registration (Optional)
          </label>
          <input 
            type="password" 
            name="adminSecret" 
            placeholder="Admin Secret Key (leave blank for student)" 
            onChange={handleChange} 
          />
          <button type="submit" style={{width: '100%', marginTop: '1rem'}}>Initialize Identity</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
