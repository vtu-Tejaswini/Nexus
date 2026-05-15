import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    name: '', description: '', guidelines: '', category: '', participationType: 'Solo',
    teamSize: 1, registrationFee: 0, eventDate: '', eventTime: '', venue: '', availableTickets: 0, organizerContact: ''
  });
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  // Viewer state
  const [viewingEvent, setViewingEvent] = useState(null);
  const [eventBookings, setEventBookings] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events/public');
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });
    
    const selectedDate = new Date(formData.eventDate);
    const minDate = new Date();
    minDate.setHours(0, 0, 0, 0);
    if (selectedDate < minDate) {
      setMsg({ type: 'error', text: 'Error: Event date must be from today onwards.' });
      return;
    }

    if (formData.participationType === 'Team') {
      if (formData.availableTickets % formData.teamSize !== 0) {
        setMsg({ type: 'error', text: `Error: For Team events, the Total Capacity (${formData.availableTickets}) must be exactly divisible by the Team Size (${formData.teamSize}).` });
        return;
      }
    }

    try {
      await api.post('/events', formData);
      setMsg({ type: 'success', text: 'Event created successfully!' });
      setFormData({
        name: '', description: '', guidelines: '', category: '', participationType: 'Solo',
        teamSize: 1, registrationFee: 0, eventDate: '', eventTime: '', venue: '', availableTickets: 0, organizerContact: ''
      });
      fetchEvents();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Failed to create event.' });
    }
  };

  const deleteEvent = async (id) => {
    if(!window.confirm("Are you sure you want to terminate this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const handleViewRegistrations = async (event) => {
    try {
      const res = await api.get(`/bookings/event/${event.id}`);
      setEventBookings(res.data);
      setViewingEvent(event);
    } catch (err) {
      alert("Failed to fetch registrations.");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Admin Control Module</h1>
      
      {viewingEvent ? (
        <div className="card" style={{marginBottom: '2rem'}}>
          <h2>Registrations: {viewingEvent.name}</h2>
          <button onClick={() => setViewingEvent(null)} className="btn-danger" style={{marginBottom: '1rem'}}>Back to Dashboard</button>
          
          {eventBookings.length === 0 ? (
            <p>No registrations yet.</p>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '1rem'}}>
                <thead>
                  <tr style={{borderBottom: '2px solid var(--accent-color)', textAlign: 'left'}}>
                    <th style={{padding: '0.5rem'}}>ID</th>
                    <th style={{padding: '0.5rem'}}>Booked By (Email)</th>
                    <th style={{padding: '0.5rem'}}>Team Name</th>
                    <th style={{padding: '0.5rem'}}>Members / Tickets</th>
                    <th style={{padding: '0.5rem'}}>Amount Paid</th>
                  </tr>
                </thead>
                <tbody>
                  {eventBookings.map(b => (
                    <tr key={b.id} style={{borderBottom: '1px solid #333'}}>
                      <td style={{padding: '0.5rem'}}>{b.id}</td>
                      <td style={{padding: '0.5rem'}}>{b.user?.email}</td>
                      <td style={{padding: '0.5rem'}}>{b.teamName || 'N/A'}</td>
                      <td style={{padding: '0.5rem'}}>{b.teamMembers ? b.teamMembers : `${b.numberOfTickets} tickets`}</td>
                      <td style={{padding: '0.5rem'}}>₹{b.totalAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="card" style={{marginBottom: '2rem'}}>
            <h2>Initialize New Event</h2>
            {msg.text && <div className={msg.type === 'error' ? 'error-msg' : 'success-msg'} style={{marginBottom: '1rem'}}>{msg.text}</div>}
            
            <form onSubmit={handleSubmit} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem'}}>
              <input type="text" name="name" placeholder="Event Name" value={formData.name} onChange={handleChange} required />
              <input type="text" name="category" placeholder="Category (e.g. Hackathon)" value={formData.category} onChange={handleChange} required />
              
              <textarea name="description" placeholder="Detailed Description" value={formData.description} onChange={handleChange} required style={{gridColumn: '1 / -1'}} rows="3" />
              
              <textarea name="guidelines" placeholder="Guidelines & Rules" value={formData.guidelines} onChange={handleChange} required style={{gridColumn: '1 / -1'}} rows="2" />
              
              <select name="participationType" value={formData.participationType} onChange={handleChange} required>
                <option value="Solo">Solo</option>
                <option value="Team">Team</option>
              </select>
              <input type="number" name="teamSize" placeholder="Team Size" value={formData.teamSize} onChange={handleChange} min="1" required />
              
              <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />
              <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} required />
              
              <input type="text" name="venue" placeholder="Venue" value={formData.venue} onChange={handleChange} required />
              <input type="number" name="registrationFee" placeholder="Registration Fee (₹)" value={formData.registrationFee} onChange={handleChange} min="0" required />
              
              <input type="number" name="availableTickets" placeholder="Total Capacity" value={formData.availableTickets} onChange={handleChange} min="1" required />
              <input type="text" name="organizerContact" placeholder="Organizer Contact" value={formData.organizerContact} onChange={handleChange} required />
              
              <button type="submit" style={{gridColumn: '1 / -1'}}>Publish Event</button>
            </form>
          </div>

          <h2>Active Events Registry</h2>
          <div className="events-grid" style={{marginTop: '1rem'}}>
            {events.map(event => (
              <div key={event.id} className="card">
                <h3>{event.name}</h3>
                <p style={{color: 'var(--accent-color)', marginBottom: '0.5rem'}}>₹{event.registrationFee}</p>
                <p><strong>Date:</strong> {event.eventDate} @ {event.eventTime}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Tickets Available:</strong> {event.availableTickets} / {event.totalCapacity}</p>
                
                <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
                  <button onClick={() => handleViewRegistrations(event)} style={{flex: 1, background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)'}}>View Regs</button>
                  <button onClick={() => deleteEvent(event.id)} className="btn-danger" style={{flex: 1}}>Terminate</button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
