/**
 * GROWTH INPUT COMPONENT
 * ======================
 * Form for inputting weekly growth measurements
 * Tracks weight, height, and head circumference
 */

import { useState, useEffect } from 'react';
import '../styles/GrowthInput.css';

export default function GrowthInput({ babyId, onSubmit, isLoading = false, onCancel }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    weight_kg: '',
    height_cm: '',
    head_circumference_cm: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.weight_kg) {
      newErrors.weight_kg = 'Weight is required';
    } else if (parseFloat(formData.weight_kg) <= 0) {
      newErrors.weight_kg = 'Weight must be greater than 0';
    }

    if (!formData.height_cm) {
      newErrors.height_cm = 'Height is required';
    } else if (parseFloat(formData.height_cm) <= 0) {
      newErrors.height_cm = 'Height must be greater than 0';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const submitData = {
      baby_id: babyId,
      date: new Date(formData.date).toISOString(),
      weight_kg: parseFloat(formData.weight_kg),
      height_cm: parseFloat(formData.height_cm),
      head_circumference_cm: formData.head_circumference_cm ? parseFloat(formData.head_circumference_cm) : null,
    };

    onSubmit(submitData);
  };

  return (
    <form className="growth-input-form" onSubmit={handleSubmit}>
      <h3 className="form-title">Record Weekly Growth Measurement</h3>

      <div className="form-group">
        <label htmlFor="date" className="form-label">Measurement Date *</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`form-input ${errors.date ? 'error' : ''}`}
          disabled={isLoading}
        />
        {errors.date && <span className="error-message">{errors.date}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="weight_kg" className="form-label">Weight (kg) *</label>
          <input
            type="number"
            id="weight_kg"
            name="weight_kg"
            value={formData.weight_kg}
            onChange={handleChange}
            placeholder="e.g., 5.2"
            step="0.1"
            className={`form-input ${errors.weight_kg ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.weight_kg && <span className="error-message">{errors.weight_kg}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="height_cm" className="form-label">Height (cm) *</label>
          <input
            type="number"
            id="height_cm"
            name="height_cm"
            value={formData.height_cm}
            onChange={handleChange}
            placeholder="e.g., 55"
            step="0.1"
            className={`form-input ${errors.height_cm ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.height_cm && <span className="error-message">{errors.height_cm}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="head_circumference_cm" className="form-label">Head Circumference (cm)</label>
          <input
            type="number"
            id="head_circumference_cm"
            name="head_circumference_cm"
            value={formData.head_circumference_cm}
            onChange={handleChange}
            placeholder="e.g., 37"
            step="0.1"
            className="form-input"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="form-buttons">
        <button
          type="submit"
          className="submit-button"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Record Measurement'}
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
