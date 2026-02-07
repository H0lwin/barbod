"use client"

import { useState, useEffect } from "react"
import { Send, ShieldCheck, Heart, Sparkles, ArrowUp } from "lucide-react"
import { api } from "@/lib/api-client"

export function Footer() {
  const [siteSettings, setSiteSettings] = useState({
    nameFa: "گوجو استور",
    nameEn: "GOJUSTORE",
    logoUrl: "",
    footerText: "جهت سفارش طراحی سایت اختصاصی خود به ایدی بالا پیام دهید...",
  })
  
  const [contacts, setContacts] = useState<any[]>([
    { id: "1", label: "ادمین اصلی", username: "@BARBODINHO", url: "https://t.me/BARBODINHO" },
    { id: "2", label: "ربات فروش پنل", username: "@Panelsellrobot", url: "https://t.me/Panelsellrobot" }
  ])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settings, contactList] = await Promise.all([
          api.getSettings(),
          api.getContacts()
        ])
        if (settings) setSiteSettings(settings)
        if (contactList && contactList.length > 0) setContacts(contactList)
      } catch (err) {
        console.error("Failed to load footer data:", err)
      }
    }
    fetchData()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-xl">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-primary overflow-hidden">
                {siteSettings.logoUrl ? (
                  <img src={siteSettings.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Sparkles className="h-5 w-5 text-primary-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-black text-foreground">{siteSettings.nameFa}</h3>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                  {siteSettings.nameEn}
                </p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {"ارائه‌دهنده معتبر محصولات دیجیتال با کیفیت بالا و قیمت رقابتی. تمامی سفارشات از طریق تلگرام و به صورت مستقیم انجام می‌شود."}
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-foreground">
              {"راه‌های ارتباطی"}
            </h4>
            <div className="flex flex-col gap-3">
              {contacts.map((link) => (
                <a
                  key={link.id}
                  href={link.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-muted-foreground transition-colors duration-300 hover:text-primary"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--telegram))]/10 transition-all duration-300 group-hover:bg-[hsl(var(--telegram))]/20">
                    <Send className="h-3.5 w-3.5 text-[hsl(var(--telegram))]" />
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground">{link.label}</span>
                    <span className="block font-bold text-foreground">{link.username}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Trust + Back to top */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-foreground">
              {"تضمین کیفیت"}
            </h4>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              {[
                "پشتیبانی ۲۴ ساعته از طریق تلگرام",
                "تحویل سریع و مطمئن",
                "ضمانت بازگشت وجه",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-accent" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={scrollToTop}
              className="mt-2 flex w-fit items-center gap-2 rounded-xl bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-all duration-300 hover:bg-primary/20"
            >
              <ArrowUp className="h-4 w-4" />
              {"بازگشت به بالا"}
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center gap-3 border-t border-border/50 pt-8 text-center">
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            {"ساخته شده با"}
            <Heart className="h-3.5 w-3.5 text-destructive" />
            {"توسط"}
            <a
              href="https://t.me/H0lwin_P"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-primary transition-colors duration-300 hover:text-accent"
            >
              {"H0lwin"}
            </a>
          </p>
          <p className="text-xs text-muted-foreground/60 max-w-md">
            {siteSettings.footerText}
          </p>
        </div>
      </div>
    </footer>
  )
}
