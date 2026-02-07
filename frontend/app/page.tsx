import { ThemeProvider } from "@/components/theme-provider"
import { AnimatedBackground } from "@/components/animated-background"
import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { ProductsSection } from "@/components/products-section"
import { TrustSection } from "@/components/trust-section"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="relative flex min-h-screen flex-col">
        <AnimatedBackground />
        <Header />
        <main className="flex-1">
          <Hero />
          <ProductsSection />
          <TrustSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
