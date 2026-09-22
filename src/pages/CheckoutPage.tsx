import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, User as UserIcon, Phone, CreditCard, Truck, ShieldCheck,
  CheckCircle2, ChevronDown, ChevronUp, Package, ArrowRight,
  Banknote, Edit3, Plus
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { openWhatsAppMessage } from '../config/whatsapp';

type Step = 1 | 2 | 3;
type PaymentMethod = 'upi' | 'cod' | 'credit_card' | 'debit_card' | 'bank';

export default function CheckoutPage() {
  const { cartItems, cartCount, cartSubtotal, clearCart } = useCart();
  const { user, isAuthenticated, addOrder } = useAuth();
  const { placeNewOrder } = useOrder();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set());

  // Step 1: Address
  const defaultAddr = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string | 'custom'>(
    defaultAddr ? defaultAddr.id : 'custom'
  );

  const [name, setName] = useState(() => defaultAddr?.name || user?.name || localStorage.getItem('afn_name') || '');
  const [phone, setPhone] = useState(() => defaultAddr?.phone || user?.phone || localStorage.getItem('afn_phone') || '');
  const [phoneError, setPhoneError] = useState('');
  const [address, setAddress] = useState(() => defaultAddr?.address || localStorage.getItem('afn_address') || '');
  const [city, setCity] = useState(() => defaultAddr?.city || localStorage.getItem('afn_city') || 'Bengaluru');
  const [state, setState] = useState(() => defaultAddr?.state || localStorage.getItem('afn_state') || 'Karnataka');
  const [pincode, setPincode] = useState(() => defaultAddr?.pincode || localStorage.getItem('afn_pincode') || '');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanDigits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(cleanDigits);
    if (cleanDigits.length > 0 && cleanDigits.length !== 10) {
      setPhoneError('Check the number');
    } else {
      setPhoneError('');
    }
  };

  // Step 2: Payment (Cash on Delivery Only)
  const [paymentMethod] = useState<PaymentMethod>('cod');

  // Pricing
  const deliveryFee = cartSubtotal >= 999 ? 0 : 50;
  const codFee = 0; // Free Cash on Delivery handling
  const grandTotal = cartSubtotal + deliveryFee + codFee;

  // Auto-populate when selecting saved address
  useEffect(() => {
    if (selectedSavedAddrId !== 'custom' && user?.addresses) {
      const found = user.addresses.find((a) => a.id === selectedSavedAddrId);
      if (found) {
        setName(found.name);
        setPhone(found.phone);
        setAddress(found.address);
        setCity(found.city);
        setState(found.state);
        setPincode(found.pincode);
      }
    }
  }, [selectedSavedAddrId, user]);

  const saveAddress = () => {
    localStorage.setItem('afn_name', name);
    localStorage.setItem('afn_phone', phone);
    localStorage.setItem('afn_address', address);
    localStorage.setItem('afn_city', city);
    localStorage.setItem('afn_state', state);
    localStorage.setItem('afn_pincode', pincode);
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setPhoneError('Check the number');
      return;
    }
    saveAddress();
    setCompletedSteps((prev) => new Set(prev).add(1));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = () => {
    setCompletedSteps((prev) => new Set(prev).add(2));
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    const orderId = `AFN-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    // Build WhatsApp message
    let msg = `*🛒 NEW ORDER - ALL FRESH NATURALS*\n`;
    msg += `═════════════════════════════\n`;
    msg += `🔖 *Order ID:* #${orderId}\n`;
    msg += `📅 *Date:* ${formattedDate}\n\n`;
    msg += `📦 *ITEMS ORDERED:*\n`;
    cartItems.forEach((item) => {
      msg += `• ${item.product.name} (${item.product.size}) × ${item.quantity} = ₹${item.product.price * item.quantity}\n`;
    });
    msg += `\n💰 *BILL SUMMARY:*\n`;
    msg += `• Subtotal: ₹${cartSubtotal}\n`;
    msg += `• Delivery: ${deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}\n`;
    if (codFee > 0) msg += `• COD Handling: ₹${codFee}\n`;
    msg += `⭐ *TOTAL: ₹${grandTotal}*\n\n`;
    msg += `💳 *Payment:* ${paymentMethod === 'upi' ? 'UPI (GPay/PhonePe)' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}\n\n`;
    msg += `👤 *DELIVERY TO:*\n`;
    msg += `• *Name:* ${name}\n`;
    msg += `• *Phone:* ${phone}\n`;
    msg += `• *Address:* ${address}\n`;
    msg += `• *City:* ${city}, ${state} - ${pincode}\n`;
    msg += `═════════════════════════════\n`;
    msg += `_Thank you for choosing All Fresh Naturals!_`;

    const paymentLabel = paymentMethod === 'upi'
      ? 'UPI (GPay / PhonePe)'
      : paymentMethod === 'cod'
        ? 'Cash on Delivery'
        : paymentMethod === 'bank'
          ? 'Bank Transfer'
          : paymentMethod === 'credit_card'
            ? 'Credit Card'
            : 'Debit Card';
    const itemLines = cartItems.map((item) =>
      `${item.product.name} (${item.product.size}) - ${item.quantity} x Rs.${item.product.price} = Rs.${item.product.price * item.quantity}`,
    );
    msg = [
      '*NEW ORDER | ALL FRESH NATURALS*',
      '',
      `Order ID: #${orderId}`,
      `Order date: ${formattedDate}`,
      '',
      '*ORDER DETAILS*',
      ...itemLines,
      '',
      '*PAYMENT & TOTAL*',
      `Subtotal: Rs.${cartSubtotal}`,
      `Delivery: ${deliveryFee === 0 ? 'FREE' : `Rs.${deliveryFee}`}`,
      ...(codFee > 0 ? [`COD handling: Rs.${codFee}`] : []),
      `Payment method: ${paymentLabel}`,
      `*Order total: Rs.${grandTotal}*`,
      '',
      '*CUSTOMER & DELIVERY DETAILS*',
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Address: ${address.trim()}`,
      `Location: ${city.trim()}, ${state.trim()} - ${pincode.trim()}`,
      '',
      'Please confirm this order and share the expected delivery date.',
    ].join('\n');
    openWhatsAppMessage(msg);

    // Save order data
    const userEmail = user?.email || '';
    const userId = user?.id || '';
    const orderData = {
      orderId,
      userId,
      date: formattedDate,
      items: cartItems,
      subtotal: cartSubtotal,
      deliveryFee,
      codFee,
      total: grandTotal,
      paymentMethod,
      status: 'Pending WhatsApp' as const,
      name,
      email: userEmail,
      phone,
      address,
      city,
      state,
      pincode
    };

    // Save to shared OrderContext & PostgreSQL Database
    const itemsSummaryStr = cartItems.map(i => `${i.product.name} (${i.product.size}) x${i.quantity}`).join(', ');
    placeNewOrder({
      id: orderId,
      userId,
      customerName: name,
      email: userEmail,
      phone,
      city,
      address,
      state,
      pincode,
      items: itemsSummaryStr,
      itemsDetail: cartItems.map(i => ({
        name: i.product.name,
        size: i.product.size,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.image
      })),
      subtotal: cartSubtotal,
      deliveryFee,
      total: grandTotal,
      paymentMethod: paymentMethod.toUpperCase(),
      status: 'Pending WhatsApp',
      date: formattedDate
    });

    // Save to user history if logged in
    if (isAuthenticated) {
      addOrder(orderData);
    }

    sessionStorage.setItem('afn_last_order', JSON.stringify(orderData));

    clearCart();
    navigate('/order-confirmation');
  };

  if (cartItems.length === 0 && !sessionStorage.getItem('afn_last_order')) {
    return (
      <section className="checkout-empty">
        <div className="container" style={{ textAlign: 'center', padding: '80px 24px' }}>
          <Package size={56} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
          <h2 className="section-title">Your cart is empty</h2>
          <p className="section-subtitle">Add some products before checking out.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Browse Products <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const StepHeader = ({ step, title, icon }: { step: Step; title: string; icon: React.ReactNode }) => {
    const isActive = currentStep === step;
    const isCompleted = completedSteps.has(step);
    return (
      <button
        className={`checkout-step-header ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
        onClick={() => { if (isCompleted || step <= currentStep) setCurrentStep(step); }}
        type="button"
      >
        <div className="step-header-left">
          <span className={`step-number-badge ${isCompleted ? 'done' : ''}`}>
            {isCompleted ? <CheckCircle2 size={18} /> : step}
          </span>
          <span className="step-header-icon">{icon}</span>
          <span className="step-header-title">{title}</span>
        </div>
        {isCompleted && !isActive && (
          <span className="step-edit-tag"><Edit3 size={13} /> Change</span>
        )}
        {isActive ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    );
  };

  return (
    <section className="checkout-section">
      <div className="container">
        <h1 className="checkout-page-title">Checkout</h1>

        <div className="checkout-layout">
          {/* Left: Steps */}
          <div className="checkout-steps-col">

            {/* === STEP 1: DELIVERY ADDRESS === */}
            <div className="checkout-step-block">
              <StepHeader step={1} title="Delivery Address" icon={<MapPin size={18} />} />
              {currentStep === 1 && (
                <div className="checkout-step-body">
                  {/* If user has saved addresses, display quick selector */}
                  {isAuthenticated && user?.addresses && user.addresses.length > 0 && (
                    <div className="checkout-saved-addresses">
                      <label className="checkout-saved-title">Choose from Saved Addresses:</label>
                      <div className="checkout-address-pills">
                        {user.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className={`checkout-addr-card ${selectedSavedAddrId === addr.id ? 'selected' : ''}`}
                            onClick={() => setSelectedSavedAddrId(addr.id)}
                          >
                            <div className="addr-card-top">
                              <span className="addr-pill-badge">{addr.label}</span>
                              {addr.isDefault && <span className="addr-def-tag">Default</span>}
                            </div>
                            <strong>{addr.name}</strong>
                            <p>{addr.address}, {addr.city} ({addr.pincode})</p>
                          </div>
                        ))}

                        <div
                          className={`checkout-addr-card custom-card ${selectedSavedAddrId === 'custom' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedSavedAddrId('custom');
                            setName('');
                            setPhone('');
                            setAddress('');
                            setPincode('');
                          }}
                        >
                          <Plus size={18} />
                          <strong>Enter New Address</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleStep1Submit} className="checkout-form">
                    <div className="checkout-form-row">
                      <div className="checkout-field">
                        <label><UserIcon size={14} /> Full Name *</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                      </div>
                      <div className="checkout-field">
                        <label><Phone size={14} /> Mobile / WhatsApp *</label>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={handlePhoneChange}
                          required
                          style={{ borderColor: phoneError ? '#dc2626' : undefined }}
                        />
                        {phoneError && (
                          <span style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700, marginTop: 4, display: 'block' }}>
                            ⚠️ {phoneError}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="checkout-field">
                      <label><MapPin size={14} /> Complete Address *</label>
                      <textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} required />
                    </div>
                    <div className="checkout-form-row checkout-form-row-3">
                      <div className="checkout-field">
                        <label>City *</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
                      </div>
                      <div className="checkout-field">
                        <label>State *</label>
                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
                      </div>
                      <div className="checkout-field">
                        <label>PIN Code *</label>
                        <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
                      </div>
                    </div>
                    <button type="submit" className="checkout-step-btn">
                      Deliver to this Address <ArrowRight size={16} />
                    </button>
                  </form>
                </div>
              )}
              {completedSteps.has(1) && currentStep !== 1 && (
                <div className="checkout-step-summary">
                  <p><strong>{name}</strong>  {phone}</p>
                  <p>{address}, {city}, {state} - {pincode}</p>
                </div>
              )}
            </div>

            {/* === STEP 2: PAYMENT METHOD (Cash on Delivery Only) === */}
            <div className="checkout-step-block">
              <StepHeader step={2} title="Payment Method" icon={<CreditCard size={18} />} />
              {currentStep === 2 && (
                <div className="checkout-step-body">
                  <div className="payment-methods-grid">
                    <label className="payment-method-card selected">
                      <input type="radio" name="payment" checked readOnly />
                      <div className="payment-card-icon"><Banknote size={28} /></div>
                      <div className="payment-card-info">
                        <strong>Cash on Delivery (COD)</strong>
                        <span>Pay in cash or UPI QR code when your fresh batch arrives at your door</span>
                      </div>
                      <span className="payment-recommended">Default & Preferred</span>
                    </label>
                  </div>

                  <div className="payment-detail-box">
                    <ShieldCheck size={20} />
                    <div>
                      <strong>100% Safe & Risk-Free Payment:</strong><br />
                      <small>No advance online payment required. Pay directly upon delivery after inspecting your freshly sealed batch.</small>
                    </div>
                  </div>

                  <button type="button" className="checkout-step-btn" onClick={handleStep2Submit}>
                    Confirm Payment Method <ArrowRight size={16} />
                  </button>
                </div>
              )}
              {completedSteps.has(2) && currentStep !== 2 && (
                <div className="checkout-step-summary">
                  <p>
                    <strong>💵 Cash on Delivery (Pay upon delivery)</strong>
                  </p>
                </div>
              )}
            </div>

            {/* === STEP 3: REVIEW & PLACE ORDER === */}
            <div className="checkout-step-block">
              <StepHeader step={3} title="Review & Place Order" icon={<Package size={18} />} />
              {currentStep === 3 && (
                <div className="checkout-step-body">
                  <h4 className="review-section-label">Order Items</h4>
                  <div className="review-items-list">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="review-item">
                        <img src={item.product.image} alt={item.product.name} className="review-item-img" />
                        <div className="review-item-info">
                          <h5>{item.product.name}</h5>
                          <span>{item.product.size}</span>
                        </div>
                        <div className="review-item-qty">Qty: {item.quantity}</div>
                        <div className="review-item-price">₹{item.product.price * item.quantity}</div>
                      </div>
                    ))}
                  </div>

                  <div className="review-bill-table">
                    <div className="review-bill-row">
                      <span>Items ({cartCount}):</span><span>₹{cartSubtotal}</span>
                    </div>
                    <div className="review-bill-row">
                      <span>Delivery:</span>
                      <span className={deliveryFee === 0 ? 'text-free' : ''}>
                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                      </span>
                    </div>
                    {codFee > 0 && (
                      <div className="review-bill-row">
                        <span>COD Handling:</span><span>₹{codFee}</span>
                      </div>
                    )}
                    <div className="review-bill-row review-bill-total">
                      <span>Order Total:</span><span>₹{grandTotal}</span>
                    </div>
                  </div>

                  <div className="review-security-note">
                    <ShieldCheck size={20} />
                    <span>Your order will be confirmed via WhatsApp. We prepare fresh batches per order 100% homemade with zero preservatives.</span>
                  </div>

                  <button type="button" className="btn-place-order" onClick={handlePlaceOrder}>
                    <Truck size={20} />
                    Place Your Order  ₹{grandTotal}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="checkout-sidebar-card">
              <button
                type="button"
                className="btn-place-order sidebar-place-btn"
                onClick={handlePlaceOrder}
                disabled={!completedSteps.has(1) || !completedSteps.has(2)}
              >
                Place Your Order
              </button>
              <p className="sidebar-terms">
                By placing your order, you agree to our terms. Your order details will be sent to WhatsApp for confirmation.
              </p>

              <div className="sidebar-divider" />

              <h4 className="sidebar-title">Order Summary</h4>
              <div className="sidebar-row"><span>Items ({cartCount}):</span><span>₹{cartSubtotal}</span></div>
              <div className="sidebar-row"><span>Delivery:</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
              {codFee > 0 && <div className="sidebar-row"><span>COD Handling:</span><span>₹{codFee}</span></div>}
              <div className="sidebar-divider" />
              <div className="sidebar-row sidebar-total">
                <span>Order Total:</span><span>₹{grandTotal}</span>
              </div>

              <div className="sidebar-items-preview">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="sidebar-item-row">
                    <img src={item.product.image} alt={item.product.name} />
                    <div>
                      <strong>{item.product.name}</strong>
                      <span>Qty: {item.quantity}  ₹{item.product.price * item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
