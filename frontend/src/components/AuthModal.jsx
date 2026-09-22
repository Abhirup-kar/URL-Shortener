import { useState } from 'react';
import styles from './auth-modal.module.css';
import { backendAPI } from '../services/backend-connector';

const AuthModal = ({ isOpen, onClose, initialView = 'login', onAuthSuccess }) => {
  const [view, setView] = useState(initialView); // 'login' or 'signup'
  const [email, setEmail] = useState('');
  const [username,setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (view === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      if (view === 'login') {
        /**
         * BACKEND CONNECTION POINT - LOGIN
         * Triggered when user submits email & password credentials.
         */
        const user = await backendAPI.login(email, password);
        onAuthSuccess(user);
        onClose();
      } else {
        /**
         * BACKEND CONNECTION POINT - SIGNUP
         * Triggered when creating a new account.
         */
        const result = await backendAPI.signup(username, email, password);
        // Automatically log user in after successful signup
        const user = await backendAPI.login(email, password);
        onAuthSuccess(user);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchView = () => {
    setView(view === 'login' ? 'signup' : 'login');
    setError('');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className={styles.modalBody}>
          <h2 className={styles.title}>
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className={styles.subtitle}>
            {view === 'login'
              ? 'Enter your credentials to access your dashboard'
              : 'Sign up to start tracking and custom-branding your links'}
          </p>

          {error && (
            <div className={styles.errorAlert}>
              <svg className={styles.errorIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {view === 'signup' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Username</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    type="text"
                    className={styles.input}
                    placeholder="Ram kumar"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={view === 'signup'}
                  />
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  type="password"
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {view === 'signup' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    type="password"
                    className={styles.input}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required={view === 'signup'}
                  />
                </div>
              </div>
            )}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (
                <>
                  <div className={styles.spinner}></div>
                  {view === 'login' ? 'Signing In...' : 'Registering...'}
                </>
              ) : (
                view === 'login' ? 'Sign In' : 'Get Started Free'
              )}
            </button>
          </form>

          <p className={styles.switchText}>
            {view === 'login' ? "Don't have an account? " : "Already have an account? "}
            <span className={styles.switchLink} onClick={handleSwitchView}>
              {view === 'login' ? 'Sign Up' : 'Sign In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
