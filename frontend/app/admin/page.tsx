"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Settings, 
  Package, 
  Grid, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X,
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  Upload,
  Link as LinkIcon,
  Menu,
  Bell,
  Search,
  CheckCircle2,
  Globe,
  Sparkles,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Product } from "@/lib/products"
import Link from "next/link"
import { api } from "@/lib/api-client"

// Media Upload Component
function MediaInput({ 
  value, 
  onChange, 
  label 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  label: string 
}) {
  const [mode, setMode] = useState<"url" | "upload">("url")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    try {
      toast.loading("در حال آپلود فایل...")
      const result = await api.uploadFile(file)
      onChange(result.url)
      toast.dismiss()
      toast.success("فایل با موفقیت آپلود شد")
    } catch (err) {
      toast.dismiss()
      toast.error("خطا در آپلود فایل")
    }
  }

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await handleFile(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex rounded-lg bg-muted p-1">
          <button 
            type="button"
            onClick={() => setMode("url")}
            className={`rounded-md px-2 py-1 text-xs transition-all ${mode === "url" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            لینک خارجی
          </button>
          <button 
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-md px-2 py-1 text-xs transition-all ${mode === "upload" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            آپلود فایل
          </button>
        </div>
      </div>
      
      {mode === "url" ? (
        <div className="relative">
          <LinkIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pr-10" 
            placeholder="https://..." 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
          />
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-4 transition-all duration-300 ${
            isDragging 
              ? "border-primary bg-primary/10 scale-[1.02]" 
              : "border-muted-foreground/20 bg-muted/50 hover:bg-muted/80"
          }`}
        >
          <Upload className={`mb-2 h-6 w-6 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-xs text-muted-foreground">فایل را بکشید یا کلیک کنید</p>
          <input 
            ref={fileInputRef}
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (file) await handleFile(file)
            }} 
          />
        </div>
      )}
      {value && (
        <div className="relative mt-2 aspect-video w-full overflow-hidden rounded-lg border bg-muted">
          <img src={value} alt="Preview" className="h-full w-full object-contain" />
          <button 
            onClick={() => onChange("")}
            className="absolute left-2 top-2 rounded-full bg-background/80 p-1 text-destructive shadow-md hover:bg-background"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  
  // App Data States
  const [siteSettings, setSiteSettings] = useState({
    nameFa: "گوجو استور",
    nameEn: "GOJUSTORE",
    logoUrl: "",
    footerText: "جهت سفارش طراحی سایت اختصاصی خود به آیدی‌های بالا پیام دهید.",
  })
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [contacts, setContacts] = useState<any[]>([])
  
  // UI States
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [newCategory, setNewCategory] = useState({ id: "", label: "", icon: "grid" })
  const [newContact, setNewContact] = useState({ label: "", username: "", url: "" })

  const loadData = async () => {
    try {
      setLoading(true)
      const [settings, cats, prods, conts] = await Promise.all([
        api.getSettings(),
        api.getCategories(),
        api.getProducts(),
        api.getContacts()
      ])
      
      if (settings) setSiteSettings(settings)
      if (cats) setCategories(cats)
      if (prods) setProducts(prods)
      if (conts) setContacts(conts)
    } catch (error) {
      console.error("Failed to load data:", error)
      toast.error("خطا در بارگذاری اطلاعات از سرور")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setMounted(true)
    
    // Auth Check
    const checkAuthentication = async () => {
      try {
        const isAuth = localStorage.getItem("isAdminAuthenticated")
        if (isAuth !== "true") {
          router.push("/admin/login")
          return
        }
        
        // Verify token with backend
        await api.checkAuth()
        loadData()
      } catch (err) {
        localStorage.removeItem("isAdminAuthenticated")
        localStorage.removeItem("token")
        router.push("/admin/login")
      }
    }

    checkAuthentication()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated")
    localStorage.removeItem("token")
    router.push("/admin/login")
    toast.info("از حساب خارج شدید")
  }

  if (!mounted) return null

  // CRUD Handlers
  const handleSaveSettings = async () => {
    try {
      await api.updateSettings(siteSettings)
      toast.success("تنظیمات با موفقیت ذخیره شد")
    } catch (error) {
      toast.error("خطا در ذخیره تنظیمات")
    }
  }

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.price) {
      toast.error("لطفا نام و قیمت محصول را وارد کنید")
      return
    }
    try {
      await api.saveProduct(editingProduct)
      await loadData()
      setIsProductDialogOpen(false)
      toast.success("تغییرات محصول ذخیره شد")
    } catch (error) {
      toast.error("خطا در ذخیره محصول")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id)
      await loadData()
      toast.success("محصول حذف شد")
    } catch (error) {
      toast.error("خطا در حذف محصول")
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.label) return
    try {
      await api.createCategory({
        ...newCategory,
        id: newCategory.id || newCategory.label.toLowerCase().replace(/\s+/g, '-')
      })
      await loadData()
      setNewCategory({ id: "", label: "", icon: "grid" })
      toast.success("دسته‌بندی اضافه شد")
    } catch (error) {
      toast.error("خطا در اضافه کردن دسته‌بندی")
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.deleteCategory(id)
      await loadData()
      toast.success("دسته‌بندی حذف شد")
    } catch (error) {
      toast.error("خطا در حذف دسته‌بندی")
    }
  }

  const handleAddContact = async () => {
    if (!newContact.label || !newContact.username) return
    try {
      await api.saveContact(newContact)
      await loadData()
      setNewContact({ label: "", username: "", url: "" })
      toast.success("راه ارتباطی اضافه شد")
    } catch (error) {
      toast.error("خطا در اضافه کردن راه ارتباطی")
    }
  }

  const handleDeleteContact = async (id: string) => {
    try {
      await api.deleteContact(id)
      await loadData()
      toast.success("راه ارتباطی حذف شد")
    } catch (error) {
      toast.error("خطا در حذف راه ارتباطی")
    }
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="px-6 py-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="font-black text-foreground">مدیریت {siteSettings.nameFa}</h2>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Admin Console</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 space-y-1 px-4">
        {[
          { id: "dashboard", label: "داشبورد", icon: LayoutDashboard },
          { id: "settings", label: "تنظیمات سایت", icon: Settings },
          { id: "products", label: "محصولات", icon: Package },
          { id: "categories", label: "دسته‌بندی‌ها", icon: Grid },
          { id: "contacts", label: "راه‌های ارتباطی", icon: MessageSquare },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id)
              setSidebarOpen(false)
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              activeTab === item.id 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="px-4 pt-4 mt-auto border-t">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-3 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span>خروج از حساب</span>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Sidebar */}
      <aside className="hidden w-72 border-l bg-background/50 backdrop-blur-xl md:block">
        <SidebarContent />
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/50 px-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-black text-foreground">
              {activeTab === "dashboard" ? "داشبورد مدیریت" : 
               activeTab === "settings" ? "تنظیمات سایت" : 
               activeTab === "products" ? "مدیریت محصولات" : 
               activeTab === "categories" ? "دسته‌بندی‌ها" : "راه‌های ارتباطی"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={loadData} className="rounded-full" disabled={loading}>
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </Button>
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link href="/" target="_blank">
                <Globe size={20} />
              </Link>
            </Button>
            <div className="h-8 w-[1px] bg-border mx-2" />
            <div className="flex items-center gap-3">
              <div className="hidden text-left md:block">
                <p className="text-xs font-bold">{siteSettings.nameEn}</p>
                <p className="text-[10px] text-muted-foreground">مدیر سیستم</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold">
                {siteSettings.nameEn[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            
            {/* Dashboard Overview */}
            {activeTab === "dashboard" && (
              <div className="grid gap-6">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: "کل محصولات", value: products.length, icon: Package, color: "bg-blue-500" },
                    { label: "دسته‌بندی‌ها", value: categories.filter(c => c.id !== 'all').length, icon: Grid, color: "bg-purple-500" },
                    { label: "راه‌های ارتباطی", value: contacts.length, icon: MessageSquare, color: "bg-green-500" },
                    { label: "محبوب‌ترین‌ها", value: products.filter(p => p.popular).length, icon: Sparkles, color: "bg-orange-500" },
                  ].map((stat) => (
                    <Card key={stat.label} className="overflow-hidden border-none shadow-sm">
                      <CardContent className="flex items-center gap-4 p-6">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${stat.color} text-white shadow-lg`}>
                          <stat.icon size={24} />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="text-2xl font-black">{stat.value.toLocaleString("fa-IR")}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle>وضعیت سیستم</CardTitle>
                    <CardDescription>خلاصه‌ای از وضعیت فعلی سایت شما</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 rounded-xl border p-4 bg-muted/30">
                      <CheckCircle2 className="text-green-500" />
                      <div>
                        <p className="font-bold">سایت آنلاین است</p>
                        <p className="text-xs text-muted-foreground">تمامی بخش‌ها به درستی کار می‌کنند.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle>تنظیمات برندینگ</CardTitle>
                  <CardDescription>اطلاعات پایه و بصری سایت را مدیریت کنید</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>نام فارسی سایت</Label>
                      <Input 
                        value={siteSettings.nameFa} 
                        onChange={(e) => setSiteSettings({...siteSettings, nameFa: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>نام انگلیسی سایت</Label>
                      <Input 
                        value={siteSettings.nameEn} 
                        onChange={(e) => setSiteSettings({...siteSettings, nameEn: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <MediaInput 
                    label="لوگوی سایت"
                    value={siteSettings.logoUrl}
                    onChange={(val) => setSiteSettings({...siteSettings, logoUrl: val})}
                  />

                  <div className="space-y-2">
                    <Label>متن فوتر (اعلان حق کپی‌رایت)</Label>
                    <Textarea 
                      className="min-h-[100px]"
                      value={siteSettings.footerText}
                      onChange={(e) => setSiteSettings({...siteSettings, footerText: e.target.value})}
                    />
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/20 py-4">
                  <Button onClick={handleSaveSettings} className="gap-2 px-8">
                    <Save size={18} />
                    <span>ذخیره نهایی</span>
                  </Button>
                </CardFooter>
              </Card>
            )}

            {/* Products Tab */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black">مدیریت موجودی</h3>
                    <p className="text-sm text-muted-foreground">لیست تمامی محصولات موجود در سایت</p>
                  </div>
                  <Button onClick={() => {
                    setEditingProduct({
                      name: "",
                      price: "",
                      category: categories[1]?.id || "all",
                      coverUrl: "",
                      details: [""],
                      telegram: "@BARBODINHO"
                    })
                    setIsProductDialogOpen(true)
                  }} className="gap-2 rounded-xl">
                    <Plus size={18} />
                    <span>محصول جدید</span>
                  </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((p) => (
                    <Card key={p.id} className="group overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        <img src={p.coverUrl || "/placeholder.svg"} className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                          <Button size="icon" variant="secondary" className="rounded-full" onClick={() => { setEditingProduct(p); setIsProductDialogOpen(true); }}>
                            <Edit size={16} />
                          </Button>
                          <Button size="icon" variant="destructive" className="rounded-full" onClick={() => {
                            if(confirm("حذف شود؟")) handleDeleteProduct(p.id!)
                          }}>
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{p.name}</h4>
                          <Badge variant="secondary">{categories.find(c => c.id === p.category)?.label}</Badge>
                        </div>
                        <p className="text-sm font-black text-primary">{p.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === "contacts" && (
              <div className="space-y-6">
                <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>افزودن راه ارتباطی</CardTitle>
                    <CardDescription>لینک‌های تلگرام یا سایر راه‌های تماس را مدیریت کنید</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>عنوان (مثلا: پشتیبانی)</Label>
                      <Input 
                        value={newContact.label}
                        onChange={(e) => setNewContact({...newContact, label: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>آیدی/شماره (مثلا: @name)</Label>
                      <Input 
                        value={newContact.username}
                        onChange={(e) => setNewContact({...newContact, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>لینک مستقیم (اختیاری)</Label>
                      <Input 
                        placeholder="https://t.me/..."
                        value={newContact.url}
                        onChange={(e) => setNewContact({...newContact, url: e.target.value})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/20 py-4">
                    <Button onClick={handleAddContact} className="gap-2">
                      <Plus size={18} />
                      <span>افزودن به لیست</span>
                    </Button>
                  </CardFooter>
                </Card>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {contacts.map((c) => (
                    <Card key={c.id} className="flex items-center justify-between p-4 border-none shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <MessageSquare size={20} />
                        </div>
                        <div>
                          <p className="font-bold">{c.label}</p>
                          <p className="text-xs text-muted-foreground">{c.username}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteContact(c.id)}>
                        <Trash2 size={18} />
                      </Button>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                 <Card className="border-none shadow-md">
                  <CardHeader>
                    <CardTitle>دسته‌بندی جدید</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>شناسه انگلیسی</Label>
                      <Input value={newCategory.id} onChange={(e) => setNewCategory({...newCategory, id: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <Label>نام فارسی</Label>
                      <Input value={newCategory.label} onChange={(e) => setNewCategory({...newCategory, label: e.target.value})} />
                    </div>
                    <div className="flex items-end">
                      <Button className="w-full gap-2" onClick={handleAddCategory}>
                        <Plus size={18} /> افزودن
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
                   {categories.map((c) => (
                    <Card key={c.id} className="flex items-center justify-between p-4 border-none shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
                          <Grid size={18} />
                        </div>
                        <p className="font-bold">{c.label}</p>
                      </div>
                      {c.id !== "all" && (
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteCategory(c.id)}>
                          <Trash2 size={18} />
                        </Button>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Product Editor Modal */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-2xl sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>اطلاعات محصول</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-1">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>نام محصول</Label>
                <Input value={editingProduct?.name || ""} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>قیمت</Label>
                <Input value={editingProduct?.price || ""} onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})} />
              </div>
            </div>
            
            <MediaInput 
              label="تصویر محصول"
              value={editingProduct?.coverUrl || ""}
              onChange={(val) => setEditingProduct({...editingProduct, coverUrl: val})}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>دسته‌بندی</Label>
                <Select value={editingProduct?.category} onValueChange={(v) => setEditingProduct({...editingProduct, category: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>آیکون (نام آیکون lucide)</Label>
                <Input value={editingProduct?.icon || ""} onChange={(e) => setEditingProduct({...editingProduct, icon: e.target.value})} placeholder="package, star, zap, ..." />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>نشان (Badge)</Label>
                <Input value={editingProduct?.badge || ""} onChange={(e) => setEditingProduct({...editingProduct, badge: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>آیدی تلگرام پشتیبانی</Label>
                <Input value={editingProduct?.telegram || ""} onChange={(e) => setEditingProduct({...editingProduct, telegram: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>جزئیات ویژگی‌ها (هر خط یک مورد)</Label>
              <Textarea 
                value={editingProduct?.details?.join("\n") || ""} 
                onChange={(e) => setEditingProduct({...editingProduct, details: e.target.value.split("\n")})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>لغو</Button>
            <Button onClick={handleSaveProduct} className="px-8">ذخیره نهایی</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
