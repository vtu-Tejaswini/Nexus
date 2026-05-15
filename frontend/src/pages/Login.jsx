import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.user.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="container" style={{maxWidth: '400px', marginTop: '10vh'}}>
      <div className="card">
        <h2 className="title" style={{fontSize: '2rem'}}>Login</h2>
        {error && <div className="error-msg">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email ID" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <div style={{position: 'relative'}}>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
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
          <div style={{textAlign: 'right', marginBottom: '1rem'}}>
            <button type="button" onClick={() => setShowForgotModal(true)} style={{background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', padding: 0, textTransform: 'none', letterSpacing: 'normal', boxShadow: 'none'}}>
              Forgot Password?
            </button>
          </div>
          <button type="submit" style={{width: '100%'}}>Authenticate</button>
        </form>
      </div>

      {showForgotModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div className="card" style={{maxWidth: '400px', textAlign: 'center'}}>
            <h3 style={{marginBottom: '1rem'}}>Reset Credentials</h3>
            <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
              Please contact the System Administrator to reset your credentials. Secure internal networks do not support automated email recovery.
            </p>
            <button onClick={() => setShowForgotModal(false)} style={{width: '100%'}}>Acknowledge</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
