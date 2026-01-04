/**
 * LOGIN PAGE COMPONENT (REFACTORED - MODULAR)
 * ============================================
 * Uses reusable components and custom hooks
 * Much cleaner and more maintainable than before
 * 
 * Components Used:
 * - useForm: Custom hook for form state management
 * - FormInput: Reusable input field component
 * - ErrorMessage: Reusable error display component
 * - AuthHeader: Reusable header with icon/title
 * - AuthFooter: Reusable footer with links
 * - SubmitButton: Reusable submit button component
 */

import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import FormInput from '../components/FormInput';
import ErrorMessage from '../components/ErrorMessage';
import AuthHeader from '../components/AuthHeader';
import AuthFooter from '../components/AuthFooter';
import SubmitButton from '../components/SubmitButton';
import { login, setAuthToken } from '../api';
import '../styles/Auth.css';

export default function Login() {
  // ===== STATE & HOOKS =====
  const { formData, error, isLoading, setError, setIsLoading, handleInputChange } = useForm({
    email: '',
    password: ''
  });
  const navigate = useNavigate();

  // ===== CLEAR FIELDS ON FOCUS =====
  const handleFieldFocus = (fieldName) => {
    // Clear the field when user focuses on it
    handleInputChange({
      target: { name: fieldName, value: '' }
    });
  };

  // ===== FORM SUBMISSION HANDLER =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email');
      setIsLoading(false);
      return;
    }

    try {
      const result = await login({ email: formData.email, password: formData.password });
      setAuthToken(result.access_token);
      navigate('/home');
      setIsLoading(false);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="auth-container">
      <div className="auth-card">
        
        {/* Header with icon and title */}
        <AuthHeader 
          title="Welcome Back" 
          subtitle="Sign in to continue"
        />

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* Email Input */}
          <FormInput
            label="Email"
            id="email"
            type="email"
            name="email"
            placeholder="example: user@email.com"
            value={formData.email}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('email')}
          />

          {/* Password Input */}
          <FormInput
            label="Password"
            id="password"
            type="password"
            name="password"
            placeholder="example: Password@123"
            value={formData.password}
            onChange={handleInputChange}
            onFocus={() => handleFieldFocus('password')}
          />

          {/* Error Display */}
          <ErrorMessage message={error} />

          {/* Forgot Password Link */}
          <a href="/forgot-password" className="forgot-password-link">
            Forgot password?
          </a>

          {/* Submit Button */}
          <SubmitButton isLoading={isLoading} defaultText="Sign In" />
        </form>

        {/* Footer with Sign Up link */}
        <AuthFooter 
          text="Don't have an account?"
          linkText="Sign Up"
          linkPath="/signup"
        />
      </div>
    </div>
  );
}
