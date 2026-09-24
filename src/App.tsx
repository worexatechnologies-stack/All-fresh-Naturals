import { useEffect } from 'react';
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

import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import AboutPage from './pages/AboutPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MyOrdersPage from './pages/MyOrdersPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ProductDetailPage from './pages/ProductDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
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
