import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  X, Plus, Minus, MapPin, User as UserIcon, Phone, Mail,
  ShieldCheck, Package, CheckCircle
} from 'lucide-react';
import type { Product } from '../data/products';
import { openWhatsAppMessage } from '../config/whatsapp';
import { useOrder } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

interface InstantOrderModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function InstantOrderModal({ product, isOpen, onClose }: InstantOrderModalProps) {
  const navigate = useNavigate();
  const { placeNewOrder } = useOrder();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('');

  // Start every new order with blank customer details.
  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setName('');
      setEmail('');
      setPhone('');
      setPhoneError('');
      setAddress('');
      setCity('Bengaluru');
      setState('Karnataka');
      setPincode('');
    }
  }, [isOpen, product]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleanDigits);
    if (cleanDigits.length > 0 && cleanDigits.length !== 10) {
      setPhoneError('Check the number');
    } else {
      setPhoneError('');
    }
  };

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const subtotal = product.price * quantity;
  const deliveryFee = subtotal >= 999 ? 0 : 50;
  const grandTotal = subtotal + deliveryFee;

  const handleSendOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 10) {
      setPhoneError('Check the number');
      return;
    }

    if (!isAuthenticated) {
      onClose();
      openAuthModal();
      return;
    }

    const orderId = `AFN-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

    let msg = `🌿 *NEW ORDER ALL FRESH NATURALS*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `🔖 *Order ID:* #${orderId}\n`;
    msg += `📅 *Date:* ${formattedDate}\n\n`;
    msg += `📦 *PRODUCT:*\n`;
    msg += `• ${product.name} (${product.size})\n`;
    msg += `• Qty: ${quantity} × ₹${product.price} = ₹${subtotal}\n`;
    msg += `• Delivery: ${deliveryFee === 0 ? 'FREE (order ≥ ₹999)' : `₹${deliveryFee}`}\n`;
    msg += `• *Total: ₹${grandTotal}*\n\n`;
    msg += `👤 *DELIVER TO:*\n`;
    msg += `• Name: ${name}\n`;
    msg += `• Phone: ${phone}\n`;
    msg += `• Address: ${address}\n`;
    msg += `• City & PIN: ${city}  ${pincode}\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_Prepared fresh, delivered with love 🌱_`;

    msg = [
      '*NEW ORDER | ALL FRESH NATURALS*',
      '',
      `Order ID: #${orderId}`,
      `Order date: ${formattedDate}`,
      '',
      '*ORDER DETAILS*',
      `${product.name} (${product.size})`,
      `Quantity: ${quantity} x Rs.${product.price} = Rs.${subtotal}`,
      `Delivery: ${deliveryFee === 0 ? 'FREE' : `Rs.${deliveryFee}`}`,
      `*Order total: Rs.${grandTotal}*`,
      '',
      '*CUSTOMER & DELIVERY DETAILS*',
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Email: ${email.trim() || 'N/A'}`,
      `Address: ${address.trim()}`,
      `Location: ${city.trim()}, ${state.trim()} - ${pincode.trim()}`,
      '',
      'Please confirm this order and share the expected delivery date.',
    ].join('\n');
    openWhatsAppMessage(msg);

    const orderData = {
      orderId,
      userId: user?.id || '',
      date: formattedDate,
      items: [{ product, quantity }],
      subtotal,
      deliveryFee,
      codFee: 0,
      total: grandTotal,
      paymentMethod: 'whatsapp' as const,
      status: 'Pending WhatsApp' as const,
      name, email, phone, address, city, state, pincode,
    };

    // Save to shared OrderContext for live Admin Panel visibility
    placeNewOrder({
      id: orderId,
      userId: user?.id || '',
      customerName: name,
      email: email.trim(),
      phone,
      city,
      address,
      state,
      pincode,
      items: `${product.name} (${product.size}) x${quantity}`,
      itemsDetail: [{
        name: product.name,
        size: product.size,
        quantity,
        price: product.price,
        image: product.image
      }],
      subtotal,
      deliveryFee,
      total: grandTotal,
      paymentMethod: 'WhatsApp Instant Order',
      status: 'Pending WhatsApp',
      date: formattedDate
    });

    sessionStorage.setItem('afn_last_order', JSON.stringify(orderData));
    onClose();
    navigate('/order-confirmation');
  };

  return createPortal(
    <div
      className="iom-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      data-lenis-prevent="true"
    >
      <div className="iom-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="iom-header">
          <div className="iom-header-product">
            <div className="iom-header-img-wrap">
              <img src={product.image} alt={product.name} className="iom-header-img" />
            </div>
            <div>
              <span className="iom-header-badge">⚡ INSTANT ORDER</span>
              <h3 className="iom-header-title">{product.name}</h3>
              <p className="iom-header-price">
                ₹{product.price} <span className="iom-header-unit">/ {product.size}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close instant order" className="iom-close-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSendOrder} className="iom-form">
          <div className="iom-body">
            {/* Quantity & Summary Card */}
            <div className="iom-qty-card">
              <div className="iom-qty-left">
                <span className="iom-field-title">
                  <Package size={14} /> Quantity
                </span>
                <div className="iom-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="iom-stepper-val">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(20, quantity + 1))}
                    disabled={quantity >= 20}
                    aria-label="Increase"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="iom-qty-right">
                <div className="iom-total-price">₹{grandTotal}</div>
                <div className="iom-delivery-tag">
                  {deliveryFee === 0 ? '🎉 FREE Delivery' : '+ ₹50 Standard Delivery'}
                </div>
              </div>
            </div>

            {/* Delivery Details Section */}
            <div className="iom-section-header">
              <MapPin size={15} /> <span>Delivery Address Details</span>
            </div>

            <div className="iom-inputs-grid">
              {/* Full Name */}
              <div className="iom-field">
                <label className="iom-label" htmlFor="iom-name">
                  Full Name <span className="iom-req">*</span>
                </label>
                <div className="iom-input-wrap">
                  <UserIcon size={14} className="iom-input-icon" />
                  <input
                    id="iom-name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="iom-input"
                  />
                </div>
              </div>

              {/* WhatsApp Number */}
              <div className="iom-field">
                <label className="iom-label" htmlFor="iom-phone">
                  WhatsApp Number <span className="iom-req">*</span>
                </label>
                <div className="iom-input-wrap">
                  <Phone size={14} className="iom-input-icon" />
                  <input
                    id="iom-phone"
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    value={phone}
                    onChange={handlePhoneChange}
                    required
                    className={`iom-input${phoneError ? ' iom-input--error' : ''}`}
                  />
                </div>
                {phoneError && (
                  <span className="iom-error-msg">⚠️ {phoneError}</span>
                )}
              </div>

              {/* Email Address */}
              <div className="iom-field iom-field--full">
                <label className="iom-label" htmlFor="iom-email">
                  Email Address <span className="iom-req">*</span>
                </label>
                <div className="iom-input-wrap">
                  <Mail size={14} className="iom-input-icon" />
                  <input
                    id="iom-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="iom-input"
                  />
                </div>
              </div>

              {/* Street / Address */}
              <div className="iom-field iom-field--full">
                <label className="iom-label" htmlFor="iom-addr">
                  Street / Flat / House / Landmark <span className="iom-req">*</span>
                </label>
                <textarea
                  id="iom-addr"
                  rows={2}
                  placeholder="House/Flat number, building name, street, nearby landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="iom-textarea"
                />
              </div>

              {/* City, State, PIN */}
              <div className="iom-city-row">
                <div className="iom-field">
                  <label className="iom-label" htmlFor="iom-city">City <span className="iom-req">*</span></label>
                  <input
                    id="iom-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="iom-input iom-input--sm"
                  />
                </div>
                <div className="iom-field">
                  <label className="iom-label" htmlFor="iom-state">State <span className="iom-req">*</span></label>
                  <input
                    id="iom-state"
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                    className="iom-input iom-input--sm"
                  />
                </div>
                <div className="iom-field">
                  <label className="iom-label" htmlFor="iom-pin">PIN Code <span className="iom-req">*</span></label>
                  <input
                    id="iom-pin"
                    type="text"
                    placeholder="560001"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                    className="iom-input iom-input--sm"
                  />
                </div>
              </div>
            </div>

            {/* Purity Guarantee Strip */}
            <div className="iom-trust-row">
              <span className="iom-trust-tag"><CheckCircle size={13} /> 100% Homemade</span>
              <span className="iom-trust-tag"><CheckCircle size={13} /> 0 Preservatives</span>
              <span className="iom-trust-tag"><CheckCircle size={13} /> FSSAI Certified</span>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="iom-footer">
            <button type="submit" className="iom-submit-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Send Order via WhatsApp • ₹{grandTotal}</span>
            </button>
            <p className="iom-privacy-note">
              <ShieldCheck size={12} /> Pre-fills WhatsApp message directly to Poornima to confirm your delivery date.
            </p>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
