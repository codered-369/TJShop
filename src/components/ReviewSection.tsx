"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import styles from './ReviewSection.module.css';

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
}

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ orderId: '', name: '', rating: 5, comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchReviews = async () => {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (data) setReviews(data);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      const { error } = await supabase.from('reviews').insert([{
        order_id: formData.orderId,
        customer_name: formData.name,
        rating: formData.rating,
        comment: formData.comment
      }]);

      if (error) {
        if (error.code === '23503') { 
          throw new Error("Invalid Order ID. We only accept reviews from verified purchasers!");
        }
        throw error;
      }

      setMessage({ text: "Thank you! Your verified review has been submitted successfully.", type: 'success' });
      setFormData({ orderId: '', name: '', rating: 5, comment: '' });
      fetchReviews();
      setTimeout(() => { setShowForm(false); setMessage({ text: '', type: '' }); }, 3000);
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={styles.testimonialGrid}>
        {reviews.length === 0 && (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#666', padding: '2rem' }}>No reviews yet. Be the first to leave one!</div>
        )}
        {reviews.map((r) => (
          <div key={r.id} className={styles.testimonialCard}>
            <div className={styles.stars}>{'⭐'.repeat(r.rating)}</div>
            <p className={styles.quote}>"{r.comment}"</p>
            <h4 className={styles.customerName}>- {r.customer_name} <span style={{fontSize:'0.8rem', color:'#28a745', marginLeft:'5px'}}>✓ Verified</span></h4>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center' }}>
        {!showForm ? (
          <button onClick={() => setShowForm(true)} style={{ padding: '1rem 3rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Write a Verified Review
          </button>
        ) : (
          <div className={styles.addReviewContainer}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', fontFamily: 'var(--font-playfair)', fontSize: '1.8rem' }}>Leave a Verified Review</h3>
            {message.text && (
              <div style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '6px', background: message.type === 'success' ? '#d4edda' : '#f8d7da', color: message.type === 'success' ? '#155724' : '#721c24' }}>
                {message.text}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Order ID (Required for verification)</label>
                <input type="text" required placeholder="e.g. TJ-5891" className={styles.input} value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Your Name</label>
                <input type="text" required placeholder="Priya Sharma" className={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Rating</label>
                <select className={styles.input} value={formData.rating} onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}>
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Fair</option>
                  <option value={1}>1 Star - Poor</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Your Review</label>
                <textarea required rows={4} placeholder="I absolutely loved the fabric..." className={styles.input} value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})}></textarea>
              </div>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Verifying Order...' : 'Submit Review'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', color: '#666', marginTop: '1rem', cursor: 'pointer', width: '100%' }}>Cancel</button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
