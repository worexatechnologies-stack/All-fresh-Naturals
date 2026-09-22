import { Component, type ErrorInfo, type ReactNode } from 'react';
import logo from '../assets/logo.jpg';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in React tree caught by ErrorBoundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCacheAndReload = () => {
    try {
      localStorage.removeItem('afn_products_cache_v7');
      localStorage.removeItem('afn_products_cache_v6');
      localStorage.removeItem('afn_products_cache_v5');
      sessionStorage.clear();
    } catch {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fbf8f2',
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          padding: '24px',
          color: '#1a3826'
        }}>
          <div style={{
            maxWidth: '520px',
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '40px 32px',
            boxShadow: '0 20px 45px rgba(27, 67, 50, 0.08)',
            border: '1px solid rgba(27, 67, 50, 0.1)',
            textAlign: 'center'
          }}>
            <img
              src={logo}
              alt="All Fresh Naturals"
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                objectFit: 'cover',
                margin: '0 auto 18px',
                boxShadow: '0 4px 14px rgba(27, 67, 50, 0.12)'
              }}
            />
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.75rem',
              fontWeight: 700,
              color: '#1b4332',
              margin: '0 0 10px'
            }}>
              Something Went Wrong
            </h2>
            <p style={{
              fontSize: '0.95rem',
              color: '#556b5e',
              lineHeight: 1.6,
              margin: '0 0 24px'
            }}>
              The application encountered a temporary display issue. Please refresh the page or reset the local cache to restore full functionality.
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  width: '100%',
                  padding: '13px 20px',
                  backgroundColor: '#1b4332',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(27, 67, 50, 0.25)',
                  transition: 'background-color 0.2s ease'
                }}
              >
                Reload Page
              </button>

              <button
                type="button"
                onClick={this.handleResetCacheAndReload}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  backgroundColor: '#f5efe4',
                  color: '#1b4332',
                  border: '1px solid #d4c5b3',
                  borderRadius: '50px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                Reset Site Cache & Return Home
              </button>
            </div>

            {this.state.error && (
              <details style={{
                textAlign: 'left',
                backgroundColor: '#f9f9f9',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid #e5e5e5',
                fontSize: '0.8rem',
                color: '#666',
                wordBreak: 'break-all'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 600, color: '#991b1b' }}>
                  Technical Details
                </summary>
                <p style={{ margin: '8px 0 0', fontFamily: 'monospace' }}>
                  {this.state.error.toString()}
                </p>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
