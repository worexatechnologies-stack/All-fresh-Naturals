import { useState } from 'react';
import {
  X, Mail, Lock, User, Phone, ShieldCheck,
  Eye, EyeOff, RefreshCw, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../config/api';
import logo from '../assets/logo.jpg';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login, signup } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot-email' | 'forgot-otp' | 'forgot-new-password'>('signin');

  // Sign In states
  const [signInInput, setSignInInput] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  // Sign Up states
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);

  // Forgot Password / OTP states
  const [resetEmail, setResetEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await login(signInInput, signInPassword);
      if (!res.success) {
        setMessage({ type: 'error', text: res.message || 'Invalid credentials. Please try again or create an account.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Invalid credentials. Please try again or create an account.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await signup(signUpName, signUpEmail, signUpPhone, signUpPassword);
      if (!res.success) {
        setMessage({ type: 'error', text: res.message || 'Could not complete registration. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not complete registration. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Send OTP to email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = resetEmail.trim();
    if (!cleanEmail) {
      setMessage({ type: 'error', text: 'Please enter your registered email address.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await apiFetch('/users/send-reset-otp', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: data.message || `A 6-digit OTP code has been sent to ${cleanEmail}.` });
        setOtpInput('');
        setTab('forgot-otp');
      } else {
        setMessage({ type: 'error', text: data.message || 'No registered account found with this email.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not connect to backend server. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = resetEmail.trim();
    const cleanOtp = otpInput.trim();

    if (!cleanEmail || !cleanOtp) {
      setMessage({ type: 'error', text: 'Please enter the 6-digit OTP code sent to your email.' });
      return;
    }

    if (cleanOtp.length !== 6) {
      setMessage({ type: 'error', text: 'OTP code must be 6 digits.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await apiFetch('/users/verify-reset-otp', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'OTP verified successfully! Please enter your new password below.' });
        setNewPasswordInput('');
        setTab('forgot-new-password');
      } else {
        setMessage({ type: 'error', text: data.message || 'Invalid or expired OTP code.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not verify OTP. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPasswordWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = resetEmail.trim();
    const cleanPass = newPasswordInput.trim();

    if (!cleanEmail || !cleanPass) {
      setMessage({ type: 'error', text: 'Please enter your new password.' });
      return;
    }

    if (cleanPass.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await apiFetch('/users/reset-password-otp', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, otp: otpInput.trim(), newPassword: cleanPass })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: 'success', text: 'Your password has been updated successfully! Reloading page...' });
        setSignInInput(cleanEmail);
        setSignInPassword(cleanPass);
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setMessage({ type: 'error', text: data.message || 'Could not update password. Please try again.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Could not update password. Please try again.' });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="am-overlay" onClick={closeAuthModal} role="dialog" aria-modal="true">
      <div className="am-card" onClick={(e) => e.stopPropagation()}>
        {/* ── LEFT PANEL (Organic Green Wave Side) ── */}
        <div className="am-side-panel">
          <div className="am-side-content">
            <div className="am-side-logo-circle">
              <img src={logo} alt="All Fresh Naturals logo" className="am-side-logo-img" />
            </div>
            <span className="am-side-brand">All Fresh Naturals</span>

            {tab === 'signin' && (
              <>
                <h2 className="am-side-heading">Welcome Back!</h2>
                <p className="am-side-sub">To stay connected with us please login with your personal info</p>
                <button
                  type="button"
                  className="am-side-outline-btn"
                  onClick={() => { setTab('signup'); setMessage(null); }}
                >
                  SIGN UP
                </button>
              </>
            )}

            {tab === 'signup' && (
              <>
                <h2 className="am-side-heading">Welcome Back!</h2>
                <p className="am-side-sub">To stay connected with us please login with your personal info</p>
                <button
                  type="button"
                  className="am-side-outline-btn"
                  onClick={() => { setTab('signin'); setMessage(null); }}
                >
                  SIGN IN
                </button>
              </>
            )}

            {(tab === 'forgot-email' || tab === 'forgot-otp' || tab === 'forgot-new-password') && (
              <>
                <h2 className="am-side-heading">Welcome Back!</h2>
                <p className="am-side-sub">To stay connected with us please login with your personal info</p>
                <button
                  type="button"
                  className="am-side-outline-btn"
                  onClick={() => { setTab('signin'); setMessage(null); }}
                >
                  SIGN IN
                </button>
              </>
            )}

            <div className="am-side-footer-tag">
              <span>100% PURE</span>
              <span className="am-side-divider">|</span>
              <span>HOMEMADE NUTRITION</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL (Form Side with Pill Inputs) ── */}
        <div className="am-form-panel">
          {/* Close Cross Button */}
          <button
            type="button"
            className="am-close-cross-btn"
            onClick={closeAuthModal}
            aria-label="Close modal"
            title="Close"
          >
            <X size={18} />
          </button>

          {/* Green corner decorative accent */}
          <div className="am-corner-accent" aria-hidden="true" />

          <div className="am-form-header">
            {tab === 'signin' && (
              <>
                <h3 className="am-title">welcome</h3>
                <p className="am-sub">Login in to your account to continue</p>
              </>
            )}

            {tab === 'signup' && (
              <>
                <h3 className="am-title">Create Account</h3>
                <p className="am-sub">Create an account for quick checkouts & fresh batch updates.</p>
              </>
            )}

            {tab === 'forgot-email' && (
              <>
                <h3 className="am-title">Forgot Password?</h3>
                <p className="am-sub">Enter your registered email to receive a 6-digit OTP code.</p>
              </>
            )}

            {tab === 'forgot-otp' && (
              <>
                <h3 className="am-title">Verify OTP Code</h3>
                <p className="am-sub">Enter the 6-digit code sent to <strong>{resetEmail}</strong></p>
              </>
            )}

            {tab === 'forgot-new-password' && (
              <>
                <h3 className="am-title">Set New Password</h3>
                <p className="am-sub">OTP verified! Choose a strong password for your account.</p>
              </>
            )}
          </div>

          {/* Status Alert Message Banner */}
          {message && (
            <div className={`am-alert am-alert--${message.type}`}>
              {message.type === 'error' ? '⚠️ ' : '✅ '}
              {message.text}
            </div>
          )}

          {/* ════════════════════════════════════════════════
              TAB 1: SIGN IN
          ════════════════════════════════════════════════ */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="am-form">
              <div className="am-field">
                <div className="am-input-wrap">
                  <Mail size={16} className="am-input-icon" />
                  <input
                    id="am-signin-email"
                    type="text"
                    placeholder="Email or Mobile Number"
                    value={signInInput}
                    onChange={(e) => setSignInInput(e.target.value)}
                    required
                    className="am-input"
                  />
                </div>
              </div>

              <div className="am-field">
                <div className="am-input-wrap">
                  <Lock size={16} className="am-input-icon" />
                  <input
                    id="am-signin-pass"
                    type={showSignInPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                    className="am-input am-input--pass"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword((prev) => !prev)}
                    className="am-eye-btn"
                    title={showSignInPassword ? 'Hide password' : 'View password'}
                    aria-label={showSignInPassword ? 'Hide password' : 'View password'}
                  >
                    {showSignInPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="am-forgot-row">
                <button
                  type="button"
                  className="am-forgot-link"
                  onClick={() => {
                    setTab('forgot-email');
                    setResetEmail(signInInput.includes('@') ? signInInput : '');
                    setMessage(null);
                  }}
                >
                  Forgot your password?
                </button>
              </div>

              <button type="submit" className="am-submit-btn" disabled={loading}>
                {loading ? 'Logging in...' : 'LOG IN'}
              </button>

              <div className="am-switch-footer">
                <span>Don't have an account? </span>
                <button
                  type="button"
                  className="am-switch-link"
                  onClick={() => { setTab('signup'); setMessage(null); }}
                >
                  sign up
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════
              TAB 2: SIGN UP
          ════════════════════════════════════════════════ */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="am-form">
              <div className="am-field">
                <div className="am-input-wrap">
                  <User size={16} className="am-input-icon" />
                  <input
                    id="am-signup-name"
                    type="text"
                    placeholder="Full Name"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                    className="am-input"
                  />
                </div>
              </div>

              <div className="am-grid-2">
                <div className="am-field">
                  <div className="am-input-wrap">
                    <Mail size={16} className="am-input-icon" />
                    <input
                      id="am-signup-email"
                      type="email"
                      placeholder="Email Address"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      required
                      className="am-input"
                    />
                  </div>
                </div>

                <div className="am-field">
                  <div className="am-input-wrap">
                    <Phone size={16} className="am-input-icon" />
                    <input
                      id="am-signup-phone"
                      type="tel"
                      maxLength={10}
                      placeholder="WhatsApp Number"
                      value={signUpPhone}
                      onChange={(e) => setSignUpPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      required
                      className="am-input"
                    />
                  </div>
                </div>
              </div>

              <div className="am-field">
                <div className="am-input-wrap">
                  <Lock size={16} className="am-input-icon" />
                  <input
                    id="am-signup-pass"
                    type={showSignUpPassword ? 'text' : 'password'}
                    placeholder="Create Password (min 6 chars)"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                    minLength={6}
                    className="am-input am-input--pass"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword((prev) => !prev)}
                    className="am-eye-btn"
                    title={showSignUpPassword ? 'Hide password' : 'View password'}
                    aria-label={showSignUpPassword ? 'Hide password' : 'View password'}
                  >
                    {showSignUpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="am-submit-btn" disabled={loading}>
                {loading ? 'Creating Account...' : 'SIGN UP'}
              </button>

              <div className="am-switch-footer">
                <span>Already have an account? </span>
                <button
                  type="button"
                  className="am-switch-link"
                  onClick={() => { setTab('signin'); setMessage(null); }}
                >
                  log in
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════
              STEP 1: FORGOT PASSWORD - EMAIL INPUT
          ════════════════════════════════════════════════ */}
          {tab === 'forgot-email' && (
            <form onSubmit={handleSendOtp} className="am-form">
              <div className="am-field">
                <div className="am-input-wrap">
                  <Mail size={16} className="am-input-icon" />
                  <input
                    id="am-reset-email"
                    type="email"
                    placeholder="Registered Email Address"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="am-input"
                  />
                </div>
              </div>

              <button type="submit" className="am-submit-btn" disabled={loading}>
                {loading ? 'Sending OTP...' : 'SEND OTP'}
              </button>

              <div className="am-switch-footer">
                <button
                  type="button"
                  onClick={() => { setTab('signin'); setMessage(null); }}
                  className="am-back-link"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════
              STEP 2: FORGOT PASSWORD - VERIFY OTP
          ════════════════════════════════════════════════ */}
          {tab === 'forgot-otp' && (
            <form onSubmit={handleVerifyOtp} className="am-form">
              <div className="am-field">
                <input
                  id="am-otp-code"
                  type="text"
                  maxLength={6}
                  placeholder="• • • • • •"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                  required
                  className="am-input am-input--otp"
                />
              </div>

              <button type="submit" className="am-submit-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'VERIFY OTP'}
              </button>

              <div className="am-otp-actions-row">
                <button
                  type="button"
                  onClick={() => { setTab('forgot-email'); setMessage(null); }}
                  className="am-text-btn"
                >
                  <ArrowLeft size={14} /> Change Email
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="am-text-btn am-text-btn--primary"
                >
                  <RefreshCw size={13} /> Resend OTP
                </button>
              </div>
            </form>
          )}

          {/* ════════════════════════════════════════════════
              STEP 3: FORGOT PASSWORD - NEW PASSWORD
          ════════════════════════════════════════════════ */}
          {tab === 'forgot-new-password' && (
            <form onSubmit={handleResetPasswordWithOtp} className="am-form">
              <div className="am-field">
                <div className="am-input-wrap">
                  <Lock size={16} className="am-input-icon" />
                  <input
                    id="am-new-pass"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter New Password (min 6 chars)"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    required
                    minLength={6}
                    className="am-input am-input--pass"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="am-eye-btn"
                    title={showNewPassword ? 'Hide password' : 'View password'}
                    aria-label={showNewPassword ? 'Hide password' : 'View password'}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="am-submit-btn" disabled={loading}>
                {loading ? 'Updating...' : 'UPDATE PASSWORD'}
              </button>
            </form>
          )}

          {/* Security Reassurance Note */}
          <div className="am-footer-note">
            <ShieldCheck size={14} />
            <span>100% Safe & Secure • Your data is always private</span>
          </div>
        </div>
      </div>
    </div>
  );
}
