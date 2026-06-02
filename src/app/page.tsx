import { Hero } from '@/components/hero'
import { ProductCatalog } from '@/components/product-catalog'

export default function HomePage() {
  return (
    <>
      <Hero />
      <div id="catalog">
        <ProductCatalog />
      </div>
    </>
  )
}

