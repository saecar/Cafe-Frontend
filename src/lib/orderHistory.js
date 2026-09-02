// Backend cuma nyediain GET /admin/orders untuk admin (butuh token).
// Buat customer, kita simpan salinan invoice di localStorage begitu order dibuat,
// jadi pelanggan tetap bisa buka lagi invoice-nya tanpa login.
const STORAGE_KEY = "mrcoffee_orders"

export function saveOrderToHistory(order) {
    try {
        const list = getOrderHistory()
        const next = [order, ...list.filter((o) => o.order_number !== order.order_number)]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next.slice(0, 20)))
    } catch {
        // localStorage penuh / tidak tersedia, abaikan diam-diam
    }
}

export function getOrderHistory() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function getOrderFromHistory(orderNumber) {
    return getOrderHistory().find((o) => o.order_number === orderNumber) || null
}

export function updateOrderStatusInHistory(orderNumber, status) {
    try {
        const list = getOrderHistory().map((o) =>
            o.order_number === orderNumber ? { ...o, status } : o
        )
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch {
        // abaikan
    }
}
