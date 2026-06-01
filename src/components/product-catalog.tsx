'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search, ChevronDown, ArrowUpDown, Sparkles, Monitor, Package, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductCard, ProductCardSkeleton } from '@/components/product-card'
import { supabase, checkSupabaseConnection, type Product } from '@/lib/supabase'
import { mockDataService, initializeMockData } from '@/lib/mock-data'

const categories = [
  { id: 'All', label: 'All Products', icon: Sparkles },
  { id: 'Electronics', label: 'Electronics', icon: Monitor },
  { id: 'Desk Setup', label: 'Desk Setup', icon: Package },
  { id: 'Lifestyle', label: 'Lifestyle', icon: Heart },
]

const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: Low to High' },
  { id: 'price-desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Top Rated' },
  { id: 'newest', label: 'Newest' },
]

interface ProductCatalogProps {
  initialSearch?: string
}

export function ProductCatalog({ initialSearch = '' }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    initializeMockData()
    
    const fetchProducts = async () => {
      setIsLoading(true)
      const connected = await checkSupabaseConnection()
      
      if (connected && supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (!error && data) {
          setProducts(data)
        } else {
          setProducts(mockDataService.getProducts())
        }
      } else {
        setProducts(mockDataService.getProducts())
      }
      
      setIsLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      )
    }

    // Sort
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // Already sorted by created_at
        break
      default:
        // Featured - show items with badges first, then by rating
        result.sort((a, b) => {
          if (a.badge && !b.badge) return -1
          if (!a.badge && b.badge) return 1
          return b.rating - a.rating
        })
    }

    return result
  }, [products, selectedCategory, searchQuery, sortBy])

  const currentSort = sortOptions.find(s => s.id === sortBy)

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Our <span className="gradient-text">Collection</span>
          </h2>
          <p className="text-foreground-secondary max-w-2xl mx-auto">
            Discover premium workspace hardware, peripherals, and accessories designed for professionals who demand the best.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background-secondary border-border"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? 'glow-button' : ''}
                >
                  <Icon className="mr-1.5 h-4 w-4" />
                  {category.label}
                </Button>
              )
            })}
          </div>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="shrink-0">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {currentSort?.label}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={sortBy === option.id ? 'bg-accent' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Results Count */}
        <p className="text-sm text-foreground-muted mb-6">
          Showing {filteredAndSortedProducts.length} {filteredAndSortedProducts.length === 1 ? 'product' : 'products'}
          {searchQuery && ` for "${searchQuery}"`}
          {selectedCategory !== 'All' && ` in ${selectedCategory}`}
        </p>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full bg-background-secondary flex items-center justify-center mx-auto mb-4">
              <Search className="h-10 w-10 text-foreground-muted" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
            <p className="text-foreground-muted mb-4">
              Try adjusting your search or filter to find what you&apos;re looking for.
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
