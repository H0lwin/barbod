"use client"

import React from "react"

import {
  Send,
  Clock,
  MapPin,
  Gamepad2,
  PackagePlus,
  Rocket,
  Crown,
  Star,
  Shield,
  Brain,
  ChevronLeft,
  Flame,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

const iconMap: Record<string, React.ElementType> = {
  gamepad: Gamepad2,
  "package-plus": PackagePlus,
  rocket: Rocket,
  crown: Crown,
  star: Star,
  shield: Shield,
  brain: Brain,
}

export function ProductCard({
  product,
  index,
}: {
  product: Product
  index: number
}) {
  const { ref, visible } = useScrollReveal(0.05)

  const telegramLink =
    product.telegram === "@Panelsellrobot"
      ? "https://t.me/Panelsellrobot"
      : "https://t.me/BARBODINHO"

  const Icon = iconMap[product.icon] || Star

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl glass transition-all duration-500 hover:-translate-y-2 hover:glow-md ${
        visible ? "animate-fade-in-up" : "opacity-0"
      } ${product.popular ? "ring-1 ring-primary/20" : ""}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Badge */}
      {product.badge && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-lg">
          <Flame className="h-3 w-3" />
          {product.badge}
        </div>
      )}

      {/* Popular indicator */}
      {product.popular && !product.badge && (
        <div className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow-lg">
          <Star className="h-3 w-3" />
          {"محبوب"}
        </div>
      )}

      {/* Cover */}
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
        <img
          src={product.coverUrl || "/placeholder.svg"}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-80" />

        {/* Price tag */}
        <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-xl bg-primary/90 px-4 py-2 text-sm font-black text-primary-foreground shadow-lg backdrop-blur-sm transition-all duration-300 group-hover:bg-primary group-hover:shadow-xl group-hover:shadow-primary/25">
          {product.price}
        </div>

        {/* Icon float */}
        <div className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-card group-hover:scale-110">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5">
        <h3 className="text-lg font-black text-foreground transition-colors duration-300 group-hover:text-primary">
          {product.name}
        </h3>

        <div className="flex flex-col gap-2">
          {product.details.map((detail) => (
            <div
              key={detail}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              {detail.includes("منطقه") || detail.includes("لوکیشن") ? (
                <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" />
              ) : (
                <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
              )}
              <span>{detail}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-border" />

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            {product.telegram}
          </span>
          <Button
            asChild
            size="sm"
            className="group/btn relative overflow-hidden bg-[hsl(var(--telegram))] text-[hsl(0,0%,100%)] transition-all duration-300 hover:bg-[hsl(200,100%,42%)] hover:shadow-lg hover:shadow-[hsl(var(--telegram))]/20"
          >
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Send className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              {"سفارش"}
              <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-x-0.5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
