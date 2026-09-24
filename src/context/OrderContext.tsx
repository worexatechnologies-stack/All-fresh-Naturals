import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { apiFetch } from '../config/api';

export interface OrderItemDetail {
  name: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface AdminOrder {
  id: string;
  orderId?: string;
  userId?: string;
  customerName: string;
  email?: string;
  phone: string;
  city: string;
  address: string;
  state?: string;
  pincode?: string;
  items: string;
  itemsDetail?: OrderItemDetail[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  totalAmount?: number;
  paymentMethod: string;
  status: 'Pending WhatsApp' | 'Processing' | 'Batch Preparing' | 'Dispatched' | 'Delivered';
  date: string;
  created_at?: string;
}


interface OrderContextType {
  orders: AdminOrder[];
  placeNewOrder: (order: Partial<AdminOrder> & { customerName: string; phone: string; city: string; address: string; items: string; total: number }) => AdminOrder;
  updateOrderStatus: (orderId: string, status: AdminOrder['status']) => void;
  deleteOrder: (orderId: string) => void;
  resetOrdersToDefault: () => void;
  clearAllOrders: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Helper to safely normalize orders from MongoDB API or local storage
const normalizeOrder = (raw: Record<string, unknown>): AdminOrder => {
  let itemsStr = '';
  const rawItems = raw.items;
  if (typeof rawItems === 'string') {
    itemsStr = rawItems;
  } else if (Array.isArray(rawItems)) {
    itemsStr = rawItems.map((i: unknown) => {
      if (typeof i === 'string') return i.replace(/^"|"$/g, '');
      if (i && typeof i === 'object') {
        const itemObj = i as Record<string, unknown>;
        const prod = itemObj.product as Record<string, unknown> | undefined;
        const pName = String(prod?.name || itemObj.name || 'Product');
        const pSize = String(prod?.size || itemObj.size || '');
        const qty = Number(itemObj.quantity || 1);
        return `${pName}${pSize ? ` (${pSize})` : ''} x${qty}`;
      }
      return String(i || '');
    }).filter(Boolean).join(', ');
  } else if (rawItems && typeof rawItems === 'object') {
    itemsStr = JSON.stringify(rawItems);
  }

  // Remove leading/trailing quotes if any
  itemsStr = (itemsStr || '1 item').replace(/^"|"$/g, '');

  const shipping = raw.shippingAddress;
  let addrStr = '';
  let cityStr = typeof raw.city === 'string' ? raw.city : '';
  if (typeof shipping === 'string') {
    addrStr = shipping;
  } else if (shipping && typeof shipping === 'object') {
    const shipObj = shipping as Record<string, unknown>;
    addrStr = String(shipObj.address || shipObj.street || '');
    cityStr = cityStr || String(shipObj.city || '');
  }

  return {
    id: String(raw.orderId || raw.id || `AFN-${Math.floor(10000 + Math.random() * 90000)}`),
    orderId: String(raw.orderId || raw.id || ''),
    userId: typeof raw.userId === 'string' ? raw.userId : '',
    customerName: String(raw.customerName || raw.name || 'Customer'),
    email: typeof raw.customerEmail === 'string' ? raw.customerEmail : (typeof raw.email === 'string' ? raw.email : ''),
    phone: String(raw.customerPhone || raw.phone || ''),
    city: cityStr || 'Bangalore',
    address: addrStr,
    items: itemsStr,
    itemsDetail: Array.isArray(raw.itemsDetail) ? raw.itemsDetail : (Array.isArray(raw.items) ? raw.items : []),
    subtotal: Number(raw.subtotal ?? raw.total ?? 0),
    deliveryFee: Number(raw.deliveryFee ?? 0),
    total: Number(raw.total ?? raw.totalAmount ?? 0),
    totalAmount: Number(raw.totalAmount ?? raw.total ?? 0),
    paymentMethod: String(raw.paymentMethod || 'Cash on Delivery (WhatsApp)'),
    date: String(raw.date || raw.created_at || 'Recent'),
    status: (raw.status as AdminOrder['status']) || 'Pending WhatsApp',
    created_at: typeof raw.created_at === 'string' ? raw.created_at : (typeof raw.date === 'string' ? raw.date : undefined)
  };
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

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

  // Fetch all live customer orders from MongoDB database (newest first on top)
  const fetchOrders = async () => {
    try {
      const res = await apiFetch('/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.orders)) {
          const normalized = data.orders.map(normalizeOrder);
          const sorted = normalized.sort((a: AdminOrder, b: AdminOrder) => parseOrderTime(b) - parseOrderTime(a));
          setOrders(sorted);
        }
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeNewOrder = (orderInput: Partial<AdminOrder> & { customerName: string; phone: string; city: string; address: string; items: string; total: number }): AdminOrder => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newOrder: AdminOrder = {
      id: orderInput.id || `AFN-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: orderInput.userId,
      customerName: orderInput.customerName.trim(),
      email: orderInput.email?.trim() || '',
      phone: orderInput.phone.trim(),
      city: orderInput.city.trim(),
      address: orderInput.address.trim(),
      state: orderInput.state?.trim() || 'Karnataka',
      pincode: orderInput.pincode?.trim() || '',
      items: orderInput.items,
      itemsDetail: orderInput.itemsDetail || [],
      subtotal: orderInput.subtotal || orderInput.total,
      deliveryFee: orderInput.deliveryFee || 0,
      total: orderInput.total,
      paymentMethod: orderInput.paymentMethod || 'UPI',
      status: orderInput.status || 'Pending WhatsApp',
      date: orderInput.date || formattedDate,
      created_at: orderInput.created_at || now.toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send to MongoDB Backend API
    apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(newOrder)
    }).catch(() => {});

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: AdminOrder['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );

    // Send to MongoDB Backend API
    apiFetch(`/orders/${orderId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    }).catch(() => {});
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));

    // Send to MongoDB Backend API
    apiFetch(`/orders/${orderId}`, {
      method: 'DELETE'
    }).catch(() => {});
  };

  const resetOrdersToDefault = () => {
    fetchOrders();
  };

  const clearAllOrders = () => {
    setOrders([]);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeNewOrder,
        updateOrderStatus,
        deleteOrder,
        resetOrdersToDefault,
        clearAllOrders
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}
