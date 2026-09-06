import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Galery — "Atelier Roast" editorial gallery design.
 *
 * Note: the source design also included its own top marquee ticker and a
 * bottom mobile tab bar (Home/Menu/Gallery/Pesanan/More). Both were left out
 * here because the site's shared <Navbar /> already renders a ticker + nav
 * on every page — including both would visually clash and duplicate
 * navigation. Everything from the "Archive" header down is included.
 *
 * For a closer match to the original type system, you can optionally add
 * "Epilogue" to your Google Fonts link in index.html:
 *   family=Epilogue:wght@400;500;600;700
 * It falls back to the default sans font if not loaded.
 */

const categories = [
    { id: "semua", label: "Semua (7)" },
    { id: "ruang", label: "Ruang & Arsitektur" },
    { id: "seduhan", label: "Seduhan Barista" },
    { id: "fresh-bakes", label: "Fresh Bakes" },
    { id: "komunitas", label: "Momen Komunitas" },
]

const photos = [
    {
        id: 1,
        number: "01",
        tag: "BARISTA BAR",
        category: "seduhan",
        overlayLabel: "07:45 AM • LIVE EXTRACTION",
        title: "Ritual Seduhan & Presisi Tuang",
        author: "@dimas.visuals",
        hashtag: "#SenopatiMoments",
        desc: "Barista meracik signature flat white dengan espresso blend Senopati Batch #042 pada mesin espresso kustom bernuansa raw bronze.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBxLNT8Fgl73KaKYi8UStGG0_oeW1jVnOMrksX2eTjVEXf4k4wSCuCQKUlhr8AKVoy9YVMtsPRCIeWWufzOlLhqMy1RcMhAsGU2JUjc-uiS1pRmVutbdlc1ZBNXeOPY4vl2bQblvlSlZO8mgiUT3SlqHQkPOpKup0BaMatSc3Avx3y5o1QHs3kAV5r_IAoNt0nrqQJtIXnEespnR0WZvpgtyrJ31DcEWDLjxLH_FCvIg0orpMcMOyNI",
        span: true,
    },
    {
        id: 2,
        number: "02",
        tag: "RUANG",
        category: "ruang",
        overlayLabel: "COURTYARD INDOOR",
        title: "Ketenangan di Bawah Skylight",
        author: "@senopati.lens",
        hashtag: "#ArsitekturKopi",
        desc: "Ruang duduk komunal dengan pencahayaan alami skylight, dipenuhi tetumbuhan monstera dan bangku kayu jati daur ulang.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDsWNaNq6a2mSUs6vYLLwBPKCYBApQi_-o4PzDX2vmszWEjjC6T_-JypDFDgOTYm6tyjIawVr-hZaDAfynCkStIZ2UHvWnmGoUkI2NlS750IJZxUF8PUC0mckWUj-qh3uXXiU6PKFjA8db_CVqp5MYPFvsTLHHgittja8RPtTOyDoVroidCyR6Gy0txa4PzaRFQneqBAHyiDxK3laDkv7BiWuk-ki4fD2OhdtGiBDo59bKs0kA36zj1",
    },
    {
        id: 3,
        number: "03",
        tag: "BAKES",
        category: "fresh-bakes",
        overlayLabel: "06:00 AM BATCH",
        title: "Kerenyahan Mentega Murni",
        author: "@pastry.chronicles",
        hashtag: "#FreshFromOven",
        desc: "Dua kali pemanggangan setiap hari pada 06:00 dan 14:00 WIB menggunakan 100% mentega murni Prancis.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBy68OmlcKR7mglKqnoIKA6Zj2WTi2ffn5telvqIwhpyliJAi-1yXvcK0AbUtd-Pv-O_2IlvLYKlPoXDA_qOXALKqEaWUjyiS7QPAd7w3BKiEsnWXsMG_Sm8Js8r97JQdV3FraIw2PIee42qYuLLYQyUXt8HRLrzfTLWDAYd5RbVLLyHfuo-4jIFpE6mhOpmE_zVuIAa3VVB5ebnx-Jqb6L0bteqhRUmXD6saBo44mYjrrfC4iwBkYc",
    },
    {
        id: 4,
        number: "04",
        tag: "PODS",
        category: "ruang",
        overlayLabel: "RUANG FOKUS",
        title: "Sudut Tenang Ide Mengalir",
        author: "@kopi.dan.ruang",
        hashtag: "#WFCSenopati",
        desc: "Lantai dua dirancang kedap hiruk pikuk jalanan, menyediakan colokan tiap meja, koneksi 100 Mbps, dan pencahayaan temaram hangat.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBcxSTpSjXDsQYOTmRydQLZLmqfQn9IIZjVRmEjO6uZSV82NNMDX1vUSlFG26_lOakIhKlYZ7od7QEI72chR7iYG5F5BSRDaX5tWJ9WZKqXRhrYYBra4pHbdoPNUAIN_ItNF8j2726UxqtvjxQ-tyQoG4CBw3N41_L3uSZFQTvJlCkJynoBqW5yMZ-_4zNYe7VlBZQYxA479ANDFtOu78CW9jEJSJmrMDK9bOoTNrr1GaEkcCF9BJBS",
    },
    {
        id: 5,
        number: "05",
        tag: "SLOW BAR",
        category: "seduhan",
        overlayLabel: "GAYO WINE MICROLOT",
        title: "Sabar Menanti Tiap Tetesan",
        author: "@baristajournal",
        hashtag: "#SlowBarExperience",
        desc: "Ekstraksi manual lambat dengan rasio presisi 1:15 untuk menonjolkan profil aroma buah anggur fermentasi dan karamel halus.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDA_6pj2OyB1gv_Z9VYfmpz3GF2M3s8J3v58u8zKFtMOqmgF8oeKYO-rWePU4vaeiA0BxURHADwxesH7eauFJmis96grEi8oD9PwOCoQFfK18UfARZKWIOl8Y2xKwusCr-9I1UR0sAP_3YYRnnnrcP_lJupThCefLd3obOVtgE4I1ZoFV7cQvgPSmYgUQltaGq1HQnv9TPM0lgQVDHhz0SVgGSJb91uGH66lODxN2fmpSvNf1kXg3EZ",
    },
    {
        id: 6,
        number: "06",
        tag: "KULINER",
        category: "komunitas",
        overlayLabel: "DAPUR SANTAI",
        title: "Santapan Teman Berbincang",
        author: "@tastemaker.jkt",
        hashtag: "#BrunchAtMRR",
        desc: "Roti sourdough panggang lokal dipadukan dengan alpukat mentega, telur omega rebus lembut, dan taburan rempah dukkah gurih.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBzfjC7vsQ2N3p6ZSyOF7BhMG2fR_xBoaoyn5w6oIJL7Y3ktumApMXUdEG_IR8wU54ZXLIhVaV61SUDJRs5yooraGVRWaqH9PVYUWtHAHde-I6Fzn8gX0im41x2aXjDWqGFkEWD1qCtkK3GVKdKCyjzZJMPBxn_NNyZOipcSzVTrpknz0g6dvc9ZKu18wkhM7B5EUC4w2cM6hULJvN30DqZW3pj5yNHXp299OnLJokIMozyD8x7lXY5",
    },
    {
        id: 7,
        number: "07",
        tag: "FASAD LUAR",
        category: "ruang",
        overlayLabel: "18:30 WIB • BLUE HOUR TWILIGHT",
        title: "Kehangatan Petang Senopati Raya",
        author: "@urban.jakarta",
        hashtag: "#SenopatiAfterHours",
        desc: "Saat petang menjemput, lampu gantung amber menyala menerangi fasad beton ekspos dan deretan kursi teras pinggir jalan Senopati Raya.",
        image:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuB8ENXuL7hm4xY3ZZYuaj-1yrVYffhuPyEZo9YRD9NQQDYMtQOSCfv0T_UKSsY7U28HXHQ5MMZDZoDbQwek3S3kkc_DjBrtk3XxR4zzDCI-m5AGBoRzpi0PPiiq3lLfC4h2FNgFvnH6qmW6U4RbZIl96uJq3kGqPAdyOY5VWCaaF2vzKzzLneKfiRQJ-trNQYq1wxz7ZWQ8fJAPrqtWOLl8YorNGC13yfAX74tcayE7IIiY1QUldnzO",
        span: true,
    },
]

function Galery() {
    const [activeCategory, setActiveCategory] = useState("semua")
    const [selectedPhoto, setSelectedPhoto] = useState(null)
    const [likedIds, setLikedIds] = useState(new Set())

    const filtered = useMemo(
        () => (activeCategory === "semua" ? photos : photos.filter((p) => p.category === activeCategory)),
        [activeCategory]
    )

    function toggleLike(id) {
        setLikedIds((prev) => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <section className="min-h-screen bg-[#faf8f5] text-[#2c221e]">
            {/* Editorial Header */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col gap-1.5"
                >
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-block px-2.5 py-1 bg-[#2c221e] text-[#faf8f5] text-[11px] font-bold tracking-widest uppercase rounded">
                            ARCHIVE VOL. 02 • VISUAL JOURNAL
                        </span>
                        <span className="text-[11px] text-[#c86d44] uppercase font-bold tracking-wider">
                            {photos.length} ENTRIES
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-[#2c221e] mt-2 leading-[1.1]">
                        Suasana, Seduhan &amp; <span className="italic font-normal text-[#c86d44]">Detil Ruang.</span>
                    </h1>
                    <p className="text-sm md:text-base text-[#6b5f57] max-w-xl mt-1">
                        Dokumentasi visual ritme harian Mr. R Coffee &amp; Eatery. Dari uap cangkir pertama fajar
                        hingga kehangatan diskusi temaram di sudut Senopati.
                    </p>
                </motion.div>

                {/* Filter chips */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-4 mt-2 -mx-1 px-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all ${
                                activeCategory === cat.id
                                    ? "bg-[#2c221e] text-[#faf8f5] shadow-sm"
                                    : "bg-[#f3ede5] text-[#6b5f57] hover:bg-[#e9e1d6]"
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Masonry-ish editorial grid */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {filtered.length === 0 ? (
                    <div className="py-16 flex flex-col items-center text-center">
                        <div className="w-16 h-16 rounded-full bg-[#f3ede5] flex items-center justify-center text-[#c86d44] mb-3 text-2xl">
                            📷
                        </div>
                        <h3 className="text-lg font-semibold text-[#2c221e]">Belum Ada Arsip di Kategori Ini</h3>
                        <p className="text-sm text-[#6b5f57] max-w-xs mt-1">
                            Kami terus memperbarui potret suasana mingguan kedai.
                        </p>
                        <button
                            onClick={() => setActiveCategory("semua")}
                            className="mt-4 px-4 py-2 bg-[#2c221e] text-[#faf8f5] text-sm font-semibold rounded-xl"
                        >
                            Lihat Semua Potret
                        </button>
                    </div>
                ) : (
                    <motion.div
                        key={activeCategory}
                        initial="hidden"
                        animate="show"
                        variants={{ show: { transition: { staggerChildren: 0.06 } } }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >
                        {filtered.map((photo) => (
                            <motion.article
                                key={photo.id}
                                variants={{
                                    hidden: { opacity: 0, y: 24 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                onClick={() => setSelectedPhoto(photo)}
                                className={`group relative bg-white rounded-2xl p-3 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col cursor-pointer ${
                                    photo.span ? "md:col-span-2" : ""
                                }`}
                            >
                                <div
                                    className={`relative w-full rounded-xl overflow-hidden bg-[#f3ede5] ${
                                        photo.span ? "h-72 md:h-96" : "h-64"
                                    }`}
                                >
                                    <img
                                        src={photo.image}
                                        alt={photo.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#2c221e]/80 via-transparent to-transparent" />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-full text-[11px] text-[#2c221e] uppercase tracking-wider font-semibold">
                                            {photo.number} • {photo.tag}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between gap-2">
                                        <div className="min-w-0">
                                            <span className="block text-[11px] text-[#ffb597] uppercase tracking-widest font-semibold">
                                                {photo.overlayLabel}
                                            </span>
                                            <h3 className="text-base font-semibold truncate">{photo.title}</h3>
                                        </div>
                                        <span className="w-9 h-9 rounded-full bg-white/90 text-[#2c221e] flex items-center justify-center shrink-0 group-hover:bg-[#c86d44] group-hover:text-white transition-colors text-sm">
                                            ⤢
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-1 pt-3 text-[13px] text-[#6b5f57]">
                                    <span>
                                        Oleh <strong className="text-[#2c221e]">{photo.author}</strong>
                                    </span>
                                    <span className="text-[#c86d44] font-semibold">{photo.hashtag}</span>
                                </div>
                            </motion.article>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Instagram community CTA */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
                <div className="bg-[#2c221e] text-[#faf8f5] rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-lg">
                    <div className="relative z-10 flex flex-col gap-2 max-w-lg">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#c86d44] animate-pulse" />
                            <span className="text-[11px] uppercase tracking-widest text-[#ffb597] font-bold">
                                KURASI KOMUNITAS
                            </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-semibold leading-tight">
                            Punya Momen Hangat di Mr. R?
                        </h3>
                        <p className="text-sm text-stone-300">
                            Unggah potret estetika Anda dengan tagar <strong className="text-white">#SenopatiMoments</strong>{" "}
                            &amp; mention <strong className="text-[#ffb597]">@mrr.coffee.eatery</strong>. Foto terpilih
                            akan masuk cetak visual zine bulanan kami dan mendapat secangkir kopi gratis.
                        </p>
                        <div className="pt-2 flex flex-wrap gap-3 items-center">
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-[#c86d44] text-white px-5 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-[#b85e37] transition-all active:scale-95"
                            >
                                📷 Buka Instagram Kedai
                            </a>
                            <span className="text-white/70 text-xs">@mrr.coffee.eatery • Diperbarui Tiap Jumat</span>
                        </div>
                    </div>
                    <span className="absolute -right-6 -bottom-8 text-[150px] opacity-10 pointer-events-none select-none">
                        ☕
                    </span>
                </div>
            </div>

            {/* Lightbox modal */}
            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-[#2c221e]/80 backdrop-blur-md flex items-center justify-center p-4"
                        onClick={() => setSelectedPhoto(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="relative w-full h-64 bg-[#f3ede5]">
                                <img
                                    src={selectedPhoto.image}
                                    alt={selectedPhoto.title}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    onClick={() => setSelectedPhoto(null)}
                                    aria-label="Tutup"
                                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-[#2c221e]/70 text-white flex items-center justify-center active:scale-90 transition-transform"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="p-5 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[#c86d44] font-bold uppercase tracking-wider text-xs">
                                        {selectedPhoto.hashtag}
                                    </span>
                                    <span className="text-[#6b5f57] text-sm">{selectedPhoto.author}</span>
                                </div>
                                <h4 className="text-xl font-semibold text-[#2c221e]">{selectedPhoto.title}</h4>
                                <p className="text-sm text-[#6b5f57]">{selectedPhoto.desc}</p>
                                <div className="pt-3 flex justify-between items-center">
                                    <button
                                        onClick={() => toggleLike(selectedPhoto.id)}
                                        className="flex items-center gap-1.5 text-[#c86d44] hover:text-[#b85e37] text-sm font-semibold"
                                    >
                                        <span>{likedIds.has(selectedPhoto.id) ? "❤️" : "🤍"}</span>
                                        <span>{142 + (likedIds.has(selectedPhoto.id) ? 1 : 0)} Disukai</span>
                                    </button>
                                    <button
                                        onClick={() => setSelectedPhoto(null)}
                                        className="px-4 py-2 bg-[#f3ede5] text-[#2c221e] text-sm font-semibold rounded-xl hover:bg-[#e9e1d6] transition-colors"
                                    >
                                        Tutup Pratinjau
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Galery