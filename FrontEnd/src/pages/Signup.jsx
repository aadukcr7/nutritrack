/**
 * SIGNUP PAGE COMPONENT (REFACTORED - MODULAR)
 * =============================================
 * Uses reusable components and custom hooks
 * Much cleaner and more maintainable than before
 * 
 * Components Used:
 * - useForm: Custom hook for form state management
 * - FormInput: Reusable input field component
 * - ErrorMessage: Reusable error display component
 * - AuthHeader: Reusable header with icon/title
 * - AuthFooter: Reusable footer with links
 * - UserTypeSelector: Reusable user type selector
 * - DateInput: Custom date input with calendar picker
 * - SubmitButton: Reusable submit button component
 * - PasswordStrengthIndicator: Real-time password strength feedback
 */

import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import FormInput from '../components/FormInput';
import DateInput from '../components/DateInput';
import ErrorMessage from '../components/ErrorMessage';
import AuthHeader from '../components/AuthHeader';
import AuthFooter from '../components/AuthFooter';
import UserTypeSelector from '../components/UserTypeSelector';
import SubmitButton from '../components/SubmitButton';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { register } from '../api';
import '../styles/Auth.css';

export default function Signup() {
  // ===== STATE & HOOKS =====
  const { formData, setFormData, error, isLoading, setError, setIsLoading, handleInputChange } = useForm({
    fullName: '',
    email: '',
    password: '',
    userType: 'pregnant',
    dueDate: '',
    babyDateOfBirth: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Prefill user type based on stage selection from welcome screen
  useEffect(() => {
    const stageFromNav = location.state?.stage || localStorage.getItem('selectedStage');
    if (!stageFromNav) return;

    const normalizedStage = stageFromNav === 'newParent' ? 'newParent' : 'pregnant';
    setFormData(prev => ({
      ...prev,
      userType: normalizedStage
    }));
  }, [location.state, setFormData]);

  // ===== HANDLE USER TYPE CHANGE =====
  const handleUserTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      userType: type
    }));
  };

  // ===== PASSWORD VALIDATION HELPER =====
  const validatePassword = (password) => {
    const requirements = {
      minLength: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    return Object.values(requirements).every(Boolean);
  };

  // ===== FORM SUBMISSION HANDLER =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Require date based on user type
    if (formData.userType === 'pregnant' && !formData.dueDate) {
      setError('Please enter your due date');
      setIsLoading(false);
      return;
    }

    if (formData.userType === 'newParent' && !formData.babyDateOfBirth) {
      setError('Please enter baby\'s date of birth');
      setIsLoading(false);
      return;
    }

    // Strict email validation - only letters, numbers, dots, and underscores allowed
    // Must start with letter, at least 3 chars before @
    const emailRegex = /^[a-zA-Z][a-zA-Z0-9._]{2,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email must start with a letter, be at least 3 characters, and contain only letters, numbers, dots, or underscores before @');
      setIsLoading(false);
      return;
    }

    if (formData.fullName.length < 2) {
      setError('Full name must be at least 2 characters');
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError('Password does not meet security requirements. Please check the requirements below.');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        dueDate: formData.userType === 'pregnant' ? formData.dueDate : '',
        babyDateOfBirth: formData.userType === 'newParent' ? formData.babyDateOfBirth : '',
      });

      navigate('/login', { state: { message: 'Account created! Please sign in.' } });
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setIsLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Header with icon and title */}
        <AuthHeader 
          title="Create Account" 
          subtitle="Let's get to know you better"
        />

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* Full Name Input */}
          <FormInput
            label="Full Name"
            id="fullName"
            type="text"
            name="fullName"
            placeholder="Enter your name"
            value={formData.fullName}
            onChange={handleInputChange}
          />

          {/* Email Input */}
          <FormInput
            label="Email"
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
          />

          {/* Password Input */}
          <FormInput
            label="Password"
            id="password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
          />

          {/* Password Strength Indicator */}
          <PasswordStrengthIndicator password={formData.password} />

          {/* User Type Selector */}
          <UserTypeSelector 
            userType={formData.userType} 
            onUserTypeChange={handleUserTypeChange}
          />

          {/* Single date field based on user type */}
          {formData.userType === 'pregnant' ? (
            <DateInput
              label="Due Date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          ) : (
            <DateInput
              label="Baby's Date of Birth"
              id="babyDateOfBirth"
              name="babyDateOfBirth"
              value={formData.babyDateOfBirth}
              onChange={handleInputChange}
            />
          )}

          {/* Error Display */}
          <ErrorMessage message={error} />

          {/* Submit Button */}
          <SubmitButton isLoading={isLoading} defaultText="Continue" />
        </form>

        {/* Footer with Sign In link */}
        <AuthFooter 
          text="Already have an account?"
          linkText="Sign In"
          linkPath="/login"
        />
      </div>
    </div>
  );
}
