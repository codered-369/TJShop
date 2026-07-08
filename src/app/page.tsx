import styles from "./page.module.css";

const products = [
  { id: '101', name: 'Crimson Silk Saree', price: '₹4,999', category: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800', badge: 'Bestseller' },
  { id: '102', name: 'Embroidered Anarkali', price: '₹2,499', category: 'Kurtis', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800', badge: 'Just In' },
  { id: '103', name: 'Gold Zari Lehenga', price: '₹12,999', category: 'Lehengas', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800', badge: 'Limited Edition' },
];

const categories = [
  { name: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800' },
  { name: 'Kurtis', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800' },
  { name: 'Lehengas', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=800' },
  { name: 'Fabrics', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=800' },
];

const features = [
  { icon: '✨', title: 'Premium Quality', desc: 'Handpicked authentic fabrics' },
  { icon: '🚚', title: 'Fast Delivery', desc: 'Quick & secure local shipping' },
  { icon: '💬', title: 'Personal Support', desc: 'Easy ordering via WhatsApp' }
];

export default function Home() {
  return (
    <main className={styles.main}>
      <nav className={styles.nav}>
        <div className={styles.logoContainer}>
          <img src="/logo.jpg" alt="Tejaswini Logo" className={styles.navLogo} />
          <span className={styles.logoText}>Tejaswini</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#new-arrivals">New Arrivals</a>
          <a href="#collections">Collections</a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>Elegance in <br/>Every Thread.</h1>
          <p className={styles.subtitle}>
            Discover our handpicked collection of premium sarees and authentic fabrics. Crafted for the woman who owns her elegance.
          </p>
          <a href="#new-arrivals" className={styles.ctaButton}>Find Your Perfect Look</a>
        </div>
      </section>

      <div className={styles.featuresBanner}>
        {features.map((f, i) => (
          <div key={i} className={styles.featureItem}>
            <span className={styles.featureIcon}>{f.icon}</span>
            <h4 className={styles.featureTitle}>{f.title}</h4>
            <p className={styles.featureDesc}>{f.desc}</p>
          </div>
        ))}
      </div>

      <section id="categories" className={styles.section} style={{ backgroundColor: '#fff' }}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <div key={category.name} className={styles.categoryCard}>
              <div className={styles.categoryImageContainer}>
                <img src={category.image} alt={category.name} className={styles.categoryImage} loading="lazy" />
              </div>
              <h3 className={styles.categoryName}>{category.name}</h3>
            </div>
          ))}
        </div>
      </section>

      <section id="new-arrivals" className={styles.section}>
        <h2 className={styles.sectionTitle}>Trending This Week</h2>
        <div className={styles.productGrid}>
          {products.map((product) => {
            const message = `Hi! I'm absolutely in love with the ${product.name} (ID: ${product.id}). Is it still available?`;
            const waLink = `https://wa.me/919999999999?text=${encodeURIComponent(message)}`;
            
            return (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.imageContainer}>
                  <img src={product.image} alt={product.name} className={styles.productImage} loading="lazy" />
                  {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
                </div>
                <div className={styles.productInfo}>
                  <span className={styles.productCategory}>{product.category}</span>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productPrice}>{product.price}</div>
                  <a href={waLink} target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Buy on WhatsApp
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="visit-us" className={styles.storeSection}>
        <div className={styles.storeContainer}>
          <div className={styles.storeInfo}>
            <h2 className={styles.sectionTitle}>Visit Our Boutique</h2>
            <p className={styles.storeDesc}>
              Experience the touch and feel of our premium fabrics in person. We love hosting our online community at our physical store.
            </p>
            <div className={styles.addressBlock}>
              <p><strong>📍 Tejaswini Selective Fabrics</strong></p>
              <p>Shop No. 12, Main Market Street</p>
              <p>City Center, Landmark</p>
              <p>Open: Mon - Sat (10:00 AM - 8:30 PM)</p>
            </div>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className={styles.mapButton}>
              Get Directions
            </a>
          </div>
          <div className={styles.mapContainer}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.893899209598!2d77.60627581482207!3d12.981881690848816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae168759530df5%3A0xe2128cd3179dc8ed!2sCommercial%20Street%2C%20Tasker%20Town%2C%20Shivaji%20Nagar%2C%20Bengaluru%2C%20Karnataka%20560001!5e0!3m2!1sen!2sin!4v1688031234567!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <img src="/logo.jpg" alt="Tejaswini Logo" className={styles.footerLogo} />
            <h2 className={styles.logoText}>Tejaswini</h2>
            <p>Selective Fabrics & Elegance</p>
          </div>
          <div className={styles.footerLinks}>
            <h3>Contact Us</h3>
            <p>📍 Shop No. 12, Main Market Street</p>
            <p>📞 +91 99999 99999</p>
            <p>✉️ hello@tejaswinifabrics.com</p>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; {new Date().getFullYear()} Tejaswini Selective Fabrics. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
