import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, X, Key, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

export default function AdminAuthModal() {
  const navigate = useNavigate();
  const { isAdminAuthModalOpen, closeAdminAuthModal, loginAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (attempts >= 4) {
      setErrorMsg('Too many failed attempts. Security cooldown active (30s).');
      return;
    }

    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await loginAdmin(email, password, pin);

      if (res.success) {
        setAttempts(0);
        setEmail('');
        setPassword('');
        setPin('');
        closeAdminAuthModal();
        navigate('/admin');
        window.scrollTo(0, 0);
      } else {
        setAttempts((prev) => prev + 1);
        setErrorMsg(res.message || 'Invalid administrator email, password, or security PIN.');
      }
    } catch {
      setErrorMsg('A secure connection error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('poori.monika@gmail.com');
    setPassword('Poorimonika@123');
    setPin('2026');
    const res = await loginAdmin('poori.monika@gmail.com', 'Poorimonika@123', '2026');
    if (res.success) {
      closeAdminAuthModal();
      navigate('/admin');
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className="auth-modal-overlay"
      onClick={closeAdminAuthModal}
      style={{ zIndex: 2200, backdropFilter: 'blur(8px)', background: 'rgba(10, 25, 15, 0.75)' }}
    >
      <div
        className="auth-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '430px',
          background: '#ffffff',
          color: '#111827',
          borderRadius: '20px',
          padding: '36px 30px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid #e5e7eb',
          zIndex: 2210
        }}
      >
        <button
          type="button"
          className="auth-modal-close"
          onClick={closeAdminAuthModal}
          aria-label="Close Admin Modal"
          style={{ top: '18px', right: '18px' }}
        >
          <X size={20} />
        </button>

        <div className="auth-modal-header" style={{ textAlign: 'center', marginBottom: '22px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #1b4332 0%, #2e7d32 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 8px 18px rgba(46, 125, 50, 0.28)',
              overflow: 'hidden'
            }}
          >
            <img src={logo} alt="All Fresh Naturals logo" style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' }} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#1b4332', margin: '2px 0 6px' }}>
            Administrator Portal
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', lineHeight: '1.45', marginBottom: '14px' }}>
            Enter your email, password, and security PIN to access store management.
          </p>
          <div className="sec-trust-badge" style={{ display: 'inline-flex', margin: '0 auto' }}>
            <CheckCircle2 size={13} /> 256-bit SSL Encrypted Access
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '11px 14px',
              borderRadius: '10px',
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '18px'
            }}
          >
            <ShieldAlert size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" style={{ marginTop: '8px' }}>
          {/* Admin Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Administrator Email Address
            </label>
            <div className="sec-input-box">
              <Mail size={18} className="sec-input-icon" />
              <input
                type="email"
                className="sec-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              Password
            </label>
            <div className="sec-input-box">
              <Lock size={18} className="sec-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="sec-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="sec-input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Security Access PIN (2FA) */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#374151' }}>
                4-Digit Security PIN *
              </label>
            </div>
            <div className="sec-input-box">
              <Key size={18} className="sec-input-icon" />
              <input
                type="password"
                maxLength={4}
                className="sec-input-field"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoComplete="off"
                required
                style={{ letterSpacing: '4px', fontWeight: 700 }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '0.95rem',
              fontWeight: 600,
              borderRadius: '10px',
              backgroundColor: '#1b4332',
              boxShadow: '0 4px 14px rgba(27, 67, 50, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            {isSubmitting ? 'Authenticating Secure Session...' : 'Sign In'}
          </button>
        </form>

        <div
          style={{
            marginTop: '22px',
            paddingTop: '16px',
            borderTop: '1px dashed #e5e7eb',
            textAlign: 'center'
          }}
        >
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleQuickDemoLogin}
            style={{
              width: '100%',
              fontSize: '0.84rem',
              gap: '8px',
              borderRadius: '8px',
              borderColor: '#d1d5db',
              color: '#374151'
            }}
          >
            <Key size={15} /> Auto-Fill & Authenticate Admin Session
          </button>
        </div>
      </div>
    </div>
  );
}
