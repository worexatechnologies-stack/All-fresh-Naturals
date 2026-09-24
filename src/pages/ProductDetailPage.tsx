import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  Plus,
  Minus,
  Check,
  Star,
  ShieldCheck,
  Leaf,
  Award,
  Zap,
  Flame,
  Package,
  Truck,
  Clock,
  Heart
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../data/products';
import InstantOrderModal from '../components/InstantOrderModal';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [instantOrderProd, setInstantOrderProd] = useState<Product | null>(null);

  // Find product by id or slug match
  const product = useMemo(() => {
    if (!id) return null;
    const cleanId = id.toLowerCase().trim();
    return (
      products.find(
        (p) =>
          p.id.toLowerCase() === cleanId ||
          p.id.toLowerCase().replace(/_/g, '-') === cleanId ||
          p.name.toLowerCase().replace(/\s+/g, '-') === cleanId
      ) || null
    );
  }, [id, products]);

  // Related / other products displayed at the downside of the page
  const otherProducts = useMemo(() => {
    if (!product) return products;
    const filtered = products.filter(
      (p) => p.id !== product.id && p.id.replace(/_/g, '-') !== product.id.replace(/_/g, '-')
    );
    return filtered.length > 0 ? filtered : products;
  }, [product, products]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="container" style={{ padding: 'calc(var(--header-height) + 60px) 20px 100px', textAlign: 'center' }}>
        <Helmet>
          <title>Product Not Found | All Fresh Naturals</title>
        </Helmet>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '40px 24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border-color)' }}>
          <Package size={48} color="var(--primary-color)" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontFamily: 'var(--font-serif)', color: 'var(--primary-color)', marginBottom: '12px' }}>Product Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem' }}>
            We could not find the product you're looking for. Please browse our natural malts in the store.
          </p>
          <Link to="/products" className="hp-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeft size={16} /> Back to All Products
          </Link>
        </div>
      </div>
    );
  }

  const currentImage = activeView === 'back' && product.altImage ? product.altImage : product.image;

  return (
    <>
      {product.id === 'abc-malt' || product.id === 'abc_malt' ? (
        <Helmet>
          <title id="metaTitle">Buy ABC Malt Powder Online | 100% Natural Health Drink Mix</title>

          <meta
            name="description"
            id="metaDescription"
            content="Explore nutritious ABC malt powder from All Fresh Naturals, made with quality ingredients for wholesome daily nutrition. Shop natural food products online now."
          />

          <meta
            name="keywords"
            id="metaKeywords"
            content="abc malt powder, abc malt powder benefits, abc malt powder price, abc malt powder best brand, best abc malt powder"
          />

          <meta
            id="ogTitle"
            property="og:title"
            content="ABC Malt Powder & Healthy Foods | All Fresh Naturals"
          />

          <meta
            id="ogType"
            property="og:type"
            content="website"
          />

          <meta
            id="ogDescription"
            property="og:description"
            content="Discover wholesome abc malt powder from All Fresh Naturals, crafted with quality ingredients for everyday nourishment, natural goodness, and healthy lifestyle choices."
          />

          <meta
            id="ogUrl"
            property="og:url"
            content="https://allfreshnaturals.com/products/abc-malt"
          />

          <meta
            id="ogSiteName"
            property="og:site_name"
            content="All Fresh Naturals"
          />

          <meta
            id="ogImage"
            property="og:image"
            content="https://allfreshnaturals.com/assets/abc_malt_dual_mockup.jpg"
          />

          <meta
            id="twitterSite"
            name="twitter:site"
            content="https://twitter.com/"
          />

          <meta
            id="twitterTitle"
            name="twitter:title"
            content="ABC Malt Powder & Natural Foods | All Fresh Naturals"
          />

          <meta
            id="twitterDescription"
            name="twitter:description"
            content="Discover quality abc malt powder and natural food products made with carefully selected ingredients. Choose All Fresh Naturals for wholesome everyday nutrition and goodness."
          />

          <meta
            id="author"
            name="author"
            content="Akshay"
          />

          <link
            id="canonical"
            rel="canonical"
            href="https://allfreshnaturals.com/products/abc-malt"
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
      ) : product.id === 'ragi-malt' || product.id === 'ragi_malt' ? (
        <Helmet>
          <title id="metaTitle">Buy Ragi Malt Powder Online | 100% Natural &amp; Healthy Drink</title>

          <meta
            name="description"
            id="metaDescription"
            content="Explore nutritious ragi malt powder from All Fresh Naturals, made with quality ingredients for wholesome daily nutrition. Shop natural food products online now."
          />

          <meta
            name="keywords"
            id="metaKeywords"
            content="ragi malt powder, ragi malt, ragi malt mix, ragi malt drink, ragi health drink, ragi drink, ragi malt benefits, ragi malt recipe"
          />

          <meta
            id="ogTitle"
            property="og:title"
            content="Ragi Malt Powder &amp; Healthy Foods | All Fresh Naturals"
          />

          <meta
            id="ogType"
            property="og:type"
            content="website"
          />

          <meta
            id="ogDescription"
            property="og:description"
            content="Discover wholesome ragi malt powder from All Fresh Naturals, crafted with quality ingredients for everyday nourishment, natural goodness, and healthy lifestyle choices."
          />

          <meta
            id="ogUrl"
            property="og:url"
            content="https://allfreshnaturals.com/products/ragi-malt"
          />

          <meta
            id="ogSiteName"
            property="og:site_name"
            content="All Fresh Naturals"
          />

          <meta
            id="ogImage"
            property="og:image"
            content="https://allfreshnaturals.com/assets/ragi_malt_dual_mockup.jpg"
          />

          <meta
            id="twitterSite"
            name="twitter:site"
            content="https://twitter.com/"
          />

          <meta
            id="twitterTitle"
            name="twitter:title"
            content="Ragi Malt Powder &amp; Natural Foods | All Fresh Naturals"
          />

          <meta
            id="twitterDescription"
            name="twitter:description"
            content="Discover quality ragi malt powder and natural food products made with carefully selected ingredients. Choose All Fresh Naturals for wholesome everyday nutrition and goodness."
          />

          <meta
            id="author"
            name="author"
            content="Akshay"
          />

          <link
            id="canonical"
            rel="canonical"
            href="https://allfreshnaturals.com/products/ragi-malt"
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
      ) : (
        <Helmet>
          <title>{`${product.name} - 100% Natural Health Mix | All Fresh Naturals`}</title>
          <meta name="description" content={product.description || product.tagline} />
          <meta property="og:title" content={`${product.name} | All Fresh Naturals`} />
          <meta property="og:description" content={product.tagline} />
          <meta property="og:image" content={product.image} />
          <meta property="og:type" content="product" />
          <link rel="canonical" href={`https://allfreshnaturals.com/products/${product.id}`} />
        </Helmet>
      )}

      {/* Main Container */}
      <div className="pdp-page-container">
        <div className="container" style={{ maxWidth: '1180px' }}>
          {/* Breadcrumb Navigation */}
          <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="pdp-bc-link">Home</Link>
            <span className="pdp-bc-sep">/</span>
            <Link to="/products" className="pdp-bc-link">Our Products</Link>
            <span className="pdp-bc-sep">/</span>
            <span className="pdp-bc-current">{product.name}</span>
          </nav>

          <div style={{ marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="pdp-back-btn"
            >
              <ArrowLeft size={16} /> Back to Store
            </button>
          </div>

          {/* Product Detail Layout Grid */}
          <div className="pdp-grid">
            {/* ════════════════════════════════════════════════
                LEFT COLUMN: DUAL PACKAGING IMAGE GALLERY
            ════════════════════════════════════════════════ */}
            <div className="pdp-gallery-col">
              {/* Packaging View Selector Tabs */}
              {product.altImage && (
                <div className="pvm-view-switcher" role="tablist" aria-label="Packaging View Selection">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'front'}
                    className={`pvm-switch-tab ${activeView === 'front' ? 'pvm-switch-tab--active' : ''}`}
                    onClick={() => setActiveView('front')}
                  >
                    <span className="pvm-switch-icon">🖼️</span>
                    <span className="pvm-switch-text">Front Packaging</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeView === 'back'}
                    className={`pvm-switch-tab ${activeView === 'back' ? 'pvm-switch-tab--active' : ''}`}
                    onClick={() => setActiveView('back')}
                  >
                    <span className="pvm-switch-icon">📋</span>
                    <span className="pvm-switch-text">Back Packaging & Info</span>
                  </button>
                </div>
              )}

              {/* Main Stage Image */}
              <div className="pdp-main-img-stage">
                <div className="pvm-view-pill">
                  <span className="pvm-pill-dot" />
                  <span>{activeView === 'front' ? 'Front Packaging View' : 'Back Nutrition & Details'}</span>
                </div>

                <img
                  key={activeView}
                  src={currentImage}
                  alt={`${product.name} - ${activeView === 'front' ? 'Front packaging view' : 'Back packaging nutrition and ingredients'}`}
                  className="pdp-stage-img"
                  loading="eager"
                  decoding="sync"
                  onError={(e) => {
                    const target = e.currentTarget;
                    const isAbc = product.id.toLowerCase().includes('abc') || product.name.toLowerCase().includes('abc');
                    const fallback = activeView === 'back'
                      ? (isAbc ? '/assets/abc_malt_back_info.jpg' : '/assets/ragi_malt_back_info.jpg')
                      : (isAbc ? '/assets/abc_malt_dual_mockup.jpg' : '/assets/ragi_malt_dual_mockup.jpg');
                    if (target.src !== fallback && !target.src.endsWith(fallback)) {
                      target.src = fallback;
                    }
                  }}
                />
              </div>

              {/* Thumbnail Cards Row */}
              <div className="pvm-thumbs-row">
                <button
                  type="button"
                  className={`pvm-thumb-btn ${activeView === 'front' ? 'pvm-thumb-btn--active' : ''}`}
                  onClick={() => setActiveView('front')}
                >
                  <img
                    src={product.image}
                    alt="Front Packaging"
                    className="pvm-thumb-img"
                    onError={(e) => {
                      const isAbc = product.id.toLowerCase().includes('abc') || product.name.toLowerCase().includes('abc');
                      e.currentTarget.src = isAbc ? '/assets/abc_malt_dual_mockup.jpg' : '/assets/ragi_malt_dual_mockup.jpg';
                    }}
                  />
                  <div className="pvm-thumb-meta">
                    <span className="pvm-thumb-label">Front Packaging</span>
                    <span className="pvm-thumb-sub">Main Pouch</span>
                  </div>
                  {activeView === 'front' && <span className="pvm-thumb-check">✓ Active</span>}
                </button>

                {product.altImage && (
                  <button
                    type="button"
                    className={`pvm-thumb-btn ${activeView === 'back' ? 'pvm-thumb-btn--active' : ''}`}
                    onClick={() => setActiveView('back')}
                  >
                    <img
                      src={product.altImage}
                      alt="Back & Nutrition Info"
                      className="pvm-thumb-img"
                      onError={(e) => {
                        const isAbc = product.id.toLowerCase().includes('abc') || product.name.toLowerCase().includes('abc');
                        e.currentTarget.src = isAbc ? '/assets/abc_malt_back_info.jpg' : '/assets/ragi_malt_back_info.jpg';
                      }}
                    />
                    <div className="pvm-thumb-meta">
                      <span className="pvm-thumb-label">Back Packaging</span>
                      <span className="pvm-thumb-sub">Nutrition & Info</span>
                    </div>
                    {activeView === 'back' && <span className="pvm-thumb-check">✓ Active</span>}
                  </button>
                )}
              </div>

              {/* Trust Badges under image */}
              <div className="pdp-gallery-trust">
                <div className="pvm-g-trust-item">
                  <Leaf size={16} color="#1d7a42" /> <span>100% Natural</span>
                </div>
                <div className="pvm-g-trust-item">
                  <ShieldCheck size={16} color="#0f3923" /> <span>FSSAI Certified</span>
                </div>
                <div className="pvm-g-trust-item">
                  <Award size={16} color="#d97706" /> <span>Zero Preservatives</span>
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════
                RIGHT COLUMN: FULL PRODUCT SPECS & ACTIONS
            ════════════════════════════════════════════════ */}
            <div className="pdp-info-col">
              <div className="pdp-info-card">
                {/* Header / Badges */}
                <div className="pvm-header">
                  <div className="pvm-badge-row">
                    {product.badge && (
                      <span className="pvm-badge">{product.badge}</span>
                    )}
                    <span className="pvm-fresh-badge">Fresh Small Batch</span>
                    <span className="pdp-in-stock-badge">● In Stock</span>
                  </div>

                  <h1 className="pdp-title">{product.name}</h1>
                  <p className="pdp-tagline">{product.tagline}</p>

                  {/* Rating & Pricing Row */}
                  <div className="pdp-meta-row">
                    <div className="pvm-rating">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={15} fill="#f59e0b" color="#f59e0b" />
                      ))}
                      <span className="pvm-rating-val">4.9</span>
                      <span className="pvm-rating-count">(120+ verified customer reviews)</span>
                    </div>

                    <div className="pdp-price-box" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                      <span className="pdp-price-val">₹{product.price}</span>
                      {product.originalPrice && (
                        <span style={{ fontSize: '1.15rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>
                          MRP ₹{product.originalPrice}
                        </span>
                      )}
                      <span className="pdp-price-unit">/ {product.size}</span>
                      {product.originalPrice && (
                        <span style={{ fontSize: '0.78rem', color: '#15803d', fontWeight: 800, backgroundColor: '#edf7f0', padding: '3px 9px', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                          Save ₹{product.originalPrice - product.price} ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                        </span>
                      )}
                      <span className="pdp-tax-note" style={{ width: '100%', marginTop: '2px' }}>Inclusive of all taxes</span>
                    </div>
                  </div>
                </div>

                {/* About Description */}
                <div className="pvm-section">
                  <h3 className="pvm-sec-title">🌿 About This Product</h3>
                  <p className="pvm-desc-text" style={{ fontSize: '0.94rem' }}>{product.description}</p>
                </div>

                {/* Key Benefits */}
                <div className="pvm-section">
                  <h3 className="pvm-sec-title">🌿 Key Health Benefits</h3>
                  <div className="pvm-benefits-grid">
                    {product.benefits.map((benefit, i) => (
                      <div key={i} className="pvm-benefit-card">
                        <CheckCircle size={16} className="pvm-check-icon" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real Ingredients */}
                <div className="pvm-section">
                  <h3 className="pvm-sec-title">🥗 100% Real Ingredients Included</h3>
                  <div className="pvm-ing-tags">
                    {product.ingredients.map((ing, i) => (
                      <span key={i} className="pvm-ing-tag" style={{ fontSize: '0.84rem', padding: '6px 12px' }}>
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>

                {/* How to Prepare / Use */}
                <div className="pvm-section pvm-prep-box" style={{ background: '#fdfbf7', border: '1.5px solid #f0e9dc' }}>
                  <h3 className="pvm-sec-title">
                    <Flame size={18} color="#d97706" /> How to Prepare &amp; Enjoy
                  </h3>
                  <p className="pvm-prep-text" style={{ fontSize: '0.92rem' }}>{product.usage}</p>
                </div>

                {/* Purchase & Quantity Actions */}
                <div className="pdp-action-box">
                  <div className="pvm-qty-row">
                    <span className="pvm-qty-label" style={{ fontWeight: 700 }}>Select Quantity:</span>
                    <div className="pvm-qty-stepper">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="pvm-qty-val">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        disabled={quantity >= 10}
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="pvm-total-calc">
                      Total: <strong>₹{product.price * quantity}</strong>
                    </div>
                  </div>

                  <div className="pdp-btn-row">
                    <button
                      type="button"
                      className={`pdp-add-cart-btn${added ? ' pdp-add-cart-btn--added' : ''}`}
                      onClick={handleAddToCart}
                    >
                      {added ? (
                        <><Check size={20} /> Added to Cart!</>
                      ) : (
                        <><ShoppingCart size={20} /> Add to Cart</>
                      )}
                    </button>

                    <button
                      type="button"
                      className="pdp-buy-now-btn"
                      onClick={() => setInstantOrderProd(product)}
                      title="Instant Checkout via WhatsApp"
                    >
                      <Zap size={18} fill="currentColor" /> Instant Buy Now
                    </button>
                  </div>
                </div>

                {/* Assurances Bar */}
                <div className="pdp-assurances-row">
                  <div className="pdp-assurance-item">
                    <Truck size={18} color="#1d7a42" />
                    <div>
                      <strong>Fast Bengaluru Delivery</strong>
                      <span>Dispatched fresh within 24-48h</span>
                    </div>
                  </div>
                  <div className="pdp-assurance-item">
                    <Heart size={18} color="#dc2626" />
                    <div>
                      <strong>Homemade Care</strong>
                      <span>Zero chemicals or artificial fillers</span>
                    </div>
                  </div>
                  <div className="pdp-assurance-item">
                    <Clock size={18} color="#d97706" />
                    <div>
                      <strong>Fresh Batches</strong>
                      <span>Prepared in small handcrafted lots</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other Products Section at Downside */}
          {otherProducts.length > 0 && (
            <section className="pdp-other-section">
              <div className="pdp-other-header">
                <div>
                  <span className="section-tag">
                    Complete Your Nutrition
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: 'var(--primary-color)', margin: '4px 0 0' }}>
                    Other Natural Malts &amp; Products
                  </h2>
                </div>
                <Link to="/products" className="pdp-view-all-link">
                  View All Products &rarr;
                </Link>
              </div>

              <div className="store-products-grid" style={{ marginTop: '24px' }}>
                {otherProducts.map((p) => (
                  <article key={p.id} className="store-card">
                    <div
                      className="store-card-visual"
                      onClick={() => navigate(`/products/${p.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/products/${p.id}`);
                        }
                      }}
                      aria-label={`View details for ${p.name}`}
                    >
                      {p.badge && <span className="store-card-badge">{p.badge}</span>}
                      <div className="store-card-img-wrap">
                        <img src={p.image} alt={p.name} className="store-card-img" loading="lazy" />
                      </div>
                      <span className="store-card-quickview">
                        <Zap size={14} fill="currentColor" /> View Product Details
                      </span>
                    </div>

                    <div className="store-card-body">
                      <div className="store-card-rating">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={13} fill="#f59e0b" color="#f59e0b" />
                        ))}
                        <strong className="store-rating-num">4.9</strong>
                        <span className="store-rating-count">(120+ reviews)</span>
                      </div>
                      <h3 className="store-card-name">
                        <Link to={`/products/${p.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {p.name}
                        </Link>
                      </h3>
                      <p className="store-card-tagline">{p.tagline}</p>

                      <div className="store-card-ingredients">
                        {p.ingredients.slice(0, 4).map((ing, idx) => (
                          <span key={idx} className="store-ing-chip">
                            {ing}
                          </span>
                        ))}
                        {p.ingredients.length > 4 && (
                          <span className="store-ing-more">+{p.ingredients.length - 4} more</span>
                        )}
                      </div>

                      <div className="store-card-footer">
                        <div className="store-card-pricing">
                          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                            <div className="store-price-val">₹{p.price}</div>
                            {p.originalPrice && (
                              <span style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </div>
                          <div className="store-price-unit">{p.size}</div>
                        </div>

                        <div className="store-card-btns">
                          <button
                            type="button"
                            className="store-buy-now-btn"
                            onClick={() => navigate(`/products/${p.id}`)}
                            aria-label={`Buy ${p.name}`}
                          >
                            <Zap size={15} fill="currentColor" /> Buy Product
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="pdp-mobile-sticky-bar">
        <div className="pdp-msb-price-col">
          <span className="pdp-msb-label">Total Price ({quantity}x)</span>
          <span className="pdp-msb-price">₹{product.price * quantity}</span>
        </div>
        <div className="pdp-msb-btn-col">
          <button
            type="button"
            className={`pdp-msb-cart-btn${added ? ' pdp-msb-cart-btn--added' : ''}`}
            onClick={handleAddToCart}
            aria-label="Add to cart"
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            <span>{added ? 'Added' : 'Add to Cart'}</span>
          </button>
          <button
            type="button"
            className="pdp-msb-buy-btn"
            onClick={() => setInstantOrderProd(product)}
            aria-label="Instant checkout via WhatsApp"
          >
            <Zap size={16} fill="currentColor" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Instant Order Modal */}
      {instantOrderProd && (
        <InstantOrderModal
          product={instantOrderProd}
          isOpen={true}
          onClose={() => setInstantOrderProd(null)}
        />
      )}
    </>
  );
}
