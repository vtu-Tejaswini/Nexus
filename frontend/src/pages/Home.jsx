import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center'}}>
      <h1 className="title" style={{fontSize: '4rem', marginBottom: '1rem'}}>NEXUS EVENTS</h1>
      <p style={{fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '2rem'}}>
        Experience the future of event management. Secure your access to the most exclusive symposiums, hackathons, and workshops in the sector.
      </p>
      <div style={{display: 'flex', gap: '1rem'}}>
        <Link to="/login"><button>Initialize Session</button></Link>
        <Link to="/register"><button style={{background: 'transparent', borderColor: 'var(--text-muted)', color: 'var(--text-muted)'}}>Establish Identity</button></Link>
      </div>
    </div>
  );
};

export default Home;
