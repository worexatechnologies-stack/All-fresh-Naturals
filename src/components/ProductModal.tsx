import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, CheckCircle, Plus, Minus, Check, Star, ShieldCheck, Leaf, Award, Zap, Flame } from 'lucide-react';
import type { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onBuyNow?: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onBuyNow }: ProductModalProps) {
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  // Lock body scroll while modal is open & add ESC listener
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleAdd = () => {
    if (!isAuthenticated) {
      onClose(); // Close product modal first
      openAuthModal();
      return;
    }
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const currentImage = activeView === 'back' && product.altImage ? product.altImage : product.image;

  return createPortal(
    <div className="pvm-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="pvm-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="pvm-close-btn" onClick={onClose} aria-label="Close product details">
          <X size={20} />
        </button>

        <div className="pvm-grid">
          {/* ════════════════════════════════════════════════
              LEFT COLUMN: DUAL PACKAGING IMAGE GALLERY
          ════════════════════════════════════════════════ */}
          <div className="pvm-gallery-col">
            {/* Prominent Packaging View Switcher Tabs */}
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
            <div className="pvm-main-img-wrap">
              <div className="pvm-view-pill">
                <span className="pvm-pill-dot" />
                <span>{activeView === 'front' ? 'Front Packaging View' : 'Back Nutrition & Details'}</span>
              </div>

              <img
                key={activeView}
                src={currentImage}
                alt={`${product.name} - ${activeView === 'front' ? 'Front packaging view' : 'Back packaging nutrition and ingredients'}`}
                className="pvm-main-img"
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
            <div className="pvm-gallery-trust">
              <div className="pvm-g-trust-item">
                <Leaf size={14} color="#1d7a42" /> <span>100% Natural</span>
              </div>
              <div className="pvm-g-trust-item">
                <ShieldCheck size={14} color="#0f3923" /> <span>FSSAI Certified</span>
              </div>
              <div className="pvm-g-trust-item">
                <Award size={14} color="#d97706" /> <span>Zero Preservatives</span>
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════════════
              RIGHT COLUMN: FULL PRODUCT EXPLANATION
          ════════════════════════════════════════════════ */}
          <div className="pvm-info-col">
            {/* Header / Badges */}
            <div className="pvm-header">
              <div className="pvm-badge-row">
                {product.badge && (
                  <span className="pvm-badge">{product.badge}</span>
                )}
                <span className="pvm-fresh-badge">Fresh Small Batch</span>
              </div>

              <h2 className="pvm-title">{product.name}</h2>
              <p className="pvm-tagline">{product.tagline}</p>

              {/* Reviews & Pricing Row */}
              <div className="pvm-meta-row">
                <div className="pvm-rating">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={14} fill="#f59e0b" color="#f59e0b" />
                  ))}
                  <span className="pvm-rating-val">4.9</span>
                  <span className="pvm-rating-count">(120+ verified reviews)</span>
                </div>

                <div className="pvm-price-wrap" style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="pvm-price-val">₹{product.price}</span>
                  {product.originalPrice && (
                    <span style={{ fontSize: '1rem', color: '#94a3b8', textDecoration: 'line-through', fontWeight: 600 }}>
                      MRP ₹{product.originalPrice}
                    </span>
                  )}
                  <span className="pvm-price-unit">/ {product.size}</span>
                  {product.originalPrice && (
                    <span style={{ fontSize: '0.74rem', color: '#15803d', fontWeight: 800, backgroundColor: '#edf7f0', padding: '2px 7px', borderRadius: '5px' }}>
                      Save ₹{product.originalPrice - product.price}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="pvm-section">
              <h4 className="pvm-sec-title">🌿 About This Product</h4>
              <p className="pvm-desc-text">{product.description}</p>
            </div>

            {/* Key Benefits */}
            <div className="pvm-section">
              <h4 className="pvm-sec-title">🌿 Key Health Benefits</h4>
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
              <h4 className="pvm-sec-title">🥗 100% Real Ingredients Included</h4>
              <div className="pvm-ing-tags">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="pvm-ing-tag">
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* How to Prepare / Use */}
            <div className="pvm-section pvm-prep-box">
              <h4 className="pvm-sec-title">
                <Flame size={16} color="#d97706" /> How to Prepare & Enjoy
              </h4>
              <p className="pvm-prep-text">{product.usage}</p>
            </div>

            {/* Order Actions Footer */}
            <div className="pvm-footer-actions">
              <div className="pvm-qty-row">
                <span className="pvm-qty-label">Quantity:</span>
                <div className="pvm-qty-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="pvm-qty-val">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    aria-label="Increase quantity"
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <div className="pvm-total-calc">
                  Total: <strong>₹{product.price * quantity}</strong>
                </div>
              </div>

              <div className="pvm-btn-grid">
                <button
                  type="button"
                  className={`pvm-add-cart-btn${added ? ' pvm-add-cart-btn--added' : ''}`}
                  onClick={handleAdd}
                >
                  {added ? (
                    <><Check size={18} /> Added to Cart!</>
                  ) : (
                    <><ShoppingCart size={18} /> Add to Cart</>
                  )}
                </button>

                {onBuyNow && (
                  <button
                    type="button"
                    className="pvm-buy-now-btn"
                    onClick={() => onBuyNow(product)}
                    title="Instant Checkout via WhatsApp"
                  >
                    <Zap size={16} fill="currentColor" /> Instant Buy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
