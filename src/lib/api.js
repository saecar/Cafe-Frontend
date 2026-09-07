const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api")
    .trim()
    .replace(/\/+$/, "")

// Base URL server tanpa "/api", dipakai buat akses file di /uploads
const SERVER_BASE_URL = API_BASE_URL.replace(/\/api$/, "")

class ApiError extends Error {
    constructor(message, status, errors) {
        super(message)
        this.status = status
        this.errors = errors
    }
}

async function request(path, options = {}) {
    let res
    try {
        res = await fetch(`${API_BASE_URL}${path}`, {
            ...options,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                ...(options.headers || {}),
            },
        })
    } catch {
        throw new ApiError("Tidak bisa menghubungi server. Cek koneksi atau URL backend kamu.", 0)
    }

    let payload = null
    try {
        payload = await res.json()
    } catch {
        // response kosong / bukan JSON, biarkan payload null
    }

    if (!res.ok) {
        const message =
            payload?.message ||
            (payload?.errors ? Object.values(payload.errors).flat().join(", ") : null) ||
            "Terjadi kesalahan pada server"
        throw new ApiError(message, res.status, payload?.errors)
    }

    return payload
}

// Bikin URL gambar produk penuh dari path relatif yang dikirim backend (mis. "products/xxx.jpg").
// Folder public/uploads di-mount sebagai volume persisten di Wasmer, jadi URL-nya
// lewat /uploads/... bukan /storage/... lagi (lihat config/filesystems.php di backend).
export function getImageUrl(path) {
    if (!path) return null
    if (path.startsWith("http://") || path.startsWith("https://")) return path
    return `${SERVER_BASE_URL}/uploads/${path}`
}

export const api = {
    // Category
    getCategories: () => request("/categories"),
    getCategory: (id) => request(`/categories/${id}`),

    // Product
    getProducts: (categoryId) => request(`/products${categoryId ? `?category_id=${categoryId}` : ""}`),
    getProduct: (id) => request(`/products/${id}`),

    // Order
    createOrder: (payload) =>
        request("/orders", {
            method: "POST",
            body: JSON.stringify(payload),
        }),

    // Payment (Midtrans Snap token)
    payOrder: (orderId) =>
        request(`/orders/${orderId}/pay`, {
            method: "POST",
        }),

    // Cek status transaksi langsung ke Midtrans lewat backend (dipakai buat polling di halaman invoice)
    checkOrderStatus: (orderNumber) => request(`/orders/${orderNumber}/check-status`),

    // Contact
    submitContact: (payload) =>
        request("/contact", {
            method: "POST",
            body: JSON.stringify(payload),
        }),
}

export { ApiError }