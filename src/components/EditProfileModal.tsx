import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Phone, Mail, MapPin, CheckCircle, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile, addAddress, updateAddress } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPhoneError('');
      setSavedSuccess(false);

      const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
      if (defaultAddr) {
        setAddress(defaultAddr.address || '');
        setCity(defaultAddr.city || 'Bengaluru');
        setState(defaultAddr.state || 'Karnataka');
        setPincode(defaultAddr.pincode || '');
      } else {
        setAddress('');
        setCity('Bengaluru');
        setState('Karnataka');
        setPincode('');
      }
    }
  }, [isOpen, user]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digits);
    if (digits.length > 0 && digits.length !== 10) {
      setPhoneError('Enter a valid 10-digit mobile number');
    } else {
      setPhoneError('');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (phone && phone.length !== 10) {
      setPhoneError('Enter a valid 10-digit mobile number');
      return;
    }

    // 1. Update basic profile info
    updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim()
    });

    // 2. Update or create default delivery address
    if (address.trim() || pincode.trim()) {
      const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
      if (defaultAddr) {
        updateAddress(defaultAddr.id, {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          isDefault: true
        });
      } else {
        addAddress({
          label: 'Home',
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
          isDefault: true
        });
      }
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen || !user) return null;

  return createPortal(
    <div className="epm-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="epm-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="epm-header">
          <div className="epm-header-info">
            <div className="epm-avatar-circle">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="epm-header-title">Personal & Delivery Details</h3>
              <p className="epm-header-sub">Update your account information and default address</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" className="epm-close-btn">
            <X size={18} />
          </button>
        </div>

        {/* Success Banner */}
        {savedSuccess && (
          <div className="epm-success-banner">
            <CheckCircle size={16} /> Details saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="epm-form">
          <div className="epm-body">
            {/* Section 1: Basic Info */}
            <div className="epm-section-label">
              <User size={14} /> Personal Information
            </div>

            <div className="epm-grid-2">
              <div className="epm-field">
                <label className="epm-label" htmlFor="epm-name">
                  Full Name <span className="epm-req">*</span>
                </label>
                <div className="epm-input-wrap">
                  <User size={14} className="epm-input-icon" />
                  <input
                    id="epm-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="epm-input"
                  />
                </div>
              </div>

              <div className="epm-field">
                <label className="epm-label" htmlFor="epm-phone">
                  WhatsApp / Phone <span className="epm-req">*</span>
                </label>
                <div className="epm-input-wrap">
                  <Phone size={14} className="epm-input-icon" />
                  <input
                    id="epm-phone"
                    type="tel"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="10-digit number"
                    className={`epm-input${phoneError ? ' epm-input--error' : ''}`}
                  />
                </div>
                {phoneError && <span className="epm-error-text">{phoneError}</span>}
              </div>
            </div>

            <div className="epm-field">
              <label className="epm-label" htmlFor="epm-email">
                Email Address <span className="epm-req">*</span>
              </label>
              <div className="epm-input-wrap">
                <Mail size={14} className="epm-input-icon" />
                <input
                  id="epm-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="epm-input"
                />
              </div>
            </div>

            {/* Section 2: Address */}
            <div className="epm-section-label" style={{ marginTop: 8 }}>
              <MapPin size={14} /> Default Delivery Address
            </div>

            <div className="epm-field">
              <label className="epm-label" htmlFor="epm-address">
                Street / Flat / House / Landmark
              </label>
              <textarea
                id="epm-address"
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House/Flat No., Building Name, Street Area"
                className="epm-textarea"
              />
            </div>

            <div className="epm-grid-3">
              <div className="epm-field">
                <label className="epm-label" htmlFor="epm-city">City</label>
                <input
                  id="epm-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="epm-input epm-input--sm"
                />
              </div>
              <div className="epm-field">
                <label className="epm-label" htmlFor="epm-state">State</label>
                <input
                  id="epm-state"
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="epm-input epm-input--sm"
                />
              </div>
              <div className="epm-field">
                <label className="epm-label" htmlFor="epm-pin">PIN Code</label>
                <input
                  id="epm-pin"
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560001"
                  className="epm-input epm-input--sm"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="epm-footer">
            <button type="button" onClick={onClose} className="epm-cancel-btn">
              Cancel
            </button>
            <button type="submit" className="epm-save-btn">
              <Save size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
