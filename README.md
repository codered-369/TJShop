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

## 🔒 Proprietary Software

This project is a proprietary application developed specifically for Tejaswini Boutique. It is a commercial product and is not intended for public distribution, cloning, or replication. All rights are reserved by the original creators.

## 🎨 Design Philosophy
The UI was meticulously designed to evoke a premium, luxurious feel ("Elegance in Every Thread"). It uses sophisticated typography (Playfair Display for headings), subtle animations, glassmorphism elements in the navigation, and a refined maroon & cream color palette suitable for a high-end fabric boutique.
