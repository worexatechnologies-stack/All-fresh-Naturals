import { createPortal } from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart
  } = useCart();
  const { isAuthenticated, openAuthModal } = useAuth();

  const open = isOpen !== undefined ? isOpen : isCartOpen;
  const handleClose = onClose || closeCart;

  const deliveryFee = cartSubtotal >= 999 ? 0 : cartSubtotal > 0 ? 50 : 0;
  const freeDeliveryRemaining = Math.max(0, 999 - cartSubtotal);

  const handleProceedToCheckout = () => {
    handleClose();
    if (!isAuthenticated) {
      openAuthModal();
    } else {
      navigate('/checkout');
    }
  };

  if (!open) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div className="cart-drawer-overlay open" onClick={handleClose} />

      {/* Drawer */}
      <div className="cart-drawer open">
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title">
            <ShoppingCart size={20} />
            <h3>Shopping Cart</h3>
            {cartCount > 0 && <span className="cart-drawer-count">{cartCount}</span>}
          </div>
          <button className="cart-drawer-close" onClick={handleClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Free delivery progress */}
        {cartSubtotal > 0 && cartSubtotal < 999 && (
          <div className="cart-free-delivery-bar">
            <Truck size={15} />
            <span>Add <strong>₹{freeDeliveryRemaining}</strong> more for <strong>FREE delivery</strong></span>
            <div className="delivery-progress-track">
              <div
                className="delivery-progress-fill"
                style={{ width: `${Math.min(100, (cartSubtotal / 999) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {cartSubtotal >= 999 && (
          <div className="cart-free-delivery-bar unlocked">
            <Truck size={15} />
            <span>🎉 You've unlocked <strong>FREE delivery!</strong></span>
          </div>
        )}

        {/* Cart Items */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <ShoppingCart size={56} className="cart-empty-icon" />
              <h4>Your cart is empty</h4>
              <p>Explore our fresh, homemade products and add your favorites!</p>
              <Link to="/products" className="btn btn-primary cart-empty-btn" onClick={handleClose}>
                Browse Products <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item) => (
                <li key={item.product.id} className="cart-item">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="cart-item-img"
                  />
                  <div className="cart-item-info">
                    <h4 className="cart-item-name">{item.product.name}</h4>
                    <span className="cart-item-size">{item.product.size}</span>
                    <span className="cart-item-unit-price">₹{item.product.price} each</span>
                  </div>
                  <div className="cart-item-controls">
                    <div className="cart-qty-stepper">
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= 20}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                    <span className="cart-item-total">₹{item.product.price * item.quantity}</span>
                    <button
                      className="cart-item-remove"
                      onClick={() => removeFromCart(item.product.id)}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with totals */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-footer-row">
              <span>Subtotal ({cartCount} items)</span>
              <span className="cart-footer-value">₹{cartSubtotal}</span>
            </div>
            <div className="cart-footer-row">
              <span>Delivery</span>
              <span className={`cart-footer-value ${deliveryFee === 0 ? 'text-free' : ''}`}>
                {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            <div className="cart-footer-row cart-footer-total">
              <span>Estimated Total</span>
              <span>₹{cartSubtotal + deliveryFee}</span>
            </div>

            <button
              type="button"
              className="btn-checkout-proceed"
              onClick={handleProceedToCheckout}
              style={{ width: '100%', cursor: 'pointer', border: 'none' }}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <button className="cart-continue-shopping" onClick={handleClose}>
              ← Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
