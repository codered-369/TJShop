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

export default function AdminDemo() {
  const [activeTab, setActiveTab] = useState('Products');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Product>({ id: '', name: '', price: '', category: 'Sarees', stock: 0, image: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) setProducts(data);
    if (error) console.error("Error fetching products:", error);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const lowStockCount = products.filter(p => p.stock < 5 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + (parseFloat(p.price) * p.stock), 0);

  const handleDelete = async (id: string) => {
    if(confirm("Are you sure you want to permanently delete this product?")) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        setProducts(products.filter(p => p.id !== id));
      } catch (error: any) {
        alert("Error deleting: " + error.message);
      }
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

      // 1. Upload image to Supabase Storage if a new file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        // Get public URL
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

      // 2. Save to Supabase Database
      if (editingProduct) {
        const { error } = await supabase.from('products').update(productPayload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productPayload]);
        if (error) throw error;
      }

      // Refresh table
      await fetchProducts();
      setIsModalOpen(false);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <img src="/logo.jpg" alt="Tejaswini Logo" className={styles.adminLogoImg} />
          Tejaswini Admin
        </div>
        <div className={`${styles.navItem} ${activeTab === 'Dashboard' ? styles.active : ''}`} onClick={() => setActiveTab('Dashboard')}>Dashboard</div>
        <div className={`${styles.navItem} ${activeTab === 'Products' ? styles.active : ''}`} onClick={() => setActiveTab('Products')}>Products</div>
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
            <div className={styles.tableContainer} style={{padding: '4rem', textAlign: 'center', color: 'var(--color-text-light)'}}>
               <h3 style={{marginBottom: '1rem', color: 'var(--color-primary)', fontFamily: 'var(--font-playfair)'}}>Advanced Analytics</h3>
               <p>To track "Revenue" and "Store Views", we can connect Vercel Analytics and a Sales Logger in Phase 3!</p>
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
                          <button className={`${styles.actionBtn} ${styles.delete}`} onClick={() => handleDelete(product.id)}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'Categories' && (
          <div>
            <div className={styles.header}>
              <h1 className={styles.pageTitle}>Manage Categories</h1>
              <button className={styles.addButton}>+ Add Category</button>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead><tr><th>Category Name</th><th>Items Count</th><th>Actions</th></tr></thead>
                <tbody>
                  <tr><td>Sarees</td><td>12 active items</td><td><button className={styles.actionBtn}>Edit</button></td></tr>
                  <tr><td>Kurtis</td><td>5 active items</td><td><button className={styles.actionBtn}>Edit</button></td></tr>
                  <tr><td>Lehengas</td><td>2 active items</td><td><button className={styles.actionBtn}>Edit</button></td></tr>
                  <tr><td>Fabrics</td><td>0 active items</td><td><button className={styles.actionBtn}>Edit</button></td></tr>
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
                <input type="text" className={styles.input} defaultValue="+91 99999 99999" />
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
                  <option value="Sarees">Sarees</option>
                  <option value="Kurtis">Kurtis</option>
                  <option value="Lehengas">Lehengas</option>
                  <option value="Fabrics">Fabrics</option>
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
