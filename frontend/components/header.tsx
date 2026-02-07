"use client"

import { useTheme } from "next-themes"
import { Moon, Sun, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { api } from "@/lib/api-client"

export function Header() {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [siteSettings, setSiteSettings] = useState({
    nameFa: "گوجو استور",
    nameEn: "GOJUSTORE",
    logoUrl: "",
  })

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    
    const loadSettings = async () => {
      try {
        const data = await api.getSettings()
        if (data) setSiteSettings(data)
      } catch (err) {
        console.error("Failed to load settings:", err)
      }
    }
    loadSettings()
    
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-lg shadow-background/50"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <a href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary transition-transform duration-300 group-hover:scale-105 overflow-hidden">
            {siteSettings.logoUrl ? (
              <img src={siteSettings.logoUrl} alt="Logo" className="h-full w-full object-cover" />
            ) : (
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            )}
            <div className="absolute inset-0 rounded-2xl bg-primary/50 blur-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-foreground">
              {siteSettings.nameFa}
            </h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
              {siteSettings.nameEn}
            </p>
          </div>
        </a>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            asChild
            size="sm"
            className="group/btn relative overflow-hidden bg-[hsl(var(--telegram))] text-[hsl(0,0%,100%)] transition-all duration-300 hover:bg-[hsl(200,100%,42%)] hover:shadow-lg hover:shadow-[hsl(var(--telegram))]/20"
          >
            <a
              href="https://t.me/BARBODINHO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              <span className="hidden sm:inline">{"سفارش در تلگرام"}</span>
            </a>
          </Button>

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative text-foreground transition-all duration-300 hover:bg-primary/10"
              aria-label="تغییر تم"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
