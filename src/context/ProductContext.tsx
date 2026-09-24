import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { defaultProducts, normalizeProduct, type Product } from '../data/products';
import { apiFetch } from '../config/api';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  resetProductsToDefault: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const CACHE_KEY = 'afn_products_cache_v8';
const DELETED_KEY = 'afn_deleted_product_ids';

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(normalizeProduct);
        }
      }
    } catch (e) {
      console.warn('Could not read cached products:', e);
    }
    return defaultProducts.map(normalizeProduct);
  });
  const [_loading, setLoading] = useState<boolean>(true);

  // Sync to local cache whenever products state changes
  const saveProductsToLocal = (newProds: Product[]) => {
    const normalized = newProds.map(normalizeProduct);
    setProducts(normalized);
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(normalized));
    } catch (e) {
      console.warn('Could not save products cache to localStorage:', e);
    }
  };

  // Fetch all products live from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await apiFetch('/products');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          let deletedIds: string[] = [];
          try {
            const rawDel = localStorage.getItem(DELETED_KEY);
            if (rawDel) deletedIds = JSON.parse(rawDel) || [];
          } catch {}

          // Filter out explicitly deleted products
          const filtered = data.products.filter((p: Product) =>
            !deletedIds.includes(p.id) &&
            !deletedIds.includes(p.id.replace('_', '-')) &&
            !deletedIds.includes(p.id.replace('-', '_'))
          );

          // Map images to valid bundled asset URLs
          const mappedApiProds: Product[] = filtered.map(normalizeProduct);

          // Ensure default products like Ragi Malt exist unless explicitly deleted
          const merged = [...mappedApiProds];
          defaultProducts.map(normalizeProduct).forEach((dp) => {
            const existsInMerged = merged.some(
              (p) => p.id === dp.id || p.id.replace('-', '_') === dp.id.replace('-', '_')
            );
            const isDeleted = deletedIds.some(
              (did) => did === dp.id || did.replace('-', '_') === dp.id.replace('-', '_')
            );
            if (!existsInMerged && !isDeleted) {
              merged.push(dp);
            }
          });

          if (merged.length > 0) {
            saveProductsToLocal(merged);
          }
        } else {
          // Fallback to defaultProducts if API returns empty array
          let deletedIds: string[] = [];
          try {
            const rawDel = localStorage.getItem(DELETED_KEY);
            if (rawDel) deletedIds = JSON.parse(rawDel) || [];
          } catch {}
          const availableDefaults = defaultProducts.filter(
            (dp) => !deletedIds.includes(dp.id)
          ).map(normalizeProduct);
          if (availableDefaults.length > 0) {
            saveProductsToLocal(availableDefaults);
          }
        }
      }
    } catch (err) {
      console.warn('Could not reach backend API, keeping local product catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = async (prodData: Omit<Product, 'id'>): Promise<Product> => {
    const tempId = `prod_${Date.now()}`;
    const newProduct: Product = { ...prodData, id: tempId };

    // Optimistic UI update + local storage
    const updated = [newProduct, ...products];
    saveProductsToLocal(updated);

    try {
      const token = localStorage.getItem('afn_admin_token');
      const res = await apiFetch('/products', {
        method: 'POST',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(newProduct)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          const finalProds = updated.map((p) => (p.id === tempId ? data.product : p));
          saveProductsToLocal(finalProds);
          return data.product;
        }
      }
    } catch (err) {
      console.warn('Could not sync created product to database, kept locally:', err);
    }
    return newProduct;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>): Promise<void> => {
    // 1. Immediate UI update + local storage
    const updated = products.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
    saveProductsToLocal(updated);

    // 2. Sync to Backend Database
    try {
      const token = localStorage.getItem('afn_admin_token');
      const res = await apiFetch(`/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(updatedFields)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.product) {
          const synced = updated.map((p) => (p.id === id ? { ...p, ...data.product } : p));
          saveProductsToLocal(synced);
        }
      }
    } catch (err) {
      console.warn('Could not sync updated product to database, kept locally:', err);
    }
  };

  const deleteProduct = async (id: string): Promise<void> => {
    // 1. Immediate UI update + local storage
    const updated = products.filter((p) => p.id !== id);
    saveProductsToLocal(updated);

    // Track deleted IDs in localStorage so fetchProducts won't re-add it
    try {
      const rawDel = localStorage.getItem(DELETED_KEY);
      const deletedIds: string[] = rawDel ? JSON.parse(rawDel) || [] : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem(DELETED_KEY, JSON.stringify(deletedIds));
      }
    } catch (e) {
      console.warn('Could not save deleted ID:', e);
    }

    // 2. Sync to Backend Database
    try {
      const token = localStorage.getItem('afn_admin_token');
      await apiFetch(`/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        }
      });
    } catch (err) {
      console.warn('Could not sync deleted product to database, removed locally:', err);
    }
  };

  const resetProductsToDefault = async () => {
    try {
      localStorage.removeItem(DELETED_KEY);
      localStorage.removeItem(CACHE_KEY);
    } catch {}
    saveProductsToLocal(defaultProducts);
    await fetchProducts();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
