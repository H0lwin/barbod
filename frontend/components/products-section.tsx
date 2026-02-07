"use client"

import React from "react"

import { useState, useMemo } from "react"
import {
  Search,
  LayoutGrid,
  Gamepad2,
  PackagePlus,
  Rocket,
  Crown,
  Star,
  Shield,
  Brain,
  PackageSearch,
} from "lucide-react"
import { useEffect } from "react"
import { api } from "@/lib/api-client"
import { ProductCard } from "@/components/product-card"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const categoryIconMap: Record<string, React.ElementType> = {
  grid: LayoutGrid,
  gamepad: Gamepad2,
  package: PackagePlus,
  rocket: Rocket,
  crown: Crown,
  star: Star,
  shield: Shield,
  brain: Brain,
}

export function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([{ id: "all", label: "همه محصولات", icon: "grid" }])
  const [isLoading, setIsLoading] = useState(true)
  const { ref: sectionRef, visible: sectionVisible } = useScrollReveal(0.05)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [prods, cats] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ])
        setProducts(prods || [])
        // Filter out any "all" category from API to avoid duplicate key with our manual "all"
        const filteredCats = (cats || []).filter((cat: any) => cat.id !== "all")
        setCategories([{ id: "all", label: "همه محصولات", icon: "grid" }, ...filteredCats])
      } catch (err) {
        console.error("Failed to fetch products/categories:", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filtered = useMemo(() => {
    let result = activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory)

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.details.some((d) => d.toLowerCase().includes(q))
      )
    }

    return result
  }, [activeCategory, searchQuery, products])

  return (
    <section id="products" className="relative py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Section header */}
        <div
          ref={sectionRef}
          className={`mb-10 text-center ${sectionVisible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary">
            {"کاتالوگ محصولات"}
          </span>
          <h2 className="mb-3 text-balance text-3xl font-black text-foreground md:text-5xl">
            {"محصولات"}
            {" "}
            <span className="gradient-text">{"ما"}</span>
          </h2>
          <p className="mx-auto max-w-lg text-pretty text-muted-foreground">
            {"محصول مورد نظر خود را انتخاب کرده و از طریق تلگرام سفارش دهید"}
          </p>
        </div>

        {/* Search bar */}
        <div className="mx-auto mb-8 max-w-md">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full rounded-2xl border border-border bg-card/60 py-3 pr-11 pl-4 text-sm text-foreground backdrop-blur-xl placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => {
            const CatIcon = categoryIconMap[cat.icon] || LayoutGrid
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105"
                    : "glass text-muted-foreground hover:text-foreground hover:bg-card/80"
                }`}
              >
                <CatIcon className="h-4 w-4" />
                {cat.label}
                {isActive && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground/20 px-1.5 text-[10px] font-bold">
                    {filtered.length.toLocaleString("fa-IR")}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
              <PackageSearch className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{"محصولی یافت نشد"}</p>
              <p className="text-sm text-muted-foreground">
                {"لطفا عبارت دیگری را جستجو کنید یا دسته‌بندی را تغییر دهید"}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
