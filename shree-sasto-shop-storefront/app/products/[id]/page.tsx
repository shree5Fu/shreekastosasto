'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Star, ShoppingCart, Package, Shield, Truck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { supabase, checkSupabaseConnection, type Product } from '@/lib/supabase'
import { mockDataService, initializeMockData } from '@/lib/mock-data'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

export default function ProductPage() {
  const params = useParams()
  const productId = params.id as string
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  useEffect(() => {
    initializeMockData()
    
    const fetchProduct = async () => {
      setIsLoading(true)
      const connected = await checkSupabaseConnection()
      
      if (connected) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', productId)
          .single()
        
        if (!error && data) {
          setProduct(data)
        } else {
          setProduct(mockDataService.getProduct(productId))
        }
      } else {
        setProduct(mockDataService.getProduct(productId))
      }
      
      setIsLoading(false)
    }

    fetchProduct()
  }, [productId])

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      toast.success(`${product.name} added to cart`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="glass-card p-4 w-32 mb-8 skeleton rounded-lg h-10" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square skeleton rounded-xl" />
            <div className="space-y-6">
              <div className="h-8 w-3/4 skeleton rounded" />
              <div className="h-6 w-1/4 skeleton rounded" />
              <div className="h-24 w-full skeleton rounded" />
              <div className="h-12 w-full skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-foreground-muted mb-6">The product you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
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
            Back to Collection
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden glass-card">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0">
                  {product.badge}
                </Badge>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-foreground-muted uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{product.rating}</span>
                  <span className="text-foreground-muted">/5</span>
                </div>
                <span className="text-foreground-muted">|</span>
                <span className={product.stock > 0 ? 'text-emerald-500' : 'text-destructive'}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            <div className="text-4xl font-bold gradient-text-primary">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-foreground-secondary leading-relaxed">
              {product.description}
            </p>

            <Separator />

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-foreground mb-3">Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-foreground-secondary">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-foreground-secondary">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full glow-button text-lg py-6"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 rounded-lg bg-background-secondary">
                <Truck className="h-6 w-6 mx-auto mb-2 text-cyan-500" />
                <p className="text-xs text-foreground-muted">Free Shipping</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background-secondary">
                <Shield className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
                <p className="text-xs text-foreground-muted">2 Year Warranty</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background-secondary">
                <Package className="h-6 w-6 mx-auto mb-2 text-purple-500" />
                <p className="text-xs text-foreground-muted">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
