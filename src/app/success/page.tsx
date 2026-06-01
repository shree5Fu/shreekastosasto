'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Package, Mail, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || 'N/A'
  const name = searchParams.get('name') || ''
  const email = searchParams.get('email') || ''
  const address = searchParams.get('address') || ''

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 aurora-bg">
      <div className="w-full max-w-lg">
        <div className="glass-card p-8 text-center animate-slide-up">
          {/* Success Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-foreground-muted mb-6">
            Thank you for your purchase. Your order has been placed successfully.
          </p>

          {/* Order ID */}
          <div className="bg-background-secondary rounded-lg p-4 mb-6">
            <p className="text-sm text-foreground-muted mb-1">Transaction ID</p>
            <p className="font-mono text-foreground font-semibold break-all">{orderId}</p>
          </div>

          <Separator className="my-6" />

          {/* Shipping Details */}
          <div className="text-left space-y-4">
            <h2 className="font-semibold text-foreground">Shipping Details</h2>
            
            {name && (
              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground-muted">Name</p>
                  <p className="text-foreground">{name}</p>
                </div>
              </div>
            )}

            {email && (
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground-muted">Email</p>
                  <p className="text-foreground">{email}</p>
                </div>
              </div>
            )}

            {address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-foreground-muted">Shipping Address</p>
                  <p className="text-foreground">{address}</p>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-6" />

          {/* Confirmation Message */}
          <p className="text-sm text-foreground-muted mb-6">
            A confirmation email has been sent to your email address with order details and tracking information.
          </p>

          {/* CTA */}
          <Button asChild className="w-full glow-button">
            <Link href="/">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
