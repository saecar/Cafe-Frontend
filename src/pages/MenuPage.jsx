import { useEffect, useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Search, SlidersHorizontal, Plus, ArrowRight, ShoppingBag, Leaf, Coffee } from "lucide-react"
import { api, getImageUrl } from "../lib/api"
import { formatRupiah } from "../lib/format"
import { useCart } from "../context/CartContext"

// ---------------------------------------------------------------------------
// Palette / tokens lifted from the "Atelier Roast" design reference. Written
// as arbitrary Tailwind values (bg-[#...]) rather than theme keys so this
// drops in regardless of what's registered in this project's Tailwind config
// — same convention the previous MenuPage used for its own palette.
//
// Needs Epilogue + Plus Jakarta Sans loaded once, e.g. in index.html:
//   <link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
// Until then the font-[...] classes below just fall back to the browser
// default serif/sans, so nothing breaks if it's missing — it just won't
// look quite as intended.
// ---------------------------------------------------------------------------
const ink = "#2c221e" // primary text / dark surfaces
const inkMuted = "#8c7a6b" // metadata, descriptions
const accent = "#c86d44" // terracotta — used sparingly, per the spec
const cardBorder = "#e6ded5"
const chipBg = "#f2ece4"
const pageBg = "#f9f6f0"
const cardBg = "#fdfbf7"

const cardShadow = "shadow-[0_4px_20px_-2px_rgba(44,34,30,0.04),0_2px_6px_-1px_rgba(44,34,30,0.02)]"

function MenuPage() {
    const cart = useCart()
    const { addItem } = cart
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState(null) // null = Semua
    const [products, setProducts] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [error, setError] = useState(null)
    const [addedId, setAddedId] = useState(null)
    const [query, setQuery] = useState("")

    // Ambil daftar kategori sekali di awal
    useEffect(() => {
        let ignore = false

        async function loadCategories() {
            try {
                const res = await api.getCategories()
                if (!ignore) setCategories(res?.data ?? [])
            } catch (err) {
                if (!ignore) setError(err.message)
            } finally {
                if (!ignore) setLoadingCategories(false)
            }
        }

        loadCategories()
        return () => {
            ignore = true
        }
    }, [])

    // Ambil produk tiap kali kategori aktif berubah
    useEffect(() => {
        let ignore = false
        setLoadingProducts(true)

        async function loadProducts() {
            try {
                const res = await api.getProducts(activeCategory)
                if (!ignore) {
                    setProducts(res?.data?.data ?? [])
                    setError(null)
                }
            } catch (err) {
                if (!ignore) setError(err.message)
            } finally {
                if (!ignore) setLoadingProducts(false)
            }
        }

        loadProducts()
        return () => {
            ignore = true
        }
    }, [activeCategory])

    // Pencarian dilakukan di sisi client, dari produk yang sudah ke-fetch untuk
    // kategori aktif — bukan panggilan API baru. Jadi cakupannya cuma sebatas
    // kategori yang lagi dibuka. Kalau nanti mau search lintas semua kategori,
    // ini tinggal diganti manggil api.getProducts(activeCategory, query) kalau
    // endpoint backend-nya sudah dukung parameter pencarian.
    const visibleProducts = useMemo(() => {
        if (!query.trim()) return products
        const q = query.trim().toLowerCase()
        return products.filter(
            (p) => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
        )
    }, [products, query])

    // Ringkasan keranjang untuk sticky bar di bawah. CartContext di proyek ini
    // belum saya lihat isinya, jadi field di bawah dibaca secara defensif:
    // kalau context sudah expose items/totalCount/totalPrice, itu yang dipakai;
    // kalau cuma expose `items`, totalnya dihitung manual. Sesuaikan nama field
    // ini kalau ternyata beda dari CartContext.jsx yang sebenarnya.
    const cartItems = cart.items ?? []
    const cartCount = cart.totalCount ?? cartItems.reduce((sum, it) => sum + (it.quantity ?? 1), 0)
    const cartTotal =
        cart.totalPrice ?? cartItems.reduce((sum, it) => sum + Number(it.price ?? 0) * (it.quantity ?? 1), 0)

    function handleAddToCart(product) {
        addItem(product, 1)
        setAddedId(product.id)
        setTimeout(() => setAddedId(null), 1200)
    }

    // Beli Sekarang — langsung ke Checkout dengan 1 produk ini, TANPA nyentuh keranjang.
    function handleBuyNow(product) {
        navigate("/checkout", {
            state: {
                buyNowItem: {
                    product_id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image,
                    quantity: 1,
                },
            },
        })
    }

    return (
        <section
            id="menu"
            className="min-h-screen pb-32"
            style={{ backgroundColor: pageBg, color: ink, fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <div className="max-w-3xl md:max-w-4xl xl:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14">
                {/* Heading */}
                <div className="mb-6">
                    <span
                        className="text-[11px] font-bold uppercase tracking-[0.15em]"
                        style={{ color: accent }}
                    >
                        Koleksi Kami
                    </span>
                    <h1
                        className="text-3xl md:text-4xl font-semibold tracking-tight mt-1"
                        style={{ fontFamily: "'Epilogue', sans-serif", color: ink }}
                    >
                        Menu Kami
                    </h1>
                    <p className="text-sm mt-1.5" style={{ color: inkMuted }}>
                        Pilih menu favoritmu, langsung masuk ke keranjang.
                    </p>
                </div>

                {/* Search bar — capped at a readable width on wide screens so the input
                    doesn't stretch edge-to-edge on tablet/desktop */}
                <div className="relative mb-4 md:max-w-md">
                    <Search
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5"
                        style={{ color: inkMuted }}
                        size={18}
                    />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari menu..."
                        className="w-full h-12 pl-10 pr-10 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
                        style={{ backgroundColor: cardBg, border: `1.5px solid ${cardBorder}`, color: ink }}
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Bersihkan pencarian"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 min-w-[36px] min-h-[36px] flex items-center justify-center"
                            style={{ color: inkMuted }}
                        >
                            <SlidersHorizontal size={16} className="rotate-90" />
                        </button>
                    )}
                </div>

                {/* Category chips */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 mb-6 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
                    <button
                        onClick={() => setActiveCategory(null)}
                        className="whitespace-nowrap min-h-[44px] px-4 rounded-full text-[13px] font-semibold flex items-center gap-1.5 flex-shrink-0 transition-colors"
                        style={
                            activeCategory === null
                                ? { backgroundColor: ink, color: "#fff" }
                                : { backgroundColor: chipBg, color: ink }
                        }
                    >
                        <Coffee size={15} />
                        Semua
                    </button>

                    {!loadingCategories &&
                        categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className="whitespace-nowrap min-h-[44px] px-4 rounded-full text-[13px] font-semibold flex items-center flex-shrink-0 transition-colors"
                                style={
                                    activeCategory === category.id
                                        ? { backgroundColor: ink, color: "#fff" }
                                        : { backgroundColor: chipBg, color: ink }
                                }
                            >
                                {category.name}
                            </button>
                        ))}
                </div>

                {/* Section banner */}
                <div className="flex items-baseline justify-between mb-3">
                    <h2 className="text-lg font-bold tracking-tight" style={{ fontFamily: "'Epilogue', sans-serif" }}>
                        Sajian Pilihan
                    </h2>
                    <span className="text-xs font-medium" style={{ color: inkMuted }}>
                        {visibleProducts.length} menu
                    </span>
                </div>

                {/* Error state */}
                {error && (
                    <div
                        className="mb-6 rounded-2xl p-4 text-center text-sm"
                        style={{ backgroundColor: "#ffdad6", color: "#93000a", border: "1px solid #ffb4ab" }}
                    >
                        Gagal memuat menu: {error}
                        <div className="text-xs mt-1 opacity-80">
                            Pastikan backend jalan dan VITE_API_BASE_URL di .env sudah benar.
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {loadingProducts && !error && (
                    <p className="text-center text-sm" style={{ color: inkMuted }}>
                        Memuat menu...
                    </p>
                )}

                {/* Empty state */}
                {!loadingProducts && !error && visibleProducts.length === 0 && (
                    <p className="text-center text-sm" style={{ color: inkMuted }}>
                        {query ? `Tidak ada menu yang cocok dengan "${query}".` : "Belum ada produk di kategori ini."}
                    </p>
                )}

                {/* Product list */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`${activeCategory ?? "all"}-${query}`}
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.04 } } }}
                        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 items-start"
                    >
                        {visibleProducts.map((product) => {
                            const lowStock = product.stock > 0 && product.stock <= 5
                            const outOfStock = product.stock <= 0

                            return (
                                <motion.article
                                    key={product.id}
                                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                                    className={`rounded-[20px] p-3 flex flex-col ${cardShadow}`}
                                    style={{ backgroundColor: cardBg, border: `1px solid ${cardBorder}` }}
                                >
                                    <div className="flex gap-3 items-start">
                                        <div
                                            className="relative w-24 h-24 rounded-[14px] overflow-hidden flex-shrink-0 bg-cover bg-center"
                                            style={{
                                                backgroundColor: chipBg,
                                                backgroundImage: product.image ? `url(${getImageUrl(product.image)})` : undefined,
                                            }}
                                        >
                                            {product.badge && (
                                                <span
                                                    className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide"
                                                    style={{ backgroundColor: accent, color: "#fff" }}
                                                >
                                                    {product.badge}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col flex-1 min-w-0">
                                            <h3 className="text-[16px] font-bold leading-snug truncate" style={{ color: ink }}>
                                                {product.name}
                                            </h3>
                                            {product.description && (
                                                <p className="text-[13px] mt-1 line-clamp-2" style={{ color: inkMuted }}>
                                                    {product.description}
                                                </p>
                                            )}
                                            {Array.isArray(product.tags) && product.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-2">
                                                    {product.tags.map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-0.5 rounded-full text-[11px]"
                                                            style={{ backgroundColor: chipBg, color: inkMuted }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div
                                        className="mt-3 pt-2.5 flex items-center justify-between"
                                        style={{ borderTop: `1px solid ${cardBorder}` }}
                                    >
                                        <div>
                                            <span className="text-[11px] font-medium block" style={{ color: inkMuted }}>
                                                Harga{lowStock ? ` \u00b7 Sisa ${product.stock}` : ""}
                                            </span>
                                            <span className="text-[18px] font-bold" style={{ color: ink }}>
                                                {formatRupiah(product.price)}
                                            </span>
                                        </div>

                                        {outOfStock ? (
                                            <span className="text-xs font-bold uppercase" style={{ color: inkMuted }}>
                                                Stok habis
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleBuyNow(product)}
                                                    className="min-h-[44px] px-3 rounded-xl text-[13px] font-semibold transition-colors"
                                                    style={{ border: `1.5px solid ${ink}`, color: ink }}
                                                >
                                                    Beli Sekarang
                                                </button>
                                                <motion.button
                                                    onClick={() => handleAddToCart(product)}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="min-h-[44px] px-4 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 shadow-sm"
                                                    style={{ backgroundColor: ink, color: "#fff" }}
                                                >
                                                    {addedId === product.id ? (
                                                        "Ditambahkan \u2713"
                                                    ) : (
                                                        <>
                                                            <Plus size={15} />
                                                            Tambah
                                                        </>
                                                    )}
                                                </motion.button>
                                            </div>
                                        )}
                                    </div>
                                </motion.article>
                            )
                        })}
                    </motion.div>
                </AnimatePresence>

                {/* Dietary / preference note */}
                <div
                    className="mt-6 rounded-2xl p-4 flex items-center gap-3"
                    style={{ backgroundColor: chipBg }}
                >
                    <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#ffe3d1", color: accent }}
                    >
                        <Leaf size={20} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-[15px] font-bold leading-tight" style={{ color: ink }}>
                            Ada preferensi atau alergi tertentu?
                        </h4>
                        <p className="text-[13px] mt-0.5" style={{ color: inkMuted }}>
                            Tulis catatan tambahan saat checkout, atau tanyakan langsung ke kami.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sticky cart summary bar */}
            {cartCount > 0 && (
                <div className="fixed bottom-3 left-0 right-0 px-4 flex justify-center z-40">
                    <div
                        className="w-full max-w-md rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xl"
                        style={{ backgroundColor: ink, color: "#fff" }}
                    >
                        <div className="flex items-center gap-3 pl-1 min-w-0">
                            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-white/10">
                                <ShoppingBag size={20} />
                                <span
                                    className="absolute -top-1 -right-1 rounded-full w-5 h-5 text-[11px] font-bold flex items-center justify-center"
                                    style={{ backgroundColor: accent, color: "#fff" }}
                                >
                                    {cartCount}
                                </span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[11px] uppercase tracking-wide text-white/60">
                                    {cartCount} item siap dipesan
                                </span>
                                <span className="text-[16px] font-bold truncate">{formatRupiah(cartTotal)}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate("/cart")}
                            className="min-h-[44px] px-4 rounded-xl text-[13px] font-bold flex items-center gap-1.5 flex-shrink-0"
                            style={{ backgroundColor: accent, color: "#fff" }}
                        >
                            Lanjut Pesan
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </section>
    )
}

export default MenuPage