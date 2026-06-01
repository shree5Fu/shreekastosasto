'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Lock, Truck, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'
import { supabase, checkSupabaseConnection } from '@/lib/supabase'
import { mockDataService } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  
  // Shipping info
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [zipCode, setZipCode] = useState('')
  
  // Payment info
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const TAX_RATE = 0.08 // 8%
  const SHIPPING_FEE = 15
  const FREE_SHIPPING_THRESHOLD = 150

  const tax = subtotal * TAX_RATE
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const total = subtotal + tax + shipping

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16)
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  // Format expiry date
  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4)
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2)
    }
    return digits
  }

  // Format CVV
  const formatCVV = (value: string) => {
    return value.replace(/\D/g, '').slice(0, 3)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    setIsLoading(true)

    try {
      const connected = await checkSupabaseConnection()
      
      // Create order data
      const orderData = {
        total,
        shipping_name: fullName,
        shipping_email: email,
        shipping_address: `${address}, ${city}, ${zipCode}`,
        status: 'pending'
      }

      let orderId: string

      if (connected) {
        // Create order in Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert(orderData)
          .select('id')
          .single()

        if (orderError) throw orderError
        orderId = order.id

        // Create order items
        const orderItems = items.map(item => ({
          order_id: orderId,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems)

        if (itemsError) throw itemsError

        // Update stock levels
        for (const item of items) {
          await supabase
            .from('products')
            .update({ stock: item.product.stock - item.quantity })
            .eq('id', item.product.id)
        }
      } else {
        // Use mock data service
        const order = mockDataService.createOrder(orderData)
        orderId = order.id

        // Create order items
        const orderItems = items.map(item => ({
          order_id: orderId,
          product_id: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
        mockDataService.addOrderItems(orderItems)

        // Update stock levels
        for (const item of items) {
          mockDataService.updateStock(item.product.id, item.quantity)
        }
      }

      // Clear cart and redirect to success
      clearCart()
      router.push(`/success?orderId=${orderId}&name=${encodeURIComponent(fullName)}&email=${encodeURIComponent(email)}&address=${encodeURIComponent(`${address}, ${city}, ${zipCode}`)}`)
      
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      toast.error('Failed to process order. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-foreground-muted mb-6">Add some products before checking out.</p>
          <Button asChild className="glow-button">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - Forms */}
            <div className="space-y-8">
              {/* Shipping Information */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Shipping Information</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground">Payment Details</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        required
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground-muted" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiration Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(formatCVV(e.target.value))}
                          required
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-foreground-muted mt-4 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Your payment information is secure and encrypted
                </p>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="glass-card p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Order Summary</h2>

                {/* Cart Items */}
                <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-background-secondary flex-shrink-0">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-foreground-muted">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-foreground">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                {/* Totals */}
                <div className="space-y-3">
                  <div className="flex justify-between text-foreground-secondary">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground-secondary">
                    <span>Sales Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground-secondary">
                    <span className="flex items-center gap-1">
                      Shipping
                      {shipping === 0 && (
                        <span className="text-xs text-emerald-500 flex items-center gap-0.5">
                          <Tag className="h-3 w-3" />
                          FREE
                        </span>
                      )}
                    </span>
                    <span>{shipping === 0 ? '$0.00' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {subtotal < FREE_SHIPPING_THRESHOLD && (
                    <p className="text-xs text-foreground-muted">
                      Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between text-lg font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="gradient-text-primary">${total.toFixed(2)}</span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-6 glow-button text-lg py-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    `Complete Order - $${total.toFixed(2)}`
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
