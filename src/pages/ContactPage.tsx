import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Phone, Mail, MessageSquare, Clock, Send, CheckCircle2, Leaf, ExternalLink } from 'lucide-react';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';
import { useAuth } from '../context/AuthContext';

export default function ContactPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal();
      return;
    }

    let msg = `*NEW INQUIRY / FEEDBACK  ALL FRESH NATURALS*\n\n`;
    msg += `👤 *Name:* ${formData.name}\n`;
    msg += `📧 *Email:* ${formData.email}\n`;
    if (formData.phone) msg += `📱 *Phone:* ${formData.phone}\n`;
    if (formData.subject) msg += `📝 *Subject:* ${formData.subject}\n\n`;
    msg += `💬 *Message / Feedback:*\n${formData.message}\n`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="contact-page-wrapper">
      <Helmet>
        <title id="metaTitle">
          Contact All Fresh Naturals | Get in Touch &amp; Shop With Us
        </title>

        <meta
          name="description"
          id="metaDescription"
          content="Have questions about All Fresh Naturals products? Contact All Fresh Naturals today for product information, support, enquiries, orders, and assistance. We are happy to help."
        />

        <meta
          name="keywords"
          id="metaKeywords"
          content="contact all fresh naturals, all fresh naturals contact, all fresh naturals number, all fresh naturals address, all fresh naturals founder number, all fresh naturals phone number"
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="Contact All Fresh Naturals | We're Here to Help You"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Contact All Fresh Naturals for product enquiries, support, feedback, orders, and more. Our team is ready to assist you with helpful information and friendly customer service."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/contact"
        />

        <meta
          id="ogSiteName"
          property="og:site_name"
          content="All Fresh Naturals"
        />

        <meta
          id="ogImage"
          property="og:image"
          content="https://allfreshnaturals.com/assets/logo-CNxtV1g6.jpg"
        />

        <meta
          id="twitterSite"
          name="twitter:site"
          content="https://twitter.com/"
        />

        <meta
          id="twitterTitle"
          name="twitter:title"
          content="Contact All Fresh Naturals | Get in Touch &amp; Support"
        />

        <meta
          id="twitterDescription"
          name="twitter:description"
          content="Contact All Fresh Naturals for product enquiries, customer support, feedback, or questions about our natural food products. We are here to help you with care and guidance."
        />

        <meta
          id="author"
          name="author"
          content="Akshay"
        />

        <link
          id="canonical"
          rel="canonical"
          href="https://allfreshnaturals.com/contact"
        />

        <meta
          id="indexingStatus"
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
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
      {/* Hero Banner Header */}
      <section className="contact-hero-banner">
        <div className="container">
          <div className="contact-badge-pill">
            <Leaf size={14} /> WE'RE HERE TO HELP YOU
          </div>
          <h1 className="contact-hero-title">Contact All Fresh Naturals</h1>
          <p className="contact-hero-subtitle">
            Have a question about our pure health mixes, traditional preparation methods, or custom orders? Reach out to us via phone, WhatsApp, or message below.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ paddingBottom: '48px' }}>
        {/* Quick Touchpoint Cards Grid */}
        <div className="contact-quick-grid">
          {/* Phone */}
          <a href="tel:+918553428079" className="contact-quick-card">
            <div className="contact-icon-badge phone">
              <Phone size={22} />
            </div>
            <span className="contact-quick-label">Call Support</span>
            <span className="contact-quick-val">+91 85534 28079</span>
            <span className="contact-quick-sub">Mon – Sat • 9 AM to 7 PM</span>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="contact-quick-card"
          >
            <div className="contact-icon-badge whatsapp">
              <MessageSquare size={22} />
            </div>
            <span className="contact-quick-label">WhatsApp Chat</span>
            <span className="contact-quick-val">+91 85534 28079</span>
            <span className="contact-quick-sub">Instant answers & order updates</span>
          </a>

          {/* Email */}
          <a href="mailto:poori.monika@gmail.com" className="contact-quick-card">
            <div className="contact-icon-badge email">
              <Mail size={22} />
            </div>
            <span className="contact-quick-label">Email Us</span>
            <span className="contact-quick-val">poori.monika@gmail.com</span>
            <span className="contact-quick-sub">For inquiries & feedback</span>
          </a>

          {/* Business Hours */}
          <div className="contact-quick-card" style={{ cursor: 'default' }}>
            <div className="contact-icon-badge hours">
              <Clock size={22} />
            </div>
            <span className="contact-quick-label">Kitchen Hours</span>
            <span className="contact-quick-val">Mon to Sat: 9 AM to 7 PM</span>
            <span className="contact-quick-sub">Sunday: By Appointment</span>
          </div>
        </div>

        {/* 2-Column Split Layout */}
        <div className="contact-split-grid">
          {/* Left: Location & Google Maps */}
          <div className="contact-card-box">
            <h2 className="contact-card-title">Our Home Kitchen</h2>
            <p className="contact-card-sub">
              Every batch of our clean nutrition is prepared right here in Uttarahalli, Bengaluru.
            </p>

            {/* Address Pill */}
            <div className="contact-address-box">
              <MapPin size={24} style={{ color: 'var(--accent-color)', flexShrink: 0, marginTop: '2px' }} />
              <div className="contact-address-text">
                <strong>All Fresh Naturals Kitchen</strong>
                <p style={{ margin: '2px 0 0', color: 'var(--text-light)', fontSize: '0.88rem' }}>
                  No. 251/B, 4th Main, Anjineya Temple Street,<br />Uttarahalli, Bengaluru, Karnataka – 560061
                </p>
              </div>
            </div>

            {/* Map Embed Card */}
            <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 4px 14px rgba(0,0,0,0.06)' }}>
              <iframe
                title="All Fresh Naturals NO.251/B Building Location"
                src="https://maps.google.com/maps?q=NO.251/B+Building,+4th+main,+Anjineya+temple+street,+Uttarahalli,+Bangalore+-+560061&t=&z=17&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="260"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a
                href="https://www.google.com/maps/search/?api=1&query=NO.251%2FB+Building,+4th+main,+Anjineya+temple+street,+Uttarahalli,+Bangalore+-+560061"
                target="_blank"
                rel="noreferrer"
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'var(--primary-color)',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
                  zIndex: 2,
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <ExternalLink size={14} /> Open in Google Maps
              </a>
            </div>
          </div>

          {/* Right: Direct Contact Form */}
          <div className="contact-card-box">
            <h2 className="contact-card-title">Send Us a Message</h2>
            <p className="contact-card-sub">
              Fill out the form below and we'll reply directly via WhatsApp or email promptly.
            </p>

            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '36px 20px',
                  background: '#f0fdf4',
                  borderRadius: '16px',
                  border: '1px solid #bbf7d0'
                }}
              >
                <CheckCircle2 size={56} style={{ color: '#16a34a', margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: 'var(--font-serif)', color: '#166534', fontSize: '1.4rem', marginBottom: '6px' }}>Message Sent!</h3>
                <p style={{ color: '#15803d', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Thank you for reaching out. We have opened your query in WhatsApp and will get back to you shortly.
                </p>
                <button
                  type="button"
                  className="contact-btn-submit"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  style={{ maxWidth: '240px', margin: '0 auto' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="contact-name">
                    Full Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    className="contact-form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="contact-email">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    className="contact-form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="contact-phone">
                    Phone / WhatsApp No. (Optional)
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    className="contact-form-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="contact-subject">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    className="contact-form-input"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label" htmlFor="contact-message">
                    Your Message / Inquiry *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    className="contact-form-textarea"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="contact-btn-submit">
                  <Send size={18} /> Send Message via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
