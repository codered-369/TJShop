"use client";
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { supabase } from '@/lib/supabaseClient';

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  stock: number;
  image: string;
}

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  product_name: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
}

export default function AdminDemo() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({ id: '', name: '', price: '', category: 'Sarees', stock: 0, image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [orderForm, setOrderForm] = useState({ customerName: '' });
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: string]: number }>({});
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryForm, setCategoryForm] = useState({ name: '' });
  const [categoryImageFile, setCategoryImageFile] = useState<File | null>(null);

  // Custom Notifications
  const [toast, setToast] = useState({ message: '', type: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const updateQuantity = (id: string, delta: number, maxStock: number) => {
    setSelectedQuantities(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      if (next > maxStock) return prev;
      return { ...prev, [id]: next };
    });
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    if (error) console.error("Error fetching products:", error);
    setIsLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) setOrders(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
    if (data) setCategories(data);
  };

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*');
    if (data) setReviews(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchCategories();
    fetchReviews();
  }, []);

  const lowStockCount = products.filter(p => p.stock < 5 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + (parseFloat(p.price) * p.stock), 0);

  const confirmDelete = (id: string) => setDeleteConfirmId(id);

  const executeDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', deleteConfirmId);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== deleteConfirmId));
      showToast("Product deleted successfully.");
    } catch (error: any) {
      showToast("Error deleting: " + error.message, "error");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setImageFile(null); // Reset file selection
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ id: '', name: '', price: '', category: 'Sarees', stock: 10, image: '' });
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      let finalImageUrl = formData.image;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        finalImageUrl = publicUrl;
      }

      const productPayload = {
        name: formData.name,
        price: formData.price.toString(),
        category: formData.category,
        stock: formData.stock,
        image: finalImageUrl,
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productPayload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productPayload]);
        if (error) throw error;
      }

      await fetchProducts();
      setIsModalOpen(false);
      showToast("Product saved successfully!");
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedIds = Object.keys(selectedQuantities);
    if (selectedIds.length === 0) {
      showToast("Please select at least one product sold.", "error");
      return;
    }

    const orderDetails = selectedIds.map(id => {
      const p = products.find(prod => prod.id === id);
      return `${p?.name} (x${selectedQuantities[id]})`;
    }).join(', ');
    
    const generatedId = `TJ-${Math.floor(1000 + Math.random() * 9000)}`;

    const { error } = await supabase.from('orders').insert([{
      order_id: generatedId,
      customer_name: orderForm.customerName,
      product_name: orderDetails
    }]);

    if (error) {
      showToast("Error creating order: " + error.message, "error");
      return;
    }

    for (const id of selectedIds) {
      const p = products.find(prod => prod.id === id);
      if (p) {
        const newStock = Math.max(0, p.stock - selectedQuantities[id]);
        await supabase.from('products').update({ stock: newStock }).eq('id', id);
      }
    }

    showToast(`Order created! Sent to customer: ${generatedId}`);
    setOrderForm({ customerName: '' });
    setSelectedQuantities({});
    fetchOrders();
    fetchProducts();
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryImageFile) {
      showToast("Please select a category image.", "error");
      return;
    }
    setIsSaving(true);
    try {
      const fileExt = categoryImageFile.name.split('.').pop();
      const fileName = `cat_${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, categoryImageFile);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);

      const { error } = await supabase.from('categories').insert([{ name: categoryForm.name, image: publicUrl }]);
      if (error) throw error;

      showToast("Category created successfully!");
      setCategoryForm({ name: '' });
      setCategoryImageFile(null);
      fetchCategories();
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Delete this category?")) {
      try {
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) throw error;
        fetchCategories();
        showToast("Category deleted.");
      } catch(err:any) {
        showToast(err.message, "error");
      }
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Toast Notification */}
      {toast.message && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 99999, background: toast.type === 'success' ? '#28a745' : '#dc3545', color: '#fff', padding: '1rem 2rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', fontWeight: 500 }}>
          {toast.message}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className={styles.modalOverlay} style={{ zIndex: 99998 }}>
          <div className={styles.modal} style={{ maxWidth: '400px', textAlign: 'center', padding: '3rem 2rem' }}>
            <h2 style={{ marginBottom: '1rem', color: '#dc3545', fontSize: '1.5rem' }}>Delete Product?</h2>
            <p style={{ color: '#666', marginBottom: '2rem', lineHeight: '1.5' }}>Are you sure you want to permanently delete this item? This action cannot be undone.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirmId(null)} className={styles.cancelBtn}>Cancel</button>
              <button onClick={executeDelete} className={styles.saveBtn} style={{ background: '#dc3545' }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src="/logo.jpg" alt="Tejaswini Logo" className={styles.adminLogoImg} />
          Tejaswini Admin
        </div>
        <div className={`${styles.navItem} ${activeTab === 'Dashboard' ? styles.active : ''}`} onClick={() => setActiveTab('Dashboard')}>Dashboard</div>
        <div className={`${styles.navItem} ${activeTab === 'Products' ? styles.active : ''}`} onClick={() => setActiveTab('Products')}>Products</div>
        <div className={`${styles.navItem} ${activeTab === 'Orders' ? styles.active : ''}`} onClick={() => setActiveTab('Orders')}>Orders</div>
        <div className={`${styles.navItem} ${activeTab === 'Categories' ? styles.active : ''}`} onClick={() => setActiveTab('Categories')}>Categories</div>
        <div className={`${styles.navItem} ${activeTab === 'Settings' ? styles.active : ''}`} onClick={() => setActiveTab('Settings')}>Settings</div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        
        {activeTab === 'Dashboard' && (
          <div>
            <h1 className={styles.pageTitle} style={{marginBottom: '2rem'}}>Welcome back, Tejaswini!</h1>
            <div className={styles.statsGrid}>
               <div className={styles.statCard}>
                 <div className={styles.statValue}>₹{isLoading ? '...' : totalInventoryValue.toLocaleString('en-IN')}</div>
                 <div className={styles.statLabel}>Total Inventory Value</div>
               </div>
               <div className={styles.statCard}>
                 <div className={styles.statValue}>{isLoading ? '...' : products.length}</div>
                 <div className={styles.statLabel}>Total Products Listed</div>
               </div>
               <div className={styles.statCard}>
                 <div className={styles.statValue} style={{ color: outOfStockCount > 0 ? '#dc3545' : 'inherit' }}>{isLoading ? '...' : outOfStockCount}</div>
                 <div className={styles.statLabel}>Out of Stock Items</div>
               </div>
            </div>
             <div className={styles.statsGrid} style={{ marginTop: '2rem' }}>
               <div className={styles.statCard} style={{ background: '#fdfbf7', border: '1px solid #eee' }}>
                 <div className={styles.statValue} style={{ color: 'var(--color-primary)' }}>{isLoading ? '...' : orders.length}</div>
                 <div className={styles.statLabel}>Total Orders Logged</div>
               </div>
               <div className={styles.statCard} style={{ background: '#fdfbf7', border: '1px solid #eee' }}>
                 <div className={styles.statValue} style={{ color: '#28a745' }}>{isLoading ? '...' : reviews.length}</div>
                 <div className={styles.statLabel}>Verified Reviews</div>
               </div>
               <div className={styles.statCard} style={{ background: '#fdfbf7', border: '1px solid #eee' }}>
                 <div className={styles.statValue} style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: '#333' }}>Active 🟢</div>
                 <div className={styles.statLabel}>Live Visitor Traffic</div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'Products' && (
          <>
            <div className={styles.header}>
              <h1 className={styles.pageTitle}>Product Management</h1>
              <button className={styles.addButton} onClick={handleAdd}>+ Add New Product</button>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{isLoading ? '...' : products.length}</div>
                <div className={styles.statLabel}>Total Products</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{isLoading ? '...' : lowStockCount}</div>
                <div className={styles.statLabel}>Low Stock Items</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>4</div>
                <div className={styles.statLabel}>Active Categories</div>
              </div>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>Loading from Database...</td>
                    </tr>
                  ) : products.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '3rem' }}>No products found. Add one above!</td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div className={styles.productCell}>
                            <img src={product.image} alt="" className={styles.productThumb} />
                            {product.name}
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td>₹{product.price}</td>
                        <td>
                          <span style={{ color: product.stock < 5 ? '#dc3545' : '#28a745', fontWeight: 500 }}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td>
                          <button className={styles.actionBtn} onClick={() => handleEdit(product)}>Edit</button>
                          <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => confirmDelete(product.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'Orders' && (
          <div>
            <div className={styles.header}>
              <h1 className={styles.pageTitle}>WhatsApp Orders</h1>
            </div>

            <div className={styles.tableContainer} style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Log New WhatsApp Sale</h3>
              <form onSubmit={handleCreateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                  <label>Customer Name</label>
                  <input type="text" required className={styles.input} value={orderForm.customerName} onChange={e => setOrderForm({...orderForm, customerName: e.target.value})} placeholder="e.g. Priya Sharma" />
                </div>
                
                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                  <label>Select Products Sold</label>
                  <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #ddd', padding: '1rem', borderRadius: '6px', background: '#fafafa' }}>
                    {products.map(p => (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', paddingBottom: '0.8rem', borderBottom: '1px solid #eee' }}>
                        <div style={{ flex: 1, paddingRight: '1rem' }}>
                          <div style={{ fontWeight: 500 }}>{p.name}</div>
                          <div style={{ color: p.stock === 0 ? '#dc3545' : '#666', fontSize: '0.85rem' }}>
                            {p.stock === 0 ? 'Out of Stock' : `${p.stock} in stock`}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', padding: '0.2rem' }}>
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(p.id, -1, p.stock)}
                            disabled={!selectedQuantities[p.id]}
                            style={{ width: '28px', height: '28px', border: 'none', background: !selectedQuantities[p.id] ? '#f5f5f5' : '#851C2C', color: !selectedQuantities[p.id] ? '#ccc' : '#fff', borderRadius: '4px', cursor: !selectedQuantities[p.id] ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                          >
                            -
                          </button>
                          <span style={{ width: '20px', textAlign: 'center', fontWeight: 600 }}>
                            {selectedQuantities[p.id] || 0}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => updateQuantity(p.id, 1, p.stock)}
                            disabled={p.stock === 0 || (selectedQuantities[p.id] || 0) >= p.stock}
                            style={{ width: '28px', height: '28px', border: 'none', background: p.stock === 0 || (selectedQuantities[p.id] || 0) >= p.stock ? '#f5f5f5' : '#851C2C', color: p.stock === 0 || (selectedQuantities[p.id] || 0) >= p.stock ? '#ccc' : '#fff', borderRadius: '4px', cursor: p.stock === 0 || (selectedQuantities[p.id] || 0) >= p.stock ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className={styles.saveBtn} style={{ padding: '1rem 2rem', alignSelf: 'flex-start' }}>Generate Order ID & Decrement Stock</button>
              </form>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Date Logged</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>No orders logged yet.</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{order.order_id}</td>
                        <td>{order.customer_name}</td>
                        <td>{order.product_name}</td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Categories' && (
          <div>
            <div className={styles.header}>
              <h1 className={styles.pageTitle}>Manage Categories</h1>
            </div>

            <div className={styles.tableContainer} style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)' }}>Add New Category</h3>
              <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className={styles.formGroup} style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                  <label>Category Name</label>
                  <input type="text" required className={styles.input} value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} placeholder="e.g. Sarees" />
                </div>
                <div className={styles.formGroup} style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                  <label>Thumbnail Image</label>
                  <input type="file" accept="image/*" required className={styles.input} onChange={e => { if(e.target.files) setCategoryImageFile(e.target.files[0]) }} style={{ padding: '0.5rem' }} />
                </div>
                <button type="submit" className={styles.saveBtn} style={{ padding: '0.8rem 2rem' }} disabled={isSaving}>
                  {isSaving ? 'Uploading...' : 'Save Category'}
                </button>
              </form>
            </div>

            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead><tr><th>Thumbnail</th><th>Category Name</th><th>Actions</th></tr></thead>
                <tbody>
                  {categories.length === 0 ? (
                    <tr><td colSpan={3} style={{ textAlign: 'center', padding: '2rem' }}>No categories created yet.</td></tr>
                  ) : (
                    categories.map(cat => (
                      <tr key={cat.id}>
                        <td><img src={cat.image} alt={cat.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /></td>
                        <td style={{ fontWeight: 600 }}>{cat.name}</td>
                        <td>
                          <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDeleteCategory(cat.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'Settings' && (
          <div>
            <h1 className={styles.pageTitle} style={{marginBottom: '2rem'}}>Store Settings</h1>
            <div className={styles.tableContainer} style={{padding: '3rem'}}>
              <div className={styles.formGroup}>
                <label>Store Name</label>
                <input type="text" className={styles.input} defaultValue="Tejaswini Selective Fabrics" />
              </div>
              <div className={styles.formGroup}>
                <label>WhatsApp Number (For receiving orders)</label>
                <input type="text" className={styles.input} defaultValue="+91 94835 00835" />
              </div>
              <div className={styles.formGroup}>
                <label>Store Physical Address</label>
                <input type="text" className={styles.input} defaultValue="Shop No. 12, Main Market Street" />
              </div>
              <button className={styles.saveBtn} onClick={() => alert('Settings saved successfully!')}>Save Changes</button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Products */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2 className={styles.modalTitle}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSave}>
              <div className={styles.formGroup}>
                <label>Product Name</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={styles.input} />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Price (₹)</label>
                  <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Stock</label>
                  <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value) || 0})} className={styles.input} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={styles.input}>
                  <option value="">Select a Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Product Image</label>
                <div className={styles.uploadBox}>
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className={styles.uploadPreview} />
                  ) : (
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
                  )}
                  <div className={styles.uploadText}>Click to upload from Camera/Gallery</div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className={styles.uploadInput} 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setFormData({...formData, image: URL.createObjectURL(e.target.files[0])});
                      }
                    }} 
                  />
                </div>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</button>
                <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
