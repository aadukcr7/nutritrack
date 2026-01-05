/**
 * BABY CARD COMPONENT
 * ===================
 * Displays baby information in a card format
 * Shows basic info and links to growth tracking
 */

import { useState } from 'react';
import '../styles/BabyCard.css';

export default function BabyCard({ baby, onEdit, onDelete, onViewGrowth }) {
  const [showMenu, setShowMenu] = useState(false);

  // Calculate baby's age
  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    const months = monthDiff < 0 ? 12 + monthDiff : monthDiff;
    return { years: age, months };
  };

  const age = calculateAge(baby.date_of_birth);
  const ageText = age.years > 0 
    ? `${age.years}y ${age.months}m` 
    : `${age.months} months`;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="baby-card">
      <div className="card-header">
        <div className="baby-info">
          <h3 className="baby-name">{baby.name}</h3>
          <p className="baby-age">{ageText}</p>
        </div>
        <div className="card-menu">
          <button 
            className="menu-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            ⋮
          </button>
          {showMenu && (
            <div className="menu-dropdown">
              <button onClick={() => { onEdit(baby); setShowMenu(false); }}>
                ✎ Edit
              </button>
              <button onClick={() => { onDelete(baby.id); setShowMenu(false); }}>
                🗑 Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="card-details">
        <div className="detail-row">
          <span className="detail-label">📅 DOB:</span>
          <span className="detail-value">{formatDate(baby.date_of_birth)}</span>
        </div>

        {baby.gender && (
          <div className="detail-row">
            <span className="detail-label">👤 Gender:</span>
            <span className="detail-value">
              {baby.gender.charAt(0).toUpperCase() + baby.gender.slice(1)}
            </span>
          </div>
        )}

        {baby.blood_type && (
          <div className="detail-row">
            <span className="detail-label">🩸 Blood Type:</span>
            <span className="detail-value">{baby.blood_type}</span>
          </div>
        )}

        {baby.weight_at_birth_kg && (
          <div className="detail-row">
            <span className="detail-label">⚖️ Birth Weight:</span>
            <span className="detail-value">{baby.weight_at_birth_kg} kg</span>
          </div>
        )}

        {baby.height_at_birth_cm && (
          <div className="detail-row">
            <span className="detail-label">📏 Birth Height:</span>
            <span className="detail-value">{baby.height_at_birth_cm} cm</span>
          </div>
        )}

        {baby.allergies && (
          <div className="detail-row allergy-row">
            <span className="detail-label">⚠️ Allergies:</span>
            <span className="detail-value">{baby.allergies}</span>
          </div>
        )}
      </div>

      <button 
        className="view-growth-button"
        onClick={() => onViewGrowth(baby.id)}
      >
        📈 View Growth Tracking
      </button>
    </div>
  );
}
