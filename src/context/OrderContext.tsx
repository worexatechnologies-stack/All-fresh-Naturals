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
          const sorted = data.orders.sort((a: AdminOrder, b: AdminOrder) => parseOrderTime(b) - parseOrderTime(a));
          setOrders(sorted);
        }
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    fetchOrders();
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
