import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from '../assets/logo.jpg';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="afn-footer">
      {/* Upper Footer */}
      <div className="afn-footer-upper">
        <div className="afn-footer-container">

          {/* Brand Column */}
          <div className="afn-footer-brand">
            <Link to="/" className="afn-footer-logo">
              <img src={logo} alt="All Fresh Naturals" className="afn-footer-logo-img" />
              <div className="afn-footer-logo-text">
                <span className="afn-footer-logo-line1">All Fresh</span>
                <span className="afn-footer-logo-line2">Naturals</span>
              </div>
            </Link>
            <p className="afn-footer-brand-desc">
              Traditional homemade nutrition handcrafted in Bangalore with sprouted grains, sun-dried roots, and pure unrefined jaggery. Small batches. Zero preservatives. Zero white sugar.
            </p>

            {/* Trust Badges */}
            <div className="afn-footer-trust">
              <span className="afn-footer-trust-badge">🌿 100% Homemade</span>
              <span className="afn-footer-trust-badge">🛡️ FSSAI Lic. 21226186000460</span>
              <span className="afn-footer-trust-badge">🌱 Zero Chemicals</span>
            </div>

            {/* Social */}
            <div className="afn-footer-socials">
              <a
                href="https://www.instagram.com/allfreshnaturals?igsi=cHhweGM2ZGo5OWJk"
                className="afn-footer-social"
                aria-label="Instagram"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
              </a>
              <a
                href="https://www.facebook.com/people/All-fresh-naturals/61593628342025/"
                className="afn-footer-social"
                aria-label="Facebook"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a
                href="https://wa.me/918553428079?text=Hello%20All%20Fresh%20Naturals!"
                className="afn-footer-social afn-footer-social--wa"
                aria-label="WhatsApp"
                target="_blank"
                rel="noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="afn-footer-col">
            <h4 className="afn-footer-col-title">Quick Links</h4>
            <ul className="afn-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Our Story</Link></li>
              <li><Link to="/products">Shop Products</Link></li>
              <li><Link to="/articles">Nutrition Articles</Link></li>
              <li><Link to="/contact">Contact Bengaluru Kitchen</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="afn-footer-col">
            <h4 className="afn-footer-col-title">Our Pure Range</h4>
            <ul className="afn-footer-links">
              <li><Link to="/products">Sprouted Ragi Malt</Link></li>
              <li><Link to="/products">ABC Malt (Apple Beet Carrot)</Link></li>
              <li><Link to="/products">Pure Health Mix</Link></li>
              <li><Link to="/products">View All Products →</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="afn-footer-col">
            <h4 className="afn-footer-col-title">Bangalore Kitchen</h4>
            <ul className="afn-footer-contact">
              <li>
                <Phone size={15} />
                <a href="tel:+918553428079">+91 85534 28079</a>
              </li>
              <li>
                <Mail size={15} />
                <a href="mailto:poori.monika@gmail.com">poori.monika@gmail.com</a>
              </li>
              <li>
                <MapPin size={15} />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Uttarahalli,+Bangalore"
                  target="_blank"
                  rel="noreferrer"
                >
                  Uttarahalli, Bengaluru – 560061
                </a>
              </li>
            </ul>

            <a
              href="https://wa.me/918553428079?text=Hello%20All%20Fresh%20Naturals!%20I%20would%20like%20to%20order."
              target="_blank"
              rel="noreferrer"
              className="afn-footer-wa-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Quick Order on WhatsApp
            </a>
          </div>

        </div>
      </div>

      {/* Footer Bottom */}
      <div className="afn-footer-bottom">
        <div className="afn-footer-container afn-footer-bottom-inner">
          <p className="afn-footer-copy">© {year} All Fresh Naturals. Handcrafted in Bengaluru. All Rights Reserved.</p>
          <div className="afn-footer-credit">
            <span>Developed and Designed by </span>
            <a
              href="https://worexatechnologies.com/"
              target="_blank"
              rel="noreferrer"
              className="afn-footer-worexa-link"
              title="Worexa Technologies - Web Development & Digital Solutions"
            >
              Worexa Technologies
            </a>
          </div>
          <div className="afn-footer-bottom-links">
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
