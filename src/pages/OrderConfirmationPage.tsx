import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Clock, Package, MapPin, CreditCard, MessageSquare, ShoppingBag, Truck, ArrowLeft } from 'lucide-react';
import type { CartItem } from '../data/products';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';

interface OrderData {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  codFee: number;
  total: number;
  paymentMethod: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderData | null>(null);

  useEffect(() => {
    try {
      const data = sessionStorage.getItem('afn_last_order');
      if (data) setOrder(JSON.parse(data));
    } catch {
      // ignore
    }
  }, []);

  if (!order) {
    return (
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Helmet>
          <title id="metaTitle">Order Confirmation | All Fresh Naturals</title>

          <meta
            name="description"
            id="metaDescription"
            content="Thank you for your order with All Fresh Naturals."
          />

          <meta
            id="ogTitle"
            property="og:title"
            content="Order Confirmation | All Fresh Naturals"
          />

          <meta
            id="ogType"
            property="og:type"
            content="website"
          />

          <meta
            id="ogDescription"
            property="og:description"
            content="Order status and details for your All Fresh Naturals purchase."
          />

          <meta
            id="ogUrl"
            property="og:url"
            content="https://allfreshnaturals.com/order-confirmation"
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
            href="https://allfreshnaturals.com/order-confirmation"
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
        <div className="container">
          <Package size={56} style={{ color: 'var(--text-light)', marginBottom: '16px' }} />
          <h2 className="section-title">No recent order found</h2>
          <p className="section-subtitle">Start shopping to place your first order.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Browse Products <ShoppingBag size={16} />
          </Link>
        </div>
      </section>
    );
  }

  const paymentLabel = order.paymentMethod === 'upi'
    ? 'UPI (GPay / PhonePe / Paytm)'
    : order.paymentMethod === 'cod'
      ? 'Cash on Delivery'
      : 'Bank Transfer (NEFT/IMPS)';

  return (
    <section className="order-confirm-section" style={{ padding: '24px 0 60px' }}>
      <Helmet>
        <title id="metaTitle">Order Placed Successfully | All Fresh Naturals</title>

        <meta
          name="description"
          id="metaDescription"
          content="Thank you for your purchase. Your natural health drink mix order details."
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="Order Placed Successfully | All Fresh Naturals"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Order status and receipt from All Fresh Naturals."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/order-confirmation"
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
          href="https://allfreshnaturals.com/order-confirmation"
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
      <div className="container">
        {/* Mobile & Desktop Back Navigation Button */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="btn btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '24px',
              fontSize: '0.86rem',
              fontWeight: 600,
              color: 'var(--primary-color)',
              borderColor: 'rgba(27, 67, 50, 0.25)',
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft size={17} /> Back to Products
          </button>
        </div>

        {/* Pending Order Header */}
        <div className="confirm-success-header">
          <div className="confirm-check-animation" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Clock size={36} />
          </div>
          <h1>Order Received Pending WhatsApp Confirmation!</h1>
          <p>
            Thank you, <strong>{order.name}</strong>! Your order <strong>#{order.orderId}</strong> is registered.
            Please make sure to send the pre-filled order message on WhatsApp so Poornima can confirm your batch!
          </p>
        </div>

        <div className="confirm-layout">
          {/* Order Details Card */}
          <div className="confirm-card">
            <div className="confirm-card-header">
              <div>
                <span className="confirm-label">Order Reference</span>
                <h3 className="confirm-order-id">#{order.orderId}</h3>
              </div>
              <div className="confirm-status" style={{ backgroundColor: '#fffbebf0', border: '1px solid #fde68a', color: '#b45309' }}>
                <span className="confirm-status-dot" style={{ backgroundColor: '#f59e0b', boxShadow: '0 0 0 3px rgba(245, 158, 11, 0.2)' }} />
                Pending WhatsApp Confirmation
              </div>
            </div>

            <div className="confirm-divider" />

            {/* Items */}
            <h4 className="confirm-section-title"><Package size={16} /> Items Ordered</h4>
            <div className="confirm-items">
              {order.items.map((item) => (
                <div key={item.product.id} className="confirm-item-row">
                  <img src={item.product.image} alt={item.product.name} className="confirm-item-img" />
                  <div className="confirm-item-info">
                    <strong>{item.product.name}</strong>
                    <span>{item.product.size} × {item.quantity}</span>
                  </div>
                  <span className="confirm-item-price">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="confirm-divider" />

            {/* Bill */}
            <div className="confirm-bill">
              <div className="confirm-bill-row"><span>Subtotal:</span><span>₹{order.subtotal}</span></div>
              <div className="confirm-bill-row">
                <span>Delivery:</span>
                <span className={order.deliveryFee === 0 ? 'text-free' : ''}>
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
                </span>
              </div>
              {order.codFee > 0 && (
                <div className="confirm-bill-row"><span>COD Handling:</span><span>₹{order.codFee}</span></div>
              )}
              <div className="confirm-bill-row confirm-bill-total">
                <span>Total Paid:</span><span>₹{order.total}</span>
              </div>
            </div>

            <div className="confirm-divider" />

            {/* Delivery */}
            <h4 className="confirm-section-title"><MapPin size={16} /> Delivery Address</h4>
            <div className="confirm-address-box">
              <p><strong>{order.name}</strong>  {order.phone}</p>
              <p>{order.address}</p>
              <p>{order.city}, {order.state} - {order.pincode}</p>
            </div>

            {/* Payment */}
            <h4 className="confirm-section-title"><CreditCard size={16} /> Payment Method</h4>
            <p className="confirm-payment-label">{paymentLabel}</p>

            {/* Estimated Delivery */}
            <div className="confirm-delivery-estimate">
              <Truck size={20} />
              <div>
                <strong>Estimated Delivery</strong>
                <span>Within Bangalore: 1-2 days • Other cities: 3-5 business days</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="confirm-actions">
            <a
              href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="btn-confirm-action btn-whatsapp"
              style={{ backgroundColor: '#25D366', color: '#ffffff' }}
            >
              <MessageSquare size={18} /> Send Order Message on WhatsApp 💬
            </a>
            <Link to="/products" className="btn-confirm-action btn-continue">
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
            <Link to="/" className="btn-confirm-action btn-continue" style={{ background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db' }}>
              <ArrowLeft size={18} /> Back to Home
            </Link>
          </div>
        </div>

        <p className="confirm-footer-note" style={{ background: '#fffbe6', border: '1px solid #ffe58f', color: '#873800' }}>
          📱 Order submitted on {order.date}. <strong>Important:</strong> Please ensure you send the pre-filled message on WhatsApp so we can complete your order!
        </p>
      </div>
    </section>
  );
}
