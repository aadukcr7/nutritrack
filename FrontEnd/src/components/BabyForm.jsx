/**
 * BABY FORM COMPONENT
 * ===================
 * Form for inputting baby information
 * Includes name, DOB, gender, birth measurements
 */

import { useState } from 'react';
import '../styles/BabyForm.css';

export default function BabyForm({ onSubmit, isLoading = false, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    date_of_birth: initialData?.date_of_birth || '',
    gender: initialData?.gender || 'male',
    weight_at_birth_kg: initialData?.weight_at_birth_kg || '',
    height_at_birth_cm: initialData?.height_at_birth_cm || '',
    head_circumference_at_birth_cm: initialData?.head_circumference_at_birth_cm || '',
    blood_type: initialData?.blood_type || '',
    allergies: initialData?.allergies || '',
    notes: initialData?.notes || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Baby name is required';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    // Validate date is not in future
    if (formData.date_of_birth) {
      const dob = new Date(formData.date_of_birth);
      if (dob > new Date()) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future';
      }
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

    // Convert numeric fields
    const submitData = {
      ...formData,
      weight_at_birth_kg: formData.weight_at_birth_kg ? parseFloat(formData.weight_at_birth_kg) : null,
      height_at_birth_cm: formData.height_at_birth_cm ? parseFloat(formData.height_at_birth_cm) : null,
      head_circumference_at_birth_cm: formData.head_circumference_at_birth_cm ? parseFloat(formData.head_circumference_at_birth_cm) : null,
    };

    onSubmit(submitData);
  };

  return (
    <form className="baby-form" onSubmit={handleSubmit}>
      <h2 className="form-title">{initialData ? 'Edit Baby Information' : 'Add Your Baby'}</h2>

      <div className="form-section">
        <h3 className="section-title">Basic Information</h3>

        <div className="form-group">
          <label htmlFor="name" className="form-label">Baby's Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter baby's name"
            className={`form-input ${errors.name ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date_of_birth" className="form-label">Date of Birth *</label>
          <input
            type="date"
            id="date_of_birth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            className={`form-input ${errors.date_of_birth ? 'error' : ''}`}
            disabled={isLoading}
          />
          {errors.date_of_birth && <span className="error-message">{errors.date_of_birth}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="gender" className="form-label">Gender</label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-input"
            disabled={isLoading}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Birth Measurements</h3>

        <div className="form-group">
          <label htmlFor="weight_at_birth_kg" className="form-label">Weight at Birth (kg)</label>
          <input
            type="number"
            id="weight_at_birth_kg"
            name="weight_at_birth_kg"
            value={formData.weight_at_birth_kg}
            onChange={handleChange}
            placeholder="e.g., 3.5"
            step="0.1"
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="height_at_birth_cm" className="form-label">Height at Birth (cm)</label>
          <input
            type="number"
            id="height_at_birth_cm"
            name="height_at_birth_cm"
            value={formData.height_at_birth_cm}
            onChange={handleChange}
            placeholder="e.g., 50"
            step="0.1"
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="head_circumference_at_birth_cm" className="form-label">Head Circumference at Birth (cm)</label>
          <input
            type="number"
            id="head_circumference_at_birth_cm"
            name="head_circumference_at_birth_cm"
            value={formData.head_circumference_at_birth_cm}
            onChange={handleChange}
            placeholder="e.g., 35"
            step="0.1"
            className="form-input"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="blood_type" className="form-label">Blood Type</label>
          <select
            id="blood_type"
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
            className="form-input"
            disabled={isLoading}
          >
            <option value="">Not specified</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">Health Information</h3>

        <div className="form-group">
          <label htmlFor="allergies" className="form-label">Known Allergies</label>
          <textarea
            id="allergies"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="e.g., Peanuts, Dairy"
            className="form-input"
            rows="3"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes" className="form-label">Additional Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any other important information about your baby"
            className="form-input"
            rows="3"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading}
      >
        {isLoading ? 'Saving...' : (initialData ? 'Update Baby' : 'Add Baby')}
      </button>
    </form>
  );
}
