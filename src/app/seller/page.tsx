'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  DollarSign, 
  Package, 
  ShoppingBag, 
  Plus, 
  Loader2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Truck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth-context'
import { supabase, checkSupabaseConnection, type Product, type Order } from '@/lib/supabase'
import { mockDataService, initializeMockData } from '@/lib/mock-data'
import { toast } from 'sonner'

type OrderWithItems = Order & { 
  items: { 
    id: number
    quantity: number
    price: number
    product: Product | null 
  }[] 
}

export default function SellerDashboard() {
  const router = useRouter()
  const { user, isSeller, storeName, isLoading: authLoading } = useAuth()
  
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  
  // New product form
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    features: '',
    image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=60',
    stock: '10'
  })

  useEffect(() => {
    initializeMockData()
    
    if (!authLoading && !user) {
      router.push('/login')
      return
    }
    
    if (!authLoading && user && !isSeller) {
      toast.error('Access denied. Seller account required.')
      router.push('/')
      return
    }
    
    if (user && isSeller) {
      fetchData()
    }
  }, [user, isSeller, authLoading, router])

  const fetchData = async () => {
    setIsLoading(true)
    const connected = await checkSupabaseConnection()

    if (connected && supabase && user) {
      // Fetch seller's products
      const { data: productsData } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
      
      if (productsData) {
        setProducts(productsData)
      }

      // Fetch orders containing seller's products
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            quantity,
            price,
            product_id,
            products (*)
          )
        `)
        .order('created_at', { ascending: false })

      if (ordersData) {
        const sellerOrders = ordersData
          .map(order => ({
            ...order,
            items: order.order_items
              .filter((item: { products: { seller_id: string } | null }) => 
                item.products?.seller_id === user.id
              )
              .map((item: { id: number; quantity: number; price: number; products: Product | null }) => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
                product: item.products
              }))
          }))
          .filter(order => order.items.length > 0)
        
        setOrders(sellerOrders as OrderWithItems[])
      }
    } else if (user) {
      // Use mock data
      const sellerProducts = mockDataService.getProductsBySeller(user.id)
      setProducts(sellerProducts)
      
      const sellerOrders = mockDataService.getOrdersBySellerProducts(user.id)
      setOrders(sellerOrders)
    }

    setIsLoading(false)
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsAddingProduct(true)

    try {
      const productData: Product = {
        id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        image_url: newProduct.image_url,
        category: newProduct.category,
        description: newProduct.description,
        features: newProduct.features.split(',').map(f => f.trim()).filter(Boolean),
        rating: 0,
        stock: parseInt(newProduct.stock) || 0,
        seller_id: user.id
      }

      const connected = await checkSupabaseConnection()

      if (connected && supabase) {
        const { error } = await supabase
          .from('products')
          .insert(productData)

        if (error) throw error
      } else {
        mockDataService.addProduct(productData)
      }

      setProducts([...products, productData])
      setDialogOpen(false)
      setNewProduct({
        name: '',
        price: '',
        category: '',
        description: '',
        features: '',
        image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=60',
        stock: '10'
      })
      toast.success('Product added successfully!')
    } catch (error) {
      console.error('[v0] Add product error:', error)
      toast.error('Failed to add product')
    } finally {
      setIsAddingProduct(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const connected = await checkSupabaseConnection()

      if (connected && supabase) {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId)

        if (error) throw error
      } else {
        mockDataService.updateOrderStatus(orderId, status)
      }

      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ))
      toast.success(`Order status updated to ${status}`)
    } catch (error) {
      console.error('[v0] Update order status error:', error)
      toast.error('Failed to update order status')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'shipped':
        return <Truck className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-500'
      case 'processing':
        return 'bg-blue-500/20 text-blue-500'
      case 'shipped':
        return 'bg-purple-500/20 text-purple-500'
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-500'
      case 'cancelled':
        return 'bg-red-500/20 text-red-500'
      default:
        return 'bg-gray-500/20 text-gray-500'
    }
  }

  // Calculate stats
  const totalEarnings = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => {
      const orderTotal = order.items.reduce((itemSum, item) => 
        itemSum + (item.price * item.quantity), 0
      )
      return sum + orderTotal
    }, 0)
  
  const totalItemsSold = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, order) => {
      return sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
    }, 0)

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-foreground-muted mt-1">
              Welcome back, <span className="text-primary">{storeName}</span>
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="glow-button">
                <Plus className="mr-2 h-4 w-4" />
                Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name</Label>
                  <Input
                    id="productName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Mechanical Keyboard Pro"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="99.99"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                      placeholder="10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newProduct.category} 
                    onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Desk Setup">Desk Setup</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={newProduct.image_url}
                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Product description..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Textarea
                    id="features"
                    value={newProduct.features}
                    onChange={(e) => setNewProduct({ ...newProduct, features: e.target.value })}
                    placeholder="Feature 1, Feature 2, Feature 3"
                    rows={2}
                  />
                </div>

                <Button type="submit" className="w-full glow-button" disabled={isAddingProduct}>
                  {isAddingProduct ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Product'
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Total Earnings</p>
                <p className="text-2xl font-bold text-foreground">${totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Active Listings</p>
                <p className="text-2xl font-bold text-foreground">{products.length}</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-foreground-muted">Items Sold</p>
                <p className="text-2xl font-bold text-foreground">{totalItemsSold}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Your Products</h2>
          
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
              <p className="text-foreground-muted">No products yet. Add your first product!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="p-4 rounded-lg bg-background-secondary">
                  <div className="flex gap-4">
                    <div 
                      className="w-16 h-16 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${product.image_url})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground text-sm line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-foreground-muted">{product.category}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-primary">${product.price.toFixed(2)}</span>
                        <span className="text-xs text-foreground-muted">Stock: {product.stock}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Orders</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
              <p className="text-foreground-muted">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg bg-background-secondary">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="font-mono text-sm text-foreground-muted">
                        Order: {order.id.slice(0, 20)}...
                      </p>
                      <p className="text-xs text-foreground-muted">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">
                          {item.product?.name || 'Unknown Product'} x {item.quantity}
                        </span>
                        <span className="text-foreground-muted">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator className="my-3" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="text-sm">
                      <span className="text-foreground-muted">Customer: </span>
                      <span className="text-foreground">{order.shipping_name}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Select 
                        value={order.status} 
                        onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
