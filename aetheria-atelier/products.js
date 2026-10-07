// NJ MALL - Curated Luxury Arcade Products
// Base prices are set in Indian Rupees (INR ₹)

const INITIAL_PRODUCTS = [
  {
    id: "nj-01",
    name: "The Celestial Gyroscope",
    category: "electronics",
    categoryLabel: "Kinetic & Gadgets",
    priceINR: 19999,
    tag: "Numbered 1/75",
    badge: "Bestseller",
    rating: 4.95,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80"
    ],
    tagline: "Silent frictionless harmonic rotation for executive spaces.",
    story: "Machined from naval grade brass and balanced on silicon nitride ceramic bearings. Spuns effortlessly for 40 minutes in silent equilibrium.",
    specs: {
      "Materials": "Naval Brass, Ceramic Bearings, Walnut Plinth",
      "Dimensions": "180mm × 180mm × 210mm",
      "Weight": "1.42 kg",
      "Warranty": "2 Year International Coverage",
      "Dispatch": "Ships within 24 Hours from NJ Mall Hub"
    },
    inStock: 7
  },
  {
    id: "nj-02",
    name: "Nocturne Obsidian Tea Vessel",
    category: "living",
    categoryLabel: "Living Ceramics",
    priceINR: 12499,
    tag: "Wood-Fired",
    badge: "24k Gold Seam",
    rating: 4.98,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80"
    ],
    tagline: "Hand-thrown volcanic stoneware with 24-karat gold kintsugi river.",
    story: "Fired over 96 hours at 1300°C. Each vessel develops natural ash flashes, sealed with authentic 24k Japanese gold leaf.",
    specs: {
      "Materials": "Volcanic Stoneware Clay, 24k Gold Kintsugi",
      "Volume": "420 ml",
      "Thermal Profile": "Dual-wall heat containment",
      "Finish": "Matte Satin Charcoal",
      "Origin": "Kyoto Studio Master Collection"
    },
    inStock: 4
  },
  {
    id: "nj-03",
    name: "Lumina Alabaster Resonance Lamp",
    category: "ambient",
    categoryLabel: "Ambient Lighting",
    priceINR: 24999,
    tag: "Hand-Carved",
    badge: "Touch Sensing",
    rating: 5.0,
    reviewsCount: 29,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80"
    ],
    tagline: "Natural Spanish alabaster sphere with candle-warm rhythmic light breath.",
    story: "Carved from raw translucent alabaster boulder with capacitive dimming and rhythmic breathing pulse mode to restore calm.",
    specs: {
      "Materials": "Spanish Alabaster, Anodized Bronze Stem",
      "Color Temp": "2200K Sunset Amber Glow",
      "Battery Life": "24 hrs Cordless / Fast Type-C charging",
      "Sensors": "Capacitive touch dimming"
    },
    inStock: 9
  },
  {
    id: "nj-04",
    name: "Extrait Botanique No. VII — Petrichor & Hinoki",
    category: "fragrance",
    categoryLabel: "Luxury Fragrance",
    priceINR: 8999,
    tag: "Pure Extrait",
    badge: "Collector Edition",
    rating: 4.89,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=80"
    ],
    tagline: "Essence of morning dew, rain on warm stone, and ancient cedar groves.",
    story: "Distilled in microscopic batches using copper alembics. 32% parfum concentration preserved in violet ultraviolet-blocking glass.",
    specs: {
      "Volume": "50 ml / 1.7 fl oz",
      "Concentration": "Parfum Pure Extract (32%)",
      "Notes": "Wet Stone, Japanese Hinoki, Geosmin, Peat",
      "Vessel": "Violet Miron Glass Flask"
    },
    inStock: 15
  },
  {
    id: "nj-05",
    name: "The Chronos Magnetic Hourglass",
    category: "electronics",
    categoryLabel: "Kinetic & Gadgets",
    priceINR: 14499,
    tag: "Black Iron Sand",
    badge: "Magnetic Array",
    rating: 4.92,
    reviewsCount: 41,
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80"
    ],
    tagline: "Black volcanic iron sand blooming into crystalline spires as time slips.",
    story: "Hand-blown borosilicate glass with rare-earth magnetic base creating organic stalagmite formations as sand trickles.",
    specs: {
      "Materials": "Borosilicate Glass, Iron Micro-Particles, Teak Base",
      "Flow Time": "Exactly 15 Minutes",
      "Height": "240mm (9.4 inches)",
      "Core": "N52 Grade Neodymium Array"
    },
    inStock: 11
  },
  {
    id: "nj-06",
    name: "Zenith Faceted Titanium Fountain Pen",
    category: "fashion",
    categoryLabel: "Accessories & Writing",
    priceINR: 16999,
    tag: "Grade 5 Titanium",
    badge: "Iridium Tip",
    rating: 4.97,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1000&q=80"
    ],
    tagline: "Turned from aerospace titanium with German precision nib.",
    story: "Precision octagonal facets prevent table rolls. Hand-tuned German iridium flex nib delivers seamless ink delivery.",
    specs: {
      "Material": "Solid Grade 5 TC4 Titanium",
      "Nib": "Bock German #6 Semi-Flex with Iridium Tip",
      "Weight": "48g Counter-Balanced",
      "Includes": "Full Grain Leather Sheath"
    },
    inStock: 6
  },
  {
    id: "nj-07",
    name: "Elysian Brutalist Incense Crucible",
    category: "living",
    categoryLabel: "Living Ceramics",
    priceINR: 7499,
    tag: "Basalt Concrete",
    badge: "Patinated Bronze",
    rating: 4.88,
    reviewsCount: 47,
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=1000&q=80"
    ],
    tagline: "Architectural basalt concrete disc with floating bronze cascade shelf.",
    story: "Inspired by sacred geometry. Charcoal pigmented basalt concrete disc with floating bronze ash collector disc.",
    specs: {
      "Materials": "Dark Basalt Concrete, Jeweler Bronze",
      "Dimensions": "220mm Diameter × 35mm Profile",
      "Compatibility": "Japanese stick, Tibetan, or incense cones"
    },
    inStock: 18
  },
  {
    id: "nj-08",
    name: "Aura Prismatic Crystal Chime",
    category: "ambient",
    categoryLabel: "Ambient Lighting",
    priceINR: 9999,
    tag: "Optical Crystal",
    badge: "Solfeggio 528Hz",
    rating: 4.96,
    reviewsCount: 26,
    image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80"
    ],
    tagline: "Optical crystal prism projecting rainbows with harmonic acoustic chime.",
    story: "Suspends precision tuned aluminum rods tuned to 528Hz. Projects dancing spectrums across rooms in the sunlight.",
    specs: {
      "Tuning": "528 Hz Harmonic Transformation Tone",
      "Prism": "K9 Optical Grade Lead-Free Faceted Crystal",
      "Chimes": "Tempered Aerospace Aluminum"
    },
    inStock: 8
  }
];

// Helper to get all products including admin custom additions
function getStoredProducts() {
  const custom = JSON.parse(localStorage.getItem('nj_custom_products') || '[]');
  const deletedIds = JSON.parse(localStorage.getItem('nj_deleted_ids') || '[]');
  const base = INITIAL_PRODUCTS.filter(p => !deletedIds.includes(p.id));
  return [...custom, ...base];
}

const CURRENCIES = {
  INR: { symbol: "₹", rate: 1.0, label: "INR (₹) India", locale: "en-IN" },
  USD: { symbol: "$", rate: 0.012, label: "USD ($)", locale: "en-US" },
  EUR: { symbol: "€", rate: 0.011, label: "EUR (€)", locale: "de-DE" },
  GBP: { symbol: "£", rate: 0.0094, label: "GBP (£)", locale: "en-GB" }
};

const PROMO_CODES = {
  "NJ10": { discount: 0.10, desc: "10% NJ Mall Welcome Privilege" },
  "NJVIP": { discount: 0.20, desc: "20% NJ Mall VIP Member Privilege" },
  "FESTIVE": { discount: 0.15, desc: "15% Grand Festive Celebration" }
};
