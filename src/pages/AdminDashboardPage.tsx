import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ShoppingBag,
  Users,
  Package,
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  DollarSign,
  CheckCircle,
  X,
  LogOut,
  AlertCircle,
  Upload,
  Leaf,
  Tag,
  FileText,
  Image as ImageIcon,
  Check,
  RotateCcw,
  ChevronRight,
  TrendingUp,
  Menu,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useOrder, type AdminOrder } from '../context/OrderContext';
import { abcMaltImg, type Product } from '../data/products';
import { apiFetch } from '../config/api';
import { Helmet } from 'react-helmet-async';
import logo from '../assets/logo.jpg';

import AdminLoginPage from './AdminLoginPage';

export default function AdminDashboardPage() {
  const { isAdminLoggedIn, logoutAdmin } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct, resetProductsToDefault } = useProducts();
  const { orders, updateOrderStatus, clearAllOrders } = useOrder();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'overview' | 'customers' | 'batches' | 'security'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const workspaceRef = useRef<HTMLElement | null>(null);

  const selectTab = (tab: 'products' | 'orders' | 'overview' | 'customers') => {
    setActiveTab(tab);
    setSidebarOpen(false);
    // Mobile uses a dedicated native scroll area, so reset that area rather
    // than handing the action to the site-wide smooth-scroll handler.
    requestAnimationFrame(() => workspaceRef.current?.scrollTo({ top: 0, behavior: 'auto' }));
  };

  // Dynamic real metrics from customer purchases
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.status === 'Processing' || o.status === 'Batch Preparing').length;

  // Dynamic patrons list from real orders
  const realCustomersMap = new Map<string, { id: string; name: string; email: string; phone: string; city: string; totalOrders: number; totalSpent: number }>();
  orders.forEach((o, idx) => {
    const key = o.phone || o.customerName;
    if (!realCustomersMap.has(key)) {
      realCustomersMap.set(key, {
        id: `CUST-${1000 + idx + 1}`,
        name: o.customerName,
        email: o.email || `${o.phone}@customer.afn`,
        phone: o.phone,
        city: o.city,
        totalOrders: 1,
        totalSpent: o.total || 0
      });
    } else {
      const existing = realCustomersMap.get(key)!;
      existing.totalOrders += 1;
      existing.totalSpent += (o.total || 0);
    }
  });
  const realCustomersList = Array.from(realCustomersMap.values());

  // Modals for Products
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Lock background body scroll whenever any modal is active
  useEffect(() => {
    const isAnyModalOpen = showAddModal || editingProduct !== null || deletingProduct !== null || selectedOrder !== null;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [showAddModal, editingProduct, deletingProduct, selectedOrder]);

  // Form State for Add / Edit Product
  const [prodName, setProdName] = useState('');
  const [prodBadge, setProdBadge] = useState('Best Seller');
  const [prodTagline, setProdTagline] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(349);
  const [prodSize, setProdSize] = useState('500g Pouch');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodIngredients, setProdIngredients] = useState('');
  const [prodBenefits, setProdBenefits] = useState('');
  const [prodUsage, setProdUsage] = useState('');

  // Toast Notice
  const [notice, setNotice] = useState('');

  const showToast = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  // Convert uploaded image file to compressed raw binary Blob / ArrayBuffer for BYTEA DB storage
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 600;
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const permanentDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setProdImage(permanentDataUrl);
            showToast('Compressed image saved permanently to database!');
          }
        };
        if (typeof event.target?.result === 'string') {
          img.src = event.target.result;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal for creating new product
  const handleOpenAddModal = () => {
    setProdName('');
    setProdBadge('Fresh Batch');
    setProdTagline('');
    setProdPrice(299);
    setProdSize('500g Pouch');
    setProdDesc('');
    setProdImage('');
    setProdIngredients('Ragi, Jaggery, Almonds, Elaichi');
    setProdBenefits('High Calcium, Natural Energy, 100% Homemade');
    setProdUsage('Add 2-3 spoonfuls to warm milk or water and enjoy!');
    setShowAddModal(true);
  };

  // Open modal for editing existing product
  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name || '');
    setProdBadge(p.badge || 'Fresh Batch');
    setProdTagline(p.tagline || '');
    setProdPrice(p.price || 0);
    setProdSize(p.size || '500g Pouch');
    setProdDesc(p.description || '');
    setProdImage(p.image || '');
    const rawIng = p.ingredients;
    const ingStr = Array.isArray(rawIng)
      ? rawIng.join(', ')
      : typeof rawIng === 'string'
      ? rawIng
      : '';
    setProdIngredients(ingStr);
    const rawBen = p.benefits;
    const benStr = Array.isArray(rawBen)
      ? rawBen.join(', ')
      : typeof rawBen === 'string'
      ? rawBen
      : '';
    setProdBenefits(benStr);
    setProdUsage(p.usage || '');
  };

  // Save new product
  const handleSaveAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    const newProd = await addProduct({
      name: prodName.trim(),
      badge: prodBadge.trim() || 'Fresh Batch',
      tagline: prodTagline.trim() || 'Goodness of Nature',
      description: prodDesc.trim() || 'Freshly handmade with zero artificial additives.',
      price: Number(prodPrice),
      size: prodSize.trim() || '500g Pouch',
      image: prodImage.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
      ingredients: prodIngredients ? prodIngredients.split(',').map((s) => s.trim()).filter(Boolean) : [],
      benefits: prodBenefits ? prodBenefits.split(',').map((s) => s.trim()).filter(Boolean) : [],
      usage: prodUsage.trim() || 'Enjoy fresh with warm milk or water.'
    });

    setShowAddModal(false);
    showToast(`Product "${newProd.name || prodName}" added to live store catalog!`);
  };

  // Save edited product
  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    await updateProduct(editingProduct.id, {
      name: prodName.trim(),
      badge: prodBadge.trim(),
      tagline: prodTagline.trim(),
      description: prodDesc.trim(),
      price: Number(prodPrice),
      size: prodSize.trim(),
      image: prodImage.trim() || editingProduct.image,
      ingredients: prodIngredients ? prodIngredients.split(',').map((s) => s.trim()).filter(Boolean) : [],
      benefits: prodBenefits ? prodBenefits.split(',').map((s) => s.trim()).filter(Boolean) : [],
      usage: prodUsage.trim()
    });

    setEditingProduct(null);
    showToast(`Updated "${prodName}" details successfully in database!`);
  };

  // Confirm delete product
  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    const name = deletingProduct.name;
    await deleteProduct(deletingProduct.id);
    showToast(`Removed "${name}" from database catalog.`);
    setDeletingProduct(null);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    updateOrderStatus(orderId, newStatus);
    showToast(`Order #${orderId} status changed to ${newStatus}`);
  };

  // GATE: Check if Admin is authenticated. If not, render standalone Admin Sign In Page
  if (!isAdminLoggedIn) {
    return <AdminLoginPage />;
  }

  // Helper to parse order timestamp cleanly
  const parseOrderTime = (o: AdminOrder): number => {
    if (o.created_at) {
      const t = new Date(o.created_at).getTime();
      if (!isNaN(t) && t > 0) return t;
    }
    const parsed = Date.parse(o.date);
    if (!isNaN(parsed) && parsed > 0) return parsed;
    const idDigits = parseInt(o.id.replace(/\D/g, ''), 10);
    return !isNaN(idDigits) ? idDigits : 0;
  };

  // Sort orders so latest / newest orders always appear at the very top
  const sortedOrders = [...orders].sort((a, b) => {
    return parseOrderTime(b) - parseOrderTime(a);
  });

  const filteredOrders = sortedOrders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone.includes(searchQuery);
    const matchesFilter = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCleanDatabase = async () => {
    if (window.confirm('Are you sure you want to remove all testing data and reset to a clean, fresh database?')) {
      try {
        const res = await apiFetch('/admin/clean-database', { method: 'POST' });
        if (res.ok) {
          clearAllOrders();
          resetProductsToDefault();
          setNotice('✅ Database reset successfully! All test data removed.');
          setTimeout(() => setNotice(''), 4000);
        }
      } catch {
        clearAllOrders();
        resetProductsToDefault();
        setNotice('✅ Local cache cleared.');
        setTimeout(() => setNotice(''), 4000);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title id="metaTitle">Admin Dashboard | All Fresh Naturals</title>
        <meta name="description" id="metaDescription" content="All Fresh Naturals Admin Management Portal for product catalog control, orders fulfillment, and customer records." />
        <meta id="ogTitle" property="og:title" content="Admin Dashboard | All Fresh Naturals" />
        <meta id="ogType" property="og:type" content="website" />
        <meta id="ogDescription" property="og:description" content="All Fresh Naturals Admin Control Center." />
        <meta id="ogUrl" property="og:url" content="https://allfreshnaturals.com/admin" />
        <meta id="ogSiteName" property="og:site_name" content="All Fresh Naturals" />
        <meta id="author" name="author" content="All Fresh Naturals" />
        <link id="canonical" rel="canonical" href="https://allfreshnaturals.com/admin" />
        <meta id="indexingStatus" name="robots" content="noindex, nofollow" />
        <meta id="Publisher" property="publisher" content="All Fresh Naturals" />
        <meta property="og:locale" content="en_US" />
      </Helmet>

      {/* PIXEL COMMERCE STYLE DASHBOARD LAYOUT */}
      <div className="px-admin-layout" data-lenis-prevent="true">
        {/* Mobile Top Header with Menu Button */}
        <div className="px-mobile-topbar">
          <div className="px-brand-header">
            <div className="px-logo-icon">
              <img src={logo} alt="All Fresh Naturals" className="px-logo-img" />
            </div>
            <div>
              <h2 className="px-brand-name">All Fresh Naturals</h2>
              <span className="px-brand-sub">Admin Control Center</span>
            </div>
          </div>
          <button
            type="button"
            className="px-mobile-menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Sidebar Overlay Backdrop */}
        {sidebarOpen && (
          <div
            className="px-sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* LEFT SIDEBAR NAVIGATION (Pixel Commerce Style) */}
        <aside className={`px-sidebar ${sidebarOpen ? 'px-sidebar-open' : ''}`}>
          <div className="px-sidebar-top">
            <div className="px-brand-header">
              <div className="px-logo-icon">
                <img src={logo} alt="All Fresh Naturals" className="px-logo-img" />
              </div>
              <div>
                <h2 className="px-brand-name">All Fresh Naturals</h2>
                <span className="px-brand-sub">Admin Control Center</span>
              </div>
            </div>

            <nav className="px-nav-list" aria-label="Admin Navigation">
              <button
                type="button"
                className={`px-nav-item ${activeTab === 'overview' ? 'px-nav-item-active' : ''}`}
                onClick={() => selectTab('overview')}
              >
                <div className="px-nav-item-left">
                  <TrendingUp size={18} />
                  <span>Overview</span>
                </div>
                {activeTab === 'overview' && <ChevronRight size={16} className="px-nav-chevron" />}
              </button>

              <button
                type="button"
                className={`px-nav-item ${activeTab === 'products' ? 'px-nav-item-active' : ''}`}
                onClick={() => selectTab('products')}
              >
                <div className="px-nav-item-left">
                  <Package size={18} />
                  <span>Products</span>
                </div>
                {activeTab === 'products' && <ChevronRight size={16} className="px-nav-chevron" />}
              </button>

              <button
                type="button"
                className={`px-nav-item ${activeTab === 'orders' ? 'px-nav-item-active' : ''}`}
                onClick={() => selectTab('orders')}
              >
                <div className="px-nav-item-left">
                  <ShoppingBag size={18} />
                  <span>Orders</span>
                </div>
                {activeTab === 'orders' && <ChevronRight size={16} className="px-nav-chevron" />}
              </button>

              <button
                type="button"
                className={`px-nav-item ${activeTab === 'customers' ? 'px-nav-item-active' : ''}`}
                onClick={() => selectTab('customers')}
              >
                <div className="px-nav-item-left">
                  <Users size={18} />
                  <span>Customer</span>
                </div>
                {activeTab === 'customers' && <ChevronRight size={16} className="px-nav-chevron" />}
              </button>
            </nav>
          </div>

          {/* Sidebar Bottom Status & Quick Actions */}
          <div className="px-sidebar-bottom">
            <div className="px-status-card">
              <span className="pulse-dot" />
              <span>Catalog: <strong>{products.length} Products Active</strong></span>
            </div>

            <button
              type="button"
              className="px-sidebar-btn px-btn-danger"
              onClick={handleCleanDatabase}
              title="Remove all test orders and reset to clean state"
            >
              <RotateCcw size={15} /> Clean Test Data
            </button>

            <button
              type="button"
              className="px-sidebar-btn px-btn-logout"
              onClick={logoutAdmin}
            >
              <LogOut size={16} /> Exit Admin
            </button>
          </div>
        </aside>

        {/* MAIN WORKSPACE AREA */}
        <main ref={workspaceRef} className="px-main-workspace">
          {/* Mobile Quick Navigation Pills */}
          <div className="px-mobile-tabs-bar">
            <button
              type="button"
              className={`px-mobile-tab-pill ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => selectTab('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className={`px-mobile-tab-pill ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => selectTab('products')}
            >
              Products ({products.length})
            </button>
            <button
              type="button"
              className={`px-mobile-tab-pill ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => selectTab('orders')}
            >
              Orders ({orders.length})
            </button>
            <button
              type="button"
              className={`px-mobile-tab-pill ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => selectTab('customers')}
            >
              Customers ({realCustomersList.length})
            </button>
          </div>

          {/* Top Header Bar */}
          <header className="px-top-header">
            <div className="px-header-title-box">
              <h1 className="px-page-title">
                {activeTab === 'overview' && 'Overview'}
                {activeTab === 'products' && 'Store Products'}
                {activeTab === 'orders' && 'Orders Fulfillment'}
                {activeTab === 'customers' && 'Customer Directory'}
              </h1>
              <p className="px-page-subtitle">All Fresh Naturals Management Portal</p>
            </div>

            <div className="px-header-actions">
              <div className="px-header-search">
                <Search size={16} className="px-search-icon" />
                <input
                  type="text"
                  placeholder="Search orders, catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="px-admin-profile">
                <div className="px-avatar-circle">
                  <ShieldCheck size={18} color="#0f3923" />
                </div>
                <div className="px-profile-info">
                  <span className="px-profile-name">Poornima (Admin)</span>
                  <span className="px-profile-role">FSSAI Certified</span>
                </div>
              </div>
            </div>
          </header>

          {notice && (
            <div className="admin-notice-bar" style={{ marginBottom: '24px' }}>
              <CheckCircle size={18} />
              <span>{notice}</span>
            </div>
          )}

          {/* Keep summary metrics on the Overview tab so management screens
              open directly to their products, orders, or customers. */}
          {activeTab === 'overview' && <div className="px-metrics-grid">
            <div className="px-stat-card">
              <div className="px-stat-card-top">
                <div>
                  <span className="px-stat-label">Total Revenue</span>
                  <span className="px-stat-sub">Real Customer Sales</span>
                </div>
                <div className="px-stat-icon-circle green">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="px-stat-val">₹{totalSales.toLocaleString('en-IN')}</div>
              <div className="px-stat-bottom">
                <span className="px-growth-badge positive">
                  <ArrowUpRight size={13} /> Live Sales
                </span>
              </div>
            </div>

            <div className="px-stat-card">
              <div className="px-stat-card-top">
                <div>
                  <span className="px-stat-label">Total Order</span>
                  <span className="px-stat-sub">Customer Purchases</span>
                </div>
                <div className="px-stat-icon-circle blue">
                  <ShoppingBag size={20} />
                </div>
              </div>
              <div className="px-stat-val">{orders.length}</div>
              <div className="px-stat-bottom">
                <span className="px-growth-badge neutral">
                  {pendingOrdersCount} Pending
                </span>
              </div>
            </div>

            <div className="px-stat-card">
              <div className="px-stat-card-top">
                <div>
                  <span className="px-stat-label">Live Products</span>
                  <span className="px-stat-sub">Active Store Catalog</span>
                </div>
                <div className="px-stat-icon-circle amber">
                  <Package size={20} />
                </div>
              </div>
              <div className="px-stat-val">{products.length}</div>
              <div className="px-stat-bottom">
                <span className="px-growth-badge positive">
                  <ArrowUpRight size={13} /> Active Store
                </span>
              </div>
            </div>

            <div className="px-stat-card">
              <div className="px-stat-card-top">
                <div>
                  <span className="px-stat-label">Customers</span>
                  <span className="px-stat-sub">Registered Patrons</span>
                </div>
                <div className="px-stat-icon-circle purple">
                  <Users size={20} />
                </div>
              </div>
              <div className="px-stat-val">{realCustomersList.length}</div>
              <div className="px-stat-bottom">
                <span className="px-growth-badge positive">
                  <ArrowUpRight size={13} /> Verified Buyers
                </span>
              </div>
            </div>
          </div>}

          {/* TAB 1: PRODUCT DETAILS & MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="px-card">
              <div className="admin-card-header with-filter">
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#0f172a', margin: 0 }}>
                    Store Products &amp; Catalog Control
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0' }}>
                    Add new products, edit pricing &amp; ingredients, or remove products live from the store.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.8rem', gap: '4px' }}
                    onClick={() => {
                      resetProductsToDefault();
                      showToast('Reset product catalog to default inventory.');
                    }}
                  >
                    Reset Defaults
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ gap: '6px', fontSize: '0.85rem' }}
                    onClick={handleOpenAddModal}
                  >
                    <Plus size={16} /> Add New Product
                  </button>
                </div>
              </div>

              <div className="admin-table-container" style={{ marginTop: '18px' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product Info</th>
                      <th>Tagline &amp; Badge</th>
                      <th>Size</th>
                      <th>Price</th>
                      <th>Ingredients</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td data-label="Product Info">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              loading="eager"
                              onError={(event) => {
                                // Keep the management list usable when a saved product
                                // image URL is unavailable on a mobile connection.
                                if (event.currentTarget.src !== abcMaltImg) {
                                  event.currentTarget.src = abcMaltImg;
                                }
                              }}
                              style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', background: '#f1f5f9', border: '1px solid #e2e8f0' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{p.name}</div>
                              <div style={{ fontSize: '0.76rem', color: '#64748b' }}>ID: {p.id}</div>
                            </div>
                          </div>
                        </td>
                        <td data-label="Tagline & Badge">
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '2px' }}>{p.tagline}</div>
                          <span className="badge-tag">{p.badge}</span>
                        </td>
                        <td data-label="Size"><strong style={{ fontSize: '0.85rem' }}>{p.size}</strong></td>
                        <td data-label="Price">
                          <strong style={{ fontSize: '1.1rem', color: '#059669' }}>₹{p.price}</strong>
                        </td>
                        <td data-label="Ingredients" style={{ maxWidth: '240px', fontSize: '0.8rem', color: '#334155' }}>
                          {Array.isArray(p.ingredients)
                            ? p.ingredients.slice(0, 4).join(', ') + (p.ingredients.length > 4 ? '...' : '')
                            : (p.ingredients || 'Natural herbs')}
                        </td>
                        <td data-label="Actions">
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button
                              type="button"
                              className="admin-icon-btn admin-btn-edit"
                              data-lenis-prevent="true"
                              title="Edit Product Details"
                              aria-label="Edit Product"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleOpenEditModal(p);
                              }}
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(p);
                              }}
                            >
                              <Edit2 size={18} strokeWidth={2} />
                            </button>
                            <button
                              type="button"
                              className="admin-icon-btn admin-btn-delete"
                              data-lenis-prevent="true"
                              title="Delete Product"
                              aria-label="Delete Product"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setDeletingProduct(p);
                              }}
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                setDeletingProduct(p);
                              }}
                            >
                              <Trash2 size={18} strokeWidth={2} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="px-card">
              <div className="admin-card-header with-filter">
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#0f172a', margin: 0 }}>
                  Order Fulfillment Manager
                </h3>
                <div className="admin-filter-row">
                  <div className="admin-search-box">
                    <Search size={16} />
                    <input
                      type="text"
                      placeholder="Search order ID, customer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="admin-select-wrapper">
                    <Filter size={16} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                      <option value="All">All Statuses</option>
                      <option value="Pending WhatsApp">Pending WhatsApp</option>
                      <option value="Processing">Processing</option>
                      <option value="Batch Preparing">Batch Preparing</option>
                      <option value="Dispatched">Dispatched</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </div>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 16px' }}>
                  <ShoppingBag size={48} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                  <h4 style={{ color: '#0f172a', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                    No Customer Orders Placed Yet
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', maxWidth: '420px', margin: '8px auto 0' }}>
                    When customers buy products from your store (via Checkout or WhatsApp Buy Now), their purchase details will appear here automatically.
                  </p>
                </div>
              ) : (
                <div className="admin-table-container" style={{ marginTop: '18px' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td data-label="Order ID"><strong style={{ color: '#0f172a' }}>#{ord.id}</strong></td>
                          <td data-label="Date" style={{ fontSize: '0.8rem', color: '#64748b' }}>{ord.date}</td>
                          <td data-label="Customer">
                            <div style={{ fontWeight: 600, color: '#0f172a' }}>{ord.customerName}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{ord.phone} &bull; {ord.city}</div>
                          </td>
                          <td data-label="Items">{ord.items}</td>
                          <td data-label="Total"><strong style={{ color: '#059669' }}>₹{ord.total}</strong></td>
                          <td data-label="Status">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                              className="admin-select-sm"
                            >
                              <option value="Pending WhatsApp">Pending WhatsApp</option>
                              <option value="Processing">Processing</option>
                              <option value="Batch Preparing">Batch Preparing</option>
                              <option value="Dispatched">Dispatched</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                          <td data-label="Actions">
                            <button
                              type="button"
                              className="admin-icon-btn admin-btn-view"
                              data-lenis-prevent="true"
                              title="View Order Details"
                              aria-label="View Order Details"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelectedOrder(ord);
                              }}
                              onPointerDown={(e) => {
                                e.stopPropagation();
                                setSelectedOrder(ord);
                              }}
                            >
                              <Eye size={18} strokeWidth={2} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: OVERVIEW & ANALYTICS */}
          {activeTab === 'overview' && (
            <div className="admin-overview-grid">
              <div className="px-card">
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#0f172a', margin: '0 0 16px' }}>
                  Product Demand &amp; Sales Distribution
                </h3>
                <div style={{ margin: '20px 0' }}>
                  {products.map((p) => {
                    const prodOrders = orders.filter((o) => o.items.toLowerCase().includes(p.name.toLowerCase()));
                    const perc = orders.length > 0 ? Math.round((prodOrders.length / orders.length) * 100) : 0;
                    return (
                      <div key={p.id} style={{ marginBottom: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{p.name} ({p.size})</span>
                          <strong>{perc}% of Total Volume ({prodOrders.length} orders)</strong>
                        </div>
                        <div className="admin-progress-bar">
                          <div className="fill" style={{ width: `${perc}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="admin-side-col">
                <div className="px-card" style={{ background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                  <h3 style={{ color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.15rem', fontFamily: 'var(--font-serif)', margin: '0 0 8px' }}>
                    Fresh Batch Control
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#047857', lineHeight: 1.6, margin: 0 }}>
                    Fresh roasting &amp; small batch preparation active. Send order status updates to your customers via WhatsApp anytime.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: '16px', width: '100%', fontSize: '0.85rem' }}
                    onClick={() => showToast('Batch notifications active!')}
                  >
                    Active Batch Status
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="px-card">
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: '#0f172a', margin: '0 0 16px' }}>
                Registered Store Patrons ({realCustomersList.length})
              </h3>
              {realCustomersList.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 16px' }}>
                  <Users size={48} style={{ color: '#94a3b8', marginBottom: '12px' }} />
                  <h4 style={{ color: '#0f172a', fontFamily: 'var(--font-serif)' }}>No Customer History Yet</h4>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px' }}>
                    Customer profiles will build automatically when customers buy products on the store.
                  </p>
                </div>
              ) : (
                <div className="admin-table-container" style={{ marginTop: '16px' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Customer ID</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>City</th>
                        <th>Total Orders</th>
                        <th>Total Spent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {realCustomersList.map((c) => (
                        <tr key={c.id}>
                          <td data-label="Customer ID"><strong style={{ color: '#0f172a' }}>{c.id}</strong></td>
                          <td data-label="Name" style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</td>
                          <td data-label="Contact">
                            <div>{c.email}</div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.phone}</div>
                          </td>
                          <td data-label="City">{c.city}</td>
                          <td data-label="Total Orders"><span className="badge-tag">{c.totalOrders} Orders</span></td>
                          <td data-label="Total Spent"><strong style={{ color: '#059669' }}>₹{c.totalSpent}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </main>

        {/* MODAL 1: ADD NEW PRODUCT */}
        {showAddModal && createPortal(
          <div className="admin-modern-modal-overlay" data-lenis-prevent="true" onClick={() => setShowAddModal(false)}>
            <div className="admin-modern-modal-card" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header-modern">
                <div className="admin-modal-header-left">
                  <div className="admin-modal-icon-box">
                    <Plus size={22} />
                  </div>
                  <div>
                    <h3 className="admin-modal-title-main">Add New Product</h3>
                    <p className="admin-modal-subtitle-main">
                      Enter product specifications, pricing, and catalog image
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-modal-close-btn"
                  onClick={() => setShowAddModal(false)}
                  title="Close modal"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAddProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <div className="admin-modal-body-scroll">
                  <div className="admin-section-block">
                    <div className="admin-section-title-wrap">
                      <span className="admin-section-title-tag">
                        <Tag size={13} /> Basic Information &amp; Pricing
                      </span>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>Product Name <span className="req">*</span></span>
                        </label>
                        <input
                          type="text"
                          className="admin-input-modern"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="e.g., Sprouted Ragi Health Mix"
                          required
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>Badge / Tag Label <span className="req">*</span></span>
                          <span className="admin-field-hint">Highlighted pill</span>
                        </label>
                        <input
                          type="text"
                          className="admin-input-modern"
                          value={prodBadge}
                          onChange={(e) => setProdBadge(e.target.value)}
                          placeholder="e.g., Best Seller, Fresh Batch"
                          required
                        />
                      </div>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>Price (₹) <span className="req">*</span></span>
                        </label>
                        <input
                          type="number"
                          className="admin-input-modern"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          placeholder="299"
                          required
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>Pack Size <span className="req">*</span></span>
                        </label>
                        <input
                          type="text"
                          className="admin-input-modern"
                          value={prodSize}
                          onChange={(e) => setProdSize(e.target.value)}
                          placeholder="e.g., 500g Pouch"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-section-block">
                    <div className="admin-section-title-wrap">
                      <span className="admin-section-title-tag">
                        <ImageIcon size={13} /> Product Photography
                      </span>
                      <span className="admin-field-hint">JPG / PNG up to 5MB</span>
                    </div>

                    <div className="admin-image-upload-card">
                      {prodImage ? (
                        <>
                          <div className="admin-image-preview-area">
                            <img
                              src={prodImage}
                              alt="Product Preview"
                              className="admin-image-thumb-large"
                            />
                            <div>
                              <strong style={{ fontSize: '0.86rem', color: 'var(--primary-color)', display: 'block' }}>
                                Photo Selected
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                Ready to be saved to product catalog
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label
                              className="admin-btn-cancel"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                padding: '7px 14px',
                                fontSize: '0.8rem'
                              }}
                            >
                              <Upload size={13} /> Change
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileUpload}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <button
                              type="button"
                              className="admin-btn-cancel"
                              style={{
                                color: '#dc3545',
                                borderColor: '#fca5a5',
                                padding: '7px 14px',
                                fontSize: '0.8rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => setProdImage('')}
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ width: '100%', textAlign: 'center', padding: '10px 0' }}>
                          <label
                            style={{
                              display: 'inline-flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              width: '100%'
                            }}
                          >
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e8f5e9', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Upload size={18} />
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.86rem', color: 'var(--primary-color)' }}>
                                Click to upload product photo
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>
                                PNG, JPG or WEBP (Automatically compressed)
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-section-block">
                    <div className="admin-section-title-wrap">
                      <span className="admin-section-title-tag">
                        <FileText size={13} /> Tagline &amp; Description
                      </span>
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Tagline</span>
                        <span className="admin-field-hint">Short one-liner</span>
                      </label>
                      <input
                        type="text"
                        className="admin-input-modern"
                        value={prodTagline}
                        onChange={(e) => setProdTagline(e.target.value)}
                        placeholder="e.g., Wholesome Nutrition in Every Sip!"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Product Description</span>
                      </label>
                      <textarea
                        rows={3}
                        className="admin-textarea-modern"
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Describe product taste, traditional preparation, and nutritional values..."
                      />
                    </div>
                  </div>

                  <div className="admin-section-block">
                    <div className="admin-section-title-wrap">
                      <span className="admin-section-title-tag">
                        <Leaf size={13} /> Ingredients &amp; Usage Details
                      </span>
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Ingredients List</span>
                        <span className="admin-field-hint">Comma separated</span>
                      </label>
                      <textarea
                        rows={2}
                        className="admin-textarea-modern"
                        value={prodIngredients}
                        onChange={(e) => setProdIngredients(e.target.value)}
                        placeholder="e.g., Ragi (Finger Millet), Jowar, Wheat, Rice, Almonds, Cashews, Elaichi"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Key Health Benefits</span>
                        <span className="admin-field-hint">Comma separated</span>
                      </label>
                      <textarea
                        rows={2}
                        className="admin-textarea-modern"
                        value={prodBenefits}
                        onChange={(e) => setProdBenefits(e.target.value)}
                        placeholder="e.g., Rich in Calcium, High Fiber, 100% Homemade, Sustained Energy"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Usage Instructions</span>
                      </label>
                      <textarea
                        rows={2}
                        className="admin-textarea-modern"
                        value={prodUsage}
                        onChange={(e) => setProdUsage(e.target.value)}
                        placeholder="e.g., Mix 2 tbsp with milk or water, cook on low flame for 3-5 minutes..."
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer-modern">
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Fields marked with <span style={{ color: '#dc3545', fontWeight: 'bold' }}>*</span> are required
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      className="admin-btn-cancel"
                      onClick={() => setShowAddModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-btn-save"
                    >
                      <Check size={16} /> Save Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

        {/* MODAL 2: EDIT PRODUCT */}
        {editingProduct && createPortal(
          <div className="admin-modern-modal-overlay" data-lenis-prevent="true" onClick={() => setEditingProduct(null)}>
            <div className="admin-modern-modal-card" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
              <div className="admin-modal-header-modern">
                <div className="admin-modal-header-left">
                  <div className="admin-modal-icon-box">
                    <Package size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 className="admin-modal-title-main">Edit Product</h3>
                      <span className="badge-tag" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                        {editingProduct.badge || 'Catalog Item'}
                      </span>
                    </div>
                    <p className="admin-modal-subtitle-main">
                      Modify catalog information, pricing, ingredients, and imagery
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-modal-close-btn"
                  onClick={() => setEditingProduct(null)}
                  title="Close modal"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEditProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <div className="admin-modal-body-scroll" data-lenis-prevent="true">
                  <div className="admin-section-block">
                    <div className="admin-section-title-wrap">
                      <span className="admin-section-title-tag">
                        <Tag size={13} /> Basic Information &amp; Pricing
                      </span>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>Product Name <span className="req">*</span></span>
                        </label>
                        <input
                          type="text"
                          className="admin-input-modern"
                          value={prodName}
                          onChange={(e) => setProdName(e.target.value)}
                          placeholder="e.g., Ragi Malt Health Mix"
                          required
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>Badge / Tag Label <span className="req">*</span></span>
                          <span className="admin-field-hint">Highlighted on card</span>
                        </label>
                        <input
                          type="text"
                          className="admin-input-modern"
                          value={prodBadge}
                          onChange={(e) => setProdBadge(e.target.value)}
                          placeholder="e.g., Traditional Recipe"
                          required
                        />
                      </div>
                    </div>

                    <div className="admin-form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>Price (₹) <span className="req">*</span></span>
                        </label>
                        <input
                          type="number"
                          className="admin-input-modern"
                          value={prodPrice}
                          onChange={(e) => setProdPrice(Number(e.target.value))}
                          placeholder="299"
                          required
                        />
                      </div>

                      <div className="admin-field-group">
                        <label className="admin-field-label">
                          <span>Pack Size <span className="req">*</span></span>
                        </label>
                        <input
                          type="text"
                          className="admin-input-modern"
                          value={prodSize}
                          onChange={(e) => setProdSize(e.target.value)}
                          placeholder="e.g., 500g Pouch"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="admin-section-block">
                    <div className="admin-section-title-wrap">
                      <span className="admin-section-title-tag">
                        <ImageIcon size={13} /> Product Image
                      </span>
                      <span className="admin-field-hint">High quality JPEG/PNG</span>
                    </div>

                    <div className="admin-image-upload-card">
                      {prodImage ? (
                        <>
                          <div className="admin-image-preview-area">
                            <img
                              src={prodImage}
                              alt="Product Preview"
                              className="admin-image-thumb-large"
                            />
                            <div>
                              <strong style={{ fontSize: '0.86rem', color: 'var(--primary-color)', display: 'block' }}>
                                Image Loaded
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                                Stored and compressed in database
                              </span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label
                              className="admin-btn-cancel"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                padding: '7px 14px',
                                fontSize: '0.8rem'
                              }}
                            >
                              <Upload size={13} /> Change
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageFileUpload}
                                style={{ display: 'none' }}
                              />
                            </label>
                            <button
                              type="button"
                              className="admin-btn-cancel"
                              style={{
                                color: '#dc3545',
                                borderColor: '#fca5a5',
                                padding: '7px 14px',
                                fontSize: '0.8rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                              onClick={() => setProdImage('')}
                            >
                              <Trash2 size={13} /> Remove
                            </button>
                          </div>
                        </>
                      ) : (
                        <div style={{ width: '100%', textAlign: 'center', padding: '10px 0' }}>
                          <label
                            style={{
                              display: 'inline-flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              cursor: 'pointer',
                              width: '100%'
                            }}
                          >
                            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#e8f5e9', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Upload size={18} />
                            </div>
                            <div>
                              <strong style={{ fontSize: '0.86rem', color: 'var(--primary-color)' }}>
                                Click to upload product photo
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>
                                PNG, JPG or WEBP up to 5MB (Auto-compressed)
                              </span>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageFileUpload}
                              style={{ display: 'none' }}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="admin-section-block">
                    <div className="admin-section-title-wrap">
                      <span className="admin-section-title-tag">
                        <FileText size={13} /> Content &amp; Description
                      </span>
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Tagline</span>
                        <span className="admin-field-hint">Short catchy one-liner</span>
                      </label>
                      <input
                        type="text"
                        className="admin-input-modern"
                        value={prodTagline}
                        onChange={(e) => setProdTagline(e.target.value)}
                        placeholder="e.g., Wholesome Nutrition in Every Sip!"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Full Description</span>
                      </label>
                      <textarea
                        rows={3}
                        className="admin-textarea-modern"
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Describe the product, aroma, traditional preparation method, and health values..."
                      />
                    </div>
                  </div>

                  <div className="admin-section-block">
                    <div className="admin-section-title-wrap">
                      <span className="admin-section-title-tag">
                        <Leaf size={13} /> Ingredients &amp; Usage Details
                      </span>
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Ingredients List</span>
                        <span className="admin-field-hint">Comma separated</span>
                      </label>
                      <textarea
                        rows={2}
                        className="admin-textarea-modern"
                        value={prodIngredients}
                        onChange={(e) => setProdIngredients(e.target.value)}
                        placeholder="e.g., Ragi (Finger Millet), Jowar, Wheat, Rice, Almonds, Cashews, Elaichi"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Key Benefits</span>
                        <span className="admin-field-hint">Comma separated</span>
                      </label>
                      <textarea
                        rows={2}
                        className="admin-textarea-modern"
                        value={prodBenefits}
                        onChange={(e) => setProdBenefits(e.target.value)}
                        placeholder="e.g., Rich in Calcium, High Fiber, 100% Homemade, Sustained Energy"
                      />
                    </div>

                    <div className="admin-field-group">
                      <label className="admin-field-label">
                        <span>Usage &amp; Preparation Instructions</span>
                      </label>
                      <textarea
                        rows={2}
                        className="admin-textarea-modern"
                        value={prodUsage}
                        onChange={(e) => setProdUsage(e.target.value)}
                        placeholder="e.g., Mix 2 tbsp of Ragi Malt with milk or water, cook on low flame for 3-5 mins..."
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-modal-footer-modern">
                  <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Product ID: <code style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', color: '#334155' }}>{editingProduct.id}</code>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      className="admin-btn-cancel"
                      onClick={() => setEditingProduct(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="admin-btn-save"
                    >
                      <Check size={16} /> Update Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

        {/* MODAL 3: DELETE CONFIRMATION */}
        {deletingProduct && createPortal(
          <div className="admin-modern-modal-overlay admin-delete-modal-overlay" data-lenis-prevent="true" onClick={() => setDeletingProduct(null)}>
            <div className="admin-modern-modal-card admin-delete-modal-card" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid #fecaca' }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ color: '#991b1b', fontSize: '1.25rem', fontFamily: 'var(--font-serif)', margin: '0 0 8px', fontWeight: 700, textAlign: 'center' }}>
                Delete Product?
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#475569', margin: '0 0 20px', lineHeight: 1.5, textAlign: 'center' }}>
                Are you sure you want to remove <strong style={{ color: '#0f172a' }}>"{deletingProduct.name}"</strong>? This will permanently delete it from the live store catalog.
              </p>

              <div style={{ display: 'flex', gap: '10px', width: '100%', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="admin-btn-cancel"
                  style={{ flex: 1, textAlign: 'center' }}
                  onClick={() => setDeletingProduct(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="admin-btn-save"
                  style={{
                    flex: 1,
                    background: '#dc2626',
                    borderColor: '#dc2626',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(220, 38, 38, 0.28)'
                  }}
                  onClick={handleConfirmDelete}
                >
                  <Trash2 size={15} /> Yes, Delete
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* MODAL 4: ORDER DETAILS */}
        {selectedOrder && createPortal(
          <div className="admin-modern-modal-overlay" data-lenis-prevent="true" onClick={() => setSelectedOrder(null)}>
            <div className="admin-modern-modal-card" data-lenis-prevent="true" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
              <div className="admin-modal-header-modern">
                <div className="admin-modal-header-left">
                  <div className="admin-modal-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                    <ShoppingBag size={22} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h3 className="admin-modal-title-main">Order #{selectedOrder.id}</h3>
                      <span className={`badge-tag ${selectedOrder.status === 'Delivered' ? 'badge-delivered' :
                        selectedOrder.status === 'Dispatched' ? 'badge-shipped' : 'badge-pending'
                        }`} style={{ fontSize: '0.74rem' }}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    <p className="admin-modal-subtitle-main">
                      Placed on {selectedOrder.date}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-modal-close-btn"
                  onClick={() => setSelectedOrder(null)}
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="admin-modal-body-scroll" style={{ gap: '14px' }}>
                <div className="admin-section-block">
                  <div className="admin-section-title-wrap">
                    <span className="admin-section-title-tag">
                      <Users size={13} /> Customer Information
                    </span>
                    {selectedOrder.phone && (
                      <a
                        href={`https://wa.me/91${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        💬 WhatsApp Customer
                      </a>
                    )}
                  </div>

                  <div className="admin-order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.86rem' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Customer Name</span>
                      <strong style={{ color: '#1e293b' }}>{selectedOrder.customerName}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Phone Number</span>
                      <strong style={{ color: '#1e293b' }}>{selectedOrder.phone}</strong>
                    </div>
                    {selectedOrder.email && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block' }}>Email Address</span>
                        <span style={{ color: '#334155' }}>{selectedOrder.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="admin-section-block">
                  <div className="admin-section-title-wrap">
                    <span className="admin-section-title-tag">
                      <Package size={13} /> Delivery Destination
                    </span>
                  </div>

                  <div style={{ fontSize: '0.86rem', lineHeight: '1.5', color: '#334155' }}>
                    <div>{selectedOrder.address}</div>
                    <div style={{ fontWeight: 600, color: '#1e293b', marginTop: '2px' }}>
                      {selectedOrder.city}, {selectedOrder.state || 'Karnataka'} – {selectedOrder.pincode}
                    </div>
                  </div>
                </div>

                <div className="admin-section-block">
                  <div className="admin-section-title-wrap">
                    <span className="admin-section-title-tag">
                      <ShoppingBag size={13} /> Ordered Items &amp; Billing
                    </span>
                  </div>

                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 14px' }}>
                    <div style={{ fontSize: '0.88rem', color: '#1e293b', marginBottom: '8px', fontWeight: 500 }}>
                      {selectedOrder.items}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Order Total (Inc. Delivery):</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                        ₹{selectedOrder.total}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="admin-section-block">
                  <div className="admin-section-title-wrap">
                    <span className="admin-section-title-tag">
                      <ShieldCheck size={13} /> Update Fulfillment Status
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {(['Pending WhatsApp', 'Processing', 'Batch Preparing', 'Dispatched', 'Delivered'] as AdminOrder['status'][]).map((st) => (
                      <button
                        key={st}
                        type="button"
                        className={`admin-btn-cancel`}
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.78rem',
                          background: selectedOrder.status === st ? 'var(--primary-color)' : '#ffffff',
                          color: selectedOrder.status === st ? '#ffffff' : '#334155',
                          borderColor: selectedOrder.status === st ? 'var(--primary-color)' : '#d1dbd2',
                          fontWeight: selectedOrder.status === st ? 700 : 500
                        }}
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, st);
                          setSelectedOrder({ ...selectedOrder, status: st });
                        }}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer-modern" style={{ justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="admin-btn-cancel"
                  onClick={() => setSelectedOrder(null)}
                  style={{ minWidth: '100px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    </>
  );
}
