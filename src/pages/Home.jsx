import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { api, getImageUrl } from "../lib/api"
import { formatRupiah } from "../lib/format"
import { useCart } from "../context/CartContext"

/**
 * MR. R — "Atelier Roast" landing page
 *
 * Palet & tipografi ini mengikuti DESIGN.md yang dikasih: oat (krem hangat),
 * terracotta (aksen), espresso (teks/dasar gelap, BUKAN hitam pekat), border
 * lembut `sandborder`, radius besar, shadow lembut warm-tinted — sengaja
 * menghindari kontras tinggi ala brutalist versi sebelumnya.
 *
 * Fungsional TIDAK berubah:
 * - src/lib/api.js  → api.getProducts()
 * - src/context/CartContext.jsx → useCart() (addItem, totalItems, totalPrice)
 * - navigate ke /menu, /cart, /checkout — endpoint tetap sama
 *
 * REVISI RESPONSIVE (tablet & mobile):
 * - Semua section dua-kolom (hero, manifesto, editorial, lokasi) sekarang
 *   pecah jadi 2 kolom mulai breakpoint `md` (768px), bukan `lg` (1024px),
 *   supaya iPad/tablet portrait tidak menumpuk teks jadi satu kolom panjang.
 * - Skala tipografi hero & italic accent dikecilkan sedikit di `md` supaya
 *   tidak overflow saat kolomnya sudah menyempit jadi ~7/12.
 * - Reel produk sekarang punya langkah `sm(2) → md(3) → lg(4)` kolom,
 *   sebelumnya lompat langsung dari 1 kolom (scroll) ke 2 kolom di `sm`
 *   lalu ke 4 kolom di `lg`, yang bikin tablet terasa longgar/canggung.
 * - Tap target (tombol, ikon) dipastikan minimal ~40px di semua ukuran.
 * - Beberapa padding/gap section dirapikan supaya tidak terlalu lebar di
 *   tablet dan tidak terlalu sempit di mobile kecil (320–375px).
 *
 * Font: Plus Jakarta Sans (body/UI) + Instrument Serif italic (aksen
 * editorial). Tambahkan ke index.html:
 *
 * <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&display=swap" rel="stylesheet" />
 *
 * Lalu di CSS global: .font-editorial-italic { font-family: 'Instrument Serif', serif; font-style: italic; }
 */

const WHATSAPP_NUMBER = "6281317381863"
const PHONE_NUMBER = "+622155508921"
const ADDRESS = "Jl. Senopati Raya No. 42, Selong, Kebayoran Baru, Jakarta Selatan 12190"

const NAV_LINKS = [
    { href: "#curation", label: "Kurasi Menu" },
    { href: "#manifesto", label: "Filosofi" },
    { href: "#editorial", label: "Ruang & Suasana" },
    { href: "#location", label: "Lokasi" },
]

// Palet warna — dipakai sebagai referensi cepat, class Tailwind tetap arbitrary hex
// oat-50 #FDFBF7 · oat-100 #F9F3EB · oat-200 #F1E7DA · oat-300 #E4D5C1
// terracotta #C86D44 · terracotta-hover #B55E36 · terracotta-light #F8ECE6
// espresso-800 #342822 · espresso-900 #231B17 · espresso-950 #17120F
// sandborder #E6DDD2

function waLink(text) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

const SPRING_SOFT = { type: "spring", stiffness: 170, damping: 22, mass: 0.7 }
const SPRING_GENTLE = { type: "spring", stiffness: 260, damping: 24 }

const revealUp = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: SPRING_SOFT },
}
const revealLeft = {
    hidden: { opacity: 0, x: -32 },
    show: { opacity: 1, x: 0, transition: SPRING_SOFT },
}
const revealRight = {
    hidden: { opacity: 0, x: 32 },
    show: { opacity: 1, x: 0, transition: SPRING_SOFT },
}
const staggerParent = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

// ---------------------------------------------------------------------------
export default function Home() {
    const navigate = useNavigate()
    const { addItem, totalItems, totalPrice } = useCart()
    const prefersReducedMotion = useReducedMotion()

    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [error, setError] = useState(null)
    const [addedId, setAddedId] = useState(null)
    const [reelIndex, setReelIndex] = useState(1)
    const [drawerDismissed, setDrawerDismissed] = useState(true)
    const reelRef = useRef(null)
    const heroRef = useRef(null)
    const prevTotalItems = useRef(totalItems)

    const { scrollYProgress } = useScroll()
    const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] })
    const heroImageScale = useTransform(heroProgress, [0, 1], [1, prefersReducedMotion ? 1 : 1.06])

    const reveal = (variants, amount = 0.18) =>
        prefersReducedMotion ? {} : { initial: "hidden", whileInView: "show", viewport: { once: true, amount }, variants }

    useEffect(() => {
        let ignore = false
        async function load() {
            try {
                const res = await api.getProducts()
                if (!ignore) {
                    const list = res?.data?.data ?? []
                    setProducts(list.slice(0, 6))
                    setError(null)
                }
            } catch (err) {
                if (!ignore) setError(err.message)
            } finally {
                if (!ignore) setLoadingProducts(false)
            }
        }
        load()
        return () => {
            ignore = true
        }
    }, [])

    useEffect(() => {
        if (totalItems > prevTotalItems.current) setDrawerDismissed(false)
        prevTotalItems.current = totalItems
    }, [totalItems])

    function handleAddToCart(product) {
        addItem(product, 1)
        setAddedId(product.id)
        setTimeout(() => setAddedId(null), 1200)
    }

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

    function scrollReel(direction) {
        const reel = reelRef.current
        if (!reel) return
        const card = reel.querySelector("[data-card]")
        const step = card ? card.offsetWidth + 20 : 300
        reel.scrollBy({ left: direction * step, behavior: "smooth" })
    }

    function scrollToCard(index) {
        const card = reelRef.current?.querySelectorAll("[data-card]")[index]
        if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }

    useEffect(() => {
        const reel = reelRef.current
        if (!reel) return
        function onScroll() {
            const scrollWidth = reel.scrollWidth - reel.clientWidth
            const count = Math.max(products.length, 1)
            const index = Math.min(count, Math.max(1, Math.round((reel.scrollLeft / (scrollWidth || 1)) * (count - 1)) + 1))
            setReelIndex(index)
        }
        reel.addEventListener("scroll", onScroll, { passive: true })
        return () => reel.removeEventListener("scroll", onScroll)
    }, [products.length])

    const reelCount = useMemo(() => (products.length ? String(products.length).padStart(2, "0") : "00"), [products])

    return (
        <div className="bg-[#FDFBF7] text-[#231B17] font-sans antialiased overflow-x-hidden min-h-screen">
            {!prefersReducedMotion && (
                <motion.div
                    className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] bg-[#C86D44]"
                    style={{ scaleX: scrollYProgress }}
                />
            )}

            {/* Ticker + nav dirender oleh <Navbar /> global (src/components/Navbar.jsx) */}
            <main>
                {/* HERO */}
                <section ref={heroRef} id="home" className="relative pt-6 sm:pt-8 pb-10 sm:pb-16 overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: "radial-gradient(circle at 50% 0%, rgba(200,109,68,0.07) 0%, rgba(253,251,247,0) 65%)",
                        }}
                    />
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <motion.div
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={SPRING_SOFT}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E6DDD2] mb-6 sm:mb-8"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F9F3EB] border border-[#E6DDD2] text-[#C86D44] font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase w-fit">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#C86D44] animate-pulse shrink-0" />
                                <span>Edisi Vol. 02 — Jakarta Artisan Archive</span>
                            </div>
                            <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[#342822]/80 font-mono">
                                <span>Tersedia:</span>
                                <span className="text-[#231B17] font-bold px-2 py-0.5 rounded bg-[#F9F3EB] border border-[#E6DDD2]/70">
                                    Gayo Wine &amp; Ciwidey Natural
                                </span>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 lg:gap-12 md:items-end mb-6 sm:mb-8">
                            <motion.div {...reveal(revealLeft)} className="md:col-span-7">
                                <h1 className="text-4xl sm:text-6xl md:text-6xl lg:text-[5.2rem] leading-[0.95] tracking-tighter font-extrabold text-[#17120F] break-words">
                                    Radical
                                    <br />
                                    <span className="font-editorial-italic italic font-normal text-[#C86D44] text-5xl sm:text-7xl md:text-7xl lg:text-[6rem]">
                                        Roastery.
                                    </span>
                                </h1>
                            </motion.div>
                            <motion.div {...reveal(revealRight)} className="md:col-span-5 md:pb-2 flex flex-col justify-end">
                                <p className="text-[#342822] text-sm sm:text-base leading-relaxed mb-4">
                                    Kolektif kopi artisan &amp; sajian santap kontemporer di Senopati. Seduhan presisi,
                                    pastry mentega murni fajar hari, serta ruang santai berkarakter studio avant-garde.
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs font-medium text-[#342822]">
                                    {["100% Arabica", "Direct Sourced", "Senopati Sanctuary"].map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 rounded-lg bg-white border border-[#E6DDD2] shadow-sm"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={SPRING_SOFT}
                            className="relative rounded-2xl overflow-hidden border border-[#E6DDD2] shadow-[0_10px_30px_-8px_rgba(35,27,23,0.10)] bg-[#17120F]"
                        >
                            <div className="relative h-[240px] xs:h-[280px] sm:h-[380px] md:h-[440px] lg:h-[500px] w-full overflow-hidden">
                                <motion.img
                                    style={prefersReducedMotion ? undefined : { scale: heroImageScale }}
                                    alt="Barista artisanal menuangkan pour over di bar MR. R Senopati"
                                    className="w-full h-full object-cover object-center opacity-90"
                                    src="https://lh3.googleusercontent.com/aida/AEtjO1XJhIkmVehflu2RekgLjpKxSCmDZ_8Eo-8Ecwh_o5K4mEq6adu-oupytZjWdmFNzT-mJcE7DZ9qnTiYVLiTIFXYk46aGfVsUMjJ7J7dolwtOkkTyI42hKeMPbbzoFyyUGGqMxkopuUZKCG_6qPqCx0A0iRYND3SxeDnUC5fVdtCIJ899wcbofjpspL_6kTse7KUmztsXaabG2pyaAKDN0BjBnzLRx4VkVwIZNKSjadnTa7H5KAqL-rClfE"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#17120F]/95 via-[#17120F]/30 to-transparent" />

                                <div className="absolute top-3 left-3 sm:top-6 sm:left-6 flex flex-col gap-2 z-10 max-w-[75%] sm:max-w-none">
                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#17120F]/85 backdrop-blur-md text-[#F1E7DA] border border-white/15 text-[11px] sm:text-xs font-medium w-fit">
                                        <span className="w-2 h-2 rounded-full bg-[#C86D44] shrink-0" />
                                        <span>Cold Drip &amp; Handpour Bar</span>
                                    </span>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#231B17]/85 backdrop-blur-md border border-white/15 text-[#F9F3EB] text-xs font-semibold w-fit">
                                        <span className="text-amber-300">★</span>
                                        <span>4.9 / 5.0</span>
                                        <span className="text-[#E4D5C1] font-normal hidden xs:inline">(2.4k+ ulasan)</span>
                                    </div>
                                </div>

                                <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:right-6 sm:left-auto sm:max-w-xs bg-[#231B17]/90 backdrop-blur-md border border-white/15 rounded-xl p-3 sm:p-4 text-[#F9F3EB]">
                                    <div className="text-[10px] font-mono tracking-widest text-[#C86D44] uppercase mb-1">
                                        Origin Archive
                                    </div>
                                    <p className="font-editorial-italic italic text-sm sm:text-lg text-white leading-tight mb-1">
                                        "Setiap cangkir, setiap gigitan, setiap detik berarti."
                                    </p>
                                    <p className="text-[10px] text-[#E4D5C1] font-mono">
                                        Jl. Senopati Raya No. 42, Jakarta
                                    </p>
                                </div>
                            </div>

                            <div className="bg-[#231B17] border-t border-[#342822] p-4 sm:p-5 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-2.5 text-xs text-[#F1E7DA] w-full sm:w-auto min-w-0">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                                    <span className="font-mono text-[#C86D44] uppercase text-[11px] font-bold shrink-0">
                                        Hari ini:
                                    </span>
                                    <span className="font-medium text-white text-xs truncate">
                                        Gayo Wine &amp; Ciwidey Natural Microlot
                                    </span>
                                </div>
                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={SPRING_GENTLE}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 sm:py-2.5 rounded-xl bg-[#C86D44] hover:bg-[#B55E36] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-sm shrink-0"
                                    href="#curation"
                                >
                                    Lihat Menu &amp; Pesan
                                </motion.a>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* ANNOUNCEMENT STRIP — versi tenang, bukan gradient mencolok */}
                <div className="w-full bg-[#17120F] text-[#F1E7DA] py-2.5 overflow-hidden select-none border-y border-[#342822] group">
                    <div className="animate-mrr-marquee group-hover:[animation-play-state:paused] flex items-center gap-8 whitespace-nowrap text-[11px] font-mono tracking-widest uppercase">
                        {[0, 1].map((rep) => (
                            <span key={rep} className="flex items-center gap-8 shrink-0">
                                <span className="inline-flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                    Senopati Batch #042
                                </span>
                                <span className="text-[#C86D44]">★</span>
                                <span>100% Arabica Single Origin Nusantara</span>
                                <span className="text-[#C86D44]">★</span>
                                <span>Baked Fresh Twice Daily</span>
                                <span className="text-[#C86D44]">★</span>
                                <span>Buka Setiap Hari 10:00 — 00:00 WIB</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* PRODUCT REEL */}
                <section className="py-10 sm:py-16 bg-[#F9F3EB]/70 border-b border-[#E6DDD2]" id="curation">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            {...reveal(revealUp)}
                            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8"
                        >
                            <div>
                                <span className="inline-flex items-center gap-2 text-[#C86D44] font-mono text-xs font-bold tracking-wider uppercase mb-1.5">
                                    [ 01 / Kurasi Pilihan ]
                                </span>
                                <h2 className="text-2xl sm:text-4xl font-extrabold text-[#17120F] tracking-tight">
                                    Reel Sajian Unggulan
                                </h2>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-3">
                                <span className="text-[11px] font-mono text-[#342822]/70 tracking-wider hidden sm:inline">
                                    <motion.span key={reelIndex} initial={{ opacity: 0.4 }} animate={{ opacity: 1 }} className="text-[#17120F] font-bold">
                                        {String(reelIndex).padStart(2, "0")}
                                    </motion.span>{" "}
                                    / {reelCount}
                                </span>
                                <div className="flex items-center gap-1.5 md:hidden">
                                    <motion.button
                                        aria-label="Menu sebelumnya"
                                        onClick={() => scrollReel(-1)}
                                        whileHover={{ scale: 1.06 }}
                                        whileTap={{ scale: 0.94 }}
                                        transition={SPRING_GENTLE}
                                        className="w-10 h-10 rounded-full border border-[#E6DDD2] bg-white hover:bg-[#C86D44] hover:text-white transition-colors flex items-center justify-center text-[#342822] shadow-sm"
                                    >
                                        <ArrowLeftIcon />
                                    </motion.button>
                                    <motion.button
                                        aria-label="Menu selanjutnya"
                                        onClick={() => scrollReel(1)}
                                        whileHover={{ scale: 1.06 }}
                                        whileTap={{ scale: 0.94 }}
                                        transition={SPRING_GENTLE}
                                        className="w-10 h-10 rounded-full border border-[#E6DDD2] bg-white hover:bg-[#C86D44] hover:text-white transition-colors flex items-center justify-center text-[#342822] shadow-sm"
                                    >
                                        <ArrowRightIcon />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>

                        {error && (
                            <div className="mb-8 rounded-xl border border-[#E6DDD2] bg-[#F8ECE6] text-[#934825] text-sm p-4 text-center font-mono">
                                Gagal memuat menu: {error}
                                <div className="text-xs mt-1 text-[#342822]/70">
                                    Pastikan backend jalan dan VITE_API_BASE_URL di .env sudah benar.
                                </div>
                            </div>
                        )}

                        {loadingProducts && !error && (
                            <div className="flex gap-4 sm:gap-6 overflow-hidden pb-4">
                                {[0, 1, 2].map((i) => (
                                    <div
                                        key={i}
                                        className="min-w-[250px] sm:min-w-[280px] h-[320px] sm:h-[340px] rounded-2xl bg-[#F1E7DA] animate-pulse shrink-0"
                                    />
                                ))}
                            </div>
                        )}

                        {!loadingProducts && !error && products.length === 0 && (
                            <p className="text-center text-sm text-[#342822]/70 font-mono pb-4">
                                Belum ada produk untuk ditampilkan.
                            </p>
                        )}

                        {!loadingProducts && !error && products.length > 0 && (
                            <>
                                <motion.div
                                    ref={reelRef}
                                    {...reveal(staggerParent, 0.05)}
                                    className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                                >
                                    {products.map((product, i) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            justAdded={addedId === product.id}
                                            onAdd={handleAddToCart}
                                            onBuy={handleBuyNow}
                                            variants={revealUp}
                                        />
                                    ))}
                                </motion.div>

                                <div className="flex items-center justify-center gap-1.5 mt-5 sm:hidden">
                                    {products.map((product, i) => (
                                        <button
                                            key={product.id}
                                            aria-label={`Ke produk ${i + 1}`}
                                            onClick={() => scrollToCard(i)}
                                            className={`h-1.5 rounded-full transition-all ${
                                                reelIndex === i + 1 ? "w-5 bg-[#C86D44]" : "w-1.5 bg-[#E4D5C1]"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center justify-center sm:justify-end pt-6">
                                    <motion.button
                                        whileHover={{ x: 3 }}
                                        transition={SPRING_GENTLE}
                                        onClick={() => navigate("/menu")}
                                        className="text-xs font-mono uppercase tracking-wider text-[#342822]/70 hover:text-[#C86D44] transition-colors"
                                    >
                                        Lihat semua menu →
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </div>
                </section>

                {/* MANIFESTO */}
                <section className="py-14 sm:py-20 bg-[#17120F] text-[#F1E7DA]" id="manifesto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 md:items-start mb-10 sm:mb-16">
                            <motion.div {...reveal(revealLeft)} className="md:col-span-7">
                                <span className="text-[#C86D44] font-mono text-xs tracking-widest uppercase block mb-2 sm:mb-3">
                                    02 / Manifesto Seduhan
                                </span>
                                <h2 className="text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                                    Kopi bukan rutinitas biasa,{" "}
                                    <span className="font-editorial-italic italic font-normal text-[#C86D44] text-3xl sm:text-5xl md:text-4xl lg:text-6xl">
                                        tapi sebuah pernyataan sikap.
                                    </span>
                                </h2>
                                <p className="text-[#E4D5C1] text-xs sm:text-base leading-relaxed mt-4 sm:mt-6 max-w-xl">
                                    MR. R dirancang sebagai antitesis dari kedai kopi korporat yang seragam dan
                                    membosankan. Kami menggabungkan ketelitian sains sangrai mikro-lot dengan
                                    keramahan artisan kuliner independen di tengah kesibukan Jakarta Selatan.
                                </p>
                            </motion.div>

                            <motion.div
                                {...reveal(revealRight)}
                                className="md:col-span-5 bg-[#231B17]/90 rounded-2xl p-4 sm:p-7 border border-white/10 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.25)]"
                            >
                                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 gap-2">
                                    <span className="text-[11px] sm:text-xs font-mono tracking-wider text-[#C86D44] uppercase font-semibold">
                                        Standar Seduh &amp; Lab
                                    </span>
                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#F1E7DA] shrink-0">
                                        Lab Grade
                                    </span>
                                </div>
                                <dl className="divide-y divide-white/10 text-xs font-mono">
                                    <SpecRow label="Beans Selection" value="100% Single Origin" />
                                    <SpecRow label="Water TDS Level" value="130 PPM (Optimal)" />
                                    <SpecRow label="Bakery Schedule" value="06:00 & 14:00 WIB" />
                                    <SpecRow label="Co-Working Policy" value="WFC & Colokan Meja" valueClass="text-emerald-400" />
                                </dl>
                            </motion.div>
                        </div>

                        <motion.div {...reveal(staggerParent, 0.15)} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {[
                                {
                                    tag: "01. Kejujuran Rasa",
                                    title: "Micro-Lot Langsung Petani",
                                    desc: "Biji kopi kami diperoleh langsung dari mitra tani Gayo, Temanggung, dan Jawa Barat secara transparan tanpa tengkulak.",
                                    foot: "Profil Cerah & Seimbang",
                                },
                                {
                                    tag: "02. Ketelitian Bake",
                                    title: "Panggang Subuh Oven",
                                    desc: "Ragi alami dan mentega Prancis berkualitas tinggi. Pastry keluar hangat tepat saat pintu kedai dibuka tiap pagi.",
                                    foot: "Mentega Murni 100%",
                                },
                                {
                                    tag: "03. Senopati Sanctuary",
                                    title: "Ruang Temu Ide & WFC",
                                    desc: "Dilengkapi colokan di tiap sudut meja, koneksi optik 100 Mbps, dan playlist kurasi indie soul & jazz sepanjang hari.",
                                    foot: "Koneksi 100 Mbps & Meja",
                                },
                            ].map((card) => (
                                <motion.div
                                    key={card.title}
                                    variants={revealUp}
                                    whileHover={{ y: -4 }}
                                    transition={SPRING_GENTLE}
                                    className="bg-[#231B17]/70 border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-[0_10px_30px_-8px_rgba(0,0,0,0.2)] sm:first:col-span-2 md:first:col-span-1"
                                >
                                    <div>
                                        <span className="text-[#C86D44] font-mono text-[11px] tracking-wider uppercase block mb-3 font-semibold">
                                            {card.tag}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-bold text-white mb-2.5 leading-snug">{card.title}</h3>
                                        <p className="text-xs text-[#E4D5C1] leading-relaxed">{card.desc}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-white/10 text-[11px] font-mono text-[#C86D44] font-semibold uppercase flex items-center justify-between gap-2">
                                        <span>{card.foot}</span>
                                        <span>→</span>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* EDITORIAL / ARSITEKTUR */}
                <section className="py-14 sm:py-20 bg-[#FDFBF7]" id="editorial">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 md:items-center">
                            <motion.div {...reveal(revealUp)} className="md:col-span-7">
                                <div className="relative rounded-2xl overflow-hidden border border-[#E6DDD2] shadow-[0_10px_30px_-8px_rgba(35,27,23,0.10)]">
                                    <img
                                        alt="Fasad kedai MR. R Coffee & Eatery di Jalan Senopati Raya Jakarta"
                                        className="w-full h-[220px] sm:h-[340px] md:h-[400px] lg:h-[460px] object-cover"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZUz7FsttlPKzxIfC69aYxpwAwLXfq4X0kun3vrxeE5j3D5gZESQ2UAkORbpcGtWUC1Qh0nS32vfHnJWbU7LppY2g0Btgw3RBBLK5f6fZ3EWLn-FHweeFiD5hbDcnkGCTJfTLyOR95xIA3PvDzaFmrdAQKFFFbrneYn1jDHn_cZT7FBPGmBKHq80bZPUIRcHgj8tVHEEhW6fl7GREpBtyVO3gNi4IMoARI_OlMJS7ZHvMpD0zzAZJdOg"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#17120F]/85 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white text-xs font-mono">
                                        <div>
                                            <span className="font-bold block text-sm">Flagship Storefront</span>
                                            <span className="text-[#E4D5C1] text-[11px]">Jl. Senopati Raya No. 42</span>
                                        </div>
                                        <span className="px-2.5 py-1 rounded bg-white/15 backdrop-blur-sm w-fit text-[10px]">
                                            Modern Warm Editorial
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div {...reveal(revealRight)} className="md:col-span-5">
                                <span className="text-[#C86D44] font-mono text-xs tracking-widest uppercase block mb-1.5">
                                    03 / Arsitektur &amp; Ruang
                                </span>
                                <h2 className="text-2xl sm:text-4xl md:text-3xl lg:text-4xl font-extrabold text-[#17120F] tracking-tight leading-tight mb-3">
                                    Estetika Minimalis, Energi Dinamis.
                                </h2>
                                <p className="text-[#342822] text-xs sm:text-sm leading-relaxed mb-6">
                                    Memadukan material beton ekspos, kayu jati daur ulang yang hangat, dan pencahayaan
                                    temaram matahari senja. Setiap sudut dirancang untuk kenyamanan interaksi sosial
                                    maupun kesendirian yang produktif.
                                </p>
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {[
                                        ["Area 01", "Barista Bar & Tasting"],
                                        ["Area 02", "Courtyard Outdoor"],
                                        ["Area 03", "WFC Mezzanine Pods"],
                                        ["Area 04", "Valet & Bike Parking"],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="p-4 rounded-xl bg-[#F9F3EB] border border-[#E6DDD2] flex flex-col justify-center min-h-[76px]"
                                        >
                                            <span className="text-[10px] font-mono text-[#C86D44] font-bold block mb-1">{label}</span>
                                            <span className="font-bold text-xs sm:text-sm text-[#17120F] leading-tight">{value}</span>
                                        </div>
                                    ))}
                                </div>
                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    transition={SPRING_GENTLE}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#17120F] hover:bg-[#231B17] text-white text-xs font-bold uppercase tracking-wider transition-colors"
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <span>Buka Rute di Google Maps</span>
                                    <NearMeIcon />
                                </motion.a>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* RESERVASI / LOKASI */}
                <section className="py-14 sm:py-20 bg-[#F9F3EB]/60 border-t border-[#E6DDD2]" id="location">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            {...reveal(revealUp, 0.2)}
                            className="bg-gradient-to-br from-[#F8ECE6]/80 via-[#F9F3EB] to-[#F1E7DA]/90 rounded-2xl sm:rounded-3xl border border-[#E6DDD2] p-5 sm:p-10 md:p-12 shadow-[0_10px_30px_-8px_rgba(35,27,23,0.08)]"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 md:items-center">
                                <div className="md:col-span-7 flex flex-col justify-between">
                                    <span className="text-[#C86D44] font-mono text-xs tracking-widest uppercase block mb-2.5 font-bold">
                                        04 / Kunjungi &amp; Reservasi
                                    </span>
                                    <h2 className="text-2xl sm:text-4xl md:text-3xl lg:text-5xl font-extrabold text-[#17120F] tracking-tight mb-3.5 leading-tight">
                                        Siap untuk cangkir berikutnya?
                                    </h2>
                                    <p className="text-[#342822] text-xs sm:text-sm leading-relaxed mb-6 max-w-lg">
                                        {ADDRESS}. Tersedia valet parking, area indoor ber-AC, dan semi-outdoor garden.
                                    </p>
                                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-[#E6DDD2] max-w-md space-y-3 font-mono text-xs shadow-sm">
                                        <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 text-[#231B17] pb-3 border-b border-[#E6DDD2]/70">
                                            <span className="font-sans font-semibold text-xs text-[#342822]">
                                                Senin — Jumat (WFC)
                                            </span>
                                            <span className="font-bold text-[#C86D44]">10:00 — 00:00 WIB</span>
                                        </div>
                                        <div className="flex flex-wrap justify-between items-center gap-x-3 gap-y-1 text-[#231B17]">
                                            <span className="font-sans font-semibold text-xs text-[#342822]">
                                                Sabtu — Minggu (Brunch)
                                            </span>
                                            <span className="font-bold text-[#C86D44]">08:00 — 23:00 WIB</span>
                                        </div>
                                    </div>
                                </div>

                                <motion.div
                                    {...reveal(revealRight, 0.2)}
                                    className="md:col-span-5 bg-[#17120F] text-white rounded-2xl p-6 sm:p-8 border border-white/10 shadow-[0_10px_30px_-8px_rgba(0,0,0,0.3)]"
                                >
                                    <div className="flex items-center gap-2.5 mb-2.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                        <span className="text-[10px] font-mono tracking-widest text-[#E4D5C1] uppercase font-semibold">
                                            Fast Response Concierge
                                        </span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                                        Reservasi &amp; Order Delivery
                                    </h3>
                                    <p className="text-xs text-[#E4D5C1] leading-relaxed mb-6">
                                        Reservasi meja komunal (&gt; 5 orang) atau tanya ketersediaan langsung via
                                        WhatsApp resmi kedai.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <motion.a
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.97 }}
                                            transition={SPRING_GENTLE}
                                            className="w-full py-3.5 px-5 rounded-xl bg-[#C86D44] hover:bg-[#B55E36] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 transition-colors shadow-sm"
                                            href={waLink("Halo Mr. R Coffee, saya ingin reservasi meja untuk hari ini")}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <ChatIcon />
                                            <span>Hubungi WhatsApp</span>
                                        </motion.a>
                                        <motion.a
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={SPRING_GENTLE}
                                            className="w-full py-3.5 px-5 rounded-xl bg-[#231B17] hover:bg-[#342822] text-[#F1E7DA] border border-white/10 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 transition-colors"
                                            href={`tel:${PHONE_NUMBER}`}
                                        >
                                            <CallIcon />
                                            <span>Telepon Kedai</span>
                                        </motion.a>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <span className="text-[11px] text-[#E4D5C1]/80 font-mono">
                                            Bebas biaya reservasi meja reguler.
                                        </span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* FLOATING CART DRAWER */}
            <AnimatePresence>
                {!drawerDismissed && totalItems > 0 && (
                    <motion.div
                        initial={prefersReducedMotion ? { opacity: 0 } : { y: 100, opacity: 0, scale: 0.92 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { y: 80, opacity: 0, scale: 0.95 }}
                        transition={SPRING_GENTLE}
                        className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 z-50"
                        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
                    >
                        <div className="bg-[#17120F] text-white rounded-2xl p-3 sm:p-4 border border-white/10 shadow-[0_12px_32px_-4px_rgba(0,0,0,0.35)] flex items-center gap-2.5 sm:gap-4 sm:max-w-[92vw] sm:w-auto">
                            <div className="h-10 w-10 bg-[#C86D44] text-white rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0">
                                {totalItems}
                            </div>
                            <div className="font-mono text-xs min-w-0 flex-1 sm:flex-initial">
                                <span className="hidden sm:block text-[#E4D5C1] font-semibold truncate">Keranjang Kamu</span>
                                <span className="text-[#F1E7DA] whitespace-nowrap">Total: {formatRupiah(totalPrice)}</span>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.95 }}
                                transition={SPRING_GENTLE}
                                className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-[#C86D44] hover:bg-[#B55E36] text-white font-mono text-[11px] sm:text-xs font-bold uppercase transition-colors shrink-0 whitespace-nowrap"
                                onClick={() => navigate("/checkout")}
                            >
                                Checkout →
                            </motion.button>
                            <button
                                className="text-[#E4D5C1] hover:text-white transition-colors shrink-0 p-1.5 -m-1.5"
                                onClick={() => setDrawerDismissed(true)}
                                aria-label="Tutup"
                            >
                                <CloseIcon />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FOOTER */}
            <footer className="bg-[#17120F] text-[#E4D5C1] pt-12 sm:pt-16 pb-8 sm:pb-12 border-t border-[#342822]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        {...reveal(revealUp)}
                        className="border-b border-[#342822] pb-8 sm:pb-12 mb-8 sm:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
                    >
                        <div>
                            <span className="text-[#C86D44] font-mono text-xs uppercase tracking-widest block mb-2">
                                MR. R Artisan Collective
                            </span>
                            <p className="text-xl sm:text-4xl lg:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight sm:leading-none">
                                Every cup. Every bite.
                                <br />
                                Every moment matters.
                            </p>
                        </div>
                        <div className="text-xs font-mono text-[#E4D5C1]">
                            <p>Jl. Senopati Raya No. 42, Selong</p>
                            <p className="text-[#C86D44]">Hak Cipta © {new Date().getFullYear()} MR. R Coffee &amp; Eatery</p>
                        </div>
                    </motion.div>

                    <motion.div
                        {...reveal(staggerParent, 0.1)}
                        className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 sm:gap-10 text-xs mb-10"
                    >
                        <motion.div variants={revealUp} className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 text-white font-bold text-base mb-3">
                                <span className="w-6 h-6 rounded bg-[#C86D44] text-white flex items-center justify-center text-xs shrink-0">
                                    R
                                </span>
                                <span>MR. R STUDIO</span>
                            </div>
                            <p className="text-[#E4D5C1] leading-relaxed mb-3 text-xs max-w-sm">
                                Kurasi kopi specialty single origin nusantara dan makanan artisan hangat di jantung
                                Jakarta.
                            </p>
                        </motion.div>

                        <motion.div variants={revealUp}>
                            <h4 className="font-mono text-white text-[11px] tracking-wider uppercase mb-3">Navigasi</h4>
                            <ul className="space-y-2 font-medium">
                                {NAV_LINKS.map((link) => (
                                    <li key={link.href}>
                                        <a className="hover:text-[#C86D44] transition-colors" href={link.href}>
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div variants={revealUp}>
                            <h4 className="font-mono text-white text-[11px] tracking-wider uppercase mb-3">Jaringan</h4>
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <a className="hover:text-[#C86D44] transition-colors inline-flex items-center gap-1" href="#">
                                        Instagram ↗
                                    </a>
                                </li>
                                <li>
                                    <a className="hover:text-[#C86D44] transition-colors inline-flex items-center gap-1" href="#">
                                        TikTok ↗
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-[#C86D44] transition-colors inline-flex items-center gap-1"
                                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        WhatsApp ↗
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="hover:text-[#C86D44] transition-colors inline-flex items-center gap-1"
                                        href="https://maps.google.com"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        Google 4.9★ ↗
                                    </a>
                                </li>
                            </ul>
                        </motion.div>

                        <motion.div variants={revealUp} className="col-span-2 md:col-span-1">
                            <h4 className="font-mono text-white text-[11px] tracking-wider uppercase mb-3">Bantuan Cepat</h4>
                            <p className="text-[#E4D5C1] leading-relaxed mb-2 text-xs">
                                Pertanyaan pesanan atau reservasi meja? Hubungi staf kami langsung.
                            </p>
                            <a
                                href={waLink("Halo Mr. R Coffee, saya ada pertanyaan")}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#C86D44] font-mono font-bold hover:underline inline-flex items-center gap-1 text-xs"
                            >
                                Chat Tim WhatsApp →
                            </a>
                        </motion.div>
                    </motion.div>

                    <div className="pt-6 border-t border-[#231B17] flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#E4D5C1]/80 gap-3 text-center sm:text-left">
                        <div>Designed with Radical Editorial Attitude — Senopati, Jakarta</div>
                        <div className="flex items-center gap-4">
                            <a className="hover:text-[#F1E7DA] transition-colors" href="#">
                                Privacy
                            </a>
                            <a className="hover:text-[#F1E7DA] transition-colors" href="#">
                                Terms
                            </a>
                            <a className="hover:text-[#F1E7DA] transition-colors" href="#">
                                Beans Ethics
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function ProductCard({ product, justAdded, onAdd, onBuy, variants }) {
    const outOfStock = product.stock <= 0

    return (
        <motion.article
            data-card
            variants={variants}
            whileHover={{ y: -4 }}
            transition={SPRING_GENTLE}
            className="group snap-center min-w-[240px] xs:min-w-[260px] sm:min-w-0 bg-white rounded-2xl border border-[#E6DDD2] overflow-hidden shadow-[0_10px_30px_-8px_rgba(35,27,23,0.08)] flex flex-col justify-between shrink-0"
        >
            <div>
                <div className="relative h-40 sm:h-44 md:h-48 w-full overflow-hidden bg-[#F1E7DA]">
                    {product.image ? (
                        <img
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            src={getImageUrl(product.image)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#8c7a6b] font-mono text-xs">
                            No Image
                        </div>
                    )}
                    {product.category?.name && (
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#17120F]/80 backdrop-blur-sm text-white text-[10px] font-mono tracking-wider max-w-[75%] truncate">
                            {product.category.name}
                        </span>
                    )}
                </div>
                <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-sm sm:text-base text-[#17120F] group-hover:text-[#C86D44] transition-colors mb-1.5 leading-snug">
                        {product.name}
                    </h3>
                    {product.description && (
                        <p className="text-xs text-[#342822]/80 leading-relaxed line-clamp-2 min-h-[32px]">
                            {product.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="p-4 sm:p-5 pt-3 flex items-center justify-between border-t border-[#E6DDD2]/60 bg-[#FDFBF7]/60 gap-2">
                <span className="font-mono font-bold text-sm text-[#17120F] whitespace-nowrap">
                    {formatRupiah(product.price)}
                </span>
                {outOfStock ? (
                    <span className="text-[10px] font-mono uppercase text-[#8c7a6b]">Stok habis</span>
                ) : (
                    <div className="flex items-center gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            transition={SPRING_GENTLE}
                            onClick={() => onBuy(product)}
                            className="px-3 py-2 rounded-full border border-[#E6DDD2] text-[#342822] text-[11px] font-bold hover:bg-[#F8ECE6] hover:text-[#C86D44] transition-colors whitespace-nowrap"
                        >
                            Beli
                        </motion.button>
                        <motion.button
                            aria-label={`Tambah ${product.name} ke keranjang`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.92 }}
                            transition={SPRING_GENTLE}
                            onClick={() => onAdd(product)}
                            className="w-10 h-10 rounded-full bg-[#F9F3EB] text-[#231B17] hover:bg-[#C86D44] hover:text-white active:scale-95 transition-colors flex items-center justify-center shadow-sm shrink-0"
                        >
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={justAdded ? "check" : "plus"}
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.6 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center justify-center"
                                >
                                    {justAdded ? <CheckIcon /> : <PlusIcon />}
                                </motion.span>
                            </AnimatePresence>
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.article>
    )
}

function SpecRow({ label, value, valueClass = "text-white" }) {
    return (
        <div className="py-2.5 flex flex-wrap justify-between items-center gap-x-3 gap-y-1">
            <dt className="text-[#E4D5C1]/70 text-[11px]">{label}</dt>
            <dd className={`font-semibold text-right ${valueClass}`}>{value}</dd>
        </div>
    )
}

// ---------------------------------------------------------------------------
// Inline icons
// ---------------------------------------------------------------------------
function ArrowLeftIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
    )
}
function ArrowRightIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
    )
}
function PlusIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    )
}
function CheckIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 6L9 17l-5-5" />
        </svg>
    )
}
function NearMeIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
    )
}
function ChatIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
        </svg>
    )
}
function CallIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
        </svg>
    )
}
function CloseIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6L6 18M6 6l12 12" />
        </svg>
    )
}