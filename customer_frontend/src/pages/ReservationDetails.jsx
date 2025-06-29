import './ReservationDetails.css';

import React, { useEffect, useRef, useState } from 'react';

import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReservationDetails = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        const response = await axios.get('http://localhost:4000/api/reservation_id', {
          headers: {
            token,
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          setReservations(response.data.reservations);
        } else {
          throw new Error('Failed to fetch reservations');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const downloadReservationPDF = (reservation) => {
    const input = document.getElementById(`reservation-${reservation.reservation_id}`);
    
    // Add temporary class for PDF styling
    input.classList.add('pdf-export');
    
    html2canvas(input, {
      scale: 2, // Higher quality
      logging: false,
      useCORS: true,
      allowTaint: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Calculate dimensions
      const imgWidth = 190; // Max width in mm for A4
      const pageHeight = 277; // A4 page height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 10; // Top margin
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Remove temporary class
      input.classList.remove('pdf-export');
      
      pdf.save(`Reservation_${reservation.reservation_id}_${reservation.customer_name}.pdf`);
    });
  };

  if (loading) return <div className="loading-container">Loading reservations...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (reservations.length === 0) return <div className="no-data-message">No reservations found</div>;

  return (
    <div className="reservation-details-container">
      <div className="details-header">
        <h1>All Reservations</h1>
        <button className="print-button" onClick={handlePrint}>Print All</button>
      </div>

      <div className="reservations-list">
        {reservations.map(reservation => (
          <div 
            key={reservation.reservation_id} 
            className="reservation-card"
            id={`reservation-${reservation.reservation_id}`}
          >
            <div className="details-grid">
              <div className="info-column">
                <div className="section-header">
                  <h2>Reservation #{reservation.reservation_id}</h2>
                </div>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${reservation.status}`}>
                      {reservation.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(reservation.reservation_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Time:</span>
                    <span className="detail-value">{reservation.reservation_time}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Guests:</span>
                    <span className="detail-value">{reservation.guests}</span>
                  </div>
                </div>
              </div>

              <div className="info-column">
                <div className="section-header">
                  <h2>Table Information</h2>
                </div>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">Table Number:</span>
                    <span className="detail-value">{reservation.table_number}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Type:</span>
                    <span className="detail-value capitalize">{reservation.table_type}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Capacity:</span>
                    <span className="detail-value">{reservation.capacity}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="customer-details-section">
              <div className="section-header">
                <h3>Customer Information</h3>
              </div>
              <div className="customer-details-grid">
                <div className="customer-info-column">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{reservation.customer_name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{reservation.phone}</span>
                  </div>
                </div>
                <div className="customer-info-column">
                  {reservation.email && (
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{reservation.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {reservation.special_requests && (
              <div className="special-requests-box">
                <span className="detail-label">Special Requests:</span>
                <p className="special-requests-text">{reservation.special_requests}</p>
              </div>
            )}

            <div className="reservation-actions">
              <button 
                className="download-pdf-button"
                onClick={() => downloadReservationPDF(reservation)}
              >
                Download as PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationDetails;