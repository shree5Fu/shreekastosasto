'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeItem, subtotal } = useCart()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col bg-background border-border">
        <SheetHeader className="space-y-2">
          <SheetTitle className="flex items-center gap-2 text-foreground">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart
            <span className="text-foreground-muted text-sm font-normal">
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <div className="w-20 h-20 rounded-full bg-background-secondary flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-foreground-muted" />
            </div>
            <div>
              <p className="font-medium text-foreground">Your cart is empty</p>
              <p className="text-sm text-foreground-muted mt-1">
                Add some products to get started
              </p>
            </div>
            <Button onClick={() => setIsCartOpen(false)} className="glow-button">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.product.id} className="glass-card p-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-background-secondary flex-shrink-0">
                        <Image
                          src={item.product.image_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <Link 
                            href={`/products/${item.product.id}`}
                            onClick={() => setIsCartOpen(false)}
                            className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-foreground-muted hover:text-destructive flex-shrink-0"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove item</span>
                          </Button>
                        </div>
                        <p className="text-sm text-foreground-secondary mt-1">
                          ${item.product.price.toFixed(2)}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="font-semibold text-foreground">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground-secondary">Subtotal</span>
                <span className="text-xl font-bold text-foreground">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-foreground-muted">
                Shipping and taxes calculated at checkout
              </p>
              <div className="flex flex-col gap-2">
                <Button asChild className="glow-button w-full" onClick={() => setIsCartOpen(false)}>
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIsCartOpen(false)}
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
