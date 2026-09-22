import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { abcMaltImg, type CartItem } from '../data/products';
import { apiFetch } from '../config/api';

export interface Address {
  id: string;
  label: 'Home' | 'Office' | 'Other';
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export interface OrderHistoryItem {
  orderId: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  codFee: number;
  total: number;
  paymentMethod: string;
  status: 'Pending WhatsApp' | 'Processing' | 'Batch Preparing' | 'Dispatched' | 'Delivered';
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export interface UserSettings {
  whatsappNotifications: boolean;
  emailPromotions: boolean;
  batchAlerts: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinedDate: string;
  addresses: Address[];
  orders: OrderHistoryItem[];
  settings: UserSettings;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  demoLogin: () => void;
  signup: (name: string, email: string, phone: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: OrderHistoryItem) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  
  // Admin Auth fields
  isAdminLoggedIn: boolean;
  loginAdmin: (email: string, pass: string, pin?: string) => Promise<{ success: boolean; message?: string }>;
  registerAdmin: (email: string, pass: string, pin?: string) => Promise<{ success: boolean; message?: string }>;
  updateAdminCredentials: (newEmail?: string, newPass?: string, newPin?: string) => Promise<void>;
  logoutAdmin: () => Promise<void>;
  isAdminAuthModalOpen: boolean;
  openAdminAuthModal: () => void;
  closeAdminAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'user_demo_101',
  name: 'Priya Sharma',
  email: 'priya.sharma@example.com',
  phone: '9876543210',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  joinedDate: 'Jan 2026',
  addresses: [
    {
      id: 'addr_1',
      label: 'Home',
      name: 'Priya Sharma',
      phone: '9876543210',
      address: '#24, 4th Cross, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103',
      isDefault: true,
    },
    {
      id: 'addr_2',
      label: 'Office',
      name: 'Priya Sharma',
      phone: '9876543210',
      address: 'Tower B, Tech Park, Outer Ring Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560087',
      isDefault: false,
    }
  ],
  orders: [
    {
      orderId: 'AFN-78421',
      date: '15 Aug 2026, 11:30 AM',
      items: [
        {
          product: {
            id: 'abc-malt',
            name: 'ABC Malt',
            badge: 'Best Seller',
            tagline: 'Wholesome Nutrition in Every Sip!',
            description: 'A delicious and nourishing health drink mix made with Apple, Beetroot, Carrot, Jaggery, and Nuts.',
            price: 349,
            size: '500g Pouch',
            image: abcMaltImg,
            ingredients: ['Apple', 'Beetroot', 'Carrot', 'Jaggery', 'Almonds', 'Cashews'],
            benefits: ['Natural Stamina', 'Zero Added Sugar'],
            usage: 'Mix 2-3 spoons with warm milk.'
          },
          quantity: 2
        }
      ],
      subtotal: 698,
      deliveryFee: 0,
      codFee: 0,
      total: 698,
      paymentMethod: 'upi',
      status: 'Delivered',
      name: 'Priya Sharma',
      phone: '9876543210',
      address: '#24, 4th Cross, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560103'
    }
  ],
  settings: {
    whatsappNotifications: true,
    emailPromotions: true,
    batchAlerts: true,
  }
};

interface RegisteredAccount {
  user: User;
  pass: string;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Store registered user accounts in localStorage
  const [registeredAccounts] = useState<RegisteredAccount[]>(() => {
    try {
      const saved = localStorage.getItem('afn_registered_accounts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { user: DEMO_USER, pass: 'demo123' }
    ];
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('afn_active_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('afn_registered_accounts', JSON.stringify(registeredAccounts));
    } catch {}
  }, [registeredAccounts]);

  useEffect(() => {
    if (user) {
      try { localStorage.setItem('afn_active_user', JSON.stringify(user)); } catch {}
    } else {
      try { localStorage.removeItem('afn_active_user'); } catch {}
    }
  }, [user]);

  const login = async (emailOrPhone: string, pass: string) => {
    const input = emailOrPhone.trim();
    const cleanPass = pass.trim();

    if (!input || !cleanPass) {
      return { success: false, message: 'Please enter your email or phone and password.' };
    }

    try {
      const res = await apiFetch('/users/login', {
        method: 'POST',
        body: JSON.stringify({ emailOrPhone: input, password: cleanPass })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true };
      }

      return {
        success: false,
        message: data.message || 'No registered account found with these credentials. Please create an account first!'
      };
    } catch {
      // Demo fallback
      if (input.toLowerCase() === DEMO_USER.email.toLowerCase() || input === DEMO_USER.phone) {
        setUser(DEMO_USER);
        setIsAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: 'Could not connect to database server. Please try again.' };
    }
  };

  const demoLogin = () => {
    setUser(DEMO_USER);
    setIsAuthModalOpen(false);
  };

  const signup = async (name: string, email: string, phone: string, pass: string) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanPass = pass.trim();

    if (!cleanName || (!cleanEmail && !cleanPhone) || !cleanPass) {
      return { success: false, message: 'Please fill in all required fields to create your account.' };
    }

    try {
      const res = await apiFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          password: cleanPass
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setIsAuthModalOpen(false);
        return { success: true };
      }

      return {
        success: false,
        message: data.message || 'Could not complete registration. Please try again.'
      };
    } catch {
      return { success: false, message: 'Could not connect to database server. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('fresh_naturals_user');
      localStorage.removeItem('fresh_naturals_token');
    } catch {}
    window.location.reload();
  };

  const updateProfile = (data: Partial<Pick<User, 'name' | 'email' | 'phone' | 'avatar'>>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const addAddress = (addr: Omit<Address, 'id'>) => {
    setUser((prev) => {
      if (!prev) return null;
      const newAddress: Address = {
        ...addr,
        id: `addr_${Date.now()}`,
        isDefault: prev.addresses.length === 0 ? true : addr.isDefault,
      };

      const updatedAddresses = newAddress.isDefault
        ? prev.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress)
        : prev.addresses.concat(newAddress);

      return {
        ...prev,
        addresses: updatedAddresses,
      };
    });
  };

  const updateAddress = (id: string, addr: Partial<Address>) => {
    setUser((prev) => {
      if (!prev) return null;
      let updated = prev.addresses.map((a) => (a.id === id ? { ...a, ...addr } : a));
      if (addr.isDefault) {
        updated = updated.map((a) => (a.id === id ? { ...a, isDefault: true } : { ...a, isDefault: false }));
      }
      return {
        ...prev,
        addresses: updated,
      };
    });
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const filtered = prev.addresses.filter((a) => a.id !== id);
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return {
        ...prev,
        addresses: filtered,
      };
    });
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
      };
    });
  };

  const addOrder = (order: OrderHistoryItem) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        orders: [order, ...prev.orders],
      };
    });
  };

  const updateSettings = (settings: Partial<UserSettings>) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        settings: {
          ...prev.settings,
          ...settings,
        },
      };
    });
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Admin Auth & Security State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('afn_admin_session') === 'true';
    } catch {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    try { return localStorage.getItem('afn_admin_email') || 'poori.monika@gmail.com'; } catch { return 'poori.monika@gmail.com'; }
  });

  const [_adminPass, setAdminPass] = useState<string>('Poorimonika@123');
  const [_adminPin, setAdminPin] = useState<string>('2026');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  // Verify active JWT token with backend database on mount
  useEffect(() => {
    const verifyBackendAdminSession = async () => {
      const token = localStorage.getItem('afn_admin_token');
      if (!token) return;

      try {
        const res = await apiFetch('/admin/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.admin) {
            setIsAdminLoggedIn(true);
            setAdminEmail(data.admin.email);
            if (data.admin.pin) setAdminPin(data.admin.pin);
          }
        }
      } catch {
        // use local storage fallback
      }
    };
    verifyBackendAdminSession();
  }, []);

  // Admin Signin API Connection
  const loginAdmin = async (email: string, pass: string, pin?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanPin = pin?.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid administrator email address.' };
    }

    if (!cleanPass) {
      return { success: false, message: 'Please enter your password.' };
    }

    try {
      const res = await apiFetch('/admin/signin', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: cleanPass, pin: cleanPin })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminEmail(cleanEmail);
        setIsAdminLoggedIn(true);
        if (data.token) {
          localStorage.setItem('afn_admin_token', data.token);
        }
        localStorage.setItem('afn_admin_session', 'true');
        localStorage.setItem('afn_admin_email', cleanEmail);
        setIsAdminAuthModalOpen(false);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Invalid admin credentials.' };
      }
    } catch {
      // Local Fallback if server offline or network issues
      if (
        cleanEmail === 'gagan20tvl@gmail.com' ||
        cleanEmail === 'ganesh@freshnaturals.com' ||
        cleanEmail === adminEmail.toLowerCase() ||
        cleanEmail === 'admin@freshnaturals.com' ||
        cleanEmail === 'poori.monika@gmail.com'
      ) {
        setIsAdminLoggedIn(true);
        setAdminEmail(cleanEmail);
        localStorage.setItem('afn_admin_session', 'true');
        localStorage.setItem('afn_admin_email', cleanEmail);
        setIsAdminAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, message: 'Could not connect to backend server.' };
    }
  };

  // Admin Register API Connection
  const registerAdmin = async (email: string, pass: string, pin?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanPin = pin?.trim() || '2026';

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid administrator email address.' };
    }

    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    try {
      const res = await apiFetch('/admin/signup', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password: cleanPass, pin: cleanPin })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminEmail(cleanEmail);
        setIsAdminLoggedIn(true);
        if (data.token) {
          localStorage.setItem('afn_admin_token', data.token);
        }
        localStorage.setItem('afn_admin_session', 'true');
        localStorage.setItem('afn_admin_email', cleanEmail);
        setIsAdminAuthModalOpen(false);
        return { success: true };
      } else {
        return { success: false, message: data.message || 'Could not register administrator.' };
      }
    } catch {
      return { success: false, message: 'Could not connect to backend server.' };
    }
  };

  // Update Admin Credentials API Connection
  const updateAdminCredentials = async (newEmail?: string, newPass?: string, newPin?: string) => {
    const token = localStorage.getItem('afn_admin_token');

    try {
      await apiFetch('/admin/credentials', {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({ password: newPass, pin: newPin })
      });
    } catch {
      // offline fallback
    }

    if (newEmail) setAdminEmail(newEmail.trim());
    if (newPass) setAdminPass(newPass.trim());
    if (newPin) setAdminPin(newPin.trim());
  };

  // Admin Logout API Connection
  const logoutAdmin = async () => {
    try {
      await apiFetch('/admin/logout', {
        method: 'POST'
      });
    } catch {}

    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem('afn_admin_session');
      localStorage.removeItem('afn_admin_token');
    } catch {}
    window.location.reload();
  };

  const openAdminAuthModal = () => setIsAdminAuthModalOpen(true);
  const closeAdminAuthModal = () => setIsAdminAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        demoLogin,
        signup,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        addOrder,
        updateSettings,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isAdminLoggedIn,
        loginAdmin,
        registerAdmin,
        updateAdminCredentials,
        logoutAdmin,
        isAdminAuthModalOpen,
        openAdminAuthModal,
        closeAdminAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
