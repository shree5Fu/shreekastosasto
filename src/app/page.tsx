import { Hero } from '@/components/hero'
import { ProductCatalog } from '@/components/product-catalog'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>
}) {
  const params = await searchParams
  const initialSearch = params.search || ''

  return (
    <>
      <Hero />
      <div id="catalog">
        <ProductCatalog initialSearch={initialSearch} />
      </div>
    </>
  )
}
