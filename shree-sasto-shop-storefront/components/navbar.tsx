'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Search, ShoppingCart, Sun, Moon, User, LogOut, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/lib/auth-context'
import { useCart } from '@/lib/cart-context'
import { CartDrawer } from './cart-drawer'
import { checkSupabaseConnection } from '@/lib/supabase'

type DBStatus = 'checking' | 'live' | 'mock'

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const { user, isSeller, signOut } = useAuth()
  const { totalItems, setIsCartOpen } = useCart()
  const [dbStatus, setDbStatus] = useState<DBStatus>('checking')
  const [searchQuery, setSearchQuery] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkDB = async () => {
      const connected = await checkSupabaseConnection()
      setDbStatus(connected ? 'live' : 'mock')
    }
    checkDB()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const getStatusIndicator = () => {
    switch (dbStatus) {
      case 'checking':
        return (
          <span className="flex items-center gap-1.5 text-xs text-yellow-500">
            <span className="w-2 h-2 rounded-full bg-yellow-500 pulse-dot" />
            Checking...
          </span>
        )
      case 'live':
        return (
          <span className="flex items-center gap-1.5 text-xs text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Live DB
          </span>
        )
      case 'mock':
        return (
          <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            Mock Mode
          </span>
        )
    }
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="gradient-text">ShreeSasto</span>
              <span className="text-foreground"> Shop</span>
            </Link>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo and Status */}
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold tracking-tight whitespace-nowrap">
              <span className="gradient-text">ShreeSasto</span>
              <span className="text-foreground"> Shop</span>
            </Link>
            <div className="hidden sm:block">
              {getStatusIndicator()}
            </div>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background-secondary border-border"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-foreground-secondary hover:text-foreground"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative text-foreground-secondary hover:text-foreground"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
              <span className="sr-only">Shopping cart</span>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground-secondary hover:text-foreground">
                    <User className="h-5 w-5" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium truncate">{user.email}</p>
                    <p className="text-xs text-foreground-muted">
                      {isSeller ? 'Seller Account' : 'Customer'}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {isSeller && (
                    <DropdownMenuItem asChild>
                      <Link href="/seller" className="cursor-pointer">
                        <Store className="mr-2 h-4 w-4" />
                        Seller Portal
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="default" size="sm" className="glow-button">
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
      <CartDrawer />
    </>
  )
}
