import { createContext, useContext, useEffect, useMemo, useState } from "react"

const CartContext = createContext(null)
const STORAGE_KEY = "mrcoffee_cart"

function readInitialCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(readInitialCart)

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }, [items])

    function addItem(product, quantity = 1) {
        setItems((prev) => {
            const existing = prev.find((it) => it.product_id === product.id)
            if (existing) {
                const maxStock = product.stock ?? Infinity
                return prev.map((it) =>
                    it.product_id === product.id
                        ? { ...it, quantity: Math.min(it.quantity + quantity, maxStock) }
                        : it
                )
            }
            return [
                ...prev,
                {
                    product_id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image,
                    stock: product.stock,
                    quantity,
                },
            ]
        })
    }

    function updateQuantity(productId, quantity) {
        setItems((prev) => {
            if (quantity <= 0) return prev.filter((it) => it.product_id !== productId)
            return prev.map((it) => (it.product_id === productId ? { ...it, quantity } : it))
        })
    }

    function removeItem(productId) {
        setItems((prev) => prev.filter((it) => it.product_id !== productId))
    }

    function clearCart() {
        setItems([])
    }

    const totalItems = useMemo(() => items.reduce((sum, it) => sum + it.quantity, 0), [items])
    const totalPrice = useMemo(() => items.reduce((sum, it) => sum + it.quantity * it.price, 0), [items])

    const value = { items, addItem, updateQuantity, removeItem, clearCart, totalItems, totalPrice }

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error("useCart harus dipakai di dalam <CartProvider>")
    return ctx
}
