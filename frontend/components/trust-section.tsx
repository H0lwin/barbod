"use client"

import { ShieldCheck, Headphones, Zap, RefreshCcw, Send } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Zap,
    title: "تحویل فوری",
    description: "تمامی محصولات در کمترین زمان ممکن تحویل داده می‌شوند",
  },
  {
    icon: Headphones,
    title: "پشتیبانی ۲۴/۷",
    description: "تیم پشتیبانی ما به صورت شبانه‌روزی در خدمت شماست",
  },
  {
    icon: RefreshCcw,
    title: "ضمانت بازگشت وجه",
    description: "در صورت عدم رضایت، وجه شما به صورت کامل بازگردانده می‌شود",
  },
  {
    icon: ShieldCheck,
    title: "خرید مطمئن",
    description: "تمامی تراکنش‌ها با امنیت کامل و از طریق تلگرام انجام می‌شود",
  },
]

export function TrustSection() {
  const { ref, visible } = useScrollReveal(0.05)

  return (
    <section className="relative py-16 md:py-24">
      {/* Decorative */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-4 md:px-6">
        <div
          className={`mb-12 text-center ${visible ? "animate-fade-in-up" : "opacity-0"}`}
        >
          <span className="mb-4 inline-block rounded-full bg-accent/10 px-4 py-1.5 text-sm font-bold text-accent">
            {"چرا ما؟"}
          </span>
          <h2 className="mb-3 text-balance text-3xl font-black text-foreground md:text-5xl">
            {"دلایل"}
            {" "}
            <span className="gradient-text">{"اعتماد"}</span>
            {" "}
            {"شما"}
          </h2>
          <p className="mx-auto max-w-lg text-pretty text-muted-foreground">
            {"ما متعهد به ارائه بهترین خدمات و محصولات دیجیتال هستیم"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-500 hover:-translate-y-1 hover:glow-sm ${
                visible ? "animate-fade-in-up" : "opacity-0"
              }`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-black text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div
          className={`mt-12 overflow-hidden rounded-3xl bg-primary/5 p-8 text-center md:p-12 ${
            visible ? "animate-fade-in-up" : "opacity-0"
          }`}
          style={{ animationDelay: "500ms" }}
        >
          <h3 className="mb-3 text-2xl font-black text-foreground md:text-3xl">
            {"آماده سفارش هستید؟"}
          </h3>
          <p className="mx-auto mb-6 max-w-md text-muted-foreground">
            {"همین الان از طریق تلگرام با ما در ارتباط باشید و محصول مورد نظر خود را سفارش دهید"}
          </p>
          <Button
            asChild
            size="lg"
            className="group bg-[hsl(var(--telegram))] px-10 py-6 text-base font-bold text-[hsl(0,0%,100%)] transition-all duration-300 hover:bg-[hsl(200,100%,42%)] hover:shadow-xl hover:shadow-[hsl(var(--telegram))]/25"
          >
            <a
              href="https://t.me/BARBODINHO"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3"
            >
              <Send className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              {"ارتباط با ما در تلگرام"}
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
