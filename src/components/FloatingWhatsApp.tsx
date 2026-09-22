import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Phone } from 'lucide-react';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Hide floating widget on admin pages to prevent overlap with admin action buttons
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  const waUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello All Fresh Naturals! I would like to know more about your products.')}`;

  return (
    <div className="afn-float-widget" role="complementary" aria-label="Contact options">
      {/* Expanded Panel */}
      <div className={`afn-float-panel${isOpen ? ' afn-float-panel--open' : ''}`} aria-hidden={!isOpen}>
        <div className="afn-float-panel-header">
          <span className="afn-float-panel-title">💬 Need Help?</span>
          <button
            type="button"
            className="afn-float-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close contact widget"
          >
            <X size={16} />
          </button>
        </div>
        <div className="afn-float-panel-body">
          <p className="afn-float-panel-sub">We're happy to assist you!</p>
          <a href="tel:+918553428079" className="afn-float-action-btn afn-float-call">
            <Phone size={18} />
            <div className="afn-float-action-text">
              <span className="afn-float-action-label">Call Us</span>
              <span className="afn-float-action-sub">+91 85534 28079</span>
            </div>
          </a>
          <a href={waUrl} target="_blank" rel="noreferrer" className="afn-float-action-btn afn-float-wa">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <div className="afn-float-action-text">
              <span className="afn-float-action-label">WhatsApp</span>
              <span className="afn-float-action-sub">Chat with us</span>
            </div>
          </a>
        </div>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        className={`afn-float-trigger${isOpen ? ' afn-float-trigger--open' : ''}`}
        onClick={() => setIsOpen(o => !o)}
        aria-label={isOpen ? 'Close contact options' : 'Open contact options'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )}
        {!isOpen && <span className="afn-float-trigger-pulse" />}
      </button>
    </div>
  );
}
