import { useState } from "react"
import { motion } from "framer-motion"

/**
 * Location / "Lokasi" page — new page for the Navbar's "Location" link.
 *
 * Note: the source design also included its own top bar and bottom mobile
 * tab bar. Both were left out because the site's shared <Navbar /> already
 * renders a ticker + nav on every page. Everything from the editorial
 * header down is included, restyled with the site's own accent colors
 * (#16120e / #ff6239 / #feb47b / #ffd56b).
 */

const ADDRESS = "Jl. Tegal Parang Sel. No.63, RT.7/RW.5, Tegal Parang, Kec. Mampang Prpt., Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12790"
const WHATSAPP_NUMBER = "6281317381863"
const COORDS_LABEL = "-6.244244° S, 106.831688° E"

const amenities = [
    {
        icon: "🛵",
        title: "Valet & Dedicated Bike Parking",
        tag: "Gratis",
        desc: "Area parkir sepeda roadbike indoor dengan klem pengaman & valet mobil gratis khusus pelanggan cafe.",
    },
    {
        icon: "📶",
        title: "High-Speed Fiber Internet",
        tag: "100 Mbps",
        desc: "Jaringan redundan dedicated dual-ISP, jangkauan stabil untuk virtual meeting dan upload berkas besar.",
    },
    {
        icon: "🔌",
        title: "40+ Colokan Mezzanine Pods",
        tag: "Ergonomis",
        desc: "Setiap meja kerja dilengkapi colokan individual universal plus Type-C fast charging port.",
    },
    {
        icon: "🐾",
        title: "Courtyard & Pet-Friendly Garden",
        tag: "Semi-Outdoor",
        desc: "Taman rindang berangin alami untuk bersantai bersama anjing/kucing peliharaan dan area merokok terpisah.",
    },
    {
        icon: "🕌",
        title: "Musholla & Clean Restroom",
        tag: null,
        desc: "Ruang ibadah bersih ber-AC terpisah pria/wanita dengan sarung, mukena bersih, serta wudhu tertata rapi.",
    },
]

const tabs = [
    { id: "overview", label: "Ringkasan & Jam" },
    { id: "amenities", label: "Fasilitas & Ruang" },
    { id: "navigation", label: "Arah & Navigasi" },
]

function LocationPage() {
    const [activeTab, setActiveTab] = useState("overview")
    const [copied, setCopied] = useState(false)

    function copyAddress() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(ADDRESS)
        }
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const LAT = -6.244244201276409
    const LNG = 106.83168800051145
    const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${LAT},${LNG}`
    const wazeUrl = `https://waze.com/ul?ll=${LAT},${LNG}&navigate=yes`

    return (
        <section className="min-h-screen bg-[#faf8f5] text-[#16120e]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-12 flex flex-col gap-5">
                {/* Editorial header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="bg-[#ffd56b] text-[#16120e] px-2 py-0.5 rounded-full font-mono text-[11px] tracking-wider uppercase font-bold">
                            BATCH #042 ARCHIVE
                        </span>
                        <span className="flex items-center gap-1.5 text-stone-500 font-mono text-[11px] uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff6239] animate-ping" />
                            LIVE GPS SYNC
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#16120e]">
                        Kunjungi Mampang Sanctuary
                    </h1>
                    <p className="text-sm md:text-base text-stone-600">
                        Ruang temu rasa, arsitektur hangat, dan seduhan artisanal di jantung Jakarta Selatan.
                    </p>
                </motion.div>

                {/* Hero image */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
                    <div className="relative w-full rounded-2xl overflow-hidden shadow-md bg-[#16120e] h-64">
                        <img
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeE_AXGW_HJPkc1Tum2aH6AwhcXltyDCejoe0N3ObtfCgjYMfCE3A7F3VJBmax1w20FIgxQ7iQLMv5lA827MV_KuWPucsN0Ico-zaoIT2WhkJClEWjpYQ1z0-L-KjB-J6nIuqDQOVwm1VkZTav8i75GOfNYUqykYsQW2WcnisXfltB0LAVrOzTfL3UkwQkhTgImODQKnF8iacFAbVE5pWH2EX_gTbeND3GtlibLz-57ltnNJCbBMHj"
                            alt="Storefront Mr. R Coffee"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#16120e]/85 via-[#16120e]/15 to-transparent flex flex-col justify-end p-4">
                            <div className="flex items-center justify-between">
                                <span className="px-2.5 py-1 rounded-full bg-[#faf8f5]/90 backdrop-blur-md text-[#16120e] text-[11px] font-semibold flex items-center gap-1.5 shadow-sm">
                                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                                    Kedai Terbuka • Tutup 23:00 WIB
                                </span>
                                <span className="text-[#faf8f5] text-[11px] bg-[#16120e]/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                    Flagship Atelier
                                </span>
                            </div>
                            <p className="text-[#faf8f5] font-bold text-lg mt-2 leading-tight">Jl. Tegal Parang Selatan No. 63</p>
                        </div>
                    </div>
                </motion.div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all active:scale-95 whitespace-nowrap ${
                                activeTab === tab.id ? "bg-[#16120e] text-[#faf8f5]" : "bg-[#f3ede5] text-stone-600"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab: Overview */}
                {activeTab === "overview" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
                        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-[#ff6239]/10 flex items-center justify-center text-lg">
                                        🕐
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-[#16120e]">Jam Operasional</h2>
                                        <p className="text-[11px] text-stone-500 uppercase tracking-wider">
                                            Mampang Sanctuary Schedule
                                        </p>
                                    </div>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-[#f3ede5] text-stone-500 text-[11px]">
                                    WIB (GMT+7)
                                </span>
                            </div>

                            <div className="flex flex-col gap-2">
                                <div className="p-3 rounded-xl bg-[#faf8f5] flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-[#16120e] flex items-center gap-1.5">
                                            💻 Senin s/d Jumat
                                        </span>
                                        <span className="text-[11px] font-bold text-[#ff6239] px-2 py-0.5 rounded-full bg-[#feb47b]/30">
                                            WFC Friendly
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between mt-0.5">
                                        <span className="text-xs text-stone-500">Optimal Focus &amp; High-speed WiFi</span>
                                        <span className="font-bold text-[#16120e]">10:00 — 00:00</span>
                                    </div>
                                </div>
                                <div className="p-3 rounded-xl bg-[#faf8f5] flex flex-col gap-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-semibold text-[#16120e] flex items-center gap-1.5">
                                            🥐 Sabtu s/d Minggu
                                        </span>
                                        <span className="text-[11px] font-bold text-[#ff6239] px-2 py-0.5 rounded-full bg-[#feb47b]/30">
                                            Weekend Brunch
                                        </span>
                                    </div>
                                    <div className="flex items-baseline justify-between mt-0.5">
                                        <span className="text-xs text-stone-500">Morning Bakes &amp; Slow Drip Live Session</span>
                                        <span className="font-bold text-[#16120e]">08:00 — 23:00</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#f3ede5] text-stone-600 text-xs">
                                <span>ℹ️</span>
                                <span>Kitchen closing order: 45 menit sebelum kedai tutup.</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#ff6239]/10 flex items-center justify-center text-lg">
                                    📍
                                </div>
                                <div>
                                    <h2 className="font-bold text-[#16120e]">Titik Presisi Lokasi</h2>
                                    <p className="text-[11px] text-stone-500 uppercase tracking-wider">Coordinates &amp; Landmark</p>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-[#faf8f5] flex flex-col gap-1.5">
                                <p className="text-sm font-medium text-[#16120e]">{ADDRESS}</p>
                                <p className="text-xs text-stone-500 flex items-center gap-1">
                                    🧭 Patokan: sekitar Mampang Prapatan, dekat Jl. Rasuna Said.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1">
                                <button
                                    onClick={copyAddress}
                                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#f3ede5] text-[#16120e] text-sm font-semibold active:scale-95 transition-all"
                                >
                                    <span>📋</span>
                                    <span>{copied ? "Tersalin!" : "Salin Alamat"}</span>
                                </button>
                                <a
                                    href={mapsSearchUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#16120e] text-[#faf8f5] text-sm font-semibold active:scale-95 transition-all"
                                >
                                    <span>🧭</span>
                                    <span>Panduan Rute</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Tab: Amenities */}
                {activeTab === "amenities" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-bold text-[#16120e]">Kenyamanan &amp; Fasilitas</h2>
                                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Dirancang untuk Fokus &amp; Rehat</p>
                            </div>
                            <span className="text-[#ff6239] text-[11px] font-bold bg-[#feb47b]/30 px-2 py-0.5 rounded-full">
                                {amenities.length} Area Khusus
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">
                            {amenities.map((a) => (
                                <div key={a.title} className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8f5]">
                                    <div className="w-10 h-10 rounded-full bg-[#feb47b]/30 flex items-center justify-center text-lg shrink-0">
                                        {a.icon}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-sm font-semibold text-[#16120e]">{a.title}</h3>
                                            {a.tag && (
                                                <span className="text-[10px] text-[#ff6239] uppercase font-bold">{a.tag}</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-stone-500 mt-0.5">{a.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Tab: Navigation */}
                {activeTab === "navigation" && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-4 md:p-5 shadow-sm flex flex-col gap-3">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                            <div>
                                <h2 className="font-bold text-[#16120e]">Navigasi Peta Interaktif</h2>
                                <p className="text-[11px] text-stone-500 uppercase tracking-wider">Mampang Flagship Hub</p>
                            </div>
                            <span className="text-[#ff6239] text-[11px] font-bold flex items-center gap-1">
                                🛰️ {COORDS_LABEL}
                            </span>
                        </div>

                        <div className="relative w-full h-52 rounded-xl overflow-hidden bg-[#f3ede5]">
                            <div className="absolute inset-0 bg-[#16120e]/10" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                                <div className="relative flex items-center justify-center">
                                    <div className="w-10 h-10 rounded-full bg-[#ff6239]/30 animate-ping absolute" />
                                    <div className="w-9 h-9 rounded-full bg-[#16120e] text-[#faf8f5] shadow-xl flex items-center justify-center relative border-2 border-[#faf8f5]">
                                        ☕
                                    </div>
                                </div>
                                <span className="mt-1 px-2.5 py-0.5 rounded-full bg-[#16120e] text-[#faf8f5] text-[11px] font-bold shadow-md">
                                    MR. R MAMPANG
                                </span>
                            </div>
                            <div className="absolute bottom-2 right-2 bg-[#faf8f5]/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-[#16120e]">
                                Traffic: Normal
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-1">
                            <a
                                href={mapsSearchUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#16120e] text-[#faf8f5] active:scale-[0.98] transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-lg">🗺️</span>
                                    <div className="flex flex-col text-left">
                                        <span className="font-semibold leading-tight">Buka Rute di Google Maps</span>
                                        <span className="text-xs text-stone-300 leading-tight">Navigasi turn-by-turn langsung</span>
                                    </div>
                                </div>
                                <span>→</span>
                            </a>
                            <div className="grid grid-cols-2 gap-2">
                                <a
                                    href={wazeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f3ede5] text-[#16120e] text-sm font-semibold active:scale-95 transition-all"
                                >
                                    <span>↪️</span>
                                    <span>Buka di Waze</span>
                                </a>
                                <a
                                    href="https://www.gojek.com/en-id/gofood/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#f3ede5] text-[#16120e] text-sm font-semibold active:scale-95 transition-all"
                                >
                                    <span>🛵</span>
                                    <span>Grab / Gojek</span>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Community table CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 md:p-5 rounded-2xl bg-[#ffd56b] flex flex-col gap-2"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <span className="text-[11px] uppercase font-bold tracking-wider text-[#ff6239]">
                                Meja Komunal &amp; Acara
                            </span>
                            <h3 className="text-lg font-bold text-[#16120e]">Rencana Datang Beramai-ramai?</h3>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#16120e] text-[#faf8f5] flex items-center justify-center shrink-0">
                            👥
                        </div>
                    </div>
                    <p className="text-sm text-[#16120e]/80">
                        Tersedia ruang komunal mezzanine privat untuk meeting studio, podcast, book club, atau perayaan
                        hangat (kapasitas 6–18 orang).
                    </p>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                            "Halo Mr. R Coffee, saya ingin reservasi meja komunal."
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full mt-1 py-3 px-4 rounded-xl bg-[#16120e] text-[#faf8f5] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-sm"
                    >
                        <span>💬</span>
                        <span>Reservasi Meja Komunal via WhatsApp</span>
                    </a>
                </motion.div>

                <div className="pt-2 pb-2 flex flex-col items-center text-center gap-1">
                    <p className="text-[11px] text-stone-500 uppercase tracking-widest">
                        MR. R ARTISAN ROASTERY • BATCH #042
                    </p>
                    <p className="text-sm text-stone-400 italic">Setiap cangkir, setiap gigitan, setiap detik berarti.</p>
                </div>
            </div>
        </section>
    )
}

export default LocationPage