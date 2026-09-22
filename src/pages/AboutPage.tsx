import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  CheckCircle,
  Leaf,
  Heart,
  Users,
  ShieldCheck,
  Flame,
  Star,
  Award,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';
import productMakerImg from '../assets/poornima-image.jpg';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: '5',
    comment: ''
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.comment) {
      return alert('Please fill in your Name and Review Comment.');
    }

    let message = `*NEW WEBSITE REVIEW - ALL FRESH NATURALS*\n\n`;
    message += `• *Name:* ${formData.name}\n`;
    if (formData.role) message += `• *Role/Location:* ${formData.role}\n`;
    message += `• *Rating:* ${'★'.repeat(Number(formData.rating))}\n`;
    message += `• *Review:* "${formData.comment}"\n`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encoded}`, '_blank');
  };

  return (
    <div className="about-page-root">
      <Helmet>
        <title id="metaTitle">
          About All Fresh Naturals | Our Story, Values &amp; Quality
        </title>

        <meta
          name="description"
          id="metaDescription"
          content="Explore About All Fresh Naturals and our dedication to quality ingredients, natural food products, and incorporating wholesome choices into daily life for modern families."
        />

        <meta
          name="keywords"
          id="metaKeywords"
          content="about all fresh naturals, founder of all fresh naturals, ingredients for ragi malt, instant ragi malt, ragi malt powder recipe, ragi malt recipe"
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="About All Fresh Naturals | Quality, Nature &amp; Goodness"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Learn about All Fresh Naturals and our commitment to bringing quality, wholesome food products to families who value natural goodness, trusted ingredients, and better choices."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/about"
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
          content="About All Fresh Naturals | Our Story, Values &amp; Mission"
        />

        <meta
          id="twitterDescription"
          name="twitter:description"
          content="Discover the story behind About All Fresh Naturals and our commitment to quality, wholesome ingredients and naturally inspired food products made for everyday wellness and better living."
        />

        <meta
          id="author"
          name="author"
          content="Akshay"
        />

        <link
          id="canonical"
          rel="canonical"
          href="https://allfreshnaturals.com/about"
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
      {/* ══════════════════════════════════════════════════
          ABOUT HERO SECTION
      ══════════════════════════════════════════════════ */}
      <section className="about-hero-section">
        <div className="nh-container">
          <div className="about-hero-content nh-scroll-reveal">
            <div className="nh-pill nh-pill--amber">
              <Leaf size={13} /> HANDCRAFTED WITH LOVE IN BENGALURU
            </div>
            <h1 className="about-hero-title">Our Homemade Story</h1>
            <p className="about-hero-desc">
              All Fresh Naturals is a small family kitchen in Bengaluru that makes pure, chemical-free nutrition in fresh small batches the traditional way.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          MEET THE MAKER SECTION
      ══════════════════════════════════════════════════ */}
      <section className="about-maker-section">
        <div className="nh-container">
          <div className="about-maker-grid">
            {/* Maker Image 3D Card */}
            <div className="about-maker-card nh-scroll-reveal">
              <div className="about-maker-img-wrap">
                <img
                  src={productMakerImg}
                  alt="Poornima - Product Maker of All Fresh Naturals"
                  className="about-maker-img"
                  width={780}
                  height={894}
                  loading="eager"
                  decoding="async"
                />
                <div className="about-maker-badge">
                  <strong className="about-maker-badge-name">Poornima</strong>
                  <span className="about-maker-badge-role">Founder &amp; Artisan Product Maker</span>
                </div>
              </div>
            </div>

            {/* Maker Story & Kitchen Standards */}
            <div className="about-maker-info nh-scroll-reveal">
              <div className="nh-pill nh-pill--green" style={{ marginBottom: 12 }}>
                <Heart size={13} /> MEET THE MAKER
              </div>
              <h2 className="about-section-heading">Prepared by Poornima</h2>
              <p className="about-lead-text">
                Every pouch of malt is made by Poornima herself in our home kitchen in Uttarahalli, Bengaluru.
              </p>

              <div className="about-quote-box">
                <p className="about-quote-text">
                  “I began making these mixes for my own children because I could not find anything truly clean in the market. What started as a mother’s simple experiment at home slowly became something friends and neighbours asked for again and again.
                </p>
                <p className="about-quote-text" style={{ margin: 0 }}>
                  Today I prepare the same recipe for your family. We use only small domestic mills never big commercial machines so the aroma and freshness stay intact.”
                </p>
              </div>

              <div className="about-standards-glass-card">
                <h3 className="about-card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={18} color="#15803d" /> Kitchen Hygiene Standards
                </h3>
                <ul className="about-checklist">
                  <li>
                    <CheckCircle size={16} className="about-check-icon" />
                    <span><strong>Purified Water Only</strong> – Apples, carrots and beetroots are washed only in purified water</span>
                  </li>
                  <li>
                    <CheckCircle size={16} className="about-check-icon" />
                    <span><strong>Glass Storage</strong> – All ingredients are kept in food grade glass jars</span>
                  </li>
                  <li>
                    <CheckCircle size={16} className="about-check-icon" />
                    <span><strong>Daily Sterilization</strong> – Roasting pans and grinding chambers are steam cleaned every single day</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          WHY WE STARTED & OUR PROMISE
      ══════════════════════════════════════════════════ */}
      <section className="about-story-section">
        <div className="nh-container">
          <div className="about-story-grid">
            <div className="about-story-col-left nh-scroll-reveal">
              <div className="nh-pill nh-pill--amber" style={{ marginBottom: 12 }}>
                <Heart size={13} /> TRADITIONAL HERITAGE
              </div>
              <h2 className="about-section-heading">Why We Started</h2>
              <p className="about-body-text">
                We grew up believing in traditional Indian food. But when we looked for ready health mixes, almost everything contained preservatives, refined sugar, or artificial flavours.
              </p>
              <p className="about-body-text">
                So we decided to make our own. We began with the old family Ragi Malt recipe. We source good grains, sprout them, sun dry them, and grind them fresh in small batches exactly the way we cook for our own home.
              </p>
              <p className="about-body-text" style={{ marginBottom: 10 }}>
                Now we offer products made with the same care:
              </p>
              <ul className="about-checklist" style={{ paddingLeft: 4 }}>
                <li>
                  <CheckCircle size={16} className="about-check-icon" />
                  <span><strong>ABC Malt</strong> (Apple, Beetroot &amp; Carrot)</span>
                </li>
                <li>
                  <CheckCircle size={16} className="about-check-icon" />
                  <span><strong>Ragi Malt Health Mix</strong></span>
                </li>
              </ul>
            </div>

            <div className="about-story-col-right">
              {/* Our Promise Glass Card */}
              <div className="about-glass-card nh-scroll-reveal">
                <div className="about-card-icon-pod">
                  <Leaf size={24} color="#15803d" />
                </div>
                <h3 className="about-card-title">Our Promise</h3>
                <ul className="about-checklist">
                  <li><CheckCircle size={15} className="about-check-icon" /> <span>100% natural, zero chemicals</span></li>
                  <li><CheckCircle size={15} className="about-check-icon" /> <span>Made fresh in small batches</span></li>
                  <li><CheckCircle size={15} className="about-check-icon" /> <span>Ingredients sourced with care</span></li>
                  <li><CheckCircle size={15} className="about-check-icon" /> <span>FSSAI Licensed (Lic. No. 21226186000460)</span></li>
                </ul>
              </div>

              {/* Made in India Glass Card */}
              <div className="about-glass-card nh-scroll-reveal nh-scroll-delay-1">
                <div className="about-card-icon-pod" style={{ background: 'rgba(254, 243, 199, 0.8)', borderColor: 'rgba(217, 158, 80, 0.3)' }}>
                  <Heart size={24} color="#d97706" />
                </div>
                <h3 className="about-card-title">Made in Bengaluru, With Love</h3>
                <p className="about-card-text">
                  From our home in Uttarahalli, Bengaluru, Poornima prepares every product with quiet attention to cleanliness and nutritional integrity.
                </p>
                <Link to="/products" className="nh-btn nh-btn--solid" style={{ marginTop: 8 }}>
                  Explore Our Products <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          ETHICAL SOURCING & PROCESSING (3 GLASSMORPHIC CARDS)
      ══════════════════════════════════════════════════ */}
      <section className="about-sourcing-section">
        <div className="nh-container">
          <div className="nh-section-center nh-scroll-reveal">
            <div className="nh-pill nh-pill--green">
              <ShieldCheck size={13} /> BEHIND THE SCENES
            </div>
            <h2 className="nh-section-title">Ethical Sourcing &amp; Processing</h2>
            <p className="nh-section-sub" style={{ maxWidth: '640px', margin: '0 auto 28px' }}>
              How we handpick our ingredients and handle them with traditional reverence.
            </p>
          </div>

          <div className="about-sourcing-grid">
            {/* Card 1 */}
            <div className="about-sourcing-glass-card nh-scroll-reveal">
              <div className="about-sourcing-icon-pod pod-green">
                <Users size={24} />
              </div>
              <h3 className="about-sourcing-title">Supporting Local Farms</h3>
              <p className="about-sourcing-desc">
                We buy ragi, millets, carrots and beetroots straight from trusted farmers in Karnataka. A short supply chain means produce reaches our kitchen still naturally fresh.
              </p>
            </div>

            {/* Card 2 */}
            <div className="about-sourcing-glass-card nh-scroll-reveal nh-scroll-delay-1">
              <div className="about-sourcing-icon-pod pod-teal">
                <ShieldCheck size={24} />
              </div>
              <h3 className="about-sourcing-title">Meticulous Quality Checks</h3>
              <p className="about-sourcing-desc">
                Every grain is cleaned twice to remove stones, dust, and husk. Sun-dried apples and roots are washed thoroughly in a natural citrus rinse before milling.
              </p>
            </div>

            {/* Card 3 */}
            <div className="about-sourcing-glass-card nh-scroll-reveal nh-scroll-delay-2">
              <div className="about-sourcing-icon-pod pod-amber">
                <Flame size={24} />
              </div>
              <h3 className="about-sourcing-title">Gentle Slow Roasting</h3>
              <p className="about-sourcing-desc">
                After sun drying, grains are roasted slowly on traditional cast-iron pans over low flame. This gentle process brings out deep aroma without compromising vitamins.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SHARE YOUR EXPERIENCE REVIEW FORM (GLASSMORPHIC)
      ══════════════════════════════════════════════════ */}
      <section className="about-review-section">
        <div className="nh-container">
          <div className="about-review-glass-card nh-scroll-reveal">
            <div className="about-review-header">
              <div className="nh-pill nh-pill--amber" style={{ marginBottom: 12 }}>
                <Star size={13} fill="#d97706" color="#d97706" /> SHARE YOUR EXPERIENCE
              </div>
              <h2 className="about-review-title">We'd Love Your Feedback</h2>
              <p className="about-review-subtitle">
                Your words inspire our small family kitchen in Bangalore to keep crafting pure, honest, traditional food.
              </p>
            </div>

            <form onSubmit={handleSubmitReview} className="afn-review-form">
              <div className="afn-form-grid">
                <div className="afn-form-field">
                  <label className="afn-form-label" htmlFor="rev-name">
                    Your Name <span className="afn-required">*</span>
                  </label>
                  <input
                    type="text"
                    id="rev-name"
                    className="afn-input"
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="afn-form-field">
                  <label className="afn-form-label" htmlFor="rev-role">
                    Role / Location <span className="afn-optional">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="rev-role"
                    className="afn-input"
                    placeholder="e.g. Mother of two, Bangalore"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
              </div>

              <div className="afn-form-field">
                <label className="afn-form-label">
                  Your Rating <span className="afn-required">*</span>
                </label>
                <div className="afn-rating-wrapper">
                  <div
                    className="afn-rating-stars-interactive"
                    onMouseLeave={() => setHoverRating(null)}
                    role="radiogroup"
                    aria-label="Star Rating"
                  >
                    {[1, 2, 3, 4, 5].map((num) => {
                      const activeScore = hoverRating !== null ? hoverRating : Number(formData.rating || 5);
                      const isFilled = num <= activeScore;
                      return (
                        <button
                          key={num}
                          type="button"
                          className={`afn-star-btn ${isFilled ? 'afn-star-btn--filled' : 'afn-star-btn--empty'} ${Number(formData.rating) === num ? 'afn-star-btn--selected' : ''}`}
                          onClick={() => setFormData({ ...formData, rating: String(num) })}
                          onMouseEnter={() => setHoverRating(num)}
                          aria-label={`${num} star${num > 1 ? 's' : ''}`}
                          title={`${num} Star${num > 1 ? 's' : ''}`}
                        >
                          <Star
                            size={30}
                            className="afn-star-svg"
                          />
                        </button>
                      );
                    })}
                  </div>

                  <div className="afn-rating-status-chip">
                    <span className="afn-rating-status-score">
                      {(hoverRating !== null ? hoverRating : Number(formData.rating || 5))}.0
                    </span>
                    <span className="afn-rating-status-divider">/</span>
                    <span className="afn-rating-status-max">5</span>
                    <span className="afn-rating-status-dot">•</span>
                    <span className="afn-rating-status-text">
                      {
                        (hoverRating !== null ? hoverRating : Number(formData.rating || 5)) === 5 ? '5 - Excellent' :
                        (hoverRating !== null ? hoverRating : Number(formData.rating || 5)) === 4 ? '4 - Good' :
                        (hoverRating !== null ? hoverRating : Number(formData.rating || 5)) === 3 ? '3 - Average' :
                        (hoverRating !== null ? hoverRating : Number(formData.rating || 5)) === 2 ? '2 - Fair' : '1 - Poor'
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="afn-form-field">
                <label className="afn-form-label" htmlFor="rev-comment">
                  Your Review / Experience <span className="afn-required">*</span>
                </label>
                <textarea
                  id="rev-comment"
                  className="afn-textarea"
                  rows={4}
                  placeholder="How did you and your family enjoy our ABC Malt or Ragi Malt? Tell us your thoughts..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="afn-review-submit-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Send Review via WhatsApp
              </button>

              <p className="afn-review-disclaimer">
                🔒 Opens WhatsApp with your review pre-filled to send directly to All Fresh Naturals.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
