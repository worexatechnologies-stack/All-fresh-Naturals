import { type ReactNode, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, UserCheck } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

export default function ProtectedRoute({
  children,
  fallbackTitle = 'Account Login Required',
  fallbackMessage = 'Please sign in or create an account to make a purchase, send feedback, or contact our team.'
}: ProtectedRouteProps) {
  const { isAuthenticated, openAuthModal } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal();
    }
  }, [isAuthenticated, openAuthModal]);

  if (!isAuthenticated) {
    return (
      <div style={{ padding: '80px 24px', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', padding: '36px 24px', background: '#ffffff', borderRadius: '16px', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)', margin: '0 auto' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-color)', fontSize: '1.4rem', marginBottom: '8px' }}>
            {fallbackTitle}
          </h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '20px', lineHeight: 1.5 }}>
            {fallbackMessage}
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAuthModal}
            style={{ width: '100%', padding: '12px', borderRadius: '24px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            <UserCheck size={18} /> Sign In / Create Account
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
