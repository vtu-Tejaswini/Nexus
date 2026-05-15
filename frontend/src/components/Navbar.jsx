import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-logo">NEXUS EVENTS</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span style={{color: 'var(--text-muted)'}}>Welcome, {user.name}</span>
            <Link to={user.role === 'ROLE_ADMIN' ? '/admin' : '/student'}>Dashboard</Link>
            <button onClick={handleLogout} className="btn-danger">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
