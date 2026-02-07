export type Product = {
  id: string
  name: string
  icon: string
  category: string
  coverUrl: string
  price: string
  originalPrice?: string
  details: string[]
  telegram: string
  badge?: string
  popular?: boolean
}

// Data is now fetched from the FastAPI backend
export const categories: any[] = []
export const products: Product[] = []
