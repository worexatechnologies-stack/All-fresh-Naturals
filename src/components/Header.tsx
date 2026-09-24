import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Package, ShoppingBag, User, LogOut, ChevronDown, X, Menu, BookOpen, UserCog } from 'lucide-react';
import logo from '../assets/logo.jpg';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import EditProfileModal from './EditProfileModal';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { cartCount, openCart } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAdminPage = location.pathname.startsWith('/admin');

  const handleMobileNav = (to: string) => {
    setMenuOpen(false);
    navigate(to);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/products', label: 'Our Products' },
    { to: '/articles', label: 'Articles' },
    { to: '/contact', label: 'Contact Us' },
  ];

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="afn-header-root">
      {/* ── Main Navigation ── */}
      <header className="afn-navbar">
        <div className="afn-navbar-inner">

          {/* Logo */}
          <Link to="/" className="afn-logo" aria-label="All Fresh Naturals — Home">
            <img src={logo} alt="All Fresh Naturals" className="afn-logo-img" />
            <div className="afn-logo-text">
              <span className="afn-logo-line1">All Fresh</span>
              <span className="afn-logo-line2">Naturals</span>
            </div>
          </Link>

          {/* Desktop Center Nav */}
          <nav className="afn-nav-center" aria-label="Main navigation">
            <ul className="afn-nav-list">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={`afn-nav-link${isActive(item.to) ? ' afn-nav-link--active' : ''}`}
                  >
                    {isActive(item.to) && <span className="afn-active-glow-dot" />}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Actions */}
          <div className="afn-nav-actions">

            {/* User Auth */}
            {!isAdminPage && (
              isAuthenticated ? (
                <div ref={dropdownRef} className="afn-user-wrap">
                  <button
                    type="button"
                    className={`afn-user-btn${profileOpen ? ' afn-user-btn--active' : ''}`}
                    onClick={() => setProfileOpen(p => !p)}
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                    title="My Profile & Account Settings"
                  >
                    <span className="afn-user-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                    <span className="afn-user-name">
                      My Profile
                    </span>
                    <ChevronDown size={14} className={`afn-user-chevron${profileOpen ? ' afn-user-chevron--open' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="afn-user-dropdown">
                      <div className="afn-dropdown-header">
                        <span className="afn-dropdown-avatar">
                          {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                        <div className="afn-dropdown-info">
                          <div className="afn-dropdown-name">{user?.name || 'Valued Customer'}</div>
                          <div className="afn-dropdown-contact">{user?.phone || user?.email || 'Logged In'}</div>
                          <span className="afn-dropdown-badge">🌿 Verified Customer</span>
                        </div>
                      </div>
                      <div className="afn-dropdown-body">
                        <button
                          type="button"
                          className="afn-dropdown-link"
                          onClick={() => {
                            setProfileOpen(false);
                            setEditProfileOpen(true);
                          }}
                        >
                          <UserCog size={16} />
                          <span>Edit Personal Details</span>
                        </button>
                        <Link to="/my-orders" onClick={() => setProfileOpen(false)} className="afn-dropdown-link afn-dropdown-link--primary">
                          <ShoppingBag size={16} />
                          <span>My Orders</span>
                        </Link>
                        <Link to="/products" onClick={() => setProfileOpen(false)} className="afn-dropdown-link">
                          <Package size={16} />
                          <span>Browse Products</span>
                        </Link>
                      </div>
                      <div className="afn-dropdown-footer">
                        <button type="button" className="afn-dropdown-logout" onClick={() => { logout(); setProfileOpen(false); }}>
                          <LogOut size={15} />
                          <span>Sign Out / Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="afn-login-btn"
                  onClick={openAuthModal}
                  aria-label="Sign in to your account"
                >
                  <User size={15} />
                  <span className="afn-login-text">Login / Register</span>
                </button>
              )
            )}

            {/* Cart Button */}
            <button
              type="button"
              className="afn-cart-btn"
              onClick={openCart}
              aria-label={`Open cart — ${cartCount} items`}
            >
              <span className="afn-cart-icon-wrap">
                <ShoppingBag size={17} />
              </span>
              <span className="afn-cart-label">Cart</span>
              {cartCount > 0 && (
                <span className="afn-cart-count">{cartCount}</span>
              )}
            </button>



            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="afn-hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Menu Drawer Portal (Only mounted when menuOpen is true to completely prevent touch collisions) ── */}
      {menuOpen && createPortal(
        <>
          <div
            className="afn-mobile-backdrop"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
            style={{ pointerEvents: 'auto' }}
          />
          <div
            className="afn-mobile-drawer afn-mobile-drawer--open"
            aria-hidden={false}
            data-lenis-prevent="true"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="afn-mobile-drawer-top">
              <div
                className="afn-logo"
                onClick={() => handleMobileNav('/')}
                style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                role="button"
                tabIndex={0}
              >
                <img src={logo} alt="All Fresh Naturals" className="afn-logo-img" />
                <div className="afn-logo-text">
                  <span className="afn-logo-line1">All Fresh</span>
                  <span className="afn-logo-line2">Naturals</span>
                </div>
              </div>
              <button
                type="button"
                className="afn-mobile-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                style={{ pointerEvents: 'auto' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Prominent Auth Section at TOP of Mobile Drawer */}
            {!isAdminPage && (
              isAuthenticated ? (
                <div className="afn-mobile-user-card" style={{ pointerEvents: 'auto' }}>
                  <div className="afn-mobile-user-info">
                    <span className="afn-mobile-user-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
                    <div className="afn-mobile-user-text">
                      <div className="afn-mobile-user-name">{user?.name || 'Valued Customer'}</div>
                      <div className="afn-mobile-user-sub">{user?.phone || user?.email || 'Logged In'}</div>
                    </div>
                  </div>
                  <div className="afn-mobile-user-actions-grid">
                    <button
                      type="button"
                      className="afn-mobile-edit-btn"
                      style={{ pointerEvents: 'auto' }}
                      onClick={() => {
                        setMenuOpen(false);
                        setEditProfileOpen(true);
                      }}
                    >
                      <UserCog size={15} /> Edit Details
                    </button>
                    <button
                      type="button"
                      className="afn-mobile-orders-btn"
                      style={{ pointerEvents: 'auto' }}
                      onClick={() => handleMobileNav('/my-orders')}
                    >
                      <ShoppingBag size={15} /> My Orders
                    </button>
                  </div>
                  <button
                    type="button"
                    className="afn-mobile-logout-btn"
                    style={{ pointerEvents: 'auto' }}
                    onClick={() => { logout(); setMenuOpen(false); }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="afn-mobile-auth-banner-wrap" style={{ pointerEvents: 'auto' }}>
                  <button
                    type="button"
                    className="afn-mobile-login-banner"
                    style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                    onClick={() => {
                      setMenuOpen(false);
                      openAuthModal();
                    }}
                  >
                    <div className="afn-mobile-login-banner-left">
                      <span className="afn-mobile-login-banner-icon">
                        <User size={20} />
                      </span>
                      <div className="afn-mobile-login-banner-info">
                        <div className="afn-mobile-login-banner-title">Sign In / Register</div>
                        <div className="afn-mobile-login-banner-sub">Track orders & personal details</div>
                      </div>
                    </div>
                    <span className="afn-mobile-login-banner-arrow">→</span>
                  </button>
                </div>
              )
            )}

            <nav className="afn-mobile-nav" aria-label="Mobile navigation" style={{ pointerEvents: 'auto' }}>
              {navItems.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  className={`afn-mobile-link${isActive(item.to) ? ' afn-mobile-link--active' : ''}`}
                  onClick={() => handleMobileNav(item.to)}
                  style={{ pointerEvents: 'auto' }}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="afn-mobile-actions" style={{ pointerEvents: 'auto' }}>
              <div className="afn-mobile-contact-row" style={{ pointerEvents: 'auto' }}>
                <a
                  href="tel:+918553428079"
                  className="afn-mobile-contact-btn afn-mobile-call"
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                >
                  <Phone size={16} /> Call Us
                </a>
                <a
                  href="https://wa.me/918553428079?text=Hello%20All%20Fresh%20Naturals!"
                  target="_blank"
                  rel="noreferrer"
                  className="afn-mobile-contact-btn afn-mobile-wa"
                  style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </a>
              </div>

              <button
                type="button"
                className="afn-mobile-articles-link"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                onClick={() => handleMobileNav('/articles')}
              >
                <BookOpen size={15} /> Read Health Articles →
              </button>
            </div>
          </div>
        </>,
        document.body
      )}

      {/* Edit Personal Details Modal */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />
    </div>
  );
}

