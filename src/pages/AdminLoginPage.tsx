import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.jpg';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin, isAdminLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If already logged in, navigate to control center
  if (isAdminLoggedIn) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await loginAdmin(email, password, pin);
      if (res.success) {
        navigate('/admin');
      } else {
        setErrorMsg(res.message || 'Invalid administrator email, password, or PIN.');
      }
    } catch {
      setErrorMsg('Could not connect to database server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title id="metaTitle">Admin Portal Login | All Fresh Naturals</title>

        <meta
          name="description"
          id="metaDescription"
          content="All Fresh Naturals Secure Administrator Portal Gateway Login."
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="Admin Portal Login | All Fresh Naturals"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Secure Administrator Gateway for All Fresh Naturals."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/admin/login"
        />

        <meta
          id="ogSiteName"
          property="og:site_name"
          content="All Fresh Naturals"
        />

        <meta
          id="author"
          name="author"
          content="All Fresh Naturals"
        />

        <link
          id="canonical"
          rel="canonical"
          href="https://allfreshnaturals.com/admin/login"
        />

        <meta
          id="indexingStatus"
          name="robots"
          content="noindex, nofollow"
        />

        <meta
          id="Publisher"
          property="publisher"
          content="All Fresh Naturals"
        />

        <meta
          property="og:locale"
          content="en_US"
        />
      </Helmet>

      <div
        className="admin-login-page"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          minHeight: '100vh',
          width: '100vw',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 16px',
          boxSizing: 'border-box',
          overflowY: 'auto',
          background: 'radial-gradient(ellipse at 50% 10%, #f8fafc 0%, #eef2f6 55%, #e2e8f0 100%)'
        }}
      >
      <div
        className="admin-login-card"
        style={{
          maxWidth: '430px',
          width: '100%',
          background: '#ffffff',
          borderRadius: '20px',
          boxShadow: '0 24px 48px -12px rgba(15, 23, 42, 0.09), 0 4px 12px rgba(15, 23, 42, 0.04)',
          border: '1px solid #e2e8f0',
          padding: '38px 32px 30px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Minimalist Emerald Top Accent Bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
          }}
        />

        {/* Portal Header */}
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              boxShadow: '0 6px 16px rgba(15, 23, 42, 0.06), 0 0 0 1px #e2e8f0',
              overflow: 'hidden',
              padding: '3px'
            }}
          >
            <img src={logo} alt="All Fresh Naturals logo" style={{ width: '100%', height: '100%', borderRadius: '13px', objectFit: 'cover' }} />
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
              color: '#0f172a',
              fontSize: '1.5rem',
              fontWeight: 800,
              marginBottom: '5px',
              letterSpacing: '-0.025em'
            }}
          >
            Control Center Sign In
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0, fontWeight: 500 }}>
            All Fresh Naturals • Secure Administrator Gateway
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginBottom: '18px',
              textAlign: 'center'
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Email Address */}
          <div>
            <label
              htmlFor="admin-login-email"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <Mail size={13} style={{ color: '#10b981' }} /> Admin Email Address *
            </label>
            <input
              id="admin-login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
              placeholder="admin@allfreshnaturals.com"
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                border: '1.5px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.88rem',
                color: '#0f172a',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'all 0.2s ease',
                fontWeight: 500
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
                e.currentTarget.style.background = '#ffffff';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.background = '#f8fafc';
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="admin-login-password"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <Lock size={13} style={{ color: '#10b981' }} /> Master Password *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-login-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                required
                placeholder="Enter master password"
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#f8fafc',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  fontWeight: 500
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
                  e.currentTarget.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              />
              <button
                className="admin-login-reveal"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide Password' : 'Show Password'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Security Access PIN */}
          <div>
            <label
              htmlFor="admin-login-pin"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#334155',
                marginBottom: '6px',
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}
            >
              <KeyRound size={13} style={{ color: '#10b981' }} /> 4-Digit Security PIN *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-login-pin"
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                inputMode="numeric"
                pattern="[0-9]*"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoComplete="off"
                required
                placeholder="4-digit PIN"
                style={{
                  width: '100%',
                  padding: '11px 40px 11px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #e2e8f0',
                  background: '#f8fafc',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.2s ease',
                  fontWeight: 500
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#10b981';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
                  e.currentTarget.style.background = '#ffffff';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.background = '#f8fafc';
                }}
              />
              <button
                className="admin-login-reveal"
                type="button"
                onClick={() => setShowPin(!showPin)}
                title={showPin ? 'Hide PIN' : 'Show PIN'}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94a3b8',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '6px'
                }}
              >
                {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            className="admin-login-submit"
            type="submit"
            disabled={loading}
            style={{
              marginTop: '6px',
              width: '100%',
              padding: '12px 20px',
              borderRadius: '10px',
              background: '#0f172a',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.9rem',
              fontWeight: 700,
              letterSpacing: '0.01em',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(15, 23, 42, 0.18)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.35)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#0f172a';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(15, 23, 42, 0.18)';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {loading ? 'Authenticating Session...' : 'Sign In as Administrator'} <ArrowRight size={16} />
          </button>
        </form>

        {/* Footer Navigation */}
        <div style={{ marginTop: '22px', textAlign: 'center', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#64748b',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#0f172a'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; }}
          >
            <ArrowLeft size={14} /> Return to Storefront
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}
