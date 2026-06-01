'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Product } from '@/lib/supabase'
import { useCart } from '@/lib/cart-context'
import { toast } from 'sonner'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <Link 
      href={`/products/${product.id}`}
      className="group glass-card overflow-hidden animate-slide-up block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-background-secondary">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Badge */}
        {product.badge && (
          <Badge 
            className="absolute top-3 left-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0"
          >
            {product.badge}
          </Badge>
        )}
        {/* Quick Add Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              onClick={handleAddToCart}
              className="w-full glow-button"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-foreground">{product.rating}</span>
          <span className="text-sm text-foreground-muted">/5</span>
        </div>
        
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-foreground-muted line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold gradient-text-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.stock <= 10 && product.stock > 0 && (
            <span className="text-xs text-amber-500">
              Only {product.stock} left
            </span>
          )}
          {product.stock === 0 && (
            <span className="text-xs text-destructive">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-16 skeleton rounded" />
        <div className="h-5 w-full skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-6 w-20 skeleton rounded" />
      </div>
    </div>
  )
}
