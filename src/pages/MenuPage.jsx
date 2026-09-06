import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { api, getImageUrl } from "../lib/api"
import { formatRupiah } from "../lib/format"
import { useCart } from "../context/CartContext"

function MenuPage() {
    const { addItem } = useCart()
    const navigate = useNavigate()

    const [categories, setCategories] = useState([])
    const [activeCategory, setActiveCategory] = useState(null) // null = Semua
    const [products, setProducts] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [error, setError] = useState(null)
    const [addedId, setAddedId] = useState(null)

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
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reset loading state saat kategori berubah
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

    function handleAddToCart(product) {
        addItem(product, 1)
        setAddedId(product.id)
        setTimeout(() => setAddedId(null), 1200)
    }

    // Beli Sekarang — langsung ke Checkout dengan 1 produk ini, TANPA nyentuh keranjang.
    // Jadi kalau user lagi ngumpulin belanjaan di keranjang, itu gak ke-reset/ke-ganggu.
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
        <motion.section
            id="menu"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 md:py-16 bg-[#faf8f5] text-[#16120e] overflow-hidden"
        >
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8 md:mb-10">
                    <span className="font-mono text-xs font-black uppercase tracking-widest text-[#ff6239] bg-[#16120e] px-2.5 py-1 inline-block shadow-[3px_3px_0px_#16120e] mb-4">
                        FULL MENU
                    </span>
                    <h1 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-[#16120e] mb-2">
                        Menu Kami
                    </h1>
                    <p className="text-sm md:text-base font-mono text-stone-600">
                        Pilih menu favoritmu, langsung masuk ke keranjang.
                    </p>
                </div>

                {/* Tab kategori */}
                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 md:mb-10">
                    <motion.button
                        onClick={() => setActiveCategory(null)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-3 md:px-4 py-2 border-2 border-[#16120e] font-mono text-xs md:text-sm font-black uppercase whitespace-nowrap shadow-[3px_3px_0px_#16120e] transition-all hover:translate-x-0.5 hover:translate-y-0.5 ${
                            activeCategory === null ? "bg-[#16120e] text-[#faf8f5]" : "bg-[#faf8f5] text-[#16120e]"
                        }`}
                    >
                        Semua
                    </motion.button>

                    {!loadingCategories &&
                        categories.map((category) => (
                            <motion.button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-3 md:px-4 py-2 border-2 border-[#16120e] font-mono text-xs md:text-sm font-black uppercase whitespace-nowrap shadow-[3px_3px_0px_#16120e] transition-all hover:translate-x-0.5 hover:translate-y-0.5 ${
                                    activeCategory === category.id
                                        ? "bg-[#16120e] text-[#faf8f5]"
                                        : "bg-[#faf8f5] text-[#16120e]"
                                }`}
                            >
                                {category.name}
                            </motion.button>
                        ))}
                </div>

                {/* Error state */}
                {error && (
                    <div className="max-w-lg mx-auto mb-8 border-2 border-[#16120e] bg-[#ffdad6] text-[#16120e] text-sm font-mono p-4 text-center shadow-[3px_3px_0px_#16120e]">
                        Gagal memuat menu: {error}
                        <div className="text-xs mt-1 text-stone-600">
                            Pastikan backend jalan dan VITE_API_BASE_URL di .env sudah benar.
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {loadingProducts && !error && (
                    <p className="text-center text-sm font-mono text-stone-600">Memuat menu...</p>
                )}

                {/* Grid produk */}
                {!loadingProducts && !error && products.length === 0 && (
                    <p className="text-center text-sm font-mono text-stone-600">Belum ada produk di kategori ini.</p>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeCategory ?? "all"}
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.05 } } }}
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                className="border-4 border-[#16120e] bg-[#faf8f5] flex flex-col shadow-[6px_6px_0px_#16120e]"
                            >
                                <div
                                    className="h-32 md:h-40 bg-stone-300 bg-cover bg-center border-b-4 border-[#16120e]"
                                    style={product.image ? { backgroundImage: `url(${getImageUrl(product.image)})` } : undefined}
                                />
                                <div className="p-3 md:p-4 flex flex-col flex-1">
                                    <h3 className="font-display text-sm md:text-base font-bold text-[#16120e] mb-1">
                                        {product.name}
                                    </h3>
                                    {product.description && (
                                        <p className="text-xs font-mono text-stone-600 mb-2 line-clamp-2">
                                            {product.description}
                                        </p>
                                    )}
                                    <div className="mt-auto flex items-center justify-between pt-2">
                                        <span className="text-xs md:text-sm font-mono font-black text-[#16120e]">
                                            {formatRupiah(product.price)}
                                        </span>
                                    </div>
                                    {product.stock <= 0 ? (
                                        <span className="mt-2 text-center text-xs font-mono font-bold text-stone-500 uppercase py-2">
                                            Stok habis
                                        </span>
                                    ) : (
                                        <div className="mt-2 flex flex-col gap-1.5">
                                            <motion.button
                                                onClick={() => handleBuyNow(product)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="w-full bg-[#16120e] text-[#faf8f5] py-2 text-xs md:text-sm font-mono font-black uppercase border-2 border-[#16120e] hover:bg-[#ff6239] hover:text-[#16120e] transition-all"
                                            >
                                                Beli Sekarang
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleAddToCart(product)}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                                className="w-full border-2 border-[#16120e] text-[#16120e] py-2 text-xs md:text-sm font-mono font-black uppercase hover:bg-[#16120e] hover:text-[#faf8f5] transition-all"
                                            >
                                                {addedId === product.id ? "Ditambahkan ✓" : "+ Keranjang"}
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </motion.section>
    )
}

export default MenuPage