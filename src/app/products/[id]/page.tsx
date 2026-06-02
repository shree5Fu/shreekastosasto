import ProductClient from './product-client'
import { mockProducts } from '@/lib/mock-data'

export const dynamicParams = false

export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }))
}

export default function Page() {
  return <ProductClient />
}
