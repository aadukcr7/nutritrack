/**
 * KHOP CARD COMPONENT (खोप कार्ड)
 * ================================
 * Displays vaccination card showing completed vaccines
 * Formatted like the official vaccination card
 */

import { useState } from 'react';
import '../styles/KhopCard.css';

export default function KhopCard({ isOpen, onClose, babyName, babyDOB, completedVaccines }) {
  if (!isOpen) return null;

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Calculate age from DOB - show months if less than 2 years, years if 2 or more
  const calculateAge = (dobString) => {
    if (!dobString) return '';
    const dob = new Date(dobString);
    const today = new Date();
    
    // Calculate total months
    const totalMonths = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
    
    // If less than 24 months (2 years), show in months
    if (totalMonths < 24) {
      return `${totalMonths} months`;
    }
    
    // If 2 years or more, show in years
    const years = Math.floor(totalMonths / 12);
    return `${years} years`;
  };

  return (
    <div className="khop-card-overlay" onClick={onClose}>
      <div className="khop-card-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="khop-card-close" onClick={onClose}>×</button>

        {/* Header with logos */}
        <div className="khop-card-header">
          <p>खोप कार्ड</p>
          <h2>टीकाकरण रेकर्ड</h2>
        </div>

        {/* Child Information */}
        <div className="khop-card-info">
          <div className="khop-info-row">
            <label>नाम :</label>
            <span>{babyName || 'N/A'}</span>
          </div>
          <div className="khop-info-row">
            <label>जन्म मिति :</label>
            <span>{formatDate(babyDOB)}</span>
          </div>
          <div className="khop-info-row">
            <label>उमेर :</label>
            <span>{calculateAge(babyDOB)}</span>
          </div>
        </div>

        {/* Vaccination Table */}
        <div className="khop-card-table-section">
          <table className="khop-card-table">
            <thead>
              <tr>
                <th>खोप लगाएको क्रम</th>
                <th>खोप लगाएको तारिख</th>
                <th>खोप प्रकार</th>
              </tr>
            </thead>
            <tbody>
              {completedVaccines && completedVaccines.length > 0 ? (
                completedVaccines.map((vaccine, index) => (
                  <tr key={vaccine.id || index}>
                    <td>{index + 1}</td>
                    <td>{formatDate(vaccine.last_dose_date || vaccine.reminder_date)}</td>
                    <td>{vaccine.vaccine_name}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center', color: '#999' }}>
                    कुनै पनि खोप लगाइएको छैन
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Notes */}
        <div className="khop-card-footer">
          <p>यो कार्ड बोझो पुस्तक खोप लिन आउँदा लिएर आउनुपर्छ।</p>
        </div>

        {/* Print Button */}
        <div className="khop-card-actions">
          <button className="khop-card-print-btn" onClick={() => window.print()}>
            🖨️ Print Card
          </button>
        </div>
      </div>
    </div>
  );
}
