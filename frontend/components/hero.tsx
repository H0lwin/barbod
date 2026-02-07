"use client"

import { Send, Sparkles, ShieldCheck, Zap, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const steps = 60
    const increment = target / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(interval)
  }, [started, target])

  return (
    <span className="tabular-nums">
      {count.toLocaleString("fa-IR")}
      {suffix}
    </span>
  )
}

export function Hero() {
  const [siteName, setSiteName] = useState("گوجو استور")

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await api.getSettings()
        if (data && data.nameFa) setSiteName(data.nameFa)
      } catch (err) {
        console.error("Failed to load settings in Hero:", err)
      }
    }
    loadSettings()
  }, [])

  return (
    <section className="relative overflow-hidden pb-8 pt-12 md:pb-16 md:pt-20">
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-10 h-64 w-64 rounded-full bg-primary/10 blur-[80px] animate-pulse-glow" />
        <div className="absolute bottom-10 left-1/4 h-48 w-48 rounded-full bg-accent/10 blur-[60px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top badge */}
          <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full glass px-5 py-2.5 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-muted-foreground">
              {"محصولات دیجیتال با تحویل فوری و قیمت استثنایی"}
            </span>
          </div>

          {/* Main heading */}
          <h2
            className="mb-6 animate-fade-in-up text-balance text-5xl font-black leading-[1.15] text-foreground md:text-7xl"
            style={{ animationDelay: "100ms" }}
          >
            {"فروشگاه دیجیتال"}
            <br />
            <span className="gradient-text">{siteName}</span>
          </h2>

          {/* Subtitle */}
          <p
            className="mx-auto mb-10 max-w-2xl animate-fade-in-up text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl"
            style={{ animationDelay: "200ms" }}
          >
            {"خرید آیتم‌های فورتنایت، تلگرام پریمیوم و استارز، اکانت ChatGPT و پنل مرزبان. سفارش سریع و مطمئن از طریق تلگرام."}
          </p>

          {/* CTA Buttons */}
          <div
            className="mb-12 flex animate-fade-in-up flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: "300ms" }}
          >
            <Button
              asChild
              size="lg"
              className="group relative overflow-hidden bg-[hsl(var(--telegram))] px-8 py-6 text-base font-bold text-[hsl(0,0%,100%)] transition-all duration-300 hover:bg-[hsl(200,100%,42%)] hover:shadow-xl hover:shadow-[hsl(var(--telegram))]/25"
            >
              <a
                href="https://t.me/BARBODINHO"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3"
              >
                <Send className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                {"سفارش از طریق تلگرام"}
              </a>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 py-6 text-base font-bold text-foreground transition-all duration-300 hover:bg-primary/5 hover:border-primary/30 bg-transparent"
            >
              <a href="#products" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {"مشاهده محصولات"}
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div
            className="mx-auto grid max-w-3xl animate-fade-in-up grid-cols-2 gap-4 md:grid-cols-4"
            style={{ animationDelay: "400ms" }}
          >
            {[
              { icon: Star, value: 500, suffix: "+", label: "مشتری راضی" },
              { icon: Zap, value: 30, suffix: " دقیقه", label: "میانگین تحویل" },
              { icon: Clock, value: 24, suffix: "/۷", label: "پشتیبانی آنلاین" },
              { icon: ShieldCheck, value: 100, suffix: "%", label: "ضمانت کیفیت" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group flex flex-col items-center gap-2 rounded-2xl glass p-4 transition-all duration-300 hover:glow-sm"
              >
                <stat.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                <div className="text-2xl font-black text-foreground md:text-3xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
