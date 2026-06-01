'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Store, Mail, Lock, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuth } from '@/lib/auth-context'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, isSupabaseConnected } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [wantsToBeSeller, setWantsToBeSeller] = useState(false)
  const [storeName, setStoreName] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        // Validation
        if (password !== confirmPassword) {
          toast.error('Passwords do not match')
          setIsLoading(false)
          return
        }
        if (password.length < 6) {
          toast.error('Password must be at least 6 characters')
          setIsLoading(false)
          return
        }
        if (wantsToBeSeller && !storeName.trim()) {
          toast.error('Please enter a store name')
          setIsLoading(false)
          return
        }

        const { error } = await signUp(email, password, wantsToBeSeller, storeName)
        if (error) {
          toast.error(error)
        } else {
          toast.success('Account created successfully!')
          router.push('/')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          toast.error(error)
        } else {
          toast.success('Welcome back!')
          router.push('/')
        }
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 aurora-bg">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Button asChild variant="ghost" className="mb-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>

        {/* Auth Card */}
        <div className="glass-card p-8 animate-slide-up">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tight mb-2">
              <span className="gradient-text">ShreeSasto</span>
              <span className="text-foreground"> Shop</span>
            </Link>
            <h1 className="text-xl font-semibold text-foreground mt-4">
              {isSignUp ? 'Create an Account' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-foreground-muted mt-1">
              {isSignUp 
                ? 'Sign up to start shopping or selling' 
                : 'Sign in to access your account'}
            </p>
            {/* DB Status */}
            <p className="text-xs text-foreground-muted mt-2">
              {isSupabaseConnected 
                ? '🟢 Connected to Live Database' 
                : '🔵 Using Mock Mode (data stored locally)'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            {/* Seller Option (Sign Up only) */}
            {isSignUp && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="seller"
                    checked={wantsToBeSeller}
                    onCheckedChange={(checked) => setWantsToBeSeller(checked as boolean)}
                  />
                  <Label htmlFor="seller" className="text-sm font-normal cursor-pointer">
                    I want to sell products (Register as Seller)
                  </Label>
                </div>

                {wantsToBeSeller && (
                  <div className="space-y-2 animate-slide-up">
                    <Label htmlFor="storeName">Store / Brand Name</Label>
                    <div className="relative">
                      <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                      <Input
                        id="storeName"
                        type="text"
                        placeholder="Your Store Name"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full glow-button" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground-muted">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setWantsToBeSeller(false)
                  setStoreName('')
                }}
                className="ml-1 text-primary hover:underline font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
