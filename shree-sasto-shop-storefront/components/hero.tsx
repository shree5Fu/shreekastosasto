'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Users, Package, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center aurora-bg overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-cyan-500/20 via-transparent to-transparent blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-radial from-purple-500/20 via-transparent to-transparent blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-foreground-secondary">
                Premium Workspace Hardware
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              <span className="text-foreground">Design DNA</span>
              <br />
              <span className="text-foreground">Meets </span>
              <span className="gradient-text">Premium Hardware</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-foreground-secondary max-w-lg leading-relaxed">
              Elevate your workspace with designer peripherals and premium upgrades 
              crafted for developers, creators, and designers who demand excellence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="glow-button text-base px-8">
                <Link href="#catalog">
                  Explore Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link href="#about">
                  Learn More
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-foreground-secondary">4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-400" />
                <span className="text-sm text-foreground-secondary">10K+ Customers</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-400" />
                <span className="text-sm text-foreground-secondary">Free Shipping</span>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Card */}
          <div className="relative hidden lg:block">
            <div 
              className="glass-card p-8 animate-slide-up"
              style={{ animationDelay: '200ms' }}
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-6">
                <StatCard 
                  label="Active Setups" 
                  value="15K+" 
                  gradient="from-cyan-500 to-blue-500"
                />
                <StatCard 
                  label="Products" 
                  value="250+" 
                  gradient="from-purple-500 to-pink-500"
                />
                <StatCard 
                  label="Happy Clients" 
                  value="98%" 
                  gradient="from-emerald-500 to-teal-500"
                />
                <StatCard 
                  label="Countries" 
                  value="45+" 
                  gradient="from-orange-500 to-red-500"
                />
              </div>

              {/* Featured Badge */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Kast Sasto</p>
                    <p className="text-sm text-foreground-muted">Premium Quality Guaranteed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-cyan-500/30 to-purple-500/30 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value, gradient }: { label: string; value: string; gradient: string }) {
  return (
    <div className="p-4 rounded-xl bg-background-secondary/50">
      <p className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {value}
      </p>
      <p className="text-sm text-foreground-muted mt-1">{label}</p>
    </div>
  )
}
