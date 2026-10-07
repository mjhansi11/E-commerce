// NJ MALL - Interactive Arcade & Admin Management System
// Base prices rendered in Indian Rupees (INR ₹) with admin product authoring.

(function () {
  'use strict';

  // --- AUDIO SYNTHESIZER (Web Audio API) ---
  class SoundManager {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.initOnFirstInteraction = this.initOnFirstInteraction.bind(this);
      window.addEventListener('click', this.initOnFirstInteraction, { once: true });
      window.addEventListener('keydown', this.initOnFirstInteraction, { once: true });
    }

    initContext() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    initOnFirstInteraction() {
      this.initContext();
    }

    toggle() {
      this.enabled = !this.enabled;
      if (this.enabled) this.initContext();
      return this.enabled;
    }

    playTick() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const now = this.ctx.currentTime;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(850, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } catch (e) {}
    }

    playChime() {
      if (!this.enabled || !this.ctx) return;
      try {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        const now = this.ctx.currentTime;

        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startTime = now + idx * 0.045;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.09, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.7);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.75);
        });
      } catch (e) {}
    }

    playHarmonicSuccess() {
      if (!this.enabled || !this.ctx) return;
      try {
        const chord = [261.63, 329.63, 392.00, 493.88, 587.33];
        const now = this.ctx.currentTime;

        chord.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const startTime = now + idx * 0.06;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, startTime);

          gain.gain.setValueAtTime(0.12, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 1.9);
        });
      } catch (e) {}
    }
  }

  // --- CONFETTI PARTICLE SYSTEM ---
  class ConfettiCanvas {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.animId = null;
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }

    burst() {
      this.particles = [];
      const colors = ['#e0b955', '#f5b041', '#10b981', '#ffffff', '#ffd700', '#6366f1'];
      const count = 120;

      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          vx: (Math.random() - 0.5) * 16,
          vy: (Math.random() - 0.5) * 16 - 4,
          size: Math.random() * 6 + 3,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 12,
          alpha: 1,
          decay: Math.random() * 0.015 + 0.008
        });
      }

      if (this.animId) cancelAnimationFrame(this.animId);
      this.animate();
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      let alive = false;
      for (let p of this.particles) {
        if (p.alpha <= 0) continue;
        alive = true;

        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;
        p.alpha -= p.decay;

        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.globalAlpha = Math.max(0, p.alpha);
        this.ctx.fillStyle = p.color;

        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size);
        this.ctx.lineTo(p.size * 0.7, 0);
        this.ctx.lineTo(0, p.size);
        this.ctx.lineTo(-p.size * 0.7, 0);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
      }

      if (alive) {
        this.animId = requestAnimationFrame(() => this.animate());
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
  }

  // --- STATE ---
  const state = {
    cart: JSON.parse(localStorage.getItem('nj_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('nj_wishlist') || '[]'),
    currency: localStorage.getItem('nj_currency') || 'INR', // Default Indian Rupees
    category: 'all',
    searchQuery: '',
    sortBy: 'featured',
    appliedPromo: null,
    quickViewItem: null,
    isAdmin: localStorage.getItem('nj_is_admin') === 'true'
  };

  const sound = new SoundManager();
  let confetti = null;

  // --- HELPERS ---
  function saveState() {
    localStorage.setItem('nj_cart', JSON.stringify(state.cart));
    localStorage.setItem('nj_wishlist', JSON.stringify(state.wishlist));
    localStorage.setItem('nj_currency', state.currency);
    localStorage.setItem('nj_is_admin', state.isAdmin ? 'true' : 'false');
  }

  // Indian Rupee & Multi-currency Formatter
  function formatPrice(inrAmount) {
    const curr = CURRENCIES[state.currency] || CURRENCIES.INR;
    const converted = inrAmount * curr.rate;

    if (state.currency === 'INR') {
      // Standard Indian Rupee numbering format (Lakhs/Crores)
      return '₹' + Math.round(converted).toLocaleString('en-IN');
    } else {
      return `${curr.symbol}${converted.toLocaleString(curr.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  }

  function getCartItemCount() {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  }

  function getCartSubtotalINR() {
    const allProducts = getStoredProducts();
    return state.cart.reduce((total, item) => {
      const prod = allProducts.find(p => p.id === item.id);
      return total + (prod ? prod.priceINR * item.quantity : 0);
    }, 0);
  }

  function showToast(title, message, icon = '✦') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-bubble';
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Dismiss">&times;</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
      }
    }, 4200);
  }

  // --- DOM RENDERING ---

  // 1. Render Products Grid
  function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const allProducts = getStoredProducts();

    let filtered = allProducts.filter(p => {
      const matchesCat = state.category === 'all' || p.category === state.category;
      const matchesSearch =
        p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    // Sort
    if (state.sortBy === 'price-asc') {
      filtered.sort((a, b) => a.priceINR - b.priceINR);
    } else if (state.sortBy === 'price-desc') {
      filtered.sort((a, b) => b.priceINR - a.priceINR);
    } else if (state.sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">✧</div>
          <h3>No matching items in NJ Mall</h3>
          <p>No products match "${state.searchQuery}". Clear your search to explore all departments.</p>
          <button class="btn btn-secondary mt-3" id="reset-filter-btn">View All Collections</button>
        </div>
      `;
      const resetBtn = document.getElementById('reset-filter-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          state.category = 'all';
          state.searchQuery = '';
          const searchInput = document.getElementById('catalog-search-input');
          if (searchInput) searchInput.value = '';
          updateCategoryTabs();
          renderProducts();
        });
      }
      return;
    }

    grid.innerHTML = filtered.map(product => {
      const isWishlisted = state.wishlist.includes(product.id);
      return `
        <article class="product-card" data-id="${product.id}">
          <div class="card-inner">
            <div class="card-image-wrap">
              <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy" />
              <div class="card-badges">
                <span class="badge badge-accent">${product.badge}</span>
                <span class="badge badge-subtle">${product.tag}</span>
              </div>

              <!-- Admin Delete Button -->
              <button class="card-admin-delete-btn" data-id="${product.id}" title="Admin: Delete Product" aria-label="Delete Product">
                &times;
              </button>

              <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-id="${product.id}" title="${isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}" aria-label="Wishlist">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? '#f5b041' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
              <div class="card-quick-actions">
                <button class="btn-quick-view" data-id="${product.id}">
                  <span>✧ Quick View</span>
                </button>
              </div>
            </div>
            <div class="card-content">
              <div class="product-meta">
                <span class="product-cat">${product.categoryLabel}</span>
                <span class="product-rating">★ ${product.rating} <span class="rating-count">(${product.reviewsCount})</span></span>
              </div>
              <h3 class="product-title" data-id="${product.id}">${product.name}</h3>
              <p class="product-tagline">${product.tagline}</p>
              <div class="card-footer">
                <div class="price-wrap">
                  <span class="product-price">${formatPrice(product.priceINR)}</span>
                  <span class="stock-note">In Stock: ${product.inStock} units</span>
                </div>
                <button class="btn btn-primary add-to-bag-btn" data-id="${product.id}">
                  <span>Add to Bag</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/>
                    <path d="M16 10a4 4 0 0 1-8 0"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </article>
      `;
    }).join('');

    attachCardInteractions();
  }

  // Card 3D tilt and event bindings
  function attachCardInteractions() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });

      const qvBtn = card.querySelector('.btn-quick-view');
      const title = card.querySelector('.product-title');
      const prodId = card.getAttribute('data-id');

      if (qvBtn) {
        qvBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          sound.playTick();
          openQuickView(prodId);
        });
      }

      if (title) {
        title.addEventListener('click', () => {
          sound.playTick();
          openQuickView(prodId);
        });
      }

      const addBtn = card.querySelector('.add-to-bag-btn');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          addToCart(prodId, 1, addBtn);
        });
      }

      const wishBtn = card.querySelector('.wishlist-btn');
      if (wishBtn) {
        wishBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleWishlist(prodId);
        });
      }

      // Admin delete button handler
      const adminDelBtn = card.querySelector('.card-admin-delete-btn');
      if (adminDelBtn) {
        adminDelBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteProductByAdmin(prodId);
        });
      }
    });
  }

  // --- ADMIN FUNCTIONALITY ---
  function updateAdminUI() {
    const adminStatusBar = document.getElementById('admin-status-bar');
    const adminGateBtn = document.getElementById('btn-admin-gate');
    const adminAddProductBtn = document.getElementById('admin-add-product-btn');
    const grid = document.getElementById('products-grid');

    if (state.isAdmin) {
      if (adminStatusBar) adminStatusBar.classList.add('active');
      if (adminGateBtn) {
        adminGateBtn.classList.add('logged-in');
        adminGateBtn.innerHTML = `<span>👑 Admin Mode</span>`;
      }
      if (adminAddProductBtn) adminAddProductBtn.classList.add('visible');
      if (grid) grid.classList.add('admin-mode-active');
      document.body.classList.add('admin-mode-active');
    } else {
      if (adminStatusBar) adminStatusBar.classList.remove('active');
      if (adminGateBtn) {
        adminGateBtn.classList.remove('logged-in');
        adminGateBtn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg><span>Admin Portal</span>`;
      }
      if (adminAddProductBtn) adminAddProductBtn.classList.remove('visible');
      if (grid) grid.classList.remove('admin-mode-active');
      document.body.classList.remove('admin-mode-active');
    }
  }

  function openAdminLoginModal() {
    sound.playTick();
    const modal = document.getElementById('admin-login-modal');
    if (modal) {
      modal.classList.add('open');
      const passInput = document.getElementById('admin-pass-input');
      if (passInput) {
        passInput.value = '';
        passInput.focus();
      }
    }
  }

  function closeAdminLoginModal() {
    const modal = document.getElementById('admin-login-modal');
    if (modal) modal.classList.remove('open');
  }

  function handleAdminLogin(e) {
    e.preventDefault();
    const passInput = document.getElementById('admin-pass-input');
    const pass = passInput ? passInput.value.trim() : '';

    // Standard Passcode: admin123 or njadmin
    if (pass === 'admin123' || pass === 'njadmin' || pass === 'njmall') {
      sound.playHarmonicSuccess();
      state.isAdmin = true;
      saveState();
      updateAdminUI();
      closeAdminLoginModal();
      showToast('Admin Authenticated', 'Welcome, Master Administrator! You can now Add & Manage products in NJ Mall.', '👑');
      renderProducts();
    } else {
      sound.playTick();
      showToast('Access Denied', 'Incorrect admin passcode. Try: admin123', '✕');
      if (passInput) passInput.focus();
    }
  }

  function adminLogout() {
    sound.playTick();
    state.isAdmin = false;
    saveState();
    updateAdminUI();
    renderProducts();
    showToast('Admin Logged Out', 'Switched back to standard customer browsing view.');
  }

  function openAddProductModal() {
    if (!state.isAdmin) {
      openAdminLoginModal();
      return;
    }
    sound.playTick();
    const modal = document.getElementById('add-product-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeAddProductModal() {
    const modal = document.getElementById('add-product-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function handleAddNewProduct(e) {
    e.preventDefault();
    if (!state.isAdmin) return;

    const name = document.getElementById('prod-name').value.trim();
    const category = document.getElementById('prod-category').value;
    const priceINR = parseFloat(document.getElementById('prod-price').value);
    const badge = document.getElementById('prod-badge').value.trim() || 'New Arrival';
    const tag = document.getElementById('prod-tag').value.trim() || 'NJ Mall Curated';
    const image = document.getElementById('prod-image').value.trim();
    const tagline = document.getElementById('prod-tagline').value.trim();
    const story = document.getElementById('prod-story').value.trim() || 'Artisanal product curated for NJ Mall.';
    const stock = parseInt(document.getElementById('prod-stock').value, 10) || 10;

    const categoryLabels = {
      electronics: "Kinetic & Gadgets",
      living: "Living Ceramics",
      ambient: "Ambient Lighting",
      fragrance: "Luxury Fragrance",
      fashion: "Accessories & Writing"
    };

    const newProduct = {
      id: 'nj-custom-' + Date.now(),
      name,
      category,
      categoryLabel: categoryLabels[category] || "Curated Edition",
      priceINR,
      tag,
      badge,
      rating: 5.0,
      reviewsCount: 1,
      image: image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
      gallery: [image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"],
      tagline,
      story,
      specs: {
        "Origin": "Curated for NJ Mall",
        "Availability": "Immediate Dispatch",
        "Quality": "Certified Luxury Grade"
      },
      inStock: stock
    };

    // Save to localStorage
    const customList = JSON.parse(localStorage.getItem('nj_custom_products') || '[]');
    customList.unshift(newProduct);
    localStorage.setItem('nj_custom_products', JSON.stringify(customList));

    sound.playHarmonicSuccess();
    if (confetti) confetti.burst();

    closeAddProductModal();
    document.getElementById('add-product-form').reset();

    showToast('Product Added!', `"${name}" is now live on NJ Mall at ${formatPrice(priceINR)}.`, '✨');
    renderProducts();

    // Scroll to products
    const col = document.getElementById('collection');
    if (col) col.scrollIntoView({ behavior: 'smooth' });
  }

  function deleteProductByAdmin(prodId) {
    if (!state.isAdmin) return;

    const allProducts = getStoredProducts();
    const prod = allProducts.find(p => p.id === prodId);
    const prodName = prod ? prod.name : 'Product';

    if (confirm(`Admin Confirmation: Are you sure you wish to delete "${prodName}" from NJ Mall?`)) {
      sound.playTick();

      // Check if custom product
      let customList = JSON.parse(localStorage.getItem('nj_custom_products') || '[]');
      const isCustom = customList.some(p => p.id === prodId);

      if (isCustom) {
        customList = customList.filter(p => p.id !== prodId);
        localStorage.setItem('nj_custom_products', JSON.stringify(customList));
      } else {
        // Mark as deleted initial product
        const deletedIds = JSON.parse(localStorage.getItem('nj_deleted_ids') || '[]');
        if (!deletedIds.includes(prodId)) {
          deletedIds.push(prodId);
          localStorage.setItem('nj_deleted_ids', JSON.stringify(deletedIds));
        }
      }

      // Remove from cart if present
      state.cart = state.cart.filter(item => item.id !== prodId);
      state.wishlist = state.wishlist.filter(id => id !== prodId);
      saveState();
      updateBadges();
      renderCartDrawer();
      renderProducts();

      showToast('Product Removed', `"${prodName}" has been removed by Admin.`, '🗑');
    }
  }

  // 2. Wishlist Management
  function toggleWishlist(prodId) {
    sound.playTick();
    const idx = state.wishlist.indexOf(prodId);
    const allProducts = getStoredProducts();
    const product = allProducts.find(p => p.id === prodId);

    if (idx > -1) {
      state.wishlist.splice(idx, 1);
      showToast('Wishlist Updated', `Removed "${product?.name || 'item'}" from your saved artifacts.`);
    } else {
      state.wishlist.push(prodId);
      showToast('Saved to Wishlist', `"${product?.name || 'item'}" is saved in your NJ Mall favorites.`, '♥');
    }

    saveState();
    updateBadges();
    renderProducts();
  }

  // 3. Cart Management
  function addToCart(prodId, quantity = 1, triggerElement = null) {
    sound.playChime();
    const allProducts = getStoredProducts();
    const product = allProducts.find(p => p.id === prodId);
    if (!product) return;

    const existing = state.cart.find(item => item.id === prodId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({ id: prodId, quantity: quantity });
    }

    saveState();
    updateBadges();
    renderCartDrawer();

    if (triggerElement) {
      triggerElement.classList.add('added-pulse');
      setTimeout(() => triggerElement.classList.remove('added-pulse'), 600);
    }

    showToast('Added to Bag', `Added ${quantity}× "${product.name}" to your shopping bag.`, '✦');
    openCartDrawer();
  }

  function updateCartQuantity(prodId, newQty) {
    sound.playTick();
    const allProducts = getStoredProducts();
    if (newQty <= 0) {
      state.cart = state.cart.filter(item => item.id !== prodId);
      const prod = allProducts.find(p => p.id === prodId);
      showToast('Item Removed', `Removed "${prod?.name || 'item'}" from your bag.`);
    } else {
      const item = state.cart.find(i => i.id === prodId);
      if (item) item.quantity = newQty;
    }
    saveState();
    updateBadges();
    renderCartDrawer();
  }

  // 4. Cart Drawer Rendering
  function renderCartDrawer() {
    const container = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const discountEl = document.getElementById('cart-drawer-discount');
    const totalEl = document.getElementById('cart-drawer-total');
    const freeShippingProgress = document.getElementById('free-shipping-progress');
    const freeShippingMsg = document.getElementById('free-shipping-msg');

    if (!container) return;

    const allProducts = getStoredProducts();

    if (state.cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-relic-icon">✧</div>
          <h4>Your NJ Mall bag is empty</h4>
          <p>No luxury artifacts chosen yet. Explore our curated collections to find your next statement piece.</p>
          <button class="btn btn-primary mt-3" id="cart-browse-btn">Explore NJ Mall</button>
        </div>
      `;
      const browseBtn = document.getElementById('cart-browse-btn');
      if (browseBtn) {
        browseBtn.addEventListener('click', () => {
          closeCartDrawer();
          const target = document.getElementById('collection');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
      }

      if (subtotalEl) subtotalEl.textContent = formatPrice(0);
      if (discountEl) discountEl.textContent = `-${formatPrice(0)}`;
      if (totalEl) totalEl.textContent = formatPrice(0);
      if (freeShippingProgress) freeShippingProgress.style.width = '0%';
      if (freeShippingMsg) freeShippingMsg.innerHTML = `Add <strong>${formatPrice(2999)}</strong> more for Free Insured Express Delivery across India.`;
      return;
    }

    container.innerHTML = state.cart.map(item => {
      const prod = allProducts.find(p => p.id === item.id);
      if (!prod) return '';

      const lineTotalINR = prod.priceINR * item.quantity;
      return `
        <div class="cart-item" data-id="${prod.id}">
          <img src="${prod.image}" alt="${prod.name}" class="cart-item-img" />
          <div class="cart-item-details">
            <div class="cart-item-header">
              <h4 class="cart-item-name">${prod.name}</h4>
              <button class="cart-item-remove" data-id="${prod.id}" title="Remove item" aria-label="Remove">
                &times;
              </button>
            </div>
            <div class="cart-item-meta">${prod.categoryLabel} · ${formatPrice(prod.priceINR)} each</div>
            <div class="cart-item-controls">
              <div class="quantity-stepper">
                <button class="qty-btn qty-minus" data-id="${prod.id}">-</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn qty-plus" data-id="${prod.id}">+</button>
              </div>
              <span class="cart-item-price">${formatPrice(lineTotalINR)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    container.querySelectorAll('.qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const itm = state.cart.find(i => i.id === id);
        if (itm) updateCartQuantity(id, itm.quantity - 1);
      });
    });

    container.querySelectorAll('.qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const itm = state.cart.find(i => i.id === id);
        if (itm) updateCartQuantity(id, itm.quantity + 1);
      });
    });

    container.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        updateCartQuantity(id, 0);
      });
    });

    // Subtotal & Math in INR
    const subtotalINR = getCartSubtotalINR();
    let discountINR = 0;
    if (state.appliedPromo) {
      discountINR = subtotalINR * state.appliedPromo.discount;
    }
    const totalINR = Math.max(0, subtotalINR - discountINR);

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotalINR);
    if (discountEl) discountEl.textContent = `-${formatPrice(discountINR)}`;
    if (totalEl) totalEl.textContent = formatPrice(totalINR);

    // Free delivery threshold: ₹2,999
    const thresholdINR = 2999;
    const progressPct = Math.min(100, (subtotalINR / thresholdINR) * 100);
    if (freeShippingProgress) freeShippingProgress.style.width = `${progressPct}%`;

    if (freeShippingMsg) {
      if (subtotalINR >= thresholdINR) {
        freeShippingMsg.innerHTML = `✦ <strong>Free Express Delivery across India</strong> unlocked!`;
      } else {
        const remaining = thresholdINR - subtotalINR;
        freeShippingMsg.innerHTML = `Add <strong>${formatPrice(remaining)}</strong> more to unlock Free Express Delivery across India.`;
      }
    }
  }

  // 5. Drawer & Modal Toggles
  function openCartDrawer() {
    renderCartDrawer();
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // 6. Quick View Modal
  function openQuickView(prodId) {
    const allProducts = getStoredProducts();
    const prod = allProducts.find(p => p.id === prodId);
    if (!prod) return;

    state.quickViewItem = prod;
    const modal = document.getElementById('quickview-modal');
    const content = document.getElementById('quickview-content');
    if (!modal || !content) return;

    let selectedImg = prod.image;
    let selectedQty = 1;

    content.innerHTML = `
      <div class="qv-grid">
        <div class="qv-visuals">
          <div class="qv-main-img-wrap">
            <img src="${selectedImg}" alt="${prod.name}" id="qv-main-img" class="qv-main-img" />
            <div class="card-badges">
              <span class="badge badge-accent">${prod.badge}</span>
              <span class="badge badge-subtle">${prod.tag}</span>
            </div>
          </div>
          <div class="qv-gallery-strip">
            ${prod.gallery.map((img, i) => `
              <img src="${img}" alt="Thumbnail ${i + 1}" class="qv-thumb ${img === selectedImg ? 'active' : ''}" data-src="${img}" />
            `).join('')}
          </div>
        </div>

        <div class="qv-details">
          <div class="qv-header">
            <span class="qv-category">${prod.categoryLabel}</span>
            <h2 class="qv-title">${prod.name}</h2>
            <div class="qv-pricing-row">
              <span class="qv-price">${formatPrice(prod.priceINR)}</span>
              <span class="qv-rating">★ ${prod.rating} · (${prod.reviewsCount} customer reviews)</span>
            </div>
          </div>

          <p class="qv-tagline">${prod.tagline}</p>

          <div class="qv-tabs-nav">
            <button class="qv-tab-btn active" data-tab="story">The Story</button>
            <button class="qv-tab-btn" data-tab="specs">Specifications</button>
            <button class="qv-tab-btn" data-tab="provenance">Provenance & Care</button>
          </div>

          <div class="qv-tabs-content">
            <div class="qv-tab-pane active" id="tab-story">
              <p class="qv-story-text">${prod.story}</p>
            </div>
            <div class="qv-tab-pane" id="tab-specs">
              <dl class="qv-specs-list">
                ${Object.entries(prod.specs || {}).map(([k, v]) => `
                  <div class="qv-spec-row">
                    <dt>${k}</dt>
                    <dd>${v}</dd>
                  </div>
                `).join('')}
              </dl>
            </div>
            <div class="qv-tab-pane" id="tab-provenance">
              <p class="qv-story-text">Directly sourced and inspected by NJ Mall specialists. Includes authentic hologram warranty seal and premium gift presentation packaging.</p>
            </div>
          </div>

          <div class="qv-actions">
            <div class="quantity-stepper large">
              <button class="qty-btn" id="qv-qty-minus">-</button>
              <span class="qty-value" id="qv-qty-val">1</span>
              <button class="qty-btn" id="qv-qty-plus">+</button>
            </div>
            <button class="btn btn-primary btn-large flex-1" id="qv-add-btn">
              <span>Add to Shopping Bag</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          </div>

          <div class="qv-guarantee-strip">
            <div class="guarantee-item">
              <span>✦</span> Verified Authentic by NJ Mall
            </div>
            <div class="guarantee-item">
              <span>✧</span> 30-Day Pan-India Returns
            </div>
          </div>
        </div>
      </div>
    `;

    // Gallery switching
    content.querySelectorAll('.qv-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        sound.playTick();
        content.querySelectorAll('.qv-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        const main = document.getElementById('qv-main-img');
        if (main) main.src = thumb.getAttribute('data-src');
      });
    });

    // Tab switching
    content.querySelectorAll('.qv-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        sound.playTick();
        content.querySelectorAll('.qv-tab-btn').forEach(b => b.classList.remove('active'));
        content.querySelectorAll('.qv-tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = content.querySelector(`#tab-${btn.getAttribute('data-tab')}`);
        if (targetTab) targetTab.classList.add('active');
      });
    });

    // Stepper
    const qvMinus = document.getElementById('qv-qty-minus');
    const qvPlus = document.getElementById('qv-qty-plus');
    const qvVal = document.getElementById('qv-qty-val');

    if (qvMinus && qvPlus && qvVal) {
      qvMinus.addEventListener('click', () => {
        if (selectedQty > 1) {
          sound.playTick();
          selectedQty--;
          qvVal.textContent = selectedQty;
        }
      });
      qvPlus.addEventListener('click', () => {
        sound.playTick();
        selectedQty++;
        qvVal.textContent = selectedQty;
      });
    }

    const qvAddBtn = document.getElementById('qv-add-btn');
    if (qvAddBtn) {
      qvAddBtn.addEventListener('click', () => {
        addToCart(prod.id, selectedQty, qvAddBtn);
        closeQuickView();
      });
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // 7. Checkout Process
  function openCheckoutModal() {
    if (state.cart.length === 0) {
      showToast('Bag is Empty', 'Please select at least one product before proceeding to checkout.');
      return;
    }
    closeCartDrawer();
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    renderCheckoutSummary();
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCheckoutSummary() {
    const summaryList = document.getElementById('checkout-summary-items');
    const subtotalEl = document.getElementById('checkout-subtotal');
    const discountEl = document.getElementById('checkout-discount');
    const shippingEl = document.getElementById('checkout-shipping');
    const totalEl = document.getElementById('checkout-total');

    if (!summaryList) return;

    const allProducts = getStoredProducts();

    summaryList.innerHTML = state.cart.map(item => {
      const prod = allProducts.find(p => p.id === item.id);
      if (!prod) return '';
      return `
        <div class="checkout-summary-row">
          <div class="checkout-item-title">
            <span>${prod.name}</span>
            <span class="text-muted"> × ${item.quantity}</span>
          </div>
          <span class="checkout-item-val">${formatPrice(prod.priceINR * item.quantity)}</span>
        </div>
      `;
    }).join('');

    const subtotalINR = getCartSubtotalINR();
    const discountINR = state.appliedPromo ? subtotalINR * state.appliedPromo.discount : 0;
    const shippingINR = subtotalINR >= 2999 ? 0 : 250;
    const totalINR = Math.max(0, subtotalINR - discountINR + shippingINR);

    if (subtotalEl) subtotalEl.textContent = formatPrice(subtotalINR);
    if (discountEl) discountEl.textContent = `-${formatPrice(discountINR)}`;
    if (shippingEl) shippingEl.textContent = shippingINR === 0 ? 'Free Express Delivery' : formatPrice(shippingINR);
    if (totalEl) totalEl.textContent = formatPrice(totalINR);
  }

  function completeOrder(e) {
    e.preventDefault();
    sound.playHarmonicSuccess();

    if (confetti) {
      confetti.burst();
    }

    const orderNumber = 'NJM-' + Math.floor(100000 + Math.random() * 900000);
    const checkoutContent = document.getElementById('checkout-content-body');

    if (checkoutContent) {
      checkoutContent.innerHTML = `
        <div class="order-success-pane">
          <div class="success-glyph">✦</div>
          <h2 class="success-heading">Order Successfully Confirmed!</h2>
          <p class="order-id-badge">NJ Mall Order ID: <strong>${orderNumber}</strong></p>
          <p class="success-message">
            Thank you for shopping at NJ Mall. Your order has been placed successfully and is being packed with insured security seals at our fulfillment hub. You will receive an SMS and WhatsApp tracking update shortly.
          </p>
          <div class="success-features">
            <div class="feat">
              <span class="feat-icon">⚡</span>
              <span>Express Dispatch</span>
            </div>
            <div class="feat">
              <span class="feat-icon">🛡️</span>
              <span>Transit Insurance</span>
            </div>
            <div class="feat">
              <span class="feat-icon">📦</span>
              <span>NJ Mall Luxury Seal</span>
            </div>
          </div>
          <button class="btn btn-primary btn-large mt-4" id="return-mall-btn">Return to NJ Mall</button>
        </div>
      `;

      const returnBtn = document.getElementById('return-mall-btn');
      if (returnBtn) {
        returnBtn.addEventListener('click', () => {
          closeCheckoutModal();
          setTimeout(() => location.reload(), 300);
        });
      }
    }

    state.cart = [];
    state.appliedPromo = null;
    saveState();
    updateBadges();
    renderCartDrawer();
  }

  // 8. Badges & Counters
  function updateBadges() {
    const bagBadge = document.getElementById('bag-count-badge');
    const wishBadge = document.getElementById('wishlist-count-badge');
    const totalCount = getCartItemCount();

    if (bagBadge) {
      bagBadge.textContent = totalCount;
      bagBadge.style.display = totalCount > 0 ? 'flex' : 'none';
      bagBadge.classList.add('badge-bounce');
      setTimeout(() => bagBadge.classList.remove('badge-bounce'), 400);
    }

    if (wishBadge) {
      wishBadge.textContent = state.wishlist.length;
      wishBadge.style.display = state.wishlist.length > 0 ? 'flex' : 'none';
    }
  }

  function updateCategoryTabs() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
      const cat = tab.getAttribute('data-category');
      if (cat === state.category) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }

  // --- INITIALIZATION ---
  function init() {
    // Canvas confetti
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      confetti = new ConfettiCanvas(canvas);
    }

    // Audio toggle
    const audioBtn = document.getElementById('audio-toggle-btn');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        const isEnabled = sound.toggle();
        audioBtn.classList.toggle('muted', !isEnabled);
        audioBtn.title = isEnabled ? 'Mute ambient soundscapes' : 'Enable ambient soundscapes';
        showToast(isEnabled ? 'Soundscapes On' : 'Soundscapes Off', isEnabled ? 'Tactile resonance enabled.' : 'Muted audio ambience.');
      });
    }

    // Currency selector
    const currencySelect = document.getElementById('currency-selector');
    if (currencySelect) {
      currencySelect.value = state.currency;
      currencySelect.addEventListener('change', (e) => {
        sound.playTick();
        state.currency = e.target.value;
        saveState();
        renderProducts();
        renderCartDrawer();
        showToast('Currency Updated', `Prices switched to ${CURRENCIES[state.currency].label}`);
      });
    }

    // Category filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        sound.playTick();
        state.category = tab.getAttribute('data-category');
        updateCategoryTabs();
        renderProducts();
      });
    });

    // Catalog search
    const searchInput = document.getElementById('catalog-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        renderProducts();
      });
    }

    // Sort selector
    const sortSelect = document.getElementById('sort-selector');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        sound.playTick();
        state.sortBy = e.target.value;
        renderProducts();
      });
    }

    // Cart Drawer triggers
    const bagBtn = document.getElementById('header-bag-btn');
    const closeDrawerBtn = document.getElementById('close-drawer-btn');
    const overlay = document.getElementById('drawer-overlay');

    if (bagBtn) {
      bagBtn.addEventListener('click', () => {
        sound.playTick();
        openCartDrawer();
      });
    }

    if (closeDrawerBtn) {
      closeDrawerBtn.addEventListener('click', () => {
        sound.playTick();
        closeCartDrawer();
      });
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        closeCartDrawer();
        closeQuickView();
        closeCheckoutModal();
        closeAdminLoginModal();
        closeAddProductModal();
      });
    }

    // Quick View close
    const qvCloseBtn = document.getElementById('close-quickview-btn');
    if (qvCloseBtn) {
      qvCloseBtn.addEventListener('click', () => {
        sound.playTick();
        closeQuickView();
      });
    }

    // Checkout modal close
    const checkoutCloseBtn = document.getElementById('close-checkout-btn');
    if (checkoutCloseBtn) {
      checkoutCloseBtn.addEventListener('click', () => {
        sound.playTick();
        closeCheckoutModal();
      });
    }

    // Checkout open trigger
    const checkoutTriggerBtn = document.getElementById('cart-checkout-btn');
    if (checkoutTriggerBtn) {
      checkoutTriggerBtn.addEventListener('click', () => {
        sound.playTick();
        openCheckoutModal();
      });
    }

    // Checkout Form Submit
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', completeOrder);
    }

    // Promo Code
    const promoInput = document.getElementById('promo-code-input');
    const promoApplyBtn = document.getElementById('apply-promo-btn');
    if (promoApplyBtn && promoInput) {
      promoApplyBtn.addEventListener('click', () => {
        sound.playTick();
        const code = promoInput.value.trim().toUpperCase();
        if (PROMO_CODES[code]) {
          state.appliedPromo = PROMO_CODES[code];
          showToast('Coupon Applied!', `${PROMO_CODES[code].desc} activated!`, '✨');
          renderCartDrawer();
          promoInput.value = '';
        } else {
          showToast('Invalid Coupon', 'Coupon code not found. Try NJ10 or NJVIP.', '✕');
        }
      });
    }

    // Wishlist Header Button
    const headerWishBtn = document.getElementById('header-wishlist-btn');
    if (headerWishBtn) {
      headerWishBtn.addEventListener('click', () => {
        sound.playTick();
        if (state.wishlist.length === 0) {
          showToast('Wishlist Empty', 'You have not added any products to your wishlist yet.');
        } else {
          showToast('Wishlist', `Showing your ${state.wishlist.length} saved favorites.`, '♥');
          state.category = 'all';
          updateCategoryTabs();
          renderProducts();
          const target = document.getElementById('collection');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playChime();
        const emailInput = document.getElementById('newsletter-email');
        const email = emailInput ? emailInput.value : '';
        showToast('Subscribed!', `Welcome to NJ Mall VIP Club, ${email}. Use coupon NJ10 for 10% off!`, '✦');
        if (emailInput) emailInput.value = '';
      });
    }

    // ADMIN EVENT LISTENERS
    const adminGateBtn = document.getElementById('btn-admin-gate');
    if (adminGateBtn) {
      adminGateBtn.addEventListener('click', () => {
        if (state.isAdmin) {
          // Open Add Product directly if already admin
          openAddProductModal();
        } else {
          openAdminLoginModal();
        }
      });
    }

    const adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) {
      adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    const closeAdminLoginBtn = document.getElementById('close-admin-login-btn');
    if (closeAdminLoginBtn) {
      closeAdminLoginBtn.addEventListener('click', closeAdminLoginModal);
    }

    const adminLogoutBtn = document.getElementById('admin-logout-btn');
    if (adminLogoutBtn) {
      adminLogoutBtn.addEventListener('click', adminLogout);
    }

    const adminAddProductBtn = document.getElementById('admin-add-product-btn');
    if (adminAddProductBtn) {
      adminAddProductBtn.addEventListener('click', openAddProductModal);
    }

    const closeAddProductBtn = document.getElementById('close-add-product-btn');
    if (closeAddProductBtn) {
      closeAddProductBtn.addEventListener('click', closeAddProductModal);
    }

    const addProductForm = document.getElementById('add-product-form');
    if (addProductForm) {
      addProductForm.addEventListener('submit', handleAddNewProduct);
    }

    // Image preset chips inside Add Product Modal
    document.querySelectorAll('.admin-preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        sound.playTick();
        const url = chip.getAttribute('data-url');
        const imgInput = document.getElementById('prod-image');
        if (imgInput && url) {
          imgInput.value = url;
          showToast('Image Selected', 'Preset photo assigned to new product.');
        }
      });
    });

    // Initial render & sync
    updateAdminUI();
    updateBadges();
    renderProducts();
    renderCartDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
