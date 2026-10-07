import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';

import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import AdminAuthModal from './components/AdminAuthModal';

import ProtectedRoute from './components/ProtectedRoute';
import SmoothScroll from './components/SmoothScroll';

// Eager load HomePage for immediate first paint
import HomePage from './pages/HomePage';

// Lazy load secondary routes for fast initial bundle size & smooth rendering
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmationPage = lazy(() => import('./pages/OrderConfirmationPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const ArticlesPage = lazy(() => import('./pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('./pages/ArticleDetailPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="afn-spinner" style={{ width: 36, height: 36, border: '3px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      <SmoothScroll />
      {!isAdminPage && <Header />}

      <main key={location.pathname} className={isAdminPage ? '' : 'page-transition'}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/ragi_malt" element={<Navigate to="/products/ragi-malt" replace />} />
            <Route path="/products/abc_malt" element={<Navigate to="/products/abc-malt" replace />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/benefits" element={<Navigate to="/#why-choose-us" replace />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticleDetailPage />} />
            <Route path="/article/:slug" element={<ArticleDetailPage />} />
            <Route path="/blog/:slug" element={<ArticleDetailPage />} />
            <Route path="/blogs/:slug" element={<ArticleDetailPage />} />
            <Route path="/blogs" element={<Navigate to="/articles" replace />} />
            <Route path="/blog" element={<Navigate to="/articles" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms-and-conditions" element={<TermsPage />} />
            <Route path="/terms" element={<Navigate to="/terms-and-conditions" replace />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/privacy-and-sourcing" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/sourcing" element={<Navigate to="/privacy-policy" replace />} />
            <Route path="/refund-policy" element={<Navigate to="/terms-and-conditions" replace />} />
            <Route path="/refunds" element={<Navigate to="/terms-and-conditions" replace />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute fallbackTitle="Checkout Requires User Login" fallbackMessage="Please sign in or create an account to proceed with your order purchase.">
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-confirmation"
              element={
                <ProtectedRoute fallbackTitle="Order Details Protected" fallbackMessage="Please sign in to view your order confirmation and details.">
                  <OrderConfirmationPage />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Routes>
        </Suspense>
      </main>

      {!isAdminPage && <Footer />}

      <CartDrawer />
      <AuthModal />
      <AdminAuthModal />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
