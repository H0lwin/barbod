const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || "خطایی در برقراری ارتباط با سرور رخ داد");
  }

  return response.json();
}

export const api = {
  login: (data: any) => fetchApi("/login", { method: "POST", body: JSON.stringify(data) }),
  getSettings: () => fetchApi("/settings"),
  updateSettings: (data: any) => fetchApi("/settings", { method: "PUT", body: JSON.stringify(data) }),
  
  getCategories: () => fetchApi("/categories"),
  createCategory: (data: any) => fetchApi("/categories", { method: "POST", body: JSON.stringify(data) }),
  deleteCategory: (id: string) => fetchApi(`/categories/${id}`, { method: "DELETE" }),
  
  getProducts: () => fetchApi("/products"),
  saveProduct: (data: any) => fetchApi("/products", { method: "POST", body: JSON.stringify(data) }),
  deleteProduct: (id: string) => fetchApi(`/products/${id}`, { method: "DELETE" }),
  
  getContacts: () => fetchApi("/contacts"),
  saveContact: (data: any) => fetchApi("/contacts", { method: "POST", body: JSON.stringify(data) }),
  deleteContact: (id: string) => fetchApi(`/contacts/${id}`, { method: "DELETE" }),
  
  checkAuth: () => fetchApi("/me"),

  uploadFile: async (file: File) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await fetch(`${BASE_URL}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
      }
    });

    if (!response.ok) {
      throw new Error("File upload failed");
    }

    return response.json();
  },
};
