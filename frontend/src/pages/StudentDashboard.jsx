import React, { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { jsPDF } from 'jspdf';
import QRCode from 'qrcode';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketsToBook, setTicketsToBook] = useState(1);
  const [teamMembers, setTeamMembers] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [bookings, setBookings] = useState([]);

  const fetchData = async () => {
    try {
      const evRes = await api.get('/events/public');
      setEvents(evRes.data);
      const bkRes = await api.get('/bookings/my');
      setBookings(bkRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setTicketsToBook(1);
    setTeamName('');
    if (event.participationType === 'Team') {
      setTeamMembers(Array(event.teamSize).fill({ name: '', email: '' }));
    } else {
      setTeamMembers([]);
    }
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const handleBook = async (e) => {
    e.preventDefault();
    setMsg({ type: '', text: '' });

    if (selectedEvent.participationType === 'Team') {
      if (!teamName.trim()) {
        setMsg({ type: 'error', text: 'Please provide a Team Name.' });
        return;
      }
      const missing = teamMembers.some(tm => !tm.name.trim() || !tm.email.trim());
      if (missing) {
        setMsg({ type: 'error', text: 'Please fill out both Name and Email for all team members.' });
        return;
      }
    }

    try {
      const payload = { 
        eventId: selectedEvent.id, 
        numberOfTickets: selectedEvent.participationType === 'Team' ? selectedEvent.teamSize : ticketsToBook,
        teamName: selectedEvent.participationType === 'Team' ? teamName : null,
        teamMembers: selectedEvent.participationType === 'Team' ? teamMembers : []
      };
      await api.post('/bookings', payload);
      setMsg({ type: 'success', text: `Successfully booked tickets for ${selectedEvent.name}!` });
      setSelectedEvent(null);
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Booking failed.' });
    }
  };

  const downloadTicket = async (booking) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('Nexus Events Ticket', 20, 20);
      
      doc.setFontSize(16);
      doc.text(`Event: ${booking.event.name}`, 20, 40);
      doc.text(`Venue: ${booking.event.venue}`, 20, 50);
      doc.text(`Date: ${booking.event.eventDate}`, 20, 60);
      doc.text(`Booked By: ${booking.user?.name || user.name}`, 20, 70);
      
      if (booking.teamName) {
        doc.text(`Team Name: ${booking.teamName}`, 20, 80);
        doc.text(`Team Members: ${booking.teamMembers}`, 20, 90);
      } else if (booking.teamMembers) {
        doc.text(`Team: ${booking.teamMembers}`, 20, 80);
      } else {
        doc.text(`Tickets: ${booking.numberOfTickets}`, 20, 80);
      }
      
      const qrData = `TICKET VERIFICATION\nID: ${booking.id}\nEvent: ${booking.event.name}\nBooker: ${booking.user?.email || user.email}`;
      const qrCodeDataUrl = await QRCode.toDataURL(qrData);
      doc.addImage(qrCodeDataUrl, 'PNG', 20, 110, 50, 50);
      
      doc.save(`Ticket_${booking.event.name.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      alert("Failed to generate PDF ticket.");
    }
  };

  const getCapacityColor = (percent) => {
    if (percent > 50) return '#00ff88'; // Green
    if (percent > 25) return '#00d2ff'; // Blue
    if (percent > 5) return '#ffaa00'; // Orange
    return '#ff3366'; // Red
  };

  return (
    <div className="container">
      <h1 className="title">Explorer Dashboard</h1>
      {msg.text && <div className={msg.type === 'error' ? 'error-msg' : 'success-msg'} style={{marginBottom: '1rem'}}>{msg.text}</div>}
      
      {selectedEvent ? (
        <div className="card" style={{marginBottom: '2rem'}}>
          <h2>{selectedEvent.name} - Booking Sequence</h2>
          <p style={{margin: '1rem 0'}}>{selectedEvent.description}</p>
          {selectedEvent.guidelines && (
            <div style={{background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', borderLeft: '3px solid var(--accent-color)'}}>
              <h4 style={{marginBottom: '0.5rem', color: 'var(--accent-color)'}}>Event Guidelines</h4>
              <p style={{fontSize: '0.9rem', whiteSpace: 'pre-wrap', color: 'var(--text-muted)'}}>{selectedEvent.guidelines}</p>
            </div>
          )}
          
          <div style={{display: 'flex', gap: '2rem', marginBottom: '1rem', color: 'var(--text-muted)'}}>
            <p><strong>Venue:</strong> {selectedEvent.venue}</p>
            <p><strong>Date:</strong> {selectedEvent.eventDate}</p>
            <p><strong>Fee:</strong> ₹{selectedEvent.registrationFee} {selectedEvent.participationType === 'Team' && '(Per Team)'}</p>
          </div>

          <form onSubmit={handleBook} style={{display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1rem'}}>
            
            {selectedEvent.participationType === 'Solo' ? (
              <div style={{display: 'flex', gap: '1rem'}}>
                <div style={{flex: 1}}>
                  <label>Number of Tickets</label>
                  <input type="number" value={ticketsToBook} onChange={(e) => setTicketsToBook(parseInt(e.target.value))} min="1" max={selectedEvent.availableTickets} required />
                </div>
                <div style={{flex: 1}}>
                  <label>Total Amount</label>
                  <input type="text" value={`₹${ticketsToBook * selectedEvent.registrationFee}`} disabled />
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{marginBottom: '0.5rem'}}>Team Registration</h3>
                <div style={{marginBottom: '1rem'}}>
                  <input 
                    type="text" 
                    placeholder="Enter Team Name" 
                    value={teamName} 
                    onChange={(e) => setTeamName(e.target.value)} 
                    required 
                    style={{width: '100%', padding: '0.75rem', fontSize: '1.1rem', fontWeight: 'bold'}}
                  />
                </div>
                
                <h4 style={{marginBottom: '0.5rem'}}>Team Members ({selectedEvent.teamSize})</h4>
                <p style={{color: 'var(--accent-color)', fontSize: '0.85rem', marginBottom: '1rem'}}>
                  All team members must have an active registered account with the provided email.
                </p>
                <div style={{display: 'grid', gridTemplateColumns: '1fr', gap: '1rem'}}>
                  {teamMembers.map((member, idx) => (
                    <div key={idx} style={{display: 'flex', gap: '1rem'}}>
                      <input 
                        type="text" 
                        placeholder={`Member ${idx + 1} Name`}
                        value={member.name}
                        onChange={(e) => handleTeamMemberChange(idx, 'name', e.target.value)}
                        required
                        style={{flex: 1}}
                      />
                      <input 
                        type="email" 
                        placeholder={`Member ${idx + 1} Email ID`}
                        value={member.email}
                        onChange={(e) => handleTeamMemberChange(idx, 'email', e.target.value)}
                        required
                        style={{flex: 1}}
                      />
                    </div>
                  ))}
                </div>
                <div style={{marginTop: '1rem'}}>
                  <label>Total Amount (For 1 Team)</label>
                  <input type="text" value={`₹${selectedEvent.registrationFee}`} disabled />
                </div>
              </div>
            )}
            
            <button type="submit" style={{width: '100%', marginTop: '1rem'}}>Confirm Acquisition</button>
          </form>
          <button onClick={() => setSelectedEvent(null)} className="btn-danger" style={{width: '100%'}}>Cancel Operation</button>
        </div>
      ) : (
        <>
          <h2 style={{marginBottom: '1rem'}}>Available Events</h2>
          <div className="events-grid" style={{marginBottom: '3rem'}}>
            {events.map(event => {
              const capacityPercent = (event.availableTickets / (event.totalCapacity || event.availableTickets || 1)) * 100;
              const barColor = getCapacityColor(capacityPercent);
              
              let availableText = `${event.availableTickets} Tickets Left`;
              let canBook = event.availableTickets > 0;
              
              if (event.participationType === 'Team') {
                const teamsLeft = Math.floor(event.availableTickets / event.teamSize);
                availableText = `${teamsLeft} Teams Left`;
                canBook = teamsLeft > 0;
              }

              return (
                <div key={event.id} className="card">
                  <h3>{event.name}</h3>
                  <p style={{color: 'var(--accent-color)', fontSize: '1.2rem', margin: '0.5rem 0'}}>₹{event.registrationFee}</p>
                  <p style={{fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem'}}>{event.category} | {event.participationType} {event.participationType === 'Team' && `(Size: ${event.teamSize})`}</p>
                  <p style={{fontSize: '0.9rem', marginBottom: '1rem'}}>{event.description.substring(0, 100)}...</p>
                  
                  {/* Capacity Bar */}
                  <div style={{marginBottom: '1rem'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px'}}>
                      <span>Availability</span>
                      <span style={{color: barColor, fontWeight: 'bold'}}>{availableText}</span>
                    </div>
                    <div style={{width: '100%', height: '8px', backgroundColor: '#333', borderRadius: '4px', overflow: 'hidden'}}>
                      <div style={{width: `${capacityPercent}%`, height: '100%', backgroundColor: barColor, transition: 'width 0.5s ease'}}></div>
                    </div>
                  </div>

                  <div style={{marginTop: '1rem'}}>
                    <button 
                      onClick={() => handleSelectEvent(event)} 
                      disabled={!canBook}
                      style={{width: '100%', opacity: !canBook ? 0.5 : 1}}
                    >
                      {canBook ? 'Initiate Booking' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 style={{marginBottom: '1rem'}}>Your Acquisitions</h2>
          <div className="events-grid">
            {bookings.map(b => (
              <div key={b.id} className="card" style={{borderLeft: '4px solid #00ff88'}}>
                <h3>{b.event.name}</h3>
                {b.teamName && <p><strong>Team Name:</strong> {b.teamName}</p>}
                {b.teamMembers ? (
                  <p><strong>Members:</strong> {b.teamMembers}</p>
                ) : (
                  <p><strong>Tickets:</strong> {b.numberOfTickets}</p>
                )}
                <p><strong>Total Paid:</strong> ₹{b.totalAmount}</p>
                {b.user && b.user.email !== user.email && (
                  <p style={{fontSize: '0.8rem', color: 'var(--text-muted)'}}>Booked by: {b.user.name}</p>
                )}
                <button 
                  onClick={() => downloadTicket(b)} 
                  style={{marginTop: '1rem', width: '100%', background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)'}}
                >
                  Download Ticket (PDF)
                </button>
              </div>
            ))}
            {bookings.length === 0 && <p style={{color: 'var(--text-muted)'}}>No acquisitions found.</p>}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentDashboard;
