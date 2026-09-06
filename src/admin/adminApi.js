const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/$/, "")
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, "")

class ApiError extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }
}

async function request(path, options = {}) {
    const token = localStorage.getItem("admin_token")

    let res
    try {
        res = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers: {
                Accept: "application/json",
                ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(options.headers || {}),
            },
        })
    } catch {
        throw new ApiError("Tidak bisa menghubungi server.", 0)
    }

    let payload = null
    try {
        payload = await res.json()
    } catch {
        // response kosong, biarin null
    }

    if (res.status === 401) {
        localStorage.removeItem("admin_token")
    }

    if (!res.ok) {
        throw new ApiError(payload?.message || "Terjadi kesalahan pada server", res.status)
    }

    return payload
}

export function getImageUrl(path) {
    if (!path) return null
    if (path.startsWith("http://") || path.startsWith("https://")) return path
    return `${SERVER_BASE_URL}/storage/${path}`
}

export const adminApi = {
    login: (username, password) =>
        request("/login", { method: "POST", body: JSON.stringify({ username, password }) }),
    logout: () => request("/logout", { method: "POST" }),

    getDashboard: () => request("/admin/dashboard"),
    getBestSeller: (days = 7) => request(`/admin/dashboard/best-seller?days=${days}`),
    getProfitRecap: (from, to) => request(`/admin/dashboard/profit-recap?from=${from}&to=${to}`),

    getCategories: () => request("/categories"),
    createCategory: (payload) => request("/admin/categories", { method: "POST", body: JSON.stringify(payload) }),
    updateCategory: (id, payload) => request(`/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
    deleteCategory: (id) => request(`/admin/categories/${id}`, { method: "DELETE" }),

    getProducts: () => request("/admin/products"),
    createProduct: (formData) => request("/admin/products", { method: "POST", body: formData }),
    updateProduct: (id, formData) => {
        // Laravel baca PUT lewat field _method karena FormData gak bisa native PUT dari fetch
        formData.append("_method", "PUT")
        return request(`/admin/products/${id}`, { method: "POST", body: formData })
    },
    deleteProduct: (id) => request(`/admin/products/${id}`, { method: "DELETE" }),

    // Orders — status: 'pending' | 'processing' | 'completed' | 'cancelled'
    // GET /admin/orders → { orders: { data: [...], current_page, total, ... } } (Laravel paginator)
    getOrders: (params = {}) => {
        const query = new URLSearchParams(params).toString()
        return request(`/admin/orders${query ? `?${query}` : ""}`)
    },
    // GET /admin/orders/{order} → { order: { ...order_items, payment } }
    getOrder: (id) => request(`/admin/orders/${id}`),
    // PATCH /admin/orders/{order}/status → returns the updated order object directly (no wrapper)
    updateOrderStatus: (id, status) =>
        request(`/admin/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status }),
        }),
}

export { ApiError }