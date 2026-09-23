import { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Send,
  CheckCircle2,
  ShieldCheck,
  HelpCircle,
  ChevronDown
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
  'Preparation Method',
  'Custom / Bulk Order'
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
      setError('Please enter valid 10-digit mobile');
      return;
    }

    setError('');

    let msg = `*INQUIRY FROM BLOG GUIDE*\n`;
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
      msg += `💬 *Query:* Interested to know more about this product / dosage.\n`;
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
      {/* Compact Header */}
      <div className="sticky-contact-header">
        <div className="sticky-header-row">
          <h3 className="sticky-contact-title">Quick Kitchen Inquiry</h3>
          <span className="sticky-badge">Kitchen Helpline</span>
        </div>
        <p className="sticky-contact-subtitle">
          Have doubts on dosage, sprouted grains, or fresh packs? Ask our team directly.
        </p>
      </div>

      {submitted ? (
        <div className="sticky-contact-success">
          <div className="sticky-success-icon-wrap">
            <CheckCircle2 size={30} color="#15803d" />
          </div>
          <h4 className="sticky-success-title">Opening WhatsApp…</h4>
          <p className="sticky-success-desc">
            Your inquiry for <strong>"{articleTitle}"</strong> has been prepared. Our kitchen team will assist you shortly.
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

          {/* Topic Dropdown */}
          <div className="sticky-field-group">
            <label className="sticky-field-label" htmlFor="sticky-topic-select">
              <HelpCircle size={12} /> Select Topic <span className="req-star">*</span>
            </label>
            <div className="sticky-select-wrap">
              <select
                id="sticky-topic-select"
                className="sticky-select"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                {QUICK_TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="sticky-select-chevron" />
            </div>
          </div>

          {/* 2-Column Name and Phone */}
          <div className="sticky-row-2col">
            <div className="sticky-field-group">
              <label className="sticky-field-label" htmlFor="sticky-name">
                Your Name <span className="req-star">*</span>
              </label>
              <input
                id="sticky-name"
                type="text"
                className="sticky-input"
                placeholder="Your Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </div>

            <div className="sticky-field-group">
              <label className="sticky-field-label" htmlFor="sticky-phone">
                Phone / WhatsApp <span className="req-star">*</span>
              </label>
              <input
                id="sticky-phone"
                type="tel"
                className="sticky-input"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError('');
                }}
                required
              />
            </div>
          </div>

          {/* Compact Message Field */}
          <div className="sticky-field-group">
            <label className="sticky-field-label" htmlFor="sticky-msg">
              Your Message <span className="opt-text">(Optional)</span>
            </label>
            <textarea
              id="sticky-msg"
              className="sticky-textarea"
              rows={2}
              placeholder={`Ask about ${linkedProduct ? linkedProduct.name : 'dosage, nutrition, or packs'}…`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Compact Submit Button */}
          <button type="submit" className="sticky-btn-submit">
            <Send size={14} /> Send to WhatsApp
          </button>
        </form>
      )}

      {/* Subtle Divider */}
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
          <Phone size={13} className="sticky-direct-icon-inline" />
          <span className="direct-val">+91 85534 28079</span>
        </a>

        <a
          href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hi All Fresh Naturals, I have a query regarding: ${articleTitle}`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-direct-item whatsapp"
          title="Chat directly on WhatsApp"
        >
          <MessageSquare size={13} className="sticky-direct-icon-inline" />
          <span className="direct-val">WhatsApp Chat</span>
        </a>
      </div>

      {/* 1-Line Trust Footer */}
      <div className="sticky-trust-footer-compact">
        <ShieldCheck size={12} className="sticky-trust-icon" />
        <span>FSSAI Lic. 21226186000460 • Mon–Sat 9AM–7PM</span>
      </div>
    </div>
  );
}
