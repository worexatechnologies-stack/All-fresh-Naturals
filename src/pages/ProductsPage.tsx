import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Eye, Check, Leaf, ShieldCheck, FlaskConical, Heart, Truck, Star, ChevronDown, ChevronUp, MessageSquare, Zap, ShoppingCart, Search, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BUSINESS_WHATSAPP_NUMBER } from '../config/whatsapp';
import type { Product } from '../data/products';
import InstantOrderModal from '../components/InstantOrderModal';

const faqs = [
  {
    q: 'Where do you deliver?',
    a: 'Currently across Bangalore with 1–3 business day delivery. We also deliver across India via courier.'
  },
  {
    q: 'How do I place an order?',
    a: 'You can add items to your cart and checkout online, or click “Buy Now” to order directly on WhatsApp.'
  },
  {
    q: 'Can I order more than one product at a time?',
    a: 'Yes! Add all desired items to your cart or mention multiple items in your WhatsApp order.'
  },
  {
    q: 'Is the malt suitable for children?',
    a: 'Yes! Both Ragi Malt and ABC Malt are 100% natural, preservative-free, and safe for toddlers, adults, and seniors.'
  }
];

export default function ProductsPage() {
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [instantOrderProd, setInstantOrderProd] = useState<Product | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'abc' | 'ragi'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory =
          categoryFilter === 'all' ||
          (categoryFilter === 'abc' && p.id.toLowerCase().includes('abc')) ||
          (categoryFilter === 'ragi' && p.id.toLowerCase().includes('ragi'));

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q));

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        return 0;
      });
  }, [products, categoryFilter, searchQuery, sortBy]);

  const handleAddToCart = (product: Product) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="store-page-root">
      <Helmet>
        <title id="metaTitle">
          Best Ragi Malt | Healthy, Delicious &amp; Easy Ragi Drink
        </title>

        <meta
          name="description"
          id="metaDescription"
          content="Explore the best ragi malt from All Fresh Naturals, made with quality ingredients for a wholesome and convenient choice that fits naturally into your everyday routine."
        />

        <meta
          name="keywords"
          id="metaKeywords"
          content="best ragi malt, ragi malt drink powder, ragi malt for adults, abc malt powder, abc malt powder benefits, ragi malt powder online, malted ragi flour, ragi health drink"
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="Discover the Best Ragi Malt for a Natural Choice From All Fresh Naturals"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Discover quality and the best ragi malt from All Fresh Naturals, crafted with carefully selected ingredients for a wholesome food choice that is convenient to enjoy as part of daily life."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/products"
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
          content="Shop Quality and Best Ragi Malt Online | All Fresh Naturals"
        />

        <meta
          id="twitterDescription"
          name="twitter:description"
          content="Looking for quality, best ragi malt? Explore All Fresh Naturals for a wholesome product made with carefully selected ingredients and a convenient option for everyday nutrition."
        />

        <meta
          id="author"
          name="author"
          content="Akshay"
        />

        <link
          id="canonical"
          rel="canonical"
          href="https://allfreshnaturals.com/products"
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
      {/* ════════════════════════════════════════════════
          STOREFRONT HERO BANNER (DEDICATED CATALOG DESIGN)
      ════════════════════════════════════════════════ */}
      <section className="store-hero" aria-label="Store Catalog Header">
        <div className="store-hero-container">
          <div className="store-hero-badge">
            <Leaf size={14} /> NATURAL FOOD STORE
          </div>

          <h1 className="store-hero-title">
            Wholesome Health Mixes & Malts
          </h1>

          <p className="store-hero-subtitle">
            Pure, homemade daily nutrition made from sprouted grains, sun-dried roots and unrefined jaggery. Handcrafted fresh in Bangalore with zero preservatives and zero artificial additives.
          </p>

          {/* Quick Trust Badges */}
          <div className="store-hero-badges-row">
            <span className="store-badge-pill">🌾 Sprouted Supergrains</span>
            <span className="store-badge-pill">🍯 Pure Unrefined Jaggery</span>
            <span className="store-badge-pill">🛡️ FSSAI Certified</span>
            <span className="store-badge-pill">🚚 Fresh Bangalore Dispatch</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          CATALOG CONTROLS & FILTER TOOLBAR
      ════════════════════════════════════════════════ */}
      <div className="store-toolbar-wrap">
        <div className="store-toolbar-container">
          <div className="store-toolbar">
            {/* Category Filter Pills */}
            <div className="store-cat-pills">
              <button
                type="button"
                className={`store-cat-btn${categoryFilter === 'all' ? ' store-cat-btn--active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                All Products ({products.length})
              </button>
              <button
                type="button"
                className={`store-cat-btn${categoryFilter === 'abc' ? ' store-cat-btn--active' : ''}`}
                onClick={() => setCategoryFilter('abc')}
              >
                🍎 ABC Malt
              </button>
              <button
                type="button"
                className={`store-cat-btn${categoryFilter === 'ragi' ? ' store-cat-btn--active' : ''}`}
                onClick={() => setCategoryFilter('ragi')}
              >
                🌾 Ragi Malt
              </button>
            </div>

            {/* Search and Sort controls */}
            <div className="store-tools-right">
              <div className="store-search-box">
                <Search size={16} className="store-search-icon" />
                <input
                  type="text"
                  placeholder="Search ingredients, mixes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="store-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="store-search-clear"
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <label className="store-sort-box" htmlFor="store-sort-select">
                <SlidersHorizontal size={14} className="store-sort-icon" />
                <select
                  id="store-sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="store-sort-select"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="store-sort-chevron" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════
          PRODUCT CATALOG GRID
      ════════════════════════════════════════════════ */}
      <section className="store-catalog-section">
        <div className="store-catalog-container">
          {filteredProducts.length === 0 ? (
            <div className="store-empty-state">
              <div className="store-empty-icon">🌱</div>
              <h3>No matching products found</h3>
              <p>Try clearing your search query or switching categories.</p>
              <button
                type="button"
                className="hp-btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('all');
                }}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div className="store-products-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="store-card">
                  {/* Product Header Badge */}
                  <div
                    className="store-card-visual"
                    onClick={() => navigate(`/products/${product.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/products/${product.id}`);
                      }
                    }}
                    aria-label={`View details for ${product.name}`}
                  >
                    {product.badge && (
                      <span className="store-card-badge">{product.badge}</span>
                    )}

                    <div className="store-card-img-wrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="store-card-img"
                        loading="lazy"
                        onError={(e) => {
                          const isAbc = product.id.toLowerCase().includes('abc') || product.name.toLowerCase().includes('abc');
                          e.currentTarget.src = isAbc ? '/assets/abc_malt_dual_mockup.jpg' : '/assets/ragi_malt_dual_mockup.jpg';
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      className="store-card-quickview"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/${product.id}`);
                      }}
                      aria-label={`View details for ${product.name}`}
                    >
                      <Eye size={14} /> Quick View
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="store-card-body">
                    <div className="store-card-rating">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} fill="#f59e0b" color="#f59e0b" />
                      ))}
                      <strong className="store-rating-num">4.9</strong>
                      <span className="store-rating-count">(120+ reviews)</span>
                    </div>

                    <h3 className="store-card-name">
                      <Link to={`/products/${product.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="store-card-tagline">{product.tagline}</p>

                    {/* Ingredient Chips */}
                    <div className="store-card-ingredients">
                      {product.ingredients.slice(0, 4).map((ing, idx) => (
                        <span key={idx} className="store-ing-chip">
                          {ing}
                        </span>
                      ))}
                      {product.ingredients.length > 4 && (
                        <span className="store-ing-more">+{product.ingredients.length - 4} more</span>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="store-card-footer">
                      <div className="store-card-pricing">
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                          <div className="store-price-val">₹{product.price}</div>
                          {product.originalPrice && (
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>
                              ₹{product.originalPrice}
                            </span>
                          )}
                        </div>
                        <div className="store-price-unit">{product.size}</div>
                      </div>

                      <div className="store-card-btns">
                        <button
                          type="button"
                          className={`store-add-btn${addedId === product.id ? ' store-add-btn--added' : ''}`}
                          onClick={() => handleAddToCart(product)}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          {addedId === product.id ? (
                            <><Check size={16} /> Added!</>
                          ) : (
                            <><ShoppingCart size={16} /> Add to Cart</>
                          )}
                        </button>

                        <button
                          type="button"
                          className="store-buy-now-btn"
                          onClick={() => setInstantOrderProd(product)}
                          aria-label={`Buy ${product.name} now`}
                          title="Buy now via WhatsApp"
                        >
                          <Zap size={15} fill="currentColor" /> Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Our Products */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 52px' }}>
            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Why All Fresh Naturals</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: 'var(--primary-color)', marginTop: '8px' }}>What Makes Our Products Different</h2>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              We don’t mass produce. We prepare every batch the way we cook for our own children clean, patient, and honest.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            {[
              {
                icon: <Leaf size={24} />,
                color: '#15803d',
                bg: 'linear-gradient(135deg, #edf7f0 0%, #dcfce7 100%)',
                border: 'rgba(22, 163, 74, 0.2)',
                title: 'Sun-Dried & Sprouted Grains',
                desc: 'Ragi and millets are sprouted to increase natural calcium and iron, then sun dried to lock in nutrients.'
              },
              {
                icon: <ShieldCheck size={24} />,
                color: '#0d9488',
                bg: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: 'rgba(13, 148, 136, 0.2)',
                title: 'FSSAI Licensed Kitchen',
                desc: 'Every batch is made under License No. 21226186000460 in a sterilised home kitchen.'
              },
              {
                icon: <FlaskConical size={24} />,
                color: '#d97706',
                bg: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                border: 'rgba(217, 119, 6, 0.25)',
                title: 'Zero Chemicals. Zero Shortcuts.',
                desc: 'No maltodextrin, no stabilisers, no artificial colours or emulsifiers.'
              },
              {
                icon: <Heart size={24} />,
                color: '#db2777',
                bg: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                border: 'rgba(219, 39, 119, 0.2)',
                title: 'Small Batch Freshness',
                desc: 'We mill and pack only after you order, so you receive the freshest possible product.'
              },
              {
                icon: <Star size={24} />,
                color: '#d97706',
                bg: 'linear-gradient(135deg, #fffde7 0%, #fef3c7 100%)',
                border: 'rgba(217, 119, 6, 0.25)',
                title: 'Naturally Sweetened',
                desc: 'We use only unrefined jaggery, never refined sugar.'
              },
              {
                icon: <Truck size={24} />,
                color: '#059669',
                bg: 'linear-gradient(135deg, #edf7f0 0%, #dcfce7 100%)',
                border: 'rgba(5, 150, 105, 0.2)',
                title: 'Direct from Maker to You',
                desc: 'Poornima personally prepares and packs every order. You can always message her directly.'
              },
            ].map(({ icon, color, bg, border, title, desc }, index) => (
              <div key={title} className="product-value-card product-value-card-enter afn-green-card" style={{
                animationDelay: `${index * 80}ms`,
                background: 'linear-gradient(145deg, #ffffff 0%, #fafcfb 100%)',
                padding: '28px 24px',
                borderRadius: '22px',
                border: '1.5px solid rgba(16, 185, 129, 0.22)',
                boxShadow: '0 10px 28px rgba(15, 57, 35, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.95)',
              }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: bg, border: `1px solid ${border}`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>{icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.14rem', fontWeight: 700, color: '#0f3923', marginBottom: '8px' }}>{title}</h3>
                <p style={{ color: '#4b5e53', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Order Banner */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, #3a6040 100%)',
        padding: '56px 0',
        color: 'var(--white)',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '40px', alignItems: 'center' }}>
            <div>
              <span style={{ color: 'var(--gold-accent)', fontWeight: 'bold', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>How Ordering Works</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginTop: '8px', marginBottom: '16px', lineHeight: '1.3', color: '#ffffff' }}>
                From Your Order to Fresh Delivery
              </h2>
              <p style={{ opacity: 0.88, lineHeight: '1.7', fontSize: '0.97rem', marginBottom: '28px' }}>
                Simple, direct, and fresh. Send your order directly to Poornima on WhatsApp.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a
                  href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ backgroundColor: '#25D366', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <MessageSquare size={16} /> Order via WhatsApp
                </a>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { step: '1', title: 'Choose your product and quantity' },
                { step: '2', title: 'Send the order on WhatsApp with your details' },
                { step: '3', title: 'Poornima confirms the order and delivery date' },
                { step: '4', title: 'Your fresh batch is prepared, packed, and delivered in Bangalore' },
              ].map(({ step, title }) => (
                <div key={step} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '50%',
                    backgroundColor: 'var(--accent-color)',
                    color: 'var(--white)', fontWeight: 700, fontSize: '0.85rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0
                  }}>{step}</div>
                  <div>
                    <strong style={{ fontSize: '0.95rem' }}>{title}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--white)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ maxWidth: '780px' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Got Questions?</span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: 'var(--primary-color)', marginTop: '8px' }}>Frequently Asked Questions</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => (
              <div key={idx} style={{
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: openFaq === idx ? 'var(--white)' : 'var(--white)',
                transition: 'background-color 0.2s'
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '18px 20px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    gap: '16px', fontFamily: 'var(--font-serif)', fontSize: '1rem',
                    color: 'var(--primary-color)', fontWeight: 600
                  }}
                  aria-expanded={openFaq === idx}
                >
                  <span>{faq.q}</span>
                  {openFaq === idx
                    ? <ChevronUp size={18} style={{ flexShrink: 0, color: 'var(--accent-color)' }} />
                    : <ChevronDown size={18} style={{ flexShrink: 0, color: 'var(--text-light)' }} />
                  }
                </button>
                {openFaq === idx && (
                  <p style={{ margin: 0, padding: '0 20px 18px', color: 'var(--text-light)', fontSize: '0.93rem', lineHeight: '1.7', backgroundColor: 'var(--white)' }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <p style={{ color: 'var(--text-light)', fontSize: '0.93rem', marginBottom: '16px' }}>
              Still have questions? Just chat with us on WhatsApp we’re happy to help.
            </p>
            <a
              href={`https://wa.me/${BUSINESS_WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <MessageSquare size={16} /> Chat with Us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      <InstantOrderModal
        product={instantOrderProd}
        isOpen={!!instantOrderProd}
        onClose={() => setInstantOrderProd(null)}
      />

    </div>
  );
}
