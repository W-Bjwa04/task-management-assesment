// Register page — name, email, password form, links to login.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import {
  validateName,
  validateEmail,
  validatePassword,
  getPasswordStrength,
} from '../utils/validators';
import './AuthPages.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(password);

  const handleNameChange = (value) => {
    setName(value);
    if (value && !validateName(value).valid) {
      setNameError(validateName(value).error);
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    if (value && !validateEmail(value).valid) {
      setEmailError(validateEmail(value).error);
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (value && !validatePassword(value).valid) {
      setPasswordError(validatePassword(value).error);
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Final validation before submit
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    if (!nameValidation.valid) {
      setNameError(nameValidation.error);
      return;
    }
    if (!emailValidation.valid) {
      setEmailError(emailValidation.error);
      return;
    }
    if (!passwordValidation.valid) {
      setPasswordError(passwordValidation.error);
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    name.trim() &&
    email.trim() &&
    password &&
    !nameError &&
    !emailError &&
    !passwordError;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-card__header">
          <svg className="auth-card__logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
            <path d="M9 14l2 2 4-4" />
          </svg>
          <h1 className="auth-card__title">Create account</h1>
          <p className="auth-card__subtitle">Get started with TaskFlow for free</p>
        </div>

        {error && <div className="auth-card__alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-card__form">
          <div>
            <Input
              id="register-name"
              label="Full name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="John Doe"
              required
            />
            {nameError && <p className="auth-card__field-error">{nameError}</p>}
            <p className="auth-card__hint">Letters, spaces, hyphens, and apostrophes only</p>
          </div>

          <div>
            <Input
              id="register-email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder="you@example.com"
              required
            />
            {emailError && <p className="auth-card__field-error">{emailError}</p>}
          </div>

          <div>
            <Input
              id="register-password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Min. 8 characters"
              required
            />
            {password && (
              <div className={`auth-card__password-strength auth-card__password-strength--${passwordStrength}`}>
                <span>Strength: </span>
                <span className="auth-card__strength-label">{passwordStrength}</span>
              </div>
            )}
            {passwordError && <p className="auth-card__field-error">{passwordError}</p>}
            <p className="auth-card__hint">
              • At least 8 characters • One uppercase letter • One lowercase letter • One number
            </p>
          </div>

          <Button
            type="submit"
            fullWidth
            disabled={loading || !isFormValid}
            id="register-submit-btn"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-card__link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
