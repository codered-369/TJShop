# Tejaswini Selective Fabrics & Boutique 👗✨

Welcome to the **Tejaswini Boutique** web platform! This is a modern, high-performance, full-stack E-Commerce and Inventory Management application built specifically for a premium fabric and saree boutique. 

It features a stunning storefront for customers to browse categories, view trending products, and easily place orders via a seamless WhatsApp integration. It also includes a fully secured Admin Dashboard to manage inventory, customer orders, categories, and reviews.

## 🚀 Features

### For Customers (Storefront)
- **Cinematic Splash Screen:** A beautiful, responsive, session-based video splash screen (full-screen on desktop, sleek circular floating badge on mobile) that welcomes users to the boutique.
- **Dynamic Product Browsing:** View handpicked collections, filter products by categories, and check real-time stock status.
- **WhatsApp Checkout Integration:** Seamlessly order products directly through WhatsApp. The platform automatically drafts a detailed message to the boutique owner.
- **Out of Stock Management:** Automatically prevents ordering when stock hits 0, allowing users to instantly send a restock inquiry via WhatsApp instead.
- **Customer Reviews:** A dedicated section displaying verified customer testimonials and star ratings.

### For Admins (Secure Dashboard)
- **Supabase Authentication:** Secure, authenticated dashboard access locked down with Row Level Security (RLS).
- **Inventory Management:** Full CRUD (Create, Read, Update, Delete) capabilities for Products and Categories. Features a custom image uploader with Supabase Storage.
- **Order Generation:** A dedicated point-of-sale style order generator to log WhatsApp sales, automatically deduct stock from the database, and generate invoice IDs.
- **Native Web Share API:** Instantly share beautifully formatted order confirmations and invoices back to customers via WhatsApp or other messaging apps directly from the dashboard.
- **Review Moderation:** Easily manage and delete customer reviews.
- **Modern UI/UX:** Pill-shaped action buttons, custom warning modals (instead of browser alerts), and mobile-optimized tables.

## 🛠️ Technology Stack

- **Frontend:** [Next.js (App Router)](https://nextjs.org/), React, TypeScript, Vanilla CSS Modules
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Storage:** Supabase Storage buckets (for product and category images)
- **Authentication:** Supabase Auth with strict Row Level Security (RLS) policies
- **Deployment:** Vercel

## 📦 Local Development Setup

To run this project locally, follow these steps:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd tj-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Supabase Setup
You will need to configure the following in your Supabase project:
- **Tables:** `products`, `categories`, `orders`, `reviews`.
- **Storage Buckets:** Create a **public** bucket named `product-images`.
- **Auth & RLS:** Enable Email authentication and set up Row Level Security policies allowing public `SELECT` access and authenticated `INSERT/UPDATE/DELETE` access.

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the storefront, and `http://localhost:3000/admin` to access the dashboard.

## 🎨 Design Philosophy
The UI was meticulously designed to evoke a premium, luxurious feel ("Elegance in Every Thread"). It uses sophisticated typography (Playfair Display for headings), subtle animations, glassmorphism elements in the navigation, and a refined maroon & cream color palette suitable for a high-end fabric boutique.
