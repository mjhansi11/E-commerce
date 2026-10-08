# ✦ NJ MALL — The Grand Luxury Arcade

> An interactive, high-aesthetic luxury e-commerce experience crafted with tactile micro-interactions, Indian Rupee (₹) pricing, Web Audio API soundscapes, and an admin-authenticated product management system.

[![Live Status](https://img.shields.io/badge/Status-Live%20Local-gold)](#quick-start)
[![Pricing](https://img.shields.io/badge/Currency-INR%20(₹)-emerald)](#indian-rupee-pricing)
[![Admin](https://img.shields.io/badge/Admin-Passcode%20Protected-orange)](#admin-portal)
[![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-blue)](#tech-stack)

---

## 🏛️ Overview

**NJ Mall** is a bespoke, client-side e-commerce web application featuring curated artifacts, living ceramics, kinetic sculptures, designer gadgets, and luxury fragrances. 

Built with an obsidian-gold visual identity, it delivers seamless customer shopping flows combined with a password-protected **Admin Portal** allowing administrators to publish and manage products in real time.

---

## ✨ Key Features

### 👑 Bespoke "NJ" Monogram Branding & Aesthetic
- Handcrafted vector SVG emblem featuring an interlocking **N & J** monogram in a faceted imperial gold crest.
- Obsidian dark-luxe color system (`#08090d`, `#e0b955`, `#f5b041`) with glassmorphic cards, blurred modal backdrops, and animated marquee announcement ticker.

### 🇮🇳 Indian Rupee (₹) Pricing & Pan-India Deliveries
- All base catalog products are priced in **Indian Rupees (INR ₹)** with standard Indian numbering formatting (e.g., `₹19,999`, `₹1,49,999`).
- **Free Delivery Meter**: Dynamic progress bar toward the **₹2,999** complimentary insured express courier threshold.
- **Multi-Currency Switcher**: Real-time conversion between `INR (₹)`, `USD ($)`, `EUR (€)`, and `GBP (£)`.
- **Checkout Simulator**: Pan-India address fields, PIN code validation, and mock UPI/Card processing.

### 🔐 Admin-Only "Add Product" & Catalog Management
- **Security Gateway**: Click **"Admin Portal"** in the navigation bar to log in.
- **Admin Passcode**: `admin123` (or `njadmin`).
- **When Authenticated as Admin**:
  - An **Admin Status Bar** lights up at the top.
  - The **`+ Add New Product`** button becomes active.
  - An administrative **Delete (✕)** button appears on every product card.
- **Dynamic Product Creation**:
  - Upload/assign product names, categories, prices in ₹, stock counts, badges, and craft stories.
  - **1-Click Photo Presets**: Quick-select presets for Watches, Hi-Fi Audio, Gadgets, Apothecary, and Art.
  - Newly added products persist in the browser's `localStorage` and immediately show up in customer search, filtering, and bag flows.

### 🎧 Procedural Web Audio Soundscapes
- Built with the native **Web Audio API** — no external `.mp3` or `.wav` files needed!
- **Tactile Wooden Tick**: On buttons, tabs, and filters.
- **Ethereal Pentatonic Chime**: Triggered when adding items to the bag.
- **Harmonic Major-9th Chord**: Celebratory acoustic resonance on checkout completion.
- Includes a live soundwave animation button in the header with mute/unmute capabilities.

### 🛍️ Customer Interactive Micro-Interactions
- **3D Card Hover Tilt**: Cards track mouse position with real-time perspective rotations (`perspective(1000px) rotateX/rotateY`).
- **Quick View Modal**: Multi-photo gallery thumbnail preview with tabbed information (*The Story*, *Specifications*, *Provenance & Care*).
- **Slide-Over Bag Drawer**: Quantity steppers, line-item removal, and coupon codes:
  - `NJ10`: 10% Welcome Privilege
  - `NJVIP`: 20% VIP Member Privilege
  - `FESTIVE`: 15% Festive Celebration
- **Confetti Canvas Burst**: Procedural multi-colored particle physics on HTML5 `<canvas>` upon successful acquisition.
- **Wishlist Sanctuary**: Heart any product to store in personal favorites with live badge counters.
- **Instant Search & Category Filters**: Live search by name, department, or keyword without page reloads.

---

## 📂 Project Structure

```
aetheria-atelier/
├── index.html        # Semantic HTML5 layout, SVG logo, modals, drawer, canvas
├── styles.css        # Luxury design system, glassmorphism, 3D tilts, animations
├── products.js       # Curated inventory, INR base prices, custom product loader
├── app.js            # State engine, Web Audio synth, Admin portal, Cart & Confetti
└── README.md         # Documentation & guide
```

---

## 🚀 Quick Start

### Option 1: Open Directly in Browser
Double-click [`index.html`](file:///C:/Users/mjhan/.gemini/antigravity/scratch/aetheria-atelier/index.html) or right-click and choose **Open with Chrome / Edge / Firefox**.

### Option 2: Run via Local Server (Recommended)
Using Python:
```bash
cd "C:\Users\mjhan\.gemini\antigravity\scratch\aetheria-atelier"
python -m http.server 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in your web browser.

---

## 🔑 Admin Credentials & Shortcuts

| Action | Details |
| :--- | :--- |
| **Admin Portal Access** | Click the **"Admin Portal"** button in the header navigation |
| **Admin Passcode** | **`admin123`** *(alternative: `njadmin`)* |
| **Add Product** | Click **`+ Add New Product`** in the admin status bar |
| **Delete Product** | Click the red **✕** button on any product card in admin mode |
| **Log Out** | Click **"Log Out Admin"** in the top status bar |

---

## 🏷️ Available Coupon Codes

Test coupon codes inside the Shopping Bag drawer:

- `NJ10` — **10% Off** your entire order
- `NJVIP` — **20% Off** VIP special discount
- `FESTIVE` — **15% Off** festive celebration code

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags, accessible modals, responsive layouts.
- **CSS3**: Custom properties (variables), Flexbox, CSS Grid, 3D transforms, glassmorphic filters (`backdrop-filter`).
- **JavaScript (ES6+)**: Modular application controller, reactive state, event delegation, `localStorage` persistence.
- **Web Audio API**: Real-time waveform synthesis for tactile sound design.
- **HTML5 Canvas**: Lightweight particle animation system for checkout celebration.

---

## 📄 License & Credits

Crafted for **NJ MALL**. All visual identities and curated product concepts are prepared for demonstration and luxury e-commerce prototyping.
