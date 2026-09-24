import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight, Leaf, Shield, Heart, Star,
  ChevronLeft, ChevronRight, Plus, Minus, CheckCircle,
  Sun, Package, Droplet, Flame, Award,
  ShieldCheck, RefreshCw, Check, ChevronUp, Truck,
  MessageCircle, ShoppingCart
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';
import ragiDualMockup from '../assets/ragi_malt_dual_mockup.jpg';
import abcDualMockup from '../assets/abc_malt_dual_mockup.jpg';
import logo from '../assets/logo.jpg';

// ─── Real customer testimonials ───────────────────────────────────────
const REVIEWS = [
  { name: 'Priya R.', role: 'Mother of two · HSR Layout', stars: 5, text: 'I was tired of giving my kids packaged health drinks full of sugar and chemicals. All Fresh Naturals Ragi Malt feels exactly like something made at home. My children actually ask for it every morning.' },
  { name: 'Ananya S.', role: 'Whitefield, Bangalore', stars: 5, text: 'The ABC Malt is my go-to evening drink. No cooking, just mix with warm milk and it\'s ready. It tastes natural and light, not artificially sweet. I\'ve already ordered the third time.' },
  { name: 'Karthik & Meera', role: 'Jayanagar, Bangalore', stars: 5, text: 'We switched to All Fresh after reading that everything is made in small batches. The Ragi Malt has a lovely roasted aroma and keeps us full till lunch. Feels clean and honest.' },
  { name: 'Divya M.', role: 'Working mother · Indiranagar', stars: 5, text: 'As a busy mom, I needed something quick yet healthy. The Ragi Malt takes only a few minutes, and my toddler loves it. Finally a product I feel good giving every day.' },
  { name: 'Suresh P.', role: 'Electronic City, Bangalore', stars: 5, text: 'I bought the ABC Malt for my parents. They find it easy to digest and enjoy the mild jaggery sweetness. No aftertaste of chemicals like other powders. Will continue ordering.' },
];

// ─── FAQ data ─────────────────────────────────────────────────────────
const FAQS = [
  { q: 'Are the products 100% natural?', a: 'Yes. Every ingredient is sourced from trusted natural sources. We use sprouted grains, sun-dried roots, and pure unrefined jaggery. No synthetic additives, no artificial flavours, no chemicals of any kind.' },
  { q: 'Do you use preservatives?', a: 'Absolutely not. Our products are made fresh in small batches and contain zero preservatives. This is why we recommend consuming the product within the shelf life printed on the pack.' },
  { q: 'How are the products prepared?', a: 'Our products are handcrafted using traditional methods in our home kitchen in Bangalore. Grains are sprouted to increase nutrition, then sun-dried, roasted, and ground in small batches for maximum freshness.' },
  { q: 'How should I consume ABC Malt?', a: 'Mix 2–3 tablespoons of ABC Malt powder in warm milk or water. Stir well and enjoy. You can also adjust sweetness to your preference. Suitable as a morning drink or evening snack.' },
  { q: 'How should I consume Ragi Malt?', a: 'Mix 2–3 tablespoons of Sprouted Ragi Malt powder in warm milk or water. It pairs beautifully with hot milk and a pinch of cardamom. Best consumed in the morning for energy and nutrition.' },
  { q: 'Are the products suitable for children?', a: 'Yes! Our products are safe and wholesome for the entire family, from toddlers (above 1 year) to senior citizens. The natural ingredients and absence of preservatives make them ideal for growing children.' },
  { q: 'How long does delivery take?', a: 'We deliver within Bangalore in 1–3 business days. For orders outside Bangalore, delivery typically takes 3–7 business days depending on your location.' },
  { q: 'How should I store the product?', a: 'Store in a cool, dry place away from direct sunlight. Once opened, ensure the pack is sealed tightly or transferred to an airtight container. Consume within the shelf life printed on the packaging.' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [activeReview, setActiveReview] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [addedId, setAddedId] = useState<string | null>(null);

  const getProductFallbackImage = (product: Product) => {
    const id = (product?.id || '').toLowerCase().replace('_', '-');
    if (id.includes('ragi')) return ragiDualMockup;
    return abcDualMockup;
  };
  const reviewTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeHeroProduct, setActiveHeroProduct] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const heroTimer = setInterval(() => {
      setActiveHeroProduct(prev => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(heroTimer);
  }, []);

  useEffect(() => {
    reviewTimerRef.current = setInterval(() => {
      setActiveReview(r => (r + 1) % REVIEWS.length);
    }, 5000);
    return () => { if (reviewTimerRef.current) clearInterval(reviewTimerRef.current); };
  }, []);

  // Scroll progress & back-to-top observer
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('nh-scroll-reveal--visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const revealElements = document.querySelectorAll('.nh-scroll-reveal, .nh-scroll-reveal--left, .nh-scroll-reveal--right, .nh-scroll-reveal--scale');
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [products]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevReview = () => {
    if (reviewTimerRef.current) clearInterval(reviewTimerRef.current);
    setActiveReview(r => (r - 1 + REVIEWS.length) % REVIEWS.length);
  };
  const nextReview = () => {
    if (reviewTimerRef.current) clearInterval(reviewTimerRef.current);
    setActiveReview(r => (r + 1) % REVIEWS.length);
  };

  const handleAddToCart = (product: typeof products[0]) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const waUrl = `https://wa.me/${BUSINESS_WHATSAPP_NUMBER}?text=${encodeURIComponent('Hello All Fresh Naturals! I would like to place an order.')}`;

  return (
    <div className="nh-root">
      <Helmet>
        <title id="metaTitle">
          Ragi Malt &amp; Natural Foods | All Fresh Naturals Online
        </title>

        <meta
          name="description"
          id="metaDescription"
          content="Explore nutritious ragi malt and natural food products from All Fresh Naturals. Crafted with high-quality ingredients for healthy daily choices. Shop online now"
        />

        <meta
          name="keywords"
          id="metaKeywords"
          content="ragi malt, abc malt, abc malt powder, best ragi malt powder, ragi malt powder, ragi malt online shopping, ragi malt packet"
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="Natural Ragi Malt &amp; Healthy Food Products | All Fresh Naturals"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Explore wholesome ragi malt and naturally made food products from All Fresh Naturals, created with quality ingredients for everyday nourishment, wellness, and natural goodness."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/"
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
          content="Ragi Malt, Natural Foods &amp; Healthy Choices | All Fresh Naturals"
        />

        <meta
          id="twitterDescription"
          name="twitter:description"
          content="Discover quality ragi malt and natural food products made with carefully selected ingredients. Choose All Fresh Naturals for wholesome everyday goodness and healthy choices."
        />

        <meta
          id="author"
          name="author"
          content="Akshay"
        />

        <link
          id="canonical"
          rel="canonical"
          href="https://allfreshnaturals.com/"
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
      {/* Top Scroll Progress Indicator */}
      <div
        className="nh-scroll-progress"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Floating Quick Scroll-to-Top Button */}
      <button
        type="button"
        className={`nh-scroll-top-btn ${showScrollTop ? 'nh-scroll-top-btn--show' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top of page"
      >
        <ChevronUp size={22} />
      </button>

      {/* ══════════════════════════════════════════════════
          HERO — Split editorial layout
      ══════════════════════════════════════════════════ */}
      <section className="nh-hero" aria-label="Hero section">
        {/* 4-Color luxury ambient texture blobs */}
        <div className="nh-hero-blob nh-hero-blob--a" aria-hidden="true" />
        <div className="nh-hero-blob nh-hero-blob--b" aria-hidden="true" />
        <div className="nh-hero-blob nh-hero-blob--c" aria-hidden="true" />
        <div className="nh-hero-blob nh-hero-blob--d" aria-hidden="true" />

        <div className="nh-hero-inner nh-container">
          {/* LEFT COLUMN */}
          <div className="nh-hero-left nh-scroll-reveal">
            <div className="nh-hero-pills-row">
              {isAuthenticated && user && (
                <div className="nh-hero-welcome">
                  👋 Welcome back, <strong>{user.name?.split(' ')[0]}</strong>
                </div>
              )}

              <div className="nh-pill nh-pill--green">
                <Leaf size={12} />
                <span>Pure · Natural · Wholesome</span>
              </div>
            </div>

            <h1 className="nh-hero-heading">
              Pure Food.<br />
              <span className="nh-hero-heading-em">Pure Life.</span>
            </h1>

            <p className="nh-hero-body">
              Real homemade nutrition made the traditional way with sprouted grains, sun-dried roots, and pure unrefined jaggery. Zero preservatives, zero artificial fillers.
            </p>

            <div className="nh-hero-actions" data-lenis-prevent="true">
              <Link
                to="/products"
                className="nh-btn nh-btn--solid"
                data-lenis-prevent="true"
                style={{ textDecoration: 'none' }}
              >
                Explore Products <ArrowRight size={16} />
              </Link>
              <Link
                to="/about"
                className="nh-btn nh-btn--outline"
                data-lenis-prevent="true"
                style={{ textDecoration: 'none' }}
              >
                Our Story <Leaf size={14} />
              </Link>
            </div>

            <div className="nh-hero-chips">
              <span className="nh-hero-chip"><CheckCircle size={13} /> Small Batch Fresh</span>
              <span className="nh-hero-chip"><CheckCircle size={13} /> Direct Delivery</span>
              <span className="nh-hero-chip"><CheckCircle size={13} /> Zero Chemicals</span>
            </div>
          </div>

          {/* RIGHT COLUMN — Stacked product cards with Mass-Theme Floating Badges */}
          <div className="nh-hero-right nh-scroll-reveal nh-scroll-reveal--right" aria-label="Featured products">
            {/* Floating Mass Aura Badges */}
            <div className="nh-hero-badge nh-hero-badge--tl" aria-hidden="true">
              <span className="nh-badge-icon">🌿</span>
              <div>
                <strong>100% Sprouted</strong>
                <small>Fresh Small Batch</small>
              </div>
            </div>

            <div className="nh-hero-badge nh-hero-badge--tr" aria-hidden="true">
              <span className="nh-badge-icon">⭐</span>
              <div>
                <strong>4.9 Rating</strong>
                <small>1000+ Families</small>
              </div>
            </div>

            <div className="nh-hero-badge nh-hero-badge--br" aria-hidden="true">
              <span className="nh-badge-icon">🛡️</span>
              <div>
                <strong>Zero Chemicals</strong>
                <small>Pure Jaggery Sweetened</small>
              </div>
            </div>

            {/* ABC card */}
            <button
              type="button"
              className={`nh-prod-card nh-prod-card--abc ${activeHeroProduct === 0 ? 'nh-prod-card--front' : 'nh-prod-card--back'}`}
              onClick={() => setActiveHeroProduct(0)}
              aria-label="View ABC Malt"
            >
              <img
                src={abcDualMockup}
                alt="ABC Malt – Apple Beetroot Carrot"
                className="nh-prod-card-img"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = '/assets/abc_malt_dual_mockup.jpg';
                }}
              />
            </button>

            {/* Ragi card */}
            <button
              type="button"
              className={`nh-prod-card nh-prod-card--ragi ${activeHeroProduct === 1 ? 'nh-prod-card--front' : 'nh-prod-card--back'}`}
              onClick={() => setActiveHeroProduct(1)}
              aria-label="View Sprouted Ragi Malt"
            >
              <img
                src={ragiDualMockup}
                alt="Sprouted Ragi Malt"
                className="nh-prod-card-img"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = '/assets/ragi_malt_dual_mockup.jpg';
                }}
              />
            </button>

            {/* Dot indicators */}
            <div className="nh-prod-dots">
              <button type="button" className={`nh-prod-dot ${activeHeroProduct === 0 ? 'nh-prod-dot--on' : ''}`} onClick={() => setActiveHeroProduct(0)} aria-label="ABC Malt" />
              <button type="button" className={`nh-prod-dot ${activeHeroProduct === 1 ? 'nh-prod-dot--on' : ''}`} onClick={() => setActiveHeroProduct(1)} aria-label="Ragi Malt" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TRUST BAR — 4 pillars floating card
      ══════════════════════════════════════════════════ */}
      <div className="nh-trust-rail nh-container nh-scroll-reveal nh-scroll-reveal--scale">
        <div className="nh-trust-bar">
          {[
            { icon: <Leaf size={20} />, title: '100% Natural', sub: 'Nothing artificial added' },
            { icon: <Award size={20} />, title: 'Small Batches', sub: 'Fresh every time' },
            { icon: <Heart size={20} />, title: 'Packed with Nutrition', sub: 'Vitamins, minerals & fibre' },
            { icon: <Shield size={20} />, title: 'Safe for Everyone', sub: 'Toddlers to grandparents' },
          ].map((item, i) => (
            <div key={i} className="nh-trust-item">
              <div className="nh-trust-icon">{item.icon}</div>
              <div>
                <div className="nh-trust-label">{item.title}</div>
                <div className="nh-trust-sub">{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          PRODUCTS SECTION — DIRECTLY AFTER LANDING PAGE HERO
      ══════════════════════════════════════════════════ */}
      <section className="nh-products" aria-labelledby="nh-products-h">
        <div className="nh-container">
          <div className="nh-products-header nh-scroll-reveal">
            <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto' }}>
              <div className="nh-pill nh-pill--gold"><Package size={12} /> TRADITIONAL HOMEMADE MALTS</div>
              <h2 id="nh-products-h" className="nh-section-title">
                Wholesome Homemade Nutrition<br />for Your Whole Family
              </h2>
              <p className="nh-section-sub" style={{ fontSize: '1rem', color: '#4b5e53', marginTop: '10px', lineHeight: 1.65 }}>
                Slow-roasted and sun-dried in small batches with genuine traditional ingredients, sprouted whole grains, and pure unrefined jaggery. Absolutely <strong>0% preservatives</strong>, <strong>0% maltodextrin</strong>, and <strong>0% refined white sugar</strong>.
              </p>

              {/* Quick Benefit Badges Strip */}
              <div className="nh-prod-benefit-strip">
                <span className="nh-benefit-pill">🌱 100% Sprouted Whole Grains</span>
                <span className="nh-benefit-pill">🍯 Pure Organic Jaggery</span>
                <span className="nh-benefit-pill">💪 High Iron, Calcium & Fibre</span>
                <span className="nh-benefit-pill">👶 Safe from 6 Months to Elders</span>
              </div>
            </div>
            <Link to="/products" className="nh-text-link nh-text-link--muted" style={{ marginTop: '12px' }}>
              View All Products & Packs <ArrowRight size={14} />
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="nh-products-empty nh-scroll-reveal">
              <img src={logo} alt="All Fresh Naturals" className="nh-empty-logo" />
              <h3>Products Loading…</h3>
              <p>Our freshly prepared products will appear here shortly.</p>
              <Link to="/products" className="nh-btn nh-btn--solid" style={{ marginTop: '16px' }}>
                Browse Products <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="wl-products-grid">
              {products.map((product, idx) => (
                <article
                  key={product.id}
                  className={`wl-prod-card-link nh-scroll-reveal nh-scroll-reveal--scale nh-scroll-delay-${(idx % 4) + 1}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/products/${product.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      navigate(`/products/${product.id}`);
                    }
                  }}
                  aria-label={`View ${product.name}`}
                >
                  <div className="wl-prod-card">
                    <div className="wl-prod-img-wrap">
                      <span className={`wl-prod-badge ${idx % 2 === 0 ? 'wl-prod-badge--sale' : 'wl-prod-badge--best'}`}>
                        {idx % 2 === 0 ? 'Sale' : 'Best Sellers'}
                      </span>
                      <img
                        src={product.image || getProductFallbackImage(product)}
                        alt={product.name}
                        className="wl-prod-img"
                        loading="eager"
                        onError={(event) => {
                          const fallback = getProductFallbackImage(product);
                          if (event.currentTarget.src !== fallback) {
                            event.currentTarget.src = fallback;
                          } else {
                            event.currentTarget.src = product.id.toLowerCase().includes('ragi')
                              ? '/assets/ragi_malt_dual_mockup.jpg'
                              : '/assets/abc_malt_dual_mockup.jpg';
                          }
                        }}
                      />
                    </div>

                    <div className="wl-prod-info-row">
                      <div className="wl-prod-text-col">
                        <span className="wl-prod-cat">
                          {product.id.includes('ragi') ? 'Sprouted Superfood' : 'Superfood Blend'}
                        </span>
                        <h3 className="wl-prod-title">{product.name}</h3>
                        <div className="wl-prod-price-wrap">
                          <span className="wl-prod-price">₹{product.price}.00</span>
                          <span className="wl-prod-orig-price">₹{product.originalPrice || (product.price + 100)}.00</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`wl-prod-cart-btn ${addedId === product.id ? 'wl-prod-cart-btn--added' : ''}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        aria-label={`Add ${product.name} to cart`}
                        title="Add to Cart"
                      >
                        {addedId === product.id ? <Check size={16} /> : <ShoppingCart size={16} />}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Quick Nutritional Overview / Quality Guarantee Ribbon */}
          <div className="nh-products-quality-ribbon nh-scroll-reveal">
            <div className="nh-quality-col">
              <strong>Instant 2-Minute Preparation</strong>
              <p>Simply stir 2 spoons into warm milk or water — delicious hot or chilled with no cooking needed.</p>
            </div>
            <div className="nh-quality-divider" />
            <div className="nh-quality-col">
              <strong>Gentle on Tiny & Sensitive Tummies</strong>
              <p>Traditional sprouting breaks down heavy starches for effortless absorption & digestion.</p>
            </div>
            <div className="nh-quality-divider" />
            <div className="nh-quality-col">
              <strong>Fresh Weekly Batches in Bengaluru</strong>
              <p>Milled fresh and shipped directly in sealed food-grade airtight pouches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SERVICES & WHY FAMILIES TRUST US SECTION
      ══════════════════════════════════════════════════ */}
      <section className="nh-promise" id="why-choose-us" aria-labelledby="nh-services-h">
        <div className="nh-container">
          <div className="nh-section-center nh-scroll-reveal">
            <div className="nh-pill nh-pill--green"><Leaf size={12} /> OUR SERVICES & COMMITMENT</div>
            <h2 id="nh-services-h" className="nh-section-title">
              Crafted Fresh for Your Family's Health
            </h2>
            <p className="nh-section-sub" style={{ maxWidth: '680px', margin: '0 auto 28px' }}>
              From our small batch family kitchen in Bengaluru directly to your doorstep. Real food, genuine care, and absolute purity.
            </p>
          </div>

          <div className="nh-services-grid">
            {[
              {
                icon: <Leaf size={22} color="#15803d" />,
                tag: 'Made to Order',
                tagBg: '#ecfdf5',
                tagColor: '#059669',
                title: 'Fresh Batch Preparation',
                desc: 'Every pouch is roasted and milled only after your order is confirmed. Zero warehouse shelf storage for peak aroma and nutrition.',
                link: '/products',
                linkText: 'Explore Fresh Batches',
                isExternal: false
              },
              {
                icon: <Truck size={22} color="#0d9488" />,
                tag: '1–3 Days Bangalore',
                tagBg: '#f0fdfa',
                tagColor: '#0d9488',
                title: 'Direct Doorstep Delivery',
                desc: 'Fast home delivery across Bangalore and reliable express shipping pan-India in sealed, food-grade airtight pouches.',
                link: '/products',
                linkText: 'Order Online or WhatsApp',
                isExternal: false
              },
              {
                icon: <MessageCircle size={22} color="#d97706" />,
                tag: 'Direct Support',
                tagBg: '#fffbeb',
                tagColor: '#d97706',
                title: 'Direct Maker Guidance',
                desc: 'Have questions about baby feeding, recipe preparation, or daily dosage? Chat directly with Poornima on WhatsApp for personal advice.',
                link: waUrl,
                linkText: 'Chat on WhatsApp',
                isExternal: true
              },
              {
                icon: <ShieldCheck size={22} color="#2563eb" />,
                tag: 'FSSAI Certified',
                tagBg: '#eff6ff',
                tagColor: '#2563eb',
                title: '100% Honest Nutrition',
                desc: 'FSSAI Lic. No. 21226186000460. Zero chemical preservatives, zero maltodextrin fillers, and zero white refined sugar.',
                link: '/about',
                linkText: 'Read Our Story',
                isExternal: false
              },
            ].map((service, i) => (
              <div key={i} className={`nh-service-card nh-scroll-reveal nh-scroll-reveal--scale nh-scroll-delay-${i + 1}`}>
                <div className="nh-service-top">
                  <div className="nh-service-icon-wrap">
                    {service.icon}
                  </div>
                  <span className="nh-service-tag" style={{ background: service.tagBg, color: service.tagColor }}>
                    {service.tag}
                  </span>
                </div>
                <h3 className="nh-service-title">{service.title}</h3>
                <p className="nh-service-desc">{service.desc}</p>
                <div className="nh-service-action">
                  {service.isExternal ? (
                    <a href={service.link} target="_blank" rel="noopener noreferrer" className="nh-service-link">
                      <span>{service.linkText}</span>
                      <ArrowRight size={14} />
                    </a>
                  ) : (
                    <Link to={service.link} className="nh-service-link">
                      <span>{service.linkText}</span>
                      <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          PROCESS SECTION — From Nature to Your Home
      ══════════════════════════════════════════════════ */}
      <section className="nh-process" aria-labelledby="nh-process-h">
        <div className="nh-container">
          <div className="nh-section-center nh-scroll-reveal">
            <div className="nh-pill nh-pill--green"><Leaf size={12} /> HOW WE MAKE IT</div>
            <h2 id="nh-process-h" className="nh-section-title">From Nature to Your Home</h2>
            <p className="nh-section-sub">Every batch is handcrafted with care using time-tested traditional methods</p>
          </div>

          <div className="nh-process-steps">
            {[
              { icon: <Leaf size={20} />, num: '01', title: 'Select the Finest Ingredients', desc: 'Only the best natural grains, roots and jaggery make the cut' },
              { icon: <Droplet size={20} />, num: '02', title: 'Sprouting & Activation', desc: 'Grains are sprouted to unlock higher bioavailable nutrition' },
              { icon: <Sun size={20} />, num: '03', title: 'Sun-Dried Naturally', desc: 'Slow sun-drying preserves all vitamins, minerals and flavour' },
              { icon: <Flame size={20} />, num: '04', title: 'Traditional Preparation', desc: 'Roasted and blended using traditional methods for authentic taste' },
              { icon: <Heart size={20} />, num: '05', title: 'Packed With Care', desc: 'Sealed fresh in small batches and delivered directly to you' },
            ].map((step, i) => (
              <div key={i} className={`nh-process-step nh-scroll-reveal nh-scroll-reveal--scale nh-scroll-delay-${i + 1}`}>
                <div className="nh-process-circle">{step.icon}</div>
                <div className="nh-process-num">{step.num}</div>
                <h3 className="nh-process-title">{step.title}</h3>
                <p className="nh-process-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          BRAND STORY SECTION
      ══════════════════════════════════════════════════ */}
      <section className="nh-story" aria-labelledby="nh-story-h">
        <div className="nh-container">
          <div className="nh-story-card nh-scroll-reveal nh-scroll-reveal--scale">
            <div className="nh-story-top">
              <div className="nh-pill nh-pill--earth">🌿 OUR PHILOSOPHY & STORY</div>
              <h2 id="nh-story-h" className="nh-story-title">
                Made With Tradition.<br />
                <span className="nh-accent-text">Created For Today.</span>
              </h2>
              <p className="nh-story-intro">
                All Fresh Naturals was born from a mother's passion to give families wholesome, unadulterated nourishment — the kind that comes from a caring home kitchen, not an industrial factory.
              </p>
            </div>

            <div className="nh-story-pillars">
              {[
                { icon: <Leaf size={22} color="#1d7a42" />, title: 'Sprouted Supergrains', desc: 'Traditional sprouting unlocks higher bioavailability of natural calcium, iron, protein and dietary fiber for lasting vitality.' },
                { icon: <Award size={22} color="#d97706" />, title: 'Small Batch Care', desc: 'Handcrafted fresh in Bangalore. Every batch is slow-roasted and ground without preservatives, synthetic flavors or maltodextrin.' },
                { icon: <Heart size={22} color="#c2185b" />, title: 'Pure Sun-Dried Ingredients', desc: 'Rich sun-dried fruits, crisp nuts, and pure unrefined jaggery. Absolutely zero white refined sugar or chemical fillers.' },
              ].map((p, i) => (
                <div key={i} className={`nh-story-pillar nh-scroll-reveal nh-scroll-delay-${i + 1}`}>
                  <div className="nh-story-pillar-icon">{p.icon}</div>
                  <h3 className="nh-story-pillar-title">{p.title}</h3>
                  <p className="nh-story-pillar-desc">{p.desc}</p>
                </div>
              ))}
            </div>

            <div className="nh-story-stats nh-story-stats--single nh-scroll-reveal">
              <div className="nh-story-stat nh-story-stat--center">
                <div className="nh-story-stat-val">FSSAI</div>
                <div className="nh-story-stat-lbl">Certified Quality • Lic. No. 21226186000460</div>
              </div>
            </div>

            <div className="nh-story-actions nh-scroll-reveal" data-lenis-prevent="true">
              <Link
                to="/about"
                className="nh-btn nh-btn--solid"
                data-lenis-prevent="true"
                style={{ textDecoration: 'none' }}
              >
                Discover Our Full Story <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NUTRITION SECTION
      ══════════════════════════════════════════════════ */}
      <section className="nh-nutrition" aria-labelledby="nh-nutrition-h">
        <div className="nh-container">
          <div className="nh-section-center nh-scroll-reveal">
            <div className="nh-pill nh-pill--green"><Leaf size={12} /> NUTRITION</div>
            <h2 id="nh-nutrition-h" className="nh-section-title">Goodness You Can Feel</h2>
            <p className="nh-section-sub">Naturally packed with the nutrients your body needs every day</p>
          </div>

          <div className="nh-nutrition-grid">
            {[
              { title: 'Calcium',        desc: 'Sprouted ragi is naturally rich in calcium — essential for strong bones and teeth' },
              { title: 'Iron',           desc: 'Supports healthy blood, prevents anaemia and sustains natural energy levels' },
              { title: 'Dietary Fibre',  desc: 'Aids digestion, keeps you full longer and supports a healthy gut microbiome' },
              { title: 'Vitamins',       desc: 'B-complex vitamins from sprouted grains support metabolism and brain health' },
              { title: 'Natural Energy', desc: 'Complex carbohydrates provide sustained energy without sugar crashes' },
              { title: 'Antioxidants',   desc: 'Sun-dried apple, beetroot and carrot in ABC Malt provide powerful antioxidants' },
            ].map((n, i) => (
              <div key={i} className={`nh-nutr-card nh-scroll-reveal nh-scroll-reveal--scale nh-scroll-delay-${i + 1}`}>
                <h3 className="nh-nutr-title">{n.title}</h3>
                <p className="nh-nutr-desc">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          QUALITY PILLARS SECTION
      ══════════════════════════════════════════════════ */}
      <section id="why-choose-us" className="nh-pillars">
        <div className="nh-container">
          <div className="nh-section-center nh-scroll-reveal">
            <span className="nh-overline">OUR QUALITY PILLARS</span>
            <h2 className="nh-section-title">What Makes Our Batches Exceptional</h2>
            <p className="nh-section-sub">Every pouch and bottle is prepared with uncompromising traditional principles.</p>
          </div>

          <div className="nh-pillars-grid">
            {[
              { icon: <RefreshCw size={20} />, title: 'Sprouted Grain Science', desc: 'Sprouting naturally breaks down phytic acid and multiplies bioavailable calcium, iron, and digestive enzymes, making the grains easier for the body to absorb.' },
              { icon: <ShieldCheck size={20} />, title: 'Zero Chemical Preservatives', desc: 'Zero sodium benzoate, zero artificial colours, and zero maltodextrin fillers. Just pure food the way nature intended.' },
              { icon: <Heart size={20} />, title: 'Naturally Sweetened Jaggery', desc: 'Sweetened only with premium unrefined jaggery (gur), which is rich in natural iron and minerals and gives a soft caramel taste without refined sugar.' },
            ].map((p, i) => (
              <div key={i} className={`nh-pillar-card nh-scroll-reveal nh-scroll-reveal--scale nh-scroll-delay-${i + 1}`}>
                <div className="nh-pillar-icon">{p.icon}</div>
                <h3 className="nh-pillar-title">{p.title}</h3>
                <p className="nh-pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════ */}
      <section className="nh-testimonials" aria-labelledby="nh-reviews-h">
        <div className="nh-container">
          <div className="nh-section-center nh-scroll-reveal">
            <div className="nh-pill nh-pill--gold"><Star size={12} fill="currentColor" /> TESTIMONIALS</div>
            <h2 id="nh-reviews-h" className="nh-section-title">Loved by Families</h2>
            <p className="nh-section-sub">Real experiences from real families across Bangalore</p>
          </div>

          <div className="nh-review-stage nh-scroll-reveal nh-scroll-reveal--scale">
            <div className="nh-review-card">
              <div className="nh-review-stars">
                {[...Array(REVIEWS[activeReview].stars)].map((_, i) => (
                  <Star key={i} size={17} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <blockquote className="nh-review-quote">
                "{REVIEWS[activeReview].text}"
              </blockquote>
              <div className="nh-review-author">
                <div className="nh-review-avatar">{REVIEWS[activeReview].name.charAt(0)}</div>
                <div>
                  <div className="nh-review-name">{REVIEWS[activeReview].name}</div>
                  <div className="nh-review-role">{REVIEWS[activeReview].role}</div>
                  <div className="nh-review-verified">✓ Verified Customer</div>
                </div>
              </div>
            </div>

            <div className="nh-review-controls">
              <button type="button" className="nh-review-arrow" onClick={prevReview} aria-label="Previous">
                <ChevronLeft size={20} />
              </button>
              <div className="nh-review-dots">
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`nh-review-dot${i === activeReview ? ' nh-review-dot--on' : ''}`}
                    onClick={() => setActiveReview(i)}
                    aria-label={`Review ${i + 1}`}
                  />
                ))}
              </div>
              <button type="button" className="nh-review-arrow" onClick={nextReview} aria-label="Next">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════ */}
      <section className="nh-faq" aria-labelledby="nh-faq-h">
        <div className="nh-container">
          <div className="nh-section-center" style={{ marginBottom: '44px' }}>
            <div className="nh-pill nh-pill--green"><Leaf size={12} /> FAQ</div>
            <h2 id="nh-faq-h" className="nh-section-title">
              Frequently Asked Questions
            </h2>
            <p className="nh-section-sub">
              Can't find your answer? We're always happy to help.
            </p>
          </div>

          <div className="nh-faq-list nh-faq-list--center nh-scroll-reveal nh-scroll-reveal--scale">
            {FAQS.map((faq, i) => (
              <div key={i} className={`nh-faq-item${openFaq === i ? ' nh-faq-item--open' : ''}`}>
                <button
                  type="button"
                  className="nh-faq-trigger"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{faq.q}</span>
                  <span className="nh-faq-icon" aria-hidden="true">
                    {openFaq === i ? <Minus size={17} /> : <Plus size={17} />}
                  </span>
                </button>
                <div className="nh-faq-body">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="nh-scroll-reveal" style={{ textAlign: 'center', marginTop: '36px' }}>
            <a href={waUrl} target="_blank" rel="noreferrer" className="nh-btn nh-btn--solid">
              Ask on WhatsApp <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FINAL CTA BAND
      ══════════════════════════════════════════════════ */}
      <section className="nh-cta" aria-label="Call to action">
        <div className="nh-cta-glow-a" aria-hidden="true" />
        <div className="nh-cta-glow-b" aria-hidden="true" />

        <div className="nh-container nh-cta-inner nh-scroll-reveal nh-scroll-reveal--scale">
          <div className="nh-cta-content">
            <div className="nh-cta-leaf-deco" aria-hidden="true">🌿</div>
            <div className="nh-cta-leaf-deco nh-cta-leaf-deco--r" aria-hidden="true">🍃</div>

            <div className="nh-pill nh-pill--green">
              <Leaf size={12} /> Homemade · Natural · Fresh
            </div>
            <h2 className="nh-cta-title">
              Bring Home<br />
              <em>Pure Nutrition.</em>
            </h2>
            <p className="nh-cta-sub">Traditional goodness, made naturally for your family.</p>
            <div className="nh-cta-actions">
              <Link to="/products" className="nh-btn nh-btn--cta-solid">
                Shop Our Products <ArrowRight size={16} />
              </Link>
              <a href={waUrl} target="_blank" rel="noreferrer" className="nh-btn nh-btn--cta-ghost">
                Talk to Us
              </a>
            </div>
          </div>

          <div className="nh-cta-visual" aria-hidden="true">
            <img src={ragiDualMockup} alt="All Fresh Naturals Ragi Malt" className="nh-cta-img" loading="lazy" />
          </div>
        </div>
      </section>

    </div>
  );
}
