import { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Send,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';
import type { Product } from '../data/products';

interface ArticleStickyContactProps {
  articleTitle: string;
  linkedProduct?: Product | null;
}

const QUICK_TOPICS = [
  'Order Inquiry',
  'Baby Dosage (6M+)',
  'Ingredients & Nutrition',
  'Preparation Method'
];

export default function ArticleStickyContact({ articleTitle, linkedProduct }: ArticleStickyContactProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState<string>('Order Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setError('');

    let msg = `*INQUIRY FROM ARTICLE / BLOG*\n`;
    msg += `📄 *Article:* ${articleTitle}\n`;
    if (linkedProduct) {
      msg += `🌿 *Product:* ${linkedProduct.name}\n`;
    }
    msg += `🏷️ *Topic:* ${topic}\n`;
    msg += `👤 *Name:* ${name.trim()}\n`;
    msg += `📱 *Phone:* ${phone.trim()}\n`;
    if (message.trim()) {
      msg += `💬 *Message:* ${message.trim()}\n`;
    } else {
      msg += `💬 *Query:* Interested to know more about this product / health guide.\n`;
    }

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encoded}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setPhone('');
    setMessage('');
    setSubmitted(false);
    setError('');
  };

  return (
    <div className="article-sticky-card">
      {/* Header Badge */}
      <div className="sticky-contact-header">
        <div className="sticky-badge">
          <Sparkles size={13} className="sticky-badge-icon" />
          <span>KITCHEN HELPLINE</span>
        </div>
        <h3 className="sticky-contact-title">Have Questions?</h3>
        <p className="sticky-contact-subtitle">
          Ask our artisan kitchen team about dosage, pure sprouted grains, or place a fresh batch order.
        </p>
      </div>

      {submitted ? (
        <div className="sticky-contact-success">
          <div className="sticky-success-icon-wrap">
            <CheckCircle2 size={36} color="#15803d" />
          </div>
          <h4 className="sticky-success-title">Opening WhatsApp…</h4>
          <p className="sticky-success-desc">
            Your inquiry for <strong>"{articleTitle}"</strong> has been prepared. Our team typically responds within minutes during kitchen hours.
          </p>
          <button
            type="button"
            className="sticky-btn-reset"
            onClick={handleReset}
          >
            Send Another Query
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="sticky-contact-form">
          {error && <div className="sticky-form-error">{error}</div>}

          {/* Topic Quick Chips */}
          <div className="sticky-field-group">
            <label className="sticky-field-label">
              <HelpCircle size={13} /> Select Topic
            </label>
            <div className="sticky-chips-grid">
              {QUICK_TOPICS.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`sticky-chip${topic === t ? ' sticky-chip--active' : ''}`}
                  onClick={() => setTopic(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div className="sticky-field-group">
            <label className="sticky-field-label" htmlFor="sticky-name">
              Your Name <span className="req-star">*</span>
            </label>
            <input
              id="sticky-name"
              type="text"
              className="sticky-input"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          {/* Phone Field */}
          <div className="sticky-field-group">
            <label className="sticky-field-label" htmlFor="sticky-phone">
              WhatsApp / Phone <span className="req-star">*</span>
            </label>
            <input
              id="sticky-phone"
              type="tel"
              className="sticky-input"
              placeholder="e.g. 98765 43210"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (error) setError('');
              }}
              required
            />
          </div>

          {/* Message Field */}
          <div className="sticky-field-group">
            <label className="sticky-field-label" htmlFor="sticky-msg">
              Your Message <span className="opt-text">(Optional)</span>
            </label>
            <textarea
              id="sticky-msg"
              className="sticky-textarea"
              rows={3}
              placeholder={`Ask about ${linkedProduct ? linkedProduct.name : 'natural health benefits'} or bulk orders…`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="sticky-btn-submit">
            <Send size={15} /> Send to WhatsApp
          </button>
        </form>
      )}

      {/* Divider */}
      <div className="sticky-divider">
        <span>OR CONNECT DIRECTLY</span>
      </div>

      {/* Direct Contact Buttons */}
      <div className="sticky-direct-links">
        <a
          href="tel:+918553428079"
          className="sticky-direct-item phone"
          title="Call All Fresh Naturals Kitchen"
        >
          <div className="sticky-direct-icon phone">
            <Phone size={15} />
          </div>
          <div className="sticky-direct-info">
            <span className="direct-label">Call Support</span>
            <span className="direct-val">+91 85534 28079</span>
          </div>
        </a>

        <a
          href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi All Fresh Naturals, I have a query regarding: ${articleTitle}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-direct-item whatsapp"
          title="Chat directly on WhatsApp"
        >
          <div className="sticky-direct-icon whatsapp">
            <MessageSquare size={15} />
          </div>
          <div className="sticky-direct-info">
            <span className="direct-label">Instant Chat</span>
            <span className="direct-val">WhatsApp Helpline</span>
          </div>
        </a>
      </div>

      {/* Trust Mini Bar */}
      <div className="sticky-trust-footer">
        <div className="sticky-trust-row">
          <Clock size={13} className="sticky-trust-icon" />
          <span>Kitchen Hours: Mon – Sat • 9 AM to 7 PM</span>
        </div>
        <div className="sticky-trust-row">
          <MapPin size={13} className="sticky-trust-icon" />
          <span>Uttarahalli, Bengaluru • 100% Homemade</span>
        </div>
        <div className="sticky-trust-row fssai">
          <ShieldCheck size={13} className="sticky-trust-icon fssai" />
          <span>FSSAI Lic. 21226186000460</span>
        </div>
      </div>
    </div>
  );
}
