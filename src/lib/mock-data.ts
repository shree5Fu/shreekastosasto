import type { Product, Profile, Order, OrderItem } from './supabase'

export const mockProducts: Product[] = [
  {
    id: 'prod-001',
    name: 'Mechanical Keyboard Pro',
    price: 189.99,
    image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    description: 'Premium mechanical keyboard with hot-swappable switches, RGB backlighting, and aircraft-grade aluminum frame. Perfect for developers and writers who demand precision.',
    features: ['Hot-swappable switches', 'RGB backlighting', 'Aluminum frame', 'USB-C connection', 'N-key rollover'],
    rating: 4.9,
    stock: 45,
    seller_id: null,
    badge: 'Premium Release'
  },
  {
    id: 'prod-002',
    name: 'Ergonomic Monitor Stand',
    price: 129.99,
    image_url: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=60',
    category: 'Desk Setup',
    description: 'Adjustable monitor stand crafted from sustainable bamboo. Features built-in cable management and storage drawer for a clean, organized workspace.',
    features: ['Sustainable bamboo', 'Cable management', 'Storage drawer', 'Adjustable height', 'Holds up to 50lbs'],
    rating: 4.7,
    stock: 120,
    seller_id: null,
    badge: 'FSC-certified'
  },
  {
    id: 'prod-003',
    name: 'Wireless Mouse Elite',
    price: 99.99,
    image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    description: 'Ultra-precise wireless mouse with 16000 DPI sensor, ergonomic design, and 60-hour battery life. Designed for professionals who value comfort and accuracy.',
    features: ['16000 DPI sensor', '60-hour battery', 'Ergonomic design', 'Bluetooth & 2.4GHz', 'Programmable buttons'],
    rating: 4.8,
    stock: 78,
    seller_id: null
  },
  {
    id: 'prod-004',
    name: 'Desk Lamp Aurora',
    price: 79.99,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=60',
    category: 'Desk Setup',
    description: 'Smart LED desk lamp with adjustable color temperature, brightness levels, and ambient lighting modes. Eye-care technology reduces strain during long work sessions.',
    features: ['Adjustable color temp', 'Eye-care technology', 'Touch controls', 'USB charging port', 'Memory function'],
    rating: 4.6,
    stock: 200,
    seller_id: null
  },
  {
    id: 'prod-005',
    name: 'USB-C Hub Pro',
    price: 69.99,
    image_url: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    description: '12-in-1 USB-C hub with dual HDMI, SD card slots, ethernet, and 100W power delivery. The ultimate connectivity solution for modern creators.',
    features: ['12-in-1 ports', 'Dual HDMI 4K', '100W PD charging', 'Gigabit ethernet', 'SD/MicroSD slots'],
    rating: 4.5,
    stock: 150,
    seller_id: null
  },
  {
    id: 'prod-006',
    name: 'Desk Mat Premium',
    price: 49.99,
    image_url: 'https://images.unsplash.com/photo-1616628188859-7a11abb6fcc9?w=800&auto=format&fit=crop&q=60',
    category: 'Desk Setup',
    description: 'Extra-large desk mat made from premium vegan leather. Water-resistant, anti-slip base, and reversible design in two colors.',
    features: ['Vegan leather', 'Water-resistant', 'Anti-slip base', 'Reversible design', '35" x 17" size'],
    rating: 4.7,
    stock: 300,
    seller_id: null
  },
  {
    id: 'prod-007',
    name: 'Webcam 4K Pro',
    price: 159.99,
    image_url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    description: '4K webcam with auto-focus, HDR, and AI-powered framing. Built-in noise-canceling microphone for crystal-clear video calls.',
    features: ['4K resolution', 'Auto-focus HDR', 'AI framing', 'Noise-canceling mic', 'Privacy shutter'],
    rating: 4.8,
    stock: 65,
    seller_id: null,
    badge: 'Best Seller'
  },
  {
    id: 'prod-008',
    name: 'Cable Organizer Set',
    price: 29.99,
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60',
    category: 'Lifestyle',
    description: 'Complete cable management solution including clips, sleeves, and ties. Keep your workspace tidy and cables tangle-free.',
    features: ['20-piece set', 'Reusable clips', 'Velcro ties', 'Cable sleeves', 'Mounting adhesive'],
    rating: 4.4,
    stock: 500,
    seller_id: null
  },
  {
    id: 'prod-009',
    name: 'Headphone Stand',
    price: 45.99,
    image_url: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&auto=format&fit=crop&q=60',
    category: 'Desk Setup',
    description: 'Minimalist headphone stand with built-in USB hub and cable holder. Solid aluminum construction with soft silicone padding.',
    features: ['Aluminum construction', 'Built-in USB hub', 'Cable holder', 'Silicone padding', 'Weighted base'],
    rating: 4.6,
    stock: 180,
    seller_id: null
  },
  {
    id: 'prod-010',
    name: 'Portable SSD 2TB',
    price: 199.99,
    image_url: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    description: 'Ultra-fast portable SSD with 2TB capacity and 1050MB/s read speeds. Compact, durable design with hardware encryption.',
    features: ['2TB capacity', '1050MB/s speed', 'Hardware encryption', 'Drop-resistant', 'USB 3.2 Gen 2'],
    rating: 4.9,
    stock: 90,
    seller_id: null,
    badge: 'Premium Release'
  },
  {
    id: 'prod-011',
    name: 'Desk Plant Set',
    price: 39.99,
    image_url: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&auto=format&fit=crop&q=60',
    category: 'Lifestyle',
    description: 'Set of 3 low-maintenance desk plants in minimalist ceramic pots. Perfect for adding life to your workspace without the hassle.',
    features: ['3 plant set', 'Ceramic pots', 'Low maintenance', 'Air purifying', 'Care guide included'],
    rating: 4.5,
    stock: 75,
    seller_id: null
  },
  {
    id: 'prod-012',
    name: 'Noise Canceling Headphones',
    price: 279.99,
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
    category: 'Electronics',
    description: 'Premium wireless headphones with adaptive noise canceling, 30-hour battery, and Hi-Res audio certification. Immerse yourself in your work.',
    features: ['Adaptive ANC', '30-hour battery', 'Hi-Res audio', 'Multipoint connection', 'Premium ear cushions'],
    rating: 4.9,
    stock: 55,
    seller_id: null,
    badge: 'Best Seller'
  }
]

// Local storage keys
const STORAGE_KEYS = {
  PRODUCTS: 'shreesasto_products',
  ORDERS: 'shreesasto_orders',
  ORDER_ITEMS: 'shreesasto_order_items',
  PROFILES: 'shreesasto_profiles',
  USERS: 'shreesasto_users',
  SESSION: 'shreesasto_session'
}

// Initialize mock data in localStorage
export function initializeMockData() {
  if (typeof window === 'undefined') return
  
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(mockProducts))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDER_ITEMS)) {
    localStorage.setItem(STORAGE_KEYS.ORDER_ITEMS, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFILES)) {
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify([]))
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([]))
  }
}

// Mock data operations
export const mockDataService = {
  // Products
  getProducts: (): Product[] => {
    if (typeof window === 'undefined') return mockProducts
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    return data ? JSON.parse(data) : mockProducts
  },
  
  getProduct: (id: string): Product | null => {
    const products = mockDataService.getProducts()
    return products.find(p => p.id === id) || null
  },
  
  getProductsByCategory: (category: string): Product[] => {
    const products = mockDataService.getProducts()
    if (category === 'All') return products
    return products.filter(p => p.category === category)
  },
  
  getProductsBySeller: (sellerId: string): Product[] => {
    const products = mockDataService.getProducts()
    return products.filter(p => p.seller_id === sellerId)
  },
  
  addProduct: (product: Product): Product => {
    const products = mockDataService.getProducts()
    products.push(product)
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
    return product
  },
  
  updateProduct: (id: string, updates: Partial<Product>): Product | null => {
    const products = mockDataService.getProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null
    products[index] = { ...products[index], ...updates }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
    return products[index]
  },
  
  updateStock: (id: string, quantity: number): boolean => {
    const products = mockDataService.getProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return false
    products[index].stock = Math.max(0, products[index].stock - quantity)
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
    return true
  },
  
  // Orders
  getOrders: (): Order[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS)
    return data ? JSON.parse(data) : []
  },
  
  getOrdersBySellerProducts: (sellerId: string): (Order & { items: (OrderItem & { product: Product | null })[] })[] => {
    const orders = mockDataService.getOrders()
    const orderItems = mockDataService.getOrderItems()
    const products = mockDataService.getProducts()
    const sellerProducts = products.filter(p => p.seller_id === sellerId)
    const sellerProductIds = sellerProducts.map(p => p.id)
    
    return orders.map(order => {
      const items = orderItems
        .filter(item => item.order_id === order.id && sellerProductIds.includes(item.product_id || ''))
        .map(item => ({
          ...item,
          product: products.find(p => p.id === item.product_id) || null
        }))
      return { ...order, items }
    }).filter(order => order.items.length > 0)
  },
  
  createOrder: (order: Omit<Order, 'id' | 'created_at'>): Order => {
    const orders = mockDataService.getOrders()
    const newOrder: Order = {
      ...order,
      id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    }
    orders.push(newOrder)
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
    return newOrder
  },
  
  updateOrderStatus: (orderId: string, status: string): boolean => {
    const orders = mockDataService.getOrders()
    const index = orders.findIndex(o => o.id === orderId)
    if (index === -1) return false
    orders[index].status = status
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
    return true
  },
  
  // Order Items
  getOrderItems: (): OrderItem[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.ORDER_ITEMS)
    return data ? JSON.parse(data) : []
  },
  
  addOrderItems: (items: Omit<OrderItem, 'id'>[]): OrderItem[] => {
    const orderItems = mockDataService.getOrderItems()
    const newItems = items.map((item, index) => ({
      ...item,
      id: Date.now() + index
    }))
    orderItems.push(...newItems)
    localStorage.setItem(STORAGE_KEYS.ORDER_ITEMS, JSON.stringify(orderItems))
    return newItems
  },
  
  // Profiles (Sellers)
  getProfiles: (): Profile[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.PROFILES)
    return data ? JSON.parse(data) : []
  },
  
  getProfile: (id: string): Profile | null => {
    const profiles = mockDataService.getProfiles()
    return profiles.find(p => p.id === id) || null
  },
  
  createProfile: (profile: Profile): Profile => {
    const profiles = mockDataService.getProfiles()
    profiles.push(profile)
    localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles))
    return profile
  },
  
  // Mock Users & Auth
  getUsers: (): { id: string; email: string; password: string }[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.USERS)
    return data ? JSON.parse(data) : []
  },
  
  createUser: (email: string, password: string): { id: string; email: string } => {
    const users = mockDataService.getUsers()
    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      email,
      password
    }
    users.push(newUser)
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
    return { id: newUser.id, email: newUser.email }
  },
  
  authenticateUser: (email: string, password: string): { id: string; email: string } | null => {
    const users = mockDataService.getUsers()
    const user = users.find(u => u.email === email && u.password === password)
    return user ? { id: user.id, email: user.email } : null
  },
  
  getSession: (): { id: string; email: string } | null => {
    if (typeof window === 'undefined') return null
    const data = localStorage.getItem(STORAGE_KEYS.SESSION)
    return data ? JSON.parse(data) : null
  },
  
  setSession: (user: { id: string; email: string } | null): void => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.SESSION)
    }
    // Dispatch custom event for auth state changes
    window.dispatchEvent(new CustomEvent('shreesasto_auth_change', { detail: user }))
  }
}
