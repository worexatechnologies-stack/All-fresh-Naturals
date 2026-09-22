import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Package, Truck, CheckCircle2, Clock, RefreshCw, MessageSquare,
  ShoppingBag, Calendar, MapPin, ChevronRight, Search,
  ArrowLeft, User, ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrder, type AdminOrder } from '../context/OrderContext';
import { openWhatsAppMessage } from '../config/whatsapp';
import { apiFetch } from '../config/api';

type FilterTab = 'all' | 'active' | 'delivered';

export default function MyOrdersPage() {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { orders: contextOrders } = useOrder();

  const [dbOrders, setDbOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Fetch live user orders directly from MongoDB database
  const fetchUserOrders = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const email = user.email || '';
      const phone = user.phone || '';
      const userId = user.id || '';
      const endpoint = `/orders/user?userId=${encodeURIComponent(userId)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
      const res = await apiFetch(endpoint);

      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          setDbOrders(data.orders);
        }
      }
    } catch {
      // Fallback to locally context-stored orders matching user email or phone
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, fetchUserOrders]);

  // Combine DB orders with fallback context orders if DB query is empty/offline
  const combinedOrders = dbOrders.length > 0 ? dbOrders : contextOrders.filter(
    (o) =>
      (user?.id && o.userId === user.id) ||
      (user?.email && o.email?.toLowerCase() === user.email.toLowerCase()) ||
      (user?.phone && o.phone === user.phone) ||
      (user?.name && o.customerName?.toLowerCase().includes(user.name.toLowerCase()))
  );

  // Helper status color configuration
  const getStatusBadgeStyle = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) {
      return { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0', label: 'Delivered', icon: <CheckCircle2 size={14} /> };
    }
    if (s.includes('dispatched')) {
      return { bg: '#e0f2fe', color: '#0284c7', border: '#bae6fd', label: 'Dispatched', icon: <Truck size={14} /> };
    }
    if (s.includes('batch') || s.includes('preparing')) {
      return { bg: '#f3e8ff', color: '#7e22ce', border: '#e9d5ff', label: 'Batch Preparing', icon: <Package size={14} /> };
    }
    if (s.includes('processing')) {
      return { bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe', label: 'Processing', icon: <Clock size={14} /> };
    }
    return { bg: '#fef3c7', color: '#b45309', border: '#fde68a', label: status || 'Pending WhatsApp', icon: <Clock size={14} /> };
  };

  // Helper steps status index calculation (0-3)
  const getStatusStepIndex = (status: string): number => {
    const s = (status || '').toLowerCase();
    if (s.includes('delivered')) return 3;
    if (s.includes('dispatched')) return 2;
    if (s.includes('batch') || s.includes('preparing')) return 1;
    if (s.includes('processing')) return 1;
    return 0; // Order Placed / Pending
  };

  // Filter orders based on active tab & search query
  const filteredOrders = combinedOrders.filter((o) => {
    const matchesTab =
      activeTab === 'all'
        ? true
        : activeTab === 'delivered'
          ? o.status?.toLowerCase().includes('delivered')
          : !o.status?.toLowerCase().includes('delivered');

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      o.id.toLowerCase().includes(q) ||
      o.items?.toLowerCase().includes(q) ||
      o.status?.toLowerCase().includes(q);

    return matchesTab && matchesSearch;
  });

  const handleWhatsAppStatusInquiry = (order: AdminOrder) => {
    const msg = `Hello All Fresh Naturals 👋\nI would like to inquire about my Order status:\n\n📌 *Order ID:* #${order.id}\n📅 *Date:* ${order.date}\n📦 *Items:* ${order.items}\n💳 *Total:* ₹${order.total}\n📊 *Current Status:* ${order.status}\n\nPlease share an update on the delivery schedule. Thank you!`;
    openWhatsAppMessage(msg);
  };

  // If user is not logged in, prompt to log in
  if (!isAuthenticated) {
    return (
      <div style={{ background: '#f8fafc', minHeight: '80vh', padding: '60px 16px' }}>
        <Helmet>
          <title id="metaTitle">My Orders | All Fresh Naturals</title>

          <meta
            name="description"
            id="metaDescription"
            content="View and track your All Fresh Naturals orders, order status, purchase history, and delivery details."
          />

          <meta
            name="keywords"
            id="metaKeywords"
            content="all fresh naturals my orders, order tracking, order history, track ragi malt order"
          />

          <meta
            id="ogTitle"
            property="og:title"
            content="My Orders | All Fresh Naturals"
          />

          <meta
            id="ogType"
            property="og:type"
            content="website"
          />

          <meta
            id="ogDescription"
            property="og:description"
            content="View and track your All Fresh Naturals orders, order status, purchase history, and delivery details."
          />

          <meta
            id="ogUrl"
            property="og:url"
            content="https://allfreshnaturals.com/my-orders"
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
            content="My Orders | All Fresh Naturals"
          />

          <meta
            id="twitterDescription"
            name="twitter:description"
            content="View and track your All Fresh Naturals orders, order status, purchase history, and delivery details."
          />

          <meta
            id="author"
            name="author"
            content="Akshay"
          />

          <link
            id="canonical"
            rel="canonical"
            href="https://allfreshnaturals.com/my-orders"
          />

          <meta
            id="indexingStatus"
            name="robots"
            content="noindex, nofollow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
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
        <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '48px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(27, 67, 50, 0.08)',
              border: '1px solid rgba(27, 67, 50, 0.1)'
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 8px 20px rgba(27, 67, 50, 0.25)'
              }}
            >
              <User size={34} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-serif)', color: '#1b4332', fontSize: '1.8rem', marginBottom: '12px' }}>
              Sign In to View Your Orders
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.96rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Access your order history, track real time dispatch and delivery status, and re order your favorite fresh natural products.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                onClick={openAuthModal}
                style={{
                  width: '100%',
                  padding: '14px 24px',
                  borderRadius: '30px',
                  background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(27, 67, 50, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <User size={18} /> Sign In / Register Account
              </button>
              <Link
                to="/products"
                style={{
                  display: 'inline-block',
                  color: '#1b4332',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  padding: '10px'
                }}
              >
                ← Continue Browsing Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f8fafc', minHeight: '90vh', padding: '40px 16px 80px' }}>
      <Helmet>
        <title id="metaTitle">My Orders | All Fresh Naturals</title>

        <meta
          name="description"
          id="metaDescription"
          content="View your purchase history and order status at All Fresh Naturals."
        />

        <meta
          id="ogTitle"
          property="og:title"
          content="My Orders | All Fresh Naturals"
        />

        <meta
          id="ogType"
          property="og:type"
          content="website"
        />

        <meta
          id="ogDescription"
          property="og:description"
          content="Track your natural health malt orders."
        />

        <meta
          id="ogUrl"
          property="og:url"
          content="https://allfreshnaturals.com/my-orders"
        />

        <meta
          id="ogSiteName"
          property="og:site_name"
          content="All Fresh Naturals"
        />

        <meta
          id="author"
          name="author"
          content="All Fresh Naturals"
        />

        <link
          id="canonical"
          rel="canonical"
          href="https://allfreshnaturals.com/my-orders"
        />

        <meta
          id="indexingStatus"
          name="robots"
          content="noindex, nofollow"
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
      <div className="container" style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Top Header Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none', marginBottom: '8px' }}>
              <ArrowLeft size={16} /> Back to Products
            </Link>
            <h1 style={{ fontFamily: 'var(--font-serif)', color: '#1b4332', fontSize: '2.1rem', fontWeight: 700, margin: 0 }}>
              My Orders & Status
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0' }}>
              Logged in as <strong>{user?.name}</strong> ({user?.email || user?.phone})
            </p>
          </div>

          <button
            type="button"
            onClick={fetchUserOrders}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 18px',
              borderRadius: '24px',
              background: '#ffffff',
              border: '1.5px solid #1b4332',
              color: '#1b4332',
              fontWeight: 700,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(27, 67, 50, 0.08)'
            }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh Status'}
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '14px 18px',
            marginBottom: '28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}
        >
          {/* Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.84rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'all' ? '#1b4332' : '#f1f5f9',
                color: activeTab === 'all' ? '#ffffff' : '#475569'
              }}
            >
              All Orders ({combinedOrders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('active')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.84rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'active' ? '#1b4332' : '#f1f5f9',
                color: activeTab === 'active' ? '#ffffff' : '#475569'
              }}
            >
              Active Orders ({combinedOrders.filter(o => !o.status?.toLowerCase().includes('delivered')).length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('delivered')}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '0.84rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                background: activeTab === 'delivered' ? '#1b4332' : '#f1f5f9',
                color: activeTab === 'delivered' ? '#ffffff' : '#475569'
              }}
            >
              Delivered ({combinedOrders.filter(o => o.status?.toLowerCase().includes('delivered')).length})
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flexGrow: 1, maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Order ID or Product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '20px',
                border: '1px solid #cbd5e1',
                fontSize: '0.84rem',
                outline: 'none',
                background: '#f8fafc'
              }}
            />
          </div>
        </div>

        {/* Loading Spinner State */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                border: '4px solid #e2e8f0',
                borderTopColor: '#1b4332',
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 1s linear infinite'
              }}
            />
            <p style={{ color: '#64748b', fontWeight: 600 }}>Fetching live orders from database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Empty Orders State */
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '60px 24px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
              border: '1px solid #e2e8f0'
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: '#f0fdf4',
                color: '#16a34a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }}
            >
              <ShoppingBag size={40} />
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', color: '#1b4332', fontSize: '1.5rem', marginBottom: '8px' }}>
              No Orders Found
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 24px' }}>
              {searchQuery
                ? 'No orders matched your search criteria. Try a different search term.'
                : 'You have not placed any orders yet. Explore our fresh natural health malts and start your healthy journey today!'}
            </p>
            <Link
              to="/products"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '30px',
                background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 100%)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 6px 18px rgba(27, 67, 50, 0.25)'
              }}
            >
              <Package size={18} /> Explore Products Now
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {filteredOrders.map((order) => {
              const badge = getStatusBadgeStyle(order.status);
              const currentStep = getStatusStepIndex(order.status);
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '20px',
                    boxShadow: '0 8px 24px rgba(27, 67, 50, 0.06)',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {/* Order Top Bar */}
                  <div
                    style={{
                      background: '#f8fafc',
                      padding: '18px 24px',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          background: '#1b4332',
                          color: '#ffffff',
                          borderRadius: '12px',
                          padding: '8px 14px',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          fontFamily: 'monospace',
                          letterSpacing: '0.5px'
                        }}
                      >
                        #{order.id}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={13} /> Placed on {order.date}
                        </div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                          Customer: {order.customerName}
                        </div>
                      </div>
                    </div>

                    {/* Order Status Badge */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                          fontSize: '0.84rem',
                          fontWeight: 700
                        }}
                      >
                        {badge.icon}
                        <span>{order.status || 'Processing'}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleWhatsAppStatusInquiry(order)}
                        title="Inquire status on WhatsApp"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 14px',
                          borderRadius: '20px',
                          background: '#25D366',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                        }}
                      >
                        <MessageSquare size={14} /> WhatsApp Support
                      </button>
                    </div>
                  </div>

                  {/* Order Progress Tracker Bar */}
                  <div style={{ padding: '20px 24px', background: '#fafaf9', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Order Status Journey (Live from Database)
                    </div>

                    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                      {/* Tracker Line */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '15px',
                          left: '12%',
                          right: '12%',
                          height: '3px',
                          background: '#e2e8f0',
                          zIndex: 1
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '15px',
                          left: '12%',
                          width: `${(currentStep / 3) * 76}%`,
                          height: '3px',
                          background: '#16a34a',
                          transition: 'width 0.5s ease',
                          zIndex: 2
                        }}
                      />

                      {[
                        { label: 'Order Placed', desc: 'Received' },
                        { label: 'Processing', desc: 'Verified' },
                        { label: 'Batch Preparing', desc: 'Fresh Handmade' },
                        { label: 'Dispatched / Delivered', desc: 'On The Way' }
                      ].map((step, idx) => {
                        const isDone = idx <= currentStep;
                        const isCurrent = idx === currentStep;

                        return (
                          <div key={step.label} style={{ textAlign: 'center', zIndex: 3, position: 'relative' }}>
                            <div
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: isDone ? '#16a34a' : '#ffffff',
                                color: isDone ? '#ffffff' : '#94a3b8',
                                border: isDone ? '2px solid #16a34a' : '2px solid #cbd5e1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 8px',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                boxShadow: isCurrent ? '0 0 0 4px rgba(22, 163, 74, 0.2)' : 'none',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              {isDone ? <CheckCircle2 size={16} /> : idx + 1}
                            </div>
                            <div style={{ fontSize: '0.78rem', fontWeight: isDone ? 700 : 500, color: isDone ? '#1b4332' : '#64748b' }}>
                              {step.label}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                              {step.desc}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Details Body */}
                  <div style={{ padding: '20px 24px' }}>
                    {/* Purchased Items */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                        Purchased Items:
                      </div>

                      {order.itemsDetail && order.itemsDetail.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {order.itemsDetail.map((item, i) => (
                            <div
                              key={i}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: '#f8fafc',
                                padding: '10px 14px',
                                borderRadius: '12px',
                                border: '1px solid #f1f5f9'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    style={{ width: '44px', height: '44px', borderRadius: '8px', objectFit: 'contain', background: '#ffffff', padding: '2px', border: '1px solid #e2e8f0' }}
                                  />
                                ) : (
                                  <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: '#1b4332', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Package size={20} />
                                  </div>
                                )}
                                <div>
                                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1b4332' }}>{item.name}</div>
                                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                                    Size: {item.size} • Qty: {item.quantity}
                                  </div>
                                </div>
                              </div>
                              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#1b4332' }}>
                                ₹{item.price * item.quantity}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '10px', fontSize: '0.88rem', color: '#334155', border: '1px solid #f1f5f9' }}>
                          📦 {order.items}
                        </div>
                      )}
                    </div>

                    {/* Expandable Order Details (Address, Payment, Summary) */}
                    {isExpanded && (
                      <div
                        style={{
                          marginTop: '16px',
                          paddingTop: '16px',
                          borderTop: '1px dashed #cbd5e1',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '16px',
                          animation: 'fadeIn 0.2s ease-in-out'
                        }}
                      >
                        {/* Shipping Address */}
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <MapPin size={13} /> Shipping Address
                          </div>
                          <div style={{ fontSize: '0.84rem', color: '#1e293b', lineHeight: 1.4 }}>
                            <strong>{order.customerName}</strong> ({order.phone})<br />
                            {order.address}<br />
                            {order.city}, {order.state || 'Karnataka'} - {order.pincode || ''}
                          </div>
                        </div>

                        {/* Payment & Bill Summary */}
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Payment & Pricing Details
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div>Payment Method: <strong>{order.paymentMethod || 'UPI'}</strong></div>
                            <div>Subtotal: ₹{order.subtotal || order.total}</div>
                            <div>Delivery Fee: {order.deliveryFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${order.deliveryFee}`}</div>
                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1b4332', marginTop: '4px' }}>
                              Total Paid: ₹{order.total}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Footer */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                      <button
                        type="button"
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#1b4332',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {isExpanded ? 'Hide Details' : 'View Full Details & Address'}
                        <ChevronRight size={14} style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Total:</span>
                        <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1b4332', fontFamily: 'var(--font-serif)' }}>
                          ₹{order.total}
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Customer Support Notice Footer Banner */}
        <div
          style={{
            marginTop: '40px',
            background: 'linear-gradient(135deg, #1b4332 0%, #0d2818 100%)',
            borderRadius: '20px',
            padding: '24px 28px',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            boxShadow: '0 12px 30px rgba(27, 67, 50, 0.25)'
          }}
        >
          <div style={{ maxWidth: '580px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#eac68f', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <ShieldCheck size={16} /> All Fresh Naturals Guarantee
            </div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', margin: '0 0 6px' }}>
              Questions about your order status or delivery date?
            </h4>
            <p style={{ color: '#d1d5db', fontSize: '0.86rem', margin: 0, lineHeight: 1.5 }}>
              Our customer care team prepares every malt batch fresh to order. Connect with us directly on WhatsApp for instant assistance.
            </p>
          </div>

          <a
            href="https://wa.me/918553428079?text=Hello%20All%20Fresh%20Naturals,%20I%20have%20a%20question%20regarding%20my%20orders."
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 22px',
              borderRadius: '30px',
              background: '#25D366',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
              whiteSpace: 'nowrap'
            }}
          >
            <MessageSquare size={16} /> Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}
