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

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import FormInput from '../components/FormInput';
import ErrorMessage from '../components/ErrorMessage';
import AuthHeader from '../components/AuthHeader';
import AuthFooter from '../components/AuthFooter';
import SubmitButton from '../components/SubmitButton';
import { login, googleLogin, setAuthToken } from '../api';
import '../styles/Auth.css';

export default function Login() {
  // ===== STATE & HOOKS =====
  const { formData, error, isLoading, setError, setIsLoading, handleInputChange } = useForm({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleGoogleCredentialResponse = async (response) => {
    const idToken = response?.credential;
    if (!idToken) {
      setError('Google sign-in failed');
      return;
    }

    setIsLoading(true);
    try {
      const result = await googleLogin(idToken);
      setAuthToken(result.access_token);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId) return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse,
      });
      const buttonTarget = document.getElementById('google-signin-button');
      if (buttonTarget) {
        window.google.accounts.id.renderButton(buttonTarget, {
          theme: 'outline',
          size: 'large',
          width: '100%',
        });
      }
    };

    if (window.google?.accounts?.id) {
      initGoogle();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [googleClientId]);

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

        {/* Google One Tap / button */}
        <div className="oauth-block">
          <div id="google-signin-button" style={{ width: '100%' }} />
          {!googleClientId && (
            <p className="oauth-hint">Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in.</p>
          )}
        </div>

        <div className="oauth-divider">
          <span className="oauth-line" />
          <span className="oauth-text">or continue with email</span>
          <span className="oauth-line" />
        </div>

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
