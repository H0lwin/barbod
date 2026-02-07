"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Lock, 
  User, 
  ShieldCheck, 
  Loader2,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { toast } from "sonner"
import { api } from "@/lib/api-client"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ username: "", password: "" })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await api.login(loginData)
      localStorage.setItem("isAdminAuthenticated", "true")
      localStorage.setItem("token", result.access_token)
      toast.success("خوش آمدید")
      router.push("/admin")
    } catch (err: any) {
      toast.error(err.message || "نام کاربری یا رمز عبور اشتباه است")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-64 w-64 rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md overflow-hidden border-none bg-background/80 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
        
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles size={28} />
          </div>
          <CardTitle className="text-2xl font-black">ورود به پنل مدیریت</CardTitle>
          <CardDescription>برای دسترسی به تنظیمات سایت وارد شوید</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">نام کاربری</Label>
              <div className="relative">
                <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="username" 
                  className="pr-10" 
                  placeholder="نام کاربری را وارد کنید"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">رمز عبور</Label>
              <div className="relative">
                <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pr-10" 
                  placeholder="••••••••"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full gap-2 py-6 text-base font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={18} />}
              ورود به حساب
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="justify-center border-t bg-muted/20 py-4">
          <p className="text-xs text-muted-foreground">
            سیستم مدیریت محتوای گوجو استور - نسخه ۱.۰
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
